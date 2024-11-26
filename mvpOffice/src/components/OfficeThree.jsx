/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";

// 3D IMPORT
import * as THREE from "three";
import { Easing, Tween } from "@tweenjs/tween.js";
import {
  CSS2DObject,
  CSS2DRenderer,
  CSS3DObject,
  CSS3DRenderer,
  DRACOLoader,
  GLTFLoader,
  OrbitControls,
  RGBELoader,
} from "three/examples/jsm/Addons.js";

// 3D MODEL
import hdr from "@/assets/three.hdr";
import model from "@/assets/model/office.glb";
import userGlb from "@/assets/model/user.glb";

import { userIcon } from "@/utils/icon";

import { clearScene } from "@/utils/three/SceneCleanUp";
import { getDailyListFetch } from "@/utils/api";
import { useAllUserListQuery } from "@/hooks/useAllUserListQuery";
import PersonnelInfoCard from "./PersonnelInfoCard";
import useWorkStatusStore from "@/store/useWorkStatusStore";
import RoomCondition from "./RoomCondition";
/** STORE */
import seatListStore from "@/store/seatListStore";
import useSeatStore from "@/store/seatStore";
import usePersonnelInfoStore from "@/store/personnelInfoStore";
import { usePopupStore } from "@/store/usePopupStore";
import useAdminStore from "@/store/adminStore";
import { useShallow } from "zustand/react/shallow";
import { useThreeStore } from "@/store/threeStore";

import { BarLoader } from "react-spinners";

const FLOAT_SPEED = 0.005;
const FLOAT_HEIGHT = 0.08;

