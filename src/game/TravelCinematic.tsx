"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { CITIES, getCity } from "@/data/cities";

/**
 * The travel animation between cities, rendered with Three.js: a low-poly
 * Moroccan coast, the six cities of the route as little minaret markers, and
 * Selma's bus driving from the current city to the destination while the
 * camera follows. Pure geometry and lights — no binary assets.
 *
 * Phaser owns the playable 2D world; this cinematic is the one place V2
 * hands an animation to Three.js.
 */

interface TravelCinematicProps {
  fromCityId: string;
  toCityId: string;
  unlockedCityIds: string[];
  onArrival: () => void;
}

/** Map the 2D route coordinates (0-100) onto the 3D ground plane. */
function cityWorldPos(cityId: string): THREE.Vector3 {
  const { position } = getCity(cityId);
  return new THREE.Vector3((position.x - 50) * 0.42, 0, (position.y - 50) * 0.34);
}

function makeBus(): THREE.Group {
  const bus = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(2.6, 1.1, 1.2),
    new THREE.MeshLambertMaterial({ color: 0xe76f51 }),
  );
  body.position.y = 0.95;
  bus.add(body);
  const stripe = new THREE.Mesh(
    new THREE.BoxGeometry(2.62, 0.22, 1.22),
    new THREE.MeshLambertMaterial({ color: 0xf3e6c8 }),
  );
  stripe.position.y = 1.05;
  bus.add(stripe);
  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 0.4, 1.05),
    new THREE.MeshLambertMaterial({ color: 0xf3e6c8 }),
  );
  roof.position.y = 1.7;
  bus.add(roof);
  const windowMat = new THREE.MeshLambertMaterial({ color: 0x7fc8bd });
  for (const wx of [-0.8, 0, 0.8]) {
    const win = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 1.24), windowMat);
    win.position.set(wx, 1.15, 0);
    bus.add(win);
  }
  const wheelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.25, 12);
  const wheelMat = new THREE.MeshLambertMaterial({ color: 0x2c2030 });
  for (const [wx, wz] of [[-0.9, 0.62], [0.9, 0.62], [-0.9, -0.62], [0.9, -0.62]] as const) {
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.rotation.x = Math.PI / 2;
    wheel.position.set(wx, 0.32, wz);
    bus.add(wheel);
  }
  return bus;
}

function makeCityMarker(accent: string, unlocked: boolean): THREE.Group {
  const group = new THREE.Group();
  const color = unlocked ? new THREE.Color(accent) : new THREE.Color(0x8a8f98);
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(1.1, 1.3, 0.5, 8),
    new THREE.MeshLambertMaterial({ color: unlocked ? 0xf3e6c8 : 0xb9b0a2 }),
  );
  base.position.y = 0.25;
  group.add(base);
  const tower = new THREE.Mesh(
    new THREE.CylinderGeometry(0.42, 0.55, 2.1, 6),
    new THREE.MeshLambertMaterial({ color: unlocked ? 0xfdf9f0 : 0xcfc8bb }),
  );
  tower.position.y = 1.55;
  group.add(tower);
  const cap = new THREE.Mesh(
    new THREE.ConeGeometry(0.6, 0.9, 6),
    new THREE.MeshLambertMaterial({ color }),
  );
  cap.position.y = 3.05;
  group.add(cap);
  return group;
}

