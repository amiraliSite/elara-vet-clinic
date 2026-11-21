import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { CLINIC_IMAGES, type ClinicImageKey } from '../data/clinicMedia';

export interface HeroSlider3DCallbacks {
  onSelectSlide?: (index: number) => void;
  onWebGLUnavailable?: () => void;
}

const _dummy = new THREE.Object3D();
const _v1 = new THREE.Vector3();

const SLIDE_KEYS: ClinicImageKey[] = [
  'hero',
  'diagnostics',
  'surgery',
  'dog',
  'cat',
  'team',
];

export class VetHeroSlider3D {
  private container: HTMLElement;
  private callbacks: HeroSlider3DCallbacks;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private clock = new THREE.Clock();
  private frameId = 0;
  private isSoftwareGl = false;
  private disposed = false;

  private activeIndex = 0;
  private dirSign = -1; // -1 puts active 3D stage slightly left in RTL, +1 in LTR
  private pointerNorm = new THREE.Vector2(0, 0);
  private targetCamOffset = new THREE.Vector2(0, 0);

  private slideGroups: THREE.Group[] = [];
  private hitMeshes: THREE.Mesh[] = [];
  private motesMesh!: THREE.InstancedMesh;
  private moteData: { x: number; y: number; z: number; speed: number; phase: number }[] = [];
  private brassHalo!: THREE.Mesh;

  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();

  private geometries: THREE.BufferGeometry[] = [];
  private materials: THREE.Material[] = [];
  private textures: THREE.Texture[] = [];
  private envRT: THREE.WebGLRenderTarget | null = null;

  constructor(container: HTMLElement, callbacks: HeroSlider3DCallbacks = {}) {
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

  private trackGeo<T extends THREE.BufferGeometry>(g: T): T {
    this.geometries.push(g);
    return g;
  }

  private trackMat<T extends THREE.Material>(m: T): T {
    this.materials.push(m);
    return m;
  }

  private trackTex<T extends THREE.Texture>(t: T): T {
    this.textures.push(t);
    return t;
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
    this.renderer.toneMappingExposure = 1.08;
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(width, height);
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.domElement.style.display = 'block';
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#0E1613');
    this.scene.fog = new THREE.FogExp2('#0E1613', 0.058);

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    this.scene.environment = this.envRT.texture;
    pmrem.dispose();

    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 60);
    this.camera.position.set(0, 0.45, 7.2);

    this.setupLighting();
    this.buildStage();
    this.buildPhotoCarouselFrames();
    this.buildAmbientMotes();

    if (!this.isSoftwareGl) {
      this.renderer.compile(this.scene, this.camera);
    }

    this.bindEvents();
    this.tick();
  }

  private setupLighting(): void {
    const hemi = new THREE.HemisphereLight('#DCE9E4', '#2F2A22', 0.9);
    this.scene.add(hemi);

    const key = new THREE.DirectionalLight('#FFF1DC', 2.0);
    key.position.set(4.5, 6.5, 6.0);
    key.castShadow = !this.isSoftwareGl;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.bias = -0.0005;
    key.shadow.normalBias = 0.02;
    this.scene.add(key);

    const rim = new THREE.DirectionalLight('#7EB9A4', 1.1);
    rim.position.set(-5.0, 3.0, -4.5);
    this.scene.add(rim);
  }

