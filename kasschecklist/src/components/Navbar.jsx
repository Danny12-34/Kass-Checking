import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import CREST_SRC from './assets/Logo.png';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={styles.nav}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@500;600;700&display=swap');

        .kass-navlink {
          position: relative;
          text-decoration: none;
          font-family: 'Inter', system-ui, sans-serif;
          font-weight: 600;
          font-size: 12.5px;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: #cdd6e6;
          padding: 10px 16px;
          border-radius: 3px;
          transition: color 0.2s ease, background 0.2s ease;
          white-space: nowrap;
        }
        .kass-navlink:hover {
          color: #f4e4b0;
          background: rgba(212, 175, 55, 0.08);
        }
        .kass-navlink.active {
          color: #1a2744;
          background: linear-gradient(180deg, #e8c766 0%, #c9a227 100%);
          font-weight: 700;
          box-shadow: 0 2px 6px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.4);
        }
        .kass-navlink.login-link {
          color: #1a2744;
          background: #f5f1e6;
          border: 1px solid rgba(201,162,39,0.5);
        }
        .kass-navlink.login-link:hover {
          background: #fff;
          color: #1a2744;
        }
        .kass-navlink.login-link.active {
          background: linear-gradient(180deg, #e8c766 0%, #c9a227 100%);
        }

        /* ===== Layout: brand, burger, links as one row on large screens ===== */
        .kass-inner {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px 20px;
          padding: 12px 22px;
        }

        .kass-brand {
          order: 1;
          display: flex;
          align-items: center;
          gap: 14px;
          flex-shrink: 0;
        }

        .kass-burger {
          order: 2;
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 5px;
          width: 40px;
          height: 40px;
          background: rgba(232, 199, 102, 0.1);
          border: 1px solid rgba(201,162,39,0.4);
          border-radius: 6px;
          cursor: pointer;
          flex-shrink: 0;
          padding: 0;
          margin-left: auto;
        }
        .kass-burger-bar {
          width: 20px;
          height: 2px;
          background: #e8c766;
          border-radius: 2px;
          transition: transform 0.25s ease, opacity 0.25s ease;
        }
        .kass-burger.open .kass-burger-bar:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }
        .kass-burger.open .kass-burger-bar:nth-child(2) {
          opacity: 0;
        }
        .kass-burger.open .kass-burger-bar:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        /* Large screens: links sit inline, right-aligned, next to brand */
        .kass-links-wrap {
          order: 3;
          display: flex;
          align-items: center;
          gap: 4px;
          flex: 1;
          justify-content: flex-end;
          overflow-x: auto;
          padding: 2px;
          scrollbar-width: none;
        }
        .kass-links-wrap::-webkit-scrollbar { display: none; }

        .kass-divider {
          width: 1px;
          height: 22px;
          background: rgba(201,162,39,0.35);
          margin: 0 6px;
          flex-shrink: 0;
        }

        @media (max-width: 900px) {
          .kass-brand-text { display: none !important; }
        }

        /* ===== Small screens only: burger appears, links become a full-width dropdown ===== */
        @media (max-width: 780px) {
          .kass-burger { display: flex; }

          .kass-links-wrap {
            order: 4;
            flex-basis: 100%;
            flex: none;
            justify-content: flex-start;
            display: none;
            flex-direction: column;
            align-items: stretch;
            gap: 2px;
            overflow-x: visible;
            max-height: 0;
            opacity: 0;
            padding: 0;
            transition: max-height 0.25s ease, opacity 0.2s ease, padding 0.25s ease;
          }
          .kass-links-wrap.open {
            display: flex;
            max-height: 480px;
            opacity: 1;
            padding: 10px 0 4px;
          }
          .kass-links-wrap .kass-navlink {
            width: 100%;
            box-sizing: border-box;
            text-align: left;
            padding: 12px 14px;
          }
          .kass-links-wrap .kass-divider {
            width: 100%;
            height: 1px;
            margin: 6px 0;
          }
        }
      `}</style>

      <div style={styles.topRule} />

      <div className="kass-inner">
        <div className="kass-brand">
          <div style={styles.crestRing}>
            <img src={CREST_SRC} alt="KASS crest" style={styles.crestImg} />
          </div>
          <div className="kass-brand-text" style={styles.brandText}>
            <span style={styles.eyebrow}>Karenga Adventist Secondary School</span>
            <h2 style={styles.title}>Discipline Office</h2>
          </div>
        </div>

        <button
          type="button"
          className={`kass-burger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span className="kass-burger-bar" />
          <span className="kass-burger-bar" />
          <span className="kass-burger-bar" />
        </button>

        <div className={`kass-links-wrap${menuOpen ? ' open' : ''}`}>
          <NavLink
            to="/"
            end
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) => `kass-navlink${isActive ? ' active' : ''}`}
          >
            Home Dashboard
          </NavLink>

          <span className="kass-divider" />
          <NavLink
            to="/Login"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) => `kass-navlink login-link${isActive ? ' active' : ''}`}
          >
            Login
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: 'relative',
    marginBottom: '28px',
    background: 'linear-gradient(180deg, #1f2f52 0%, #172441 100%)',
    borderRadius: '10px',
    boxShadow: '0 10px 30px -12px rgba(23,36,65,0.5), 0 1px 0 rgba(255,255,255,0.04) inset',
    overflow: 'hidden',
  },
  topRule: {
    height: '3px',
    width: '100%',
    background: 'linear-gradient(90deg, #8a6d1f 0%, #e8c766 20%, #c9a227 50%, #e8c766 80%, #8a6d1f 100%)',
  },
  crestRing: {
    width: '46px',
    height: '46px',
    borderRadius: '50%',
    padding: '2px',
    background: 'linear-gradient(135deg, #e8c766, #8a6d1f)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
    flexShrink: 0,
  },
  crestImg: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #172441',
    display: 'block',
  },
  brandText: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.15,
  },
  eyebrow: {
    fontFamily: "'Inter', system-ui, sans-serif",
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: '#9aa7c2',
    marginBottom: '3px',
  },
  title: {
    margin: 0,
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '21px',
    fontWeight: 700,
    color: '#f5f1e6',
    letterSpacing: '0.01em',
  },
};