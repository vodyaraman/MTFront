import { useEffect } from "react";
import gsap from "gsap";

export default function AnimationWrapper() {
  useEffect(() => {
    // Принудительно устанавливаем opacity: 1 перед анимацией
    gsap.set(".hero__content, .hero__showcase", { opacity: 1 });

    gsap.from(".hero__content", {
      opacity: 0,
      x: -100,
      duration: 1,
      ease: "power3.out",
      delay: 2,
    });

    gsap.from(".hero__showcase", {
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      delay: 1,
    });
  }, []);

  return null;
}

