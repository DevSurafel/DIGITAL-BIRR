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

// import TaskTwo from '../Components/TaskTwo';
import congratspic from "../images/celebrate.gif";
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
    referrals,
    setTaskCompleted,
    setTaskCompleted2,
    user,
    username,
    userNo,
    allUsersData,
    loading
  } = useUser();

  console.log("Referrals",referrals)
  // eslint-disable-next-line
  const [showTaskTelegram, setShowTaskTelegram] = useState(false);
  const [showTaskTw, setShowTaskTw] = useState(false);
  // eslint-disable-next-line
  const [claimLevel, setClaimLevel] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showLevels, setShowLevels] = useState(false);

  const [leaderboardData, setLeaderboardData] = useState([]);
  // eslint-disable-next-line
  const [message, setMessage] = useState("");
  const taskID = "task_tele_1"; // Assign a unique ID to this task
  const taskID2 = "task_tw_1"; // Assign a unique ID to this task

  const [tasks, setTasks] = useState([]);

  const [congrats, setCongrats] = useState(false);
  const [notifyBalance, setNotifyBalance] = useState(0);

  const [activeIndex, setActiveIndex] = useState(1);

  const [totalUsers, setTotalUsers] = useState(0);
  const handleMenu = (index) => {
    setActiveIndex(index);
  };

  const taskTelegram = () => {
    setShowTaskTelegram(true);
    document.getElementById("footermain").style.zIndex = "50";
  };

  const taskTw = () => {
    setShowTaskTw(true);
    document.getElementById("footermain").style.zIndex = "50";
  };

  useEffect(() => {
    checkTaskCompletion(id, taskID).then((completed) => {
      setTaskCompleted(completed);
      if (completed) {
        setMessage("");
      }
    });
    checkTaskCompletion(id, taskID2).then((completed) => {
      setTaskCompleted2(completed);
      if (completed) {
        setMessage("");
      }
    });

    // eslint-disable-next-line
  }, [id]);

  const checkTaskCompletion = async (id, taskId, taskId2) => {
    try {
      const userTaskDocRef = doc(db, "userTasks", `${id}_${taskId}`);
      const userTaskDocRef2 = doc(db, "userTasks", `${id}_${taskId2}`);
      const docSnap = await getDoc(userTaskDocRef, userTaskDocRef2);
      if (docSnap.exists()) {
        return docSnap.data().completed;
      } else {
        return false;
      }
    } catch (e) {
      console.error("Error checking task completion: ", e);
      return false;
    }
  };

  const levelsAction = () => {
    setShowLevels(true);

    document.getElementById("footermain").style.zIndex = "50";
  };

  const formatNumber = (num) => {
    if (num < 100000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else if (num < 1000000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else {
      return (num / 1000000).toFixed(3).replace(".", ".") + " M";
    }
  };

  const listTasks = [
    {
      taskId: "task3",
      title: "subcriber Telegram c 1",
      url: "https://t.me/rockipoint",
      completed: false,
      point: 10000,
      status: "start",
    },
    {
      taskId: "task4",
      title: "subcriber Telegram c 2",
      url: "https://t.me/rockipoint",
      completed: false,
      point: 20000,
      status: "start",
    },
    {
      taskId: "task5",
      title: "subcriber Telegram c 3",
      url: "https://t.me/web3hubtest",
      completed: false,
      point: 30000,
      status: "start",
    },
    {
      taskId: "task6",
      title: "subcriber Telegram c 4",
      url: "https://t.me/rockipoint",
      completed: false,
      point: 50000,
      status: "start",
    },
    {
      taskId: "task8",
      title: "subcriber Telegram c 5",
      url: "https://t.me/rockipoint",
      completed: false,
      point: 50000,
      status: "start",
    },
  ];


  useEffect(() => {
    const formatBalance = (balance) => {
      if (balance >= 1_000_000) {
        return `${(balance / 1_000_000).toFixed(1)}M`;
      } else if (balance >= 1_000) {
        return `${(balance / 1_000).toFixed(1)}K`;
      } else {
        return balance.toString();
      }
    };

    const getLeaderboardData = (users) => {
      // Sort users by balance in descending order
      const sortedUsers = users.sort((a, b) => b.balance - a.balance);

      // Take only the first 300 users
      const topUsers = sortedUsers.slice(0, 300);

      // Map over the top users to format their data
      return topUsers.map((user) => ({
        initials: user.username.substring(0, 2).toUpperCase(),
        name: user.username,
        rocks: formatBalance(user.balance),
        imageUrl: user.level.imgUrl,
      }));
    };
    setTotalUsers(formatBalance(allUsersData.length));
    setLeaderboardData(getLeaderboardData(allUsersData));

  }, [allUsersData]);



  useEffect(() => {
    const fetchTasks = async () => {
      const tasksInit = await Promise.all(
        listTasks.map(async (task) => {
          const userTaskDocRef = doc(db, "userTasks", `${id}_${task.taskId}`);
          const docSnap = await getDoc(userTaskDocRef);
          if (docSnap.exists()) {
            return {
              ...task,
              completed: docSnap.data().completed,
              status: "done",
            };
          }
          return task;
        })
      );
      setTasks(tasksInit);
    };
    fetchTasks();
  }, [id]);

  const handleTaskLinkClick = (taskId, url) => {
    window.open(url);

    setTimeout(() => {
      setTasks(
        tasks.map((task) =>
          task.taskId === taskId ? { ...task, status: "check" } : task
        )
      );
    }, 2000);
  };

  const handleTaskCheck = (taskId) => {
    if (id) {
      saveTaskCompletionToFirestore(id, taskId, true);
      setTasks(
        tasks.map((task) =>
          task.taskId === taskId ? { ...task, status: "checking" } : task
        )
      );
      setTimeout(() => {
        setTasks(
          tasks.map((task) =>
            task.taskId === taskId ? { ...task, status: "claim" } : task
          )
        );
      }, 6000);
    }
  };

  const handleTaskDoneClaim = (taskId, point) => {
    if (id) {
      const newBalance = balance + Number(point);
      updateUserCountInFirestore(id, newBalance);
      setTasks(
        tasks.map((task) =>
          task.taskId === taskId
            ? { ...task, completed: true, status: "done" }
            : task
        )
      );
      setBalance(newBalance);
      setCongrats(true);
      setNotifyBalance(Number(point));
      setTimeout(() => {
        setCongrats(false);
      }, 4000);
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
      // console.log('Task completion status saved to Firestore.');
    } catch (e) {
      console.error("Error saving task completion status: ", e);
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
        if (doc.data().username && doc.data().totalBalance) {
          username = doc.data().username;
        }
      });

      if (userDocId) {
        const userDocRef = doc(db, "telegramUsers", userDocId);
        await updateDoc(userDocRef, { balance: newBalance });
        // console.log('User count updated in Firestore.');
      } else {
        console.error("User document not found.");
      }
    } catch (e) {
      console.error("Error updating user count in Firestore: ", e);
    }
  };


  //Get Random colors function
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };



  const copyToClipboard = () => {
    const reflink = `https://t.me/ENIGMA_TOOL_BOT?start=r${id}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(reflink)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 10000); // Reset the copied state after 2 seconds
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    } else {
      // Fallback method
      const textArea = document.createElement("textarea");
      textArea.value = reflink;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset the copied state after 2 seconds
      } catch (err) {
        console.error("Failed to copy", err);
      }
      document.body.removeChild(textArea);
    }
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
                  className="opacity-0 invisible w-[80%] absolute pl-10 ease-in-out duration-500 transition-all"
                >
                  <img src={congratspic} alt="congrats" className="w-full" />
                </div>
                {/* <Congratulations showCongrats={showCongrats} setShowCongrats={setShowCongrats} /> */}
                <div className="w-[50px] h-[50px]">
                  <img src={require('../images/coinsmall.png')} className="w-full" alt="coin" />
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
                  src={level.imgUrl}
                  className="w-[25px] relative"
                  alt="bronze"
                />
                <h2 className="text-[#9d99a9] text-[20px] font-medium">
                  {level.name}
                </h2>
                <MdOutlineKeyboardArrowRight className="w-[20px] h-[20px] text-[#9d99a9] mt-[2px]" />
              </div>

              <div className="bg-borders w-full px-5 h-[1px] !mt-5 !mb-5"></div>

              <div className="w-full border-[1px] border-borders rounded-[10px] p-1 flex items-center">
                <div
                  onClick={() => handleMenu(1)}
                  className={`${activeIndex === 1 ? "bg-cards" : ""
                    }  rounded-[6px] py-[12px] px-3 w-[50%] flex justify-center text-center items-center`}
                >
                  LeaderBoard
                  
                </div>

                <div
                  onClick={() => handleMenu(2)}
                  className={`${activeIndex === 2 ? "bg-cards" : ""
                    }  rounded-[6px] py-[12px] px-3 w-[50%] flex justify-center text-center items-center`}
                >
                  Referrals
                </div>

              </div>
            </div>

            <div className="!mt-[204px] w-full h-[60vh] flex flex-col overflow-y-auto ">
              {/* {activeIndex == 1 && (
                <div className="w-full bg-cards rounded-[12px] px-3 py-3 flex flex-col">
                  <span className="flex items-center justify-between w-full pb-2">
                    <h2 className="text-[18px] font-semibold">My invite link:</h2>
                    <span
                      onClick={copyToClipboard}
                      className="bg-gradient-to-b from-[#094e9d] to-[#0b62c4] font-medium py-[6px] px-4 rounded-[12px] flex items-center justify-center text-[16px]"
                    >
                      {copied ? <span>Copied!</span> : <span>Copy</span>}
                    </span>
                  </span>
                  <div className="text-[#9a96a6] text-[13px]">
                    https://t.me/Rockipointbot?start=r{id}
                  </div>
                </div>
              )} */}
               <div
                className={`${activeIndex === 1 ? "flex" : "hidden"
                  } alltaskscontainer flex-col w-full space-y-2`}
              >
                <div
                  className={`${activeIndex === 1 ? "flex" : "hidden"
                    } alltaskscontainer flex-col w-full space-y-2`}
                >
                  <div className="w-full flex justify-between items-center   rounded-lg">
                    <div className="flex items-center space-x-4">
                      {/* Random Avatar */}

                      <div className="flex flex-col w-full ">
                        <p className="text-white font-bold ">{totalUsers} Holders</p>
                      </div>
                    </div>
                    <div>
                      <p className="font-bold ">Leagues</p>
                    </div>
                  </div>



                  {/* Leaderboard items */}
                  <div className="space-y-2">
                    {leaderboardData.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-[#1F2942] rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          {/* Random Color Avatar */}
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                            style={{ backgroundColor: getRandomColor() }}
                          >
                            {item.initials}
                          </div>
                          <div>
                            <p className="text-white font-semibold">{item.name}</p>
                            <p className="text-white text-sm">{item.rocks} Coins</p>
                          </div>
                        </div>
                        <div>
                          {/* Trophy icon */}
                          <img
                            src={item.imageUrl}
                            style={{ width: '35px', height: '35px' }}
                            alt="vector"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
              <div
                className={`${activeIndex === 2 ? "flex" : "hidden"} alltaskscontainer flex-col w-full space-y-2`}
              >

                <div className="flex flex-col w-full ">
                  <h3 className="text-[22px] font-semibold ml-3 pb-[16px]">
                    {referrals.length} Referrals
                  </h3>

                  <div className="flex flex-col w-full space-y-3">
                    {/* {loading ? ( */}
                      <div className="w-full h-[60vh] flex flex-col overflow-y-auto pb-[80px]">
                        {referrals.map((user, index) => (
                          <>
                            <div
                              key={index}
                              className="bg-cards rounded-[10px] p-[14px] flex flex-wrap justify-between items-center mt-1"
                            >
                              <div className="flex flex-col flex-1 space-y-1">
                                <div className="text-[#fff] pl-1 text-[16px] font-semibold">
                                  {user.username}
                                </div>

                                <div className="flex items-center space-x-1 text-[14px] text-[#e5e5e5]">
                                  <div className="">
                                    <img
                                      src={user.level.imgUrl}
                                      alt="bronze"
                                      className="w-[18px]"
                                    />
                                  </div>
                                  <span className="font-medium text-[#9a96a6]">
                                    {user.level.name}
                                  </span>
                                  <span className="bg-[#bdbdbd] w-[1px] h-[13px] mx-2"></span>

                                  <span className="w-[20px]">
                                    <img
                                      src={require('../images/coinsmall.png')}
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
                          </>
                        ))}
                      </div>
                    {/* )} */}
                  </div>


                </div>


                {/*  */}
              </div>

              {/*  */}

             

              {/*  */}

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
            {/*  */}
          </div>
          <Outlet />
        </Animate>
      )}
    </>
  );
};

export default Ref;
