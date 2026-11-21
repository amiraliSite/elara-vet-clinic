import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import type { CameraPreset, HotspotId, LightingMood } from '../i18n/translations';

export interface VetSceneCallbacks {
  onSelectHotspot?: (id: HotspotId | null) => void;
  onWebGLUnavailable?: () => void;
}

// Pre-allocated math helpers outside render loop (zero GC)
const _v1 = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _c1 = new THREE.Color();
const _c2 = new THREE.Color();
const _dummy = new THREE.Object3D();

const DAY_BG = new THREE.Color('#1B1410');
const EVENING_BG = new THREE.Color('#110C09');
const DAY_KEY_COLOR = new THREE.Color('#FFEEDB');
const EVENING_KEY_COLOR = new THREE.Color('#E3AB78');

interface CameraTarget {
  pos: THREE.Vector3;
  look: THREE.Vector3;
}

const CAMERA_PRESETS: Record<CameraPreset, CameraTarget> = {
  overview: {
    pos: new THREE.Vector3(5.6, 3.35, 6.1),
    look: new THREE.Vector3(0, 0.95, 0),
  },
  companions: {
    pos: new THREE.Vector3(2.35, 1.55, 2.75),
    look: new THREE.Vector3(0.55, 0.72, 0.55),
  },
  diagnostics: {
    pos: new THREE.Vector3(-2.5, 2.05, 2.55),
    look: new THREE.Vector3(-0.78, 1.48, -0.35),
  },
  lamp: {
    pos: new THREE.Vector3(2.9, 3.1, -2.6),
    look: new THREE.Vector3(0, 2.15, 0),
  },
};

function createTravertineTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#DCD6C8';
  ctx.fillRect(0, 0, 512, 512);

  // Subtle horizontal sedimentary veining
  for (let i = 0; i < 160; i++) {
    const y = Math.random() * 512;
    const h = 1 + Math.random() * 6;
    const alpha = 0.03 + Math.random() * 0.06;
    ctx.fillStyle = i % 2 === 0 ? `rgba(145, 134, 114, ${alpha})` : `rgba(255, 250, 240, ${alpha})`;
    ctx.fillRect(0, y, 512, h);
  }

  // Fine mineral pores
  for (let i = 0; i < 650; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const w = 2 + Math.random() * 10;
    ctx.fillStyle = 'rgba(120, 110, 92, 0.08)';
    ctx.fillRect(x, y, w, 1.5);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  return tex;
}

function createWoodTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#9E8B70';
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 220; i++) {
    const y = Math.random() * 512;
    ctx.strokeStyle = i % 3 === 0 ? 'rgba(92, 74, 52, 0.14)' : 'rgba(218, 200, 172, 0.10)';
    ctx.lineWidth = 1 + Math.random() * 2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(170, y + (Math.random() - 0.5) * 6, 340, y + (Math.random() - 0.5) * 6, 512, y);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(128, 128, 12, 128, 128, 124);
  grad.addColorStop(0, 'rgba(8, 12, 10, 0.58)');
  grad.addColorStop(0.55, 'rgba(8, 12, 10, 0.22)');
  grad.addColorStop(1, 'rgba(8, 12, 10, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export class VetSanctuaryScene {
  private container: HTMLElement;
  private callbacks: VetSceneCallbacks;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private clock = new THREE.Clock();
  private frameId = 0;
  private isSoftwareGl = false;
  private disposed = false;

  // Dynamic targets
  private activePreset: CameraPreset | null = 'overview';
  private targetExplode = 0;
  private currentExplode = 0;
  private targetMood: LightingMood = 'daylight';
  private moodBlend = 0; // 0 = daylight, 1 = evening
  private selectedHotspot: HotspotId | null = null;

  // Scene elements for calm animation & explode choreography
  private keyLight!: THREE.DirectionalLight;
  private hemiLight!: THREE.HemisphereLight;
  private lampSpotlight!: THREE.PointLight;
  private dogTail!: THREE.Mesh;
  private catTail!: THREE.Mesh;
  private dogHeadGroup!: THREE.Group;
  private catBodyGroup!: THREE.Group;
  private monitorCanvas!: HTMLCanvasElement;
  private monitorCtx!: CanvasRenderingContext2D;
  private monitorTex!: THREE.CanvasTexture;
  private ecgPhase = 0;

  // Explodable sub-assemblies
  private lampAssembly!: THREE.Group;
  private monitorAssembly!: THREE.Group;
  private canopyRingGroup!: THREE.Group;
  private trayAssembly!: THREE.Group;
  private tableTopAssembly!: THREE.Group;

  // Floating sunlit motes
  private motesMesh!: THREE.InstancedMesh;
  private moteOffsets: { x: number; y: number; z: number; speed: number; phase: number }[] = [];

  // Raycasting
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();
  private hitProxies: THREE.Mesh[] = [];
  private hotspotRings: Partial<Record<HotspotId, THREE.Mesh>> = {};
  private pointerDownPos = new THREE.Vector2();

  // Resources to dispose cleanly
  private geometries: THREE.BufferGeometry[] = [];
  private materials: THREE.Material[] = [];
  private textures: THREE.Texture[] = [];
  private envRT: THREE.WebGLRenderTarget | null = null;

  constructor(container: HTMLElement, callbacks: VetSceneCallbacks = {}) {
    this.container = container;
    this.callbacks = callbacks;
    this.init();
  }

  private detectSoftwareGl(): boolean {
    try {
      const probe = document.createElement('canvas');
      const gl = probe.getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    } catch {
      return true;
    }
  }

  private trackGeo<T extends THREE.BufferGeometry>(geo: T): T {
    this.geometries.push(geo);
    return geo;
  }

  private trackMat<T extends THREE.Material>(mat: T): T {
    this.materials.push(mat);
    return mat;
  }

  private trackTex<T extends THREE.Texture>(tex: T): T {
    this.textures.push(tex);
    return tex;
  }

  private init(): void {
    const width = Math.max(this.container.clientWidth, 300);
    const height = Math.max(this.container.clientHeight, 300);

    this.isSoftwareGl = this.detectSoftwareGl();

    try {
      this.renderer = new THREE.WebGLRenderer({
        antialias: !this.isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      this.callbacks.onWebGLUnavailable?.();
      return;
    }

    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.12;
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(width, height);
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.domElement.style.display = 'block';
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = DAY_BG.clone();
    this.scene.fog = new THREE.FogExp2('#1B1410', 0.042);

    // Mandatory studio environment map via RoomEnvironment
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    this.scene.environment = this.envRT.texture;
    pmrem.dispose();

    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 60);
    this.camera.position.copy(CAMERA_PRESETS.overview.pos);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = !this.isSoftwareGl;
    this.controls.dampingFactor = 0.055;
    this.controls.minDistance = 2.1;
    this.controls.maxDistance = 10.5;
    this.controls.minPolarAngle = 0.25;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.05;
    this.controls.enablePan = false;
    this.controls.target.copy(CAMERA_PRESETS.overview.look);
    this.controls.addEventListener('start', () => {
      // Cancel scripted transition immediately when user interacts
      this.activePreset = null;
    });

    this.setupLighting();
    this.buildSanctuaryArchitecture();
    this.buildExamTableAndInstruments();
    this.buildTelemetryMonitor();
    this.buildSurgicalLamp();
    this.buildSculptedCompanions();
    this.buildBotanicalAndMotes();
    this.buildInteractionProxies();

    if (!this.isSoftwareGl) {
      this.renderer.compile(this.scene, this.camera);
    }

    this.bindEvents();
    this.tick();
  }

  private setupLighting(): void {
    // Warm cream / umber stone Hemisphere fill
    this.hemiLight = new THREE.HemisphereLight('#F2E2D0', '#4A3628', 0.88);
    this.scene.add(this.hemiLight);

    // Warm key light with tight shadow frustum
    this.keyLight = new THREE.DirectionalLight('#FFEEDB', 2.2);
    this.keyLight.position.set(5.5, 7.5, 4.5);
    this.keyLight.castShadow = !this.isSoftwareGl;
    this.keyLight.shadow.mapSize.set(1024, 1024);
    this.keyLight.shadow.camera.near = 1;
    this.keyLight.shadow.camera.far = 20;
    const d = 4.2;
    this.keyLight.shadow.camera.left = -d;
    this.keyLight.shadow.camera.right = d;
    this.keyLight.shadow.camera.top = d;
    this.keyLight.shadow.camera.bottom = -d;
    this.keyLight.shadow.bias = -0.0005;
    this.keyLight.shadow.normalBias = 0.02;
    this.scene.add(this.keyLight);

    // Warm bronze-sage rim light from behind to sculpt silhouettes
    const rimLight = new THREE.DirectionalLight('#D19A6B', 0.98);
    rimLight.position.set(-4.5, 4.0, -5.0);
    this.scene.add(rimLight);

    // Focused surgical lamp warm glow
    this.lampSpotlight = new THREE.PointLight('#FFE7CA', 1.45, 7, 2);
    this.lampSpotlight.position.set(0, 2.25, 0);
    this.scene.add(this.lampSpotlight);
  }

  private buildSanctuaryArchitecture(): void {
    const travertineTex = this.trackTex(createTravertineTexture());
    travertineTex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();

    const woodTex = this.trackTex(createWoodTexture());
    woodTex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();

    const shadowTex = this.trackTex(createContactShadowTexture());

    const travertineMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        map: travertineTex,
        roughness: 0.72,
        metalness: 0.04,
      }),
    );

    const woodMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        map: woodTex,
        roughness: 0.58,
        metalness: 0.05,
      }),
    );

    const brassMat = this.trackMat(
      new THREE.MeshPhysicalMaterial({
        color: '#C98E5B',
        metalness: 0.93,
        roughness: 0.21,
        anisotropy: 0.75,
      }),
    );

    const sagePlasterMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: '#34271F',
        roughness: 0.85,
        metalness: 0.06,
      }),
    );

    // Outer ground horizon plane blending into fog
    const horizonFloor = new THREE.Mesh(
      this.trackGeo(new THREE.CircleGeometry(28, 64)),
      this.trackMat(
        new THREE.MeshStandardMaterial({
          color: '#1C1511',
          roughness: 0.92,
          metalness: 0.03,
        }),
      ),
    );
    horizonFloor.rotation.x = -Math.PI / 2;
    horizonFloor.position.y = -0.02;
    horizonFloor.receiveShadow = true;
    this.scene.add(horizonFloor);

    // Stepped travertine sanctuary plinth (LatheGeometry profile)
    const plinthPts = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(3.4, 0),
      new THREE.Vector2(3.4, 0.08),
      new THREE.Vector2(3.15, 0.09),
      new THREE.Vector2(3.15, 0.16),
      new THREE.Vector2(2.85, 0.17),
      new THREE.Vector2(2.85, 0.22),
      new THREE.Vector2(0, 0.22),
    ];
    const plinthGeo = this.trackGeo(new THREE.LatheGeometry(plinthPts, 64));
    const plinth = new THREE.Mesh(plinthGeo, travertineMat);
    plinth.receiveShadow = true;
    plinth.castShadow = true;
    this.scene.add(plinth);

    // Brushed oak inlay disk (offset >= 0.02 above plinth top 0.22)
    const inlayDisk = new THREE.Mesh(
      this.trackGeo(new THREE.CylinderGeometry(2.55, 2.55, 0.025, 64)),
      woodMat,
    );
    inlayDisk.position.y = 0.232;
    inlayDisk.receiveShadow = true;
    this.scene.add(inlayDisk);

    // Brass sanctuary inlay ring
    const brassRing = new THREE.Mesh(
      this.trackGeo(new THREE.TorusGeometry(2.55, 0.018, 16, 96)),
      brassMat,
    );
    brassRing.rotation.x = Math.PI / 2;
    brassRing.position.y = 0.246;
    this.scene.add(brassRing);

    // Contact shadow plane under central equipment
    const contactShadow = new THREE.Mesh(
      this.trackGeo(new THREE.PlaneGeometry(3.8, 3.8)),
      this.trackMat(
        new THREE.MeshBasicMaterial({
          map: shadowTex,
          transparent: true,
          depthWrite: false,
          opacity: 0.72,
        }),
      ),
    );
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.25;
    this.scene.add(contactShadow);

    // Curved acoustic back sanctuary arc + glass atrium ribs
    const arcShape = new THREE.Shape();
    arcShape.absarc(0, 0, 3.05, Math.PI * 0.72, Math.PI * 1.48, false);
    arcShape.absarc(0, 0, 2.92, Math.PI * 1.48, Math.PI * 0.72, true);
    const arcGeo = this.trackGeo(
      new THREE.ExtrudeGeometry(arcShape, { depth: 2.35, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, curveSegments: 32 }),
    );
    arcGeo.rotateX(-Math.PI / 2);
    const arcWall = new THREE.Mesh(arcGeo, sagePlasterMat);
    arcWall.position.y = 0.16;
    arcWall.receiveShadow = true;
    arcWall.castShadow = true;
    this.scene.add(arcWall);

    // Overhead Explodable Canopy & Atrium Ribs
    this.canopyRingGroup = new THREE.Group();
    const overheadHalo = new THREE.Mesh(
      this.trackGeo(new THREE.TorusGeometry(2.35, 0.045, 20, 96)),
      brassMat,
    );
    overheadHalo.rotation.x = Math.PI / 2;
    overheadHalo.position.y = 3.15;
    this.canopyRingGroup.add(overheadHalo);

    const glassCanopy = new THREE.Mesh(
      this.trackGeo(new THREE.CylinderGeometry(2.34, 2.34, 0.03, 64, 1, true)),
      this.trackMat(
        new THREE.MeshPhysicalMaterial({
          color: '#E6F0EC',
          roughness: 0.15,
          metalness: 0.05,
          transmission: this.isSoftwareGl ? 0 : 0.78,
          transparent: true,
          opacity: this.isSoftwareGl ? 0.28 : 0.9,
          depthWrite: false,
          side: THREE.DoubleSide,
        }),
      ),
    );
    glassCanopy.position.y = 3.16;
    glassCanopy.renderOrder = 3;
    this.canopyRingGroup.add(glassCanopy);

    // 5 architectural timber atrium ribs rising to canopy
    for (let i = 0; i < 5; i++) {
      const angle = Math.PI * 0.76 + i * 0.36;
      const ribCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(Math.cos(angle) * 2.95, 0.2, Math.sin(angle) * 2.95),
        new THREE.Vector3(Math.cos(angle) * 2.82, 1.85, Math.sin(angle) * 2.82),
        new THREE.Vector3(Math.cos(angle) * 2.35, 3.15, Math.sin(angle) * 2.35),
      ]);
      const ribMesh = new THREE.Mesh(
        this.trackGeo(new THREE.TubeGeometry(ribCurve, 24, 0.04, 12, false)),
        woodMat,
      );
      ribMesh.castShadow = true;
      this.canopyRingGroup.add(ribMesh);
    }

    this.scene.add(this.canopyRingGroup);
  }

  private buildExamTableAndInstruments(): void {
    const titaniumMat = this.trackMat(
      new THREE.MeshPhysicalMaterial({
        color: '#B8C0BC',
        metalness: 0.88,
        roughness: 0.24,
        anisotropy: 0.65,
      }),
    );

    const brassMat = this.trackMat(
      new THREE.MeshPhysicalMaterial({
        color: '#C5A059',
        metalness: 0.92,
        roughness: 0.2,
      }),
    );

    const ceramicDeckMat = this.trackMat(
      new THREE.MeshPhysicalMaterial({
        color: '#EAE5DA',
        roughness: 0.35,
        metalness: 0.04,
        clearcoat: 0.45,
        clearcoatRoughness: 0.25,
      }),
    );

    const sageMatMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: '#3B6556',
        roughness: 0.78,
        metalness: 0.02,
      }),
    );

    // Hydraulic Pedestal Base (LatheGeometry)
    const basePts = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.55, 0),
      new THREE.Vector2(0.52, 0.05),
      new THREE.Vector2(0.22, 0.12),
      new THREE.Vector2(0.18, 0.65),
      new THREE.Vector2(0.24, 0.68),
      new THREE.Vector2(0, 0.68),
    ];
    const pedestal = new THREE.Mesh(this.trackGeo(new THREE.LatheGeometry(basePts, 48)), titaniumMat);
    pedestal.position.set(-0.2, 0.245, -0.1);
    pedestal.castShadow = true;
    pedestal.receiveShadow = true;
    this.scene.add(pedestal);

    // Brass hydraulic collar
    const collar = new THREE.Mesh(
      this.trackGeo(new THREE.CylinderGeometry(0.195, 0.195, 0.06, 36)),
      brassMat,
    );
    collar.position.set(-0.2, 0.78, -0.1);
    this.scene.add(collar);

    // Heated Travertine-Ceramic Exam Deck (ExtrudeGeometry with smooth bevel)
    this.tableTopAssembly = new THREE.Group();
    this.tableTopAssembly.position.set(-0.2, 0.93, -0.1);

    const deckShape = new THREE.Shape();
    const w = 1.45;
    const d = 0.86;
    const r = 0.14;
    deckShape.moveTo(-w / 2 + r, -d / 2);
    deckShape.lineTo(w / 2 - r, -d / 2);
    deckShape.quadraticCurveTo(w / 2, -d / 2, w / 2, -d / 2 + r);
    deckShape.lineTo(w / 2, d / 2 - r);
    deckShape.quadraticCurveTo(w / 2, d / 2, w / 2 - r, d / 2);
    deckShape.lineTo(-w / 2 + r, d / 2);
    deckShape.quadraticCurveTo(-w / 2, d / 2, -w / 2, d / 2 - r);
    deckShape.lineTo(-w / 2, -d / 2 + r);
    deckShape.quadraticCurveTo(-w / 2, -d / 2, -w / 2 + r, -d / 2);

    const deckGeo = this.trackGeo(
      new THREE.ExtrudeGeometry(deckShape, {
        depth: 0.055,
        bevelEnabled: true,
        bevelThickness: 0.015,
        bevelSize: 0.015,
        bevelSegments: 4,
      }),
    );
    deckGeo.rotateX(Math.PI / 2);
    const deckMesh = new THREE.Mesh(deckGeo, ceramicDeckMat);
    deckMesh.castShadow = true;
    deckMesh.receiveShadow = true;
    this.tableTopAssembly.add(deckMesh);

    // Soft heated sage comfort pad sitting cleanly on the deck
    const padGeo = this.trackGeo(new THREE.BoxGeometry(1.12, 0.028, 0.64));
    const padMesh = new THREE.Mesh(padGeo, sageMatMat);
    padMesh.position.set(0.05, 0.03, 0);
    padMesh.receiveShadow = true;
    this.tableTopAssembly.add(padMesh);

    // Brushed brass perimeter rail
    const rail = new THREE.Mesh(
      this.trackGeo(new THREE.CylinderGeometry(0.012, 0.012, 1.15, 16)),
      brassMat,
    );
    rail.rotation.z = Math.PI / 2;
    rail.position.set(0, -0.02, 0.47);
    this.tableTopAssembly.add(rail);

    this.scene.add(this.tableTopAssembly);

    // Ergonomic Side Instrument Tray + Stethoscope + Ultrasound Probe
    this.trayAssembly = new THREE.Group();
    this.trayAssembly.position.set(-1.35, 0.245, 0.35);

    const trayStand = new THREE.Mesh(
      this.trackGeo(new THREE.CylinderGeometry(0.025, 0.035, 0.72, 20)),
      titaniumMat,
    );
    trayStand.position.y = 0.36;
    trayStand.castShadow = true;
    this.trayAssembly.add(trayStand);

    const trayFoot = new THREE.Mesh(
      this.trackGeo(new THREE.CylinderGeometry(0.24, 0.26, 0.03, 32)),
      titaniumMat,
    );
    trayFoot.position.y = 0.015;
    trayFoot.receiveShadow = true;
    this.trayAssembly.add(trayFoot);

    const traySurface = new THREE.Mesh(
      this.trackGeo(new THREE.CylinderGeometry(0.32, 0.3, 0.025, 36)),
      ceramicDeckMat,
    );
    traySurface.position.y = 0.73;
    traySurface.castShadow = true;
    traySurface.receiveShadow = true;
    this.trayAssembly.add(traySurface);

    // Sculpted Stethoscope resting on tray
    const stethCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.12, 0.755, -0.06),
      new THREE.Vector3(0.0, 0.76, -0.14),
      new THREE.Vector3(0.14, 0.758, -0.02),
      new THREE.Vector3(0.06, 0.756, 0.12),
      new THREE.Vector3(-0.08, 0.756, 0.08),
    ]);
    const stethTube = new THREE.Mesh(
      this.trackGeo(new THREE.TubeGeometry(stethCurve, 32, 0.011, 10, false)),
      this.trackMat(new THREE.MeshStandardMaterial({ color: '#1F3A32', roughness: 0.55 })),
    );
    this.trayAssembly.add(stethTube);

    const chestpiece = new THREE.Mesh(
      this.trackGeo(new THREE.CylinderGeometry(0.042, 0.042, 0.022, 24)),
      brassMat,
    );
    chestpiece.position.set(-0.1, 0.758, 0.08);
    this.trayAssembly.add(chestpiece);

    // Ultrasound Transducer Probe
    const probeHandle = new THREE.Mesh(
      this.trackGeo(new THREE.CapsuleGeometry(0.024, 0.11, 8, 16)),
      titaniumMat,
    );
    probeHandle.rotation.z = Math.PI / 2;
    probeHandle.rotation.y = 0.5;
    probeHandle.position.set(0.08, 0.765, -0.02);
    this.trayAssembly.add(probeHandle);

    this.scene.add(this.trayAssembly);
  }

  private buildTelemetryMonitor(): void {
    this.monitorAssembly = new THREE.Group();
    this.monitorAssembly.position.set(-0.98, 0.245, -0.62);

    const titaniumMat = this.trackMat(
      new THREE.MeshPhysicalMaterial({
        color: '#9EA8A4',
        metalness: 0.85,
        roughness: 0.28,
      }),
    );

    const darkBezelMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: '#18211E',
        roughness: 0.35,
        metalness: 0.4,
      }),
    );

    // Rolling floor stand
    const base = new THREE.Mesh(
      this.trackGeo(new THREE.CylinderGeometry(0.28, 0.31, 0.04, 32)),
      titaniumMat,
    );
    base.position.y = 0.02;
    base.receiveShadow = true;
    this.monitorAssembly.add(base);

    const mast = new THREE.Mesh(
      this.trackGeo(new THREE.CylinderGeometry(0.028, 0.032, 1.38, 20)),
      titaniumMat,
    );
    mast.position.y = 0.71;
    mast.castShadow = true;
    this.monitorAssembly.add(mast);

    // Monitor housing tilted gently toward camera
    const screenGroup = new THREE.Group();
    screenGroup.position.set(0.06, 1.38, 0.05);
    screenGroup.rotation.y = 0.58;
    screenGroup.rotation.x = -0.12;

    const housing = new THREE.Mesh(
      this.trackGeo(new THREE.BoxGeometry(0.64, 0.42, 0.045)),
      darkBezelMat,
    );
    housing.castShadow = true;
    screenGroup.add(housing);

    // Procedural live telemetry canvas display
    this.monitorCanvas = document.createElement('canvas');
    this.monitorCanvas.width = 512;
    this.monitorCanvas.height = 320;
    this.monitorCtx = this.monitorCanvas.getContext('2d')!;
    this.monitorTex = this.trackTex(new THREE.CanvasTexture(this.monitorCanvas));
    this.monitorTex.colorSpace = THREE.SRGBColorSpace;
    this.monitorTex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();

    const screenPlane = new THREE.Mesh(
      this.trackGeo(new THREE.PlaneGeometry(0.58, 0.36)),
      this.trackMat(
        new THREE.MeshBasicMaterial({
          map: this.monitorTex,
        }),
      ),
    );
    screenPlane.position.z = 0.024;
    screenGroup.add(screenPlane);

    this.monitorAssembly.add(screenGroup);
    this.scene.add(this.monitorAssembly);
    this.drawMonitorScreen(0);
  }

  private drawMonitorScreen(phase: number): void {
    const ctx = this.monitorCtx;
    const w = 512;
    const h = 320;

    ctx.fillStyle = '#0B1512';
    ctx.fillRect(0, 0, w, h);

    // Subtle clinical grid
    ctx.strokeStyle = 'rgba(72, 148, 120, 0.14)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Header labels
    ctx.fillStyle = '#8FB9A8';
    ctx.font = '600 18px sans-serif';
    ctx.fillText('ELARA TELEMETRY · SINUS CALM', 24, 34);

    // Vital numbers
    ctx.fillStyle = '#6BE3B3';
    ctx.font = '700 44px monospace';
    ctx.fillText('84', 360, 108);
    ctx.font = '500 16px sans-serif';
    ctx.fillStyle = '#8FB9A8';
    ctx.fillText('BPM · HR', 360, 132);

    ctx.fillStyle = '#E8C38E';
    ctx.font = '700 38px monospace';
    ctx.fillText('99%', 360, 206);
    ctx.font = '500 16px sans-serif';
    ctx.fillStyle = '#8FB9A8';
    ctx.fillText('SpO2 · 38.2°C', 360, 232);

    // Animated calm ECG waveform
    ctx.strokeStyle = '#6BE3B3';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = 20; x < 330; x += 2) {
      const t = ((x * 0.045 + phase) % (Math.PI * 2)) / (Math.PI * 2);
      let yOffset = 0;
      if (t > 0.15 && t < 0.25) yOffset = -Math.sin(((t - 0.15) / 0.1) * Math.PI) * 10;
      else if (t >= 0.32 && t < 0.36) yOffset = 10;
      else if (t >= 0.36 && t < 0.41) yOffset = -56;
      else if (t >= 0.41 && t < 0.46) yOffset = 18;
      else if (t >= 0.56 && t < 0.72) yOffset = -Math.sin(((t - 0.56) / 0.16) * Math.PI) * 16;

      const y = 165 + yOffset;
      if (x === 20) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Pleth wave
    ctx.strokeStyle = '#E8C38E';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (let x = 20; x < 330; x += 3) {
      const y = 258 + Math.sin(x * 0.06 + phase * 1.1) * 12 + Math.sin(x * 0.12 + phase * 2.2) * 5;
      if (x === 20) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    this.monitorTex.needsUpdate = true;
  }

  private buildSurgicalLamp(): void {
    this.lampAssembly = new THREE.Group();

    const brassMat = this.trackMat(
      new THREE.MeshPhysicalMaterial({
        color: '#C5A059',
        metalness: 0.9,
        roughness: 0.22,
      }),
    );

    const titaniumMat = this.trackMat(
      new THREE.MeshPhysicalMaterial({
        color: '#CFD5D2',
        metalness: 0.85,
        roughness: 0.25,
      }),
    );

    const emitterMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: '#FFF7E8',
        emissive: '#FFE8BF',
        emissiveIntensity: 1.5,
        roughness: 0.2,
      }),
    );

    // Articulated overhead arm curving from canopy hub to over exam table
    const armCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.35, 3.12, -0.55),
      new THREE.Vector3(-0.35, 2.75, -0.45),
      new THREE.Vector3(-0.15, 2.55, -0.2),
      new THREE.Vector3(-0.18, 2.38, -0.05),
    ]);
    const armTube = new THREE.Mesh(
      this.trackGeo(new THREE.TubeGeometry(armCurve, 28, 0.026, 14, false)),
      titaniumMat,
    );
    armTube.castShadow = true;
    this.lampAssembly.add(armTube);

    // Lamp dome head
    const lampHead = new THREE.Group();
    lampHead.position.set(-0.18, 2.34, -0.05);
    lampHead.rotation.x = 0.08;

    const domeOuter = new THREE.Mesh(
      this.trackGeo(new THREE.CylinderGeometry(0.28, 0.36, 0.08, 40)),
      titaniumMat,
    );
    domeOuter.castShadow = true;
    lampHead.add(domeOuter);

    const brassTrim = new THREE.Mesh(
      this.trackGeo(new THREE.TorusGeometry(0.355, 0.014, 14, 48)),
      brassMat,
    );
    brassTrim.rotation.x = Math.PI / 2;
    brassTrim.position.y = -0.038;
    lampHead.add(brassTrim);

    const opticalRing = new THREE.Mesh(
      this.trackGeo(new THREE.RingGeometry(0.08, 0.31, 36)),
      emitterMat,
    );
    opticalRing.rotation.x = Math.PI / 2;
    opticalRing.position.y = -0.042;
    lampHead.add(opticalRing);

    const sterileHandle = new THREE.Mesh(
      this.trackGeo(new THREE.CylinderGeometry(0.018, 0.024, 0.14, 16)),
      brassMat,
    );
    sterileHandle.position.y = -0.1;
    lampHead.add(sterileHandle);

    this.lampAssembly.add(lampHead);
    this.scene.add(this.lampAssembly);
  }

  private buildSculptedCompanions(): void {
    const cushionMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: '#E5DFD2',
        roughness: 0.92,
        metalness: 0.01,
      }),
    );

    const goldenFurMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: '#C78E4B',
        roughness: 0.82,
        metalness: 0.02,
      }),
    );

    const creamFurMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: '#DFC092',
        roughness: 0.85,
        metalness: 0.02,
      }),
    );

    const catSilverMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: '#CFCAC4',
        roughness: 0.86,
        metalness: 0.02,
      }),
    );

    const catSlateMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: '#7D7B78',
        roughness: 0.85,
      }),
    );

    const darkFeatureMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: '#1E1B18',
        roughness: 0.28,
        metalness: 0.1,
      }),
    );

    const sageCollarMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: '#2D5A4C',
        roughness: 0.65,
      }),
    );

    const goldTagMat = this.trackMat(
      new THREE.MeshPhysicalMaterial({
        color: '#D4AF63',
        metalness: 0.94,
        roughness: 0.18,
      }),
    );

    // Woven acoustic linen cushion grounded flush on oak inlay deck (y = 0.245)
    const cushionGroup = new THREE.Group();
    cushionGroup.position.set(0.82, 0.245, 0.68);
    cushionGroup.rotation.y = -0.45;

    const cushionBase = new THREE.Mesh(
      this.trackGeo(new THREE.CylinderGeometry(0.68, 0.72, 0.11, 40)),
      cushionMat,
    );
    cushionBase.scale.set(1.15, 1, 0.88);
    cushionBase.position.y = 0.055;
    cushionBase.castShadow = true;
    cushionBase.receiveShadow = true;
    cushionGroup.add(cushionBase);

    const cushionPiping = new THREE.Mesh(
      this.trackGeo(new THREE.TorusGeometry(0.68, 0.018, 12, 48)),
      sageCollarMat,
    );
    cushionPiping.rotation.x = Math.PI / 2;
    cushionPiping.scale.set(1.15, 0.88, 1);
    cushionPiping.position.y = 0.105;
    cushionGroup.add(cushionPiping);

    this.scene.add(cushionGroup);

    // 1) Sculpted Golden Retriever sitting serenely beside exam table (10+ parts)
    const dogGroup = new THREE.Group();
    dogGroup.position.set(0.56, 0.35, 0.56);
    dogGroup.rotation.y = 0.35;

    // Torso
    const dogTorso = new THREE.Mesh(
      this.trackGeo(new THREE.CapsuleGeometry(0.16, 0.3, 12, 24)),
      goldenFurMat,
    );
    dogTorso.rotation.x = Math.PI / 4.2;
    dogTorso.position.set(0, 0.26, -0.02);
    dogTorso.castShadow = true;
    dogGroup.add(dogTorso);

    // Soft chest fluff
    const dogChest = new THREE.Mesh(
      this.trackGeo(new THREE.SphereGeometry(0.155, 24, 20)),
      creamFurMat,
    );
    dogChest.scale.set(0.95, 1.15, 0.9);
    dogChest.position.set(0, 0.34, 0.09);
    dogChest.castShadow = true;
    dogGroup.add(dogChest);

    // Seated haunches (L/R)
    [-1, 1].forEach((side) => {
      const haunch = new THREE.Mesh(
        this.trackGeo(new THREE.SphereGeometry(0.115, 20, 16)),
        goldenFurMat,
      );
      haunch.scale.set(0.82, 1.1, 1.15);
      haunch.position.set(side * 0.12, 0.13, -0.13);
      haunch.castShadow = true;
      dogGroup.add(haunch);

      // Front straight legs + paws
      const leg = new THREE.Mesh(
        this.trackGeo(new THREE.CylinderGeometry(0.042, 0.036, 0.28, 16)),
        goldenFurMat,
      );
      leg.position.set(side * 0.09, 0.14, 0.13);
      leg.castShadow = true;
      dogGroup.add(leg);

      const paw = new THREE.Mesh(
        this.trackGeo(new THREE.SphereGeometry(0.045, 16, 12)),
        creamFurMat,
      );
      paw.scale.set(1, 0.65, 1.35);
      paw.position.set(side * 0.09, 0.028, 0.16);
      dogGroup.add(paw);
    });

    // Collar & Gold Tag
    const dogCollar = new THREE.Mesh(
      this.trackGeo(new THREE.TorusGeometry(0.115, 0.018, 12, 32)),
      sageCollarMat,
    );
    dogCollar.rotation.x = Math.PI / 2 - 0.35;
    dogCollar.position.set(0, 0.44, 0.09);
    dogGroup.add(dogCollar);

    const dogTag = new THREE.Mesh(
      this.trackGeo(new THREE.CylinderGeometry(0.022, 0.022, 0.008, 20)),
      goldTagMat,
    );
    dogTag.rotation.x = Math.PI / 2;
    dogTag.position.set(0, 0.39, 0.21);
    dogGroup.add(dogTag);

    // Sculpted Head Group (subtle calm tilt animation)
    this.dogHeadGroup = new THREE.Group();
    this.dogHeadGroup.position.set(0, 0.54, 0.12);

    const cranium = new THREE.Mesh(
      this.trackGeo(new THREE.SphereGeometry(0.135, 24, 20)),
      goldenFurMat,
    );
    cranium.scale.set(0.96, 1.0, 1.08);
    cranium.castShadow = true;
    this.dogHeadGroup.add(cranium);

    const muzzle = new THREE.Mesh(
      this.trackGeo(new THREE.CapsuleGeometry(0.056, 0.075, 10, 18)),
      creamFurMat,
    );
    muzzle.rotation.x = Math.PI / 2;
    muzzle.position.set(0, -0.028, 0.125);
    this.dogHeadGroup.add(muzzle);

    const nose = new THREE.Mesh(
      this.trackGeo(new THREE.SphereGeometry(0.024, 14, 12)),
      darkFeatureMat,
    );
    nose.scale.set(1.2, 0.85, 0.9);
    nose.position.set(0, -0.012, 0.195);
    this.dogHeadGroup.add(nose);

    [-1, 1].forEach((side) => {
      const eye = new THREE.Mesh(
        this.trackGeo(new THREE.SphereGeometry(0.016, 12, 12)),
        darkFeatureMat,
      );
      eye.position.set(side * 0.054, 0.032, 0.115);
      this.dogHeadGroup.add(eye);

      // Soft floppy retriever ears
      const ear = new THREE.Mesh(
        this.trackGeo(new THREE.CapsuleGeometry(0.036, 0.085, 8, 14)),
        goldenFurMat,
      );
      ear.scale.set(0.45, 1, 1.15);
      ear.rotation.z = side * 0.22;
      ear.rotation.x = 0.12;
      ear.position.set(side * 0.125, -0.025, 0.0);
      ear.castShadow = true;
      this.dogHeadGroup.add(ear);
    });

    dogGroup.add(this.dogHeadGroup);

    // Gentle wagging tail (TubeGeometry)
    const tailCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.08, -0.18),
      new THREE.Vector3(0.04, 0.15, -0.32),
      new THREE.Vector3(0.08, 0.28, -0.4),
    ]);
    this.dogTail = new THREE.Mesh(
      this.trackGeo(new THREE.TubeGeometry(tailCurve, 18, 0.028, 10, false)),
      goldenFurMat,
    );
    this.dogTail.castShadow = true;
    dogGroup.add(this.dogTail);

    this.scene.add(dogGroup);

    // 2) Sculpted British Shorthair Cat resting serenely on cushion (9+ parts)
    this.catBodyGroup = new THREE.Group();
    this.catBodyGroup.position.set(1.06, 0.355, 0.78);
    this.catBodyGroup.rotation.y = -0.55;

    const catTorso = new THREE.Mesh(
      this.trackGeo(new THREE.SphereGeometry(0.145, 24, 20)),
      catSilverMat,
    );
    catTorso.scale.set(1.15, 0.76, 1.38);
    catTorso.position.y = 0.1;
    catTorso.castShadow = true;
    this.catBodyGroup.add(catTorso);

    const catHead = new THREE.Mesh(
      this.trackGeo(new THREE.SphereGeometry(0.095, 22, 18)),
      catSilverMat,
    );
    catHead.position.set(0, 0.19, 0.145);
    catHead.castShadow = true;
    this.catBodyGroup.add(catHead);

    const catNose = new THREE.Mesh(
      this.trackGeo(new THREE.SphereGeometry(0.013, 12, 10)),
      this.trackMat(new THREE.MeshStandardMaterial({ color: '#D89E9A', roughness: 0.4 })),
    );
    catNose.position.set(0, 0.18, 0.235);
    this.catBodyGroup.add(catNose);

    [-1, 1].forEach((side) => {
      const catEye = new THREE.Mesh(
        this.trackGeo(new THREE.SphereGeometry(0.013, 12, 10)),
        darkFeatureMat,
      );
      catEye.position.set(side * 0.038, 0.205, 0.22);
      this.catBodyGroup.add(catEye);

      const catEar = new THREE.Mesh(
        this.trackGeo(new THREE.ConeGeometry(0.032, 0.068, 12)),
        catSlateMat,
      );
      catEar.position.set(side * 0.056, 0.28, 0.135);
      catEar.rotation.z = -side * 0.22;
      this.catBodyGroup.add(catEar);

      const catPaw = new THREE.Mesh(
        this.trackGeo(new THREE.SphereGeometry(0.032, 14, 12)),
        catSilverMat,
      );
      catPaw.scale.set(0.9, 0.65, 1.3);
      catPaw.position.set(side * 0.055, 0.03, 0.19);
      this.catBodyGroup.add(catPaw);
    });

    const catTailCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.06, -0.17),
      new THREE.Vector3(0.14, 0.05, -0.18),
      new THREE.Vector3(0.22, 0.07, -0.04),
    ]);
    this.catTail = new THREE.Mesh(
      this.trackGeo(new THREE.TubeGeometry(catTailCurve, 18, 0.022, 10, false)),
      catSlateMat,
    );
    this.catBodyGroup.add(this.catTail);

    this.scene.add(this.catBodyGroup);
  }

  private buildBotanicalAndMotes(): void {
    // Travertine Olive Tree Planter (grounds the architectural sanctuary)
    const planterGroup = new THREE.Group();
    planterGroup.position.set(1.82, 0.245, -1.12);

    const potMat = this.trackMat(
      new THREE.MeshStandardMaterial({ color: '#D7D0C2', roughness: 0.78 }),
    );
    const trunkMat = this.trackMat(
      new THREE.MeshStandardMaterial({ color: '#6E5A46', roughness: 0.88 }),
    );
    const leafMat = this.trackMat(
      new THREE.MeshStandardMaterial({ color: '#4E735E', roughness: 0.62 }),
    );

    const pot = new THREE.Mesh(
      this.trackGeo(new THREE.CylinderGeometry(0.26, 0.2, 0.44, 28)),
      potMat,
    );
    pot.position.y = 0.22;
    pot.castShadow = true;
    pot.receiveShadow = true;
    planterGroup.add(pot);

    const trunkCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.4, 0),
      new THREE.Vector3(0.04, 0.95, 0.03),
      new THREE.Vector3(-0.02, 1.5, -0.02),
    ]);
    const trunk = new THREE.Mesh(
      this.trackGeo(new THREE.TubeGeometry(trunkCurve, 18, 0.03, 10, false)),
      trunkMat,
    );
    trunk.castShadow = true;
    planterGroup.add(trunk);

    // Instanced olive leaves (>20 identical items -> InstancedMesh with color variation)
    const leafCount = 54;
    const leafGeo = this.trackGeo(new THREE.SphereGeometry(0.065, 10, 8));
    leafGeo.scale(0.55, 1.4, 0.28);
    const leaves = new THREE.InstancedMesh(leafGeo, leafMat, leafCount);
    for (let i = 0; i < leafCount; i++) {
      const theta = i * 2.39996;
      const rad = 0.08 + Math.sqrt(i / leafCount) * 0.36;
      const y = 1.25 + Math.sin(i * 0.7) * 0.26 + (i / leafCount) * 0.32;
      _dummy.position.set(Math.cos(theta) * rad, y, Math.sin(theta) * rad);
      _dummy.rotation.set(Math.random() * 1.2, theta, Math.random() * 0.8);
      const s = 0.85 + Math.random() * 0.3;
      _dummy.scale.set(s, s, s);
      _dummy.updateMatrix();
      leaves.setMatrixAt(i, _dummy.matrix);
      _c1.setHSL(0.39 + (Math.random() - 0.5) * 0.04, 0.24, 0.35 + (Math.random() - 0.5) * 0.08);
      leaves.setColorAt(i, _c1);
    }
    leaves.instanceMatrix.needsUpdate = true;
    if (leaves.instanceColor) leaves.instanceColor.needsUpdate = true;
    leaves.computeBoundingSphere();
    leaves.castShadow = true;
    planterGroup.add(leaves);
    this.scene.add(planterGroup);

    // Calm floating warm sunlit motes (InstancedMesh)
    const moteCount = 42;
    const moteGeo = this.trackGeo(new THREE.SphereGeometry(0.014, 8, 8));
    const moteMat = this.trackMat(
      new THREE.MeshBasicMaterial({
        color: '#F5DFB5',
        transparent: true,
        opacity: 0.45,
      }),
    );
    this.motesMesh = new THREE.InstancedMesh(moteGeo, moteMat, moteCount);
    this.motesMesh.frustumCulled = false;

    for (let i = 0; i < moteCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 0.5 + Math.random() * 2.1;
      const item = {
        x: Math.cos(angle) * r,
        y: 0.45 + Math.random() * 2.4,
        z: Math.sin(angle) * r,
        speed: 0.25 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2,
      };
      this.moteOffsets.push(item);
      _dummy.position.set(item.x, item.y, item.z);
      _dummy.scale.setScalar(1);
      _dummy.updateMatrix();
      this.motesMesh.setMatrixAt(i, _dummy.matrix);
    }
    this.motesMesh.instanceMatrix.needsUpdate = true;
    this.scene.add(this.motesMesh);
  }

  private buildInteractionProxies(): void {
    const stations: { id: HotspotId; pos: [number, number, number]; radius: number; ringY: number }[] = [
      { id: 'companions', pos: [0.8, 0.65, 0.65], radius: 0.65, ringY: 0.26 },
      { id: 'monitor', pos: [-0.95, 1.38, -0.58], radius: 0.48, ringY: 0.26 },
      { id: 'table', pos: [-0.2, 0.96, -0.1], radius: 0.72, ringY: 0.26 },
      { id: 'lamp', pos: [-0.18, 2.34, -0.05], radius: 0.45, ringY: 0.26 },
    ];

    const proxyMat = this.trackMat(
      new THREE.MeshBasicMaterial({ visible: false }),
    );

    stations.forEach((st) => {
      const proxy = new THREE.Mesh(
        this.trackGeo(new THREE.SphereGeometry(st.radius, 12, 12)),
        proxyMat,
      );
      proxy.position.set(...st.pos);
      proxy.layers.set(1);
      proxy.userData.hotspotId = st.id;
      this.hitProxies.push(proxy);
      this.scene.add(proxy);

      // Subtle brass floor indicator ring that highlights when selected
      const ring = new THREE.Mesh(
        this.trackGeo(new THREE.RingGeometry(st.radius * 0.62, st.radius * 0.67, 40)),
        this.trackMat(
          new THREE.MeshBasicMaterial({
            color: '#D4AF63',
            transparent: true,
            opacity: 0.0,
            side: THREE.DoubleSide,
          }),
        ),
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(st.pos[0], st.ringY, st.pos[2]);
      this.hotspotRings[st.id] = ring;
      this.scene.add(ring);
    });

    this.raycaster.layers.set(1);
  }

  private bindEvents(): void {
    window.addEventListener('resize', this.handleResize);
    const canvas = this.renderer.domElement;
    canvas.addEventListener('pointerdown', this.handlePointerDown);
    canvas.addEventListener('pointerup', this.handlePointerUp);
    canvas.addEventListener('pointermove', this.handlePointerMove);
    canvas.addEventListener('webglcontextlost', this.handleContextLost);
    canvas.addEventListener('webglcontextrestored', this.handleContextRestored);
  }

  private handleResize = (): void => {
    if (this.disposed) return;
    const width = Math.max(this.container.clientWidth, 300);
    const height = Math.max(this.container.clientHeight, 300);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  private updatePointer(e: PointerEvent): void {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }

  private handlePointerDown = (e: PointerEvent): void => {
    this.pointerDownPos.set(e.clientX, e.clientY);
  };

  private handlePointerMove = (e: PointerEvent): void => {
    this.updatePointer(e);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(this.hitProxies, false);
    this.renderer.domElement.style.cursor = hits.length > 0 ? 'pointer' : 'grab';
  };

  private handlePointerUp = (e: PointerEvent): void => {
    const dist = Math.hypot(e.clientX - this.pointerDownPos.x, e.clientY - this.pointerDownPos.y);
    if (dist > 6) return; // Was orbiting, not clicking

    this.updatePointer(e);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(this.hitProxies, false);
    if (hits.length > 0) {
      const id = hits[0].object.userData.hotspotId as HotspotId;
      this.setSelectedHotspot(id);
      this.callbacks.onSelectHotspot?.(id);
    }
  };

  private handleContextLost = (e: Event): void => {
    e.preventDefault();
    cancelAnimationFrame(this.frameId);
    window.clearTimeout(this.frameId);
    this.callbacks.onWebGLUnavailable?.();
  };

  private handleContextRestored = (): void => {
    this.tick();
  };

  public setCameraPreset(preset: CameraPreset): void {
    this.activePreset = preset;
  }

  public setExplode(value: number): void {
    this.targetExplode = THREE.MathUtils.clamp(value, 0, 1);
  }

  public setLightingMood(mood: LightingMood): void {
    this.targetMood = mood;
  }

  public setSelectedHotspot(id: HotspotId | null): void {
    this.selectedHotspot = id;
    if (id === 'companions') this.setCameraPreset('companions');
    else if (id === 'monitor') this.setCameraPreset('diagnostics');
    else if (id === 'lamp') this.setCameraPreset('lamp');
    else if (id === 'table') this.setCameraPreset('overview');
  }

  private afterDraw(cb: () => void): void {
    const gl = this.renderer.getContext() as WebGL2RenderingContext;
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    const poll = () => {
      if (this.disposed) return;
      const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
      if (state === gl.UNSIGNALED) {
        this.frameId = window.setTimeout(poll, 5);
      } else {
        if (sync) gl.deleteSync(sync);
        this.frameId = window.setTimeout(cb, 80);
      }
    };
    this.frameId = window.setTimeout(poll, 5);
  }

  private tick = (): void => {
    if (this.disposed) return;

    const delta = Math.min(this.clock.getDelta(), 0.08);
    const elapsed = this.clock.getElapsedTime();

    // 1. Smooth camera preset damping
    if (this.activePreset) {
      const target = CAMERA_PRESETS[this.activePreset];
      _v1.copy(this.camera.position);
      this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, target.pos.x, 4.2, delta);
      this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, target.pos.y, 4.2, delta);
      this.camera.position.z = THREE.MathUtils.damp(this.camera.position.z, target.pos.z, 4.2, delta);

      this.controls.target.x = THREE.MathUtils.damp(this.controls.target.x, target.look.x, 4.8, delta);
      this.controls.target.y = THREE.MathUtils.damp(this.controls.target.y, target.look.y, 4.8, delta);
      this.controls.target.z = THREE.MathUtils.damp(this.controls.target.z, target.look.z, 4.8, delta);

      if (
        this.camera.position.distanceTo(target.pos) < 0.025 &&
        this.controls.target.distanceTo(target.look) < 0.025
      ) {
        this.activePreset = null;
      }
    }

    // 2. Smooth exploded-layer inspection
    this.currentExplode = THREE.MathUtils.damp(this.currentExplode, this.targetExplode, 5.5, delta);
    this.canopyRingGroup.position.y = this.currentExplode * 0.72;
    this.lampAssembly.position.y = this.currentExplode * 0.45;
    this.tableTopAssembly.position.y = 0.93 + this.currentExplode * 0.24;
    this.monitorAssembly.position.x = -0.98 - this.currentExplode * 0.42;
    this.trayAssembly.position.x = -1.35 - this.currentExplode * 0.36;

    // 3. Smooth Daylight <-> Evening atmosphere lighting
    const targetMoodVal = this.targetMood === 'evening' ? 1 : 0;
    this.moodBlend = THREE.MathUtils.damp(this.moodBlend, targetMoodVal, 3.6, delta);
    _c1.copy(DAY_BG).lerp(EVENING_BG, this.moodBlend);
    (this.scene.background as THREE.Color).copy(_c1);
    if (this.scene.fog instanceof THREE.FogExp2) {
      this.scene.fog.color.copy(_c1);
    }
    _c2.copy(DAY_KEY_COLOR).lerp(EVENING_KEY_COLOR, this.moodBlend);
    this.keyLight.color.copy(_c2);
    this.keyLight.intensity = THREE.MathUtils.lerp(2.2, 0.9, this.moodBlend);
    this.hemiLight.intensity = THREE.MathUtils.lerp(0.85, 0.42, this.moodBlend);
    this.lampSpotlight.intensity = THREE.MathUtils.lerp(1.4, 2.7, this.moodBlend);

    // 4. Calm companion animations (gentle tail sway & breathing)
    this.dogTail.rotation.y = Math.sin(elapsed * 2.2) * 0.14;
    this.dogHeadGroup.rotation.z = Math.sin(elapsed * 0.75) * 0.035;
    this.catTail.rotation.y = Math.sin(elapsed * 1.15) * 0.09;
    this.catBodyGroup.scale.y = 1 + Math.sin(elapsed * 1.4) * 0.015;

    // 5. Calm drifting dust motes
    for (let i = 0; i < this.moteOffsets.length; i++) {
      const m = this.moteOffsets[i];
      _v2.set(
        m.x + Math.sin(elapsed * m.speed + m.phase) * 0.08,
        m.y + Math.cos(elapsed * m.speed * 0.8 + m.phase) * 0.09,
        m.z + Math.sin(elapsed * m.speed * 0.6 + m.phase) * 0.08,
      );
      _dummy.position.copy(_v2);
      _dummy.scale.setScalar(0.85 + Math.sin(elapsed + m.phase) * 0.25);
      _dummy.updateMatrix();
      this.motesMesh.setMatrixAt(i, _dummy.matrix);
    }
    this.motesMesh.instanceMatrix.needsUpdate = true;

    // 6. Selected hotspot floor highlight ring
    (Object.keys(this.hotspotRings) as HotspotId[]).forEach((key) => {
      const ring = this.hotspotRings[key];
      if (!ring) return;
      const mat = ring.material as THREE.MeshBasicMaterial;
      const targetOpacity = this.selectedHotspot === key ? 0.8 : 0.0;
      mat.opacity = THREE.MathUtils.damp(mat.opacity, targetOpacity, 6, delta);
    });

    // 7. Live ECG monitor waveform
    this.ecgPhase += delta * 2.3;
    this.drawMonitorScreen(this.ecgPhase);

    this.controls.update();
    this.renderer.render(this.scene, this.camera);

    if (this.isSoftwareGl) {
      this.afterDraw(this.tick);
    } else {
      this.frameId = requestAnimationFrame(this.tick);
    }
  };

  public dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.frameId);
    window.clearTimeout(this.frameId);

    window.removeEventListener('resize', this.handleResize);
    if (this.renderer) {
      const canvas = this.renderer.domElement;
      canvas.removeEventListener('pointerdown', this.handlePointerDown);
      canvas.removeEventListener('pointerup', this.handlePointerUp);
      canvas.removeEventListener('pointermove', this.handlePointerMove);
      canvas.removeEventListener('webglcontextlost', this.handleContextLost);
      canvas.removeEventListener('webglcontextrestored', this.handleContextRestored);
    }

    this.controls?.dispose();
    this.geometries.forEach((g) => g.dispose());
    this.materials.forEach((m) => m.dispose());
    this.textures.forEach((t) => t.dispose());
    this.envRT?.dispose();
    this.renderer?.dispose();
    if (this.renderer?.domElement?.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
