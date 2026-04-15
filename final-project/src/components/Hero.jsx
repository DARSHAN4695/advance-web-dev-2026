function Hero({ stats }) {
  return (
    <section className="hero-section" id="home">
      <div className="hero-copy">
        <p className="eyebrow">Design student portfolio rebuild</p>
        <h1>Designing a clear, modern homepage that feels ready to publish.</h1>
        <p className="hero-text">
          This React version recreates the same landing page structure as the
          original static page, including the hero layout, feature sections,
          project cards, and footer call-to-action.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href="#contact">
            Book a project
          </a>
          <a className="button button-secondary" href="#work">
            View selected work
          </a>
        </div>
      </div>

      <aside className="hero-panel" aria-label="Studio summary">
        <div className="panel-card panel-featured">
          <p className="panel-label">Current focus</p>
          <p className="panel-title">Landing pages, identity kits, and content-led homepage design.</p>
        </div>
        <div className="stats-grid">
          {stats.map((stat) => (
            <div className="panel-card stat-card" key={stat.label}>
              <p className="stat-value">{stat.value}</p>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </aside>
    </section>
  );
}

export default Hero;