const OfficeThree = () => {
  const { data: userList } = useAllUserListQuery();

  const mainRef = useRef(null);
  const labelRendererRef = useRef(null);
  const conditionRef = useRef(null);
  const css3dRendererRef = useRef(null);
  const conditionPannelRef = useRef(null);
  const css3dObjectRef = useRef({});
  const tweenRef = useRef([]);
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

  const [dailyList, setDailyList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCondition, setIsCondition] = useState(true);
  const [isDaily, setIsDaily] = useState(true);
  const [selectSeatName, setSelectSeatName] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  /**
   * Store
   */
  const setSeatData = seatListStore((state) => state.setSeatData);
  const isPopupOpen = usePopupStore((state) => state.isPopupOpen);
  const isWorking = useWorkStatusStore((state) => state.isWorking);
  const sabeon = useAdminStore((state) => state.sabeon);

  const selectedSeat = useSeatStore((state) => state.selectedSeat);
  const personnelInfo = usePersonnelInfoStore((state) => state.personnelInfo);

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

  const { cameraPosition, cameraTarget, setSeatRefs, setIsMoving } = useThreeStore();

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

  const setupCss3dRenderer = () => {
    css3dRendererRef.current = new CSS3DRenderer();
    css3dRendererRef.current.setSize(mainRef.current.offsetWidth, mainRef.current.offsetHeight);
    css3dRendererRef.current.domElement.style.position = "absolute";
    css3dRendererRef.current.domElement.style.top = 0;
    css3dRendererRef.current.domElement.style.left = 0;
    canvasRef.current.before(css3dRendererRef.current.domElement);
  };

  const moveCamera = (pos, tar) => {
    setIsMoving(true);

    const newPos = pos.clone();
    const newTar = tar.clone();
    const t1 = new Tween(cameraRef.current.position);
    t1.to(newPos, 1500);
    t1.easing(Easing.Quadratic.InOut);
    t1.onStart(() => (controlsRef.current.enabled = false));
    t1.onComplete(() => {
      controlsRef.current.enabled = true;
      tweenRef.current = [];
      setIsMoving(false);
    });
    t1.start();
    const t2 = new Tween(controlsRef.current.target).to(newTar, 1500);
    t2.easing(Easing.Quadratic.InOut);
    t2.start();

    tweenRef.current.push(...[t1, t2]);
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

          if (node.name.includes("ConditionPannel")) {
            conditionPannelRef.current = node;
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

  // ANIMATION
  const animate = () => {
    if (controlsRef.current) {
      controlsRef.current.update();
    }

    // 아바타와 라벨 부유 애니메이션
    if (seatRef.current.userAvatar) {
      const time = Date.now() * FLOAT_SPEED;
      const newY = 1.8 + Math.sin(time) * FLOAT_HEIGHT;

      // 아바타 위치 업데이트
      seatRef.current.userAvatar.position.y = newY;
      seatRef.current.userAvatar.position.y = 2 + Math.sin(time) * FLOAT_HEIGHT;
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

    // 부모영역과 캔버스 영역 비교 후 Resize 실행
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

    if (tweenRef.current.length > 0) {
      tweenRef.current.map((tween) => tween.update());
    }
    animRef.current = requestAnimationFrame(animate);
  };

  const drawUserIcon = () => {
    if (!Array.isArray(userList) || !Array.isArray(dailyList)) return;

    Object.keys(seatRef.current).forEach((key) => {
      const sit = seatRef.current[key];
      if (!sit || !sit.obj) return;

      const user = userList.find((item) => item?.ou_seat_cd === key);

      if (user) {
        const daily = dailyList.find((item) => item?.ouds_sabeon === user.ou_sabeon);
        const userStatus = daily?.userStatus || "미출근";

        if (sit.label) {
          updateLabel(sit.obj, user.ou_nm, userStatus);
        } else {
          createLabel(sit.obj, user.ou_nm, userStatus);
        }
      } else {
        if (sit.label) {
          updateLabel(sit.obj, sit.obj.name, "미정");
        } else {
          createLabel(sit.obj, sit.obj.name, "미정");
        }
      }
    });
  };

  // 기본 카메라 위치 상수 추가
  const DEFAULT_CAMERA_POSITION = new THREE.Vector3(-3.684, 13.704, -19.717);
  const DEFAULT_CAMERA_TARGET = new THREE.Vector3(-3.84, 1.063, -7.064);

  useEffect(() => {
    if (isLoaded && Array.isArray(userList) && sabeon) {
      const userSeat = userList.find((user) => user.ou_sabeon === sabeon)?.ou_seat_cd;
      if (userSeat && seatRef.current[userSeat]?.obj) {
        const seatObj = seatRef.current[userSeat].obj;

        // 아바타가 없거나 위치가 변경된 경우에만 처리
        if (!seatRef.current.userAvatar) {
          addModel(seatObj);
        } else {
          moveModel(seatObj);
        }

        // 카메라 이동
        const targetPos = seatObj.position.clone();
        const cameraPos = targetPos.clone().add(new THREE.Vector3(6, 6, 6));
        moveCamera(cameraPos, targetPos);
      } else {
        // 자리가 없는 경우 기본 위치로 이동
        moveCamera(DEFAULT_CAMERA_POSITION, DEFAULT_CAMERA_TARGET);
      }
    }
  }, [isLoaded, userList, sabeon]);

  const handleLabelClick = (seatName, isEmptySeat) => {
    // 해당 좌석 오브젝트의 위치 가져오기
    const seatObj = seatRef.current[seatName]?.obj;
    if (seatObj) {
      const targetPos = seatObj.position.clone();
      const cameraPos = targetPos.clone().add(new THREE.Vector3(6, 6, 6));

      // 카메라 이동 애니메이션 실행
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

    obj.position.copy(conditionPannelRef.current.position);
    obj.rotation.copy(conditionPannelRef.current.rotation);
    obj.scale.set(0.005, 0.005, 0.005);

    sceneRef.current.add(obj);
    css3dObjectRef.current = { obj, mesh };
  };

  const createLabel = (obj, name, daily = "미출근") => {
    if (!labelRef.current) return;
    const div = labelRef.current.cloneNode(true);
    div.style.display = "";
    div.style.width = "40px";
    div.style.height = "40px";
    div.style.fontSize = "0.75rem";
    div.addEventListener("click", () => {
      setSelectSeatName(obj.name === selectSeatName ? null : obj.name);
    });

    // daily 값이 유효한지 확인
    const validStatus = ["미정", "미출근", "출근", "퇴근"].includes(daily) ? daily : "미출근";
    const color =
      validStatus === "미정" ? "#aaa" : validStatus === "미출근" ? "#f00" : validStatus === "출근" ? "#0f0" : "#00f";

    div.style.color = color;
    div.style.borderColor = color;

    if (name && div.children[1]) div.children[1].innerHTML = name;

    const label = new CSS2DObject(div);
    label.position.set(0, 0.8, 0);
    label.visible = validStatus !== "미정";
    obj.add(label);

    seatRef.current[obj.name] = {
      ...seatRef.current[obj.name],
      label,
      isEmpty: validStatus === "미정",
    };
  };

  const updateLabel = (obj, name, daily = "미출근") => {
    const elem = seatRef.current[obj.name]?.label?.element;

    if (elem) {
      if (name && elem.children[1]) elem.children[1].innerHTML = name;

      // daily 값이 유효한지 확인
      const validStatus = ["미정", "미출근", "출근", "퇴근"].includes(daily) ? daily : "미출근";
      const color =
        validStatus === "미정" ? "#aaa" : validStatus === "미출근" ? "#f00" : validStatus === "출근" ? "#0f0" : "#00f";

      elem.style.color = color;
      elem.style.borderColor = color;
    }

    seatRef.current[obj.name] = {
      ...seatRef.current[obj.name],
      isEmpty: daily === "미정",
    };
  };

  const getDailyList = async () => {
    try {
      const res = await getDailyListFetch();
      if (res) setDailyList(res);
    } catch (error) {
      console.error("일일 출근 현황을 가져오는데 실패했습니다:", error);
      setDailyList([]);
    }
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
    try {
      if (isDaily || !isSeatEdit) {
        await getDailyList();
      }
      editSeat();
    } catch (error) {
      console.error("좌석 정보 업데이트 중 오류 발생:", error);
    }
  };

  const moveModel = (obj) => {
    if (!obj || !seatRef.current.userAvatar) return;
    seatRef.current.userAvatar.position.set(obj.position.x, 1.8, obj.position.z);
  };

  const addModel = (obj) => {
    if (!obj) return;

    // 기존 아바타가 있다면 제거
    if (seatRef.current.userAvatar) {
      sceneRef.current.remove(seatRef.current.userAvatar);
      seatRef.current.userAvatar = null;
    }

    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      userGlb,
      (gltf) => {
        const avatar = gltf.scene;
        avatar.scale.set(0.15, 0.15, 0.15);
        avatar.position.set(obj.position.x, 1.8, obj.position.z);
        avatar.rotation.y = Math.PI / 2;

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

  // 데이터 변경시 새로고침
  useEffect(() => {
    updateSeat();
  }, [isWorking, isDaily, isSeatEdit]);

  // 좌석변경 - 빈 좌석 선택시 하이라이트
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
    if (!personnelInfo) setSelectSeatName(null);
  }, [personnelInfo]);

  useEffect(() => {
    if (selectSeatName) {
      const isEmpty = !userList.find((user) => user.ou_seat_cd === selectSeatName);
      handleLabelClick(selectSeatName, isEmpty);
    }
  }, [selectSeatName]);

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

  useEffect(() => {
    if (conditionRef.current && conditionPannelRef.current && isLoaded) {
      createCss3DObject();
    }
  }, [conditionRef, conditionPannelRef, isLoaded]);

  useEffect(() => {
    if (css3dObjectRef.current && css3dObjectRef.current.obj) {
      css3dObjectRef.current.obj.visible = isCondition;
      if (isCondition) {
        const target = conditionPannelRef.current.position.clone();
        const position = new THREE.Vector3(target.x + 5, target.y + 5, target.z + 5);
        moveCamera(position, target);
      }
    }
  }, [isCondition]);

  // moveToUserSeat 함수 수정
  const moveToUserSeat = () => {
    if (isLoaded && Array.isArray(userList) && sabeon) {
      const userSeat = userList.find((user) => user.ou_sabeon === sabeon)?.ou_seat_cd;
      if (userSeat && seatRef.current[userSeat]?.obj) {
        const seatObj = seatRef.current[userSeat].obj;
        const targetPos = seatObj.position.clone();
        const cameraPos = targetPos.clone().add(new THREE.Vector3(6, 6, 6));
        moveCamera(cameraPos, targetPos);
      } else {
        // 자리가 없는 경우 기본 위치로 이동
        moveCamera(DEFAULT_CAMERA_POSITION, DEFAULT_CAMERA_TARGET);
      }
    }
  };

  // personnelInfo가 null이 될 때(카드가 닫힐 때) 원래 자리로 이동
  useEffect(() => {
    if (!personnelInfo) {
      moveToUserSeat();
    }
  }, [personnelInfo]);

  // seatRef가 업데이트될 때마다 store에 저장
  useEffect(() => {
    setSeatRefs(seatRef.current);
  }, [seatRef.current, setSeatRefs]);

  // 카메라 위치가 변경될 때 이동
  useEffect(() => {
    if (cameraPosition && cameraTarget && cameraRef.current) {
      moveCamera(cameraPosition, cameraTarget);
    }
  }, [cameraPosition, cameraTarget]);

  return (
    <main ref={mainRef} className="z-0 bg-[#292929] overflow-hidden w-dvw h-dvh">
      <canvas className="absolute top-0 left-0 w-full h-full" ref={canvasRef} />
      {!isLoaded ? (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <BarLoader color="#36d7b7" width={200} />
          <div className="text-white text-center mt-4">Sbt Global Office - {Math.round(loadingProgress)}%</div>
        </div>
      ) : (
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
