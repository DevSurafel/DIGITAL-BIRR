//the code is this one but you're talking about other things

import React, { useEffect, useState } from "react";
import Animate from "../Components/Animate";
import { Outlet } from "react-router-dom";
import { IoCheckmarkSharp } from "react-icons/io5";
import { IoCheckmarkCircle } from "react-icons/io5";
import loadingGif from "../images/loading.gif";
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
import ClaimLeveler from "../Components/ClaimLeveler";
import Levels from "../Components/Levels";
// import TaskTwo from '../Components/TaskTwo';
import congratspic from "../images/celebrate.gif";
import { useUser } from "../context/userContext";
import MilestoneRewards from "../Components/MilestoneRewards";
import ReferralRewards from "../Components/Rewards";
import TaskTelegram from "../Components/Task/TaskTelegram";
import TaskTw from "../Components/Task/TaskTw";
import TaskWhatsapp from "../Components/Task/TaskWhatsapp";

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
  } = useUser();
  // eslint-disable-next-line
  const [loading, setLoading] = useState(false);
  const [showTaskTelegram, setShowTaskTelegram] = useState(false);
  const [showTaskTw, setShowTaskTw] = useState(false);
  const [showWhatsapp, setShowWhatsapp] = useState(false);
  // eslint-disable-next-line
  const [claimLevel, setClaimLevel] = useState(false);
  const [showLevels, setShowLevels] = useState(false);
  // eslint-disable-next-line
  const [message, setMessage] = useState("");
  const taskID = "task_tele_1"; // Assign a unique ID to this task
  const taskID2 = "task_tw_1"; // Assign a unique ID to this task

  const [tasks, setTasks] = useState([]);

  const [congrats, setCongrats] = useState(false);
  const [notifyBalance, setNotifyBalance] = useState(0);

  const [activeIndex, setActiveIndex] = useState(1);

  const [notify, setNotify] = useState(false);
  const [notifyRef, setNotifyRef] = useState(false);


  const handleMenu = (index) => {
    setActiveIndex(index);
  };

  const taskTelegram = () => {
    setShowTaskTelegram(true);
    document.getElementById("footermain").style.zIndex = "50";
  };
  const taskWhatsapp = () => {
    setShowWhatsapp(true);
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

    console.log("my userid is:", id);

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

  const redDotStyle = {
    width: '10px',
    height: '10px',
    backgroundColor: 'red',
    borderRadius: '50%',
    position: 'absolute',
    top: '15px',
    right: '42%',
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <Animate>
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
                  className="w-[35px]  relative"
                  alt="Iron"
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
                    }  rounded-[6px] py-[12px] px-3 w-[33%] flex justify-center text-center items-center`}
                >
                  Social
                </div>

                <div
                  onClick={() => handleMenu(2)}
                  style={{ position: 'relative' }}
                  className={`${activeIndex === 2 ? "bg-cards" : ""
                    }  rounded-[6px] py-[12px] px-3 w-[33%] flex justify-center text-center items-center`}
                >
                  Leagues
                  {notify && (<div style={redDotStyle}></div>)}
                </div>

                <div
                  onClick={() => handleMenu(3)}
                  style={{ position: 'relative' }}
                  className={`${activeIndex === 3 ? "bg-cards" : ""
                    }  rounded-[6px] py-[12px] px-3 w-[33%] flex justify-center text-center items-center`}
                >
                  Ref Tasks
                  {notifyRef && (<div style={redDotStyle}></div>)}
                </div>
              </div>
            </div>

            <div className="!mt-[204px] w-full h-[60vh] flex flex-col overflow-y-auto pb-[160px]">
              <div
                className={`${activeIndex === 1 ? "flex" : "hidden"
                  } alltaskscontainer flex-col w-full space-y-2 `}
              >
                <div
                  onClick={taskTelegram}
                  className="bg-cards rounded-[10px] p-[14px] flex justify-between items-center"
                >
                  <div className="flex items-center flex-1 space-x-2">
                    <div className="">
                      <img src={require('../images/taskbook.png')} alt="tasks" className="w-[50px]" />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="font-semibold">
                        Join Our Telegram Channel
                      </span>
                      <div className="flex items-center space-x-1">
                        <span className="w-[20px] h-[20px]">
                          <img src={require('../images/coinsmall.png')} className="w-full" alt="coin" />
                        </span>
                        <span className="font-medium">50 000</span>
                      </div>
                    </div>
                  </div>

                  {/*  */}

                  <div className="">
                    {taskCompleted ? (
                      <>
                        <IoCheckmarkSharp className="w-[20px] h-[20px] text-[#5bd173] mt-[2px]" />
                      </>
                    ) : (
                      <>
                        <MdOutlineKeyboardArrowRight className="w-[20px] h-[20px] text-[#e0e0e0] mt-[2px]" />
                      </>
                    )}
                  </div>
                </div>




                {<div
                  onClick={taskWhatsapp}
                  className="bg-cards rounded-[10px] p-[14px] flex justify-between items-center"
                >
                  <div className="flex items-center flex-1 space-x-2">
                    <div className="">
                      <img src={require('../images/taskbook.png')} alt="tasks" className="w-[50px]" />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="font-semibold">
                        Join Our Whatsapp Channel
                      </span>
                      <div className="flex items-center space-x-1">
                        <span className="w-[20px] h-[20px]">
                          <img src={require('../images/coinsmall.png')} className="w-full" alt="coin" />
                        </span>
                        <span className="font-medium">50 000</span>
                      </div>
                    </div>
                  </div>


                  <div className="">
                    {taskCompleted ? (
                      <>
                        <IoCheckmarkSharp className="w-[20px] h-[20px] text-[#5bd173] mt-[2px]" />
                      </>
                    ) : (
                      <>
                        <MdOutlineKeyboardArrowRight className="w-[20px] h-[20px] text-[#e0e0e0] mt-[2px]" />
                      </>
                    )}
                  </div>
                </div> }



                {<div
                  onClick={taskTw}
                  className="bg-cards rounded-[10px] p-[14px] flex justify-between items-center"
                >
                  <div className="flex items-center flex-1 space-x-2">
                    <div className="">
                      <img src={require('../images/taskbook.png')} alt="tasks" className="w-[50px]" />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="font-semibold">Follow us on x.com</span>
                      <div className="flex items-center space-x-1">
                        <span className="w-[20px] h-[20px]">
                          <img src={require('../images/coinsmall.png')} className="w-full" alt="coin" />
                        </span>
                        <span className="font-medium">50 000</span>
                      </div>
                    </div>
                  </div>



                  <div className="">
                    {taskCompleted2 ? (
                      <>
                        <IoCheckmarkSharp className="w-[20px] h-[20px] text-[#5bd173] mt-[2px]" />
                      </>
                    ) : (
                      <>
                        <MdOutlineKeyboardArrowRight className="w-[20px] h-[20px] text-[#e0e0e0] mt-[2px]" />
                      </>
                    )}
                  </div>

                </div> }





                {/*  */}
              </div>

              {/*  */}

              <div
                className={`${activeIndex === 2 ? "flex" : "hidden"
                  } alltaskscontainer flex-col w-full space-y-2 `}
              >
                <MilestoneRewards setNotify={setNotify} />
              </div>

              {/*  */}

              <div
                className={`${activeIndex === 3 ? "flex" : "hidden"
                  } alltaskscontainer flex-col w-full space-y-2 `}
              >
                <ReferralRewards setNotify={setNotifyRef} />
              </div>
            </div>

            <TaskTelegram
              showModal={showTaskTelegram}
              setShowModal={setShowTaskTelegram}
            />
            <TaskWhatsapp
              showModal={showWhatsapp}
              setShowModal={setShowWhatsapp}
            />
            <TaskTw showModal={showTaskTw} setShowModal={setShowTaskTw} />

            <ClaimLeveler
              claimLevel={claimLevel}
              setClaimLevel={setClaimLevel}
            />
            <Levels showLevels={showLevels} setShowLevels={setShowLevels} />
            {/*  */}
            <div className="w-full absolute top-[-35px] left-0 right-0 flex justify-center z-20 pointer-events-none select-none">
              {congrats ? (
                <img src={congratspic} alt="congrats" className="w-[80%]" />
              ) : null}
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

export default Tasks;
