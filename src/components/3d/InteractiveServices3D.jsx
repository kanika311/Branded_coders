import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Wireframe } from '@react-three/drei';

function ServiceCrystal({ activeCategory = 'marketing' }) {
  const crystalRef = useRef();
  const wireRef = useRef();
  const mousePos = useRef({ x: 0, y: 0 });

  const colorMap = {
    'digital-marketing': { core: '#FF7A00', glow: '#F59E0B', speed: 2.2, distort: 0.35 },
    'websites': { core: '#2563EB', glow: '#06B6D4', speed: 1.8, distort: 0.25 },
    'cms': { core: '#10B981', glow: '#34D399', speed: 1.9, distort: 0.28 },
    'dashboards': { core: '#8B5CF6', glow: '#A78BFA', speed: 2.0, distort: 0.32 },
    'apps': { core: '#EC4899', glow: '#F472B6', speed: 2.1, distort: 0.3 },
    'ai-platforms': { core: '#6366F1', glow: '#818CF8', speed: 2.5, distort: 0.4 },
  };

  const currentTheme = colorMap[activeCategory] || colorMap['websites'];

  useFrame((state, delta) => {
    const targetX = state.pointer.x * 0.7;
    const targetY = state.pointer.y * 0.7;
    mousePos.current.x += (targetX - mousePos.current.x) * 0.05;
    mousePos.current.y += (targetY - mousePos.current.y) * 0.05;

    if (crystalRef.current) {
      crystalRef.current.rotation.x += delta * 0.22 + mousePos.current.y * 0.02;
      crystalRef.current.rotation.y += delta * 0.3 + mousePos.current.x * 0.02;
    }
    if (wireRef.current) {
      wireRef.current.rotation.x -= delta * 0.15;
      wireRef.current.rotation.y -= delta * 0.2;
    }
  });

  return (
    <group>
      <Float speed={2} rotationIntensity={0.6} floatIntensity={1}>
        {/* INNER SOLID GLOWING SHAPE */}
        <mesh ref={crystalRef} scale={1.6}>
          <dodecahedronGeometry args={[1, 0]} />
          <MeshDistortMaterial
            color={currentTheme.core}
            emissive={currentTheme.glow}
            emissiveIntensity={0.5}
            roughness={0.2}
            metalness={0.35}
            distort={currentTheme.distort}
            speed={currentTheme.speed}
          />
        </mesh>

        {/* OUTER HOLOGRAPHIC WIREFRAME CAGE */}
        <mesh ref={wireRef} scale={2.2}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color={currentTheme.glow} wireframe transparent opacity={0.35} />
        </mesh>
      </Float>

      {/* AMBIENT LIGHTS */}
      <pointLight position={[4, 4, 4]} intensity={1.2} color={currentTheme.glow} />
      <pointLight position={[-4, -4, -2]} intensity={0.9} color="#FFFFFF" />
    </group>
  );
}

export default function InteractiveServices3D({ activeServiceSlug }) {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: 320, position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 1.8]}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[6, 6, 6]} intensity={1.4} />
        <Suspense fallback={null}>
          <ServiceCrystal activeCategory={activeServiceSlug} />
        </Suspense>
      </Canvas>
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          right: 12,
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid #E2E8F0',
          borderRadius: 8,
          padding: '4px 10px',
          fontSize: '0.72rem',
          fontWeight: 700,
          color: '#64748B',
        }}
      >
        Interactive 3D Matrix
      </div>
    </div>
  );
}
