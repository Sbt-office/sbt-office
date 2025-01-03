/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-loss-of-precision */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";

import * as THREE from "three";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment, Html } from "@react-three/drei";
import { gsap } from "gsap";

import model from "@/assets/model/officeStart.glb";
import logo from "@/assets/images/whiteLogo.png";
import { useOfficeStartAnimation, usePlayingVideo } from "../store/animate";
import { tvConfigs } from "../data/officeTvPlayingLists";

function Model({ onLoaded }) {
  const controlsRef = useRef();
  const [selectedTv, setSelectedTv] = useState(null);
  const [tvPositions, setTvPositions] = useState({});
  const cleanupRef = useRef(false);

  const { camera } = useThree();
  const { scene: modelScene } = useGLTF(model);

  const showVideo = usePlayingVideo((state) => state.playing);
  const setShowVideo = usePlayingVideo((state) => state.setPlaying);

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const moveCamera = () => {
    if (!selectedTv) return;
    const config = tvConfigs.find((tv) => tv.id === selectedTv);
    if (!config) return;

    gsap.to(camera.position, {
      duration: 1,
      x: config.cameraPosition.x,
      y: config.cameraPosition.y,
      z: config.cameraPosition.z,
      ease: "none",
    });

    if (controlsRef.current) {
      gsap.to(controlsRef.current.target, {
        duration: 1,
        x: config.targetPosition.x,
        y: config.targetPosition.y,
        z: config.targetPosition.z,
        ease: "none",
      });
    }
  };

  const handleVideoClick = (e, tvId) => {
    e.stopPropagation();
    setSelectedTv(tvId);
    setShowVideo(true);
  };

  useEffect(() => {
    if (selectedTv) {
      moveCamera();
    }
  }, [selectedTv]);

  useEffect(() => {
    if (modelScene) {
      const tvs = ["tv01", "tv02"];
      const positions = {};

      tvs.forEach((tvId) => {
        const tv = modelScene.getObjectByName(tvId);
        if (tv) {
          tv.userData.clickable = true;

          const tvType = tvConfigs.find((tv) => tv.id === tvId);

          tv.updateWorldMatrix(true, false);
          const worldPosition = new THREE.Vector3();
          const worldRotation = new THREE.Euler();
          const worldScale = new THREE.Vector3();
          tv.matrixWorld.decompose(worldPosition, new THREE.Quaternion(), worldScale);
          worldRotation.set(0, tvType?.rotateY, 0);

          positions[tvId] = {
            position: new THREE.Vector3(
              worldPosition.x + tvType.offsetX,
              worldPosition.y + tvType.offsetY,
              worldPosition.z + tvType.offsetZ
            ),
            rotation: worldRotation,
            scale: worldScale,
          };
        }
      });

      setTvPositions(positions);
      onLoaded();
    }
  }, [modelScene, onLoaded]);

  useEffect(() => {
    if (modelScene) {
      const logoObject = modelScene.getObjectByName("logo");

      if (logoObject) {
        const material = new THREE.ShaderMaterial({
          uniforms: {
            fillAmount: { value: 0.0 },
            fillColor: { value: new THREE.Color(0xffffff) },
          },
          vertexShader: `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform float fillAmount;
            uniform vec3 fillColor;
            varying vec2 vUv;
            
            void main() {
              float fill = step(vUv.x, fillAmount);
              vec4 color = vec4(fillColor, 1.0);
              vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);
              gl_FragColor = mix(transparent, color, fill);
            }
          `,
          transparent: true,
          side: THREE.DoubleSide,
        });

        logoObject.material = material;

        gsap.fromTo(
          material.uniforms.fillAmount,
          { value: 0 },
          {
            value: 1,
            duration: 3,
            delay: 1,
            ease: "sine.out",
            repeat: -1,
            repeatDelay: 4,
            yoyo: true,
          }
        );
      }
    }
  }, [modelScene]);

  const handleClick = (event) => {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(modelScene.children, true);
    const clickedTv = intersects.find(
      (intersect) => intersect.object.parent?.name === "tv01" || intersect.object.parent?.name === "tv02"
    );

    if (clickedTv) {
      const tvId = clickedTv.object.parent.name;
      setSelectedTv(tvId);
      setShowVideo(true);
      moveCamera();
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [camera, modelScene]);

  useEffect(() => {
    return () => {
      cleanupRef.current = true;
      setShowVideo(false);
    };
  }, [setShowVideo]);

  return (
    <>
      <OrbitControls ref={controlsRef} enableDamping={false} />
      <primitive object={modelScene} position={[0, -1, 0]} rotation={[0, 0, 0]} scale={1} />
      {Object.entries(tvPositions).map(([tvId, tvPosition]) => (
        <mesh
          key={tvId}
          position={tvPosition.position}
          rotation={tvPosition.rotation}
          scale={[1, 1, 1]}
          onClick={(e) => {
            e.stopPropagation();
            handleVideoClick(e, tvId);
          }}
        >
          <Html
            transform
            distanceFactor={1}
            occlude
            position={[0, 0, 0.1]}
            style={{
              width: tvConfigs.find((tv) => tv.id === tvId)?.dimensions.width,
              height: tvConfigs.find((tv) => tv.id === tvId)?.dimensions.height,
              pointerEvents: "auto",
              cursor: "pointer",
              backgroundColor: "#000",
              borderRadius: "10px",
            }}
            center
          >
            {!showVideo || selectedTv !== tvId ? (
              <div
                className="w-full h-full flex flex-col justify-center items-center cursor-pointer absolute 
                top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-transparent"
                onClick={(e) => handleVideoClick(e, tvId)}
              >
                <img src={logo} alt="logo" draggable={false} className="object-contain w-64 h-32" />
                <p className="text-white text-3xl">Click to Play Video</p>
              </div>
            ) : (
              <iframe
                width="100%"
                height="100%"
                src={tvConfigs.find((tv) => tv.id === tvId)?.videoUrl}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                className="border-none pointer-events-auto"
              />
            )}
          </Html>
        </mesh>
      ))}
    </>
  );
}

function LoadingScreen({ progress }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-gray-800">
      <BarLoader color="#3B82F6" height={4} width={200} />
      <p className="text-white mt-4 text-lg">{progress.toFixed(0)}%</p>
    </div>
  );
}

