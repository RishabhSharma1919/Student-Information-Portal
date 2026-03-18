import React, { useState, useEffect, useCallback } from 'react';
import API from '../../utils/api';

const GRADES = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'];

const gradeColor = (grade) => {
  if (grade === 'A+') return '#34d399';
  if (grade === 'A') return '#6ee7b7';
  if (grade === 'B+') return '#60a5fa';
  if (grade === 'B') return '#93c5fd';
  if (grade === 'C+' || grade === 'C') return '#fcd34d';
  if (grade === 'F') return '#f87171';
  return 'var(--text2)';
};

export default function TeacherResultsEditor({ course, onBack }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [edits, setEdits] = useState({});   // { resultId: { marks_internal, marks_external, grade, remarks } }
  const [saving, setSaving] = useState({});
  const [saved, setSaved] = useState({});
  const [errors, setErrors] = useState({});

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const [s, sum] = await Promise.all([
        API.get(`/faculty/courses/${course.course_id}/students`),
        API.get(`/faculty/courses/${course.course_id}/summary`),
      ]);
      setStudents(s.data);
      setSummary(sum.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [course.course_id]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const getEditValue = (student, field) => {
    const rid = student.result_id;
    if (edits[rid] && edits[rid][field] !== undefined) return edits[rid][field];
    return student[field] ?? '';
  };

  const handleEdit = (resultId, field, value) => {
    setEdits(prev => ({
      ...prev,
      [resultId]: { ...prev[resultId], [field]: value },
    }));
    // Clear saved indicator when editing
    setSaved(prev => ({ ...prev, [resultId]: false }));
    setErrors(prev => ({ ...prev, [resultId]: '' }));
  };

  const handleSaveRow = async (student) => {
    const rid = student.result_id;
    const rowEdit = edits[rid] || {};

    const payload = {
      marks_internal: parseFloat(rowEdit.marks_internal ?? student.marks_internal),
      marks_external: parseFloat(rowEdit.marks_external ?? student.marks_external),
      grade: rowEdit.grade ?? student.grade ?? '',
      remarks: rowEdit.remarks ?? student.remarks ?? '',
    };

    if (isNaN(payload.marks_internal) || isNaN(payload.marks_external)) {
      setErrors(prev => ({ ...prev, [rid]: 'Enter valid marks.' }));
      return;
    }
    if (!payload.grade) {
      setErrors(prev => ({ ...prev, [rid]: 'Select a grade.' }));
      return;
    }

    setSaving(prev => ({ ...prev, [rid]: true }));
    setErrors(prev => ({ ...prev, [rid]: '' }));

    try {
      await API.put(`/faculty/results/${rid}`, payload);
      setSaved(prev => ({ ...prev, [rid]: true }));
      // Update local state
      setStudents(prev => prev.map(s =>
        s.result_id === rid ? { ...s, ...payload, marks_total: payload.marks_internal + payload.marks_external } : s
      ));
      // Clear edits for this row
      setEdits(prev => { const n = { ...prev }; delete n[rid]; return n; });
      // Refresh summary
      const sum = await API.get(`/faculty/courses/${course.course_id}/summary`);
      setSummary(sum.data);
      setTimeout(() => setSaved(prev => ({ ...prev, [rid]: false })), 2500);
    } catch (e) {
      setErrors(prev => ({ ...prev, [rid]: e.response?.data?.message || 'Error saving.' }));
    } finally {
      setSaving(prev => ({ ...prev, [rid]: false }));
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <button className="btn btn-secondary btn-sm" onClick={onBack}>← Back to Courses</button>
      </div>

      <div className="section-header" style={{ marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <code style={{ fontFamily: 'monospace', fontSize: '13px', background: 'rgba(59,130,246,0.1)', color: 'var(--accent)', padding: '3px 10px', borderRadius: '6px' }}>
              {course.course_code}
            </code>
            <span style={{ fontSize: '12px', color: 'var(--text3)' }}>Semester {course.semester}</span>
          </div>
          <h2>{course.course_name}</h2>
          <p>{course.enrolled_count} students enrolled · {course.credits} credits</p>
        </div>
      </div>

      {/* Summary Stats */}
      {summary && summary.stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '24px' }}>
          {[
            { label: 'Average Score', value: summary.stats.avg_marks ? Number(summary.stats.avg_marks).toFixed(1) : '—', icon: '📊' },
            { label: 'Highest Score', value: summary.stats.max_marks ?? '—', icon: '🏆' },
            { label: 'Lowest Score', value: summary.stats.min_marks ?? '—', icon: '📉' },
          ].map((s, i) => (
            <div key={i} className="stat-card blue" style={{ padding: '14px' }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>{s.icon}</div>
              <div style={{ fontFamily: 'monospace', fontSize: '20px', fontWeight: '700' }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}

          {/* Grade distribution */}
          {summary.grade_distribution.length > 0 && (
            <div className="stat-card purple" style={{ padding: '14px', gridColumn: 'span 2' }}>
              <div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Grade Distribution</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {summary.grade_distribution.map(g => (
                  <div key={g.grade} style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: '700', fontFamily: 'monospace', color: gradeColor(g.grade) }}>{g.grade}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text3)' }}>{g.count}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="alert alert-info" style={{ marginBottom: '20px' }}>
        💡 Edit marks inline and click <strong>Save</strong> on each row. Internal marks: 0–50. External marks: 0–60.
      </div>

      {/* Students Table */}
      {loading ? (
        <div className="spinner" style={{ marginTop: '40px' }} />
      ) : students.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👨‍🎓</div>
          <p>No students enrolled in this course.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Roll No.</th>
                <th>Student Name</th>
                <th>Internal (max 50)</th>
                <th>External (max 60)</th>
                <th>Total</th>
                <th>Grade</th>
                <th>Remarks</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, idx) => {
                const rid = s.result_id;
                const isSaving = saving[rid];
                const isSaved = saved[rid];
                const err = errors[rid];
                const hasEdit = !!edits[rid] && Object.keys(edits[rid]).length > 0;

                const intVal = getEditValue(s, 'marks_internal');
                const extVal = getEditValue(s, 'marks_external');
                const computedTotal = (parseFloat(intVal) || 0) + (parseFloat(extVal) || 0);
                const displayTotal = (intVal !== '' && extVal !== '') ? computedTotal.toFixed(1) : (s.marks_total ?? '—');

                return (
                  <React.Fragment key={s.enrollment_id}>
                    <tr style={{ borderLeft: hasEdit ? '3px solid var(--yellow)' : '3px solid transparent' }}>
                      <td style={{ color: 'var(--text3)', fontFamily: 'monospace' }}>{idx + 1}</td>
                      <td><code style={{ fontFamily: 'monospace', fontSize: '11px' }}>{s.roll_number}</code></td>
                      <td><strong>{s.student_name}</strong></td>

                      {/* Internal */}
                      <td>
                        <input
                          type="number"
                          min="0" max="50" step="0.5"
                          className="marks-input"
                          value={getEditValue(s, 'marks_internal')}
                          onChange={e => handleEdit(rid, 'marks_internal', e.target.value)}
                          placeholder="—"
                        />
                      </td>

                      {/* External */}
                      <td>
                        <input
                          type="number"
                          min="0" max="60" step="0.5"
                          className="marks-input"
                          value={getEditValue(s, 'marks_external')}
                          onChange={e => handleEdit(rid, 'marks_external', e.target.value)}
                          placeholder="—"
                        />
                      </td>

                      {/* Total (computed) */}
                      <td style={{ fontFamily: 'monospace', fontWeight: '700', textAlign: 'center' }}>
                        {displayTotal}
                      </td>

                      {/* Grade */}
                      <td>
                        <select
                          style={{
                            padding: '5px 8px',
                            background: 'var(--surface2)',
                            border: '1px solid var(--border)',
                            borderRadius: '6px',
                            color: gradeColor(getEditValue(s, 'grade')),
                            fontFamily: 'monospace',
                            fontWeight: '700',
                            fontSize: '13px',
                            outline: 'none',
                            cursor: 'pointer',
                          }}
                          value={getEditValue(s, 'grade')}
                          onChange={e => handleEdit(rid, 'grade', e.target.value)}
                        >
                          <option value="">—</option>
                          {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                      </td>

                      {/* Remarks */}
                      <td>
                        <input
                          style={{
                            padding: '5px 10px',
                            background: 'var(--surface2)',
                            border: '1px solid var(--border)',
                            borderRadius: '6px',
                            color: 'var(--text)',
                            fontSize: '12px',
                            width: '140px',
                            outline: 'none',
                          }}
                          value={getEditValue(s, 'remarks')}
                          onChange={e => handleEdit(rid, 'remarks', e.target.value)}
                          placeholder="Optional..."
                        />
                      </td>

                      {/* Save Button */}
                      <td>
                        {isSaved ? (
                          <span style={{ color: 'var(--green)', fontSize: '13px', fontWeight: '600' }}>✅ Saved</span>
                        ) : (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleSaveRow(s)}
                            disabled={isSaving}
                          >
                            {isSaving ? '...' : '💾 Save'}
                          </button>
                        )}
                      </td>
                    </tr>
                    {err && (
                      <tr>
                        <td colSpan={9} style={{ padding: '4px 16px 8px', color: 'var(--red)', fontSize: '12px' }}>
                          ⚠️ {err}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
