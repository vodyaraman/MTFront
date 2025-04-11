import { useEffect, useRef } from "react";
import gsap from "gsap";
import fts from "@/assets/icons/about/clients/fts.svg";
import mmtp from "@/assets/icons/about/clients/mmtp.svg";
import pind from "@/assets/icons/about/clients/p-ind.svg";
import tec from "@/assets/icons/about/clients/tec.svg";
import GrassTexture from "./Block";
import "./AboutComponents.scss";

const logos = [
  { src: fts.src, alt: "Логотип ФТС" },
  { src: mmtp.src, alt: "Логотип ММТП" },
  { src: pind.src, alt: "Логотип Р-Индустрия" },
  { src: tec.src, alt: "Логотип ТЭЦ" },
];

export default function ClientsSlider() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(max-width: 768px)").matches) return;
  
    const track = trackRef.current;
    if (!track) return;
  
    const imgs = Array.from(track.querySelectorAll("img"));
    let loaded = 0;
  
    const checkAndStart = () => {
      loaded++;
      if (loaded === imgs.length) {
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
