import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Torus } from '@react-three/drei';

function BeaconNode() {
  const coreRef = useRef();
  const wave1 = useRef();
  const wave2 = useRef();
  const wave3 = useRef();

  useFrame((state, delta) => {
    const px = state.pointer.x * 0.6;
    const py = state.pointer.y * 0.6;

    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.35 + px * 0.02;
      coreRef.current.rotation.x += delta * 0.15 + py * 0.02;
    }

    // Pulsing communication waves
    const time = state.clock.getElapsedTime();
    if (wave1.current) {
      const s1 = 1 + Math.sin(time * 2) * 0.12;
      wave1.current.scale.set(s1, s1, s1);
      wave1.current.rotation.z += delta * 0.18;
    }
    if (wave2.current) {
      const s2 = 1 + Math.sin(time * 2 + 1) * 0.14;
      wave2.current.scale.set(s2, s2, s2);
      wave2.current.rotation.z -= delta * 0.14;
    }
    if (wave3.current) {
      const s3 = 1 + Math.sin(time * 2 + 2) * 0.16;
      wave3.current.scale.set(s3, s3, s3);
      wave3.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <group>
      <Float speed={2} rotationIntensity={0.6} floatIntensity={0.9}>
        {/* TRANSMISSION BEACON CORE */}
        <mesh ref={coreRef} scale={1.2}>
          <octahedronGeometry args={[1, 1]} />
          <meshStandardMaterial
            color="#2563EB"
            emissive="#1D4ED8"
            roughness={0.15}
            metalness={0.4}
          />
        </mesh>

        {/* EMITTING SIGNAL RINGS */}
        <mesh ref={wave1} rotation={[Math.PI / 2.5, 0, 0]}>
          <torusGeometry args={[2.0, 0.025, 16, 80]} />
          <meshBasicMaterial color="#06B6D4" transparent opacity={0.8} />
        </mesh>

        <mesh ref={wave2} rotation={[Math.PI / 3.2, Math.PI / 5, 0]}>
          <torusGeometry args={[2.5, 0.02, 16, 80]} />
          <meshBasicMaterial color="#FF7A00" transparent opacity={0.65} />
        </mesh>

        <mesh ref={wave3} rotation={[0, Math.PI / 4, Math.PI / 6]}>
          <torusGeometry args={[3.0, 0.015, 16, 80]} />
          <meshBasicMaterial color="#10B981" transparent opacity={0.5} />
        </mesh>

        {/* ACTIVE STATUS DOT */}
        <Sphere args={[0.2, 16, 16]} position={[0, 0, 0]}>
          <meshBasicMaterial color="#FFFFFF" />
        </Sphere>
      </Float>

      <ambientLight intensity={0.9} />
      <directionalLight position={[6, 6, 6]} intensity={1.4} color="#FFFFFF" />
      <pointLight position={[-4, -3, -2]} intensity={0.8} color="#06B6D4" />
    </group>
  );
}

export default function InteractiveContact3D() {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: 260, position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 42 }} dpr={[1, 1.8]}>
        <Suspense fallback={null}>
          <BeaconNode />
        </Suspense>
      </Canvas>
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(8px)',
          border: '1px solid #E2E8F0',
          borderRadius: 8,
          padding: '4px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: '0.74rem',
          fontWeight: 700,
          color: '#059669',
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
        <span>Scoping Signal: Active (Under 4hr response)</span>
      </div>
    </div>
  );
}
