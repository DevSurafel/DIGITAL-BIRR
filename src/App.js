import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import "./fire.scss";
import { AnimatePresence } from "framer-motion";
import Footer from "./Components/Footer";
import { UserProvider } from "./context/userContext";
import DeviceCheck from "./Components/DeviceCheck";
import { FrownIcon } from "lucide-react";

const tele = window.Telegram.WebApp;

// Maintenance Component
const Maintenance = () => {
  return (
    <div className="fixed inset-0 z-50 bg-[#191b33]/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1e2340] text-slate-100 relative rounded-lg p-6">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-2 text-lg">
            <span>Under Maintenance</span>
            <FrownIcon className="h-6 w-6 text-yellow-400" />
          </div>

          <p className="text-lg">
            BIRR is currently under maintenance. <br/>
            We'll be back soon with something amazing!
          </p>

          <p className="text-sm text-slate-400">
            Coming Soon!
          </p>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  // Set to true to show maintenance page, false to show normal app
  const isInMaintenance = true;

  useEffect(() => {
    const handleContextMenu = (event) => event.preventDefault();
    const handleKeyDown = (event) => {
      if ((event.ctrlKey && (event.key === 'u' || event.key === 's')) || (event.ctrlKey && event.shiftKey && event.key === 'i')) {
        event.preventDefault();
      }
    };
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    tele.ready();
    tele.expand();
    window.Telegram.WebApp.setHeaderColor('#191b33');
    if (tele.HapticFeedback) {
      tele.HapticFeedback.impactOccurred("medium");
    }
  }, []);

  return (
    <>
      <DeviceCheck>
        <div className="flex justify-center w-full">
          <div className="flex justify-center w-full">
            <div className="flex flex-col w-full pt-8 space-y-3">
              <UserProvider>
                <AnimatePresence mode="wait">
                  {isInMaintenance ? (
                    <Maintenance />
                  ) : (
                    <Outlet />
                  )}
                </AnimatePresence>
              </UserProvider>
              <div id="footermain" className="flex flex-col bg-[#1a1f2e] space-y-6 fixed bottom-0 py-6 left-0 right-0 justify-center items-center px-5">
                <Footer />
              </div>
            </div>
          </div>
        </div>
      </DeviceCheck>
    </>
  );
};

export default Home;