function CameraController({ startAnimation, moveToConference, moveToLobby, selectMeetingRoom }) {
  const { camera } = useThree();
  const controlsRef = useRef(null);
  const [currentAnimation, setCurrentAnimation] = useState(null);
  const [conferenceStep, setConferenceStep] = useState(1);
  const [currentRoom, setCurrentRoom] = useState(null);

  const animating = useOfficeStartAnimation((state) => state.animating);
  const setAnimating = useOfficeStartAnimation((state) => state.setAnimating);

  const targetPosition = new THREE.Vector3(-2.549193255805629, 0.4292188877044256, -14.152208639926608);
  const startPosition = new THREE.Vector3(-2.4916325866541126, 0.7629008034977564, -22.756940125929315);
  // 로비 위치 (초기 위치)
  const lobbyPosition = new THREE.Vector3(-2.549193255805629, 0.4292188877044256, -14.152208639926608);
  const lobbyTarget = new THREE.Vector3(-2.647306899925277, -0.13955053686333305, 0.5147779248624542);

  // 중간 위치 (회의실 이동 전)
  const middlePosition = new THREE.Vector3(-4.0484133213545475, 0.9946736747185134, -12.13060584699956);
  const middleTarget = new THREE.Vector3(3.2560848169654495, -1.943315923070364, -11.170076661039065);
  // conference1 위치 (회의실 이동 후)
  const conferencePosition = new THREE.Vector3(0.14562708165405525, 0.14188776017959115, -15.112251338346956);
  const conferenceTarget = new THREE.Vector3(8.378296559752526, -1.247060775965305, -15.13339335095959);
  // conference2 위치 (회의실 이동 후)
  const conference2Position = new THREE.Vector3(10.073946793683984, 0.2214595301032556, -10.64778242463828);
  const conference2Target = new THREE.Vector3(9.723099875251082, -1.75797613326489, -3.2296951054302485);

  const progress = useRef(0);

  const meetingRooms = [
    {
      id: "1",
      position: conferencePosition,
      target: conferenceTarget,
      name: "Conference 1",
      type: "con1",
    },
    {
      id: "2",
      position: conference2Position,
      target: conference2Target,
      name: "Conference 2",
      type: "con2",
    },
  ];

  useEffect(() => {
    camera.position.copy(startPosition);
  }, [camera]);

  useEffect(() => {
    if (startAnimation) {
      setAnimating(true);
      setCurrentAnimation("initial");
      progress.current = 0;
    }
  }, [startAnimation]);

  useEffect(() => {
    if (moveToConference) {
      const selectedMeetingPlace = meetingRooms.find((room) => room.type === selectMeetingRoom);
      setCurrentRoom(selectedMeetingPlace);
      setAnimating(true);
      setCurrentAnimation(selectedMeetingPlace.type);
      setConferenceStep(1);
      progress.current = 0;
    }
  }, [moveToConference, selectMeetingRoom]);

  useEffect(() => {
    if (moveToLobby) {
      setAnimating(true);
      setCurrentAnimation("lobby");
      progress.current = 0;
    }
  }, [moveToLobby]);

  useFrame(() => {
    if (animating) {
      progress.current += 0.025;

      if (progress.current >= 1) {
        if ((currentAnimation === "con1" || currentAnimation === "con2") && conferenceStep === 1) {
          // 첫 번째 단계가 끝나면 두 번째 단계 시작
          progress.current = 0;
          setConferenceStep(2);
        } else {
          setAnimating(false);
          progress.current = 1;
        }
      }

      const t = progress.current;
      const easedProgress = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

      if (currentAnimation === "initial") {
        camera.position.lerpVectors(startPosition, targetPosition, easedProgress);
      } else if (currentAnimation === "con1" || currentAnimation === "con2") {
        if (conferenceStep === 1) {
          // 첫 번째 단계: 현재 위치에서 중간 위치로
          camera.position.lerpVectors(camera.position.clone(), middlePosition, easedProgress);
          controlsRef.current.target.lerp(middleTarget, easedProgress);
        } else if (conferenceStep === 2) {
          // 두 번째 단계: 중간 위치에서 최종 위치로
          camera.position.lerpVectors(middlePosition, currentRoom.position, easedProgress);
          controlsRef.current.target.lerp(currentRoom.target, easedProgress);
        }
      } else if (currentAnimation === "lobby") {
        // 현재 위치에서 로비로 이동
        camera.position.lerpVectors(camera.position.clone(), lobbyPosition, easedProgress);
        controlsRef.current.target.lerp(lobbyTarget, easedProgress);
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping={false}
      target={[-2.647306899925277, -0.13955053686333305, 0.5147779248624542]}
    />
  );
}

const LoginOffice = () => {
  const navigate = useNavigate();
  const [show3D, setShow3D] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [moveToLobby, setMoveToLobby] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);
  const [moveToConference, setMoveToConference] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [selectMeetingRoom, setSelectMeetingRoom] = useState(null);
  const cleanupRef = useRef(false);

  const animating = useOfficeStartAnimation((state) => state.animating);
  const setShowVideo = usePlayingVideo((state) => state.setPlaying);
  const setAnimating = useOfficeStartAnimation((state) => state.setAnimating);

  const progressInterval = useRef(null);

  useEffect(() => {
    if (isLoading && !cleanupRef.current) {
      progressInterval.current = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 99) {
            clearInterval(progressInterval.current);
            return 100;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      cleanupRef.current = true;
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      setShowVideo(false);
      setAnimating(false);
    };
  }, [isLoading, setShowVideo, setAnimating]);

  const handleModelLoaded = () => {
    setLoadingProgress(100);
    setTimeout(() => {
      setIsLoading(false);
      setStartAnimation(true);
    }, 200);
  };

  const handleLogin = () => {
    setShow3D(false);
    navigate("/login");
  };

  const handleConferenceClick = (room) => {
    setSelectMeetingRoom(room);
    setMoveToLobby(false);
    setMoveToConference(true);
    setShowVideo(false);
  };

  const handleLobbyClick = () => {
    setMoveToConference(false);
    setMoveToLobby(true);
    setShowVideo(false);
  };

  if (!show3D) return null;

  const btnLists = [
    {
      key: 1,
      title: "Lobby",
      handleOnclick: handleLobbyClick,
    },
    {
      key: 2,
      title: "Conference 1",
      handleOnclick: () => handleConferenceClick("con1"),
    },
    {
      key: 3,
      title: "Conference 2",
      handleOnclick: () => handleConferenceClick("con2"),
    },
  ];

  return (
    <div className="w-screen h-screen relative bg-gray-800">
      {isLoading && <LoadingScreen progress={loadingProgress} />}
      <img src={logo} alt="sbtLogo" draggable={false} className="absolute top-5 left-5 object-contain w-44 h-10 z-20" />
      <button
        onClick={handleLogin}
        disabled={animating}
        className={`absolute top-5 right-5 px-8 py-2 bg-sbtDarkBlue text-white rounded-md z-10 text-lg  ${
          animating
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-sbtLightBlue2 hover:text-sbtDarkBlue transition-colors cursor-pointer"
        }`}
      >
        Login
      </button>
      <div className="absolute bottom-5 right-5 flex gap-3 flex-col">
        {btnLists.map((btn) => (
          <button
            key={btn.key}
            onClick={btn.handleOnclick}
            disabled={animating}
            className={`px-8 py-2 bg-sbtDarkBlue text-white 
            rounded-md z-10 text-lg  ${
              animating
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-sbtLightBlue2 hover:text-sbtDarkBlue transition-colors cursor-pointer"
            }`}
          >
            {btn.title}
          </button>
        ))}
      </div>
      <Canvas camera={{ position: [-2.4916325866541126, 0.7629008034977564, -22.756940125929315], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Model onLoaded={handleModelLoaded} />
        <CameraController
          startAnimation={startAnimation}
          moveToConference={moveToConference}
          moveToLobby={moveToLobby}
          selectMeetingRoom={selectMeetingRoom}
        />
        <Environment preset="apartment" />
      </Canvas>
    </div>
  );
};

export default LoginOffice;
