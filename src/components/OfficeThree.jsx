/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";

// 3D IMPORT
import * as THREE from "three";
import {
  CSS2DObject,
  CSS2DRenderer,
  DRACOLoader,
  GLTFLoader,
  OrbitControls,
  RGBELoader,
} from "three/examples/jsm/Addons.js";

// 3D MODEL
import hdr from "@/assets/three.hdr";
import model from "@/assets/model/office.glb";

import { clearScene } from "../utils/three/SceneCleanUp";
import { usePopupStore } from "../store/usePopupStore";
import { getDailyListFetch, getUserListFetch } from "../utils/api";
import { userIcon } from "../utils/icon";
import useWorkStatusStore from "../store/useWorkStatusStore";
import RoomCondition from "./RoomCondition";
import seatListStore from "../store/seatListStore";
import useSeatStore from "@/store/seatStore";
import usePersonnelInfoStore from "@/store/personnelInfoStore";
import PersonnelInfoCard from "./PersonnelInfoCard";

const OfficeThree = () => {
  const mainRef = useRef();
  const labelRendererRef = useRef();
  const conditionRef = useRef();
  const labelRef = useRef();
  const modelRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const selectRef = useRef(null);
  const animRef = useRef(null);
  const seatRef = useRef({ startDist: 0 });
  const sceneRef = useRef(new THREE.Scene());

  const [userList, setUserList] = useState([]);
  const [dailyList, setDailyList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCondition, setIsCondition] = useState(true);
  const [isDaily, setIsDaily] = useState(true);

  /**
   * Store
   */
  const { setSeatData } = seatListStore();
  const { isPopupOpen } = usePopupStore();
  const { isWorking } = useWorkStatusStore();
  const { selectedSeat, isSeatEdit, setSelectedSeat } = useSeatStore();
  const { personnelInfo, setPersonnelInfo, clearPersonnelInfo } = usePersonnelInfoStore();

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

    seatRef.current.startDist = cameraRef.current.position.distanceTo(new THREE.Vector3());
  };

  // CONTROL
  const setupControls = () => {
    controlsRef.current = new OrbitControls(cameraRef.current, canvasRef.current);
    controlsRef.current.target.set(-3.84, 1.063, -7.064);
    controlsRef.current.enableDamping = false;
    controlsRef.current.maxPolarAngle = Math.PI / 2;
    controlsRef.current.minPolarAngle = 0;
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

  // LABEL
  const setupLabelRenderer = () => {
    labelRendererRef.current = new CSS2DRenderer();
    labelRendererRef.current.setSize(mainRef.current.offsetWidth, mainRef.current.offsetHeight);
    labelRendererRef.current.domElement.style.position = "absolute";
    labelRendererRef.current.domElement.style.top = 0;
    labelRendererRef.current.domElement.style.left = 0;
    labelRendererRef.current.domElement.style.width = 0;
    labelRendererRef.current.domElement.style.height = 0;
    labelRendererRef.current.domElement.style.overflow = "visible";
    labelRendererRef.current.domElement.style.zIndex = 0;
    canvasRef.current.after(labelRendererRef.current.domElement);
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
    setupLabelRenderer();

    animRef.current = requestAnimationFrame(animate);
  };

  // RESIZE EVENT
  const onWindowResize = () => {
    const w = mainRef.current.offsetWidth;
    const h = mainRef.current.offsetHeight;

    if (cameraRef.current) {
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
    }

    if (rendererRef.current) {
      rendererRef.current.setSize(w, h);
    }

    if (rendererRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);

      if (labelRendererRef.current) {
        labelRendererRef.current.setSize(mainRef.current.offsetWidth, mainRef.current.offsetHeight);
        labelRendererRef.current.domElement.style.width = 0;
        labelRendererRef.current.domElement.style.height = 0;
      }
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

        const seatList = [];
        gltf.scene.traverse((node) => {
          if (node.name.includes("ceiling")) {
            node.visible = false;
          }

          if (node.name.includes("seat-")) {
            seatList.push(node.name);
            seatRef.current[node.name] = {
              ...seatRef.current[node.name],
              obj: node,
            };
          }
        });
        setSeatData(seatList);
        sceneRef.current.add(gltf.scene);
        setIsLoaded(true);
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

      if (labelRendererRef.current) {
        labelRendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    }

    // 부모영역과 캔버스 영역 비교 후 Resize 실행
    if (mainRef.current && canvasRef.current) {
      if (
        mainRef.current.offsetWidth !== canvasRef.current.offsetWidth ||
        mainRef.current.offsetHeight !== canvasRef.current.offsetHeight
      )
        onWindowResize();
    }

    if (cameraRef.current) {
      const dist = cameraRef.current.position.distanceTo(new THREE.Vector3());
      const size = seatRef.current.startDist / dist;
      const newSize = size > 1 ? 1 : size;

      Object.keys(seatRef.current).map((key) => {
        const dom = document.getElementById("label_" + key);
        if (dom) dom.style.transform = `${dom.style.transform} scale(${newSize})`;
      });
    }

    animRef.current = requestAnimationFrame(animate);
  };
  
  const handleLabelClick = (seatName, isEmptySeat) => {
    if (isEmptySeat) {
      setSelectedSeat(seatName);
    } else {
      const selectedUser = userList.find((user) => user.ou_seat_cd === seatName);
      if (selectedUser) {
        const userWithParsedInfo = {
          ...selectedUser,
          ou_insa_info: selectedUser.ou_insa_info ? JSON.parse(selectedUser.ou_insa_info) : {}
        };
        setPersonnelInfo(userWithParsedInfo);
      }
    }
  };

  const createLabel = (obj, name, daily = "미출근") => {
    if (!labelRef.current) return;
    const div = labelRef.current.cloneNode(true);
    div.style.display = "";
    div.addEventListener("click", () => handleLabelClick(obj.name, daily === "미정"));

    const color = daily === "미정" ? "#aaa" : daily === "미출근" ? "#f00" : daily === "출근" ? "#0f0" : "#00f";
    div.style.color = color;
    div.style.borderColor = color;

    if (name && div.children[1]) div.children[1].innerHTML = name;

    const label = new CSS2DObject(div);
    label.position.set(0, 1, 0);
    label.visible = daily !== "미정";
    obj.add(label);

    seatRef.current[obj.name] = {
      ...seatRef.current[obj.name],
      label,
      isEmpty: daily === "미정",
    };
  };

  const updateLabel = (obj, name, daily = "미출근") => {
    const elem = seatRef.current[obj.name]?.label?.element;

    if (elem) {
      if (name && elem.children[1]) elem.children[1].innerHTML = name;

      const color = daily === "미정" ? "#aaa" : daily === "미출근" ? "#f00" : daily === "출근" ? "#0f0" : "#00f";
      elem.style.color = color;
      elem.style.borderColor = color;
    }

    seatRef.current[obj.name] = {
      ...seatRef.current[obj.name],
      isEmpty: daily === "미정",
    };
  };

  const getAllUser = async () => {
    const res = await getUserListFetch();
    if (res) setUserList(res);
  };

  const getDailyList = async () => {
    const res = await getDailyListFetch();
    if (res) setDailyList(res);
  };

  const drawUserIcon = () => {
    Object.keys(seatRef.current).map((key) => {
      const sit = seatRef.current[key];
      const user = userList.find((item) => item.ou_seat_cd === key);
      if (user) {
        const daily = dailyList.find((item) => item.ouds_sabeon === user.ou_sabeon);
        if (sit && sit.obj) {
          if (sit.label) updateLabel(sit.obj, user.ou_nm, daily ? daily.userStatus : undefined);
          else createLabel(sit.obj, user.ou_nm, daily ? daily.userStatus : undefined);
        }
      } else {
        if (sit && sit.obj) {
          if (sit.label) updateLabel(sit.obj, sit.obj.name, "미정");
          else createLabel(sit.obj, sit.obj.name, "미정");
        }
      }
    });
  };

  const editSeat = () => {
    Object.keys(seatRef.current).map((key) => {
      const item = seatRef.current[key];
      if (item.label) {
        if (isSeatEdit) {
          if (item.isEmpty) item.label.visible = true;
          else item.label.visible = false;
        } else {
          if (item.isEmpty) item.label.visible = false;
          else item.label.visible = isDaily;
        }
      }
    });
  };

  const updateSeat = async () => {
    if (isDaily || !isSeatEdit) {
      await getAllUser();
      await getDailyList();
    }
    editSeat();
  };

  // 데이터 변경시 새로고침
  useEffect(() => {
    updateSeat();
  }, [isWorking, isDaily, isSeatEdit]);

  useEffect(() => {
    if (selectedSeat) {
      Object.keys(seatRef.current).map((key) => {
        const item = seatRef.current[key];
        if (item && item.label && item.isEmpty)
          item.label.element.style.borderColor = key === selectedSeat ? "#f00" : "#aaa";
      });
    }
  }, [selectedSeat]);

  useEffect(() => {
    if (isLoaded) drawUserIcon();
  }, [userList, dailyList, isLoaded]);

  useEffect(() => {
    if (mainRef.current) {
      createScene();
      loadModel();
    }

    return () => {
      clearScene(sceneRef.current, controlsRef.current, rendererRef.current, animRef.current, selectRef.current);
    };
  }, [mainRef]);

  // useEffect(() => {}, [isEdit]);

  return (
    <main
      ref={mainRef}
      className={`z-0 bg-[#292929] flex-1 overflow-hidden ${isPopupOpen ? "absolute left-64" : "relative"}`}
    >
      <canvas className="absolute top-0 left-0" ref={canvasRef} />
      {isLoaded && (
        <>
          <div className="absolute bottom-4 right-4 flex gap-4">
            <div
              className={[
                "px-2 py-2 rounded-lg cursor-pointer text-black",
                isDaily ? "bg-sbtLightBlue/75 font-bold" : "bg-white",
              ].join(" ")}
              onClick={() => setIsDaily((prev) => !prev)}
            >
              출퇴근 현황
            </div>
            <div
              className={[
                "px-2 py-2 rounded-lg cursor-pointer text-black",
                isCondition ? "bg-sbtLightBlue/75 font-bold" : "bg-white",
              ].join(" ")}
              onClick={() => setIsCondition((prev) => !prev)}
            >
              Green_1 상태
            </div>
          </div>
          {isCondition && <RoomCondition conditionRef={conditionRef} closeEvent={() => setIsCondition(false)} />}
          <div
            ref={labelRef}
            className="absolute top-0 left-0 w-12 h-12 px-2 py-2 rounded-full bg-white/75 backdrop-blur-sm border-x-2 border-y-2 border-black text-black cursor-pointer"
            style={{ display: "none" }}
          >
            {userIcon()}
            <div className="absolute top-14 left-1/2 -translate-x-1/2 px-1 py-1 text-black bg-white/75 backdrop-blur-sm rounded-md text-nowrap"></div>
          </div>
        </>
      )}
      {personnelInfo && <PersonnelInfoCard personnelInfo={personnelInfo} onClose={clearPersonnelInfo} />}
    </main>
  );
};

export default OfficeThree;
