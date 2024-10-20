// src/Components/MaintenancePage.jsx
import React from "react";
import { FrownIcon } from "lucide-react";

const Maintenance = () => {
  return (
    <div className="fixed inset-0 z-50 bg-[#191b33]/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1e2340] text-slate-100 relative rounded-lg p-6 shadow-lg border border-[#2a2f4a]">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-2 text-xl font-medium">
            <span>Under Maintenance </span>
            <FrownIcon className="h-7 w-7 text-yellow-400" />
          </div>

          <p className="text-lg text-slate-300">
            BIRR is currently under maintenance. 
            We'll be back soon with something amazing!
          </p>

          <div className="w-16 h-1 bg-blue-500 rounded-full my-2"></div>

          <p className="text-sm text-slate-400">
            Coming Soon!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
