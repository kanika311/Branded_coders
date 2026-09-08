import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere } from '@react-three/drei';

function StudioCore() {
  const globeRef = useRef();
  const ring1 = useRef();
  const ring2 = useRef();
  const ring3 = useRef();

  useFrame((state, delta) => {
    const px = state.pointer.x * 0.8;
    const py = state.pointer.y * 0.8;

    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.2 + px * 0.01;
      globeRef.current.rotation.x += delta * 0.12 + py * 0.01;
    }
    if (ring1.current) ring1.current.rotation.z += delta * 0.28;
    if (ring2.current) ring2.current.rotation.y += delta * 0.22;
    if (ring3.current) ring3.current.rotation.x -= delta * 0.18;
  });

  return (
    <group>
      <Float speed={1.8} rotationIntensity={0.5} floatIntensity={0.8}>
        {/* INNER GEO CORE */}
        <mesh ref={globeRef} scale={1.5}>
          <icosahedronGeometry args={[1, 2]} />
          <meshStandardMaterial
            color="#2563EB"
            roughness={0.2}
            metalness={0.4}
            wireframe
          />
        </mesh>

        {/* CORE GLOW SPHERE */}
        <Sphere args={[0.7, 24, 24]}>
          <meshBasicMaterial color="#3B82F6" transparent opacity={0.6} />
        </Sphere>

        {/* ORBIT RING 1 (PUNJAB/INDIA NODE) */}
        <mesh ref={ring1} rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[2.5, 0.02, 16, 100]} />
          <meshBasicMaterial color="#FF7A00" transparent opacity={0.7} />
        </mesh>

        {/* ORBIT RING 2 (GLOBAL DELIVERY) */}
        <mesh ref={ring2} rotation={[0, Math.PI / 4, Math.PI / 6]}>
          <torusGeometry args={[2.8, 0.018, 16, 100]} />
          <meshBasicMaterial color="#10B981" transparent opacity={0.6} />
        </mesh>

        {/* ORBIT RING 3 (TECH & MARKETING CONVERGENCE) */}
        <mesh ref={ring3} rotation={[Math.PI / 2.2, Math.PI / 3, 0]}>
          <torusGeometry args={[3.1, 0.016, 16, 100]} />
          <meshBasicMaterial color="#06B6D4" transparent opacity={0.5} />
        </mesh>

        {/* SATELLITE 1 */}
        <Sphere args={[0.16, 16, 16]} position={[2.5, 0, 0]}>
          <meshStandardMaterial color="#FF7A00" emissive="#FF7A00" emissiveIntensity={0.8} />
        </Sphere>

        {/* SATELLITE 2 */}
        <Sphere args={[0.13, 16, 16]} position={[-1.8, 1.8, 0]}>
          <meshStandardMaterial color="#2563EB" emissive="#2563EB" emissiveIntensity={0.8} />
        </Sphere>
      </Float>

      <ambientLight intensity={0.9} />
      <directionalLight position={[6, 6, 6]} intensity={1.3} color="#FFFFFF" />
      <pointLight position={[-4, -3, -2]} intensity={0.8} color="#FF7A00" />
    </group>
  );
}

export default function InteractiveAbout3D() {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: 380, position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 5.5], fov: 42 }} dpr={[1, 1.8]}>
        <Suspense fallback={null}>
          <StudioCore />
        </Suspense>
      </Canvas>
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          right: 12,
          background: 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(8px)',
          border: '1px solid #E2E8F0',
          borderRadius: 8,
          padding: '4px 10px',
          fontSize: '0.72rem',
          fontWeight: 700,
          color: '#64748B',
        }}
      >
        3D Studio Node Engine
      </div>
    </div>
  );
}