export function TravelCinematic({
  fromCityId,
  toCityId,
  unlockedCityIds,
  onArrival,
}: TravelCinematicProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const arrivedRef = useRef(false);
  const onArrivalRef = useRef(onArrival);
  onArrivalRef.current = onArrival;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 800;
    const height = mount.clientHeight || 450;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf6dfb2);
    scene.fog = new THREE.Fog(0xf6dfb2, 30, 80);

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 200);

    scene.add(new THREE.AmbientLight(0xfff4e0, 0.85));
    const sun = new THREE.DirectionalLight(0xffe2b0, 1.1);
    sun.position.set(-14, 22, 8);
    scene.add(sun);

    // Land and ocean.
    const land = new THREE.Mesh(
      new THREE.PlaneGeometry(140, 110),
      new THREE.MeshLambertMaterial({ color: 0xb9c98a }),
    );
    land.rotation.x = -Math.PI / 2;
    scene.add(land);
    const shore = new THREE.Mesh(
      new THREE.PlaneGeometry(26, 110),
      new THREE.MeshLambertMaterial({ color: 0xecd9a8 }),
    );
    shore.rotation.x = -Math.PI / 2;
    shore.position.set(-30, 0.02, 0);
    scene.add(shore);
    const ocean = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 110),
      new THREE.MeshLambertMaterial({ color: 0x4f8fc4, transparent: true, opacity: 0.92 }),
    );
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.set(-62, 0.05, 0);
    scene.add(ocean);

    // Scattered low-poly hills inland for depth.
    const hillMat = new THREE.MeshLambertMaterial({ color: 0x9bb074 });
    for (let i = 0; i < 8; i++) {
      const hill = new THREE.Mesh(new THREE.ConeGeometry(3.5 + (i % 3), 2.2 + (i % 2), 5), hillMat);
      hill.position.set(20 + (i % 4) * 7, 1, -22 + i * 6);
      scene.add(hill);
    }

    // Route line through every city, in order.
    const ordered = [...CITIES].sort((a, b) => a.order - b.order);
    const routePoints = ordered.map((c) => cityWorldPos(c.id).setY(0.12));
    const routeCurve = new THREE.CatmullRomCurve3(routePoints, false, "catmullrom", 0.15);
    const routeGeo = new THREE.TubeGeometry(routeCurve, 80, 0.14, 6, false);
    const route = new THREE.Mesh(
      routeGeo,
      new THREE.MeshLambertMaterial({ color: 0x8f6730 }),
    );
    scene.add(route);

    // City markers with a pulsing ring on the destination.
    const markers: { group: THREE.Group; cityId: string }[] = [];
    for (const city of ordered) {
      const marker = makeCityMarker(city.accent, unlockedCityIds.includes(city.id));
      marker.position.copy(cityWorldPos(city.id));
      scene.add(marker);
      markers.push({ group: marker, cityId: city.id });
    }
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.8, 0.12, 8, 32),
      new THREE.MeshBasicMaterial({ color: 0xe9c46a }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.copy(cityWorldPos(toCityId)).setY(0.15);
    scene.add(ring);

    const bus = makeBus();
    scene.add(bus);

    // Drive along the curve between the two cities.
    const fromOrder = getCity(fromCityId).order;
    const toOrder = getCity(toCityId).order;
    const tFrom = fromOrder / (ordered.length - 1);
    const tTo = toOrder / (ordered.length - 1);
    const segments = Math.max(1, Math.abs(toOrder - fromOrder));
    const driveMs = 1700 + segments * 900;
    const start = performance.now();
    let raf = 0;

    const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / driveMs);
      const t = tFrom + (tTo - tFrom) * easeInOut(progress);

      const pos = routeCurve.getPointAt(THREE.MathUtils.clamp(t, 0, 1));
      const ahead = routeCurve.getPointAt(
        THREE.MathUtils.clamp(t + (tTo >= tFrom ? 0.01 : -0.01), 0, 1),
      );
      bus.position.set(pos.x, 0.05 + Math.abs(Math.sin(elapsed / 90)) * 0.05, pos.z);
      bus.lookAt(ahead.x, bus.position.y, ahead.z);

      // Camera trails the bus from the south-east, slightly floating.
      const camTarget = new THREE.Vector3(
        pos.x + 7.5,
        7.5 + Math.sin(elapsed / 1400) * 0.4,
        pos.z + 9.5,
      );
      camera.position.lerp(camTarget, progress === 0 ? 1 : 0.08);
      camera.lookAt(pos.x, 1.2, pos.z);

      // Ambient life: shimmering ocean, pulsing destination ring, bobbing caps.
      ocean.position.x = -62 + Math.sin(elapsed / 900) * 0.6;
      const pulse = 1 + Math.sin(elapsed / 280) * 0.12;
      ring.scale.set(pulse, pulse, 1);
      for (const { group } of markers) {
        const cap = group.children[2];
        if (cap) cap.position.y = 3.05 + Math.sin(elapsed / 600 + group.position.x) * 0.08;
      }

      renderer.render(scene, camera);

      if (progress >= 1 && !arrivedRef.current) {
        arrivedRef.current = true;
        window.setTimeout(() => onArrivalRef.current(), 450);
        return;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    const onResize = () => {
      const w = mount.clientWidth || width;
      const h = mount.clientHeight || height;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => m.dispose());
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
    // The cinematic is mounted fresh per trip; props are stable for its lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromCityId, toCityId]);

  const destination = getCity(toCityId);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-sand-200 shadow-cozy-lg">
      <div ref={mountRef} className="aspect-video w-full" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-[#1f1d2b]/80 to-transparent px-5 py-4 text-sand-50">
        <span className="font-display text-lg font-bold drop-shadow">
          {destination.emblem} Traveling to {destination.name}…
        </span>
        <span className="animate-pulse-soft text-sm">🚌💨</span>
      </div>
    </div>
  );
}
