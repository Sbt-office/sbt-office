/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import * as THREE from "three";
import {
  CSS2DObject,
  CSS2DRenderer,
  CSS3DObject,
  CSS3DRenderer,
  DRACOLoader,
  GLTFLoader,
  RGBELoader,
  OrbitControls,
} from "three/examples/jsm/Addons.js";

import hdr from "@/assets/three.hdr";
import model from "@/assets/model/office.glb";
import userGlb from "@/assets/model/user.glb";
import christmasTree from "@/assets/model/christmasTree.glb";
import temperature from "@/assets/model/temperature.glb";
import air from "@/assets/model/airmc.glb";
import fire from "@/assets/model/fire.glb";

// GLB 모델 맵핑
const modelMap = {
  christmasTree,
  temperature,
  air,
  fire,
  user: userGlb,
};

import { userIcon } from "@/utils/icon";
import defaultProfile from "@/assets/images/comLogo.png";

import { clearScene } from "@/utils/three/SceneCleanUp";
import { useAllUserListQuery } from "@/hooks/useAllUserListQuery";
import PersonnelInfoCard from "./PersonnelInfoCard";
import useWorkStatusStore from "@/store/useWorkStatusStore";
import RoomCondition from "./RoomCondition";
/** STORE */
import seatListStore from "@/store/seatListStore";
import useSeatStore from "@/store/seatStore";
import usePersonnelInfoStore from "@/store/personnelInfoStore";
import useAdminStore from "@/store/adminStore";
import useSocketStore from "@/store/socketStore";
import { useThreeStore } from "@/store/threeStore";

import { useShallow } from "zustand/react/shallow";
import { BarLoader } from "react-spinners";

import { useThrottle } from "@/hooks/useThrottle";
import { useDailyListQuery } from "@/hooks/useDailyListQuery";
import useThemeStore from "../store/themeStore";
import { widgetList } from "../data/widgetList";

const FLOAT_SPEED = 0.005;
const FLOAT_HEIGHT = 0.08;
const USER_LABEL_POSITION_Y = -3.6;

const TOP_POSITION = new THREE.Vector3(0.35563883362850046, 34.63425767640605, -4.476855799979857);
const TOP_TARGET = new THREE.Vector3(0.355329995060846, 0.824055029491148, -4.142916368024322);

const DEFAULT_CAMERA_POSITION = new THREE.Vector3(-3.684, 13.704, -19.717);
const DEFAULT_CAMERA_TARGET = new THREE.Vector3(-3.84, 1.063, -7.064);

