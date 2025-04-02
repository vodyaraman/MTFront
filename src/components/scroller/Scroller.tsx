import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./Scroller.scss";
import MainButton from "../main_button/MainButton";

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
    const titleRef = useRef<HTMLParagraphElement>(null);
    const [isTitleVisible, setIsTitleVisible] = useState(false);
    const [canTrigger, setCanTrigger] = useState(false);
    const touchStartY = useRef(0);

    const resetScroller = () => {
        setIsTitleVisible(false);
        setCanTrigger(false);
    };

    useEffect(() => {
        let frameId: number;

        const checkVisibility = () => {
            const scroller = scrollerRef.current;
            const title = titleRef.current;
            if (!scroller || !title) return;

            const rect = scroller.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            const isBottomVisible =
                rect.bottom <= windowHeight + 50 && rect.bottom >= windowHeight - 100;

            if (isBottomVisible) {
                if (!isTitleVisible) {
                    setIsTitleVisible(true);
                    setCanTrigger(false);
                    setTimeout(() => setCanTrigger(true), 1000);
                }
            } else {
                if (isTitleVisible) resetScroller();
            }

            frameId = requestAnimationFrame(checkVisibility);
        };

        frameId = requestAnimationFrame(checkVisibility);
        return () => cancelAnimationFrame(frameId);
    }, [isTitleVisible]);

    useEffect(() => {
        const title = titleRef.current;
        if (!title) return;

        gsap.killTweensOf(title);

        if (isTitleVisible) {
            gsap.to(title, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power3.out"
            });
        } else {
            gsap.to(title, {
                opacity: 0,
                y: 20,
                duration: 0.3,
                ease: "power3.in"
            });
        }
    }, [isTitleVisible]);

    useEffect(() => {
        const handleTrigger = () => {
            if (!isTitleVisible || !canTrigger) return;
        
            const firstLink = document.querySelector<HTMLAnchorElement>(
                `.scroller-overlay__item[href="${pages[0].href}"]`
            );
        
            if (firstLink) {
                firstLink.click();
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
    }, [isTitleVisible, canTrigger]);

    return (
        <div ref={scrollerRef} className="scroller">
            <div className="scroller-overlay">
                <p ref={titleRef} className="scroller-overlay__title">
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
                <MainButton text="Узнать больше" href="/about"/>
                <MainButton text="Выйти на связь" href="/contacts"/>
            </div>
        </div>
    );
}
