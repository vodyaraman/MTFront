import { useEffect, useRef } from "react";
import gsap from "gsap";
import Globe from "./Globe";
import "./GlobeWrapper.scss";

export default function GlobeWrapper() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const globeWrapper = wrapperRef.current;

    const handleMouseEnter = () => {
      gsap.to(globeWrapper, {
        filter: "sepia(0)", // Убираем сепию
        duration: 0.5,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(globeWrapper, {
        filter: "sepia(1)", // Возвращаем сепию
        duration: 0.5,
        ease: "power2.out",
      });
    };

    globeWrapper.addEventListener("mouseenter", handleMouseEnter);
    globeWrapper.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      globeWrapper.removeEventListener("mouseenter", handleMouseEnter);
      globeWrapper.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="globe-wrapper">
      <Globe />
    </div>
  );
}