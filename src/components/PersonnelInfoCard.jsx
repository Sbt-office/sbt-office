/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Select, Input } from "antd";
import profile from "@/assets/images/profile.png";
import { usePersonnelEditStore } from "@/store/personnelEditStore";
import { useUpdatePersonnel } from "@/hooks/useUpdatePersonnel";
import { getCookie } from "@/utils/cookie";

const DEPARTMENTS = [
  { value: "DX사업부문", label: "DX사업부문" },
  { value: "세일즈포스", label: "세일즈포스" },
  { value: "경영관리본부", label: "경영관리본부" },
];

const POSITIONS = [
  { value: "연구원", label: "연구원" },
  { value: "선임연구원", label: "선임연구원" },
  { value: "Manager", label: "Manager" },
  { value: "Senior Manager", label: "Senior Manager" },
  { value: "이사", label: "이사" },
  { value: "상무", label: "상무" },
  { value: "전무", label: "전무" },
  { value: "부사장", label: "부사장" },
  { value: "사장", label: "사장" },
];

const InfoRow = ({ label, value, isEditing, onChange, type = "text", options }) => {
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
      ) : (
        <Input className="w-full" value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
};

const PersonnelInfoCard = ({ personnelInfo, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: personnelInfo.name,
    teamName: personnelInfo.teamName,
    level: personnelInfo.level,
    hp: personnelInfo.hp,
    seatNo: personnelInfo.seatNo,
  });

  useEffect(() => {
    setEditData({
      name: personnelInfo.name,
      teamName: personnelInfo.teamName,
      level: personnelInfo.level,
      hp: personnelInfo.hp,
      seatNo: personnelInfo.seatNo,
    });
  }, [personnelInfo]);

  const { setSeatNo } = usePersonnelEditStore();
  const updatePersonnel = useUpdatePersonnel();
  const sabeonFromCookie = getCookie("sabeon");
  const canEdit = sabeonFromCookie === personnelInfo.sabeon;

  const handleSave = async () => {
    await updatePersonnel.mutateAsync({
      username: editData.name,
      seat_cd: editData.seatNo,
      team_name: editData.teamName,
      insa_info: {
        hp: editData.hp,
        level: editData.level,
      },
    });

    setSeatNo(editData.seatNo);
    setIsEditing(false);
    onClose();
  };

  const displayData = isEditing
    ? editData
    : {
        name: personnelInfo.name,
        teamName: personnelInfo.teamName,
        level: personnelInfo.level,
        hp: personnelInfo.hp,
        seatNo: personnelInfo.seatNo,
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
            />
          </div>
          <div className="w-28 h-36 rounded-md bg-sbtLightBlue/70 flex items-center justify-center text-gray-600">
            <img
              src={personnelInfo.image ? personnelInfo.image : profile}
              alt="profile"
              className="w-20 h-20 object-contain"
              draggable={false}
              aria-label="profile"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-between p-4 bg-white">
        <button
          className="border border-sbtDarkBlue px-4 py-2 rounded hover:bg-sbtLightBlue/60 transition-colors"
          onClick={onClose}
        >
          닫기
        </button>
        {canEdit &&
          (isEditing ? (
            <button
              className="border border-sbtDarkBlue px-4 py-2 rounded hover:bg-sbtLightBlue/60 transition-colors"
              onClick={handleSave}
            >
              저장
            </button>
          ) : (
            <button
              className="border border-sbtDarkBlue px-4 py-2 rounded hover:bg-sbtLightBlue/60 transition-colors"
              onClick={() => setIsEditing(true)}
            >
              수정
            </button>
          ))}
      </div>
    </div>
  );
};

export default PersonnelInfoCard;
