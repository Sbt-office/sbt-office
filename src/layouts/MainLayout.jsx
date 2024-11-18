import SideBar from "../components/SideBar";
import OfficeThree from "../components/OfficeThree";
import WorkStatusNotification from "../components/WorkStatusNotification";
import WorkEndModal from "../components/WorkEndModal";
import useWorkStatusStore from "../store/useWorkStatusStore";

const MainLayout = () => {
  const { isWorking, showModal, setShowModal } = useWorkStatusStore();

  return (
    <>
      <SideBar />
      <OfficeThree />
      <WorkStatusNotification isWorking={isWorking} />
      {showModal && <WorkEndModal onClose={() => setShowModal(false, null)} />}
    </>
  );
};

export default MainLayout;
