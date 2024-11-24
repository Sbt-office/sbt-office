/* eslint-disable react/prop-types */
import dayjs from "dayjs";
import useWorkStatusStore from "@/store/useWorkStatusStore";

const WorkEndModal = ({ onClose }) => {
  const modalType = useWorkStatusStore((state) => state.modalType);
  const workStartTime = useWorkStatusStore((state) => state.workStartTime);

  const getModalContent = () => {
    if (modalType === "start") {
      const timeStr = dayjs(workStartTime).format("HH시 mm분");
      return {
        title: "출근 처리 완료",
        message: `${timeStr}에 출근 처리가 되었습니다.`,
      };
    }
    return {
      title: "퇴근 완료",
      message: "오늘도 수고하셨습니다.",
    };
  };

  const { title, message } = getModalContent();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-30 backdrop-blur-sm">
      <div className="bg-white backdrop-blur-sm rounded-lg p-6 max-w-sm w-full mx-4">
        <h2 className="text-lg font-semibold mb-4 text-sbtDarkBlue">{title}</h2>
        <p className="text-gray-600 mb-4">{message}</p>
        <button
          onClick={onClose}
          className="w-full bg-sbtLightBlue text-black py-2 rounded-md hover:bg-sbtDarkBlue hover:text-white"
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default WorkEndModal;
