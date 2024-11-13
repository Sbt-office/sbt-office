import style from "./app.module.css";
import OfficeThree from "./components/OfficeThree";
import SideBar from "./components/SideBar";

const App = () => {
    return (
        <div className={style.main}>
            <SideBar />
            <OfficeThree />
        </div>
    );
};

export default App;
