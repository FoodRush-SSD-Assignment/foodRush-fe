import React from "react";

const Modal = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-11/12 md:w-2/3 lg:w-1/2 p-4 relative">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-gray-500 hover:text-gray-800"
        >
          ✖
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
