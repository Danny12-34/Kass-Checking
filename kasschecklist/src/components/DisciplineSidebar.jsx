import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // adjust path to where AuthContext.jsx lives
import logo from './assets/Logo.png'; // adjust path/extension to match your logo file

export default function DisciplineSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout(); // clears the httpOnly session cookie server-side
    navigate('/login');
  };

  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const closeSidebar = () => setIsOpen(false);

  const displayName = currentUser ? currentUser.full_name : null;
  const initials = displayName
    ? displayName.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase()
    : '';
  const roleLabel = currentUser?.role
    ? currentUser.role.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, c => c.toUpperCase())
    : 'Staff';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@600;700&display=swap');

        :root {
          --sb-ink-900: #16223D;
          --sb-ink-950: #0C1526;
          --sb-brass: #B8863B;
          --sb-brass-soft: rgba(184, 134, 59, 0.16);
          --sb-verified: #2F6B4F;
          --sb-alert: #C0524F;
          --sb-alert-soft: rgba(192, 82, 79, 0.14);
          --sb-text: #EDEFF5;
          --sb-text-dim: #8E9AB8;
        }

        html, body {
          overflow-x: hidden;
          max-width: 100%;
        }

        body {
          margin: 0;
          padding-left: 280px;
          background-color: #FBFAF7;
        }

        .discipline-sidebar {
          width: 280px;
          height: 100vh;
          background: linear-gradient(165deg, var(--sb-ink-900) 0%, var(--sb-ink-950) 100%);
          color: var(--sb-text);
          position: fixed;
          top: 0;
          left: 0;
          padding: 22px 14px;
          font-family: 'IBM Plex Sans', system-ui, -apple-system, sans-serif;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-right: 1px solid rgba(184, 134, 59, 0.15);
          box-shadow: 10px 0 30px rgba(0, 0, 0, 0.25);
          z-index: 1000;
          transition: transform 0.3s ease;
        }

        .sidebar-top {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* ===== Crest header ===== */
        .sidebar-header {
          padding: 14px 14px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(184, 134, 59, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sidebar-logo-icon {
          flex: none;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: var(--sb-brass);
          color: var(--sb-ink-950);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Fraunces', serif;
          font-weight: 700;
          font-size: 12.5px;
          letter-spacing: 0.3px;
          overflow: hidden;
        }

        .sidebar-logo-icon img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        .sidebar-title-group {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .sidebar-title {
          margin: 0;
          font-family: 'Fraunces', serif;
          font-size: 15.5px;
          font-weight: 600;
          color: #ffffff;
          letter-spacing: -0.2px;
        }

        .sidebar-subtitle {
          margin: 2px 0 0 0;
          font-size: 10.5px;
          font-weight: 600;
          color: var(--sb-brass);
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        /* ===== Nav ===== */
        .sidebar-section-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          color: var(--sb-text-dim);
          font-weight: 700;
          padding: 0 14px;
          margin-top: 6px;
          margin-bottom: 4px;
        }

        .sidebar-links {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-decoration: none;
          padding: 11px 14px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 500;
          transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
          color: var(--sb-text-dim);
          background-color: transparent;
          border: 1px solid transparent;
        }

        .sidebar-link-content {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .sidebar-link-content span:first-child {
          font-size: 15px;
          opacity: 0.85;
        }

        .sidebar-link.active {
          color: #ffffff;
          background: var(--sb-brass-soft);
          border-color: rgba(184, 134, 59, 0.4);
          font-weight: 600;
        }

        .sidebar-link.active .sidebar-link-content span:first-child {
          opacity: 1;
        }

        .sidebar-link.inactive:hover {
          color: var(--sb-text);
          background-color: rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 255, 255, 0.06);
        }

        .sidebar-link:focus-visible {
          outline: 2px solid var(--sb-brass);
          outline-offset: 2px;
        }

        .sidebar-badge {
          background: rgba(47, 107, 79, 0.18);
          color: #6FCF9E;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.4px;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 20px;
          border: 1px solid rgba(47, 107, 79, 0.35);
        }

        /* ===== Identity card ===== */
        .sidebar-bottom-section {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .identity-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
        }

        .identity-card__avatar {
          flex: none;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: var(--sb-brass);
          color: var(--sb-ink-950);
          font-family: 'IBM Plex Mono', monospace;
          font-weight: 700;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .identity-card__text {
          min-width: 0;
        }

        .identity-card__name {
          margin: 0;
          font-size: 12.5px;
          font-weight: 600;
          color: var(--sb-text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .identity-card__role {
          margin: 1px 0 0;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: var(--sb-text-dim);
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 11px;
          width: 100%;
          padding: 11px 14px;
          background-color: var(--sb-alert-soft);
          border: 1px solid rgba(192, 82, 79, 0.3);
          color: #E4918F;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
          box-sizing: border-box;
        }

        .logout-btn:hover {
          background-color: rgba(192, 82, 79, 0.28);
          color: #ffffff;
          border-color: rgba(192, 82, 79, 0.5);
        }

        .logout-btn:focus-visible {
          outline: 2px solid var(--sb-alert);
          outline-offset: 2px;
        }

        .sidebar-footer {
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          background: rgba(255, 255, 255, 0.02);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .footer-school-name {
          font-size: 11.5px;
          font-weight: 600;
          color: #C9CFDE;
        }

        .footer-status-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 10.5px;
          color: var(--sb-text-dim);
          font-family: 'IBM Plex Mono', monospace;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          background-color: #6FCF9E;
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(111, 207, 158, 0.6);
        }

        /* ===== Hamburger button (hidden on desktop) ===== */
        .discipline-hamburger {
          display: none;
          position: fixed;
          top: 16px;
          left: 16px;
          z-index: 1200;
          width: 42px;
          height: 42px;
          border-radius: 10px;
          border: 1px solid rgba(184, 134, 59, 0.3);
          background: var(--sb-ink-950);
          color: var(--sb-text);
          font-size: 18px;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        /* ===== Backdrop (hidden on desktop) ===== */
        .discipline-backdrop {
          display: none;
        }

        /* ===== Responsive: collapse into an off-canvas drawer ===== */
        @media (max-width: 900px) {
          body {
            padding-left: 0;
          }

          .discipline-hamburger {
            display: flex;
          }

          .discipline-sidebar {
            transform: translateX(-100%);
            max-width: 82vw;
          }

          .discipline-sidebar.open {
            transform: translateX(0);
          }

          .discipline-backdrop {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(12, 21, 38, 0.55);
            z-index: 999;
            backdrop-filter: blur(2px);
          }
        }

        @media (max-width: 480px) {
          .discipline-sidebar {
            width: 260px;
          }

          .discipline-hamburger {
            top: 12px;
            left: 12px;
            width: 38px;
            height: 38px;
            font-size: 16px;
          }
        }
      `}</style>

      {/* Mobile Hamburger Toggle Button */}
      <button
        className="discipline-hamburger"
        onClick={toggleSidebar}
        aria-label="Toggle Navigation"
        aria-expanded={isOpen}
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Backdrop overlay for mobile screen view */}
      {isOpen && <div className="discipline-backdrop" onClick={closeSidebar} />}

      <div className={`discipline-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-top">
          {/* Header Card */}
          <div className="sidebar-header">
            <div className="sidebar-logo-icon">
              <img src={logo} alt="School logo" />
            </div>
            <div className="sidebar-title-group">
              <h3 className="sidebar-title">Discipline Office</h3>
              <p className="sidebar-subtitle">Management Register</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="sidebar-links">
            <div className="sidebar-section-label">Main Menu</div>

            <Link
              to="/DisDashboard"
              onClick={closeSidebar}
              className={`sidebar-link ${isActive('/DisDashboard') ? 'active' : 'inactive'}`}
            >
              <div className="sidebar-link-content">
                <span>📊</span> Dashboard
              </div>
            </Link>

            <Link
              to="/Studentlist"
              onClick={closeSidebar}
              className={`sidebar-link ${isActive('/Studentlist') ? 'active' : 'inactive'}`}
            >
              <div className="sidebar-link-content">
                <span>🎓</span> Student List
              </div>
            </Link>

            <div className="sidebar-section-label" style={{ marginTop: '12px' }}>Inventory & Audit</div>

            <Link
              to="/MaterialsList"
              onClick={closeSidebar}
              className={`sidebar-link ${isActive('/MaterialsList') ? 'active' : 'inactive'}`}
            >
              <div className="sidebar-link-content">
                <span>➕</span> All Materials
              </div>
            </Link>

            <Link
              to="/MaterialsTable"
              onClick={closeSidebar}
              className={`sidebar-link ${isActive('/MaterialsTable') ? 'active' : 'inactive'}`}
            >
              <div className="sidebar-link-content">
                <span>📋</span> Check Student
              </div>
              <span className="sidebar-badge">Live</span>
            </Link>

            <Link
              to="/AllStuMat"
              onClick={closeSidebar}
              className={`sidebar-link ${isActive('/AllStuMat') ? 'active' : 'inactive'}`}
            >
              <div className="sidebar-link-content">
                <span>📑</span> Checked Details
              </div>
            </Link>
          </div>
        </div>

        {/* Bottom Section: Identity, Logout & Footer */}
        <div className="sidebar-bottom-section">
          {displayName && (
            <div className="identity-card">
              <div className="identity-card__avatar">{initials}</div>
              <div className="identity-card__text">
                <p className="identity-card__name">{displayName}</p>
                <p className="identity-card__role">{roleLabel}</p>
              </div>
            </div>
          )}

          <button onClick={handleLogout} className="logout-btn">
            <span>🚪</span> Logout
          </button>

          <div className="sidebar-footer">
            <span className="footer-school-name">Karenge Adventist Sec. School</span>
            <div className="footer-status-indicator">
              <span className="status-dot"></span> System online
            </div>
          </div>
        </div>
      </div>
    </>
  );
}