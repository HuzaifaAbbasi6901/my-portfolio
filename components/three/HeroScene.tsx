"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";

export interface HeroSceneProps {
  theme: "dark" | "light";
  scrollProgress: MotionValue<number>;
  /** When false, the render loop pauses (scene is off-screen). */
  active?: boolean;
}

/* ── Particle star field ──────────────────────────────────────────────── */

function ParticleField({ isDark }: { isDark: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 700;
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Random point in a spherical shell.
      const radius = 2.8 + Math.random() * 5.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      array[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      array[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      array[i * 3 + 2] = radius * Math.cos(phi);
    }
    return array;
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.02;
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.08;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        sizeAttenuation
        transparent
        opacity={isDark ? 0.75 : 0.5}
        color={isDark ? "#9B85FF" : "#6D4AFF"}
        depthWrite={false}
        blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </points>
  );
}

/* ── Click burst ──────────────────────────────────────────────────────── */

function Burst({
  trigger,
  isDark,
}: {
  trigger: number;
  isDark: boolean;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const life = useRef(1);
  const count = 60;

  const { positions, velocities } = useMemo(() => {
    return {
      positions: new Float32Array(count * 3),
      velocities: Array.from({ length: count }, () => {
        const dir = new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5
        ).normalize();
        return dir.multiplyScalar(1.6 + Math.random() * 2.2);
      }),
    };
  }, []);

  useEffect(() => {
    if (trigger === 0) return;
    life.current = 0;
  }, [trigger]);

  useFrame((_, delta) => {
    if (life.current >= 1 || !pointsRef.current) return;
    life.current = Math.min(life.current + delta * 1.4, 1);
    const t = life.current;

    const attr = pointsRef.current.geometry.getAttribute(
      "position"
    ) as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      const v = velocities[i];
      // Ease-out drift.
      const speed = (1 - Math.pow(t, 2.2)) * 2.4;
      attr.setXYZ(
        i,
        v.x * speed * 0.8,
        v.y * speed * 0.8 + t * 0.4,
        v.z * speed * 0.8
      );
    }
    attr.needsUpdate = true;

    if (materialRef.current) {
      materialRef.current.opacity = isDark ? (1 - t) * 0.9 : (1 - t) * 0.55;
    }
  });

  if (trigger === 0) return null;

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.06}
        sizeAttenuation
        transparent
        opacity={0.9}
        color={isDark ? "#22D3EE" : "#0891B2"}
        depthWrite={false}
        blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </points>
  );
}

/* ── Shockwave ring ───────────────────────────────────────────────────── */

