/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";

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
import ObjectSelect from "../utils/three/ObjectSelect";
import { clearScene } from "../utils/three/SceneCleanUp";
import { usePopupStore } from "../store/usePopupStore";

const OfficeThree = () => {
  const mainRef = useRef();
  const modelRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const selectRef = useRef(null);
  const animRef = useRef(null);

  const sceneRef = useRef(new THREE.Scene());

  const [isEdit, setIsEdit] = useState(false);

  const { isPopupOpen } = usePopupStore();

  // SIZES
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  // CAMERA
  const setupCamera = () => {
    cameraRef.current = new THREE.PerspectiveCamera(
      45,
      mainRef.current.offsetWidth / mainRef.current.offsetHeight,
      1,
      2000
    );
    cameraRef.current.position.set(-3.684, 13.704, -19.717);
    sceneRef.current.add(cameraRef.current);
  };

  // CONTROL
  const setupControls = () => {
    controlsRef.current = new OrbitControls(cameraRef.current, canvasRef.current);
    controlsRef.current.target.set(-3.84, 1.063, -7.064);
    controlsRef.current.enableDamping = false;
    controlsRef.current.maxPolarAngle = Math.PI / 2;
    controlsRef.current.minPolarAngle = 0;
  };

  const setObjectSelect = () => {
    selectRef.current = new ObjectSelect(sceneRef.current, canvasRef.current, cameraRef.current);
  };

  // LIGHT
  const setupLights = () => {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    sceneRef.current.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xfdf4dc, 1.2);
    directionalLight.position.set(1.4, 2.65, 2.65);
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
    rendererRef.current.setSize(mainRef.current.offsetWidth, mainRef.current.offsetHeight);
    rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 1)); // 성능 최적화를 위해 1로 설정
    rendererRef.current.setClearColor(0x292929, 0);
    rendererRef.current.toneMapping = THREE.ACESFilmicToneMapping;
    rendererRef.current.toneMappingExposure = 1;

    setupCamera();
    setupControls();
    setupLights();
    setObjectSelect();

    animRef.current = requestAnimationFrame(animate);
  };

  // RESIZE EVENT
  const onWindowResize = () => {
    const w = mainRef.current.offsetWidth;
    const h = mainRef.current.offsetHeight;

    // sizes.width = window.innerWidth;
    // sizes.height = window.innerHeight;

    if (cameraRef.current) {
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
    }

    if (rendererRef.current) {
      rendererRef.current.setSize(w, h);
    }

    if (rendererRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  };

  // LOAD
  const loadModel = () => {
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
    loader.setDRACOLoader(dracoLoader);

    new RGBELoader().load(hdr, (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      sceneRef.current.environment = texture;
    });

    loader.load(
      model,
      (gltf) => {
        modelRef.current = gltf.scene;
        gltf.scene.scale.set(1, 1, 1);
        gltf.scene.position.set(0, 0, 0);

        gltf.scene.traverse((node) => {
          if (node.name.includes("ceiling")) {
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
  };

  // ANIMATION
  const animate = () => {
    if (controlsRef.current) {
      controlsRef.current.update();
    }

    if (rendererRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }

    // 부모영역과 캔버스 영역 비교 후 Resize 실행
    if (mainRef.current && canvasRef.current) {
      if (
        mainRef.current.offsetWidth !== canvasRef.current.offsetWidth ||
        mainRef.current.offsetHeight !== canvasRef.current.offsetHeight
      )
        onWindowResize();
    }

    animRef.current = requestAnimationFrame(animate);
  };

  /**
   * CLEAN-UP
   */
  // useEffect(() => {
  //     createScene();
  //     loadModel();

  //     const handleResize = throttle(onWindowResize, 500);
  //     window.addEventListener("resize", handleResize);

  //     return () => {
  //         clearScene(
  //             sceneRef.current,
  //             controlsRef.current,
  //             rendererRef.current,
  //             animRef.current
  //         );
  //         window.removeEventListener("resize", handleResize);
  //     };
  // }, []);

  useEffect(() => {
    if (mainRef.current) {
      createScene();
      loadModel();
    }

    return () => {
      clearScene(sceneRef.current, controlsRef.current, rendererRef.current, animRef.current);
    };
  }, [mainRef]);

  return (
    <main ref={mainRef} className={`relative z-0 bg-[#292929] flex-1 ${isPopupOpen ? "absolute left-64" : ""}`}>
      <canvas className="absolute top-0 left-0" ref={canvasRef} />
    </main>
  );
};

export default OfficeThree;