  private buildStage(): void {
    // Sleek dark mineral architectural gallery floor
    const floor = new THREE.Mesh(
      this.trackGeo(new THREE.CircleGeometry(24, 64)),
      this.trackMat(
        new THREE.MeshStandardMaterial({
          color: '#111A16',
          roughness: 0.42,
          metalness: 0.25,
        }),
      ),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.95;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Sculpted circular brushed-brass gallery orbit rail on the floor
    this.brassHalo = new THREE.Mesh(
      this.trackGeo(new THREE.TorusGeometry(4.6, 0.018, 14, 120)),
      this.trackMat(
        new THREE.MeshPhysicalMaterial({
          color: '#C9A45C',
          metalness: 0.92,
          roughness: 0.22,
        }),
      ),
    );
    this.brassHalo.rotation.x = Math.PI / 2;
    this.brassHalo.position.set(0, -1.92, -1.6);
    this.scene.add(this.brassHalo);
  }

  private buildPhotoCarouselFrames(): void {
    const loader = new THREE.TextureLoader();
    const maxAniso = this.renderer.capabilities.getMaxAnisotropy();

    const brassMat = this.trackMat(
      new THREE.MeshPhysicalMaterial({
        color: '#C5A059',
        metalness: 0.92,
        roughness: 0.2,
        anisotropy: 0.7,
      }),
    );

    const backingMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: '#19231E',
        roughness: 0.5,
        metalness: 0.35,
      }),
    );

    const glassCoatMat = this.trackMat(
      new THREE.MeshPhysicalMaterial({
        color: '#FFFFFF',
        roughness: 0.08,
        metalness: 0.0,
        transparent: true,
        opacity: 0.07,
        depthWrite: false,
      }),
    );

    const frameW = 3.56;
    const frameH = 2.28;

    SLIDE_KEYS.forEach((key, idx) => {
      const group = new THREE.Group();

      // 1. Sculpted back architectural slab
      const backing = new THREE.Mesh(
        this.trackGeo(new THREE.BoxGeometry(frameW + 0.16, frameH + 0.16, 0.09)),
        backingMat,
      );
      backing.position.z = -0.05;
      backing.castShadow = true;
      group.add(backing);

      // 2. Brushed brass perimeter bevel bars (4 parts)
      const topBar = new THREE.Mesh(
        this.trackGeo(new THREE.BoxGeometry(frameW + 0.2, 0.045, 0.115)),
        brassMat,
      );
      topBar.position.y = frameH / 2 + 0.075;
      group.add(topBar);

      const bottomBar = new THREE.Mesh(
        this.trackGeo(new THREE.BoxGeometry(frameW + 0.2, 0.045, 0.115)),
        brassMat,
      );
      bottomBar.position.y = -frameH / 2 - 0.075;
      group.add(bottomBar);

      const leftBar = new THREE.Mesh(
        this.trackGeo(new THREE.BoxGeometry(0.045, frameH + 0.19, 0.115)),
        brassMat,
      );
      leftBar.position.x = -frameW / 2 - 0.075;
      group.add(leftBar);

      const rightBar = new THREE.Mesh(
        this.trackGeo(new THREE.BoxGeometry(0.045, frameH + 0.19, 0.115)),
        brassMat,
      );
      rightBar.position.x = frameW / 2 + 0.075;
      group.add(rightBar);

      // 3. Crisp high-resolution clinic photography texture
      const tex = this.trackTex(loader.load(CLINIC_IMAGES[key]));
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = maxAniso;

      const photoMesh = new THREE.Mesh(
        this.trackGeo(new THREE.PlaneGeometry(frameW, frameH)),
        this.trackMat(
          new THREE.MeshStandardMaterial({
            map: tex,
            roughness: 0.35,
            metalness: 0.02,
          }),
        ),
      );
      photoMesh.position.z = 0.005;
      group.add(photoMesh);

      // 4. Museum glass sheen layer
      const glassMesh = new THREE.Mesh(
        this.trackGeo(new THREE.PlaneGeometry(frameW, frameH)),
        glassCoatMat,
      );
      glassMesh.position.z = 0.015;
      group.add(glassMesh);

      // 5. Raycast proxy on layer 1 for clicking side frames
      const hitProxy = new THREE.Mesh(
        this.trackGeo(new THREE.BoxGeometry(frameW + 0.2, frameH + 0.2, 0.15)),
        this.trackMat(new THREE.MeshBasicMaterial({ visible: false })),
      );
      hitProxy.layers.set(1);
      hitProxy.userData.slideIndex = idx;
      group.add(hitProxy);
      this.hitMeshes.push(hitProxy);

      this.slideGroups.push(group);
      this.scene.add(group);
    });

    this.raycaster.layers.set(1);
  }

  private buildAmbientMotes(): void {
    const count = 48;
    const geo = this.trackGeo(new THREE.SphereGeometry(0.016, 8, 8));
    const mat = this.trackMat(
      new THREE.MeshBasicMaterial({
        color: '#E8C988',
        transparent: true,
        opacity: 0.42,
      }),
    );
    this.motesMesh = new THREE.InstancedMesh(geo, mat, count);
    this.motesMesh.frustumCulled = false;

    for (let i = 0; i < count; i++) {
      const m = {
        x: (Math.random() - 0.5) * 11,
        y: (Math.random() - 0.5) * 4.5,
        z: -4 + Math.random() * 6,
        speed: 0.2 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2,
      };
      this.moteData.push(m);
      _dummy.position.set(m.x, m.y, m.z);
      _dummy.updateMatrix();
      this.motesMesh.setMatrixAt(i, _dummy.matrix);
    }
    this.motesMesh.instanceMatrix.needsUpdate = true;
    this.scene.add(this.motesMesh);
  }

  private bindEvents(): void {
    window.addEventListener('resize', this.handleResize);
    const canvas = this.renderer.domElement;
    canvas.addEventListener('pointermove', this.handlePointerMove);
    canvas.addEventListener('pointerdown', this.handlePointerClick);
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

  private handlePointerMove = (e: PointerEvent): void => {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointerNorm.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointerNorm.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.pointer.copy(this.pointerNorm);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(this.hitMeshes, false);
    this.renderer.domElement.style.cursor = hits.length > 0 ? 'pointer' : 'default';
  };

  private handlePointerClick = (e: PointerEvent): void => {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(this.hitMeshes, false);
    if (hits.length > 0) {
      const idx = hits[0].object.userData.slideIndex as number;
      if (typeof idx === 'number' && idx !== this.activeIndex) {
        this.setActiveSlide(idx);
        this.callbacks.onSelectSlide?.(idx);
      }
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

  public setActiveSlide(index: number): void {
    const total = SLIDE_KEYS.length;
    this.activeIndex = ((index % total) + total) % total;
  }

  public setDirection(dir: 'ltr' | 'rtl'): void {
    this.dirSign = dir === 'rtl' ? -1 : 1;
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
    const total = this.slideGroups.length;

    // Gentle 3D camera parallax following pointer
    this.targetCamOffset.x = THREE.MathUtils.damp(
      this.targetCamOffset.x,
      this.pointerNorm.x * 0.42,
      3.5,
      delta,
    );
    this.targetCamOffset.y = THREE.MathUtils.damp(
      this.targetCamOffset.y,
      this.pointerNorm.y * 0.22,
      3.5,
      delta,
    );
    this.camera.position.x = this.targetCamOffset.x;
    this.camera.position.y = 0.45 + this.targetCamOffset.y;
    this.camera.lookAt(0, 0.05, -0.5);

    // Curved 3D Gallery Carousel Layout
    const stageBiasX = this.dirSign * 1.38; // Balances alongside editorial headline on opposite side
    const isNarrow = this.container.clientWidth < 960;

    for (let i = 0; i < total; i++) {
      const group = this.slideGroups[i];
      let offset = i - this.activeIndex;
      if (offset > total / 2) offset -= total;
      if (offset < -total / 2) offset += total;

      const absOff = Math.abs(offset);
      const baseCenterX = isNarrow ? 0 : stageBiasX;
      const targetX = baseCenterX + offset * 3.15;
      const targetZ = 0.85 - absOff * 1.65;
      const targetY = (isNarrow ? -0.35 : 0.12) + Math.sin(elapsed * 0.9 + i * 1.1) * 0.045 - absOff * 0.06;
      const targetRotY = -offset * 0.42 - this.pointerNorm.x * (offset === 0 ? 0.06 : 0.02);
      const targetRotX = this.pointerNorm.y * (offset === 0 ? 0.04 : 0.015);
      const targetScale = offset === 0 ? (isNarrow ? 0.86 : 1.04) : Math.max(0.62, 0.88 - absOff * 0.1);

      group.position.x = THREE.MathUtils.damp(group.position.x, targetX, 5.2, delta);
      group.position.y = THREE.MathUtils.damp(group.position.y, targetY, 5.2, delta);
      group.position.z = THREE.MathUtils.damp(group.position.z, targetZ, 5.2, delta);
      group.rotation.y = THREE.MathUtils.damp(group.rotation.y, targetRotY, 5.2, delta);
      group.rotation.x = THREE.MathUtils.damp(group.rotation.x, targetRotX, 5.2, delta);

      const s = THREE.MathUtils.damp(group.scale.x, targetScale, 5.2, delta);
      group.scale.setScalar(s);
    }

    // Subtle rotation of brass floor rail
    this.brassHalo.rotation.z = elapsed * 0.05;

    // Floating sunlit dust motes
    for (let i = 0; i < this.moteData.length; i++) {
      const m = this.moteData[i];
      _v1.set(
        m.x + Math.sin(elapsed * m.speed + m.phase) * 0.1,
        m.y + Math.cos(elapsed * m.speed * 0.7 + m.phase) * 0.12,
        m.z,
      );
      _dummy.position.copy(_v1);
      _dummy.scale.setScalar(0.8 + Math.sin(elapsed + m.phase) * 0.25);
      _dummy.updateMatrix();
      this.motesMesh.setMatrixAt(i, _dummy.matrix);
    }
    this.motesMesh.instanceMatrix.needsUpdate = true;

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
      canvas.removeEventListener('pointermove', this.handlePointerMove);
      canvas.removeEventListener('pointerdown', this.handlePointerClick);
      canvas.removeEventListener('webglcontextlost', this.handleContextLost);
      canvas.removeEventListener('webglcontextrestored', this.handleContextRestored);
    }

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
