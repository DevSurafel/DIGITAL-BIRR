import React, { useEffect, useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import { IoCheckmarkSharp, IoCheckmarkCircle } from "react-icons/io5";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import {
  collection,
  getDoc,
  getDocs,
  updateDoc,
  doc,
  setDoc,
} from "firebase/firestore";

// Components
import Animate from "../Components/Animate";
import Spinner from "../Components/Spinner";
import ClaimLeveler from "../Components/ClaimLeveler";
import Levels from "../Components/Levels";
import MilestoneRewards from "../Components/MilestoneRewards";
import ReferralRewards from "../Components/Rewards";
import TaskTelegram from "../Components/Task/TaskTelegram";
import TaskTw from "../Components/Task/TaskTw";
import TaskCat from "../Components/Task/TaskCat";
import TaskWhatsapp from "../Components/Task/TaskWhatsapp";

// Firebase
import { db } from "../firebase";

// Context
import { useUser } from "../context/userContext";

// Images
import congratspic from "../images/celebrate.gif";
import coinSmall from "../images/coinsmall.png";
import taskBook from "../images/taskbook.png";

const Tasks = () => {
  const {
    id,
    balance,
    setBalance,
    refBonus,
    taskCompleted,
    level,
    setTaskCompleted,
    taskCompleted2,
    setTaskCompleted2,
    taskCompleted3,
    setTaskCompleted3,
  } = useUser();

  // State Management
  const [loading, setLoading] = useState(false);
  const [modalStates, setModalStates] = useState({
    telegram: false,
    twitter: false,
    cat: false,
    whatsapp: false,
    levels: false,
    claimLevel: false
  });

  const [tasks, setTasks] = useState([]);
  const [activeIndex, setActiveIndex] = useState(1);
  const [notify, setNotify] = useState(false);
  const [notifyRef, setNotifyRef] = useState(false);
  const [congrats, setCongrats] = useState(false);
  const [notifyBalance, setNotifyBalance] = useState(0);

  // Constants
  const TASK_IDS = {
    TELEGRAM: "task_tele_1",
    TWITTER: "task_tw_1",
    CAT: "task_cat"
  };

  // Helper Functions
  const formatNumber = (num) => {
    if (num < 1000000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    }
    return (num / 1000000).toFixed(3).replace(".", ".") + " M";
  };

  const toggleModal = (modalName) => {
    if (modalName === 'telegram' || modalName === 'twitter' || modalName === 'cat' || modalName === 'whatsapp') {
      document.getElementById("footermain").style.zIndex = "50";
    }
    setModalStates(prev => ({
      ...prev,
      [modalName]: !prev[modalName]
    }));
  };

  // Firebase Operations
  const checkTaskCompletion = useCallback(async (userId, taskId) => {
    try {
      const userTaskDocRef = doc(db, "userTasks", `${userId}_${taskId}`);
      const docSnap = await getDoc(userTaskDocRef);
      return docSnap.exists() ? docSnap.data().completed : false;
    } catch (error) {
      console.error("Error checking task completion:", error);
      return false;
    }
  }, []);

  const saveTaskCompletionToFirestore = async (userId, taskId, isCompleted) => {
    try {
      const userTaskDocRef = doc(db, "userTasks", `${userId}_${taskId}`);
      await setDoc(
        userTaskDocRef,
        { userId, taskId, completed: isCompleted },
        { merge: true }
      );
    } catch (error) {
      console.error("Error saving task completion:", error);
    }
  };

  const updateUserBalance = async (userId, newBalance) => {
    try {
      const userRef = collection(db, "telegramUsers");
      const querySnapshot = await getDocs(userRef);
      const userDoc = querySnapshot.docs.find(doc => doc.data().userId === userId);

      if (userDoc) {
        await updateDoc(doc(db, "telegramUsers", userDoc.id), { balance: newBalance });
        setBalance(newBalance);
        showCongratsNotification(newBalance - balance);
      }
    } catch (error) {
      console.error("Error updating balance:", error);
    }
  };

  // Effects
  useEffect(() => {
    const checkAllTasks = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const [task1, task2, task3] = await Promise.all([
          checkTaskCompletion(id, TASK_IDS.TELEGRAM),
          checkTaskCompletion(id, TASK_IDS.TWITTER),
          checkTaskCompletion(id, TASK_IDS.CAT)
        ]);

        setTaskCompleted(task1);
        setTaskCompleted2(task2);
        setTaskCompleted3(task3);
      } catch (error) {
        console.error("Error checking tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAllTasks();
  }, [id, checkTaskCompletion, setTaskCompleted, setTaskCompleted2, setTaskCompleted3]);

  // UI Helper Functions
  const showCongratsNotification = (amount) => {
    setCongrats(true);
    setNotifyBalance(amount);
    setTimeout(() => setCongrats(false), 4000);
  };

  // Task Components
  const TaskCard = ({ title, reward, completed, onClick }) => (
    <button
      onClick={onClick}
      className="bg-cards rounded-[10px] p-[14px] flex justify-between items-center w-full"
      aria-label={`${title} Task`}
    >
      <div className="flex items-center flex-1 space-x-2">
        <div>
          <img src={taskBook} alt="tasks" className="w-[50px]" />
        </div>
        <div className="flex flex-col space-y-1">
          <span className="font-semibold">{title}</span>
          <div className="flex items-center space-x-1">
            <span className="w-[20px] h-[20px]">
              <img src={coinSmall} className="w-full" alt="coin" />
            </span>
            <span className="font-medium">{formatNumber(reward)}</span>
          </div>
        </div>
      </div>
      <div>
        {completed ? (
          <IoCheckmarkSharp className="w-[20px] h-[20px] text-[#5bd173] mt-[2px]" />
        ) : (
          <MdOutlineKeyboardArrowRight className="w-[20px] h-[20px] text-[#e0e0e0] mt-[2px]" />
        )}
      </div>
    </button>
  );

  // Render Methods
  const renderBalance = () => (
    <div className="relative flex items-center justify-center space-x-2">
      <div className="w-[50px] h-[50px]">
        <img src={coinSmall} className="w-full" alt="coin" />
      </div>
      <h1 className="text-[#fff] text-[42px] font-extrabold">
        {formatNumber(balance + refBonus)}
      </h1>
    </div>
  );

  const renderTasks = () => (
    <div className={`${activeIndex === 1 ? "flex" : "hidden"} alltaskscontainer flex-col w-full space-y-2`}>
      <TaskCard
        title="Join Our Telegram Channel"
        reward={50000}
        completed={taskCompleted}
        onClick={() => toggleModal('telegram')}
      />
      <TaskCard
        title="Follow us on x.com"
        reward={50000}
        completed={taskCompleted2}
        onClick={() => toggleModal('twitter')}
      />
      <TaskCard
        title="Play Cats"
        reward={50000}
        completed={taskCompleted3}
        onClick={() => toggleModal('cat')}
      />
    </div>
  );

  const redDotStyle = {
    width: '10px',
    height: '10px',
    backgroundColor: 'red',
    borderRadius: '50%',
    position: 'absolute',
    top: '15px',
    right: '42%',
  };

  if (loading) return <Spinner />;

  return (
    <Animate>
      <div className="flex-col justify-center w-full px-5 space-y-3">
        {/* Header Section */}
        <div className="fixed top-0 left-0 right-0 px-5 pt-8">
          {renderBalance()}

          <button
            onClick={() => toggleModal('levels')}
            className="w-full flex ml-[6px] space-x-1 items-center justify-center"
          >
            <img src={level.imgUrl} className="w-[35px] relative" alt="Level" />
            <h2 className="text-[#9d99a9] text-[20px] font-medium">{level.name}</h2>
            <MdOutlineKeyboardArrowRight className="w-[20px] h-[20px] text-[#9d99a9] mt-[2px]" />
          </button>

          <div className="bg-borders w-full px-5 h-[1px] !mt-5 !mb-5" />

          {/* Navigation Tabs */}
          <div className="w-full border-[1px] border-borders rounded-[10px] p-1 flex items-center">
            {['Social', 'Leagues', 'Ref Tasks'].map((tab, index) => (
              <button
                key={tab}
                onClick={() => setActiveIndex(index + 1)}
                className={`${activeIndex === index + 1 ? "bg-cards" : ""} 
                  rounded-[6px] py-[12px] px-3 w-[33%] flex justify-center 
                  text-center items-center relative`}
              >
                {tab}
                {index === 1 && notify && <div style={redDotStyle} />}
                {index === 2 && notifyRef && <div style={redDotStyle} />}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="!mt-[204px] w-full h-[60vh] flex flex-col overflow-y-auto pb-[160px]">
          {renderTasks()}
          
          <div className={`${activeIndex === 2 ? "flex" : "hidden"} alltaskscontainer flex-col w-full space-y-2`}>
            <MilestoneRewards setNotify={setNotify} />
          </div>
          
          <div className={`${activeIndex === 3 ? "flex" : "hidden"} alltaskscontainer flex-col w-full space-y-2`}>
            <ReferralRewards setNotify={setNotifyRef} />
          </div>
        </div>

        {/* Modals */}
        <TaskTelegram
          showModal={modalStates.telegram}
          setShowModal={(show) => toggleModal('telegram')}
        />
        <TaskWhatsapp
          showModal={modalStates.whatsapp}
          setShowModal={(show) => toggleModal('whatsapp')}
        />
        <TaskTw
          showModal={modalStates.twitter}
          setShowModal={(show) => toggleModal('twitter')}
        />
        <TaskCat
          showModal={modalStates.cat}
          setShowModal={(show) => toggleModal('cat')}
        />
        <ClaimLeveler
          claimLevel={modalStates.claimLevel}
          setClaimLevel={(show) => toggleModal('claimLevel')}
        />
        <Levels
          showLevels={modalStates.levels}
          setShowLevels={(show) => toggleModal('levels')}
        />

        {/* Notifications */}
        <div className="w-full absolute top-[-35px] left-0 right-0 flex justify-center z-20 pointer-events-none select-none">
          {congrats && <img src={congratspic} alt="congrats" className="w-[80%]" />}
        </div>

        <div className={`${congrats ? "visible bottom-6" : "invisible bottom-[-10px]"} 
          z-[60] ease-in duration-300 w-full fixed left-0 right-0 px-4`}>
          <div className="w-full text-[#54d192] flex items-center space-x-2 px-4 bg-[#121620ef] h-[50px] rounded-[8px]">
            <IoCheckmarkCircle size={24} />
            <span className="font-medium">{formatNumber(notifyBalance)}</span>
          </div>
        </div>
      </div>
      <Outlet />
    </Animate>
  );
};

export default Tasks;
