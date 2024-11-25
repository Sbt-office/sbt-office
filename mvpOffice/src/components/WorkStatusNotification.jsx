/* eslint-disable react/prop-types */
const WorkStatusNotification = ({ isWorking }) => {
  return (
    <div
      className={`fixed top-4 right-4 bg-green-100 px-4 py-2 rounded-md shadow-md ${
        isWorking === 1 ? "bg-green-100" : "bg-red-100"
      }`}
    >
      <span className={`text-green-700 font-medium ${isWorking === 1 ? "text-green-700" : "text-red-700"}`}>
        {isWorking === 1 ? "출근 중" : "퇴근 완료"}
      </span>
    </div>
  );
};

export default WorkStatusNotification;
