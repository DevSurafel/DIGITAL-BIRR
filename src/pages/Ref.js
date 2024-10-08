import React, { useEffect, useState } from "react";
import Animate from "../Components/Animate";
import { Outlet } from "react-router-dom";
import { IoCheckmarkCircle } from "react-icons/io5";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { db } from "../firebase";
import {
  collection,
  getDoc,
  getDocs,
  updateDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import Spinner from "../Components/Spinner";
// Import all images correctly
import goldMedal from '../images/gold-medal.png';
import silverMedal from '../images/silver-medal.png';
import bronzeMedal from '../images/bronze-medal.png';
import congratspic from "../images/celebrate.gif";
import coinSmall from '../images/coinsmall.png'; // Changed from require
import { useUser } from "../context/userContext";
import ClaimLeveler from "../Components/ClaimLeveler";
import Levels from "../Components/Levels";

const Ref = () => {
  const {
    id,
    balance,
    setBalance,
    level,
    refBonus,
    referrals = [], // Add default value
    setTaskCompleted,
    setTaskCompleted2,
    user,
    username,
    userNo,
    allUsersData = [], // Add default value
    loading
  } = useUser();

  const [showTaskTelegram, setShowTaskTelegram] = useState(false);
  const [showTaskTw, setShowTaskTw] = useState(false);
  const [claimLevel, setClaimLevel] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showLevels, setShowLevels] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [message, setMessage] = useState("");
  const [tasks, setTasks] = useState([]);
  const [congrats, setCongrats] = useState(false);
  const [notifyBalance, setNotifyBalance] = useState(0);
  const [activeIndex, setActiveIndex] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const taskID = "task_tele_1";
  const taskID2 = "task_tw_1";

  const handleMenu = (index) => {
    setActiveIndex(index);
  };

  const taskTelegram = () => {
    setShowTaskTelegram(true);
    const footerElement = document.getElementById("footermain");
    if (footerElement) {
      footerElement.style.zIndex = "50";
    }
  };

  const taskTw = () => {
    setShowTaskTw(true);
    const footerElement = document.getElementById("footermain");
    if (footerElement) {
      footerElement.style.zIndex = "50";
    }
  };

  const levelsAction = () => {
    setShowLevels(true);
    const footerElement = document.getElementById("footermain");
    if (footerElement) {
      footerElement.style.zIndex = "50";
    }
  };

  const formatNumber = (num) => {
    if (!num) return "0";
    if (num < 100000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else if (num < 1000000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else {
      return (num / 1000000).toFixed(3).replace(".", ".") + " M";
    }
  };

  // Check task completion
  useEffect(() => {
    if (!id) return;

    const checkTasks = async () => {
      try {
        const completed1 = await checkTaskCompletion(id, taskID);
        const completed2 = await checkTaskCompletion(id, taskID2);
        
        setTaskCompleted(completed1);
        setTaskCompleted2(completed2);
        
        if (completed1 || completed2) {
          setMessage("");
        }
      } catch (error) {
        console.error("Error checking tasks:", error);
      }
    };

    checkTasks();
  }, [id, setTaskCompleted, setTaskCompleted2]);

  // Update leaderboard data
  useEffect(() => {
    const formatBalance = (balance) => {
      if (!balance) return "0";
      if (balance >= 1_000_000) {
        return `${(balance / 1_000_000).toFixed(1)}M`;
      } else if (balance >= 1_000) {
        return `${(balance / 1_000).toFixed(1)}K`;
      }
      return balance.toString();
    };

    const getLeaderboardData = (users) => {
      if (!Array.isArray(users)) return [];
      
      const sortedUsers = users.sort((a, b) => b.balance - a.balance);
      const topUsers = sortedUsers.slice(0, 300);
      
      return topUsers.map((user, index) => ({
        rank: index + 1,
        initials: user.username?.substring(0, 2).toUpperCase() || "??",
        name: user.username || "Unknown",
        rocks: formatBalance(user.balance),
        imageUrl: user.level?.imgUrl,
      }));
    };

    setTotalUsers(formatBalance(allUsersData.length));
    setLeaderboardData(getLeaderboardData(allUsersData));
  }, [allUsersData]);

  const checkTaskCompletion = async (id, taskId) => {
    try {
      const userTaskDocRef = doc(db, "userTasks", `${id}_${taskId}`);
      const docSnap = await getDoc(userTaskDocRef);
      return docSnap.exists() ? docSnap.data().completed : false;
    } catch (error) {
      console.error("Error checking task completion:", error);
      return false;
    }
  };

  const saveTaskCompletionToFirestore = async (id, taskId, isCompleted) => {
    try {
      const userTaskDocRef = doc(db, "userTasks", `${id}_${taskId}`);
      await setDoc(
        userTaskDocRef,
        { userId: id, taskId: taskId, completed: isCompleted },
        { merge: true }
      );
    } catch (error) {
      console.error("Error saving task completion:", error);
    }
  };

  const updateUserCountInFirestore = async (id, newBalance) => {
    try {
      const userRef = collection(db, "telegramUsers");
      const querySnapshot = await getDocs(userRef);
      let userDocId = null;

      querySnapshot.forEach((doc) => {
        if (doc.data().userId === id) {
          userDocId = doc.id;
        }
      });

      if (userDocId) {
        const userDocRef = doc(db, "telegramUsers", userDocId);
        await updateDoc(userDocRef, { balance: newBalance });
      } else {
        console.error("User document not found.");
      }
    } catch (error) {
      console.error("Error updating user count:", error);
    }
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const getMedalImage = (rank) => {
    if (rank === 1) return goldMedal;
    if (rank === 2) return silverMedal;
    if (rank === 3) return bronzeMedal;
    return null;
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <Animate>
          <ClaimLeveler
            claimLevel={claimLevel}
            setClaimLevel={setClaimLevel}
          />
          <Levels showLevels={showLevels} setShowLevels={setShowLevels} />
          <div className="flex-col justify-center w-full px-5 space-y-3">
            <div className="fixed top-0 left-0 right-0 px-5 pt-8">
              <div className="relative flex items-center justify-center space-x-2">
                <div
                  id="congrat"
                  className={`opacity-0 invisible w-[80%] absolute pl-10 ease-in-out duration-500 transition-all ${
                    congrats ? 'opacity-100 visible' : ''
                  }`}
                >
                  <img src={congratspic} alt="congrats" className="w-full" />
                </div>
                <div className="w-[50px] h-[50px]">
                  <img
                    src={coinSmall}
                    className="w-full"
                    alt="coin"
                  />
                </div>
                <h1 className="text-[#fff] text-[42px] font-extrabold">
                  {formatNumber(balance + refBonus)}
                </h1>
              </div>

              <div
                onClick={levelsAction}
                className="w-full flex ml-[6px] space-x-1 items-center justify-center"
              >
                <img
                  src={level?.imgUrl}
                  className="w-[25px] relative"
                  alt="level"
                />
                <h2 className="text-[#9d99a9] text-[20px] font-medium">
                  {level?.name}
                </h2>
                <MdOutlineKeyboardArrowRight className="w-[20px] h-[20px] text-[#9d99a9] mt-[2px]" />
              </div>

              <div className="bg-borders w-full px-5 h-[1px] !mt-5 !mb-5"></div>

              <div className="w-full border-[1px] border-borders rounded-[10px] p-1 flex items-center">
                <div
                  onClick={() => handleMenu(1)}
                  className={`${
                    activeIndex === 1 ? "bg-cards" : ""
                  } rounded-[6px] py-[12px] px-3 w-[50%] flex justify-center text-center items-center`}
                >
                  LeaderBoard
                </div>
                <div
                  onClick={() => handleMenu(2)}
                  className={`${
                    activeIndex === 2 ? "bg-cards" : ""
                  } rounded-[6px] py-[12px] px-3 w-[50%] flex justify-center text-center items-center`}
                >
                  Referrals
                </div>
              </div>
            </div>

            <div className="!mt-[204px] w-full h-[60vh] flex flex-col overflow-y-auto">
              <div
                className={`${
                  activeIndex === 1 ? "flex" : "hidden"
                } alltaskscontainer flex-col w-full space-y-2`}
              >
                <div className="w-full flex justify-between items-center rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col w-full">
                      <p className="text-white font-bold">
                        {totalUsers} Holders
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="font-bold">Leagues</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {leaderboardData.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-[#1F2942] rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                          style={{ backgroundColor: getRandomColor() }}
                        >
                          {item.initials}
                        </div>
                        <div>
                          <p className="text-white text-sm font-semibold">
                            #{item.rank} {item.name} </p>
                            <div className="flex items-center space-x-1">
                        <span className="w-[20px] h-[20px]">
                          <img src={require('../images/coinsmall.png')} className="w-full" alt="coin" />
                        </span>
                        <span className="font-medium">{item.rocks}</span>
                      </div>
                         
                          
                                                            
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getMedalImage(item.rank) && (
                          <img
                            src={getMedalImage(item.rank)}
                            alt={`Rank ${item.rank} medal`}
                            className="w-4 h-6"
                          />
                        )}
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            style={{ width: '35px', height: '35px' }}
                            alt="Level"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className={`${
                  activeIndex === 2 ? "flex" : "hidden"
                } alltaskscontainer flex-col w-full space-y-2`}
              >
                <div className="flex flex-col w-full">
                  <h3 className="text-[22px] font-semibold ml-3 pb-[16px]">
                    {referrals.length} Referrals
                  </h3>
                  <div className="flex flex-col w-full space-y-3">
                    <div className="w-full h-[60vh] flex flex-col overflow-y-auto pb-[80px]">
                      {referrals.map((user, index) => (
                        <div
                          key={index}
                          className="bg-cards rounded-[10px] p-[14px] flex flex-wrap justify-between items-center mt-1"
                        >
                          <div className="flex flex-col flex-1 space-y-1">
                            <div className="text-[#fff] pl-1 text-[16px] font-semibold">
                              {user.username}
                            </div>
                            <div className="flex items-center space-x-1 text-[14px] text-[#e5e5e5]">
                              <div>
                                <img
                                  src={user.level?.imgUrl}
                                  alt="level"
                                  className="w-[18px]"
                                />
                              </div>
                              <span className="font-medium text-[#9a96a6]">
                                {user.level?.name}
                              </span>
                              <span className="bg-[#bdbdbd] w-[1px] h-[13px] mx-2"></span>
                              <span className="w-[20px]">
                                <img
                                  src={coinSmall}
                                  className="w-full"
                                  alt="coin"
                                />
                              </span>
                                                            <span className="font-normal text-[#ffffff] text-[15px]">
                                {formatNumber(user.balance)}
                              </span>
                            </div>
                          </div>

                          <div className="text-[#ffce68] font-semibold text-[14px]">
                            +{formatNumber((user.balance / 100) * 10)}
                          </div>
                          <div className="flex w-full mt-2 p-[4px] items-center bg-energybar rounded-[10px] border-[1px] border-borders">
                            <div className="h-[10px] rounded-[8px] bg-btn w-[.5%]"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`${congrats === true
                ? "visible bottom-6"
                : "invisible bottom-[-10px]"
                } z-[60] ease-in duration-300 w-full fixed left-0 right-0 px-4`}
            >
              <div className="w-full text-[#54d192] flex items-center space-x-2 px-4 bg-[#121620ef] h-[50px] rounded-[8px]">
                <IoCheckmarkCircle size={24} className="" />

                <span className="font-medium">
                  {formatNumber(notifyBalance)}
                </span>
              </div>
            </div>
          </div>
          <Outlet />
        </Animate>
      )}
    </>
  );
};

export default Ref;
