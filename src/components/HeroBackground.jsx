import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";
import { useRef } from "react";

function FloatingSphere() {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.2;
      ref.current.rotation.x = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <Sphere ref={ref} args={[1, 64, 64]} scale={1.4}>
      <MeshDistortMaterial
        color="#7c3aed"
        distort={0.25}
        speed={1.5}
        roughness={0.3}
      />
    </Sphere>
  );
}

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 7] }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 3, 5]} intensity={1.2} />
        <FloatingSphere />
      </Canvas>
    </div>
  );
}