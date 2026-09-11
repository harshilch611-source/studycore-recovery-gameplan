import React from 'react';
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from '@react-pdf/renderer';

const C = {
  navy: '#1B365D',
  green: '#27AE60',
  red: '#C0392B',
  orange: '#D4740E',
  white: '#FFFFFF',
  offWhite: '#F7FAFD',
  textDark: '#1A1A1A',
  textMid: '#444444',
  textLight: '#777777',
};

const RISK_COLORS = {
  Green: '#27AE60',
  Yellow: '#D4740E',
  Red: '#C0392B',
};

const s = StyleSheet.create({
  page: {
    backgroundColor: C.white,
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: C.textDark,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    paddingBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: C.navy,
  },
  riskBadge: {
    padding: 6,
    borderRadius: 4,
    paddingHorizontal: 12,
    fontSize: 10,
    fontWeight: 'bold',
    color: C.white,
  },
  section: {
    marginTop: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: C.navy,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
    paddingBottom: 4,
  },
  box: {
    backgroundColor: C.offWhite,
    border: '1px solid #DDD',
    padding: 10,
    marginBottom: 8,
    borderRadius: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontWeight: 'bold',
    color: C.textMid,
    flex: 1,
  },
  value: {
    color: C.textDark,
    flex: 1,
    textAlign: 'right',
  },
  bullet: {
    marginLeft: 12,
    marginBottom: 4,
  },
  callout: {
    backgroundColor: '#FFF9E6',
    borderLeftWidth: 4,
    borderLeftColor: C.orange,
    padding: 10,
    marginBottom: 12,
  },
  calloutText: {
    fontSize: 10,
    color: C.textDark,
    lineHeight: 1.4,
  },
});

