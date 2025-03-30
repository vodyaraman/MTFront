import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { TextureLoader } from 'three'

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1);
}
`

const fragmentShader = `
uniform sampler2D uTexture;
uniform float uTime;
varying vec2 vUv;

void main() {
  float waveOffset = sin(vUv.x * 5.0 + uTime * 0.4) * 0.25;
  vec2 displacedUV = vec2(vUv.x, vUv.y + waveOffset);
  
  vec4 textureColor = texture2D(uTexture, displacedUV);
  
  gl_FragColor = textureColor;
}
`

function AnimatedImage() {
    const meshRef = useRef<THREE.Mesh>(null)
    const materialRef = useRef<THREE.ShaderMaterial>(null)

    // Загружаем текстуру
    const texture = useLoader(TextureLoader, '/backgrounds/hero-background.svg')

    const { viewport, size } = useThree() // Получаем размеры экрана
    const [aspectRatio, setAspectRatio] = useState(viewport.width / viewport.height)

    // Следим за изменением размера окна и обновляем aspectRatio
    useEffect(() => {
        setAspectRatio(viewport.width / viewport.height)
    }, [size])

    useFrame((state, delta) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value += delta * 0.1 // Плавная анимация
        }
    })

    return (
        <mesh ref={meshRef} scale={[10, 10, 1]} key={aspectRatio}>
            <planeGeometry args={[aspectRatio * 2, aspectRatio * 0.75]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={{
                    uTime: { value: 0 },
                    uTexture: { value: texture }
                }}
                transparent={true}
            />
        </mesh>
    )
}

export default function AnimatedBackground() {
    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: -1,
            overflow: 'hidden'
        }}>
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
