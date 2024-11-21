/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { Select, Input, Button } from "antd";

import profile from "@/assets/images/profile.png";

import useSeatStore from "@/store/seatStore";
import { usePersonnelEditStore } from "@/store/personnelEditStore";

import { getCookie } from "@/utils/cookie";
import { useUpdatePersonnel } from "@/hooks/useUpdatePersonnel";
import { useImageCompression } from "@/hooks/useImageCompression";

import { DEPARTMENTS, POSITIONS } from "@/data/companyInfo";

const InfoRow = ({ label, value, isEditing, onChange, type = "text", options, onClick }) => {
  if (!isEditing) {
    return (
      <div className="flex w-48 gap-2">
        <div className="font-semibold w-14 text-black/70 truncate overflow-hidden text-base flex items-center justify-around">
          <p>{label}</p>
          <span>:</span>
        </div>
        <span className="text-gray-800 truncate overflow-hidden w-full" title={value}>
          {value}
        </span>
      </div>
    );
  }

  return (
    <div className="flex w-48 gap-2">
      <div className="font-semibold w-14 text-black/70 truncate overflow-hidden text-base flex items-center justify-around">
        <p>{label}</p>
        <span>:</span>
      </div>
      {type === "select" ? (
        <Select className="w-full" value={value} onChange={(val) => onChange(val)} options={options} />
      ) : label === "자리" ? (
        <span
          className="text-gray-800 truncate overflow-hidden w-full cursor-pointer rounded-md ring-1 ring-sbtLightBlue px-3 py-1 
          hover:bg-sbtDarkBlue hover:text-white"
          onClick={onClick}
        >
          {value}
        </span>
      ) : (
        <Input className="w-full" value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
};

const PersonnelInfoCard = ({ personnelInfo, onClose }) => {
  const fileInputRef = useRef(null);
  const { selectedSeat, setSelectedSeat, setIsSeatEdit } = useSeatStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: personnelInfo.ou_nm,
    teamName: personnelInfo.ou_team_name,
    level: personnelInfo.ou_insa_info?.level || "",
    hp: personnelInfo.ou_insa_info?.hp || "",
    seatNo: selectedSeat || personnelInfo.ou_seat_cd,
    profile_img: personnelInfo.ou_insa_info?.profile_img || "",
  });

  useEffect(() => {
    setEditData({
      name: personnelInfo.ou_nm,
      teamName: personnelInfo.ou_team_name,
      level: personnelInfo.ou_insa_info?.level || "",
      hp: personnelInfo.ou_insa_info?.hp || "",
      seatNo: selectedSeat || personnelInfo.ou_seat_cd,
      profile_img: personnelInfo.ou_insa_info?.profile_img || "",
    });

    return () => {
      setEditData({
        name: "",
        teamName: "",
        level: "",
        hp: "",
        seatNo: "",
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

  const { setSeatNo } = usePersonnelEditStore();
  const { compressImage } = useImageCompression();

  const { mutateAsync, isLoading } = useUpdatePersonnel();
  const sabeonFromCookie = getCookie("sabeon");

  const canEdit = sabeonFromCookie === personnelInfo.ou_sabeon;

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
        alert(error.message);
      }
    }
  };

  const handleSave = async () => {
    try {
      await mutateAsync({
        username: editData.name,
        seat_cd: selectedSeat || editData.seatNo,
        team_name: editData.teamName,
        insa_info: {
          hp: editData.hp,
          level: editData.level,
          profile_img: editData.profile_img,
        },
      });

      setSeatNo(selectedSeat || editData.seatNo);
      setSelectedSeat(selectedSeat || editData.seatNo);
      setIsEditing(false);
      setIsSeatEdit(false);
      onClose();
    } catch (error) {
      console.error("Failed to save:", error);
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
        profile_img: personnelInfo.ou_insa_info?.profile_img || "",
      };

  return (
    <div className="w-96 bg-white shadow-lg rounded-md overflow-hidden z-10 absolute bottom-4 right-4">
      <div className="bg-sbtLightBlue text-black p-4">
        <h2 className="text-2xl font-bold text-center">인사 정보</h2>
      </div>
      <div className="p-6">
        <div className="flex items-center space-x-8">
          <div className="space-y-2">
            <InfoRow
              label="성함"
              value={displayData.name}
              isEditing={isEditing}
              onChange={(val) => setEditData({ ...editData, name: val })}
            />
            <InfoRow
              label="부서"
              value={displayData.teamName}
              isEditing={isEditing}
              type="select"
              options={DEPARTMENTS}
              onChange={(val) => setEditData({ ...editData, teamName: val })}
            />
            <InfoRow
              label="직급"
              value={displayData.level}
              isEditing={isEditing}
              type="select"
              options={POSITIONS}
              onChange={(val) => setEditData({ ...editData, level: val })}
            />
            <InfoRow
              label="H.P"
              value={displayData.hp}
              isEditing={isEditing}
              onChange={(val) => setEditData({ ...editData, hp: val })}
            />
            <InfoRow
              label="자리"
              value={displayData.seatNo}
              isEditing={isEditing}
              onChange={(val) => setEditData({ ...editData, seatNo: val })}
              onClick={handleSeatClick}
            />
          </div>
          <div
            className={`w-28 h-36 rounded-md bg-sbtLightBlue/70 flex items-center justify-center text-gray-600 ${
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
      <div className="flex justify-between px-6 py-4">
        <Button
          color="primary"
          variant="outlined"
          className="rounded transition-colors text-sbtDarkBlue"
          onClick={handleClose}
          disabled={isLoading}
        >
          닫기
        </Button>
        {canEdit &&
          (isEditing ? (
            <div className="flex gap-3">
              <Button
                color="primary"
                variant="outlined"
                loading={isLoading}
                className="rounded transition-colors text-sbtDarkBlue"
                onClick={handleIsCancelSave}
              >
                취소
              </Button>
              <Button
                type="primary"
                loading={isLoading}
                className="rounded transition-colors text-white bg-sbtDarkBlue"
                onClick={handleSave}
              >
                저장
              </Button>
            </div>
          ) : (
            <Button
              type="primary"
              className="rounded transition-colors text-white bg-sbtDarkBlue"
              onClick={() => setIsEditing(true)}
            >
              수정
            </Button>
          ))}
      </div>
    </div>
  );
};

export default PersonnelInfoCard;
