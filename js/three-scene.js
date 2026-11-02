/**
 * 3D Geometric Scene Engine (Three.js)
 * Features:
 * - Abstract polyhedral geometries that respond smoothly to mouse movement
 * - Interactive inertia / lerp physics with dynamic lighting
 * - Scroll-linked camera and geometry translation for depth parallax
 * - Realtime shaders, wireframes, and particle dust
 * - Controls API for the interactive 3D laboratory
 */

import * as THREE from 'three';

class GeometricScene {
  constructor(canvasId = 'webgl-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    // State & Configurations
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.scrollY = 0;
    this.targetScrollY = 0;
    this.speedMultiplier = 1.0;
    this.mouseSensitivity = 1.5;
    this.currentGeoType = 'icosahedron';
    this.currentMatType = 'holographic';
    this.currentPalette = 'aurora';
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isVisible = true;

    // Clock
    this.clock = new THREE.Clock();

    // Palettes
    this.palettes = {
      aurora: {
        light1: 0x00f0ff, // Electric Cyan
        light2: 0xff007a, // Neon Magenta
        light3: 0x8a2be2, // Violet
        meshColor: 0x0f223f,
        wireColor: 0x00f0ff,
        particleColor: 0x64d9ff
      },
      matrix: {
        light1: 0x00ff88, // Emerald
        light2: 0x0066ff, // Royal Blue
        light3: 0x00ffcc, // Mint
        meshColor: 0x092a1d,
        wireColor: 0x00ff88,
        particleColor: 0x4dfcb0
      },
      solar: {
        light1: 0xffaa00, // Solar Amber
        light2: 0xff0055, // Crimson
        light3: 0xffe600, // Gold
        meshColor: 0x361808,
        wireColor: 0xffaa00,
        particleColor: 0xffc466
      },
      mono: {
        light1: 0xffffff, // White
        light2: 0x94a3b8, // Slate
        light3: 0x334155, // Steel
        meshColor: 0x141a24,
        wireColor: 0xe2e8f0,
        particleColor: 0xcfd8dc
      }
    };

    this.init();
  }

  init() {
    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x05070d, 0.04);

    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    this.camera.position.set(0, 0, 7.5);

    // 2. Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;

    // 3. Lighting Setup
    this.initLighting();

    // 4. Geometry & Meshes
    this.mainGroup = new THREE.Group();
    this.scene.add(this.mainGroup);

    this.createPrimaryMesh();
    this.createSatellites();
    this.createParticleField();

    // 5. Event Listeners
    this.bindEvents();

