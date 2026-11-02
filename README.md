# Valentin Vance — Interactive Spatial Portfolio

A state-of-the-art personal portfolio demonstrating an interactive hero section with scroll-triggered parallax layers, 3D abstract polyhedral shapes responding to cursor physics, an intelligent floating navigation dock that reveals after scrolling past the hero, and glassmorphic card elements with 3D tilt and specular lighting.

---

## 🌟 Key Features

### 1. Interactive Hero Section with Scroll-Triggered Parallax Layers
- **Native CSS Scroll-Driven Animations**: Employs `@supports ((animation-timeline: scroll()) and (animation-range: 0% 100%))` conforming strictly to modern web guidelines (`parallax-scroll-effects`).
- **Multi-Depth Staggered Parallax**:
  - **Layer 0 (HUD & Telemetry)**: Moves slowly (`translateY(140px)`).
  - **Layer 1 (Floating Glass Chips)**: Moves at mid velocity (`translateY(320px)`).
  - **Layer 2 (Core Identity & Typography)**: Moves at primary velocity (`translateY(480px)`), with progressive blur and opacity fade.
- **Progressive Fallback**: Smooth `requestAnimationFrame` scroll fallback for browsers without native scroll-timeline support.
- **Accessibility**: First-class `@media (prefers-reduced-motion: reduce)` support.

### 2. Abstract Geometric Shapes with Real-Time Mouse Physics
- **Three.js WebGL Engine**: Renders a multi-element geometric constellation (Icosahedron, Torus Knot, Octahedrons, Dodecahedron, Orbiting Satellites, and 1,000 Cosmic Dust particles).
- **Interpolated Momentum Physics (Lerp)**: Cursor coordinates are normalized with damping (`lerpFactor = 0.05`), producing smooth 3D tilt and orientation.
- **Dynamic Lighting**: Point lights follow the mouse pointer in real-time, casting specular glints across faceted geometry.
- **Scroll Synchronization**: Camera and polyhedral clusters seamlessly translate along the Z and Y axes on scroll.

### 3. Hero Identity & Load Fade-In
- **Hero Name**: Monumental bold display typography (`Syne` 900) with animated iridescent text gradient shimmer (`aurora`).
- **Tagline**: Sequential, staggered fade-in on load (`PRINCIPAL CREATIVE TECHNOLOGIST & SPATIAL SYSTEMS ARCHITECT`).
- **Status Indicator**: Live pulsing commission status badge (`AVAILABLE FOR SELECT COMMISSIONS · 2027`).

### 4. Floating Navigation Bar (Appears After Hero)
- **Scroll Threshold Trigger**: Positioned at the top center of the screen, initially hidden off-screen while viewing the hero.
- **Dynamic Glassmorphic Dock**: Transitions into view with a smooth spring slide-down animation immediately after the visitor scrolls past the hero section threshold (via `IntersectionObserver` on `#hero-sentinel`).
- **Active Section Spy**: Highlights active anchors as sections scroll into view.
- **Sensory Controls**: Sound toggle, responsive mobile drawer, and CTA.

### 5. Glassmorphism Card System
- **Advanced Glass Styling**: `backdrop-filter: blur(20px) saturate(180%)`, multi-layer soft drop shadows, and delicate 1px semi-transparent borders.
- **Interactive 3D Card Tilt**: Mouseover tilts each card in 3D space (`perspective: 1000px`, `rotateX`, `rotateY`).
- **Dynamic Specular Glare**: Radial glare hotspot (`--mouse-x`, `--mouse-y`) follows the cursor across each card surface.

### 6. Sensory Micro-Acoustics
- Web Audio API procedural synthesizer providing soft tactical clicks and resonant harmonic chimes without external audio assets.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)

### Quick Start
```bash
# 1. Start local development server
npm run dev

# 2. Or build for production
npm run build

# 3. Preview production build
npm run preview
```

---

## 🛠 Tech Stack
- **Runtime / Bundler**: Vite 6, Node.js
- **Graphics Engine**: Three.js
- **Styling**: Modern CSS (Scroll-Driven Animations, OKLCH / OKLAB, Backdrop Filter, Container Grids)
- **Audio**: Web Audio API
- **Fonts**: Syne, Space Grotesk, JetBrains Mono

