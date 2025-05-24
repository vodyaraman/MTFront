import { useEffect, useRef } from "react";
import gsap from "gsap";

import fts from "@/assets/icons/about/clients/fts.svg";
import mmtp from "@/assets/icons/about/clients/mmtp.svg";
import pind from "@/assets/icons/about/clients/p-ind.svg";
import tec from "@/assets/icons/about/clients/tec.svg";

import mpkan from "@/assets/icons/about/clients/mp-kan.png";
import procurat from "@/assets/icons/about/clients/procurat.png";
import rusal from "@/assets/icons/about/clients/rusal.png";
import vitek from "@/assets/icons/about/clients/vitek.png";

import GrassTexture from "./Block";
import "./AboutComponents.scss";

const logos = [
  { src: fts.src, alt: "Логотип ФТС" },
  { src: mmtp.src, alt: "Логотип ММТП" },
  { src: pind.src, alt: "Логотип Р-Индустрия" },
  { src: tec.src, alt: "Логотип Мурманская ТЭЦ" },
  { src: procurat.src, alt: "Логотип Прокуратура Мурманской области" },
  { src: mpkan.src, alt: "Логотип Морской порт Кандалакша" },
  { src: rusal.src, alt: "Логотип Русал" },
  { src: vitek.src, alt: "Логотип VITEK" },
];

export default function ClientsSlider() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const imgs = Array.from(track.querySelectorAll("img"));
    let loaded = 0;

    const checkAndStart = () => {
      loaded++;
      if (loaded === imgs.length) {
        const isMobile = window.matchMedia("(max-width: 768px)").matches;

        if (isMobile) {
          const totalWidth = track.scrollWidth / 2;

          gsap.to(track, {
            x: totalWidth,
            duration: 30,
            ease: "none",
            repeat: -1,
            modifiers: {
              x: (x) => `${parseFloat(x) % totalWidth}px`,
            },
          });
        } else {
          const totalHeight = track.scrollHeight / 2;

          gsap.to(track, {
            y: `-=${totalHeight}`,
            duration: 30,
            ease: "none",
            repeat: -1,
            modifiers: {
              y: gsap.utils.unitize((y) => parseFloat(y) % totalHeight),
            },
          });
        }
      }
    };

    imgs.forEach((img) => {
      if (img.complete) {
        checkAndStart();
      } else {
        img.addEventListener("load", checkAndStart);
      }
    });
  }, []);


  return (
    <div className="slider-track" ref={trackRef}>
      {[...logos, ...logos].map((logo, index) => (
        <GrassTexture key={index}>
          <img src={logo.src} alt={logo.alt} className="inside inside--clients" />
        </GrassTexture>
      ))}
    </div>
  );
}
