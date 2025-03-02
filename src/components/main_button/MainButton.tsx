import { useRef } from "react";
import { gsap } from "gsap";
import "./MainButton.scss";

interface MainButtonProps {
  text: string;
  href?: string;
  bgImage?: string;
}

const MainButton = ({ text, href = "/", bgImage }: MainButtonProps) => {
  const bgRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (bgRef.current) {
      gsap.to(bgRef.current, { x: "0%", duration: 0.5, ease: "power2.out" });
    }
  };

  const handleMouseLeave = () => {
    if (bgRef.current) {
      gsap.to(bgRef.current, { x: "-80%", duration: 0.5, ease: "power2.in" });
    }
  };

  return (
    <a
      href={href}
      className="main-button"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="main-button__text">{text}</span>
      {bgImage && <div ref={bgRef} className="main-button__bg" style={{ backgroundImage: `url(${bgImage})` }} />}
    </a>
  );
};

export default MainButton;

