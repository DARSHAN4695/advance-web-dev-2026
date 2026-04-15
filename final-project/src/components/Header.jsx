function Header({ navItems }) {
  return (
    <header className="site-header">
      <div className="brand-block">
        <p className="brand-mark">Aster Studio</p>
        <p className="brand-tagline">Creative web presence for small brands</p>
      </div>
      <nav aria-label="Primary navigation">
        <ul className="nav-list">
          {navItems.map((item) => (
            <li key={item}>
              <a href={`#${item.toLowerCase()}`}>{item}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
