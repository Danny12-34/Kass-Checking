import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './DirectoerSidebar';
import { useAuth } from '../../context/AuthContext';

const API_BASE = 'https://kass-checking-backend.vercel.app/api/v1';

function DisciplineDashboard() {
  const { currentUser } = useAuth();
  const loggedInUser =
    currentUser?.full_name || currentUser?.name || currentUser?.email || 'Director of Discipline';

  const [selectedTerm, setSelectedTerm] = useState('Term 1');
  const [materials, setMaterials] = useState([]);
  const [classes, setClasses] = useState([]);
  const [classStats, setClassStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    loadDashboard(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTerm]);

  const loadDashboard = async (isInitial = false) => {
    try {
      isInitial ? setLoading(true) : setRefreshing(true);
      setError(null);

      const [matRes, classRes] = await Promise.all([
        fetch(`${API_BASE}/getall`),
        fetch(`${API_BASE}/classes`),
      ]);
      if (!matRes.ok) throw new Error('Failed to fetch materials configuration');
      if (!classRes.ok) throw new Error('Failed to fetch classes list');

      const matData = await matRes.json();
      const classDataRaw = await classRes.json();
      const classNames = classDataRaw
        .map((c) => (typeof c === 'object' ? c.class_name || c.name || c.id : c))
        .filter(Boolean);

      setMaterials(matData);
      setClasses(classNames);

      const perClass = await Promise.all(
        classNames.map(async (className) => {
          try {
            const res = await fetch(
              `${API_BASE}/get-students-materials?class=${encodeURIComponent(
                className
              )}&term=${selectedTerm}`
            );
            if (!res.ok) return { className, students: [] };
            const data = await res.json();

            const students = Array.isArray(data)
              ? data.filter(
                  (s) =>
                    (s.class || s.class_name || '')
                      .trim()
                      .toLowerCase() === className.trim().toLowerCase()
                )
              : [];

            return { className, students };
          } catch {
            return { className, students: [] };
          }
        })
      );

      setClassStats(perClass);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const stats = useMemo(() => {
    const totalMaterials = materials.length;
    const totalClasses = classStats.length;

    let totalStudents = 0;
    let fullyVerifiedStudents = 0;
    let totalChecksExpected = 0;
    let totalChecksCompliant = 0;

    const materialAgg = {};
    materials.forEach((m) => {
      materialAgg[m.material] = { compliant: 0, nonCompliant: 0, notChecked: 0, minimum: m.minimum };
    });

    const classRows = classStats
      .map(({ className, students }) => {
        let classFullyVerified = 0;
        const classStudentCount = students.length;

        students.forEach((student) => {
          totalStudents += 1;
          const checks = student.material_checks || [];
          let studentFullyCompliant = totalMaterials > 0;

          materials.forEach((mat) => {
            const record = checks.find((c) => c.material_name === mat.material);
            totalChecksExpected += 1;

            if (
              !record ||
              record.present_material === undefined ||
              record.present_material === '' ||
              record.present_material === null
            ) {
              if (materialAgg[mat.material]) materialAgg[mat.material].notChecked += 1;
              studentFullyCompliant = false;
              return;
            }
            const present = Number(record.present_material);
            const minimum = Number(mat.minimum) || 0;

            if (present >= minimum) {
              if (materialAgg[mat.material]) materialAgg[mat.material].compliant += 1;
              totalChecksCompliant += 1;
            } else {
              if (materialAgg[mat.material]) materialAgg[mat.material].nonCompliant += 1;
              studentFullyCompliant = false;
            }
          });

          if (studentFullyCompliant) {
            fullyVerifiedStudents += 1;
            classFullyVerified += 1;
          }
        });

        const rate =
          classStudentCount > 0
            ? Math.round((classFullyVerified / classStudentCount) * 100)
            : null;

        return {
          className,
          studentCount: classStudentCount,
          checked: classFullyVerified,
          rate,
        };
      })
      .sort((a, b) => (a.rate ?? -1) - (b.rate ?? -1));

    const overallRate =
      totalStudents > 0 ? Math.round((fullyVerifiedStudents / totalStudents) * 100) : 0;
    const checkCoverage =
      totalChecksExpected > 0
        ? Math.round((totalChecksCompliant / totalChecksExpected) * 100)
        : 0;

    const materialRows = materials
      .map((m) => {
        const agg = materialAgg[m.material] || { compliant: 0, nonCompliant: 0, notChecked: 0 };
        const denom = agg.compliant + agg.nonCompliant + agg.notChecked;
        const rate = denom > 0 ? Math.round((agg.compliant / denom) * 100) : 0;
        return { name: m.material, minimum: m.minimum, ...agg, rate };
      })
      .sort((a, b) => a.rate - b.rate);

    const needsAttention = classRows.filter((c) => c.rate !== null && c.rate < 60);

    return {
      totalMaterials,
      totalClasses,
      totalStudents,
      fullyVerifiedStudents,
      overallRate,
      checkCoverage,
      classRows,
      materialRows,
      needsAttention,
    };
  }, [materials, classStats]);

  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - (stats.overallRate / 100) * circumference;

  // SVG Line Graph calculation
  const lineGraphData = useMemo(() => {
    const data = stats.classRows;
    if (!data.length) return { points: '', pointsList: [], gridLines: [] };

    const svgWidth = 500;
    const svgHeight = 220;
    const padding = { top: 20, right: 30, bottom: 40, left: 40 };

    const chartWidth = svgWidth - padding.left - padding.right;
    const chartHeight = svgHeight - padding.top - padding.bottom;

    const pointsList = data.map((item, index) => {
      const x =
        data.length === 1
          ? padding.left + chartWidth / 2
          : padding.left + (index / (data.length - 1)) * chartWidth;
      const rateVal = item.rate ?? 0;
      const y = padding.top + chartHeight - (rateVal / 100) * chartHeight;
      return { x, y, name: item.className, rate: item.rate };
    });

    const points = pointsList.map((p) => `${p.x},${p.y}`).join(' ');

    const gridLines = [0, 25, 50, 75, 100].map((val) => ({
      val,
      y: padding.top + chartHeight - (val / 100) * chartHeight,
    }));

    return { points, pointsList, gridLines, svgWidth, svgHeight, padding };
  }, [stats.classRows]);

  if (loading) {
    return (
      <div className="portal-layout">
        <Sidebar />
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Compiling operations summary...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="portal-layout">
        <Sidebar />
        <div className="error-screen">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>System Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="portal-layout">
      <Sidebar />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        :root {
          --bg-main: #f8fafc;
          --surface-card: #ffffff;
          --border-color: #e2e8f0;
          --text-primary: #0f172a;
          --text-muted: #64748b;
          --accent-blue: #2563eb;
          --accent-green: #10b981;
          --accent-warn: #f59e0b;
          --accent-bad: #ef4444;
        }

        * { box-sizing: border-box; }
        html, body { 
          margin: 0; 
          background-color: var(--bg-main); 
          font-family: 'Plus Jakarta Sans', sans-serif; 
          color: var(--text-primary);
          overflow-x: hidden;
        }

        .portal-layout { 
          display: flex; 
          min-height: 100vh; 
          width: 100%;
          overflow-x: hidden;
        }

        .dash-main { 
          flex: 1; 
          padding: 32px 40px; 
          width: 100%; 
          max-width: 1400px; 
          margin: 0 auto;
          min-width: 0;
        }

        .dash-header {
          display: flex; 
          justify-content: space-between; 
          align-items: center;
          background: var(--surface-card); 
          padding: 24px 32px; 
          border-radius: 20px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05); 
          margin-bottom: 24px;
          border: 1px solid var(--border-color);
          gap: 16px;
        }
        .dash-header h2 { margin: 0 0 4px 0; font-size: 24px; font-weight: 800; letter-spacing: -0.02em; color: var(--text-primary); }
        .dash-header p { margin: 0; font-size: 13px; color: var(--text-muted); font-weight: 500; }
        .header-right { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
        .last-updated { font-size: 12px; color: #94a3b8; font-weight: 600; text-align: right; }

        .term-select {
          background: #f1f5f9; border: 1px solid var(--border-color); padding: 10px 16px;
          border-radius: 12px; font-size: 14px; font-weight: 700; color: #1e293b;
          outline: none; cursor: pointer; transition: all 0.2s ease;
        }
        .term-select:hover { border-color: #cbd5e1; }

        .refresh-btn {
          background: var(--text-primary); color: #fff; border: none; padding: 10px 18px;
          border-radius: 12px; font-weight: 700; font-size: 13px; cursor: pointer;
          display: flex; align-items: center; gap: 8px; transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .refresh-btn:hover { background: #1e293b; transform: translateY(-1px); }
        .refresh-btn:disabled { background: #94a3b8; cursor: not-allowed; transform: none; }
        .refresh-icon.spinning { animation: spin 0.9s linear infinite; }

        .hero-grid { display: grid; grid-template-columns: 300px 1fr; gap: 20px; margin-bottom: 24px; }

        .gauge-card {
          background: linear-gradient(145deg, #0f172a 0%, #1e293b 100%); border-radius: 20px; padding: 28px;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 12px; color: #fff; box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.15);
        }
        .gauge-card .gauge-label { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; }
        .gauge-card .gauge-sub { font-size: 13px; color: #cbd5e1; text-align: center; font-weight: 500; margin: 0; }

        .kpi-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .kpi-card {
          background: var(--surface-card); border: 1px solid var(--border-color); border-radius: 20px;
          padding: 24px; display: flex; flex-direction: column; justify-content: space-between;
          box-shadow: 0 1px 3px 0 rgba(0,0,0,0.02); transition: transform 0.2s, box-shadow 0.2s;
        }
        .kpi-card:hover { transform: translateY(-2px); box-shadow: 0 8px 12px -3px rgba(0,0,0,0.04); }
        .kpi-card .kpi-icon {
          width: 42px; height: 42px; border-radius: 12px; display: flex;
          align-items: center; justify-content: center; margin-bottom: 16px;
        }
        .kpi-icon.blue { background: #eff6ff; color: #2563eb; }
        .kpi-icon.green { background: #f0fdf4; color: #16a34a; }
        .kpi-icon.amber { background: #fffbeb; color: #b45309; }
        .kpi-value { font-size: 32px; font-weight: 800; letter-spacing: -0.03em; color: var(--text-primary); }
        .kpi-label { font-size: 13px; color: var(--text-muted); font-weight: 600; margin-top: 4px; }

        .attention-banner {
          display: flex; align-items: center; gap: 12px; background: #fef2f2; color: #991b1b;
          border: 1px solid #fecaca; padding: 14px 20px; border-radius: 14px;
          font-size: 13px; font-weight: 700; margin-bottom: 24px;
        }

        .panels-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 24px; }

        .panel {
          background: var(--surface-card); border: 1px solid var(--border-color); border-radius: 20px;
          padding: 28px; box-shadow: 0 1px 3px 0 rgba(0,0,0,0.02);
          min-width: 0;
        }
        .panel h3 { margin: 0 0 4px 0; font-size: 17px; font-weight: 800; color: var(--text-primary); }
        .panel .panel-sub { margin: 0 0 20px 0; font-size: 13px; color: var(--text-muted); font-weight: 500; }

        .bar-row { display: flex; align-items: center; gap: 14px; padding: 12px 0; }
        .bar-row + .bar-row { border-top: 1px solid #f1f5f9; }
        .bar-row .bar-label { width: 90px; font-size: 13px; font-weight: 700; color: #1e293b; flex-shrink: 0; }
        .bar-row .bar-count { width: 140px; font-size: 12px; color: var(--text-muted); font-weight: 600; flex-shrink: 0; text-align: right; }
        .bar-track { flex: 1; height: 8px; background: #f1f5f9; border-radius: 10px; overflow: hidden; }
        .bar-fill { height: 100%; border-radius: 10px; transition: width 0.6s ease; }
        .bar-pct { width: 44px; text-align: right; font-size: 13px; font-weight: 800; flex-shrink: 0; }

        .fill-good { background: var(--accent-green); }
        .fill-warn { background: var(--accent-warn); }
        .fill-bad { background: var(--accent-bad); }
        .text-good { color: #059669; }
        .text-warn { color: #d97706; }
        .text-bad { color: #dc2626; }

        .line-chart-container { width: 100%; height: 260px; position: relative; }
        .chart-point-node { cursor: pointer; transition: r 0.2s ease; }
        .chart-point-node:hover { r: 6; }

        .empty-note { text-align: center; padding: 40px 0; color: #94a3b8; font-weight: 500; font-size: 13px; }

        .loading-screen, .error-screen {
          flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 16px; font-weight: 600; color: #475569; padding: 20px;
        }
        .error-screen { color: #ef4444; }
        .spinner { width: 40px; height: 40px; border: 4px solid #e2e8f0; border-top-color: #0f172a; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .footer-note { text-align: center; margin-top: 32px; font-size: 12px; color: #94a3b8; font-weight: 500; }

        /* RESPONSIVE LAYOUT BREAKPOINTS */
        @media (max-width: 1100px) { 
          .panels-grid { grid-template-columns: 1fr; } 
        }

        @media (max-width: 960px) { 
          .hero-grid { grid-template-columns: 1fr; } 
          .dash-main { padding: 24px 20px; }
        }

        @media (max-width: 768px) {
          .dash-header { 
            flex-direction: column; 
            align-items: flex-start; 
            padding: 20px;
          }
          .header-right { 
            width: 100%; 
            justify-content: space-between; 
            margin-top: 8px; 
          }
          .last-updated { width: 100%; text-align: left; }
          .kpi-row { grid-template-columns: 1fr; }
          .panel { padding: 20px 16px; }
        }

        @media (max-width: 540px) {
          .dash-main { padding: 16px 12px; }
          .bar-row { 
            flex-wrap: wrap; 
            gap: 8px; 
            padding: 14px 0;
          }
          .bar-row .bar-label { width: 50%; }
          .bar-pct { width: calc(50% - 8px); }
          .bar-track { width: 100%; flex: auto; order: 3; }
          .bar-row .bar-count { width: 100%; text-align: left; order: 4; font-size: 11px; }
        }
      `}</style>

      <main className="dash-main">
        <div className="dash-header">
          <div>
            <h2>Discipline Operations Dashboard</h2>
            <p>Signed in as {loggedInUser} &bull; Term-wide materials verification summary</p>
          </div>
          <div className="header-right">
            <div className="last-updated">
              {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : ''}
            </div>
            <select
              className="term-select"
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
            >
              <option value="Term 1">Term 1</option>
              <option value="Term 2">Term 2</option>
              <option value="Term 3">Term 3</option>
            </select>
            <button
              className="refresh-btn"
              onClick={() => loadDashboard(false)}
              disabled={refreshing}
            >
              <svg
                className={`refresh-icon ${refreshing ? 'spinning' : ''}`}
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M21 12a9 9 0 1 1-2.64-6.36" />
                <path d="M21 3v6h-6" />
              </svg>
              {refreshing ? 'Refreshing' : 'Refresh'}
            </button>
          </div>
        </div>

        <div className="hero-grid">
          <div className="gauge-card">
            <span className="gauge-label">Fully Verified (100%)</span>
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="54" fill="none" stroke="#334155" strokeWidth="10" />
              <circle
                cx="70"
                cy="70"
                r="54"
                fill="none"
                stroke={
                  stats.overallRate >= 80
                    ? '#10b981'
                    : stats.overallRate >= 50
                    ? '#f59e0b'
                    : '#ef4444'
                }
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 70 70)"
                style={{ transition: 'stroke-dashoffset 0.6s ease' }}
              />
              <text x="70" y="65" textAnchor="middle" fontSize="28" fontWeight="800" fill="#ffffff">
                {stats.overallRate}%
              </text>
              <text x="70" y="86" textAnchor="middle" fontSize="11" fontWeight="600" fill="#94a3b8">
                of students
              </text>
            </svg>
            <p className="gauge-sub">
              {stats.fullyVerifiedStudents} of {stats.totalStudents} fully verified for {selectedTerm}
            </p>
          </div>

          <div className="kpi-row">
            <div className="kpi-card">
              <div>
                <div className="kpi-icon blue">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="kpi-value">{stats.totalStudents}</div>
                <div className="kpi-label">Students tracked across {stats.totalClasses} classes</div>
              </div>
            </div>
            <div className="kpi-card">
              <div>
                <div className="kpi-icon green">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <div className="kpi-value">{stats.checkCoverage}%</div>
                <div className="kpi-label">Individual material checks met minimum</div>
              </div>
            </div>
            <div className="kpi-card">
              <div>
                <div className="kpi-icon amber">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.59 13.41 11 3.82V2h-.18C10.4 2 10 2.4 10 2.82V3.82L.41 13.41a2 2 0 0 0 0 2.83l7.35 7.35a2 2 0 0 0 2.83 0l10.4-10.4a2 2 0 0 0 0-2.78Z" />
                  </svg>
                </div>
                <div className="kpi-value">{stats.totalMaterials}</div>
                <div className="kpi-label">Total Materials to be checked</div>
              </div>
            </div>
          </div>
        </div>

        {stats.needsAttention.length > 0 && (
          <div className="attention-banner">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>
              {stats.needsAttention.length} class{stats.needsAttention.length > 1 ? 'es' : ''} have less than 60% fully verified students for {selectedTerm}: {stats.needsAttention.map((c) => c.className).join(', ')}
            </span>
          </div>
        )}

        <div className="panels-grid">
          <div className="panel">
            <h3>Compliance by Class (100% Complete)</h3>
            <p className="panel-sub">Fully verified students vs total enrollment for {selectedTerm}</p>

            {stats.classRows.length === 0 ? (
              <div className="empty-note">No class data available for this term.</div>
            ) : (
              stats.classRows.map((c) => {
                const tone =
                  c.rate === null
                    ? 'warn'
                    : c.rate >= 80
                    ? 'good'
                    : c.rate >= 50
                    ? 'warn'
                    : 'bad';
                return (
                  <div className="bar-row" key={c.className}>
                    <div className="bar-label">{c.className}</div>
                    <div className="bar-track">
                      <div className={`bar-fill fill-${tone}`} style={{ width: `${c.rate ?? 0}%` }} />
                    </div>
                    <div className={`bar-pct text-${tone}`}>{c.rate === null ? '—' : `${c.rate}%`}</div>
                    <div className="bar-count">
                      <strong>{c.checked}</strong> / {c.studentCount} fully checked
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="panel">
            <h3>Classes Compliance Trend</h3>
            <p className="panel-sub">Verification rate (%) progression across all registered classes</p>

            {stats.classRows.length === 0 ? (
              <div className="empty-note">No class data available to display trend.</div>
            ) : (
              <div className="line-chart-container">
                <svg
                  viewBox={`0 0 ${lineGraphData.svgWidth} ${lineGraphData.svgHeight}`}
                  width="100%"
                  height="100%"
                >
                  {/* Y-Axis horizontal grid lines */}
                  {lineGraphData.gridLines.map((g) => (
                    <g key={g.val}>
                      <line
                        x1={lineGraphData.padding.left}
                        y1={g.y}
                        x2={lineGraphData.svgWidth - lineGraphData.padding.right}
                        y2={g.y}
                        stroke="#f1f5f9"
                        strokeWidth="1"
                      />
                      <text
                        x={lineGraphData.padding.left - 8}
                        y={g.y + 4}
                        fill="#94a3b8"
                        fontSize="10"
                        fontWeight="600"
                        textAnchor="end"
                      >
                        {g.val}%
                      </text>
                    </g>
                  ))}

                  {/* Connected Trend Line */}
                  <polyline
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={lineGraphData.points}
                  />

                  {/* Class Points and X Labels */}
                  {lineGraphData.pointsList.map((p, idx) => (
                    <g key={idx}>
                      {/* Vertical Helper Line */}
                      <line
                        x1={p.x}
                        y1={p.y}
                        x2={p.x}
                        y2={lineGraphData.svgHeight - lineGraphData.padding.bottom}
                        stroke="#e2e8f0"
                        strokeDasharray="2 2"
                      />

                      {/* Point node */}
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="4.5"
                        fill="#ffffff"
                        stroke="#2563eb"
                        strokeWidth="2.5"
                        className="chart-point-node"
                      >
                        <title>{`${p.name}: ${p.rate ?? 0}%`}</title>
                      </circle>

                      {/* Point Percentage Value above point */}
                      <text
                        x={p.x}
                        y={p.y - 8}
                        fill="#0f172a"
                        fontSize="10"
                        fontWeight="700"
                        textAnchor="middle"
                      >
                        {p.rate !== null ? `${p.rate}%` : '—'}
                      </text>

                      {/* X Axis Class Name */}
                      <text
                        x={p.x}
                        y={lineGraphData.svgHeight - 12}
                        fill="#64748b"
                        fontSize="10"
                        fontWeight="600"
                        textAnchor="middle"
                      >
                        {p.name.length > 9 ? `${p.name.substring(0, 7)}...` : p.name}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            )}
          </div>
        </div>

        <p className="footer-note">
          Figures reflect students who have successfully met the minimum check requirements for all inventory items in {selectedTerm}.
        </p>
      </main>
    </div>
  );
}

export default DisciplineDashboard;