/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { Select, Input } from "antd";
import ClipLoader from "react-spinners/ClipLoader";

import profile from "@/assets/images/profile.png";

import useSeatStore from "@/store/seatStore";
import useAdminStore from "@/store/adminStore";
import usePersonnelInfoStore from "@/store/personnelInfoStore";
import { usePersonnelEditStore } from "@/store/personnelEditStore";
import { useThreeStore } from "@/store/threeStore";
import useThemeStore from "@/store/themeStore";

import { useToast } from "@/hooks/useToast";
import { useUpdatePersonnel } from "@/hooks/useUpdatePersonnel";
import { useAllUserListQuery } from "@/hooks/useAllUserListQuery";
import { useImageCompression } from "@/hooks/useImageCompression";

import { DEPARTMENTS, POSITIONS } from "@/data/companyInfo";
import TemplateWidget from "./TemplateWidget";

const InfoRow = ({ label, value, isEditing, onChange, type = "text", options, onClick, required = false }) => {
  const isDark = useThemeStore((state) => state.isDark);
  const [isValidPhone, setIsValidPhone] = useState(true);

  const formatPhoneNumber = (input) => {
    const numbers = input.replace(/[^\d]/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const validatePhoneNumber = (phone) => {
    const regex = /^010-\d{4}-\d{4}$/;
    return regex.test(phone);
  };

  const handlePhoneChange = (e) => {
    const formattedNumber = formatPhoneNumber(e.target.value);
    const isValid = validatePhoneNumber(formattedNumber);
    setIsValidPhone(isValid);
    onChange(formattedNumber, isValid);
  };

  if (!isEditing) {
    return (
      <div className="flex w-48 gap-2">
        <div className="w-14 truncate overflow-hidden text-base flex items-center justify-around">
          <p className={isDark ? "text-gray-300" : "text-[#7B7B7B]"}>{label}</p>
          <span className={isDark ? "text-gray-300" : "text-[#7B7B7B]"}>:</span>
        </div>
        <span className={`truncate overflow-hidden w-full ${isDark ? "text-gray-200" : "text-gray-800"}`} title={value}>
          {value}
        </span>
      </div>
    );
  }

  return (
    <div className="flex w-48 gap-2">
      <div className="w-14 truncate overflow-hidden flex items-center justify-around">
        <p className={isDark ? "text-gray-300" : "text-[#7B7B7B]"}>
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </p>
        <span className={isDark ? "text-gray-300" : "text-[#7B7B7B]"}>:</span>
      </div>
      {type === "select" ? (
        <Select
          className={`w-full ${!value && required ? "border-red-500" : ""} truncate`}
          value={value}
          onChange={(val) => onChange(val)}
          options={options}
          status={!value && required ? "error" : ""}
          placeholder={`${label} 선택`}
        />
      ) : label === "자리" ? (
        <span
          className={`truncate overflow-hidden w-full cursor-pointer rounded-md ring-1 
          ${!value && required ? "ring-red-500" : "ring-comBlue"} px-3 py-1 
          ${
            isDark
              ? "hover:bg-sbtDarkBlue hover:text-white text-gray-200"
              : "hover:bg-comBlue hover:text-white text-gray-800"
          }`}
          onClick={onClick}
        >
          {value || `자리를 선택하세요`}
        </span>
      ) : label === "H.P" ? (
        <Input
          className={`w-full ${!isValidPhone && value ? "border-red-500" : ""}`}
          value={value}
          onChange={handlePhoneChange}
          maxLength={13}
          placeholder={!isValidPhone && value ? "형식이 맞지 않습니다" : "숫자만 입력하세요"}
          status={!isValidPhone && value ? "error" : ""}
        />
      ) : (
        <Input className="w-full" value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
};

const PersonnelInfoCard = ({ personnelInfo, onClose }) => {
  const isDark = useThemeStore((state) => state.isDark);
  const fileInputRef = useRef(null);
  const selectedSeat = useSeatStore((state) => state.selectedSeat);
  const setSelectedSeat = useSeatStore((state) => state.setSelectedSeat);
  const setIsSeatEdit = useSeatStore((state) => state.setIsSeatEdit);
  const sabeon = useAdminStore((state) => state.sabeon);
  const isAdmin = useAdminStore((state) => state.isAdmin);
  const setSeatNo = usePersonnelEditStore((state) => state.setSeatNo);
  const setPersonnelInfo = usePersonnelInfoStore((state) => state.setPersonnelInfo);
  const isMoving = useThreeStore((state) => state.isMoving);

  const canEdit = isAdmin === "Y" || sabeon === personnelInfo.ou_sabeon;

  const { addToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [isValidPhone, setIsValidPhone] = useState(true);
  const [editData, setEditData] = useState({
    sabeon: personnelInfo.ou_sabeon,
    name: personnelInfo.ou_nm,
    teamName: personnelInfo.ou_team_name,
    level: personnelInfo.ou_insa_info?.level || "",
    hp: personnelInfo.ou_insa_info?.hp || "",
    seatNo: selectedSeat || personnelInfo.ou_seat_cd,
    team_cd: personnelInfo.ou_team_cd || "ST001",
    profile_img: personnelInfo.ou_insa_info?.profile_img || "",
  });

  const isFormValid = () => {
    return editData.seatNo && editData.teamName && editData.level;
  };

  useEffect(() => {
    setEditData({
      name: personnelInfo.ou_nm,
      teamName: personnelInfo.ou_team_name,
      level: personnelInfo.ou_insa_info?.level || "",
      hp: personnelInfo.ou_insa_info?.hp || "",
      seatNo: selectedSeat || personnelInfo.ou_seat_cd,
      team_cd: personnelInfo.ou_team_cd || "",
      profile_img: personnelInfo.ou_insa_info?.profile_img || "",
    });

    return () => {
      setEditData({
        name: "",
        teamName: "",
        level: "",
        hp: "",
        seatNo: "",
        team_cd: "",
        profile_img: "",
      });
    };
  }, [personnelInfo, selectedSeat]);

  useEffect(() => {
    return () => {
      setIsSeatEdit(false);
      setSelectedSeat(null);
      setIsEditing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };
  }, [setIsSeatEdit, setSelectedSeat]);

  const { compressImage } = useImageCompression();
  const { mutateAsync, isLoading } = useUpdatePersonnel();
  const { refetch: refetchUserList } = useAllUserListQuery();

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const compressedImage = await compressImage(file);
        setEditData((prev) => ({
          ...prev,
          profile_img: compressedImage,
        }));
      } catch (error) {
        addToast({ type: "error", message: error.message });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const handleSave = async () => {
    if (!isFormValid()) {
      addToast({ type: "error", message: "자리, 부서, 직급을 모두 입력해주세요." });
      return;
    }

    if (!isValidPhone) {
      addToast({ type: "error", message: "올바른 전화번호 형식을 입력해주세요." });
      return;
    }

    try {
      await mutateAsync({
        sabeon: isAdmin === "Y" ? personnelInfo.ou_sabeon : sabeon,
        username: editData.name,
        seat_cd: selectedSeat || editData.seatNo,
        team_cd: editData.team_cd,
        team_name: editData.teamName,
        insa_info: {
          hp: editData.hp,
          level: editData.level,
          profile_img: editData.profile_img,
          isAdmin: personnelInfo.ou_insa_info?.isAdmin || false,
        },
      });

      await refetchUserList();

      setSeatNo(selectedSeat || editData.seatNo);
      setSelectedSeat(selectedSeat || editData.seatNo);
      setIsEditing(false);
      setIsSeatEdit(false);

      if (sabeon === personnelInfo.ou_sabeon) {
        const updatedPersonnelInfo = {
          ...personnelInfo,
          ou_nm: editData.name,
          ou_team_name: editData.teamName,
          ou_team_cd: editData.team_cd,
          ou_seat_cd: selectedSeat || editData.seatNo,
          ou_insa_info: {
            hp: editData.hp,
            level: editData.level,
            profile_img: editData.profile_img,
          },
        };
        setPersonnelInfo(updatedPersonnelInfo);

        setTimeout(() => {
          const userWithParsedInfo = {
            ...personnelInfo,
            ou_nm: editData.name,
            ou_team_name: editData.teamName,
            ou_team_cd: editData.team_cd,
            ou_seat_cd: selectedSeat || editData.seatNo,
            ou_insa_info: {
              hp: editData.hp,
              level: editData.level,
              profile_img: editData.profile_img,
            },
            ou_sabeon: isAdmin === "Y" ? personnelInfo.ou_sabeon : sabeon,
          };
          setPersonnelInfo(userWithParsedInfo);
        }, 100);
      }

      onClose();
    } catch (error) {
      console.error("Failed to save:", error);
      addToast({ type: "error", message: "저장에 실패했습니다." });
    }
  };

  const handleClose = () => {
    setSelectedSeat(personnelInfo.ou_seat_cd);
    setIsSeatEdit(false);
    onClose();
  };

  const handleSeatClick = () => {
    if (isEditing) {
      setIsSeatEdit(true);
    }
  };

  const handleIsCancelSave = () => {
    setSelectedSeat(personnelInfo.ou_seat_cd);
    setIsEditing(false);
    setIsSeatEdit(false);
  };

  const displayData = isEditing
    ? editData
    : {
        name: personnelInfo.ou_nm,
        teamName: personnelInfo.ou_team_name,
        level: personnelInfo.ou_insa_info?.level || "",
        hp: personnelInfo.ou_insa_info?.hp || "",
        seatNo: selectedSeat || personnelInfo.ou_seat_cd,
        team_cd: personnelInfo.ou_team_cd || "ST001",
        profile_img: personnelInfo.ou_insa_info?.profile_img || "",
      };

  if (isLoading) {
    return (
      <div
        className={`w-96 h-96 ${
          isDark ? "bg-gray-800/70" : "bg-white/70"
        } backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden z-10 absolute bottom-4 right-4 flex items-center justify-center`}
      >
        <ClipLoader color="#4F46E5" loading={true} size={50} aria-label="Loading Spinner" />
      </div>
    );
  }

  return (
    <>
      <div
        className={`w-[26rem] ${
          isDark ? "bg-[#1f1f1f]/60" : "bg-white/60"
        } shadow-lg backdrop-blur-md rounded-2xl overflow-hidden z-10 absolute bottom-4 right-4`}
      >
        <div className={`p-4 ${isDark ? "text-gray-200" : "text-[#393939]"}`}>
          <h2 className="text-lg font-medium text-center mt-2">인사 정보</h2>
        </div>
        <div className={`px-8 py-6 w-full ${isDark ? "text-gray-200" : "text-[#393939]"}`}>
          <div className="flex items-center w-full justify-center">
            <div className="space-y-2">
              <InfoRow label="성함" value={displayData.name} />
              <InfoRow
                label="자리"
                value={displayData.seatNo}
                isEditing={isEditing}
                onChange={(val) => setEditData({ ...editData, seatNo: val })}
                onClick={handleSeatClick}
                required
              />
              <InfoRow
                label="부서"
                value={displayData.teamName}
                isEditing={isEditing}
                type="select"
                options={DEPARTMENTS}
                onChange={(val) => setEditData({ ...editData, teamName: val })}
                required
              />
              <InfoRow
                label="직급"
                value={displayData.level}
                isEditing={isEditing}
                type="select"
                options={POSITIONS}
                onChange={(val) => setEditData({ ...editData, level: val })}
                required
              />
              <InfoRow
                label="H.P"
                value={displayData.hp}
                isEditing={isEditing}
                onChange={(val, isValid) => {
                  setEditData({ ...editData, hp: val });
                  setIsValidPhone(isValid);
                }}
              />
            </div>
            <div
              className={`w-36 h-40 rounded-md ${
                isDark ? "bg-gray-500" : "bg-gray-300"
              } flex items-center justify-center ${isDark ? "text-gray-300" : "text-gray-600"} ml-2 ${
                isEditing ? "cursor-pointer hover:bg-sbtLightBlue/90" : ""
              }`}
              onClick={() => isEditing && fileInputRef.current?.click()}
              role={isEditing ? "button" : ""}
              tabIndex={isEditing ? 0 : -1}
              aria-label={isEditing ? "프로필 이미지 업로드" : "프로필 이미지"}
            >
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              <img
                src={isEditing ? editData.profile_img || profile : personnelInfo.ou_insa_info?.profile_img || profile}
                alt="profile"
                className={`${isEditing ? "cursor-pointer hover:opacity-80" : ""} ${
                  editData.profile_img ? "w-full h-full object-fill" : "w-20 h-24"
                } rounded-md`}
                draggable={false}
                aria-label="profile"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between px-10 py-3 mb-4">
          <button
            className={`rounded transition-colors w-20 h-10 ${
              isMoving
                ? "text-gray-400 border-gray-300 cursor-not-allowed pointer-events-none"
                : "text-black bg-[#919191] hover:bg-[#919191]/40"
            }`}
            onClick={handleClose}
            disabled={isLoading || isMoving}
          >
            닫기
          </button>
          {canEdit &&
            (isEditing ? (
              <div className="flex gap-3">
                <button
                  loading={isLoading}
                  className="rounded transition-colors bg-[#919191] text-black w-20 h-10 hover:bg-[#919191]/40"
                  onClick={handleIsCancelSave}
                >
                  취소
                </button>
                <button
                  loading={isLoading}
                  className={`rounded transition-colors text-white w-20 h-10 ${
                    isFormValid() ? " hover:bg-sbtDarkBlue/90 bg-comBlue" : "bg-gray-400 cursor-not-allowed"
                  }`}
                  onClick={handleSave}
                  disabled={!isFormValid()}
                >
                  저장
                </button>
              </div>
            ) : (
              <button
                className="rounded transition-colors text-white bg-comBlue hover:bg-sbtDarkBlue/90 w-20 h-10"
                onClick={() => setIsEditing(true)}
              >
                수정
              </button>
            ))}
        </div>
      </div>
      {personnelInfo && <TemplateWidget />}
    </>
  );
};

export default PersonnelInfoCard;
