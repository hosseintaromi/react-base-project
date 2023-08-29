import { useEffect } from "react";
import TabContainer from "./core/components/containers/TabContainer";
import ModalContainer from "./core/components/containers/ModalContainer";
import MasterTabContainer from "./core/components/containers/MasterTabContainer";
import ToastContainer from "./core/components/containers/ToastContainer";
import BottomSheetContainer from "./core/components/containers/BottomSheetContainer";
import { openPage } from "./core/utils/page";
import { PageContainerType } from "./core/@types/page";

function App() {
  useEffect(() => {
    openPage({
      type: PageContainerType.MasterTab,
      id: "Home",
      data: {},
      // component: Home,
      // for demo its start from intro tab
      component: () => <h1>Home</h1>,
    });
  }, []);

  return (
    <>
      <MasterTabContainer />
      <TabContainer />
      <ModalContainer />
      <BottomSheetContainer />
      <ToastContainer />
    </>
  );
}

export default App;
