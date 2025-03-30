export default function Header() {
    return (
      <header className="header">
        <nav className="header__nav header__nav--left" />
  
        <div className="header__menu">
          <span className="header__menu-text">МЕНЮ</span>
          <button className="header__burger" aria-label="Открыть меню">
            <span className="header__burger-line" />
            <span className="header__burger-line" />
            <span className="header__burger-line" />
          </button>
        </div>
  
        <nav className="header__nav header__nav--right" />
      </header>
    );
  }