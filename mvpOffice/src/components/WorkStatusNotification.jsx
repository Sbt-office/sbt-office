/* eslint-disable react/prop-types */
const WorkStatusNotification = ({ isWorking }) => {
  return (
    <div
      className={`fixed top-[4.4rem] right-4 w-28 h-10 rounded-xl shadow-md flex items-center justify-center ${
        isWorking === 1 ? "bg-[#7396E39A]" : "bg-[#74747498]"
      } backdrop-blur-sm`}
    >
      <span className={`text-white font-medium`}>{isWorking === 1 ? "근무 중" : "업무 종료"}</span>
    </div>
  );
};

export default WorkStatusNotification;
