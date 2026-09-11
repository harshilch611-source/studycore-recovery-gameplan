'use client';

import { useState } from 'react';

export default function RecoveryGameplanGenerator() {
  const [loading, setLoading] = useState(false);
  const [streamMessage, setStreamMessage] = useState('');
  const [error, setError] = useState('');

  // Form state
  const [form, setForm] = useState({
    // Student info
    studentName: '',
    grade: '',
    testType: 'SAT',

    // Scores
    baselineScore: '',
    rwScore: '',
    mathScore: '',
    targetScore: '',

    // Program info
    isGuarantee: false,
    targetTestDate: '',
    weeksRemaining: '',
    programStartDate: '',
    currentTutor: '',

    // Hours
    totalHoursPurchased: '',
    totalHoursUsed: '',
    hoursRemaining: '',

    // Optional: HiScores & Session data
    hiScoresData: null,
    sessionHistory: [],

    // Notes
    programNotes: '',
    vaOverrideNotes: '',
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStreamMessage('');
    setLoading(true);

    try {
      // Minimal validation
      if (!form.studentName.trim()) {
        setError('Student name is required.');
        setLoading(false);
        return;
      }
      if (!form.baselineScore) {
        setError('Baseline score is required.');
        setLoading(false);
        return;
      }
      if (!form.targetScore) {
        setError('Target score is required.');
        setLoading(false);
        return;
      }
      if (form.hoursRemaining === '') {
        setError('Hours remaining is required.');
        setLoading(false);
        return;
      }

      setStreamMessage('Sending data to Claude...');

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        setError(`Server error: ${response.statusText}`);
        setLoading(false);
        return;
      }

      // Stream the response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const event = JSON.parse(line);

            if (event.status === 'error') {
              setError(event.error);
              setLoading(false);
              return;
            } else if (event.status === 'generating' || event.status === 'building') {
              setStreamMessage(event.message);
            } else if (event.status === 'done') {
              // Trigger downloads
              downloadFile(
                event.recoveryPlanBase64,
                `${event.studentName}_Recovery_Gameplan.pdf`
              );
              downloadFile(
                event.presentationBase64,
                `${event.studentName}_Recovery_Presentation.pdf`
              );
              downloadFile(
                event.pptxBase64,
                `${event.studentName}_Recovery_Presentation.pptx`
              );
              setStreamMessage('✅ Gameplan generated! Files downloading...');
              setLoading(false);
            }
          } catch (e) {
            console.error('Error parsing event:', e);
          }
        }
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const downloadFile = (base64, filename) => {
    const binary = atob(base64);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([array], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '40px 20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '36px', color: '#1B365D', marginBottom: '8px' }}>
            StudyCore Recovery Gameplan Generator
          </h1>
          <p style={{ fontSize: '16px', color: '#666' }}>
            Generate improvement plans for students already enrolled in the program
          </p>
        </div>

        {/* Form Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: '32px',
        }}>
          <form onSubmit={handleSubmit}>
            {/* Section 1: Student Info */}
            <fieldset style={{ marginBottom: '32px', border: 'none', padding: 0 }}>
              <legend style={{ fontSize: '18px', fontWeight: 'bold', color: '#1B365D', marginBottom: '16px' }}>
                Student Information
              </legend>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px' }}>
                    Student Name *
                  </label>
                  <input
                    type="text"
                    name="studentName"
                    value={form.studentName}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px' }}>
                    Grade
                  </label>
                  <input
                    type="text"
                    name="grade"
                    value={form.grade}
                    onChange={handleInputChange}
                    placeholder="e.g., 11, 12"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px' }}>
                    Test Type
                  </label>
                  <select
                    name="testType"
                    value={form.testType}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  >
                    <option value="SAT">SAT</option>
                    <option value="ACT">ACT</option>
                    <option value="PSAT">PSAT</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px' }}>
                    <input
                      type="checkbox"
                      name="isGuarantee"
                      checked={form.isGuarantee}
                      onChange={handleInputChange}
                      style={{ marginRight: '8px' }}
                    />
                    Guarantee Student
                  </label>
                </div>
              </div>
            </fieldset>

            {/* Section 2: Scores */}
            <fieldset style={{ marginBottom: '32px', border: 'none', padding: 0 }}>
              <legend style={{ fontSize: '18px', fontWeight: 'bold', color: '#1B365D', marginBottom: '16px' }}>
                Test Scores
              </legend>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px' }}>
                    Baseline/Current Score *
                  </label>
                  <input
                    type="number"
                    name="baselineScore"
                    value={form.baselineScore}
                    onChange={handleInputChange}
                    placeholder="e.g., 1250"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px' }}>
                    Target Score *
                  </label>
                  <input
                    type="number"
                    name="targetScore"
                    value={form.targetScore}
                    onChange={handleInputChange}
                    placeholder="e.g., 1500"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px' }}>
                    R/W Section Score (SAT)
                  </label>
                  <input
                    type="number"
                    name="rwScore"
                    value={form.rwScore}
                    onChange={handleInputChange}
                    placeholder="e.g., 610"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px' }}>
                    Math Section Score (SAT)
                  </label>
                  <input
                    type="number"
                    name="mathScore"
                    value={form.mathScore}
                    onChange={handleInputChange}
                    placeholder="e.g., 640"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  />
                </div>
              </div>
            </fieldset>

            {/* Section 3: Program Details */}
            <fieldset style={{ marginBottom: '32px', border: 'none', padding: 0 }}>
              <legend style={{ fontSize: '18px', fontWeight: 'bold', color: '#1B365D', marginBottom: '16px' }}>
                Program Details
              </legend>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px' }}>
                    Program Start Date
                  </label>
                  <input
                    type="date"
                    name="programStartDate"
                    value={form.programStartDate}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px' }}>
                    Target Test Date
                  </label>
                  <input
                    type="date"
                    name="targetTestDate"
                    value={form.targetTestDate}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px' }}>
                    Weeks Remaining
                  </label>
                  <input
                    type="number"
                    name="weeksRemaining"
                    value={form.weeksRemaining}
                    onChange={handleInputChange}
                    placeholder="e.g., 12"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px' }}>
                    Current Tutor
                  </label>
                  <input
                    type="text"
                    name="currentTutor"
                    value={form.currentTutor}
                    onChange={handleInputChange}
                    placeholder="e.g., John Smith"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  />
                </div>
              </div>
            </fieldset>

            {/* Section 4: Hours */}
            <fieldset style={{ marginBottom: '32px', border: 'none', padding: 0 }}>
              <legend style={{ fontSize: '18px', fontWeight: 'bold', color: '#1B365D', marginBottom: '16px' }}>
                Session Hours
              </legend>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px' }}>
                    Total Hours Purchased
                  </label>
                  <input
                    type="number"
                    name="totalHoursPurchased"
                    value={form.totalHoursPurchased}
                    onChange={handleInputChange}
                    placeholder="e.g., 20"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px' }}>
                    Total Hours Used
                  </label>
                  <input
                    type="number"
                    name="totalHoursUsed"
                    value={form.totalHoursUsed}
                    onChange={handleInputChange}
                    placeholder="e.g., 8"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px' }}>
                    Hours Remaining *
                  </label>
                  <input
                    type="number"
                    name="hoursRemaining"
                    value={form.hoursRemaining}
                    onChange={handleInputChange}
                    placeholder="e.g., 12"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                    required
                  />
                </div>
              </div>
            </fieldset>

            {/* Section 5: Notes */}
            <fieldset style={{ marginBottom: '32px', border: 'none', padding: 0 }}>
              <legend style={{ fontSize: '18px', fontWeight: 'bold', color: '#1B365D', marginBottom: '16px' }}>
                Additional Information
              </legend>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px' }}>
                  Program Notes
                </label>
                <textarea
                  name="programNotes"
                  value={form.programNotes}
                  onChange={handleInputChange}
                  placeholder="Any observations about program progress, student engagement, etc."
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '14px',
                    minHeight: '80px',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px' }}>
                  VA Override Notes
                </label>
                <textarea
                  name="vaOverrideNotes"
                  value={form.vaOverrideNotes}
                  onChange={handleInputChange}
                  placeholder="Additional context or concerns for the recovery plan"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    fontSize: '14px',
                    minHeight: '80px',
                  }}
                />
              </div>
            </fieldset>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: loading ? '#ccc' : '#1B365D',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Generating...' : 'Generate Recovery Gameplan'}
            </button>
          </form>

          {/* Status Messages */}
          {streamMessage && (
            <div style={{
              marginTop: '20px',
              padding: '12px',
              backgroundColor: '#E8F4F8',
              color: '#0C5460',
              borderRadius: '4px',
              borderLeft: '4px solid #0C5460',
            }}>
              {streamMessage}
            </div>
          )}

          {error && (
            <div style={{
              marginTop: '20px',
              padding: '12px',
              backgroundColor: '#F8D7DA',
              color: '#721C24',
              borderRadius: '4px',
              borderLeft: '4px solid #721C24',
            }}>
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ marginTop: '40px', textAlign: 'center', color: '#999', fontSize: '12px' }}>
          <p>MVP — Phase 1 | Manual form entry | Recovery Gameplan Generator</p>
        </div>
      </div>
    </div>
  );
}
