import { useEffect } from "react";
import gsap from "gsap";

const LoaderAnimation = () => {
    useEffect(() => {
        const timeout = setTimeout(() => {
            const tl = gsap.timeline({
                onComplete: () => {
                    const el = document.querySelector(".loader");
                    if (el) el.remove();
                }
            });

            tl.to(".loader", {
                scaleX: 0,
                duration: 0.33,
                ease: "power1.inOut",
                transformOrigin: "right"
            });
        }, 500);

        return () => clearTimeout(timeout);
    }, []);

    return null;
};

export default LoaderAnimation;
