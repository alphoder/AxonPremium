"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ── Words to cycle through ── */
const WORDS = ["AXON PREMIUM", "AR EXPERIENCE"];
const PARTICLE_COUNT = 1500;
const CHANGE_INTERVAL = 3; // seconds
const TRANSITION_DURATION = 1.4; // seconds

/* ── Sample text pixels from an offscreen canvas ── */
function sampleTextPositions(
  text: string,
  count: number,
  scaleX: number,
  scaleY: number
): Float32Array {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const size = 512; // Higher resolution canvas for sharper sampling
  canvas.width = size;
  canvas.height = size;

  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Start with a large font and measure, then scale to fit 90% of canvas
  ctx.font = `600 120px "DM Sans", Arial, sans-serif`;
  const measured = ctx.measureText(text).width;
  let finalSize = Math.floor(120 * (size * 0.88) / measured);
  finalSize = Math.min(finalSize, 140); // cap so short words don't get absurdly tall
  ctx.font = `600 ${finalSize}px "DM Sans", Arial, sans-serif`;

  ctx.fillText(text, size / 2, size / 2);

  const imageData = ctx.getImageData(0, 0, size, size);
  const pixels = imageData.data;

  // Collect all filled pixel positions (sample every 2px for density)
  const filledPositions: [number, number][] = [];
  for (let y = 0; y < size; y += 2) {
    for (let x = 0; x < size; x += 2) {
      const idx = (y * size + x) * 4;
      if (pixels[idx + 3] > 128) {
        filledPositions.push([x, y]);
      }
    }
  }

  const positions = new Float32Array(count * 3);

  if (filledPositions.length === 0) {
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.5 + Math.random() * 0.5;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
    }
    return positions;
  }

  for (let i = 0; i < count; i++) {
    const [px, py] =
      filledPositions[Math.floor(Math.random() * filledPositions.length)];
    // Map pixel to 3D space with very tight jitter for crisp text
    positions[i * 3] =
      ((px - size / 2) / size) * scaleX + (Math.random() - 0.5) * 0.02;
    positions[i * 3 + 1] =
      (-(py - size / 2) / size) * scaleY + (Math.random() - 0.5) * 0.02;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.08;
  }

  return positions;
}

/* ── Custom easing ── */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/* ── Vertex Shader ── */
const vertexShader = `
  attribute float aSize;
  attribute float aAlpha;
  attribute float aPhase;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vAlpha;
  varying float vPhase;

  void main() {
    vAlpha = aAlpha;
    vPhase = aPhase;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    float pulse = 1.0 + 0.08 * sin(uTime * 1.5 + aPhase * 6.28);
    gl_PointSize = aSize * pulse * uPixelRatio * (24.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

/* ── Fragment Shader ── */
const fragmentShader = `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vAlpha;
  varying float vPhase;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    // Sharp bright dot with soft edge
    float softEdge = 1.0 - smoothstep(0.1, 0.5, dist);

    // Clean warm white-gold color
    vec3 color = mix(uColorA, uColorB, vPhase);

    // Bright hot center
    float core = exp(-dist * 6.0) * 0.6;
    color += vec3(1.0, 0.97, 0.9) * core;

    // Overall brightness lift
    color *= 1.3;

    gl_FragColor = vec4(color, softEdge * vAlpha);
  }
