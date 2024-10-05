import React from "react";


const ActiveButton = ({ current, image, position, setCurrent }) => {
  return (
    <button
      onClick={setCurrent}
      className={`w-14 h-14 p-4 flex justify-center items-center ${current === position ? "bg-[#34C8E8]" : "bg-[#353F54]"} rounded-md`}
    >
      <img src={image} alt="act" className="h-full object-contain" />
    </button>
  );
}
export default ActiveButton;
