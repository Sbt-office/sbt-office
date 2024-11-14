/* eslint-disable react/prop-types */
import profile from "@/assets/images/profile.png";

const InfoRow = ({ label, value }) => {
  return (
    <div className="flex w-48 gap-2">
      <span className="font-semibold w-14 text-black/70 truncate overflow-hidden text-base">{`${label} :`}</span>
      <span className="text-gray-800 truncate overflow-hidden w-full" title={value}>
        {value}
      </span>
    </div>
  );
};

const PersonnelInfoCard = ({ personnelInfo, onClose }) => {
  const { title: name, teamName } = personnelInfo;

  const userName = name.slice(0, 3);
  const levelSplit = name.slice(3).split(" ").join("");
  const level = levelSplit === "M" ? "Manager" : levelSplit === "S/M" ? "Senior Manager" : name.slice(3);

  return (
    <div className="w-96 bg-white shadow-lg rounded-md overflow-hidden z-10 absolute bottom-4 right-4">
      <div className="bg-sbtLightBlue text-black p-4">
        <h2 className="text-2xl font-bold text-center">인사 정보</h2>
      </div>
      <div className="p-6">
        <div className="flex items-center space-x-8">
          <div className="space-y-2">
            <InfoRow label="성함" value={userName} />
            <InfoRow label="부서" value={teamName} />
            <InfoRow label="직급" value={level} />
            <InfoRow label="H.P" value="010-1234-5678" />
            <InfoRow label="자리" value="Green_01_01" />
          </div>
          <div className="w-28 h-36 rounded-md bg-sbtLightBlue/70 flex items-center justify-center text-gray-600">
            <img
              src={profile}
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
      </div>
    </div>
  );
};

export default PersonnelInfoCard;
