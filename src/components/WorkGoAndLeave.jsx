import useWorkStatusStore from "../store/useWorkStatusStore";

const WorkGoAndLeave = () => {
  const { isWorking, setIsWorking, setShowModal } = useWorkStatusStore();

  const handleWorkStart = () => {
    setIsWorking(true);
    setShowModal(true, "start");
  };

  const handleWorkEnd = () => {
    setIsWorking(false);
    setShowModal(true, "end");
  };

  return (
    <div className="w-full p-5 flex flex-col h-36 justify-center">
      <div className="flex flex-col justify-center text-sm font-semibold text-black/70">
        <span>안녕하세요.</span>
        <span>전성웅 매니저님</span>
      </div>
      <div className="flex items-center w-full gap-3 py-2">
        <button
          onClick={handleWorkStart}
          disabled={isWorking}
          className={`flex-1 w-full text-center py-1 rounded-md text-sm 
            ${
              isWorking
                ? "bg-gray-200 cursor-not-allowed text-black/40"
                : "bg-sbtLightBlue hover:bg-sbtDarkBlue hover:text-white"
            }`}
        >
          출근
        </button>
        <button
          onClick={handleWorkEnd}
          disabled={!isWorking}
          className={`flex-1 w-full text-center py-1 rounded-md text-sm
            ${
              !isWorking
                ? "bg-gray-100 text-black/40 cursor-not-allowed"
                : "bg-red-200 hover:bg-red-400 hover:text-white"
            }`}
        >
          퇴근
        </button>
      </div>
    </div>
  );
};

export default WorkGoAndLeave;
