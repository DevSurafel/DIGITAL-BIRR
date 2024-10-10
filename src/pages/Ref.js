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
import goldMedal from '../images/gold-medal.png';
import silverMedal from '../images/silver-medal.png';
import bronzeMedal from '../images/bronze-medal.png';
import congratspic from "../images/celebrate.gif";
import coinSmall from '../images/coinsmall.png';
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
    referrals = [],
    setTaskCompleted,
    setTaskCompleted2,
    username,
    allUsersData = [],
    loading
  } = useUser();

  const [showTaskTelegram, setShowTaskTelegram] = useState(false);
  const [showTaskTw, setShowTaskTw] = useState(false);
  const [claimLevel, setClaimLevel] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showLevels, setShowLevels] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [message, setMessage] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  const [userRank, setUserRank] = useState(null);
  const taskID = "task_tele_1";
  const taskID2 = "task_tw_1";

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

  const getLeaderboardData = (users) => {
    if (!Array.isArray(users) || users.length === 0) return;

    const sortedUsers = [...users].sort((a, b) => {
      const totalBalanceA = (Number(a.balance) || 0) + (Number(a.refBonus) || 0);
      const totalBalanceB = (Number(b.balance) || 0) + (Number(b.refBonus) || 0);
      return totalBalanceB - totalBalanceA;
    });

    const currentUserIndex = sortedUsers.findIndex(user => user.username === username);
    setUserRank(currentUserIndex !== -1 ? currentUserIndex + 1 : null);
    
    setLeaderboardData(sortedUsers.map((user, index) => ({
      rank: index + 1,
      initials: user.username?.substring(0, 2).toUpperCase() || "??",
      name: user.username || "Unknown",
      rocks: formatNumber((Number(user.balance) || 0) + (Number(user.refBonus) || 0)),
      imageUrl: user.level?.imgUrl,
    })));
  };

  useEffect(() => {
    setTotalUsers(formatNumber(allUsersData.length));
    getLeaderboardData(allUsersData);
  }, [allUsersData, username]);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <Animate>
          <ClaimLeveler claimLevel={claimLevel} setClaimLevel={setClaimLevel} />
          <Levels showLevels={showLevels} setShowLevels={setShowLevels} />
          
          <div className="flex-col justify-center w-full px-5 space-y-3">
            {/* Top Section for Balances and Levels */}
            <div className="fixed top-0 left-0 right-0 px-5 pt-8">
              <div className="relative flex items-center justify-center space-x-2">
                <h1 className="text-[#fff] text-[42px] font-extrabold">
                  {formatNumber(balance + refBonus)}
                </h1>
              </div>

              {/* User Level Display */}
              <div className="w-full flex ml-[6px] space-x-1 items-center justify-center">
                <img src={level?.imgUrl} className="w-[25px] relative" alt="level" />
                <h2 className="text-[#9d99a9] text-[20px] font-medium">{level?.name}</h2>
                <MdOutlineKeyboardArrowRight className="w-[20px] h-[20px] text-[#9d99a9] mt-[2px]" />
              </div>

              <div className="bg-borders w-full px-5 h-[1px] !mt-5 !mb-5"></div>

              {/* Leaderboard and Referrals Menu */}
              <div className="w-full border-[1px] border-borders rounded-[10px] p-1 flex items-center">
                <div className={`rounded-[6px] py-[12px] px-3 w-[50%] flex justify-center text-center items-center ${userRank ? "bg-cards" : ""}`}>
                  LeaderBoard
                </div>
                <div className={`rounded-[6px] py-[12px] px-3 w-[50%] flex justify-center text-center items-center`}>
                  Referrals
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="!mt-[204px] w-full h-[60vh] flex flex-col overflow-y-auto">

              <div className="flex flex-col w-full">
                <div className="w-full flex items-center rounded-lg">
                  <div className="flex-1">
                    <p className="text-white font-bold">{totalUsers} Holders</p>
                  </div>
                  <div className="flex-1 flex justify-center">
                    {userRank !== null && (
                      <div className="bg-[#1F2942] px-4 py-1 rounded-full">
                        <span className="text-[#FFD700] font-bold">Rank #{userRank}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-right">
                    <p className="font-bold">Leagues</p>
                  </div>
                </div>

                {/* Leaderboard Data */}
                <div className="space-y-2">
                  {leaderboardData.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-[#1F2942] rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: getRandomColor() }}>
                          {item.initials}
                        </div>
                        <div>
                          <p className="text-white text-sm font-semibold">#{item.rank} {item.name}</p>
                          <div className="flex items-center space-x-1">
                            <span className="font-medium">{item.rocks}</span>
                          </div>
                        </div>
                      </div>
                      {item.imageUrl && (
                        <img src={item.imageUrl} style={{ width: '35px', height: '35px' }} alt="Level" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Referrals Section */}
              <div className="flex flex-col w-full">
                <h3 className="text-[22px] font-semibold ml-3 pb-[16px]">{referrals.length} Referrals</h3>
                <div className="flex flex-col w-full space-y-3">
                  {referrals.map((user, index) => (
                    <div key={index} className="bg-cards rounded-[10px] p-[14px] flex justify-between items-center mt-1">
                      <div className="flex flex-col flex-1 space-y-1">
                        <div className="text-[#fff] pl-1 text-[16px] font-semibold">{user.username}</div>
                        <div className="flex items-center space-x-1 text-[14px] text-[#e5e5e5]">
                          <img src={user.level?.imgUrl} alt="level" className="w-[18px]" />
                          <span className="font-medium text-[#9a96a6]">{user.level?.name}</span>
                          <span className="bg-[#bdbdbd] w-[1px] h-[13px] mx-2"></span>
                          <span className="w-[20px]">
                            <img src={coinSmall} alt="coin" className="w-full" />
                          </span>
                          <span className="font-normal text-[#ffffff] text-[15px]">{formatNumber(user.balance)}</span>
                        </div>
                      </div>
                      <div className="text-[#ffce68] font-semibold text-[14px]">+{formatNumber((user.balance / 100) * 10)}</div>
                    </div>
                  ))}
                </div>
              </div>
              
            </div>

            {/* Notifications */}
            <div className={`z-[60] ease-in duration-300 w-full fixed left-0 right-0 px-4`}>
              <div className="w-full text-[#54d192] flex items-center space-x-2 px-4 bg-[#121620ef] h-[50px] rounded-[8px]">
                <IoCheckmarkCircle size={24} className="" />
                <span className="font-medium">{formatNumber(/* Your notification balance or message */)}</span>
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
