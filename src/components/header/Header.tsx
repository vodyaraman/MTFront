import "./Header.scss";

export default function Header() {
  return (
    <header className="header">
      <nav className="header__nav">
        <a href="tel:+79211774000" className="header__link">
          +7(921)177-40-00
        </a>

        <a
          href="mailto:metalltreiding-info@mail.ru"
          className="header__link header__link--email"
        >
          metalltreiding-info@mail.ru
        </a>

        <span className="header__link">
          183038, г. Мурманск, ул. Папанина, д. 28
        </span>
      </nav>
    </header>
  );
}
