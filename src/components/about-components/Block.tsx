import Grass from "@/assets/textures/grass.svg";
import "./AboutComponents.scss";

export default function GrassTexture({ children }: { children?: React.ReactNode }) {
	return (
		<div className="about__grass">
			<img src={Grass.src} alt="Текстура травы" />
			{children}
		</div>
	);
}
