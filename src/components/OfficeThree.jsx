import { Suspense, useEffect, useRef } from "react";
import style from "@/styles/officeThree.module.css";

// 3D IMPORT
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// 3D MODEL
import hdr from "@/assets/three.hdr";
import model from "@/assets/model/office.glb";

import { throttle } from "lodash-es";
import { ErrorBoundary } from "react-error-boundary";
import BarLoader from "react-spinners/BarLoader";

const ErrorFallback = (error) => <div>An error occurred: {error.message}</div>;

const OfficeThree = () => {
  const modelRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);

  const sceneRef = useRef(new THREE.Scene());

  /**
   * 3D
   */
  // SIZES
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  // CAMERA
  const cameraSetting = () => {
    cameraRef.current = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 1, 2000);
    cameraRef.current.position.set(-3.684167226778625, 13.703704502199631, -19.71748398597716);
    sceneRef.current.add(cameraRef.current);
  };
  // CONTROL
  const controlSetting = () => {
    controlsRef.current = new OrbitControls(cameraRef.current, canvasRef.current);
    controlsRef.current.target.set(-3.83965147511199, 1.0627257131879073, -7.063586155882121);
    controlsRef.current.enableDamping = true;
    controlsRef.current.maxPolarAngle = Math.PI / 2; // 최대 세로 각도 제한 (90도)
    controlsRef.current.minPolarAngle = 0; // 최소 세로 각도 제한
  };
  // Light
  const lightSetting = () => {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    sceneRef.current.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xfdf4dc, 1.2);
    directionalLight.position.set(1.4, 2.65, 2.65);
    directionalLight.castShadow = true;
    sceneRef.current.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0xb6ceff, 0.3);
    fillLight.position.set(-2, 1, -1);
    sceneRef.current.add(fillLight);
  };
  // SCENE CREATE
  const createScene = () => {
    const canvas = canvasRef.current;
    rendererRef.current = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    rendererRef.current.setSize(sizes.width, sizes.height);
    rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current.setClearColor(0x292929, 0);
    rendererRef.current.sortObjects = false;
    rendererRef.current.colorSpace = THREE.SRGBColorSpace;
    rendererRef.current.toneMapping = THREE.ACESFilmicToneMapping;
    rendererRef.current.toneMappingExposure = 1;

    cameraSetting();
    controlSetting();
    lightSetting();
  };
  // RESIZE EVENT
  const onWindowResize = () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    if (cameraRef.current) {
      cameraRef.current.aspect = sizes.width / sizes.height;
      cameraRef.current.updateProjectionMatrix();
    }

    if (rendererRef.current) {
      rendererRef.current.setSize(sizes.width, sizes.height);
      rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
  };

  // LOAD
  const modelLoader = () => {
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
    loader.setDRACOLoader(dracoLoader);

    new RGBELoader().load(hdr, (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      sceneRef.current.environment = texture;
      loader.load(
        model,
        (gltf) => {
          modelRef.current = gltf.scene;
          gltf.scene.scale.set(1, 1, 1);
          gltf.scene.position.set(0, 0, 0);

          gltf.scene.traverse((node) => {
            const ceiling = node.name.includes("ceiling");
            if (ceiling) {
              node.visible = false;
            }
          });

          sceneRef.current.add(gltf.scene);
        },
        undefined,
        (error) => {
          console.error("An error happened during loading:", error);
        }
      );
    });
  };

  // ANIMATION
  const animate = () => {
    if (controlsRef.current) {
      controlsRef.current.update();
    }

    if (rendererRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
    requestAnimationFrame(animate);
  };

  /**
   * CLEAN-UP
   */
  useEffect(() => {
    const setupScene = () => {
      createScene();
      modelLoader();
      animate();
    };

    const setupEventListeners = () => {
      const handleResize = throttle(onWindowResize, 500);
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    };

    const cleanupScene = () => {
      if (rendererRef.current) rendererRef.current.dispose();
      if (sceneRef.current) sceneRef.current.clear();
    };

    setupScene();

    return () => {
      setupEventListeners();
      cleanupScene();
    };
  }, []);

  /**
   * DEBUGS
   */
  useEffect(() => {
    document.addEventListener("keydown", (event) => {
      switch (event.code) {
        case "Space":
          console.log("------------------------");
          console.log(cameraRef.current.position);
          console.log(controlsRef.current.target);
          break;
      }
    });
  }, []);

  return (
    <div className={style.container}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense
          fallback={
            <div className={style.loading}>
              <BarLoader color="#3485ff" height={8} speedMultiplier={0.8} width={150} />
            </div>
          }
        >
          <canvas ref={canvasRef} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default OfficeThree;