    // 6. Start Loop
    this.animate();
  }

  initLighting() {
    this.ambientLight = new THREE.AmbientLight(0x0a1020, 1.2);
    this.scene.add(this.ambientLight);

    const pal = this.palettes[this.currentPalette];

    // Point Light 1: Primary Cursor Tracker
    this.pointLight1 = new THREE.PointLight(pal.light1, 4.5, 20);
    this.pointLight1.position.set(3, 2, 4);
    this.scene.add(this.pointLight1);

    // Point Light 2: Secondary Orbiting Glow
    this.pointLight2 = new THREE.PointLight(pal.light2, 4.0, 20);
    this.pointLight2.position.set(-3, -2, 3);
    this.scene.add(this.pointLight2);

    // Point Light 3: Deep Rim Accent
    this.pointLight3 = new THREE.PointLight(pal.light3, 2.5, 15);
    this.pointLight3.position.set(0, 4, -2);
    this.scene.add(this.pointLight3);
  }

  getGeometryInstance(type) {
    switch (type) {
      case 'torusKnot':
        return new THREE.TorusKnotGeometry(1.4, 0.45, 128, 32);
      case 'octahedron':
        return new THREE.OctahedronGeometry(2.0, 0);
      case 'dodecahedron':
        return new THREE.DodecahedronGeometry(1.9, 0);
      case 'icosahedron':
      default:
        return new THREE.IcosahedronGeometry(2.0, 0);
    }
  }

  getMaterials(mode) {
    const pal = this.palettes[this.currentPalette];
    let mainMat, wireMat;

    switch (mode) {
      case 'wireframe':
        mainMat = new THREE.MeshBasicMaterial({
          color: pal.meshColor,
          wireframe: true,
          transparent: true,
          opacity: 0.15
        });
        wireMat = new THREE.MeshBasicMaterial({
          color: pal.wireColor,
          wireframe: true,
          transparent: true,
          opacity: 0.95
        });
        break;

      case 'particles':
        mainMat = new THREE.MeshPhysicalMaterial({
          color: 0x050811,
          roughness: 0.8,
          metalness: 0.1,
          transparent: true,
          opacity: 0.2
        });
        wireMat = new THREE.MeshBasicMaterial({
          color: pal.wireColor,
          wireframe: true,
          transparent: true,
          opacity: 0.5
        });
        break;

      case 'chrome':
        mainMat = new THREE.MeshStandardMaterial({
          color: 0x111625,
          metalness: 0.95,
          roughness: 0.15,
          envMapIntensity: 1.5
        });
        wireMat = new THREE.MeshBasicMaterial({
          color: pal.wireColor,
          wireframe: true,
          transparent: true,
          opacity: 0.6
        });
        break;

      case 'holographic':
      default:
        mainMat = new THREE.MeshPhysicalMaterial({
          color: pal.meshColor,
          metalness: 0.2,
          roughness: 0.1,
          transmission: 0.7,
          ior: 1.5,
          reflectivity: 0.9,
          clearcoat: 1.0,
          clearcoatRoughness: 0.1,
          transparent: true,
          opacity: 0.85
        });
        wireMat = new THREE.MeshBasicMaterial({
          color: pal.wireColor,
          wireframe: true,
          transparent: true,
          opacity: 0.7
        });
        break;
    }

    return { mainMat, wireMat };
  }

  createPrimaryMesh() {
    if (this.primaryMeshGroup) {
      this.mainGroup.remove(this.primaryMeshGroup);
    }

    this.primaryMeshGroup = new THREE.Group();

    const geometry = this.getGeometryInstance(this.currentGeoType);
    const { mainMat, wireMat } = this.getMaterials(this.currentMatType);

    // Solid/Glass Facet Body
    this.coreMesh = new THREE.Mesh(geometry, mainMat);
    this.primaryMeshGroup.add(this.coreMesh);

    // Wireframe Overlay
    this.wireMesh = new THREE.Mesh(geometry, wireMat);
    this.wireMesh.scale.setScalar(1.002);
    this.primaryMeshGroup.add(this.wireMesh);

    // Inner Concentric Counter-Rotating Core
    const innerGeo = new THREE.IcosahedronGeometry(1.1, 1);
    const innerMat = new THREE.MeshBasicMaterial({
      color: this.palettes[this.currentPalette].light2,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });
    this.innerCoreMesh = new THREE.Mesh(innerGeo, innerMat);
    this.primaryMeshGroup.add(this.innerCoreMesh);

    this.mainGroup.add(this.primaryMeshGroup);
  }

  createSatellites() {
    this.satellitesGroup = new THREE.Group();
    this.satellites = [];

    const pal = this.palettes[this.currentPalette];
    const satCount = 5;

    for (let i = 0; i < satCount; i++) {
      const geo = (i % 2 === 0)
        ? new THREE.OctahedronGeometry(0.35, 0)
        : new THREE.TetrahedronGeometry(0.4, 0);

      const mat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? pal.light1 : pal.light2,
        roughness: 0.2,
        metalness: 0.8,
        wireframe: i === 1 || i === 3
      });

      const mesh = new THREE.Mesh(geo, mat);

      const orbitRadius = 3.2 + i * 0.55;
      const angle = (i / satCount) * Math.PI * 2;
      const speed = 0.4 + (i * 0.15);

      mesh.position.set(
        Math.cos(angle) * orbitRadius,
        (Math.sin(angle * 2) * 1.2),
        Math.sin(angle) * orbitRadius
      );

      this.satellites.push({
        mesh,
        orbitRadius,
        angle,
        speed,
        rotSpeedX: 0.02 * (i + 1),
        rotSpeedY: 0.015 * (i + 1)
      });

      this.satellitesGroup.add(mesh);
    }

    this.mainGroup.add(this.satellitesGroup);
  }

  createParticleField() {
    const particleCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    const range = 24;
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * range;
      positions[i + 1] = (Math.random() - 0.5) * range;
      positions[i + 2] = (Math.random() - 0.5) * range;
      scales[i / 3] = Math.random() * 0.04 + 0.01;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    const pal = this.palettes[this.currentPalette];
    const material = new THREE.PointsMaterial({
      color: pal.particleColor,
      size: 0.045,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  bindEvents() {
    // Mouse movement
    window.addEventListener('mousemove', (e) => {
      // Normalize mouse to -1 to +1
      this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    }, { passive: true });

    // Touch movement
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.mouse.targetX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        this.mouse.targetY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    }, { passive: true });

    // Scroll
    window.addEventListener('scroll', () => {
      this.targetScrollY = window.scrollY;
    }, { passive: true });

    // Window Resize
    window.addEventListener('resize', () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    // Visibility detection for low-overhead tab throttling
    document.addEventListener('visibilitychange', () => {
      this.isVisible = !document.hidden;
    });
  }

  // API Methods for Interactive Lab Deck
  setGeometry(type) {
    this.currentGeoType = type;
    this.createPrimaryMesh();
  }

  setMaterial(type) {
    this.currentMatType = type;
    this.createPrimaryMesh();
  }

  setPalette(name) {
    if (!this.palettes[name]) return;
    this.currentPalette = name;
    const pal = this.palettes[name];

    // Update lights
    this.pointLight1.color.setHex(pal.light1);
    this.pointLight2.color.setHex(pal.light2);
    this.pointLight3.color.setHex(pal.light3);

    // Recreate primary mesh with updated colors
    this.createPrimaryMesh();

    // Update particles
    if (this.particles) {
      this.particles.material.color.setHex(pal.particleColor);
    }

    // Update satellites
    if (this.satellites) {
      this.satellites.forEach((sat, i) => {
        sat.mesh.material.color.setHex(i % 2 === 0 ? pal.light1 : pal.light2);
      });
    }
  }

  setSpeed(multiplier) {
    this.speedMultiplier = parseFloat(multiplier) || 1.0;
  }

  setMouseSensitivity(sens) {
    this.mouseSensitivity = parseFloat(sens) || 1.5;
  }

  triggerShockwave() {
    if (!this.primaryMeshGroup) return;

    // Kinetic impulse animation
    const startTime = performance.now();
    const duration = 800; // ms
    const initialScale = 1.0;
    const peakScale = 1.45;

    const animateShockwave = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Elastic overshoot curve
      const factor = Math.sin(progress * Math.PI);
      const scale = initialScale + (peakScale - initialScale) * factor;

      if (this.primaryMeshGroup) {
        this.primaryMeshGroup.scale.setScalar(scale);
      }

      if (progress < 1) {
        requestAnimationFrame(animateShockwave);
      } else {
        if (this.primaryMeshGroup) {
          this.primaryMeshGroup.scale.setScalar(1.0);
        }
      }
    };

    requestAnimationFrame(animateShockwave);
  }

  resetCamera() {
    this.mouse.targetX = 0;
    this.mouse.targetY = 0;
    this.mouse.x = 0;
    this.mouse.y = 0;
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (!this.isVisible) return;

    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime() * this.speedMultiplier;

    // --- MOUSE LERP (Fluid momentum physics) ---
    const lerpFactor = this.isReducedMotion ? 0.02 : 0.05;
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * lerpFactor;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * lerpFactor;

    // Scroll Lerp
    this.scrollY += (this.targetScrollY - this.scrollY) * 0.08;

    // Telemetry display update (optional UI sync)
    const telemetryEl = document.getElementById('telemetry-mouse');
    if (telemetryEl && !this.isReducedMotion) {
      telemetryEl.textContent = `X: ${this.mouse.x.toFixed(2)} · Y: ${this.mouse.y.toFixed(2)}`;
    }

    // --- 1. CORE ROTATION & TILT ---
    if (this.primaryMeshGroup) {
      if (!this.isReducedMotion) {
        // Continuous ambient rotation
        this.primaryMeshGroup.rotation.y = time * 0.35 + (this.mouse.x * this.mouseSensitivity);
        this.primaryMeshGroup.rotation.x = time * 0.2 - (this.mouse.y * this.mouseSensitivity);
        this.primaryMeshGroup.rotation.z = Math.sin(time * 0.3) * 0.15;

        // Counter-rotate the inner wireframe core
        if (this.innerCoreMesh) {
          this.innerCoreMesh.rotation.y = -time * 0.7;
          this.innerCoreMesh.rotation.x = time * 0.5;
        }
      }

      // Parallax translation based on page scroll
      // As user scrolls down, the geometry translates downward & zooms gently back
      const scrollProgress = Math.min(this.scrollY / (window.innerHeight || 800), 2);
      this.primaryMeshGroup.position.y = -scrollProgress * 2.2;
      this.primaryMeshGroup.position.z = -scrollProgress * 1.5;
    }

    // --- 2. SATELLITES ORBIT ---
    if (this.satellites && !this.isReducedMotion) {
      this.satellites.forEach(sat => {
        sat.angle += sat.speed * delta * this.speedMultiplier;
        sat.mesh.position.x = Math.cos(sat.angle) * sat.orbitRadius;
        sat.mesh.position.z = Math.sin(sat.angle) * sat.orbitRadius;
        sat.mesh.position.y = Math.sin(sat.angle * 2.0) * 1.2;

        sat.mesh.rotation.x += sat.rotSpeedX;
        sat.mesh.rotation.y += sat.rotSpeedY;
      });
    }

    // --- 3. DYNAMIC POINT LIGHT MOVEMENT ---
    if (!this.isReducedMotion) {
      // Light 1 tracks mouse directly with inertia
      this.pointLight1.position.x = this.mouse.x * 5;
      this.pointLight1.position.y = this.mouse.y * 4 + 1;
      this.pointLight1.position.z = 4 - Math.abs(this.mouse.x) * 1.5;

      // Light 2 orbits harmonically
      this.pointLight2.position.x = Math.cos(time * 0.8) * 4;
      this.pointLight2.position.y = Math.sin(time * 0.6) * 3;
      this.pointLight2.position.z = Math.sin(time * 0.8) * 4;
    }

    // --- 4. PARTICLE FIELD DRIFT ---
    if (this.particles && !this.isReducedMotion) {
      this.particles.rotation.y = time * 0.03;
      this.particles.rotation.x = time * 0.015;
    }

    // --- 5. CAMERA PARALLAX SHIFT ---
    if (!this.isReducedMotion) {
      this.camera.position.x = this.mouse.x * 0.8;
      this.camera.position.y = this.mouse.y * 0.6;
      this.camera.lookAt(0, -this.scrollY * 0.002, 0);
    }

    // Render Scene
    this.renderer.render(this.scene, this.camera);
  }
}

export default GeometricScene;

