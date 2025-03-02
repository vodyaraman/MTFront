import "./Logo.scss";

const Logo = () => {
  return (
    <div className="logo" draggable='false'>
      <img src="/icons/main-icon.svg" alt="?" />
      <h2 className="logo__text">METAL TRADING</h2>
    </div>
  );
};

export default Logo;
