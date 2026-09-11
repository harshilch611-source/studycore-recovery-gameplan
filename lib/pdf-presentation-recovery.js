import PptxGenJS from 'pptxgenjs';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium-min';

const RISK_COLORS = {
  Green: '#27AE60',
  Yellow: '#D4740E',
  Red: '#C0392B',
};

/**
 * Build HTML for recovery presentation (Puppeteer → PDF)
 */
function buildRecoveryPresentationHtml(recoveryPlan, studentData, studentName) {
  const {
    riskLevel,
    scoreProgressionAnalysis,
    hoursAnalysis,
    domainAnalysis,
    engagementAssessment,
    tutorAssessment,
    recoveryPlan: plan,
    escalationTriggers,
  } = recoveryPlan;

  const pointsPercentage =
    (scoreProgressionAnalysis.pointsGained /
      (scoreProgressionAnalysis.pointsGained + scoreProgressionAnalysis.pointsStillNeeded)) *
      100 || 0;
  const hoursPercentage =
    (hoursAnalysis.totalUsed / hoursAnalysis.totalPurchased) * 100 || 0;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; background: #f5f5f5; }
    .slide { width: 960px; height: 540px; margin: 0 auto 20px; page-break-after: always; position: relative; }
    .slide-title { background: linear-gradient(135deg, #1B365D 0%, #2E75B6 100%); color: white; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; }
    .slide-title h1 { font-size: 48px; margin-bottom: 10px; }
    .slide-title .subtitle { font-size: 24px; opacity: 0.9; }
    .slide-content { background: white; padding: 40px; height: 100%; overflow: hidden; }
    .slide-content h2 { font-size: 32px; color: #1B365D; margin-bottom: 20px; border-bottom: 3px solid #2E75B6; padding-bottom: 10px; }
    .risk-badge { display: inline-block; background: ${RISK_COLORS[riskLevel]}; color: white; padding: 8px 16px; border-radius: 4px; font-weight: bold; margin-top: 10px; }
    .content-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 20px; }
    .metric { background: #f9f9f9; padding: 15px; border-left: 4px solid #2E75B6; }
    .metric-label { font-size: 12px; color: #666; font-weight: bold; text-transform: uppercase; }
    .metric-value { font-size: 28px; color: #1B365D; font-weight: bold; margin-top: 5px; }
    .metric.critical { border-left-color: #C0392B; }
    .metric.warning { border-left-color: #D4740E; }
    .metric.good { border-left-color: #27AE60; }
    .bullet-list { margin-top: 15px; }
    .bullet-list li { margin-bottom: 10px; line-height: 1.4; }
    .table-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
    .table-row-head { font-weight: bold; background: #f5f5f5; padding: 10px; }
    .full-width { grid-column: 1 / -1; }
    .status-ok { color: #27AE60; font-weight: bold; }
    .status-warning { color: #D4740E; font-weight: bold; }
    .status-critical { color: #C0392B; font-weight: bold; }
    .progress-bar { height: 20px; background: #eee; border-radius: 10px; overflow: hidden; margin: 10px 0; }
    .progress-fill { height: 100%; background: #2E75B6; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: bold; }
  </style>
</head>
<body>
  <!-- Slide 1: Title -->
  <div class="slide slide-title">
    <h1>${studentName}</h1>
    <div class="subtitle">Recovery Gameplan</div>
    <div class="risk-badge">${riskLevel} Risk</div>
  </div>

  <!-- Slide 2: Score Progress -->
  <div class="slide slide-content">
    <h2>Score Progress</h2>
    <div class="content-grid">
      <div class="metric">
        <div class="metric-label">Baseline</div>
        <div class="metric-value">${scoreProgressionAnalysis.baseline}</div>
      </div>
      <div class="metric">
        <div class="metric-label">Target</div>
        <div class="metric-value">${scoreProgressionAnalysis.targetScore}</div>
      </div>
      <div class="metric">
        <div class="metric-label">Points Gained</div>
        <div class="metric-value">+${scoreProgressionAnalysis.pointsGained}</div>
      </div>
      <div class="metric ${scoreProgressionAnalysis.onTrack ? 'good' : 'critical'}">
        <div class="metric-label">On Track</div>
        <div class="metric-value">${scoreProgressionAnalysis.onTrack ? 'Yes' : 'No'}</div>
      </div>
    </div>
    <div class="progress-bar">
      <div class="progress-fill" style="width: ${pointsPercentage}%">${Math.round(pointsPercentage)}%</div>
    </div>
  </div>

  <!-- Slide 3: Hours Analysis -->
  <div class="slide slide-content">
    <h2>Hours & Pacing</h2>
    <div class="content-grid">
      <div class="metric">
        <div class="metric-label">Total Purchased</div>
        <div class="metric-value">${hoursAnalysis.totalPurchased} hrs</div>
      </div>
      <div class="metric">
        <div class="metric-label">Hours Used</div>
        <div class="metric-value">${hoursAnalysis.totalUsed} hrs</div>
      </div>
      <div class="metric">
        <div class="metric-label">Hours Remaining</div>
        <div class="metric-value">${hoursAnalysis.hoursRemaining} hrs</div>
      </div>
      <div class="metric">
        <div class="metric-label">Needed for Target</div>
        <div class="metric-value">${hoursAnalysis.hoursNeededForTarget} hrs</div>
      </div>
    </div>
    <div class="progress-bar">
      <div class="progress-fill" style="width: ${hoursPercentage}%">${Math.round(hoursPercentage)}%</div>
    </div>
    <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-left: 4px solid ${hoursAnalysis.hoursSurplusOrDeficit >= 0 ? '#27AE60' : '#C0392B'};">
      <strong>Hours Balance:</strong> <span style="color: ${hoursAnalysis.hoursSurplusOrDeficit >= 0 ? '#27AE60' : '#C0392B'}; font-weight: bold;">
        ${hoursAnalysis.hoursSurplusOrDeficit >= 0 ? '+' : ''}${hoursAnalysis.hoursSurplusOrDeficit} hrs
      </span>
    </div>
  </div>

  <!-- Slide 4: Domain Analysis -->
  <div class="slide slide-content">
    <h2>Domain Analysis</h2>
    <div style="font-size: 13px; line-height: 1.8;">
      ${domainAnalysis
        .map(
          (d) => `
        <div style="margin-bottom: 15px; padding: 10px; background: #f9f9f9; border-radius: 4px;">
          <strong style="color: #1B365D;">${d.domain}</strong> — ${d.priorityLevel}
          <br />
          <span style="font-size: 12px; color: #666;">Baseline: ${d.baselineBand} | Current: ${d.currentAccuracy || 'N/A'}</span>
        </div>
      `
        )
        .join('')}
    </div>
  </div>

  <!-- Slide 5: Engagement & Tutor -->
  <div class="slide slide-content">
    <h2>Engagement & Tutor Assessment</h2>
    <div class="content-grid">
      <div>
        <h3 style="font-size: 16px; color: #1B365D; margin-bottom: 10px;">Engagement</h3>
        <div class="table-row">
          <span>Completion Rate</span>
          <strong>${engagementAssessment.assignmentCompletionRate}</strong>
        </div>
        <div class="table-row">
          <span>Attendance</span>
          <strong>${engagementAssessment.sessionAttendance}</strong>
        </div>
        <div class="table-row">
          <span>Risk Level</span>
          <strong class="${engagementAssessment.engagementRisk === 'None' ? 'status-ok' : 'status-critical'}">${engagementAssessment.engagementRisk}</strong>
        </div>
      </div>
      <div>
        <h3 style="font-size: 16px; color: #1B365D; margin-bottom: 10px;">Tutor</h3>
        <div class="table-row">
          <span>Current</span>
          <strong>${tutorAssessment.currentTutor}</strong>
        </div>
        <div class="table-row">
          <span>Sessions</span>
          <strong>${tutorAssessment.sessionsWithCurrentTutor}</strong>
        </div>
        ${
          tutorAssessment.tutorChangeRecommended
            ? `<div class="table-row" style="background: #FDEDEC; padding: 10px;">
          <strong class="status-critical">⚠️ Change Recommended</strong>
        </div>`
            : ''
        }
      </div>
    </div>
  </div>

  <!-- Slide 6: Recovery Plan -->
  <div class="slide slide-content">
    <h2>Recovery Plan</h2>
    <div class="content-grid full-width">
      <div class="metric">
        <div class="metric-label">Weeks Remaining</div>
        <div class="metric-value">${plan.weeksRemaining}</div>
      </div>
      <div class="metric">
        <div class="metric-label">Recommended Intensity</div>
        <div style="font-size: 18px; color: #1B365D; margin-top: 5px; font-weight: bold;">${plan.recommendedIntensity}</div>
      </div>
      <div class="metric">
        <div class="metric-label">Sessions/Week</div>
        <div class="metric-value">${plan.recommendedSessionsPerWeek}</div>
      </div>
    </div>
    ${
      plan.immediateActions && plan.immediateActions.length > 0
        ? `
      <h3 style="font-size: 16px; color: #1B365D; margin-top: 20px; margin-bottom: 10px;">Immediate Actions</h3>
      <ul class="bullet-list">
        ${plan.immediateActions.map((a) => `<li>${a}</li>`).join('')}
      </ul>
    `
        : ''
    }
  </div>

  <!-- Slide 7: Escalation (if applicable) -->
  ${
    escalationTriggers && escalationTriggers.length > 0
      ? `
  <div class="slide slide-content" style="background: #FDEDEC;">
    <h2 style="color: #C0392B;">⚠️ Escalation Triggers</h2>
    <div style="background: white; padding: 20px; border-left: 4px solid #C0392B; margin-top: 20px;">
      <ul class="bullet-list">
        ${escalationTriggers.map((t) => `<li style="color: #C0392B; font-weight: 500;">${t}</li>`).join('')}
      </ul>
    </div>
  </div>
  `
      : ''
  }
</body>
</html>
  `;

  return html;
}

/**
 * Build recovery presentation (PDF via Puppeteer + PPTX via pptxgenjs)
 */
export async function buildRecoveryPresentation(recoveryPlan, studentData, studentName) {
  const html = buildRecoveryPresentationHtml(recoveryPlan, studentData, studentName);

  // ── Build PDF via Puppeteer ──────────────────────────────────────────────────
  let pdfBuffer;
  let browser;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    await browser.close();
  } catch (err) {
    if (browser) await browser.close();
    throw new Error(`Puppeteer PDF build failed: ${err.message}`);
  }

  // ── Build PPTX via pptxgenjs ────────────────────────────────────────────────
  const prs = new PptxGenJS();
  prs.defineLayout({ name: 'LAYOUT1', width: 10, height: 5.625 }); // 16:9

  const slideData = [
    {
      title: studentName,
      subtitle: 'Recovery Gameplan',
      type: 'title',
      riskLevel: recoveryPlan.riskLevel,
    },
    {
      type: 'metrics',
      title: 'Score Progress',
      metrics: [
        { label: 'Baseline', value: recoveryPlan.scoreProgressionAnalysis.baseline },
        { label: 'Target', value: recoveryPlan.scoreProgressionAnalysis.targetScore },
        {
          label: 'Points Gained',
          value: `+${recoveryPlan.scoreProgressionAnalysis.pointsGained}`,
        },
        {
          label: 'On Track',
          value: recoveryPlan.scoreProgressionAnalysis.onTrack ? 'Yes' : 'No',
        },
      ],
    },
    {
      type: 'metrics',
      title: 'Hours & Pacing',
      metrics: [
        { label: 'Purchased', value: `${recoveryPlan.hoursAnalysis.totalPurchased} hrs` },
        { label: 'Used', value: `${recoveryPlan.hoursAnalysis.totalUsed} hrs` },
        { label: 'Remaining', value: `${recoveryPlan.hoursAnalysis.hoursRemaining} hrs` },
        {
          label: 'Hours Balance',
          value: `${recoveryPlan.hoursAnalysis.hoursSurplusOrDeficit >= 0 ? '+' : ''}${recoveryPlan.hoursAnalysis.hoursSurplusOrDeficit}`,
        },
      ],
    },
  ];

  slideData.forEach((slide, idx) => {
    const s = prs.addSlide();

    if (slide.type === 'title') {
      s.background = { color: '1B365D' };
      s.addText(slide.title, {
        x: 0.5,
        y: 1.5,
        w: 9,
        h: 1.5,
        fontSize: 48,
        bold: true,
        color: 'FFFFFF',
        align: 'center',
      });
      s.addText(slide.subtitle, {
        x: 0.5,
        y: 3,
        w: 9,
        h: 0.8,
        fontSize: 32,
        color: 'FFFFFF',
        align: 'center',
      });
      const badgeColor = RISK_COLORS[slide.riskLevel];
      s.addShape(prs.ShapeType.roundRect, {
        x: 4,
        y: 4,
        w: 2,
        h: 0.6,
        fill: { color: badgeColor },
        line: { color: badgeColor },
      });
      s.addText(`${slide.riskLevel} Risk`, {
        x: 4,
        y: 4,
        w: 2,
        h: 0.6,
        fontSize: 18,
        bold: true,
        color: 'FFFFFF',
        align: 'center',
        valign: 'middle',
      });
    } else if (slide.type === 'metrics') {
      s.background = { color: 'FFFFFF' };
      s.addText(slide.title, {
        x: 0.5,
        y: 0.3,
        w: 9,
        h: 0.5,
        fontSize: 32,
        bold: true,
        color: '1B365D',
      });

      const metricsPerRow = 2;
      const metricW = (9 - 0.5) / metricsPerRow - 0.25;
      const metricH = 1.8;
      const startY = 1;

      slide.metrics.forEach((metric, i) => {
        const row = Math.floor(i / metricsPerRow);
        const col = i % metricsPerRow;
        const x = 0.5 + col * (metricW + 0.25);
        const y = startY + row * (metricH + 0.3);

        s.addShape(prs.ShapeType.rect, {
          x,
          y,
          w: metricW,
          h: metricH,
          fill: { color: 'F9F9F9' },
          line: { color: '2E75B6', width: 2 },
        });

        s.addText(metric.label, {
          x: x + 0.1,
          y: y + 0.1,
          w: metricW - 0.2,
          h: 0.3,
          fontSize: 10,
          bold: true,
          color: '666666',
        });

        s.addText(String(metric.value), {
          x: x + 0.1,
          y: y + 0.6,
          w: metricW - 0.2,
          h: 0.9,
          fontSize: 20,
          bold: true,
          color: '1B365D',
          align: 'left',
          valign: 'top',
        });
      });
    }
  });

  const pptxBuffer = await prs.writeFile({ fileName: `${studentName}_Recovery_Presentation.pptx` });

  return {
    pdfBuffer,
    pptxBuffer,
  };
}