function ShockRing({ trigger }: { trigger: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const life = useRef(1);

  useEffect(() => {
    if (trigger === 0) return;
    life.current = 0;
  }, [trigger]);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh || life.current >= 1) return;
    life.current = Math.min(life.current + delta * 1.6, 1);
    const t = life.current;
    const eased = 1 - Math.pow(1 - t, 3);
    mesh.scale.setScalar(0.6 + eased * 3.2);
    const material = mesh.material as THREE.MeshBasicMaterial;
    material.opacity = (1 - t) * 0.5;
  });

  if (trigger === 0) return null;

  return (
    <mesh ref={meshRef} rotation={[Math.PI / 2.4, 0.3, 0]} scale={0.6}>
      <torusGeometry args={[1.5, 0.012, 12, 90]} />
      <meshBasicMaterial
        color="#22D3EE"
        transparent
        opacity={0.5}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ── The centerpiece ──────────────────────────────────────────────────── */

function Centerpiece({
  isDark,
  scrollProgress,
  onPulse,
}: {
  isDark: boolean;
  scrollProgress: MotionValue<number>;
  onPulse: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const wireRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    // Scroll-driven rotation, drift and scale.
    const progress = scrollProgress.get();
    group.rotation.y += delta * 0.12;
    group.rotation.z = progress * Math.PI * 0.5;
    group.position.y = progress * 1.6;
    const scale = 1 - progress * 0.22;
    group.scale.setScalar(scale);

    // Cursor-reactive tilt with eased damping.
    const targetX = state.pointer.y * -0.35;
    group.rotation.x += (targetX - group.rotation.x) * 0.045;

    if (wireRef.current) {
      wireRef.current.rotation.y -= delta * 0.06;
      wireRef.current.rotation.x += delta * 0.025;
    }
  });

  const accent = isDark ? "#8B6DFF" : "#6D4AFF";
  const accentSoft = isDark ? "#B7A6FF" : "#8B6DFF";

  return (
    <group ref={groupRef}>
      <Float speed={1.6} rotationIntensity={0.4} floatIntensity={0.9}>
        <mesh onClick={(e) => { e.stopPropagation(); onPulse(); }}>
          <icosahedronGeometry args={[1.35, 24]} />
          {/* Liquid-glass look: glossy clearcoat + transparency (cheap — no
              transmission render pass, stays 60fps on modest GPUs) */}
          <MeshDistortMaterial
            color={accent}
            distort={0.4}
            speed={1.6}
            roughness={0.08}
            metalness={0.12}
            transparent
            opacity={isDark ? 0.72 : 0.62}
            clearcoat={1}
            clearcoatRoughness={0.06}
            emissive={accent}
            emissiveIntensity={isDark ? 0.3 : 0.14}
          />
        </mesh>

        {/* Wireframe shell */}
        <mesh ref={wireRef} scale={1.85}>
          <icosahedronGeometry args={[1.35, 1]} />
          <meshBasicMaterial
            color={accentSoft}
            wireframe
            transparent
            opacity={isDark ? 0.14 : 0.2}
          />
        </mesh>

        {/* Orbital ring */}
        <mesh rotation={[Math.PI / 2.2, 0, 0.4]}>
          <torusGeometry args={[2.15, 0.008, 8, 120]} />
          <meshBasicMaterial
            color={isDark ? "#22D3EE" : "#0891B2"}
            transparent
            opacity={0.4}
          />
        </mesh>
      </Float>
    </group>
  );
}

/* ── Cursor-follow camera rig ─────────────────────────────────────────── */

function Rig() {
  useFrame((state) => {
    state.camera.position.x +=
      (state.pointer.x * 0.55 - state.camera.position.x) * 0.04;
    state.camera.position.y +=
      (state.pointer.y * 0.4 - state.camera.position.y) * 0.04;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ── Scene ────────────────────────────────────────────────────────────── */

export default function HeroScene({
  theme,
  scrollProgress,
  active = true,
}: HeroSceneProps) {
  const isDark = theme === "dark";
  const [dpr, setDpr] = useState(1.5);
  const [pulse, setPulse] = useState(0);

  return (
    <Canvas
      dpr={dpr}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 6], fov: 42 }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
      style={{ background: "transparent" }}
    >
      <PerformanceMonitor
        onDecline={() => setDpr(1)}
        onIncline={() => setDpr(1.75)}
      />
      <ambientLight intensity={isDark ? 0.45 : 0.75} />
      <directionalLight position={[5, 6, 5]} intensity={isDark ? 1.4 : 1.8} />
      <pointLight
        position={[-6, -3, -4]}
        intensity={isDark ? 60 : 40}
        color={isDark ? "#22D3EE" : "#0891B2"}
      />
      <pointLight
        position={[6, 4, 2]}
        intensity={isDark ? 70 : 45}
        color={isDark ? "#8B6DFF" : "#6D4AFF"}
      />

      <Centerpiece
        isDark={isDark}
        scrollProgress={scrollProgress}
        onPulse={() => setPulse((p) => p + 1)}
      />
      <ParticleField isDark={isDark} />
      <Burst trigger={pulse} isDark={isDark} />
      <ShockRing trigger={pulse} />
      <Rig />
    </Canvas>
  );
}
