import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, MeshDistortMaterial, Sphere } from '@react-three/drei';

function InteractiveMesh() {
  const groupRef = useRef();
  const meshRef = useRef();
  const ringRef1 = useRef();
  const ringRef2 = useRef();
  const mousePos = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    // Parallax tracking with mouse pointer (-1 to +1)
    const targetX = state.pointer.x;
    const targetY = state.pointer.y;
    mousePos.current.x += (targetX - mousePos.current.x) * 0.08;
    mousePos.current.y += (targetY - mousePos.current.y) * 0.08;

    if (groupRef.current) {
      // 3D scene smoothly tilts and rotates with cursor movement
      groupRef.current.rotation.y = mousePos.current.x * 0.7;
      groupRef.current.rotation.x = -mousePos.current.y * 0.6;
      groupRef.current.position.x = mousePos.current.x * 0.35;
      groupRef.current.position.y = mousePos.current.y * 0.25;
    }

    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.25;
      meshRef.current.rotation.y += delta * 0.35;
    }

    if (ringRef1.current) {
      ringRef1.current.rotation.z += delta * 0.3;
    }

    if (ringRef2.current) {
      ringRef2.current.rotation.z -= delta * 0.25;
    }
  });

  return (
    <group ref={groupRef}>
      {/* CENTRAL DISTORTED 3D SPHERE */}
      <Float speed={2.2} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[1.2, 64, 64]} />
          <MeshDistortMaterial
            color="#2563EB"
            emissive="#1D4ED8"
            emissiveIntensity={0.35}
            roughness={0.12}
            metalness={0.45}
            distort={0.32}
            speed={2}
          />
        </mesh>
      </Float>

      {/* ORBITING GLOW RING 1 (BRAND ORANGE) */}
      <mesh ref={ringRef1} rotation={[Math.PI / 2.3, 0, 0]}>
        <torusGeometry args={[2.0, 0.022, 16, 120]} />
        <meshBasicMaterial color="#FF7A00" transparent opacity={0.85} />
      </mesh>

      {/* ORBITING GLOW RING 2 (CYAN GLOW) */}
      <mesh ref={ringRef2} rotation={[0, Math.PI / 3, Math.PI / 6]}>
        <torusGeometry args={[2.3, 0.018, 16, 120]} />
        <meshBasicMaterial color="#06B6D4" transparent opacity={0.7} />
      </mesh>

      {/* FLOATING SATELLITE NODES */}
      <Float speed={2.5} floatIntensity={0.6}>
        <Sphere args={[0.13, 16, 16]} position={[1.75, 0.8, 0.4]}>
          <meshStandardMaterial color="#FF7A00" emissive="#FF7A00" emissiveIntensity={0.7} />
        </Sphere>
      </Float>

      <Float speed={2.2} floatIntensity={0.6}>
        <Sphere args={[0.11, 16, 16]} position={[-1.7, -0.7, 0.5]}>
          <meshStandardMaterial color="#06B6D4" emissive="#06B6D4" emissiveIntensity={0.7} />
        </Sphere>
      </Float>
    </group>
  );
}

export default function InteractiveHero3D() {
  const containerRef = useRef(null);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        cursor: 'grab',
        touchAction: 'pan-y',
      }}
    >
      <Canvas
        eventSource={containerRef}
        camera={{ position: [0, 0, 6.8], fov: 42 }}
        dpr={[1, 1.8]}
        style={{ width: '100%', height: '100%', borderRadius: 'inherit' }}
      >
        <ambientLight intensity={0.95} />
        <directionalLight position={[8, 8, 8]} intensity={1.5} color="#FFFFFF" />
        <pointLight position={[-6, -4, -3]} intensity={1.2} color="#3B82F6" />
        <pointLight position={[4, 5, 2]} intensity={0.9} color="#FF7A00" />
        <Suspense fallback={null}>
          <InteractiveMesh />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
