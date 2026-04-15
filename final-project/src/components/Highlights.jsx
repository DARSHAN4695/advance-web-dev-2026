function Highlights({ cards }) {
  return (
    <section className="section highlights-section" id="services">
      <div className="section-heading">
        <p className="eyebrow">Services</p>
        <h2>Built from clear sections instead of one long block of HTML.</h2>
      </div>
      <div className="card-grid">
        {cards.map((card) => (
          <article className="info-card" key={card.title}>
            <p className="card-eyebrow">{card.eyebrow}</p>
            <h3>{card.title}</h3>
            <p>{card.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Highlights;
