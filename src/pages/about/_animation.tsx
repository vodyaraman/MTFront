import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AnimationWrapper() {
  useEffect(() => {
    gsap.set(".about", { opacity: 1 });

    const tl = gsap.timeline({ delay: 1.2, defaults: { ease: "power3.out" } });

    tl.from("#swup", { width: "0%", duration: 0.33 }, "-=0.5");
    tl.from(".about", { opacity: 0, duration: 0.8 }, "-=0.4");
    tl.from(".about__content", { opacity: 0, y: 40, duration: 0.8, stagger: 0.2 }, "-=0.6");
  }, []);

  return null;
}
