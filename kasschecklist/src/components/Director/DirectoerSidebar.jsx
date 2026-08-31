import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../assets/Logo.png';

export default function DisciplineSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const displayName = currentUser ? currentUser.full_name : null;
  const initials = displayName
    ? displayName.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase()
    : '';
  const roleLabel = currentUser?.role
    ? currentUser.role.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, c => c.toUpperCase())
    : 'Staff';

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@600;700&display=swap');

        :root {
          --sidebar-width: 280px;
          --sidebar-bg: #0A1F17;
          --sidebar-surface: #132E22;
          --sidebar-surface-hover: #1A3E30;
          --sidebar-border: rgba(52, 211, 153, 0.12);
          --accent-primary: #10B981;
          --accent-glow: rgba(16, 185, 129, 0.25);
          --accent-success: #34D399;
          --accent-danger: #EF4444;
          --accent-danger-soft: rgba(239, 68, 68, 0.12);
          --text-main: #F0FDF4;
          --text-muted: #94A3B8;
        }

        /* ===== FIX: Push main content to avoid sidebar overlap ===== */
        body {
          margin: 0;
          padding-left: var(--sidebar-width);
          background-color: #F4F6F9;
          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
          box-sizing: border-box;
          transition: padding-left 0.35s ease;
        }

        /* ===== Mobile Toggle Button ===== */
        .mobile-nav-toggle {
          display: none;
          position: fixed;
          top: 16px;
          left: 16px;
          z-index: 1100;
          background: var(--sidebar-bg);
          color: var(--text-main);
          border: 1px solid var(--sidebar-border);
          padding: 10px 12px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 18px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .mobile-nav-toggle:hover {
          background: var(--sidebar-surface);
        }

        /* ===== Overlay for Mobile ===== */
        .sidebar-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(10, 31, 23, 0.65);
          backdrop-filter: blur(4px);
          z-index: 999;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .sidebar-overlay.visible {
          display: block;
          opacity: 1;
        }

        /* ===== Main Sidebar Structure ===== */
        .discipline-sidebar {
          width: var(--sidebar-width);
          height: 100vh;
          background: linear-gradient(180deg, var(--sidebar-bg) 0%, #050F0B 100%);
          color: var(--text-main);
          position: fixed;
          top: 0;
          left: 0;
          padding: 24px 16px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-right: 1px solid var(--sidebar-border);
          box-shadow: 15px 0 35px rgba(0, 0, 0, 0.25);
          z-index: 1000;
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .sidebar-top {
          display: flex;
          flex-direction: column;
          gap: 24px;
          overflow-y: auto;
          overflow-x: hidden;
          padding-right: 2px;
        }

        .sidebar-top::-webkit-scrollbar {
          width: 4px;
        }

        .sidebar-top::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }

        /* ===== Brand Header ===== */
        .sidebar-header {
          padding: 14px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--sidebar-border);
          border-radius: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          backdrop-filter: blur(8px);
        }

        .sidebar-logo-icon {
          flex: none;
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--accent-primary), #047857);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 14px;
          box-shadow: 0 4px 12px var(--accent-glow);
          overflow: hidden;
        }

        .sidebar-logo-icon img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .sidebar-title-group {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .sidebar-title {
          margin: 0;
          font-size: 15px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.3px;
        }

        .sidebar-subtitle {
          margin: 3px 0 0 0;
          font-size: 11px;
          font-weight: 600;
          color: #6EE7B7;
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }

        /* ===== Navigation Section ===== */
        .sidebar-section-label {
          font-size: 10.5px;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          color: var(--text-muted);
          font-weight: 700;
          padding: 0 12px;
          margin-top: 6px;
          margin-bottom: 6px;
        }

        .sidebar-links {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-decoration: none;
          padding: 12px 14px;
          border-radius: 12px;
          font-size: 13.5px;
          font-weight: 500;
          transition: all 0.25s ease;
          color: var(--text-muted);
          background-color: transparent;
          border: 1px solid transparent;
        }

        .sidebar-link-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sidebar-link-content span:first-child {
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          opacity: 0.8;
          transition: opacity 0.2s ease;
        }

        .sidebar-link.active {
          color: #ffffff;
          background: linear-gradient(90deg, rgba(16, 185, 129, 0.22), rgba(16, 185, 129, 0.05));
          border-color: rgba(16, 185, 129, 0.4);
          font-weight: 600;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.1);
        }

        .sidebar-link.active .sidebar-link-content span:first-child {
          opacity: 1;
        }

        .sidebar-link:not(.active):hover {
          color: var(--text-main);
          background-color: var(--sidebar-surface);
          border-color: var(--sidebar-border);
        }

        .sidebar-link:focus-visible {
          outline: 2px solid var(--accent-primary);
          outline-offset: 2px;
        }

        /* ===== Bottom Section ===== */
        .sidebar-bottom-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-top: 12px;
          border-top: 1px solid var(--sidebar-border);
        }

        .identity-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 12px;
          background: var(--sidebar-surface);
          border: 1px solid var(--sidebar-border);
        }

        .identity-card__avatar {
          flex: none;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--accent-primary), #047857);
          color: white;
          font-family: 'JetBrains Mono', monospace;
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
          font-size: 13px;
          font-weight: 600;
          color: var(--text-main);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .identity-card__role {
          margin: 2px 0 0;
          font-size: 10.5px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-muted);
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 14px;
          background-color: var(--accent-danger-soft);
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: #F87171;
          border-radius: 12px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .logout-btn:hover {
          background-color: var(--accent-danger);
          color: #ffffff;
          border-color: var(--accent-danger);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        .sidebar-footer {
          padding: 10px 12px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.02);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .footer-school-name {
          font-size: 11px;
          font-weight: 600;
          color: #CBD5E1;
        }

        .footer-status-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          color: var(--text-muted);
          font-family: 'JetBrains Mono', monospace;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          background-color: var(--accent-success);
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(52, 211, 153, 0.6);
        }

        /* ===== Responsive Media Query ===== */
        @media (max-width: 900px) {
          body {
            padding-left: 0;
          }
          .mobile-nav-toggle {
            display: flex;
          }
          .discipline-sidebar {
            transform: translateX(-100%);
          }
          .discipline-sidebar.open {
            transform: translateX(0);
          }
        }
      `}</style>

      {/* Mobile Hamburger Trigger Button */}
      <button 
        className="mobile-nav-toggle" 
        onClick={toggleSidebar}
        aria-label="Toggle Navigation Menu"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Backdrop Overlay for Mobile */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'visible' : ''}`} 
        onClick={toggleSidebar}
      />

      {/* Sidebar Container */}
      <div className={`discipline-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-top">
          {/* Header Card */}
          <div className="sidebar-header">
            <div className="sidebar-logo-icon">
              {logo ? <img src={logo} alt="School logo" /> : 'K'}
            </div>
            <div className="sidebar-title-group">
              <h3 className="sidebar-title">Discipline Office</h3>
              <p className="sidebar-subtitle">Director of Discipline</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="sidebar-links">
            <div className="sidebar-section-label">Main Menu</div>

            <Link
              to="/dirdispdashbo"
              onClick={() => setIsOpen(false)}
              className={`sidebar-link ${isActive('/dirdispdashbo') ? 'active' : ''}`}
            >
              <div className="sidebar-link-content">
                <span>📊</span> Dashboard
              </div>
            </Link>

            <Link
              to="/DirStudentlist"
              onClick={() => setIsOpen(false)}
              className={`sidebar-link ${isActive('/DirStudentlist') ? 'active' : ''}`}
            >
              <div className="sidebar-link-content">
                <span>🎓</span> Student List
              </div>
            </Link>

            <div className="sidebar-section-label" style={{ marginTop: '12px' }}>Inventory & Audit</div>

            <Link
              to="/DirMaterialslist"
              onClick={() => setIsOpen(false)}
              className={`sidebar-link ${isActive('/DirMaterialslist') ? 'active' : ''}`}
            >
              <div className="sidebar-link-content">
                <span>📦</span> All Materials
              </div>
            </Link>

            <Link
              to="/DirAllStuMate"
              onClick={() => setIsOpen(false)}
              className={`sidebar-link ${isActive('/DirAllStuMate') ? 'active' : ''}`}
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