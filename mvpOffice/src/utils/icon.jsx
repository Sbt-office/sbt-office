import React from "react";

export const userIcon = () => {
  return (
    <svg fill="none" width="100%" height="100%" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z"
        fill="currentColor"
      />
      <path d="M14 12C14 10.3431 12.6569 9 11 9H5C3.34315 9 2 10.3431 2 12V15H14V12Z" fill="currentColor" />
    </svg>
  );
};

export const CloseButton = ({ size = 16, closeEvent = null }) => {
  return (
    <div
      onClick={closeEvent}
      style={{
        width: size + "px",
        height: size + "px",
        cursor: "pointer",
      }}
    >
      <svg
        style={{ width: "100%", height: "100%" }}
        fill="currentColor"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 1792 1792"
        xmlSpace="preserve"
      >
        <path
          d="M1082.2,896.6l410.2-410c51.5-51.5,51.5-134.6,0-186.1s-134.6-51.5-186.1,0l-410.2,410L486,300.4
	c-51.5-51.5-134.6-51.5-186.1,0s-51.5,134.6,0,186.1l410.2,410l-410.2,410c-51.5,51.5-51.5,134.6,0,186.1
	c51.6,51.5,135,51.5,186.1,0l410.2-410l410.2,410c51.5,51.5,134.6,51.5,186.1,0c51.1-51.5,51.1-134.6-0.5-186.2L1082.2,896.6z"
        />
      </svg>
    </div>
  );
};
