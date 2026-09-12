import { computeProgram } from '../../../lib/routing-engine';
import { buildGameplanPdf } from '../../../lib/pdf-gameplan-new';
import { buildInternalPlanPdf } from '../../../lib/pdf-internal-plan';
import { buildStudentPlanPdf } from '../../../lib/pdf-student-plan';
import { createStudentTracker } from '../../../lib/google-sheets';
import { generateGameplanNarratives } from '../../../lib/gameplan-rules';

export const maxDuration = 120;

export async function POST(request) {
  const encoder = new TextEncoder();
  function line(controller, obj) {
    controller.enqueue(encoder.encode(JSON.stringify(obj) + '\n'));
  }

  const stream = new ReadableStream({
    async start(controller) {
      try {
        let body;
        try { body = await request.json(); }
        catch { line(controller, { status: 'error', error: 'Invalid request body.' }); return; }

        const { studentData, diagnosticEntries } = body;

        const missing = [];
        if (!studentData?.studentName) missing.push('studentName');
        if (!studentData?.baselineScore) missing.push('baselineScore');
        if (!studentData?.targetScore) missing.push('targetScore');
        if (!diagnosticEntries || diagnosticEntries.length === 0) missing.push('diagnosticEntries');
        if (missing.length > 0) {
          line(controller, { status: 'error', error: `Missing required fields: ${missing.join(', ')}` });
          return;
        }

        // Step 1: Routing engine
        line(controller, { status: 'generating', message: 'Computing topic sequence from diagnostic…' });
        const routingResult = computeProgram(diagnosticEntries, {
          baselineScore:    parseInt(studentData.baselineScore, 10),
          targetScore:      parseInt(studentData.targetScore, 10),
          sessionFrequency: studentData.sessionFrequency || '2x',
          blanks:           parseInt(studentData.blanks || 0, 10),
        });
        line(controller, {
          status: 'routing_complete',
          message: `Routing complete — ${routingResult.programSummary.topicsToTeach} topics, ${routingResult.programSummary.totalSessionsNeeded} sessions, ${routingResult.programSummary.weeksNeeded} weeks`,
          programSummary: routingResult.programSummary,
        });

        // Step 2: Rule-based narratives (no Claude API call)
        line(controller, { status: 'generating', message: 'Generating rule-based narratives…' });
        const narratives = generateGameplanNarratives(studentData, routingResult);

        // Step 3: Build all three PDFs in parallel
        line(controller, { status: 'building', message: 'Building PDFs (gameplan, internal brief, student plan)…' });
        let gameplanBuffer, internalBuffer, studentBuffer;
        try {
          [gameplanBuffer, internalBuffer, studentBuffer] = await Promise.all([
            buildGameplanPdf(studentData, routingResult, narratives),
            buildInternalPlanPdf(studentData, routingResult),
            buildStudentPlanPdf(studentData, routingResult),
          ]);
        } catch (err) {
          line(controller, { status: 'error', error: `PDF build error: ${err.message}` });
          return;
        }

        // Step 4: Create Google Sheet tracker
        line(controller, { status: 'building', message: 'Creating Mastery Tracker Google Sheet…' });
        let trackerUrl = null;
        try {
          trackerUrl = await createStudentTracker(studentData, routingResult.topicSequence);
        } catch (err) {
          console.warn('[generate] Tracker creation failed:', err?.message);
        }

        // Step 5: Return results
        line(controller, {
          status: 'done',
          gameplanBase64:      Buffer.from(gameplanBuffer).toString('base64'),
          internalPlanBase64:  Buffer.from(internalBuffer).toString('base64'),
          studentPlanBase64:   Buffer.from(studentBuffer).toString('base64'),
          trackerUrl:          trackerUrl || null,
          studentName:         studentData.studentName,
          programSummary:      routingResult.programSummary,
        });

      } catch (err) {
        try { line(controller, { status: 'error', error: `Unexpected error: ${err?.message ?? String(err)}` }); } catch {}
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    },
  });
}
