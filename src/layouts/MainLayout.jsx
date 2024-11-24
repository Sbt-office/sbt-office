import SideBar from "@/components/SideBar";
import OfficeThree from "@/components/OfficeThree";
import WorkStatusNotification from "@/components/WorkStatusNotification";
import WorkEndModal from "@/components/WorkEndModal";
import useWorkStatusStore from "@/store/useWorkStatusStore";
import { useShallow } from "zustand/react/shallow";

const MainLayout = () => {
  const { isWorking, showModal, setShowModal } = useWorkStatusStore(
    useShallow((state) => ({
      isWorking: state.isWorking,
      showModal: state.showModal,
      setShowModal: state.setShowModal,
    }))
  );
  return (
    <>
      <SideBar />
      <OfficeThree />
      {(isWorking === 1 || isWorking === 2) && <WorkStatusNotification isWorking={isWorking} />}
      {showModal && <WorkEndModal onClose={() => setShowModal(false, null)} />}
    </>
  );
};

export default MainLayout;
