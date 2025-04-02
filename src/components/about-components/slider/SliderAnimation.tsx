import { useEffect } from "react";

const TiltSliderScript = () => {
    useEffect(() => {
        const wrap = (n: number, max: number) => (n + max) % max;
        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

        const genId = (() => {
            let count = 0;
            return () => (count++).toString();
        })();

        class Raf {
            rafId = 0;
            callbacks: { callback: (params: { id: string }) => void; id: string }[] = [];

            constructor() {
                this.raf = this.raf.bind(this);
                this.start();
            }

            start() {
                this.raf();
            }

            stop() {
                cancelAnimationFrame(this.rafId);
            }

            raf() {
                this.callbacks.forEach(({ callback, id }) => callback({ id }));
                this.rafId = requestAnimationFrame(this.raf);
            }

            add(callback: (params: { id: string }) => void, id?: string) {
                this.callbacks.push({ callback, id: id || genId() });
            }

            remove(id: string) {
                this.callbacks = this.callbacks.filter(cb => cb.id !== id);
            }
        }

        class Vec2 {
            x: number;
            y: number;

            constructor(x = 0, y = 0) {
                this.x = x;
                this.y = y;
            }

            set(x: number, y: number) {
                this.x = x;
                this.y = y;
            }

            lerp(v: Vec2, t: number) {
                this.x = lerp(this.x, v.x, t);
                this.y = lerp(this.y, v.y, t);
            }
        }

        const vec2 = (x = 0, y = 0) => new Vec2(x, y);

        function tilt(node: HTMLElement, options?: { trigger?: HTMLElement; target?: HTMLElement | HTMLElement[] }) {
            let { trigger, target } = resolveOptions(node, options);

            let lerpAmount = 0.06;

            const rotDeg = { current: vec2(), target: vec2() };
            const bgPos = { current: vec2(), target: vec2() };

            const update = (newOptions: typeof options) => {
                destroy();
                ({ trigger, target } = resolveOptions(node, newOptions));
                init();
            };

            let rafId: string;

            function ticker({ id }: { id: string }) {
                rafId = id;

                rotDeg.current.lerp(rotDeg.target, lerpAmount);
                bgPos.current.lerp(bgPos.target, lerpAmount);

                for (const el of target) {
                    el.style.setProperty("--rotX", `${rotDeg.current.y.toFixed(2)}deg`);
                    el.style.setProperty("--rotY", `${rotDeg.current.x.toFixed(2)}deg`);
                    el.style.setProperty("--bgPosX", `${bgPos.current.x.toFixed(2)}%`);
                    el.style.setProperty("--bgPosY", `${bgPos.current.y.toFixed(2)}%`);
                }
            }

            const onMouseMove = ({ offsetX, offsetY }: MouseEvent) => {
                lerpAmount = 0.1;

                for (const el of target) {
                    const ox = (offsetX - el.clientWidth * 0.5) / (Math.PI * 3);
                    const oy = -(offsetY - el.clientHeight * 0.5) / (Math.PI * 4);

                    rotDeg.target.set(ox, oy);
                    bgPos.target.set(-ox * 0.3, oy * 0.3);
                }
            };

            const onMouseLeave = () => {
                lerpAmount = 0.06;

                rotDeg.target.set(0, 0);
                bgPos.target.set(0, 0);
            };

            const addListeners = () => {
                trigger.addEventListener("mousemove", onMouseMove);
                trigger.addEventListener("mouseleave", onMouseLeave);
            };

            const removeListeners = () => {
                trigger.removeEventListener("mousemove", onMouseMove);
                trigger.removeEventListener("mouseleave", onMouseLeave);
            };

            const init = () => {
                addListeners();
                raf.add(ticker);
            };

            const destroy = () => {
                removeListeners();
                raf.remove(rafId);
            };

            init();

            return { destroy, update };
        }

        function resolveOptions(node: HTMLElement, options?: { trigger?: HTMLElement; target?: HTMLElement | HTMLElement[] }) {
            return {
                trigger: options?.trigger ?? node,
                target: options?.target
                    ? Array.isArray(options.target)
                        ? options.target
                        : [options.target]
                    : [node],
            };
        }

        const raf = new Raf();

        function init() {
            const slides = [...document.querySelectorAll<HTMLElement>(".slide")];
            const slidesInfo = [...document.querySelectorAll<HTMLElement>(".slide-info")];

            const buttons = {
                prev: document.querySelector<HTMLElement>(".slider--btn__prev"),
                next: document.querySelector<HTMLElement>(".slider--btn__next"),
            };

            slides.forEach((slide, i) => {
                const slideInner = slide.querySelector<HTMLElement>(".slide__inner")!;
                const slideInfoInner = slidesInfo[i].querySelector<HTMLElement>(".slide-info__inner")!;
                tilt(slide, { target: [slideInner, slideInfoInner] });
            });

            buttons.prev?.addEventListener("click", change(-1));
            buttons.next?.addEventListener("click", change(1));
        }

        function change(direction: number) {
            return () => {
                let current = {
                    slide: document.querySelector<HTMLElement>(".slide[data-current]")!,
                    slideInfo: document.querySelector<HTMLElement>(".slide-info[data-current]")!,
                };
                let previous = {
                    slide: document.querySelector<HTMLElement>(".slide[data-previous]")!,
                    slideInfo: document.querySelector<HTMLElement>(".slide-info[data-previous]")!,
                };
                let next = {
                    slide: document.querySelector<HTMLElement>(".slide[data-next]")!,
                    slideInfo: document.querySelector<HTMLElement>(".slide-info[data-next]")!,
                };

                Object.values(current).forEach((el) => el.removeAttribute("data-current"));
                Object.values(previous).forEach((el) => el.removeAttribute("data-previous"));
                Object.values(next).forEach((el) => el.removeAttribute("data-next"));

                if (direction === 1) {
                    let temp = current;
                    current = next;
                    next = previous;
                    previous = temp;

                    current.slide.style.zIndex = "20";
                    previous.slide.style.zIndex = "30";
                    next.slide.style.zIndex = "10";
                } else if (direction === -1) {
                    let temp = current;
                    current = previous;
                    previous = next;
                    next = temp;

                    current.slide.style.zIndex = "20";
                    previous.slide.style.zIndex = "10";
                    next.slide.style.zIndex = "30";
                }

                Object.values(current).forEach((el) => el.setAttribute("data-current", ""));
                Object.values(previous).forEach((el) => el.setAttribute("data-previous", ""));
                Object.values(next).forEach((el) => el.setAttribute("data-next", ""));
            };
        }

        init();

        return () => {
            raf.stop();
        };
    }, []);

    return null;
};

export default TiltSliderScript;
