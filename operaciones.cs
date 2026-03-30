/* Estilos de operaciones movidos desde index */
.professional-pillars-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}

.professional-pillar-card {
  background: linear-gradient(160deg, rgba(255,255,255,0.95), rgba(231, 248, 238, 0.88));
  border: 1px solid rgba(15, 79, 51, 0.14);
  border-radius: 22px;
  padding: clamp(18px, 2vw, 24px);
  box-shadow: 0 20px 46px rgba(9, 49, 33, 0.12);
}

.newsroom-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
.newsroom-card { background: rgba(255, 255, 255, 0.88); border: 1px solid rgba(255, 255, 255, 0.25); border-radius: 20px; padding: 24px; box-shadow: 0 20px 40px rgba(12, 18, 32, 0.18); }
.newsroom-date { display: inline-flex; font-size: 0.82rem; font-weight: 700; letter-spacing: 0.08em; color: #4f5f80; text-transform: uppercase; margin-bottom: 10px; }
.newsroom-card h3 { margin-bottom: 10px; color: #1e2842; }
.newsroom-card p { color: #3b4766; margin-bottom: 14px; }
.newsroom-card a { color: #1565c0; font-weight: 700; text-decoration: none; }
.newsroom-card a:hover { text-decoration: underline; }

.compliance-layout { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 24px; align-items: stretch; }
.compliance-main, .compliance-aside { border-radius: 24px; border: 1px solid rgba(255, 255, 255, 0.16); background: rgba(3, 24, 35, 0.62); backdrop-filter: blur(10px); padding: clamp(22px, 3vw, 34px); box-shadow: 0 24px 60px rgba(0, 0, 0, 0.26); }
.compliance-main h2, .compliance-main h3, .compliance-aside h3 { color: #ffffff; }
.compliance-main p, .compliance-aside p, .compliance-aside li { color: rgba(233, 243, 255, 0.9); }
.compliance-docs { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; margin-top: 18px; }
.compliance-docs article { padding: 16px; border-radius: 16px; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.16); }
.compliance-aside ul { margin: 0 0 20px; padding-left: 18px; display: grid; gap: 8px; }

.contact-premium-section { position: relative; }
.contact-premium-card { padding: 34px; border-radius: 30px; background: radial-gradient(circle at top right, rgba(31, 107, 69, 0.08), transparent 28%), #ffffff; border: 1px solid rgba(31, 107, 69, 0.08); box-shadow: 0 20px 48px rgba(0,0,0,0.06); }
.contact-mini-cards { display: grid; gap: 14px; margin-top: 22px; }
.contact-mini-cards article { padding: 18px 18px; border-radius: 18px; background: rgba(31, 107, 69, 0.05); border: 1px solid rgba(31, 107, 69, 0.08); }
.contact-form-status { min-height: 24px; margin: 6px 0 4px; font-size: 0.92rem; color: var(--color-text-soft); }
.contact-form-status.is-success { color: #0f7a43; }
.contact-form-status.is-error { color: #b3261e; }

@media (max-width: 980px) {
  .professional-pillars-grid, .newsroom-grid, .compliance-docs { grid-template-columns: 1fr; }
  .compliance-layout { grid-template-columns: 1fr; }
}
