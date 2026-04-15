function Showcase({ items }) {
  return (
    <section className="section showcase-section" id="work">
      <div className="section-heading">
        <p className="eyebrow">Selected Work</p>
        <h2>Three sample project blocks mirror the structure of the source page.</h2>
      </div>
      <div className="showcase-grid">
        {items.map((item, index) => (
          <article className="showcase-card" key={item.title}>
            <div className="showcase-visual" aria-hidden="true">
              <span>{`0${index + 1}`}</span>
            </div>
            <div className="showcase-copy">
              <p className="card-eyebrow">{item.type}</p>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Showcase;