const OfficeThree = () => {
  const { data: userList } = useAllUserListQuery();
  const { data: dailyList = [] } = useDailyListQuery();

  const mainRef = useRef(null);
  const labelRendererRef = useRef(null);
  const conditionRef = useRef(null);
  const css3dRendererRef = useRef(null);
  const conditionPanelRef = useRef(null);
  const css3dObjectRef = useRef({});
  const labelRef = useRef(null);
  const modelRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const selectRef = useRef(null);
  const animRef = useRef(null);
  const seatRef = useRef({ startDist: 0 });
  const sceneRef = useRef(new THREE.Scene());
  const doorRef = useRef(null);
  const prevDoorIdxRef = useRef(null);
  const floorObjectRef = useRef(null);
  const dropIndicatorRef = useRef(null);

  const [isDaily, setIsDaily] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTopView, setIsTopView] = useState(false);
  const [isCondition, setIsCondition] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isUserButtonDisabled, setIsUserButtonDisabled] = useState(false);

  const [dropPosition, setDropPosition] = useState(null);
  const [attachedModels, setAttachedModels] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(0);

  /** Store*/
  const { getData } = useSocketStore();
  const isDark = useThemeStore((state) => state.isDark);
  const sabeon = useAdminStore((state) => state.sabeon);
  const setSeatData = seatListStore((state) => state.setSeatData);
  const isWorking = useWorkStatusStore((state) => state.isWorking);
  const selectedSeat = useSeatStore((state) => state.selectedSeat);
  const personnelInfo = usePersonnelInfoStore((state) => state.personnelInfo);
  const doorOpenStatue = getData("dist").value;
  const doorIdx = doorOpenStatue <= 101 ? 2 : doorOpenStatue <= 120 ? 0 : doorOpenStatue <= 130 ? 1 : 2;

  const { isSeatEdit, setSelectedSeat } = useSeatStore(
    useShallow((state) => ({
      isSeatEdit: state.isSeatEdit,
      setSelectedSeat: state.setSelectedSeat,
    }))
  );

  const { setPersonnelInfo, clearPersonnelInfo } = usePersonnelInfoStore(
    useShallow((state) => ({
      setPersonnelInfo: state.setPersonnelInfo,
      clearPersonnelInfo: state.clearPersonnelInfo,
    }))
  );

  const { cameraPosition, cameraTarget, draggedItem, isDragging, setSeatRefs, setIsMoving } = useThreeStore();

  /** Draco setting */
  const loader = new GLTFLoader();
  const dracoLoaderRef = useRef(null);
  dracoLoaderRef.current = new DRACOLoader();
  dracoLoaderRef.current.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
  loader.setDRACOLoader(dracoLoaderRef.current);
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
  // CSS3D
  const setupCss3dRenderer = () => {
    css3dRendererRef.current = new CSS3DRenderer();
    css3dRendererRef.current.setSize(mainRef.current.offsetWidth, mainRef.current.offsetHeight);
    css3dRendererRef.current.domElement.style.position = "absolute";
    css3dRendererRef.current.domElement.style.top = 0;
    css3dRendererRef.current.domElement.style.left = 0;
    canvasRef.current.before(css3dRendererRef.current.domElement);
  };
  // CAMERA MOVE
  const moveCamera = (pos, tar) => {
    if (gsap.isTweening(cameraRef.current.position)) {
      gsap.killTweensOf(cameraRef.current.position);
    }
    if (gsap.isTweening(controlsRef.current.target)) {
      gsap.killTweensOf(controlsRef.current.target);
    }
    setIsMoving(true);
    setIsUserButtonDisabled(true);

    const newPos = pos.clone();
    const newTar = tar.clone();

    gsap.to(cameraRef.current.position, {
      duration: 2.5,
      x: newPos.x,
      y: newPos.y,
      z: newPos.z,
      ease: "power4.out",
      onStart: () => {
        controlsRef.current.enabled = false;
      },
      onComplete: () => {
        controlsRef.current.enabled = true;
        setIsMoving(false);
        setIsUserButtonDisabled(false);
      },
    });

    gsap.to(controlsRef.current.target, {
      duration: 2.5,
      x: newTar.x,
      y: newTar.y,
      z: newTar.z,
      ease: "power4.out",
    });
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
    setupCss3dRenderer();

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

      if (css3dRendererRef.current) {
        css3dRendererRef.current.setSize(mainRef.current.offsetWidth, mainRef.current.offsetHeight);
      }
    }
    // 부모영역과 캔버 영역 비교 후 Resize 실행
    if (mainRef.current && canvasRef.current) {
      if (
        mainRef.current.offsetWidth !== canvasRef.current.offsetWidth ||
        mainRef.current.offsetHeight !== canvasRef.current.offsetHeight
      )
        onWindowResize();
    }
    // css3dObject resize
    if (css3dObjectRef.current && css3dObjectRef.current.mesh) {
      if (conditionRef.current.offsetWidth !== css3dObjectRef.current.mesh.scale.x) {
        css3dObjectRef.current.mesh.scale.x = conditionRef.current.offsetWidth;
      }
      if (conditionRef.current.offsetHeight !== css3dObjectRef.current.mesh.scale.y) {
        css3dObjectRef.current.mesh.scale.y = conditionRef.current.offsetHeight;
      }
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

  /** 오피스 모델 */
  const loadModel = () => {
    loader.setDRACOLoader(dracoLoaderRef.current);

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

          if (node.name.includes("ConditionPanel")) {
            conditionPanelRef.current = node;
          }

          if (node.name.includes("seat-")) {
            seatList.push(node.name);
            seatRef.current[node.name] = {
              ...seatRef.current[node.name],
              obj: node,
            };
          }

          if (node.name === "doorGreen1") {
            doorRef.current = node;
            node.position.set(node.position.x, node.position.y, node.position.z);
          }
          if (node.name === "floor" || node.name.includes("Floor")) {
            floorObjectRef.current = node;
          }
        });
        setSeatData(seatList);
        sceneRef.current.add(gltf.scene);
        setIsLoaded(true);
        setLoadingProgress(100);
      },
      (xhr) => {
        setLoadingProgress((xhr.loaded / xhr.total) * 100);
      },
      (error) => {
        console.error("An error happened during loading:", error);
      }
    );
  };

  /** 로그인 사용자 위치 아바타 모델 */
  const avatarModel = (obj) => {
    if (!obj) return;
    // 기존 아바타가 있다면 제거
    if (seatRef.current.userAvatar) {
      sceneRef.current.remove(seatRef.current.userAvatar);
      seatRef.current.userAvatar = null;
    }
    loader.setDRACOLoader(dracoLoaderRef.current);

    loader.load(
      userGlb,
      (gltf) => {
        const avatar = gltf.scene;
        avatar.scale.set(1.6, 1.6, 1.6);
        avatar.position.set(obj.position.x, USER_LABEL_POSITION_Y, obj.position.z);
        avatar.rotation.y = Math.PI;

        avatar.name = "userAvatar";
        avatar.traverse((node) => {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });

        sceneRef.current.add(avatar);
        seatRef.current.userAvatar = avatar;
      },
      undefined,
      (error) => {
        console.error("An error happened while loading the avatar:", error);
      }
    );
  };
  /** 라벨 생성 */
  const createLabel = ({ name, ou_nm, profile, userStatus }) => {
    if (!labelRef.current) return;

    // 아이콘을 위한 div 생성
    const iconDiv = document.createElement("div");
    iconDiv.className = "icon-container";
    iconDiv.style.width = "60px";
    iconDiv.style.height = "60px";
    iconDiv.style.display = "flex";
    iconDiv.style.alignItems = "center";
    iconDiv.style.justifyContent = "center";

    const profileImg = document.createElement("img");
    profileImg.src = profile;
    profileImg.style.width = "100%";
    profileImg.style.height = "100%";
    profileImg.style.borderRadius = "50%";
    profileImg.style.objectFit = "cover";
    profileImg.draggable = false;
    profileImg.alt = "profile";
    profileImg.style.background = "rgba(255, 255, 255, 0.6)";
    iconDiv.appendChild(profileImg);

    // 이름을 위한 div 생성
    const nameDiv = document.createElement("div");
    nameDiv.className = "name-container";
    nameDiv.style.position = "absolute";
    nameDiv.style.top = "100%";
    nameDiv.style.left = "50%";
    nameDiv.style.transform = "translateX(-50%)";
    nameDiv.style.padding = "4px";
    nameDiv.style.background = "rgba(255, 255, 255, 0.75)";
    nameDiv.style.backdropFilter = "blur(4px)";
    nameDiv.style.borderRadius = "4px";
    nameDiv.style.whiteSpace = "nowrap";
    nameDiv.style.fontSize = "12px";
    nameDiv.style.color = "black";
    nameDiv.innerHTML = ou_nm;

    // 컨테이너 div 생성
    const containerDiv = document.createElement("div");
    containerDiv.appendChild(iconDiv);
    containerDiv.appendChild(nameDiv);

    containerDiv.addEventListener("click", () => {
      const isEmpty = !userList.find((user) => user.ou_seat_cd === name);
      handleLabelClick(name, isEmpty);
    });

    const validStatus = ["미정", "미출근", "출근", "퇴근"].includes(userStatus) ? userStatus : "미출근";
    const color =
      validStatus === "미정"
        ? "#919191"
        : validStatus === "미출근"
        ? "#919191"
        : validStatus === "출근"
        ? "#1b57da"
        : "#D64646";

    iconDiv.style.borderColor = color;
    iconDiv.style.borderStyle = "solid";
    iconDiv.style.borderWidth = "3.5px";
    iconDiv.style.borderRadius = "50%";

    const label = new CSS2DObject(containerDiv);
    label.position.set(0, 0.3, 0.08);
    label.visible = validStatus !== "미정";
    label.element.style.cursor = "pointer";

    seatRef.current[name].obj.add(label);
    seatRef.current[name] = {
      ...seatRef.current[name],
      label,
      isEmpty: validStatus === "미정",
      userStatus: validStatus,
    };
  };
  /** 사용자 이미지 아이콘 */
  const drawUserIcon = () => {
    if (!Array.isArray(userList) || !Array.isArray(dailyList)) return;

    Object.keys(seatRef.current).forEach((key) => {
      const sit = seatRef.current[key];
      if (!sit || !sit.obj) return;

      if (sit.label) {
        sit.obj.remove(sit.label);
        sit.label = null;
      }

      const user = userList.find((item) => item?.ou_seat_cd === key);
      const userWithParsedInfo = user
        ? {
            ...user,
            ou_insa_info: user.ou_insa_info ? JSON.parse(user.ou_insa_info) : {},
          }
        : null;

      if (userWithParsedInfo) {
        const daily = dailyList.find((item) => item?.ouds_sabeon === userWithParsedInfo.ou_sabeon);
        const userStatus = daily?.userStatus || "미출근";

        // 새로운 라벨 생성
        createLabel({
          name: key,
          ou_nm: userWithParsedInfo.ou_nm,
          profile: userWithParsedInfo.ou_insa_info?.profile_img || defaultProfile,
          userStatus,
        });
      } else {
        // 빈 자리 라벨 생성
        createLabel({
          name: key,
          ou_nm: sit.obj.name,
          profile: defaultProfile,
          userStatus: "미정",
        });
      }
    });
  };
  /** 사용자 이미지 클릭 이벤트 */
  const handleLabelClick = (seatName, isEmptySeat) => {
    // 해당 좌석 오브젝트의 위치 가져오기
    const seatObj = seatRef.current[seatName]?.obj;

    if (seatObj && !isTopView) {
      const targetPos = seatObj.position.clone();
      const cameraPos = targetPos.clone().add(new THREE.Vector3(4, 4, 4));
      moveCamera(cameraPos, targetPos);
    }
    if (isEmptySeat) {
      setSelectedSeat(seatName);
    } else {
      const selectedUser = Array.isArray(userList) && userList.find((user) => user.ou_seat_cd === seatName);
      if (selectedUser) {
        const userWithParsedInfo = {
          ...selectedUser,
          ou_insa_info: selectedUser.ou_insa_info ? JSON.parse(selectedUser.ou_insa_info) : {},
        };
        setPersonnelInfo(userWithParsedInfo);
      }
    }
  };
  /** 온습도 생성 */
  const createCss3DObject = () => {
    const obj = new THREE.Object3D();

    conditionRef.current.style.opacity = 0.999;
    const css3dObject = new CSS3DObject(conditionRef.current);
    obj.css3dObject = css3dObject;
    obj.add(css3dObject);

    const mat = new THREE.MeshPhongMaterial({
      opacity: 0.1,
      color: new THREE.Color("#000"),
      blending: THREE.NoBlending,
      transparent: true,
    });

    const geom = new THREE.BoxGeometry(1, 1, 1);
    const mesh = new THREE.Mesh(geom, mat);
    mesh.scale.set(conditionRef.current.offsetWidth, conditionRef.current.offsetHeight, 1);
    obj.add(mesh);

    obj.position.copy(conditionPanelRef.current.position);
    obj.rotation.copy(conditionPanelRef.current.rotation);
    obj.scale.set(0.005, 0.005, 0.005);

    sceneRef.current.add(obj);
    css3dObjectRef.current = { obj, mesh };
  };
  /** 좌석 이동 이벤트 */
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
  /** 좌석 이동 후 업데이트 이벤트 */
  const updateSeat = () => {
    try {
      editSeat();
    } catch (error) {
      console.error("좌석 정보 업데이트 중 오류 발생:", error);
    }
  };
  /** 좌석 업데이트에 맞춰 3D 모델 이동 */
  const moveModel = (obj) => {
    if (!obj || !seatRef.current.userAvatar) return;
    seatRef.current.userAvatar.position.set(obj.position.x, USER_LABEL_POSITION_Y, obj.position.z);
  };
  /** 업데이트 된 좌석으로 카메라 위치 이동 */
  const moveToUserSeat = () => {
    if (isTopView || !isLoaded || !Array.isArray(userList) || !sabeon) return;

    const userSeat = userList.find((user) => user.ou_sabeon === sabeon)?.ou_seat_cd;

    // 이미 카메라가 이동 중이면 리턴
    if (useThreeStore.getState().isMoving) return;

    if (userSeat && seatRef.current[userSeat]?.obj) {
      const seatObj = seatRef.current[userSeat].obj;
      const targetPos = seatObj.position.clone();
      const cameraPos = targetPos.clone().add(new THREE.Vector3(4, 4, 4));
      moveCamera(cameraPos, targetPos);
    } else {
      moveCamera(DEFAULT_CAMERA_POSITION, DEFAULT_CAMERA_TARGET);
    }
  };
  /** ANIMATION */
  const animate = () => {
    if (controlsRef.current) {
      controlsRef.current.update();
    }
    // 아바타와 라벨 부유 애니메이션
    if (seatRef.current.userAvatar) {
      const time = Date.now() * FLOAT_SPEED;
      const newY = USER_LABEL_POSITION_Y + Math.sin(time) * FLOAT_HEIGHT;
      // 아바타 위치 업데이트
      seatRef.current.userAvatar.position.y = newY;
    }

    if (rendererRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      if (labelRendererRef.current) {
        labelRendererRef.current.render(sceneRef.current, cameraRef.current);
      }
      if (css3dRendererRef.current) {
        css3dRendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    }
    // 부모영역과 캔버 영역 비교 후 Resize 실행
    if (mainRef.current && canvasRef.current) {
      if (
        mainRef.current.offsetWidth !== canvasRef.current.offsetWidth ||
        mainRef.current.offsetHeight !== canvasRef.current.offsetHeight
      )
        onWindowResize();
    }
    // css3dObject resize
    if (css3dObjectRef.current && css3dObjectRef.current.mesh) {
      if (conditionRef.current.offsetWidth !== css3dObjectRef.current.mesh.scale.x) {
        css3dObjectRef.current.mesh.scale.x = conditionRef.current.offsetWidth;
      }
      if (conditionRef.current.offsetHeight !== css3dObjectRef.current.mesh.scale.y) {
        css3dObjectRef.current.mesh.scale.y = conditionRef.current.offsetHeight;
      }
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

  useEffect(() => {
    const updateUserAvatar = (seatObj) => {
      if (!seatRef.current.userAvatar) {
        avatarModel(seatObj);
      } else {
        moveModel(seatObj);
      }
    };

    const handleUserSeat = () => {
      if (isLoaded && Array.isArray(userList) && sabeon) {
        const userSeat = userList.find((user) => user.ou_sabeon === sabeon)?.ou_seat_cd;

        if (userSeat && seatRef.current[userSeat]?.obj) {
          const seatObj = seatRef.current[userSeat].obj;
          updateUserAvatar(seatObj);
          const targetPos = seatObj.position.clone();
          const cameraPos = targetPos.clone().add(new THREE.Vector3(4, 4, 4));
          moveCamera(cameraPos, targetPos);
        } else {
          moveCamera(DEFAULT_CAMERA_POSITION, DEFAULT_CAMERA_TARGET);
        }
      }
    };

    handleUserSeat();
  }, [isLoaded, userList, sabeon]);

  useEffect(() => {
    const updateLabelStyle = (sit, isTop) => {
      if (!sit.label) return;

      const iconContainer = sit.label.element.querySelector(".icon-container");
      const nameContainer = sit.label.element.querySelector(".name-container");

      sit.label.position.set(0, isTop ? 0 : 0.3, isTop ? 0.4 : 0.08);

      if (iconContainer) {
        iconContainer.style.display = isTop ? "none" : "block";
      }

      if (nameContainer) {
        if (isTop) {
          const validStatus = sit.userStatus || "미출근";
          const color =
            validStatus === "미정"
              ? "#919191"
              : validStatus === "미출근"
              ? "#919191"
              : validStatus === "출근"
              ? "#1b57da"
              : "#D64646";

          Object.assign(nameContainer.style, {
            borderRadius: "4px",
            display: "block",
            backgroundColor: color,
            color: "#fff",
          });
        } else {
          Object.assign(nameContainer.style, {
            border: "none",
            background: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(4px)",
            color: "#000",
          });
        }
      }
    };

    const updateAllLabels = () => {
      Object.values(seatRef.current).forEach((sit) => updateLabelStyle(sit, isTopView));
    };

    if (isTopView) {
      moveCamera(TOP_POSITION, TOP_TARGET);
    } else {
      moveToUserSeat();
    }

    updateAllLabels();
  }, [isTopView]);

  useEffect(() => {
    updateSeat();
  }, [isWorking, isDaily, isSeatEdit]);

  useEffect(() => {
    if (!selectedSeat) return;

    Object.entries(seatRef.current).forEach(([key, item]) => {
      if (item?.label?.element && item.isEmpty) {
        const iconContainer = item.label.element.querySelector(".icon-container");
        const nameContainer = item.label.element.querySelector(".name-container");
        const isSelected = key === selectedSeat;

        if (isTopView) {
          if (iconContainer) iconContainer.style.borderColor = isSelected ? "#13e513" : "#919191";
          if (nameContainer) {
            nameContainer.style.backgroundColor = isSelected ? "#13e513" : "#919191";
            nameContainer.style.color = "#000";
          }
        } else {
          if (iconContainer) iconContainer.style.borderColor = isSelected ? "#13e513" : "#919191";
          if (nameContainer) {
            nameContainer.style.backgroundColor = "rgba(255, 255, 255, 0.75)";
            nameContainer.style.color = "#000";
          }
        }
      }
    });
  }, [selectedSeat, isTopView]);

  useEffect(() => {
    if (isLoaded) drawUserIcon();
  }, [userList, dailyList, isLoaded]);

  useEffect(() => {
    if (mainRef.current) {
      createScene();
      loadModel();
    }
    return () =>
      clearScene(sceneRef.current, controlsRef.current, rendererRef.current, animRef.current, selectRef.current);
  }, [mainRef]);

  useEffect(() => {
    if (conditionRef.current && conditionPanelRef.current && isLoaded) {
      createCss3DObject();
    }
  }, [conditionRef, conditionPanelRef, isLoaded]);

  useEffect(() => {
    if (css3dObjectRef.current?.obj) {
      css3dObjectRef.current.obj.visible = isCondition;
      if (isCondition) {
        const target = conditionPanelRef.current.position.clone();
        const position = new THREE.Vector3(target.x + 5, target.y + 5, target.z + 5);
        moveCamera(position, target);
      } else {
        moveToUserSeat();
      }
    }
  }, [isCondition]);

  useEffect(() => {
    setSeatRefs(seatRef.current);
  }, [seatRef.current, setSeatRefs]);

  useEffect(() => {
    if (cameraPosition && cameraTarget && cameraRef.current) {
      moveCamera(cameraPosition, cameraTarget);
    }
  }, [cameraPosition, cameraTarget]);

  // 모델의 크기를 계산하는 함수
  const getModelSize = (model) => {
    if (!model) return { width: 0.3, height: 0.3 }; // 기본 크기 반환

    const box = new THREE.Box3();
    box.setFromObject(model);
    const size = new THREE.Vector3();
    box.getSize(size);

    return {
      width: size.x || 0.3,
      height: size.z || 0.3, // PlaneGeometry는 xz 평면에 생성
    };
  };

  const createDropIndicator = (model) => {
    const { width, height } = getModelSize(model);
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({
      color: 0x1366a2,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2;
    plane.visible = false;
    return plane;
  };

  useEffect(() => {
    if (!draggedItem || !modelMap[draggedItem]) return;

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoaderRef.current);

    loader.load(modelMap[draggedItem], (gltf) => {
      const plane = createDropIndicator(gltf.scene);
      sceneRef.current.add(plane);
      dropIndicatorRef.current = plane;
    });

    return () => {
      if (dropIndicatorRef.current) {
        dropIndicatorRef.current.geometry.dispose();
        dropIndicatorRef.current.material.dispose();
        sceneRef.current.remove(dropIndicatorRef.current);
      }
    };
  }, [draggedItem]);

  /** Door 애니메이션 */
  const animateDoor = (doorIdx) => {
    if (!doorRef.current || prevDoorIdxRef.current === doorIdx) return;

    prevDoorIdxRef.current = doorIdx;

    const targetRotation = new THREE.Vector3(0, 0, 0);

    if (doorIdx === 0) {
      targetRotation.y = Math.PI / 2; // 90도 안쪽으로
    } else if (doorIdx === 1) {
      targetRotation.y = -Math.PI / 2; // 90도 바깥쪽으로
    }

    gsap.to(doorRef.current.rotation, {
      duration: 2.5,
      x: targetRotation.x,
      y: targetRotation.y,
      z: targetRotation.z,
      ease: "power4.out",
    });
  };
  // doorIdx 변화 감지를 위한 useEffect 수정
  useEffect(() => {
    animateDoor(doorIdx);
  }, [doorIdx]);
  // personnelInfo가 null이 될 때(카드가 닫힐 때) 원래 자리로 이동
  useEffect(() => {
    if (!personnelInfo && !isTopView) {
      moveToUserSeat();
    }
  }, [personnelInfo, isTopView]);

  /** Button 클릭 최적화 */
  const throttledSetIsTopView = useThrottle(() => setIsTopView(true), 500);
  const throttledSetIsCondition = useThrottle(() => setIsCondition((prev) => !prev), 500);
  const throttledSetIsDaily = useThrottle(() => setIsDaily((prev) => !prev), 500);
  const throttledSetIsUser = useThrottle(() => setIsTopView(false), 500);

  /** Tree Widget 모델 Drag and Drop */
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedModelRoot, setSelectedModelRoot] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isDragging || attachedModels.length >= 3) return;

    const rect = mainRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), cameraRef.current);

    const intersects = raycaster.intersectObjects(sceneRef.current.children, true);
    const floorIntersect = intersects.find(
      (intersect) => intersect.object.name.includes("floor") || intersect.object.parent.name.includes("floor")
    );

    if (floorIntersect && dropIndicatorRef.current) {
      const point = floorIntersect.point;
      dropIndicatorRef.current.position.set(point.x, point.y + 0.01, point.z);
      dropIndicatorRef.current.visible = true;
      // 현재 인디케이터 위치를 저장
      setDropPosition(dropIndicatorRef.current.position.clone());
    }
  };
  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isDragging) {
      setIsMoving(false);
      hideDropIndicator();
      return;
    }

    const rect = mainRef.current.getBoundingClientRect();
    const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), cameraRef.current);

    const intersects = raycaster.intersectObjects(sceneRef.current.children, true);
    const floorIntersect = intersects.find(
      (intersect) => intersect.object.name.includes("floor") || intersect.object.parent.name.includes("floor")
    );

    if (floorIntersect && dropIndicatorRef.current) {
      const point = floorIntersect.point;
      dropIndicatorRef.current.position.set(point.x, point.y + 0.01, point.z);
      // 현재 인디케이터 위치를 저장
      setDropPosition(dropIndicatorRef.current.position.clone());
      setShowSaveModal(true);
    }
  };
  // 드롭 인디케이터를 숨기는 함수
  const hideDropIndicator = () => {
    if (dropIndicatorRef.current) {
      dropIndicatorRef.current.visible = false;
    }
  };
  // 모달이 취소될 때 처리
  const handleModalCancel = () => {
    setShowSaveModal(false);
    setDropPosition(null);
    hideDropIndicator();
    setIsMoving(false);
  };
  // 모달 attach 저장
  const handleSaveConfirm = async () => {
    if (!dropPosition || !draggedItem) return;

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoaderRef.current);

    try {
      const modelFile = modelMap[draggedItem];
      if (!modelFile) {
        console.error("Model not found:", draggedItem);
        return;
      }

      const gltf = await loader.loadAsync(modelFile);
      const model = gltf.scene;

      // children들의 position x, z를 0으로 설정
      model.children.forEach((child) => {
        child.position.x = 0;
        child.position.z = 0;
      });

      // dropPosition에는 이미 초록색 평면의 마지막 위치가 저장되어 있음
      model.position.copy(dropPosition);

      const scale = 1;
      model.scale.set(scale, scale, scale);

      sceneRef.current.add(model);
      setAttachedModels([...attachedModels, { model, position: model.position.clone() }]);
    } catch (error) {
      console.error("Error loading model:", error);
    }

    hideDropIndicator();
    setShowSaveModal(false);
    setDropPosition(null);
    setIsMoving(false);
  };

  const handleModelClick = (event) => {
    event.preventDefault();
    const rect = mainRef.current.getBoundingClientRect();
    const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), cameraRef.current);

    const widgetModels = attachedModels.filter((model) => {
      return widgetList.some((widget) => model.model?.children[0].name.includes(widget.name));
    });

    const intersects = raycaster.intersectObjects(
      widgetModels.map((item) => item.model),
      true
    );

    if (intersects.length > 0) {
      const selectedObject = intersects[0].object;
      let modelRoot = selectedObject;

      while (modelRoot.parent && modelRoot.parent !== sceneRef.current) {
        modelRoot = modelRoot.parent;
      }

      setSelectedModelRoot(modelRoot);
      setShowDeleteModal(true);
    }
  };

  const handleDeleteConfirm = () => {
    if (!selectedModelRoot) return;

    // 리소스 정리
    selectedModelRoot.traverse((child) => {
      if (child.isMesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach((material) => material.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
    // 씬에서 제거
    selectedModelRoot.removeFromParent();
    // attachedModels 배열에서 제거
    setAttachedModels((prev) => prev.filter((model) => model.model !== selectedModelRoot));
    // 모달 닫기 및 상태 초기화
    setShowDeleteModal(false);
    setSelectedModelRoot(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setSelectedModelRoot(null);
  };

  useEffect(() => {
    if (!mainRef.current) return;

    const element = mainRef.current;
    element.addEventListener("click", handleModelClick);

    return () => {
      element.removeEventListener("click", handleModelClick);
    };
  }, [attachedModels]);

  // 드래그 앤 드롭 이벤트 리스너 설정
  useEffect(() => {
    if (!mainRef.current) return;

    const element = mainRef.current;
    element.addEventListener("dragover", handleDragOver);
    element.addEventListener("drop", handleDrop);

    return () => {
      element.removeEventListener("dragover", handleDragOver);
      element.removeEventListener("drop", handleDrop);
    };
  }, [isDragging, attachedModels]);

  return (
    <main ref={mainRef} className="z-0 bg-[#292929] overflow-hidden w-dvw h-dvh">
      <canvas className="absolute top-0 left-0 w-full h-full" ref={canvasRef} />
      {showDeleteModal && (
        <div
          className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
            isDark ? "bg-[#1f1f1f]/80 text-white" : "bg-white/80"
          } backdrop-blur-sm p-4 rounded-lg shadow-lg z-50`}
        >
          <p className={`text-center ${isDark ? "text-white" : "text-black"}`}>위젯을 삭제하시겠습니까?</p>
          <div className="flex justify-between items-center w-full mt-4 gap-2">
            <button className="flex-1 py-1 bg-red-500 text-white rounded mr-2" onClick={handleDeleteConfirm}>
              삭제
            </button>
            <button className="flex-1 py-1 bg-gray-400 text-white rounded" onClick={handleDeleteCancel}>
              취소
            </button>
          </div>
        </div>
      )}
      {showSaveModal && (
        <div
          className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
          ${isDark ? "bg-[#1f1f1f]/80 text-white" : "bg-white/80"} backdrop-blur-sm p-4 rounded-lg shadow-lg z-50`}
        >
          <p className={`text-center  ${isDark ? "text-white" : "text-black"}`}>해당 위치에 저장하겠습니까?</p>
          <div className="flex justify-between items-center w-full mt-4 gap-2">
            <button className="flex-1 py-1 bg-sbtDarkBlue text-white rounded mr-2" onClick={handleSaveConfirm}>
              저장
            </button>
            <button className="flex-1 py-1 bg-gray-400 text-white rounded" onClick={handleModalCancel}>
              취소
            </button>
          </div>
        </div>
      )}
      {!isLoaded ? (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <BarLoader color="#316ff6" width={200} />
          <div className="text-white text-center mt-4">
            Sbt Global Office <b>{Math.round(loadingProgress)}</b>%
          </div>
        </div>
      ) : (
        <>
          <div className="absolute bottom-4 right-4 flex gap-2 flex-col text-sm text-white">
            <button
              className={`px-2 py-2 rounded-lg backdrop-blur-sm ${
                isDaily ? "bg-comBlue/70" : "bg-comBlue/30 text-white/50"
              } ${isUserButtonDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-comBlue/70"}`}
              onClick={throttledSetIsDaily}
              disabled={isUserButtonDisabled}
            >
              출퇴근 현황
            </button>
            <button
              className={`px-2 py-2 rounded-lg backdrop-blur-sm ${
                isCondition ? "bg-comBlue/70" : "bg-comBlue/30 text-white/50"
              } ${isUserButtonDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-comBlue/70"}`}
              onClick={throttledSetIsCondition}
              disabled={isUserButtonDisabled}
            >
              Green_1 상태
            </button>
            <div className="w-full flex justify-between items-center gap-1">
              <button
                className={`flex-1 text-center rounded-lg py-2 backdrop-blur-sm ${
                  isTopView ? "bg-comBlue/70" : "bg-comBlue/30 text-white/50"
                } ${isUserButtonDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-comBlue/70"}`}
                onClick={throttledSetIsTopView}
                disabled={isUserButtonDisabled}
              >
                TOP
              </button>
              <button
                className={`flex-1 text-center rounded-lg py-2 backdrop-blur-sm ${
                  !isTopView ? "bg-comBlue/70" : "bg-comBlue/30 text-white/50"
                } ${isUserButtonDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-comBlue/70"}`}
                onClick={throttledSetIsUser}
                disabled={isUserButtonDisabled}
              >
                USER
              </button>
            </div>
          </div>

          <RoomCondition conditionRef={conditionRef} closeEvent={() => setIsCondition(false)} />
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
