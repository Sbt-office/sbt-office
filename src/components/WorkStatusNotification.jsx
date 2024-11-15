/* eslint-disable react/prop-types */
const WorkStatusNotification = ({ isWorking }) => {
  if (!isWorking) return null;

  return (
    <div className="fixed top-4 right-4 bg-green-100 px-4 py-2 rounded-md shadow-md">
      <span className="text-green-700 font-medium">출근 중</span>
    </div>
  );
};

export default WorkStatusNotification;
