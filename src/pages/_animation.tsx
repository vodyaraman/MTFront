import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AnimationWrapper() {
  useEffect(() => {
    gsap.set(".hero__content, .hero__showcase", { opacity: 1 });

    const tl = gsap.timeline({ delay: 1.2, defaults: { ease: "power3.out" } });

    tl.from(".logo, .hero__title", { x: 200, duration: 0.8 }, "-=0.5");
    tl.from(".hero__subtitle", { opacity: 0, y: 30, duration: 0.8 }, "-=0.6");
    tl.from(".button-wrapper", { opacity: 0, y: 30, duration: 0.8 }, "-=0.25");

    tl.from(".hero__showcase", { opacity: 0, duration: 1 }, "-=0.5");
  }, []);

  return null;
}