`;

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = 600;

    /* ── Scene ── */
    const scene = new THREE.Scene();

    /* ── Camera ── */
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.5);

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.background = "transparent";
    container.appendChild(renderer.domElement);

    /* ── Scale factors — wide to fill viewport edge-to-edge ── */
    const scaleX = 9;
    const scaleY = 9;

    /* ── Generate initial positions ── */
    let currentWordIndex = 0;
    let targetPositions = sampleTextPositions(
      WORDS[currentWordIndex],
      PARTICLE_COUNT,
      scaleX,
      scaleY
    );

    /* ── Create particle geometry ── */
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const alphas = new Float32Array(PARTICLE_COUNT);
    const phases = new Float32Array(PARTICLE_COUNT);

    // Start particles scattered
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2 + Math.random() * 4;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;

      sizes[i] = 0.5 + Math.random() * 0.6; // Small crisp dots
      alphas[i] = 0.7 + Math.random() * 0.3; // Bright
      phases[i] = Math.random();
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("aAlpha", new THREE.BufferAttribute(alphas, 1));
    geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));

    /* ── Shader Material ── */
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uColorA: { value: new THREE.Color("#E8D5B7") }, // Warm light gold
        uColorB: { value: new THREE.Color("#C9A96E") }, // Deeper gold
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    /* ── Ambient dust ── */
    const dustCount = 150;
    const dustGeometry = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 16;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    dustGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(dustPositions, 3)
    );
    const dustMaterial = new THREE.PointsMaterial({
      color: 0xf5d5a0,
      size: 0.006,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
    });
    const dust = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dust);

    /* ── Transition State ── */
    let transitionProgress = 0;
    let isTransitioning = true;
    let timeSinceLastChange = 0;
    const sourcePositions = new Float32Array(PARTICLE_COUNT * 3);
    sourcePositions.set(positions);

    const chaosPositions = new Float32Array(PARTICLE_COUNT * 3);

    function generateChaosPositions() {
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 0.5 + Math.random() * 4;
        const heightOffset = (Math.random() - 0.5) * 3;

        chaosPositions[i * 3] = Math.cos(angle) * radius;
        chaosPositions[i * 3 + 1] = heightOffset;
        chaosPositions[i * 3 + 2] = Math.sin(angle) * radius * 0.4;
      }
    }
    generateChaosPositions();

    /* ── Animation Loop ── */
    const clock = new THREE.Clock();

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      material.uniforms.uTime.value = elapsed;

      dust.rotation.y = elapsed * 0.015;
      dust.rotation.x = Math.sin(elapsed * 0.08) * 0.03;

      if (isTransitioning) {
        transitionProgress += delta / TRANSITION_DURATION;

        if (transitionProgress >= 1) {
          transitionProgress = 1;
          isTransitioning = false;
          timeSinceLastChange = 0;
        }

        const posAttr = geometry.attributes.position as THREE.BufferAttribute;
        const arr = posAttr.array as Float32Array;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const i3 = i * 3;
          const t = transitionProgress;

          if (t <= 0.4) {
            const p = easeInOutCubic(t / 0.4);
            arr[i3] =
              sourcePositions[i3] +
              (chaosPositions[i3] - sourcePositions[i3]) * p;
            arr[i3 + 1] =
              sourcePositions[i3 + 1] +
              (chaosPositions[i3 + 1] - sourcePositions[i3 + 1]) * p;
            arr[i3 + 2] =
              sourcePositions[i3 + 2] +
              (chaosPositions[i3 + 2] - sourcePositions[i3 + 2]) * p;

            const turbulence =
              Math.sin(elapsed * 8 + phases[i] * 20) * 0.08 * p;
            arr[i3] += turbulence;
            arr[i3 + 1] +=
              Math.cos(elapsed * 6 + phases[i] * 15) * 0.06 * p;
          } else {
            const p = easeInOutCubic((t - 0.4) / 0.6);
            arr[i3] =
              chaosPositions[i3] +
              (targetPositions[i3] - chaosPositions[i3]) * p;
            arr[i3 + 1] =
              chaosPositions[i3 + 1] +
              (targetPositions[i3 + 1] - chaosPositions[i3 + 1]) * p;
            arr[i3 + 2] =
              chaosPositions[i3 + 2] +
              (targetPositions[i3 + 2] - chaosPositions[i3 + 2]) * p;

            const damping = 1 - p;
            arr[i3] +=
              Math.sin(elapsed * 5 + phases[i] * 10) * 0.03 * damping;
            arr[i3 + 1] +=
              Math.cos(elapsed * 4 + phases[i] * 8) * 0.025 * damping;
          }
        }

        posAttr.needsUpdate = true;
      } else {
        const posAttr = geometry.attributes.position as THREE.BufferAttribute;
        const arr = posAttr.array as Float32Array;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const i3 = i * 3;
          const breathe =
            Math.sin(elapsed * 1.2 + phases[i] * 6.28) * 0.008;
          const drift = Math.cos(elapsed * 0.6 + phases[i] * 4) * 0.005;

          arr[i3] = targetPositions[i3] + drift;
          arr[i3 + 1] = targetPositions[i3 + 1] + breathe;
          arr[i3 + 2] =
            targetPositions[i3 + 2] +
            Math.sin(elapsed * 1.0 + phases[i] * 3) * 0.006;
        }

        posAttr.needsUpdate = true;

        timeSinceLastChange += delta;
        if (timeSinceLastChange >= CHANGE_INTERVAL) {
          sourcePositions.set(arr);

          currentWordIndex = (currentWordIndex + 1) % WORDS.length;
          targetPositions = sampleTextPositions(
            WORDS[currentWordIndex],
            PARTICLE_COUNT,
            scaleX,
            scaleY
          );

          generateChaosPositions();
          transitionProgress = 0;
          isTransitioning = true;
        }
      }

      // Very subtle camera sway
      camera.position.x = Math.sin(elapsed * 0.12) * 0.06;
      camera.position.y = Math.cos(elapsed * 0.1) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    /* ── Resize ── */
    const handleResize = () => {
      const w = container.clientWidth;
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
      renderer.setSize(w, height);
      material.uniforms.uPixelRatio.value = Math.min(
        window.devicePixelRatio,
        2
      );
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      dustGeometry.dispose();
      dustMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-[600px] w-full"
      style={{ background: "transparent" }}
    />
  );
}
