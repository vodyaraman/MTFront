import "./Logo.scss";

const Logo = () => {
  return (
    <div className="logo" draggable='false'>
      <img src="/icons/main-icon.svg" alt="?" className="logo__icon"/>
      <h2 className="logo__text">металл трейдинг</h2>
    </div>
  );
};

export default Logo;
