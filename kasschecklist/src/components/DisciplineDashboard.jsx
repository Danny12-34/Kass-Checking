import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DisciplineSidebar from './DisciplineSidebar';
import { useAuth } from '../context/AuthContext';
import './DisciplineDashboard.css';

export default function DisciplineDashboard() {
  const [totalStudents, setTotalStudents] = useState(0);
  const [checkedStudentsCount, setCheckedStudentsCount] = useState(0);
  const [lackingStudentsCount, setLackingStudentsCount] = useState(0);
  const [totalClasses, setTotalClasses] = useState(0);
  const [selectedTerm, setSelectedTerm] = useState('Term 1');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Correctly match the property names from AuthContext ({ user, loading })
  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/Login');
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedTerm]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Include credentials: 'include' so backend cookies/sessions pass through
      const studentsRes = await fetch('https://kass-checking-backend.vercel.app/api/v1/students-list', {
        credentials: 'include',
      });
      if (!studentsRes.ok) throw new Error('Failed to fetch students list');
      const studentsData = await studentsRes.json();
      setTotalStudents(studentsData.length || 0);

      const uniqueClasses = new Set(
        studentsData.map((s) => s.class_name || s.class || s.grade).filter(Boolean)
      );
      setTotalClasses(uniqueClasses.size);

      const matRes = await fetch('https://kass-checking-backend.vercel.app/api/v1/getall', {
        credentials: 'include',
      });
      if (!matRes.ok) throw new Error('Failed to fetch materials configuration');
      const materialsData = await matRes.json();

      const studMatRes = await fetch(
        `https://kass-checking-backend.vercel.app/api/v1/get-students-materials?term=${selectedTerm}`,
        { credentials: 'include' }
      );
      if (!studMatRes.ok) throw new Error('Failed to fetch student material records');
      const studMatData = await studMatRes.json();

      let fullyCheckedCount = 0;
      let lackingCount = 0;

      if (materialsData.length > 0 && studMatData.length > 0) {
        studMatData.forEach((student) => {
          const isComplete = materialsData.every((mat) => {
            const record = student.material_checks?.find((c) => c.material_name === mat.material);
            const presentVal = record ? Number(record.present_material) : 0;
            return presentVal >= Number(mat.minimum);
          });

          if (isComplete) {
            fullyCheckedCount++;
          } else {
            lackingCount++;
          }
        });
      } else {
        lackingCount = studentsData.length;
      }

      setCheckedStudentsCount(fullyCheckedCount);
      setLackingStudentsCount(lackingCount);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/Login');
  };

  const totalSafeStudents = totalStudents > 0 ? totalStudents : 1;
  const checkedPercentage = Math.round((checkedStudentsCount / totalSafeStudents) * 100);
  const lackingPercentage = Math.round((lackingStudentsCount / totalSafeStudents) * 100);

  const displayName = user ? (user.full_name || user.name) : null;
  const initials = displayName
    ? displayName.split(' ').filter(Boolean).slice(0, 2).map((n) => n[0]).join('').toUpperCase()
    : '';

  const getStampTone = () => {
    if (loading) return { label: 'TALLYING…', className: 'stamp-loading' };
    if (checkedPercentage >= 80) return { label: 'ON TRACK', className: 'stamp-good' };
    if (checkedPercentage >= 50) return { label: 'IN PROGRESS', className: 'stamp-mid' };
    return { label: 'NEEDS ACTION', className: 'stamp-bad' };
  };

  const stamp = getStampTone();

  if (authLoading) return null;

  return (
    <div className="dd-layout">
      <DisciplineSidebar />

      <main className="dd-main">
        {/* Header section */}
        <header className="dd-header">
          <div className="dd-header-left">
            <div className="dd-logo">KASS</div>
            <div>
              <p className="dd-eyebrow">Discipline Office · Student Register</p>
              <h1 className="dd-title">Material Compliance Ledger</h1>
              <p className="dd-subtitle">Karenga Adventist Secondary School</p>
            </div>
          </div>

          <div className="dd-header-right">
            <select
              className="dd-select"
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
            >
              <option value="Term 1">Term 1</option>
              <option value="Term 2">Term 2</option>
              <option value="Term 3">Term 3</option>
            </select>

            <span className="dd-year-pill">2026</span>

            {displayName && (
              <div className="dd-user-pill">
                <span className="dd-avatar">{initials}</span>
                <span className="dd-user-name">{displayName}</span>
              </div>
            )}

            {user && (
              <button onClick={handleLogout} className="dd-logout-btn">
                Log out
              </button>
            )}
          </div>
        </header>

        {error && (
          <div className="dd-error-banner">
            <span><strong>Record Error:</strong> {error}</span>
          </div>
        )}

        {/* Index Metric Cards */}
        <section className="dd-stats-grid">
          <div className="dd-stat-card">
            <div className="dd-stat-accent dd-accent-slate" />
            <p className="dd-stat-label">Total Students</p>
            <p className="dd-stat-value">{loading ? '—' : totalStudents}</p>
          </div>

          <div className="dd-stat-card">
            <div className="dd-stat-accent dd-accent-amber" />
            <p className="dd-stat-label">Total Classes</p>
            <p className="dd-stat-value">{loading ? '—' : totalClasses}</p>
          </div>

          <div className="dd-stat-card">
            <div className="dd-stat-accent dd-accent-emerald" />
            <p className="dd-stat-label">Fully Checked</p>
            <p className="dd-stat-value dd-value-emerald">{loading ? '—' : checkedStudentsCount}</p>
          </div>

          <div className="dd-stat-card">
            <div className="dd-stat-accent dd-accent-rose" />
            <p className="dd-stat-label">Lacking Items</p>
            <p className="dd-stat-value dd-value-rose">{loading ? '—' : lackingStudentsCount}</p>
          </div>
        </section>

        {/* Combined Compliance Bar Section */}
        <section className="dd-overview-card">
          {/* Status Stamp Badge */}
          <div className={`dd-stamp ${stamp.className}`}>
            <span className="dd-stamp-percent">{loading ? '··' : `${checkedPercentage}%`}</span>
            <span className="dd-stamp-label">{stamp.label}</span>
          </div>

          <div className="dd-overview-heading">
            <h2 className="dd-overview-title">Compliance Overview</h2>
            <p className="dd-overview-subtitle">{selectedTerm} Overall Metrics</p>
          </div>

          {/* Single Combined Stacked Bar */}
          <div className="dd-bar-wrap">
            <div className="dd-bar-header">
              <span className="dd-bar-header-label">Distribution Ratio</span>
              <span className="dd-bar-header-value">
                {checkedStudentsCount} complete · {lackingStudentsCount} lacking
              </span>
            </div>

            <div className="dd-bar-track">
              <div
                style={{ width: `${loading ? 0 : checkedPercentage}%` }}
                className="dd-bar-segment dd-bar-emerald"
              >
                {checkedPercentage > 12 && (
                  <span className="dd-bar-segment-text dd-text-dark">{checkedPercentage}%</span>
                )}
              </div>
              <div
                style={{ width: `${loading ? 0 : lackingPercentage}%` }}
                className="dd-bar-segment dd-bar-rose"
              >
                {lackingPercentage > 12 && (
                  <span className="dd-bar-segment-text dd-text-light">{lackingPercentage}%</span>
                )}
              </div>
            </div>

            {/* Legend */}
            <div className="dd-legend">
              <div className="dd-legend-item">
                <span className="dd-legend-swatch dd-swatch-emerald" />
                <span className="dd-legend-text">Fully Checked ({checkedStudentsCount})</span>
              </div>
              <div className="dd-legend-item">
                <span className="dd-legend-swatch dd-swatch-rose" />
                <span className="dd-legend-text">Lacking ({lackingStudentsCount})</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}