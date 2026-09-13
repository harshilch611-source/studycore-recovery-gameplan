import React from 'react';
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from '@react-pdf/renderer';

const C = {
  navy:        '#1B365D',
  blue:        '#2E75B6',
  green:       '#27AE60',
  orange:      '#D4740E',
  red:         '#C0392B',
  white:       '#FFFFFF',
  offWhite:    '#F7FAFD',
  lightBlue:   '#EAF3FB',
  lightOrange: '#FFF3E0',
  lightRed:    '#FDEDEC',
  lightGreen:  '#EAFAF1',
  border:      '#DDE3EC',
  textDark:    '#1A1A1A',
  textMid:     '#444444',
  textLight:   '#777777',
};

const BOX_COLORS = [
  { bg: C.navy,   label: '#7FB3D8', value: C.white,  sub: '#B8CDE0' },
  { bg: C.red,    label: '#F5C6C0', value: C.white,  sub: '#F5C6C0' },
  { bg: C.orange, label: '#F5D5A8', value: C.white,  sub: '#F5D5A8' },
  { bg: C.green,  label: '#C8F0D8', value: C.white,  sub: '#C8F0D8' },
];

const RISK_STYLES = {
  Critical: { backgroundColor: '#FDEDEC', color: '#C0392B' },
  High:     { backgroundColor: '#FDEDEC', color: '#C0392B' },
  Medium:   { backgroundColor: '#FEF3E2', color: '#D4740E' },
  Low:      { backgroundColor: '#EAFAF1', color: '#27AE60' },
  Stable:   { backgroundColor: '#EBF5FB', color: '#2E75B6' },
};

const ENGAGEMENT_STYLES = {
  Strong:   { backgroundColor: '#EAFAF1', color: '#27AE60' },
  Good:     { backgroundColor: '#EAFAF1', color: '#27AE60' },
  Fair:     { backgroundColor: '#FEF3E2', color: '#D4740E' },
  Weak:     { backgroundColor: '#FDEDEC', color: '#C0392B' },
  Poor:     { backgroundColor: '#FDEDEC', color: '#C0392B' },
  Unknown:  { backgroundColor: '#F4F6F7', color: '#777777' },
};

