import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { TextureLoader } from 'three'
import "./Background.scss";

const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D uTexture;
uniform float uTime;
varying vec2 vUv;

void main() {
  float zoom = 1.0 + abs(sin(uTime * 0.5)) * 0.25;
  vec2 center = vec2(0.5, 0.5);
  vec2 zoomedUV = (vUv - center) / zoom + center;

  float radius = 0.01;
  vec2 offset = vec2(
    sin(uTime * 0.2) * radius,
    cos(uTime * 0.2) * radius
  );

  vec2 uv = zoomedUV + offset;

  gl_FragColor = texture2D(uTexture, uv);
}

`;

function AnimatedImage() {
    const meshRef = useRef<THREE.Mesh>(null)
    const materialRef = useRef<THREE.ShaderMaterial>(null)

    // Загружаем текстуру
    const texture = useLoader(TextureLoader, '/backgrounds/hero-background-dynamic.png')

    const { viewport, size } = useThree() // Получаем размеры экрана
    const [aspectRatio, setAspectRatio] = useState(viewport.width / viewport.height)

    // Следим за изменением размера окна и обновляем aspectRatio
    useEffect(() => {
        setAspectRatio(viewport.width / viewport.height)
    }, [size])

    useFrame((state, delta) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value += delta * 0.1
        }
    })

    return (
        <mesh ref={meshRef}>
            <planeGeometry args={[viewport.width, viewport.height]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={{
                    uTime: { value: 0 },
                    uTexture: { value: texture },
                }}
                transparent={true}
            />
        </mesh>
    )
}

export default function AnimatedBackground() {
    return (
        <div className='animated-background'>
            <Canvas
                camera={{ position: [0, 0, 10], fov: 75 }}
                gl={{ alpha: true }}
                style={{ width: '100%', height: '100%' }}
            >
                <AnimatedImage />
            </Canvas>
        </div>
    )
}
