import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Globe from "./Globe";
import "./GlobeWrapper.scss";

export default function GlobeWrapper() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!wrapperRef.current || !overlayRef.current) return;

    const globeWrapper = wrapperRef.current;
    const overlay = overlayRef.current;

    const handleMouseEnter = () => {
      gsap.to(globeWrapper, {
        filter: "sepia(0)",
        duration: 0.5,
        ease: "power2.out",
      });

      setIsHovered(true);

      gsap.to(overlay, {
        opacity: 1,
        visibility: "visible",
        duration: 0.5,
        ease: "power2.out",
      });

      const blocks = overlay.querySelectorAll(".globe-wrapper__block");

      gsap.fromTo(
        blocks[0], // Левый верхний блок
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
      );

      gsap.fromTo(
        blocks[1], // Правый нижний блок
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
      );
    };

    const handleMouseLeave = () => {
      gsap.to(globeWrapper, {
        filter: "sepia(1)",
        duration: 0.5,
        ease: "power2.out",
      });

      const blocks = overlay.querySelectorAll(".globe-wrapper__block");

      gsap.to(blocks[0], {
        opacity: 0,
        x: 20,
        duration: 0.3,
        ease: "power2.in",
      });

      gsap.to(blocks[1], {
        opacity: 0,
        x: -20,
        duration: 0.3,
        ease: "power2.in",
      });

      gsap.to(overlay, {
        opacity: 0,
        visibility: "hidden",
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => setIsHovered(false),
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
      <div ref={overlayRef} className="globe-wrapper__overlay">
        <div className="globe-wrapper__block globe-wrapper__block--top-left">
          183038, г. Мурманск, ул. Папанина, д. 28, помещение 3
        </div>
        <div className="globe-wrapper__block globe-wrapper__block--bottom-right">
          по России: metalltreiding-info@mail.ru
        </div>
      </div>
    </div>
  );
}
