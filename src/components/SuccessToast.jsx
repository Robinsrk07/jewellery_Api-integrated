import { useState,useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const SuccessToast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto-close after 3 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-6 right-6 z-50 animate-fade-in">
      <div className="flex items-center justify-between px-4 py-3 rounded-lg shadow-md bg-gradient-to-r from-teal-400 to-emerald-500 text-white min-w-[300px]">
        <div className="flex items-center gap-2">
          <FaCheckCircle className="text-white text-lg" />
          <span className="font-semibold">Success</span>
          <span className="ml-1">{message}</span>
        </div>
        <button
          onClick={onClose}
          className="text-white text-sm font-bold px-2"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default SuccessToast;
