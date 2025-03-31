import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./Scroller.scss";

interface PagePreview {
    title: string;
    href: string;
    image: string;
}

interface ScrollerProps {
    pages: [PagePreview, PagePreview, PagePreview];
}

export default function Scroller({ pages }: ScrollerProps) {
    const scrollerRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastTriggerTime = useRef(0);
    const touchStartY = useRef(0);

    const resetScroller = () => {
        setIsVisible(false);
    };

    const startResetTimer = () => {
        if (resetTimeoutRef.current) {
            clearTimeout(resetTimeoutRef.current);
        }
        resetTimeoutRef.current = setTimeout(resetScroller, 5000);
    };

    useEffect(() => {
        return () => {
            if (resetTimeoutRef.current) {
                clearTimeout(resetTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const handleTrigger = () => {
            const now = Date.now();
            if (now - lastTriggerTime.current < 700) return;
            lastTriggerTime.current = now;

            if (!isVisible) {
                setIsVisible(true);
                startResetTimer();
            } else {
                window.location.href = pages[0].href;
            }
        };

        const handleWheel = (event: WheelEvent) => {
            if (event.deltaY > 0) {
                handleTrigger();
            } else if (event.deltaY < 0) {
                resetScroller();
            }
        };

        const handleTouchStart = (event: TouchEvent) => {
            touchStartY.current = event.touches[0].clientY;
        };

        const handleTouchMove = (event: TouchEvent) => {
            const delta = touchStartY.current - event.touches[0].clientY;
            if (delta > 50) {
                handleTrigger();
            } else if (delta < -50) {
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
    }, [isVisible, pages]);

    useEffect(() => {
        if (isVisible) {
            gsap.to(overlayRef.current, {
                y: 0,
                opacity: 1,
                duration: 0.25,
                ease: "power2.in",
                pointerEvents: "auto"
            });
        } else {
            gsap.to(overlayRef.current, {
                y: 500,
                opacity: 0,
                duration: 0.75,
                ease: "power2.out",
                pointerEvents: "none"
            });
        }
    }, [isVisible]);

    return (
        <div ref={scrollerRef} className="scroller">
            <div ref={overlayRef} className="scroller-overlay">
                <p className="scroller-overlay__title">
                    Прокрутите вниз ещё раз, чтобы узнать о нас подробнее
                </p>
                <div className="scroller-overlay__grid">
                    {pages.map((page, index) => (
                        <a key={index} href={page.href} className="scroller-overlay__item">
                            <span>{page.title}</span>
                            <div className="image-wrapper">
                                <img src={page.image} alt={page.title} />
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
