import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, MeshDistortMaterial } from '@react-three/drei';

function CoreShape() {
  const meshRef = useRef();
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.14;
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.6} floatIntensity={1.1}>
      <mesh ref={meshRef} scale={1.75}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color="#2563EB"
          emissive="#1D4ED8"
          roughness={0.18}
          metalness={0.35}
          distort={0.32}
          speed={1.8}
          wireframe={false}
        />
      </mesh>
    </Float>
  );
}

function OrbitRing() {
  const ref = useRef();
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * 0.08;
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2.3, 0, 0]}>
      <torusGeometry args={[2.7, 0.015, 12, 120]} />
      <meshBasicMaterial color="#FF7A00" transparent opacity={0.65} />
    </mesh>
  );
}

export default function Scene3D() {
  return (
    <Canvas camera={{ position: [0, 0, 5.5], fov: 42 }} dpr={[1, 1.6]}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[6, 6, 6]} intensity={1.4} color="#FFFFFF" />
      <pointLight position={[-4, -3, -2]} intensity={0.8} color="#FF7A00" />
      <Suspense fallback={null}>
        <CoreShape />
        <OrbitRing />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}
