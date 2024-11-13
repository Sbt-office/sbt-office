import { useState } from "react";
import { motion } from "framer-motion";
import { sidebarItems } from "../data/sidebarItems";

import style from "@/styles/sideBar.module.css";
import logo from "@/assets/logo.png";

const SideBar = () => {
  const [openSection, setOpenSection] = useState(null);
  const [openSubItem, setOpenSubItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const toggleSection = (index) => {
    if (openSection === index) {
      setOpenSection(null);
      setSelectedItem(null); // 섹션이 닫힐 때 선택 상태 초기화
    } else {
      setOpenSection(index);
      handleItemClick(`${index}`);
    }
  };

  const toggleSubItem = (index) => {
    if (openSubItem === index) {
      setOpenSubItem(null);
      setSelectedItem(null); // 서브아이템이 닫힐 때 선택 상태 초기화
    } else {
      setOpenSubItem(index);
    }
  };

  const handleItemClick = (itemPath) => {
    setSelectedItem(itemPath);
  };

  return (
    <div className={style.container}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 300 }}
        transition={{ duration: 0.5 }}
        className="sidebar"
        style={{
          height: "100vh",
          overflowY: "auto",
          position: "fixed",
          left: 0,
          top: 0,
          paddingLeft: "30px",
        }}
      >
        {/* Company logo */}
        <div className={style.logo}>
          <img src={logo} alt="logo" draggable={false} />
        </div>
        {/* Sidebar items */}
        <ul>
          {sidebarItems.map((item, index) => (
            <li key={index} className={style.item}>
              <div
                onClick={() => toggleSection(index)}
                className={style.title}
                style={{
                  color: selectedItem === `${index}` ? "#ff8c00" : "#424242",
                }}
              >
                {item.subItems && <span>{openSection === index ? "▼" : "▶"}</span>} {item.title}
              </div>
              {item.subItems && openSection === index && (
                <ul className={style.subItems}>
                  {item.subItems.map((subItem, subIndex) => (
                    <li key={subIndex} className={style.subItem}>
                      <div
                        onClick={() => {
                          toggleSubItem(subIndex);
                          handleItemClick(`${index}-${subIndex}`);
                        }}
                        className={style.title}
                        style={{
                          color: selectedItem === `${index}-${subIndex}` ? "#ff9a1e" : "#424242",
                        }}
                      >
                        {subItem.subItems ? (
                          <span className={style.arrow}>{openSubItem === subIndex ? "▼" : "▶"}</span>
                        ) : (
                          <span className={style.subItemIcon}>-</span>
                        )}
                        {subItem.title}
                      </div>
                      {subItem.subItems && openSubItem === subIndex && (
                        <ul className={style.nestedItems}>
                          {subItem.subItems.map((nestedItem, nestedIndex) => (
                            <li
                              key={nestedIndex}
                              className={style.nestedItem}
                              onClick={() => handleItemClick(`${index}-${subIndex}-${nestedIndex}`)}
                              style={{
                                color: selectedItem === `${index}-${subIndex}-${nestedIndex}` ? "#ff9a1e" : "#424242",
                                cursor: "pointer",
                              }}
                            >
                              <span className={style.nestedItemIcon}>▪</span> {nestedItem}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export default SideBar;
