import React from "react";
import Camera from "../assests/security_camera.png";
import { FiPlus } from "react-icons/Fi";

const Homee = ({setVisible}) => {
  return (
    <div className="flex-1 w-60 bg-slate-900 font-light opacity-80 px-5 py-5 ">
      <div className=" border-slate-400 h-80 flex justify-center items-center bg-slate-800 rounded-md flex-1">

        <div className="flex-col justify-center items-end text-center mx-5">
          <div className="flex justify-center items-center">
            <img src={Camera.src} alt="camera" className="w-60" />
          </div>
          <div className=" text-slate-300">
          <p className="text-xl font-semibold">Empty Gallery</p>
          <p className="text-md font-normal">
            Add some cameras and they will show up here.
          </p>
        </div>
        </div>
      </div>
      <div className="box-content cursor-pointer duration-700 mx-auto my-10 flex items-center justify-center w-10 h-10 rounded-full p-2 bg-teal-500 mix-blend-hard-light"
     onClick={() => setVisible(true)} 
      >
       <FiPlus className="text-2xl"/>
      </div>
    </div>
  );
};

export default Homee;