// MVP: Simple recovery plan PDF
export async function buildRecoveryPdf(recoveryPlan, studentData, studentName) {
  const {
    executiveSummary,
    riskLevel,
    riskFlags,
    scoreProgressionAnalysis,
    hoursAnalysis,
    domainAnalysis,
    engagementAssessment,
    tutorAssessment,
    recoveryPlan: plan,
    escalationTriggers,
    founderNote,
  } = recoveryPlan;

  const Doc = () => (
    <Document>
      {/* Page 1: Executive Summary + Scores + Hours */}
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.title}>{studentName} — Recovery Gameplan</Text>
          <View style={{ ...s.riskBadge, backgroundColor: RISK_COLORS[riskLevel] }}>
            <Text>{riskLevel}</Text>
          </View>
        </View>

        {/* Executive Summary */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Executive Summary</Text>
          <View style={s.box}>
            <Text style={{ color: C.textDark, lineHeight: 1.5 }}>{executiveSummary}</Text>
          </View>
        </View>

        {/* Risk Flags */}
        {riskFlags && riskFlags.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Risk Flags</Text>
            {riskFlags.map((flag, i) => (
              <View key={i} style={s.bullet}>
                <Text>• {flag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Score Analysis */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Score Progress</Text>
          <View style={s.box}>
            <View style={s.row}>
              <Text style={s.label}>Baseline:</Text>
              <Text style={s.value}>{scoreProgressionAnalysis.baseline}</Text>
            </View>
            <View style={s.row}>
              <Text style={s.label}>Latest:</Text>
              <Text style={s.value}>{scoreProgressionAnalysis.latestScore || 'N/A'}</Text>
            </View>
            <View style={s.row}>
              <Text style={s.label}>Target:</Text>
              <Text style={s.value}>{scoreProgressionAnalysis.targetScore}</Text>
            </View>
            <View style={s.row}>
              <Text style={s.label}>Points Gained:</Text>
              <Text style={s.value}>+{scoreProgressionAnalysis.pointsGained}</Text>
            </View>
            <View style={s.row}>
              <Text style={s.label}>Still Needed:</Text>
              <Text style={s.value}>+{scoreProgressionAnalysis.pointsStillNeeded}</Text>
            </View>
            <View style={s.row}>
              <Text style={s.label}>On Track:</Text>
              <Text style={{ ...s.value, color: scoreProgressionAnalysis.onTrack ? C.green : C.red }}>
                {scoreProgressionAnalysis.onTrack ? 'Yes' : 'No'}
              </Text>
            </View>
          </View>
        </View>

        {/* Hours Analysis */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Hours & Pacing</Text>
          <View style={s.box}>
            <View style={s.row}>
              <Text style={s.label}>Purchased:</Text>
              <Text style={s.value}>{hoursAnalysis.totalPurchased} hrs</Text>
            </View>
            <View style={s.row}>
              <Text style={s.label}>Used:</Text>
              <Text style={s.value}>{hoursAnalysis.totalUsed} hrs</Text>
            </View>
            <View style={s.row}>
              <Text style={s.label}>Remaining:</Text>
              <Text style={s.value}>{hoursAnalysis.hoursRemaining} hrs</Text>
            </View>
            <View style={s.row}>
              <Text style={s.label}>Needed for Target:</Text>
              <Text style={s.value}>{hoursAnalysis.hoursNeededForTarget} hrs</Text>
            </View>
            <View style={s.row}>
              <Text style={s.label}>Surplus / Deficit:</Text>
              <Text
                style={{
                  ...s.value,
                  color: hoursAnalysis.hoursSurplusOrDeficit >= 0 ? C.green : C.red,
                }}
              >
                {hoursAnalysis.hoursSurplusOrDeficit >= 0 ? '+' : ''}
                {hoursAnalysis.hoursSurplusOrDeficit} hrs
              </Text>
            </View>
          </View>
        </View>
      </Page>

      {/* Page 2: Domains + Engagement + Tutor */}
      <Page size="A4" style={s.page}>
        <Text style={s.sectionTitle}>Domain Analysis</Text>

        {domainAnalysis &&
          domainAnalysis.map((domain, i) => (
            <View key={i} style={s.box}>
              <View style={s.row}>
                <Text style={{ ...s.label, fontSize: 11, fontWeight: 'bold' }}>
                  {domain.domain}
                </Text>
                <Text style={{ ...s.value, fontWeight: 'bold', color: C.textMid }}>
                  {domain.priorityLevel}
                </Text>
              </View>
              <Text style={{ fontSize: 9, color: C.textLight, marginBottom: 4 }}>
                Baseline: {domain.baselineBand} | Current: {domain.currentAccuracy || 'N/A'}
              </Text>
              <Text style={{ fontSize: 9, color: C.textDark, lineHeight: 1.3 }}>
                {domain.recommendation}
              </Text>
            </View>
          ))}

        {/* Engagement */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Engagement</Text>
          <View style={s.box}>
            <View style={s.row}>
              <Text style={s.label}>Assignment Completion:</Text>
              <Text style={s.value}>{engagementAssessment.assignmentCompletionRate}</Text>
            </View>
            <View style={s.row}>
              <Text style={s.label}>Session Attendance:</Text>
              <Text style={s.value}>{engagementAssessment.sessionAttendance}</Text>
            </View>
            <View style={s.row}>
              <Text style={s.label}>Risk Level:</Text>
              <Text style={{ ...s.value, color: engagementAssessment.engagementRisk === 'None' ? C.green : C.red }}>
                {engagementAssessment.engagementRisk}
              </Text>
            </View>
          </View>
        </View>

        {/* Tutor Assessment */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Tutor Assessment</Text>
          <View style={s.box}>
            <View style={s.row}>
              <Text style={s.label}>Current Tutor:</Text>
              <Text style={s.value}>{tutorAssessment.currentTutor}</Text>
            </View>
            <View style={s.row}>
              <Text style={s.label}>Sessions:</Text>
              <Text style={s.value}>{tutorAssessment.sessionsWithCurrentTutor}</Text>
            </View>
            {tutorAssessment.tutorChangeRecommended && (
              <View style={{ ...s.callout, borderLeftColor: C.red }}>
                <Text style={s.calloutText}>
                  <Text style={{ fontWeight: 'bold' }}>Tutor Change Recommended:</Text> {tutorAssessment.tutorChangeRationale}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Page>

      {/* Page 3: Recovery Plan + Escalation Triggers */}
      <Page size="A4" style={s.page}>
        <Text style={s.sectionTitle}>Recovery Plan</Text>
        <View style={s.box}>
          <View style={s.row}>
            <Text style={s.label}>Weeks Remaining:</Text>
            <Text style={s.value}>{plan.weeksRemaining}</Text>
          </View>
          <View style={s.row}>
            <Text style={s.label}>Recommended Intensity:</Text>
            <Text style={s.value}>{plan.recommendedIntensity}</Text>
          </View>
          <View style={s.row}>
            <Text style={s.label}>Sessions/Week:</Text>
            <Text style={s.value}>{plan.recommendedSessionsPerWeek}</Text>
          </View>
        </View>

        {/* Immediate Actions */}
        {plan.immediateActions && plan.immediateActions.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Immediate Actions</Text>
            {plan.immediateActions.map((action, i) => (
              <View key={i} style={s.bullet}>
                <Text style={{ fontSize: 9 }}>• {action}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Recovery Phases */}
        {plan.phases && plan.phases.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Recovery Phases</Text>
            {plan.phases.map((phase, i) => (
              <View key={i} style={s.box}>
                <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>{phase.title}</Text>
                <Text style={{ fontSize: 9, color: C.textLight, marginBottom: 4 }}>
                  Objective: {phase.objective}
                </Text>
                <Text style={{ fontSize: 9, color: C.textLight, marginBottom: 4 }}>
                  Focus: {phase.focusDomains?.join(', ') || 'N/A'}
                </Text>
                <Text style={{ fontSize: 9, color: C.textLight }}>
                  Target: {phase.milestoneTarget}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Escalation Triggers */}
        {escalationTriggers && escalationTriggers.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Escalation Triggers</Text>
            <View style={{ ...s.callout, borderLeftColor: C.red }}>
              {escalationTriggers.map((trigger, i) => (
                <Text key={i} style={{ ...s.calloutText, marginBottom: 4 }}>
                  • {trigger}
                </Text>
              ))}
            </View>
          </View>
        )}
      </Page>

      {/* Page 4 (optional): Founder Note (if present and non-empty) */}
      {founderNote && (
        <Page size="A4" style={s.page}>
          <View style={{ ...s.header, backgroundColor: C.red, paddingBottom: 12 }}>
            <Text style={{ ...s.title, color: C.white }}>⚠️ CONFIDENTIAL — Founder Note</Text>
          </View>
          <Text style={{ fontSize: 10, color: C.textDark, lineHeight: 1.6, marginTop: 16 }}>
            {founderNote}
          </Text>
          <Text
            style={{
              fontSize: 8,
              color: C.textLight,
              marginTop: 24,
              fontStyle: 'italic',
            }}
          >
            This page is for internal use only and should not be shared with students or families.
          </Text>
        </Page>
      )}
    </Document>
  );

  const buffer = await renderToBuffer(<Doc />);
  return buffer;
}
