import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./Scroller.scss";

interface ScrollerProps {
    targetPage: string;
}

export default function Scroller({ targetPage }: ScrollerProps) {
    const scrollerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const linkRef = useRef<HTMLAnchorElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const touchStartY = useRef(0);

    const resetScroller = () => {
        setIsVisible(false);
    };

    const startResetTimer = () => {
        if (resetTimeoutRef.current !== null) {
            clearTimeout(resetTimeoutRef.current);
        }
        resetTimeoutRef.current = setTimeout(() => { resetScroller() }, 3000);
    };

    useEffect(() => {
        return () => {
            if (resetTimeoutRef.current !== null) {
                clearTimeout(resetTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const handleWheel = (event: WheelEvent) => {
            if (event.deltaY > 0) {
                if (!isVisible) {
                    setIsVisible(true);
                    startResetTimer();
                } else {
                    linkRef.current?.click(); // Эмулируем клик по ссылке
                }
            } else {
                resetScroller();
            }
        };

        const handleTouchStart = (event: TouchEvent) => {
            touchStartY.current = event.touches[0].clientY;
        };

        const handleTouchMove = (event: TouchEvent) => {
            const touchEndY = event.touches[0].clientY;
            if (touchStartY.current - touchEndY > 50) {
                if (!isVisible) {
                    setIsVisible(true);
                    startResetTimer();
                } else {
                    linkRef.current?.click(); // Эмулируем клик по ссылке
                }
            } else if (touchStartY.current - touchEndY < -50) {
                resetScroller();
            }
        };

        window.addEventListener("wheel", handleWheel);
        window.addEventListener("touchstart", handleTouchStart);
        window.addEventListener("touchmove", handleTouchMove);

        return () => {
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchmove", handleTouchMove);
        };
    }, [isVisible]);

    useEffect(() => {
        if (isVisible) {
            gsap.to(textRef.current, {
                y: 0,
                opacity: 1,
                duration: 0.45,
                ease: "power2.in",
            });
        } else {
            gsap.to(textRef.current, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out",
            });
        }
    }, [isVisible]);

    return (
        <div ref={scrollerRef} className={`scroller ${isVisible ? "visible" : ""}`}>
            <div ref={textRef} className="scroller-text">
                <a ref={linkRef} className="scroller-text__link" href={targetPage}>
                    Прокрутите вниз ещё раз, чтобы узнать о нас подробнее
                </a>
            </div>
            <div className="scroller-background" />
        </div>
    );
}
