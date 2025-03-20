import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";

function GlobeMesh({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const globeRef = useRef<THREE.Mesh>(null);
  const texture = useTexture("/textures/world-map.jpg");

  const initialRotation = new THREE.Euler(0.8, -2.8, 0, "XYZ");

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.rotation.set(initialRotation.x, initialRotation.y, initialRotation.z);
    }
  }, []);

  useFrame(() => {
    if (globeRef.current) {
      const targetX = mousePosition.y * 0.2;
      const targetY = mousePosition.x * 0.2;

      globeRef.current.rotation.x = THREE.MathUtils.lerp(globeRef.current.rotation.x, targetX + initialRotation.x, 0.1);
      globeRef.current.rotation.y = THREE.MathUtils.lerp(globeRef.current.rotation.y, targetY + initialRotation.y, 0.1);
    }
  });

  return (
    <mesh ref={globeRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial map={texture} roughness={0.7} metalness={0.1} />
    </mesh>
  );
}

export default function Globe() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (event.clientX / innerWidth - 0.5) * 2;
      const y = -(event.clientY / innerHeight - 0.5) * 2;

      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
      <ambientLight intensity={5} />
      <directionalLight position={[5, 5, 5]} intensity={3} castShadow />
      <pointLight position={[-3, 2, 2]} intensity={0.8} color="orange" />
      <hemisphereLight color={"#87CEEB"} groundColor={"#FFD700"} intensity={0.5} />

      <GlobeMesh mousePosition={mousePosition} />
    </Canvas>
  );
}