const s = StyleSheet.create({
  page: {
    backgroundColor: C.white,
    paddingTop: 32,
    paddingBottom: 40,
    paddingLeft: 36,
    paddingRight: 36,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: C.textDark,
  },
  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    backgroundColor: C.navy,
    borderRadius: 4,
    padding: 14,
    marginBottom: 10,
  },
  headerBrand: {
    color: '#7FB3D8',
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 2,
    marginBottom: 3,
  },
  headerName: {
    color: C.white,
    fontSize: 17,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 3,
  },
  headerTagline: {
    color: '#B8CDE0',
    fontSize: 9,
    fontFamily: 'Helvetica-Oblique',
  },
  // ── Score / metric boxes ─────────────────────────────────────────────────────────────
  scoreRow: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 5,
  },
  scoreBox: {
    flex: 1,
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  scoreBoxLabel: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 0.8,
    marginBottom: 4,
    textAlign: 'center',
  },
  scoreBoxValue: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 2,
  },
  scoreBoxSub: {
    fontSize: 7,
    textAlign: 'center',
  },
  // ── Callout boxes ───────────────────────────────────────────────────────────
  calloutBlue: {
    backgroundColor: C.lightBlue,
    borderLeftWidth: 3,
    borderLeftColor: C.blue,
    borderLeftStyle: 'solid',
    borderRadius: 3,
    padding: 10,
    marginBottom: 6,
  },
  calloutOrange: {
    backgroundColor: C.lightOrange,
    borderLeftWidth: 3,
    borderLeftColor: C.orange,
    borderLeftStyle: 'solid',
    borderRadius: 3,
    padding: 10,
    marginBottom: 6,
  },
  calloutRed: {
    backgroundColor: C.lightRed,
    borderLeftWidth: 3,
    borderLeftColor: C.red,
    borderLeftStyle: 'solid',
    borderRadius: 3,
    padding: 10,
    marginBottom: 6,
  },
  calloutGreen: {
    backgroundColor: C.lightGreen,
    borderLeftWidth: 3,
    borderLeftColor: C.green,
    borderLeftStyle: 'solid',
    borderRadius: 3,
    padding: 10,
    marginBottom: 6,
  },
  calloutLabel: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  calloutBody: {
    fontSize: 9.5,
    lineHeight: 1.55,
    color: C.textMid,
  },
  // ── Section bar ─────────────────────────────────────────────────────────────
  sectionBar: {
    backgroundColor: C.navy,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 3,
    marginTop: 8,
    marginBottom: 4,
  },
  sectionBarText: {
    color: C.white,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
  },
  // ── Body text ────────────────────────────────────────────────────────────────
  body: {
    fontSize: 9.5,
    lineHeight: 1.6,
    color: C.textMid,
    marginBottom: 4,
  },
  // ── Tables ──────────────────────────────────────────────────────────────────
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: C.navy,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    borderBottomStyle: 'solid',
  },
  tableRowAlt: {
    flexDirection: 'row',
    backgroundColor: C.offWhite,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    borderBottomStyle: 'solid',
  },
  tableHeaderCell: {
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 6,
    color: C.white,
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
  },
  tableCell: {
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 6,
    fontSize: 8.5,
    color: C.textDark,
  },
  badge: {
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 2,
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    alignSelf: 'flex-start',
  },
  // ── Overview grid ────────────────────────────────────────────────────────────
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 6,
  },
  overviewItem: {
    width: '31%',
    backgroundColor: C.offWhite,
    borderWidth: 1,
    borderColor: C.border,
    borderStyle: 'solid',
    borderRadius: 3,
    padding: 7,
  },
  overviewLabel: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    color: C.blue,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  overviewValue: {
    fontSize: 8.5,
    color: C.textDark,
    lineHeight: 1.4,
  },
  // ── Focus / action cards ─────────────────────────────────────────────────────
  focusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 6,
  },
  focusCard: {
    width: '47%',
    borderWidth: 1,
    borderColor: C.border,
    borderStyle: 'solid',
    borderTopWidth: 3,
    borderTopColor: C.blue,
    borderTopStyle: 'solid',
    borderRadius: 3,
    padding: 7,
  },
  focusCardUrgent: {
    width: '47%',
    borderWidth: 1,
    borderColor: C.border,
    borderStyle: 'solid',
    borderTopWidth: 3,
    borderTopColor: C.red,
    borderTopStyle: 'solid',
    borderRadius: 3,
    padding: 7,
  },
  focusNum: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: C.border,
    marginBottom: 1,
  },
  focusTitle: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: C.navy,
    marginBottom: 2,
  },
  focusBody: {
    fontSize: 8,
    lineHeight: 1.4,
    color: C.textMid,
  },
  // ── Escalation trigger card ──────────────────────────────────────────────────
  escalationBar: {
    backgroundColor: C.red,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 3,
    marginTop: 8,
    marginBottom: 4,
  },
  escalationBarText: {
    color: C.white,
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
  },
  triggerCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: C.border,
    borderStyle: 'solid',
    borderRadius: 3,
    marginBottom: 4,
    overflow: 'hidden',
  },
  triggerSidebar: {
    backgroundColor: C.red,
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  triggerSidebarLabel: {
    color: '#F5C6C0',
    fontSize: 5.5,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 0.5,
    marginBottom: 2,
    textAlign: 'center',
  },
  triggerSidebarNum: {
    color: C.white,
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
  },
  triggerBody: {
    flex: 1,
    padding: 7,
  },
  triggerTitle: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: C.navy,
    marginBottom: 2,
  },
  triggerDesc: {
    fontSize: 8,
    lineHeight: 1.45,
    color: C.textMid,
    marginBottom: 3,
  },
  triggerAction: {
    fontSize: 7.5,
    color: C.red,
    fontFamily: 'Helvetica-Oblique',
  },
  // ── Phase / tutor assessment bar ─────────────────────────────────────────────
  phaseBar: {
    backgroundColor: C.blue,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 3,
    marginTop: 8,
    marginBottom: 4,
  },
  phaseBarText: {
    color: C.white,
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
  },
  phaseDesc: {
    fontSize: 8.5,
    lineHeight: 1.45,
    color: C.textMid,
    marginBottom: 5,
  },
  // ── Bottom line ─────────────────────────────────────────────────────────────
  bottomLine: {
    backgroundColor: C.navy,
    borderRadius: 4,
    padding: 14,
    marginTop: 14,
  },
  bottomLineTitle: {
    color: '#7FB3D8',
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
    marginBottom: 5,
  },
  bottomLineText: {
    color: C.white,
    fontSize: 10,
    lineHeight: 1.65,
    fontFamily: 'Helvetica-Bold',
  },
  // ── Footer ──────────────────────────────────────────────────────────────────
  footer: {
    position: 'absolute',
    bottom: 18,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 7,
    color: '#AABBCC',
  },
});

