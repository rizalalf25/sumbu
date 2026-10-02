import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export type SceneKind = "projectile" | "pendulum" | "wave" | "vector" | "charges" | "surface" | "field";

type Params = Record<string, number>;

export function mountScene(
  el: HTMLElement,
  kind: SceneKind,
  getParams: () => Params,
  isPlaying: () => boolean = () => false,
): () => void {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(el.clientWidth || 320, el.clientHeight || 280);
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  el.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200);
  camera.position.set(9, 6, 11);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.target.set(0, 1, 0);
  controls.maxDistance = 40;

  scene.add(new THREE.HemisphereLight(0x163044, 0x07090f, 1.35));
  const sun = new THREE.DirectionalLight(0xe7fff8, 1.55);
  sun.position.set(6, 10, 4);
  scene.add(sun);
  const rim = new THREE.PointLight(0xff2d8a, 12, 28);
  rim.position.set(-7, 3, -3);
  scene.add(rim);

  const disposables: { dispose: () => void }[] = [];
  const track = <T extends { dispose: () => void }>(item: T) => {
    disposables.push(item);
    return item;
  };

  const ink = 0xd7f7ff;
  const copper = 0x3df0c2;
  const sand = 0x2a6f68;

  const grid = new THREE.GridHelper(16, 16, sand, 0x1a2838);
  scene.add(grid);

  const ballMat = track(
    new THREE.MeshStandardMaterial({
      color: copper,
      emissive: 0x0c6a54,
      emissiveIntensity: 0.55,
      roughness: 0.32,
      metalness: 0.18,
    }),
  );
  const inkMat = track(
    new THREE.MeshStandardMaterial({
      color: 0x9fd0ff,
      emissive: 0x12304a,
      emissiveIntensity: 0.35,
      roughness: 0.42,
      metalness: 0.22,
    }),
  );
  const paleMat = track(new THREE.MeshStandardMaterial({ color: 0x8aa0b5, roughness: 0.48, metalness: 0.28 }));

  let update = (_time: number, _params: Params) => {};

  if (kind === "projectile") {
    camera.position.set(12, 7, 14);
    const ball = new THREE.Mesh(track(new THREE.SphereGeometry(0.18, 24, 16)), ballMat);
    scene.add(ball);
    const count = 64;
    const lineGeo = track(new THREE.BufferGeometry());
    const positions = new Float32Array(count * 3);
    lineGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const line = new THREE.Line(lineGeo, track(new THREE.LineBasicMaterial({ color: ink })));
    scene.add(line);
    update = (time, params) => {
      const g = 10;
      const v = Math.max(1, params.speed ?? 20);
      const ang = THREE.MathUtils.degToRad(params.angle ?? 45);
      const vy = v * Math.sin(ang);
      const vx = v * Math.cos(ang);
      const tTot = Math.max(0.2, (2 * vy) / g);
      const R = vx * tTot;
      const H = (vy * vy) / (2 * g);
      const scale = 8 / Math.max(R, H * 1.4, 1);
      const attr = lineGeo.getAttribute("position") as THREE.BufferAttribute;
      for (let i = 0; i < count; i++) {
        const t = (i / (count - 1)) * tTot;
        attr.setXYZ(i, vx * t * scale, Math.max(0, (vy * t - 0.5 * g * t * t) * scale), 0);
      }
      attr.needsUpdate = true;
      const tb = time % tTot;
      ball.position.set(vx * tb * scale, Math.max(0, (vy * tb - 0.5 * g * tb * tb) * scale), 0);
      controls.target.set((R * scale) / 2, 1, 0);
    };
  } else if (kind === "pendulum") {
    camera.position.set(0, 2, 8);
    controls.target.set(0, 1.2, 0);
    const pivot = new THREE.Mesh(track(new THREE.SphereGeometry(0.08, 16, 12)), inkMat);
    pivot.position.set(0, 3.2, 0);
    scene.add(pivot);
    const rod = new THREE.Mesh(track(new THREE.CylinderGeometry(0.03, 0.03, 1, 8)), paleMat);
    scene.add(rod);
    const bob = new THREE.Mesh(track(new THREE.SphereGeometry(0.22, 24, 16)), ballMat);
    scene.add(bob);
    update = (time, params) => {
      const L = THREE.MathUtils.clamp(params.length ?? 2, 0.6, 2.8);
      const amp = THREE.MathUtils.degToRad(params.amp ?? 25);
      const w = Math.sqrt(10 / L);
      const theta = amp * Math.cos(w * time);
      const x = L * Math.sin(theta);
      const y = 3.2 - L * Math.cos(theta);
      bob.position.set(x, y, 0);
      rod.scale.set(1, L, 1);
      rod.position.set(x / 2, (3.2 + y) / 2, 0);
      rod.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(x, y - 3.2, 0).normalize());
    };
  } else if (kind === "wave") {
    camera.position.set(0, 4, 10);
    controls.target.set(0, 0, 0);
    const geo = track(new THREE.BufferGeometry());
    const positions = new Float32Array(80 * 3);
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const line = new THREE.Line(geo, track(new THREE.LineBasicMaterial({ color: copper })));
    scene.add(line);
    update = (time, params) => {
      const A = params.amp ?? 0.7;
      const lambda = Math.max(0.4, params.lambda ?? 2.4);
      const speed = params.speed ?? 1.5;
      const k = (Math.PI * 2) / lambda;
      const attr = geo.getAttribute("position") as THREE.BufferAttribute;
      for (let i = 0; i < 80; i++) {
        const x = -6 + (12 * i) / 79;
        attr.setXYZ(i, x, A * Math.sin(k * x - speed * k * time), 0);
      }
      attr.needsUpdate = true;
    };
  } else if (kind === "vector") {
    camera.position.set(6, 6, 8);
    const a = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 1, copper, 0.25, 0.16);
    const b = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(), 1, 0xff2d8a, 0.25, 0.16);
    const r = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 1, 0xd7f7ff, 0.22, 0.14);
    scene.add(a, b, r);
    update = (_time, params) => {
      const av = new THREE.Vector3(params.ax ?? 3, params.ay ?? 1, 0);
      const bv = new THREE.Vector3(params.bx ?? -1, params.by ?? 2, 0);
      const rv = av.clone().add(bv);
      const set = (arrow: THREE.ArrowHelper, vec: THREE.Vector3) => {
        const len = vec.length();
        if (len < 1e-4) {
          arrow.visible = false;
          return;
        }
        arrow.visible = true;
        arrow.position.set(0, 0, 0);
        arrow.setDirection(vec.clone().normalize());
        arrow.setLength(len, Math.min(0.35, len * 0.25), Math.min(0.18, len * 0.12));
      };
      set(a, av);
      set(b, bv);
      set(r, rv);
    };
  } else if (kind === "charges") {
    camera.position.set(0, 7, 9);
    controls.target.set(0, 0, 0);
    const s1 = new THREE.Mesh(track(new THREE.SphereGeometry(0.22, 20, 16)), ballMat);
    const s2 = new THREE.Mesh(
      track(new THREE.SphereGeometry(0.22, 20, 16)),
      track(
        new THREE.MeshStandardMaterial({
          color: 0xff2d8a,
          emissive: 0x6a1038,
          emissiveIntensity: 0.55,
          roughness: 0.35,
          metalness: 0.15,
        }),
      ),
    );
    scene.add(s1, s2);
    const n = 7;
    const arrows: THREE.ArrowHelper[] = [];
    for (let i = 0; i < n * n; i++) {
      const arrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 0.3, ink, 0.12, 0.08);
      arrows.push(arrow);
      scene.add(arrow);
    }
    update = (_time, params) => {
      const sep = Math.max(0.8, params.sep ?? 2.4);
      const q1 = params.q1 ?? 2;
      const q2 = params.q2 ?? -2;
      s1.position.set(-sep / 2, 0.2, 0);
      s2.position.set(sep / 2, 0.2, 0);
      const span = 5;
      let idx = 0;
      for (let iz = 0; iz < n; iz++) {
        for (let ix = 0; ix < n; ix++) {
          const x = -span / 2 + (span * ix) / (n - 1);
          const z = -span / 2 + (span * iz) / (n - 1);
          const field = new THREE.Vector3();
          const contrib = (q: number, origin: THREE.Vector3) => {
            const rel = new THREE.Vector3(x, 0, z).sub(origin);
            const r2 = rel.lengthSq();
            if (r2 < 0.2) return;
            field.add(rel.multiplyScalar(q / (r2 * Math.sqrt(r2))));
          };
          contrib(q1, s1.position);
          contrib(q2, s2.position);
          const arrow = arrows[idx++]!;
          const mag = field.length();
          if (mag < 1e-4) {
            arrow.visible = false;
            continue;
          }
          arrow.visible = true;
          arrow.position.set(x, 0.05, z);
          arrow.setDirection(field.normalize());
          const len = THREE.MathUtils.clamp(0.15 + Math.log10(1 + mag) * 0.28, 0.15, 0.7);
          arrow.setLength(len, 0.12, 0.07);
        }
      }
    };
  } else if (kind === "surface") {
    camera.position.set(8, 7, 8);
    controls.target.set(0, 0.5, 0);
    const geo = track(new THREE.PlaneGeometry(8, 8, 36, 36));
    geo.rotateX(-Math.PI / 2);
    const mesh = new THREE.Mesh(
      geo,
      track(new THREE.MeshStandardMaterial({ color: 0x102033, roughness: 0.55, metalness: 0.35, side: THREE.DoubleSide })),
    );
    const wire = new THREE.Mesh(
      geo,
      track(new THREE.MeshBasicMaterial({ color: copper, wireframe: true, transparent: true, opacity: 0.45 })),
    );
    scene.add(mesh, wire);
    update = (_time, params) => {
      const a = params.a ?? 0.15;
      const b = params.b ?? -0.12;
      const pos = geo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const z = pos.getZ(i);
        pos.setY(i, a * x * x + b * z * z);
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();
    };
  } else {
    camera.position.set(7, 8, 8);
    controls.target.set(0, 0, 0);
    const arrows: THREE.ArrowHelper[] = [];
    const n = 6;
    for (let i = 0; i < n * n; i++) {
      const arrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 0.4, ink, 0.14, 0.08);
      arrows.push(arrow);
      scene.add(arrow);
    }
    update = (_time, params) => {
      const vortex = (params.mode ?? 0) >= 0.5;
      const gain = params.gain ?? 1;
      const span = 6;
      let idx = 0;
      for (let iz = 0; iz < n; iz++) {
        for (let ix = 0; ix < n; ix++) {
          const x = -span / 2 + (span * ix) / (n - 1);
          const z = -span / 2 + (span * iz) / (n - 1);
          const dir = vortex ? new THREE.Vector3(-z, 0, x) : new THREE.Vector3(x, 0, z);
          const arrow = arrows[idx++]!;
          const mag = dir.length();
          if (mag < 0.15) {
            arrow.visible = false;
            continue;
          }
          arrow.visible = true;
          arrow.position.set(x, 0.05, z);
          arrow.setDirection(dir.normalize());
          arrow.setLength(THREE.MathUtils.clamp(0.25 * gain + mag * 0.08, 0.2, 0.85), 0.14, 0.08);
        }
      }
    };
  }

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clock = new THREE.Clock();
  let time = 0;
  let frame = 0;
  const loop = () => {
    const dt = Math.min(clock.getDelta(), 0.05);
    // Gerak hanya berjalan setelah pengguna menekan "Putar gerak"; bawaannya diam.
    if (!reduced && isPlaying()) time += dt;
    update(time, getParams());
    controls.update();
    renderer.render(scene, camera);
    frame = requestAnimationFrame(loop);
  };
  loop();

  const resize = () => {
    const w = el.clientWidth || 320;
    const h = el.clientHeight || 280;
    camera.aspect = w / Math.max(1, h);
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(el);

  return () => {
    cancelAnimationFrame(frame);
    ro.disconnect();
    controls.dispose();
    disposables.forEach((item) => item.dispose());
    renderer.dispose();
    renderer.domElement.remove();
  };
}
