import { useEffect, useState } from "react";
import { db } from "../../firebase"; // Adjust the import according to your file structure.
import {
  collection,
  getDoc,
  getDocs,
  updateDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { useUser } from "../../context/userContext";
import claim from "../../images/claim.webp";

const TaskTelegram = ({ showModal, setShowModal }) => {
  const { id, balance, setBalance, taskCompleted, setTaskCompleted } = useUser();

  const [isVerified, setIsVerified] = useState(false);
  const [showCheckButton, setShowCheckButton] = useState(false);
  const [showDoneButton, setShowDoneButton] = useState(false);
  const [message, setMessage] = useState("");
  const [showTaskButton, setShowTaskButton] = useState(true);
  const [counter, setCounter] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const taskID = "task_tele_1";
  const [openComplete, setOpenComplete] = useState(false);

  // Effect for handling the Telegram back button
  useEffect(() => {
    const handleBackButtonClick = () => {
      setShowModal(false);
      document.getElementById("footermain").style.zIndex = "";
    };

    if (showModal) {
      window.Telegram.WebApp.BackButton.show();
      window.Telegram.WebApp.BackButton.onClick(handleBackButtonClick);
    } else {
      window.Telegram.WebApp.BackButton.hide();
      window.Telegram.WebApp.BackButton.offClick(handleBackButtonClick);
    }

    return () => {
      window.Telegram.WebApp.BackButton.offClick(handleBackButtonClick);
    };
  }, [showModal, setShowModal]);

  // Check task completion status when id changes
  useEffect(() => {
    if (id) {
      checkTaskCompletion(id, taskID).then((completed) => {
        setTaskCompleted(completed);
        if (completed) {
          setMessage("");
          setIsVerified(true);
        }
      });
    }
  }, [id, setTaskCompleted]);

  const handleTaskLinkClick = () => {
    window.open("https://t.me/+p9ThUnIaaV0wYzZk");
    setShowTaskButton(false);
    setTimeout(() => {
      setShowCheckButton(true);
    }, 2000);
  };

  const handleVerify = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    setMessage("Verifying your membership...");
    startCountdown();
  };

  const startCountdown = () => {
    setCounter(15);
    const newIntervalId = setInterval(() => {
      setCounter((prevCounter) => {
        if (prevCounter <= 1) {
          clearInterval(newIntervalId);
          setShowCheckButton(false);
          setShowDoneButton(true);
          setIsVerified(true);
          setMessage("Verification successful! You can now claim your reward.");
          return null;
        }
        return prevCounter - 1;
      });
    }, 1000);
    setIntervalId(newIntervalId);
  };

  const checkTaskCompletion = async (userId, taskId) => {
    try {
      const userTaskDocRef = doc(db, "userTasks", `${userId}_${taskId}`);
      const docSnap = await getDoc(userTaskDocRef);
      return docSnap.exists() ? docSnap.data().completed : false;
    } catch (error) {
      console.error("Error checking task completion: ", error);
      return false;
    }
  };

  const saveTaskCompletionToFirestore = async (userId, taskId, isCompleted) => {
    try {
      const userTaskDocRef = doc(db, "userTasks", `${userId}_${taskId}`);
      await setDoc(userTaskDocRef, { userId, taskId, completed: isCompleted }, { merge: true });
    } catch (error) {
      console.error("Error saving task completion status: ", error);
    }
  };

  const updateUserCountInFirestore = async (userId, newBalance) => {
    try {
      const userRef = collection(db, "telegramUsers");
      const querySnapshot = await getDocs(userRef);
      let userDocId = null;
      
      querySnapshot.forEach((doc) => {
        if (doc.data().userId === userId) {
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
      console.error("Error updating user count in Firestore: ", error);
    }
  };

  const finishMission = async () => {
    setShowModal(false);
    setOpenComplete(false);
    document.getElementById("congrat").style.opacity = "1";
    document.getElementById("congrat").style.visibility = "visible";
    setTimeout(() => {
      document.getElementById("congrat").style.opacity = "0";
      document.getElementById("congrat").style.visibility = "invisible";
    }, 2000);

    if (isVerified) {
      const newCount = balance + 50000;
      setBalance(newCount);
      setMessage("");
      await saveTaskCompletionToFirestore(id, taskID, true);
      await updateUserCountInFirestore(id, newCount);
      setTaskCompleted(true);
    } else {
      setMessage("Please verify the task first.");
    }
  };

  const handleComplete = () => {
    setOpenComplete(true);
    document.getElementById("footermain").style.zIndex = "";
  };

  return (
    <>
      {showModal && (
        <div className="fixed z-50 left-0 right-0 top-0 bottom-0 flex justify-center taskbg px-[16px] h-full">
          <div className="w-full flex flex-col items-center">
            <div className="flex flex-col w-full">
              <h1 className="text-[20px] font-semibold">Join Our Telegram Channel</h1>
              <p className="text-[#9a96a6] text-[16px] font-medium pt-1 pb-10">
                We regularly share valuable content on our channel. Join us there and get rewarded!
              </p>

              <p className="w-full text-center text-[14px] font-semibold text-[#49ee49] pb-4">
                {taskCompleted ? "Task is Completed" : ""}
              </p>

              {/* Reward Information */}
              <div className="bg-cards rounded-[10px] p-[14px] flex justify-between items-center">
                <div className="flex items-center flex-1 space-x-2">
                  <img src={require('../../images/coinsmall.png')} className="w-[50px]" alt="Coin Icon" />
                  <div className="flex flex-col space-y-1">
                    <span className="font-semibold">Reward</span>
                    <span className="font-medium">50 000</span>
                  </div>
                </div>
              </div>

              <h1 className="text-[20px] font-semibold pt-6 pb-4 px-2">Your Tasks</h1>
              <div className="bg-cards rounded-[10px] p-[14px] flex justify-between items-center">
                <div className="flex items-center flex-1 space-x-2">
                  <div className="flex flex-col space-y-1">
                    <span className="font-semibold">Join the Telegram Channel</span>
                    {message && <span className="text-[#ea5b48] text-[12px] pr-8">{message}</span>}
                  </div>
                </div>
                <div>
                  {!taskCompleted && (
                    <>
                      {showTaskButton && (
                        <button
                          onClick={handleTaskLinkClick}
                          className="flex font-medium bg-btn hover:bg-[#1e3356] ease-in duration-300 py-[6px] px-4 rounded-[8px] items-center justify-center text-[16px]"
                        >
                          Go
                        </button>
                      )}
                      {showCheckButton && (
                        <button
                          onClick={handleVerify}
                          className="flex font-medium bg-btn py-[6px] px-4 rounded-[8px] items-center justify-center text-[16px]"
                        >
                          <span>Check</span>
                          {counter !== null && (
                            <span className="text-[#b0b0b0] pointer-events-none select-none"> ing {counter}s</span>
                          )}
                        </button>
                      )}
                      {showDoneButton && (
                        <button
                          id="done"
                          className="text-[#7cf47c] font-medium py-[6px] px-4 rounded-[8px] items-center justify-center text-[16px]"
                        >
                          Done
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Finish Mission Button */}
              <button
                onClick={taskCompleted ? null : handleComplete}
                disabled={!isVerified}
                className={`my-6 w-full py-5 px-3 flex items-center rounded-[12px] justify-center text-center text-[20px] font-medium 
                ${!isVerified ? "text-[#6a6978] bg-btn2" : "text-[#f4f4f4] bg-btn"}`}
              >
                {taskCompleted ? "Mission Completed" : "Finish Mission"}
              </button>
            </div>

            {/* Congratulations Pop-up */}
            {openComplete && (
              <div className="absolute bottom-0 left-0 right-0 h-[76vh] bg-[#1e2340f7] z-[100] rounded-tl-[20px] rounded-tr-[20px] flex justify-center px-4 py-5">
                <div className="flex flex-col justify-between w-full py-8">
                  <div className="flex flex-col items-center">
                    <div className="w-[120px] h-[120px] rounded-[14px] bg-[#252e57] flex items-center justify-center">
                      <img alt="claim" src={claim} className="" />
                    </div>
                    <h3 className="font-semibold text-[28px] py-4">Congratulations</h3>
                    <p className="pb-6 text-[#9a96a6] text-[16px]">You have successfully completed the mission</p>
                    <div className="flex items-center flex-1 space-x-2">
                      <img src={require('../../images/coinsmall.png')} className="w-[25px]" alt="Coin Icon" />
                      <div className="font-bold text-[20px]">50 000</div>
                    </div>
                  </div>

                  <div className="flex justify-center w-full pb-12">
                    <button
                      onClick={finishMission}
                      className="bg-gradient-to-b from-[#3a5fd4] to-[#5078e0] w-full py-5 px-3 flex items-center justify-center text-center rounded-[12px] font-semibold text-[22px]"
                    >
                      Claim
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TaskTelegram;
