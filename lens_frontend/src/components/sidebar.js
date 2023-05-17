import React from "react";
import Background from "../assests/sidebar-2.jpg";
import { FaVideo } from "react-icons/Fa";

const Sidebar = ({ camName }) => {
  console.log("camName", camName);
  return (
    <div className="md:w-60 w-36 h-screen bg-slate-800 float-left flex-col justify-center items-center px-5">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={Background.src}
          alt="camera"
          className="opacity-5 md:w-60 w-36 h-screen object-center"
          layout="fill"
        />
      </div>
      <div className="text-slate-300 font-thin text-xl flex justify-center items-center py-5">
        LENS VIEW
      </div>
      <div className=" border-slate-700 h-60 shadow-sm shadow-slate-600">
        {camName.map((elem,index) => (
          <>
            <div className="flex justify-start items-center px-2">
              <FaVideo className="text-sm text-slate-300"/>
              <p className="text-slate-300 font-thin text-lg space-y-10 px-2 ">
                {elem}
              </p>
            </div>
          </>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
