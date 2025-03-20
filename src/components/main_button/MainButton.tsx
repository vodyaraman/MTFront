import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import "./MainButton.scss";

interface MainButtonProps {
  text: string;
  href?: string;
}

const MainButton = ({ text, href = "/" }: MainButtonProps) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  
  useEffect(() => {
    if (buttonRef.current) {
      gsap.set(buttonRef.current, { borderColor: "rgba(255, 255, 255, 0.5)" });
    }
    if (textRef.current) {
      gsap.set(textRef.current, { scale: 1, filter: "brightness(1)" });
    }
  }, []);

  const handleMouseEnter = () => {
    if (textRef.current && buttonRef.current) {
      gsap.to(textRef.current, { scale: 1.01, filter: "brightness(1.4)", duration: 0.5, ease: "power2.out" });
      gsap.to(buttonRef.current, { borderColor: "rgba(255, 255, 255, 0.8)", duration: 0.5, ease: "power2.out" });
    }
  };

  const handleMouseLeave = () => {
    if (textRef.current && buttonRef.current) {
      gsap.to(textRef.current, { scale: 1, filter: "brightness(1)", duration: 0.5, ease: "power2.in" });
      gsap.to(buttonRef.current, { borderColor: "rgba(255, 255, 255, 0.5)", duration: 0.5, ease: "power2.in" });
    }
  };

  return (
    <a
      ref={buttonRef}
      href={href}
      className="main-button"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span ref={textRef} className="main-button__text">{text}</span>
    </a>
  );
};

export default MainButton;