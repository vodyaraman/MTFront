import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

export default function LenisInit() {
	useEffect(() => {
		if (typeof window === "undefined") return;
		if (window.lenis) return;

		const lenis = new Lenis({
			lerp: 0.1,
            wrapper: document.body,
		});

		window.lenis = lenis;

		if (Array.isArray(window.__onLenisReady)) {
			window.__onLenisReady.forEach((cb) => cb(lenis));
			window.__onLenisReady = [];
		}

		const raf = (time: number) => {
			lenis.raf(time);
			requestAnimationFrame(raf);
		};
		requestAnimationFrame(raf);

        console.log("Lenis initialised")

		return () => {
			lenis.destroy();
			window.lenis = undefined;
		};
	}, []);

	return null;
}

export function onLenisReady(cb: (lenis: Lenis) => void) {
	if (typeof window === "undefined") return;

	if (window.lenis) {
		cb(window.lenis);
	} else {
		if (!Array.isArray(window.__onLenisReady)) {
			window.__onLenisReady = [];
		}
		window.__onLenisReady.push(cb);
	}
}

export function getLenis(): Lenis | undefined {
	if (typeof window === "undefined") return;
	return window.lenis;
}