// ── Sub-components ─────────────────────────────────────────────────────────────

function SectionBar({ title }) {
  return (
    <View style={s.sectionBar}>
      <Text style={s.sectionBarText}>{title.toUpperCase()}</Text>
    </View>
  );
}

function RiskBadge({ level }) {
  const clean = (level || '').replace(/[^\x00-\x7F]/g, '').trim();
  const key = clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();
  const normalized = ['Critical', 'High', 'Medium', 'Low', 'Stable'].find(k => key.startsWith(k)) || 'Medium';
  const style = RISK_STYLES[normalized];
  return <Text style={[s.badge, style]}>{normalized}</Text>;
}

function EngagementBadge({ level }) {
  const clean = (level || '').replace(/[^\x00-\x7F]/g, '').trim();
  const key = clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();
  const normalized = ['Strong', 'Good', 'Fair', 'Weak', 'Poor'].find(k => key.startsWith(k)) || 'Unknown';
  const style = ENGAGEMENT_STYLES[normalized] || ENGAGEMENT_STYLES.Unknown;
  return <Text style={[s.badge, style]}>{normalized}</Text>;
}

// ── Main document ─────────────────────────────────────────────────────────────

function RecoveryDocument({ data, studentName }) {
  return (
    <Document>
      <Page size="LETTER" style={s.page} wrap>

        {/* Header */}
        <View style={s.header}>
          <Text style={s.headerBrand}>STUDYCORE  ·  STUDENT RECOVERY PLAN</Text>
          <Text style={s.headerName}>{studentName}</Text>
          {data.tagline ? <Text style={s.headerTagline}>{data.tagline}</Text> : null}
        </View>

        {/* Metric Boxes: current score, risk level, hours completed, sessions missed */}
        <View style={s.scoreRow}>
          {Object.values(data.metricBoxes || {}).map((box, i) => {
            const c = BOX_COLORS[i] || BOX_COLORS[0];
            return (
              <View key={i} style={[s.scoreBox, { backgroundColor: c.bg }]}>
                <Text style={[s.scoreBoxLabel, { color: c.label }]}>{(box.label || '').toUpperCase()}</Text>
                <Text style={[s.scoreBoxValue, { color: c.value }]}>{box.value || '—'}</Text>
                {box.subtitle ? <Text style={[s.scoreBoxSub, { color: c.sub }]}>{box.subtitle}</Text> : null}
              </View>
            );
          })}
        </View>

        {/* Executive Summary callout */}
        {data.executiveSummary ? (
          <View style={s.calloutBlue}>
            <Text style={[s.calloutLabel, { color: C.blue }]}>EXECUTIVE SUMMARY</Text>
            <Text style={s.calloutBody}>{data.executiveSummary}</Text>
          </View>
        ) : null}

        {/* Risk flag callout — red if critical/high, orange if medium */}
        {data.riskCallout ? (
          <View style={
            (data.riskLevel || '').toLowerCase().startsWith('c') ||
            (data.riskLevel || '').toLowerCase().startsWith('h')
              ? s.calloutRed
              : s.calloutOrange
          }>
            <Text style={[s.calloutLabel, {
              color: (data.riskLevel || '').toLowerCase().startsWith('c') ||
                     (data.riskLevel || '').toLowerCase().startsWith('h') ? C.red : C.orange
            }]}>
              {(data.riskCallout.title || 'RISK ASSESSMENT').toUpperCase()}
            </Text>
            <Text style={s.calloutBody}>{data.riskCallout.body}</Text>
          </View>
        ) : null}

        {/* Recovery Plan Overview */}
        {data.recoveryOverview ? (
          <>
            <SectionBar title="Recovery Plan Overview" />
            <View style={s.overviewGrid}>
              {Object.entries(data.recoveryOverview).map(([key, val]) => (
                <View key={key} style={s.overviewItem}>
                  <Text style={s.overviewLabel}>{key.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}</Text>
                  <Text style={s.overviewValue}>{val || '—'}</Text>
                </View>
              ))}
            </View>
          </>
        ) : null}

        {/* Score Progression Analysis */}
        {data.scoreProgressionAnalysis?.rows?.length > 0 ? (
          <>
            <SectionBar title="Score Progression Analysis" />
            {data.scoreProgressionAnalysis.intro
              ? <Text style={[s.body, { marginBottom: 6 }]}>{data.scoreProgressionAnalysis.intro}</Text>
              : null}
            <View style={{ marginBottom: 6 }}>
              <View style={s.tableHeaderRow}>
                <Text style={[s.tableHeaderCell, { flex: 2 }]}>Milestone</Text>
                <Text style={s.tableHeaderCell}>Total</Text>
                <Text style={s.tableHeaderCell}>R/W</Text>
                <Text style={s.tableHeaderCell}>Math</Text>
                <Text style={s.tableHeaderCell}>Status</Text>
              </View>
              {data.scoreProgressionAnalysis.rows.map((row, i) => (
                <View key={i} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
                  <Text style={[s.tableCell, { flex: 2 }]}>{row.milestone}</Text>
                  <Text style={[s.tableCell, { fontFamily: 'Helvetica-Bold' }]}>{row.total || '—'}</Text>
                  <Text style={s.tableCell}>{row.rw || '—'}</Text>
                  <Text style={s.tableCell}>{row.math || '—'}</Text>
                  <View style={[s.tableCell, { justifyContent: 'center' }]}>
                    <RiskBadge level={row.status || 'Stable'} />
                  </View>
                </View>
              ))}
            </View>
            {data.scoreProgressionAnalysis.note ? (
              <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Oblique', color: C.textLight, marginBottom: 6 }}>
                {data.scoreProgressionAnalysis.note}
              </Text>
            ) : null}
          </>
        ) : null}

        {/* Hours Analysis */}
        {data.hoursAnalysis ? (
          <>
            <SectionBar title="Hours Analysis" />
            {data.hoursAnalysis.summary
              ? <Text style={s.body}>{data.hoursAnalysis.summary}</Text>
              : null}
            {data.hoursAnalysis.rows?.length > 0 ? (
              <View style={{ marginBottom: 6 }}>
                <View style={s.tableHeaderRow}>
                  <Text style={[s.tableHeaderCell, { flex: 2 }]}>Period</Text>
                  <Text style={s.tableHeaderCell}>Scheduled</Text>
                  <Text style={s.tableHeaderCell}>Completed</Text>
                  <Text style={s.tableHeaderCell}>Missed</Text>
                  <Text style={s.tableHeaderCell}>Attendance</Text>
                </View>
                {data.hoursAnalysis.rows.map((row, i) => (
                  <View key={i} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
                    <Text style={[s.tableCell, { flex: 2, fontFamily: 'Helvetica-Bold' }]}>{row.period}</Text>
                    <Text style={s.tableCell}>{row.scheduled || '—'}</Text>
                    <Text style={s.tableCell}>{row.completed || '—'}</Text>
                    <Text style={s.tableCell}>{row.missed || '—'}</Text>
                    <Text style={s.tableCell}>{row.attendance || '—'}</Text>
                  </View>
                ))}
              </View>
            ) : null}
          </>
        ) : null}

        {/* Domain Analysis */}
        {data.domainAnalysis?.length > 0 ? (
          <>
            <SectionBar title="Domain Analysis" />
            <View>
              <View style={s.tableHeaderRow}>
                <Text style={[s.tableHeaderCell, { flex: 2 }]}>Domain</Text>
                <Text style={[s.tableHeaderCell, { flex: 0.7 }]}>Score</Text>
                <Text style={[s.tableHeaderCell, { flex: 0.9 }]}>Priority</Text>
                <Text style={[s.tableHeaderCell, { flex: 3 }]}>Session Focus</Text>
              </View>
              {data.domainAnalysis.map((row, i) => (
                <View key={i} wrap={false} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
                  <Text style={[s.tableCell, { flex: 2, fontFamily: 'Helvetica-Bold' }]}>{row.domain}</Text>
                  <Text style={[s.tableCell, { flex: 0.7 }]}>{row.score || '—'}</Text>
                  <View style={[s.tableCell, { flex: 0.9, justifyContent: 'center' }]}>
                    <RiskBadge level={row.priority || 'Medium'} />
                  </View>
                  <Text style={[s.tableCell, { flex: 3, fontSize: 7.5 }]}>{row.focus}</Text>
                </View>
              ))}
            </View>
          </>
        ) : null}

        {/* Engagement Assessment */}
        {data.engagementAssessment ? (
          <>
            <SectionBar title="Engagement Assessment" />
            {data.engagementAssessment.summary
              ? <Text style={s.body}>{data.engagementAssessment.summary}</Text>
              : null}
            {data.engagementAssessment.dimensions?.length > 0 ? (
              <View style={{ marginBottom: 6 }}>
                <View style={s.tableHeaderRow}>
                  <Text style={[s.tableHeaderCell, { flex: 2 }]}>Dimension</Text>
                  <Text style={[s.tableHeaderCell, { flex: 3 }]}>Observation</Text>
                  <Text style={s.tableHeaderCell}>Rating</Text>
                </View>
                {data.engagementAssessment.dimensions.map((row, i) => (
                  <View key={i} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
                    <Text style={[s.tableCell, { flex: 2, fontFamily: 'Helvetica-Bold' }]}>{row.dimension}</Text>
                    <Text style={[s.tableCell, { flex: 3 }]}>{row.observation || '—'}</Text>
                    <View style={[s.tableCell, { justifyContent: 'center' }]}>
                      <EngagementBadge level={row.rating} />
                    </View>
                  </View>
                ))}
              </View>
            ) : null}
          </>
        ) : null}

        {/* Immediate Actions — 2 cards per row, each row wrap={false} */}
        {data.immediateActions?.length > 0 ? (
          <>
            <SectionBar title="Immediate Actions" />
            {Array.from({ length: Math.ceil(data.immediateActions.length / 2) }, (_, ri) => {
              const pair = data.immediateActions.slice(ri * 2, ri * 2 + 2);
              return (
                <View key={ri} wrap={false} style={{ flexDirection: 'row', gap: 4, marginBottom: 4 }}>
                  {pair.map((action, i) => (
                    <View key={i} style={[action.urgent ? s.focusCardUrgent : s.focusCard, { flex: 1 }]}>
                      <Text style={s.focusNum}>{String(action.number || ri * 2 + i + 1).padStart(2, '0')}</Text>
                      <Text style={s.focusBody}>{action.body}</Text>
                      {action.owner ? (
                        <View style={{ marginTop: 5, paddingTop: 4, borderTopWidth: 1, borderTopColor: C.border, borderTopStyle: 'solid' }}>
                          <Text style={{ fontSize: 7, color: action.owner === 'Parent' ? C.orange : C.blue, fontFamily: 'Helvetica-Bold', letterSpacing: 0.5 }}>
                            {action.owner === 'Both' ? 'TUTOR + PARENT' : action.owner === 'Parent' ? 'PARENT' : 'TUTOR'}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  ))}
                  {/* Pad to 2 if odd number in last row */}
                  {pair.length === 1 ? <View style={{ flex: 1 }} /> : null}
                </View>
              );
            })}
          </>
        ) : null}

        {/* Parent Support Guidance */}
        {data.parentSupportGuidance ? (
          <>
            <SectionBar title="Parent Support Guide" />
            <Text style={s.body}>{data.parentSupportGuidance}</Text>
          </>
        ) : null}

        {/* Tutor Session Guidance */}
        {data.tutorAssessment ? (
          <>
            <SectionBar title="Tutor Session Guidance" />
            {data.tutorAssessment.summary
              ? <Text style={s.body}>{data.tutorAssessment.summary}</Text>
              : null}
            {data.tutorAssessment.sections?.length > 0
              ? data.tutorAssessment.sections.map((section, si) => (
                <View key={si}>
                  <View style={s.phaseBar}>
                    <Text style={s.phaseBarText}>{section.title}</Text>
                  </View>
                  {section.description
                    ? <Text style={s.phaseDesc}>{section.description}</Text>
                    : null}
                  {section.items?.length > 0
                    ? section.items.map((item, ii) => (
                      <View key={ii} style={s.triggerCard} wrap={false}>
                        <View style={[s.triggerSidebar, { backgroundColor: C.blue }]}>
                          <Text style={[s.triggerSidebarLabel, { color: '#C0D8F0' }]}>
                            {(item.tag || 'NOTE').toUpperCase()}
                          </Text>
                        </View>
                        <View style={s.triggerBody}>
                          {item.title ? <Text style={s.triggerTitle}>{item.title}</Text> : null}
                          {item.detail ? <Text style={s.triggerDesc}>{item.detail}</Text> : null}
                          {item.recommendation ? (
                            <Text style={[s.triggerAction, { color: C.blue }]}>
                              REC: {item.recommendation}
                            </Text>
                          ) : null}
                        </View>
                      </View>
                    ))
                    : null}
                </View>
              ))
              : null}
          </>
        ) : null}

        {/* Recovery Phases */}
        {data.recoveryPhases?.length > 0 ? (
          <>
            <SectionBar title="Recovery Phases" />
            {data.recoveryPhases.map((phase, pi) => (
              <View key={pi} wrap={false} style={{ marginBottom: 6, borderWidth: 1, borderColor: C.border, borderStyle: 'solid', borderRadius: 3, overflow: 'hidden' }}>
                <View style={s.phaseBar}>
                  <Text style={s.phaseBarText}>{phase.title}</Text>
                </View>
                <View style={{ padding: 8 }}>
                  {phase.objective ? <Text style={[s.body, { marginBottom: 6 }]}>{phase.objective}</Text> : null}

                  {/* Hours + Focus stacked to prevent overflow */}
                  <View style={{ marginBottom: 5 }}>
                    {phase.weeklyHours || phase.focusDomains?.length > 0 ? (
                      <Text style={{ fontSize: 7.5, color: C.textMid, marginBottom: 2 }}>
                        <Text style={{ fontFamily: 'Helvetica-Bold', color: C.blue }}>
                          {phase.weeklyHours ? `${phase.weeklyHours}h / week` : ''}
                          {phase.weeklyHours && phase.focusDomains?.length > 0 ? '  ·  ' : ''}
                        </Text>
                        {phase.focusDomains?.length > 0 ? `Focus: ${phase.focusDomains.join(', ')}` : ''}
                      </Text>
                    ) : null}
                    {phase.milestoneTarget ? (
                      <Text style={{ fontSize: 7.5, color: C.green, fontFamily: 'Helvetica-Bold' }}>
                        Milestone: {phase.milestoneTarget}
                      </Text>
                    ) : null}
                  </View>

                  {/* Tutor block */}
                  {phase.tutorFocus ? (
                    <View style={{ backgroundColor: C.lightBlue, borderLeftWidth: 2, borderLeftColor: C.blue, borderLeftStyle: 'solid', paddingVertical: 4, paddingHorizontal: 6, marginBottom: 3, borderRadius: 2 }}>
                      <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', color: C.blue, marginBottom: 1, letterSpacing: 0.5 }}>TUTOR</Text>
                      <Text style={{ fontSize: 8, color: C.textDark, lineHeight: 1.4 }}>{phase.tutorFocus}</Text>
                    </View>
                  ) : null}

                  {/* Parent block */}
                  {phase.parentCheckpoint ? (
                    <View style={{ backgroundColor: C.lightOrange, borderLeftWidth: 2, borderLeftColor: C.orange, borderLeftStyle: 'solid', paddingVertical: 4, paddingHorizontal: 6, borderRadius: 2 }}>
                      <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', color: C.orange, marginBottom: 1, letterSpacing: 0.5 }}>PARENT CHECK</Text>
                      <Text style={{ fontSize: 8, color: C.textDark, lineHeight: 1.4 }}>{phase.parentCheckpoint}</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            ))}
          </>
        ) : null}

        {/* Checkpoint Triggers */}
        {data.escalationTriggers?.length > 0 ? (
          <>
            <SectionBar title="When to Contact StudyCore" />
            {data.escalationIntro
              ? <Text style={[s.body, { marginBottom: 8 }]}>{data.escalationIntro}</Text>
              : null}
            {data.escalationTriggers.map((trigger, ti) => (
              <View key={ti}>
                <View style={s.escalationBar}>
                  <Text style={s.escalationBarText}>{trigger.category || `Trigger Group ${ti + 1}`}</Text>
                </View>
                {trigger.items?.map((item, ii) => (
                  <View key={ii} style={s.triggerCard} wrap={false}>
                    <View style={s.triggerSidebar}>
                      <Text style={s.triggerSidebarLabel}>CHK</Text>
                      <Text style={s.triggerSidebarNum}>{ii + 1}</Text>
                    </View>
                    <View style={s.triggerBody}>
                      {item.condition ? <Text style={s.triggerTitle}>{item.condition}</Text> : null}
                      {item.detail ? <Text style={s.triggerDesc}>{item.detail}</Text> : null}
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </>
        ) : null}

        {/* Bottom Line */}
        {data.bottomLine ? (
          <View style={s.bottomLine}>
            <Text style={s.bottomLineTitle}>THE BOTTOM LINE</Text>
            <Text style={s.bottomLineText}>{data.bottomLine}</Text>
          </View>
        ) : null}

        {/* Footer (fixed on every page) */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>StudyCore  ·  {studentName}  ·  Student Recovery Plan  ·  Confidential</Text>
          <Text style={s.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>

      </Page>
    </Document>
  );
}

// ─── Data mapping helpers ─────────────────────────────────────────────────────

/**
 * Maps raw recoveryPlan and studentData into the shape RecoveryDocument expects.
 * All fields are optional — missing data renders as '—' or is omitted entirely.
 */
function buildDocumentData(recoveryPlan, studentData) {
  const rp = recoveryPlan || {};
  const sd = studentData || {};
  const recoveryPlanData = rp.recoveryPlan || {};
  const scoreAnalysis = rp.scoreProgressionAnalysis || {};
  const rawHoursAnalysis = rp.hoursAnalysis || {};

  // ── Metric boxes (4-up colored boxes) ────────────────────────────────────
  const metricBoxes = {
    currentScore: {
      label: 'Current Score',
      value: String(scoreAnalysis.baseline || sd.baselineScore || '—'),
      subtitle: sd.testType ? `${sd.testType.toUpperCase()} baseline` : 'Baseline',
    },
    riskLevel: {
      label: 'Risk Level',
      value: rp.riskLevel || 'Medium',
      subtitle: 'Recovery priority',
    },
    hoursCompleted: {
      label: 'Hours Completed',
      value: String(rawHoursAnalysis.totalUsed || 0) + 'h',
      subtitle: `of ${rawHoursAnalysis.totalPurchased || 0}h purchased`,
    },
    targetScore: {
      label: 'Target Score',
      value: String(scoreAnalysis.targetScore || sd.targetScore || '—'),
      subtitle: sd.targetTestDate || 'Goal',
    },
  };

  // ── Risk callout ───────────────────────────────────────────────────────────
  const riskFlags = rp.riskFlags || [];
  const riskCallout = {
    title: `Risk Level: ${rp.riskLevel}`,
    body: riskFlags.length > 0
      ? riskFlags.slice(0, 2).join(' • ')
      : rp.executiveSummary || '',
  };

  // ── Recovery overview grid ────────────────────────────────────────────────
  const recoveryOverview = {
    assignedTutor: rp.tutorAssessment?.currentTutor || sd.currentTutor || '—',
    planStartDate: sd.programStartDate || 'Started',
    nextReview: recoveryPlanData.weeksRemaining ? `${recoveryPlanData.weeksRemaining} weeks` : '—',
    testDate: sd.targetTestDate || '—',
    sessionFrequency: `${recoveryPlanData.recommendedSessionsPerWeek || 2}x/week`,
    recoveryGoal: `${scoreAnalysis.pointsStillNeeded || 0} pts`,
  };

  // ── Hours Analysis: Transform raw data to PDF format ──────────────────────
  const hoursAnalysis = {
    summary: rawHoursAnalysis.sessionPaceNote || null,
    rows: [{
      period: 'Current Program',
      scheduled: rawHoursAnalysis.totalPurchased || '—',
      completed: rawHoursAnalysis.totalUsed || '—',
      missed: Math.max(0, (rawHoursAnalysis.totalPurchased || 0) - (rawHoursAnalysis.totalUsed || 0)) || '—',
      attendance: rawHoursAnalysis.hoursRemaining ? `${rawHoursAnalysis.hoursRemaining} remaining` : '—',
    }],
  };

  // ── Domain Analysis: Use priority + first sentence of recommendation ──────
  const domainAnalysis = (rp.domainAnalysis || []).map(domain => {
    // Extract just a leading score if present (e.g. "610 — description..." → "610")
    const extractScore = (str) => {
      if (!str) return null;
      const m = str.match(/^(\d{3,4})/);
      return m ? m[1] : null;
    };
    const scoreDisplay = extractScore(domain.currentAccuracy) || extractScore(domain.baselineBand) || null;
    // First sentence of recommendation, stripped of tutor name prefix (e.g. "Sarah, ...")
    const rec = (domain.recommendation || '').replace(/^[A-Z][a-z]+,\s*/, '');
    const firstSentence = rec.split(/[.!?]/)[0]?.trim() || rec;
    return {
      domain: domain.domain,
      score: scoreDisplay,
      priority: domain.priorityLevel || 'Medium',
      risk: domain.priorityLevel || 'Medium',
      focus: firstSentence || '—',
    };
  });

  // ── Engagement Assessment: Transform to PDF format ────────────────────────
  const rawEngagement = rp.engagementAssessment || {};
  const engagementAssessment = {
    summary: rawEngagement.engagementNote || null,
    dimensions: [
      {
        dimension: 'Assignment Completion',
        observation: rawEngagement.assignmentCompletionRate || '—',
        rating: rawEngagement.engagementRisk === 'High' ? 'Weak' : rawEngagement.engagementRisk === 'Medium' ? 'Fair' : 'Good',
      },
      {
        dimension: 'Session Attendance',
        observation: rawEngagement.sessionAttendance || '—',
        rating: rawEngagement.engagementRisk === 'High' ? 'Weak' : rawEngagement.engagementRisk === 'Medium' ? 'Fair' : 'Good',
      },
      {
        dimension: 'Homework Adherence',
        observation: rawEngagement.homeworkAdherence || '—',
        rating: rawEngagement.engagementRisk === 'High' ? 'Weak' : rawEngagement.engagementRisk === 'Medium' ? 'Fair' : 'Good',
      },
    ],
  };

  // ── Immediate Actions: Handle both old string[] and new object[] formats ──
  const immediateActions = (recoveryPlanData.immediateActions || []).map((action, idx) => {
    if (typeof action === 'string') {
      return {
        number: idx + 1,
        body: action,
        owner: 'Tutor',
        urgent: idx === 0,
      };
    }
    const timelineLabel = action.timeline ? ` — ${action.timeline}` : '';
    return {
      number: idx + 1,
      body: `${action.action}${timelineLabel}`,
      owner: action.owner || 'Tutor',
      urgent: idx === 0,
    };
  });

  // ── Tutor Session Guidance & Parent Guidance ──────────────────────────────
  const tutorSessionGuidance = recoveryPlanData.tutorSessionGuidance || null;
  const parentSupportGuidance = recoveryPlanData.parentSupportGuidance || null;

  // ── Tutor Assessment: Transform to PDF format ──────────────────────────────
  const rawTutor = rp.tutorAssessment || {};
  const tutorAssessment = {
    summary: `Current tutor: ${rawTutor.currentTutor || '—'} (${rawTutor.sessionsWithCurrentTutor || 0} sessions)`,
    sections: [
      {
        title: 'SESSION GUIDANCE FOR TUTOR',
        description: tutorSessionGuidance || (rawTutor.tutorConcerns?.length > 0 ? rawTutor.tutorConcerns.join('; ') : 'No specific guidance noted.'),
      },
    ],
  };

  // ── Checkpoint Triggers (parent/tutor-facing) ─────────────────────────────
  const checkpointTriggers = rp.checkpointTriggers || rp.escalationTriggers || [];
  const escalationTriggers = checkpointTriggers.length > 0 ? [
    {
      category: 'Contact StudyCore If Any of the Following Occur',
      items: checkpointTriggers.map((trigger, idx) => ({
        condition: trigger.split('—')[0]?.trim() || `Checkpoint ${idx + 1}`,
        detail: trigger.split('—')[1]?.trim() || '',
        action: 'Contact your StudyCore coordinator',
      })),
    },
  ] : [];

  // ── Tagline ───────────────────────────────────────────────────────────────
  const tagline = `Risk: ${rp.riskLevel} · Target: ${scoreAnalysis.targetScore} · ${recoveryPlanData.weeksRemaining} weeks`;

  // ── Recovery Phases ───────────────────────────────────────────────────────
  const recoveryPhases = (recoveryPlanData.phases || []).map(phase => ({
    title: phase.title,
    objective: phase.objective,
    focusDomains: phase.focusDomains || [],
    weeklyHours: phase.weeklyHours,
    milestoneTarget: phase.milestoneTarget,
    tutorFocus: phase.tutorFocus || null,
    parentCheckpoint: phase.parentCheckpoint || null,
  }));

  return {
    tagline,
    metricBoxes,
    executiveSummary: rp.executiveSummary,
    riskCallout,
    riskLevel: rp.riskLevel,
    recoveryOverview,
    hoursAnalysis,
    domainAnalysis,
    engagementAssessment,
    immediateActions,
    parentSupportGuidance,
    tutorAssessment,
    recoveryPhases,
    escalationTriggers,
    bottomLine: rp.executiveSummary,
  };
}

// ─── Public export ────────────────────────────────────────────────────────────

export async function buildRecoveryPdf(recoveryPlan, studentData, studentName) {
  const data = buildDocumentData(recoveryPlan, studentData);
  const element = React.createElement(RecoveryDocument, {
    data,
    studentName: studentName || studentData?.name || 'Student',
  });
  return await renderToBuffer(element);
}
