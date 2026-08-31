import React from 'react';
import { Link } from 'react-router-dom';
import campusPhoto from './assets/image.png';
import Navbar from './Navbar';

export default function Home({ totalStudents }) {
  return (
    <div className="disc-home">
      <Navbar />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,500&family=Work+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');

        .disc-home {
          --ink: #22301f;
          --parchment: #f7f1da;
          --paper: #fffdf6;
          --roof-red: #9a3b2a;
          --hedge-green: #2f5233;
          --sun-gold: #dd9f34;
          --sky-blue: #1c5a9c;
          --line: #e3d8b8;
          font-family: 'Work Sans', Arial, sans-serif;
          color: var(--ink);
          background: var(--parchment);
          min-height: 100vh;
        }

        /* ===== HERO ===== */
        .disc-hero {
          position: relative;
          height: 46vh;
          min-height: 320px;
          max-height: 460px;
          overflow: hidden;
        }
        .disc-hero img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .disc-hero::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(13,26,18,0.35) 0%, rgba(13,26,18,0.15) 35%, rgba(13,26,18,0.88) 100%);
        }
        .disc-hero-inner {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 0 clamp(24px, 6vw, 64px) 34px;
          z-index: 1;
        }
        .disc-hero-eyebrow {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--sun-gold);
          margin: 0 0 10px 0;
          font-weight: 600;
        }
        .disc-hero h1 {
          font-family: 'Fraunces', serif;
          font-weight: 700;
          font-size: clamp(28px, 4vw, 46px);
          line-height: 1.06;
          margin: 0 0 12px 0;
          color: #fdfbf3;
          max-width: 640px;
        }
        .disc-hero p {
          font-size: 15px;
          color: #d9dccb;
          margin: 0;
          max-width: 480px;
        }
        .disc-hero-stat {
          font-family: 'IBM Plex Mono', monospace;
          font-weight: 700;
          color: var(--sun-gold);
        }

        /* ===== BODY ===== */
        .disc-body {
          max-width: 1180px;
          margin: 0 auto;
          padding: clamp(28px, 5vw, 56px) clamp(20px, 6vw, 64px) 70px;
        }

        .disc-section-title {
          font-family: 'Fraunces', serif;
          font-size: 22px;
          font-weight: 600;
          margin: 0 0 4px 0;
        }
        .disc-section-sub {
          font-size: 13.5px;
          color: #6b634f;
          margin: 0 0 26px 0;
        }

        /* ---- Motivation strip (3-up cards) ---- */
        .disc-motivations {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          margin-bottom: 52px;
        }
        .disc-motivation-card {
          background: var(--paper);
          border: 1px solid var(--line);
          border-radius: 14px;
          padding: 22px 20px;
          box-shadow: 0 1px 2px rgba(34,48,31,0.04);
        }
        .disc-hex {
          width: 38px;
          height: 32px;
          clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'IBM Plex Mono', monospace;
          font-weight: 700;
          font-size: 11.5px;
          color: #fff;
          margin-bottom: 16px;
        }
        .disc-motivation-card h4 {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-weight: 500;
          font-size: 17px;
          margin: 0 0 7px 0;
          color: var(--ink);
        }
        .disc-motivation-card p {
          font-size: 13px;
          line-height: 1.55;
          color: #6b634f;
          margin: 0;
        }

        /* ---- Quick actions (2-up cards) ---- */
        .disc-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .disc-action-card {
          position: relative;
          background: var(--paper);
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 26px 26px 24px;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .disc-action-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 30px rgba(34,48,31,0.1);
          border-color: #d3c69a;
        }
        .disc-action-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
        }
        .disc-action-card.green::before { background: var(--hedge-green); }
        .disc-action-card.blue::before { background: var(--sky-blue); }

        .disc-action-icon {
          width: 46px;
          height: 46px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 19px;
          color: #fff;
          margin-bottom: 18px;
        }
        .disc-action-card.green .disc-action-icon { background: var(--hedge-green); }
        .disc-action-card.blue .disc-action-icon { background: var(--sky-blue); }

        .disc-action-card h3 {
          font-family: 'Fraunces', serif;
          font-size: 19px;
          margin: 0 0 8px 0;
          color: var(--ink);
        }
        .disc-action-card p {
          color: #5c5544;
          font-size: 13.5px;
          line-height: 1.55;
          margin: 0 0 18px 0;
        }
        .disc-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          font-family: 'IBM Plex Mono', monospace;
          font-weight: 600;
          font-size: 12px;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          color: var(--ink);
          border-bottom: 1.5px solid var(--ink);
          padding-bottom: 2px;
          transition: color 0.2s ease, border-color 0.2s ease, gap 0.2s ease;
        }
        .disc-link:hover {
          color: var(--roof-red);
          border-color: var(--roof-red);
          gap: 9px;
        }

        /* ---- Closing quote ---- */
        .disc-quote-band {
          margin-top: 54px;
          padding: 34px clamp(20px, 5vw, 48px);
          background: linear-gradient(100deg, var(--ink) 0%, #16220f 100%);
          border-radius: 18px;
          display: flex;
          align-items: center;
          gap: 22px;
        }
        .disc-quote-rule {
          flex: none;
          width: 3px;
          align-self: stretch;
          background: var(--sun-gold);
          border-radius: 2px;
        }
        .disc-quote-band blockquote {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-weight: 500;
          font-size: clamp(17px, 1.6vw, 21px);
          line-height: 1.45;
          color: #fdfbf3;
          margin: 0 0 10px 0;
        }
        .disc-quote-attr {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10.5px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #e9c98a;
          font-weight: 600;
          margin: 0;
        }

        @media (max-width: 860px) {
          .disc-motivations { grid-template-columns: 1fr; }
          .disc-actions { grid-template-columns: 1fr; }
          .disc-hero { height: auto; min-height: 300px; }
          .disc-quote-band { flex-direction: column; align-items: flex-start; }
          .disc-quote-rule { width: 100%; height: 3px; }
        }
      `}</style>

      <div className="disc-hero">
        <img src={campusPhoto} alt="KASS campus walkway" />
        <div className="disc-hero-inner">
          <p className="disc-hero-eyebrow">KASS Discipline Office &middot; Academic Year 2026&ndash;2027</p>
          <h1>Welcome, Discipline Officer</h1>
          <p>
            Materials inspection, term tracking, and the student register &mdash; standards for{' '}
            <span className="disc-hero-stat">{totalStudents}</span> students, all in one place.
          </p>
        </div>
      </div>

      <div className="disc-body">
        <h3 className="disc-section-title">Why It Matters</h3>
        <p className="disc-section-sub">The principles behind the daily checks.</p>

        <div className="disc-motivations">
          <div className="disc-motivation-card">
            <div className="disc-hex" style={{ background: 'var(--roof-red)' }}>01</div>
            <h4>Order begins here</h4>
            <p>Every uniform checked, every book counted &mdash; the standard starts with what's inspected today.</p>
          </div>
          <div className="disc-motivation-card">
            <div className="disc-hex" style={{ background: 'var(--hedge-green)' }}>02</div>
            <h4>Consistency builds character</h4>
            <p>Discipline isn't a single check &mdash; it's the same standard, held term after term.</p>
          </div>
          <div className="disc-motivation-card">
            <div className="disc-hex" style={{ background: 'var(--sun-gold)' }}>03</div>
            <h4>Excellence is a habit</h4>
            <p>Small, well-kept things add up to a school that runs the way it should.</p>
          </div>
        </div>

        <h3 className="disc-section-title">Quick Actions</h3>
        <p className="disc-section-sub">Jump straight into the tools you use most.</p>

        <div className="disc-actions">
          <div className="disc-action-card green">
            <div className="disc-action-icon">&#10003;</div>
            <h3>Materials Inspection Table</h3>
            <p>Inspect student requirements per term, dynamically update item quantities, and monitor sufficiency statuses.</p>
           
          </div>

          <div className="disc-action-card blue">
            <div className="disc-action-icon">&#9776;</div>
            <h3>Students Directory</h3>
            <p>View the complete master list of registered students, register new students manually, or import lists via PDF.</p>
            
          </div>
        </div>

        <div className="disc-quote-band">
          <div className="disc-quote-rule" />
          <div>
            <blockquote>
              &ldquo;Discipline is the bridge between goals and accomplishment &mdash; every well-kept item, every followed rule, builds the standard of this school.&rdquo;
            </blockquote>
            <p className="disc-quote-attr">KASS &middot; Discipline Office</p>
          </div>
        </div>
      </div>
    </div>
  );
}