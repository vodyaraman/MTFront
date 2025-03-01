import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(Flip);

const PageTransition = ({ children } : {children: any}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const state = Flip.getState(containerRef.current);
    Flip.from(state, {
      duration: 0.75,
      ease: "power2.inOut",
      scale: true,
      absolute: true,
    });
  }, []);

  return <div ref={containerRef}>{children}</div>;
};

export default PageTransition;
