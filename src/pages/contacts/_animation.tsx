import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AnimationWrapper() {
  useEffect(() => {
    gsap.set(".contacts", { opacity: 1 });

    const tl = gsap.timeline({ delay: 1.2, defaults: { ease: "power3.out" } });

    tl.from(".contacts__title", { x: 200, duration: 0.8 }, "-=0.5");
    tl.from(".contacts__text", { opacity: 0, y: 30, duration: 0.8 }, "-=0.6");
    tl.from(".contacts__contact-links", { opacity: 0, y: 30, duration: 0.8 }, "-=0.25");
    tl.from(".contacts__form-side", { opacity: 0, duration: 1 }, "-=0.5");
  }, []);

  return null;
}
