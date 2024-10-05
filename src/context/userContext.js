import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, getDocs, collection, limit, query } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the path as needed
// import { disableReactDevTools } from '@fvilers/disable-react-devtools';


// if (process.env.NODE_ENV === 'production') {
//   disableReactDevTools();
// }

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [balance, setBalance] = useState(0);
  // const [totalBalance, setTotalBalance] = useState(0);
  const [tapBalance, setTapBalance] = useState(0);
  const [level, setLevel] = useState({ id: 1, name: "Iron", imgUrl: '/iron.webp' }); // Initial level as an object with id and name
  const [tapValue, setTapValue] = useState({ level: 1, value: 1 });
  const [cardsValue, setCardsValue] = useState({ level: 0, value: 0 });

  const [timeRefill, setTimeRefill] = useState({ level: 1, duration: 10, step: 600 });
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(true);
  const [energy, setEnergy] = useState(500);
  const [openInfoTwo, setOpenInfoTwo] = useState(false);
  const [battery, setBattery] = useState({ level: 1, energy: 500 });
  const [initialized, setInitialized] = useState(false);
  const [refBonus, SetRefBonus] = useState(0);
  const [manualTasks, setManualTasks] = useState([]);
  const [userManualTasks, setUserManualTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]); // State to hold completed tasks
  const [claimedMilestones, setClaimedMilestones] = useState([]);
  const [claimedReferralRewards, setClaimedReferralRewards] = useState([]);
  const [referrals, setReferrals] = useState([]); // State to hold referrals
  const telegramUser = window.Telegram.WebApp.initDataUnsafe?.user;
  const [refiller, setRefiller] = useState(0);
  const { count, setCount } = useState(0);
  const [tapGuru, setTapGuru] = useState(false);
  const [mainTap, setMainTap] = useState(true);
  const [time, setTime] = useState(22);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [freeGuru, setFreeGuru] = useState(3);
  const [fullTank, setFullTank] = useState(3);
  const [timeSta, setTimeSta] = useState(null);
  const [timeStaTank, setTimeStaTank] = useState(null);
  const [timeSpin, setTimeSpin] = useState(new Date());
  const [username, setUsername] = useState("");
  const [userNo, setUserNo] = useState(0);
  // eslint-disable-next-line
  const [idme, setIdme] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [dividedCount, setDividedCount] = useState(0);
  const [users, setUsers] = useState(0);
  const [dividedUsers, setDividedUsers] = useState(0);
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [taskCompleted2, setTaskCompleted2] = useState(false);
  const [profitPerHour, setProfitPerHour] = useState(0);
  const [allUsersData, setAllUsersData] = useState([]);

  const refillIntervalRef = useRef(null);
  const accumulatedEnergyRef = useRef(energy);
  const [isRefilling, setIsRefilling] = useState(false);
  const refillDuration = timeRefill.duration * 60 * 1000; // 2 minutes in milliseconds
  const refillSteps = timeRefill.step; // Number of increments
  const incrementValue = refiller / refillSteps; // Amount to increment each step
  const defaultEnergy = refiller; // Default energy value

  const [favouriteCounts, setFavouriteCounts] = useState(0);

  const [isFavorited, setIsFavorited] = useState(false)
  const refillEnergy = () => {
    if (isRefilling) return;

    setIsRefilling(true);
    refillIntervalRef.current = setInterval(() => {
      setEnergy((prevEnergy) => {
        if (isNaN(prevEnergy) || prevEnergy >= refiller) {
          clearInterval(refillIntervalRef.current);
          setIsRefilling(false);
          return refiller;
        }
        const newEnergy = Math.min(prevEnergy + incrementValue, refiller); // Ensure energy doesn't exceed max
        if (!isNaN(newEnergy)) {
          accumulatedEnergyRef.current = newEnergy;
          localStorage.setItem('energy', newEnergy); // Save updated energy to local storage
          localStorage.setItem('lastRefillTime', Date.now()); // Save the current time
          console.log('Energy saved to local storage:', newEnergy); // Log the energy value saved to local storage
        }

        return newEnergy;
      });
    }, refillDuration / refillSteps); // Increase energy at each step
  };

  useEffect(() => {
    if (energy < refiller && !isRefilling) {
      refillEnergy();
      // console.log('REFILLER IS', refiller)
    }
    // eslint-disable-next-line
  }, [energy, isRefilling]);

  useEffect(() => {
    return () => {
      clearInterval(refillIntervalRef.current);
    };
  }, []);






  useEffect(() => {
    let timerId;
    if (isTimerRunning && time > 0) {
      timerId = setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setTapGuru(false);
      setMainTap(true);
    }
    return () => clearInterval(timerId);
  }, [isTimerRunning, time]);

  const startTimer = useCallback(() => {
    setTime(22);
    setTapGuru(true);
    setIsTimerRunning(true);
  }, []);


  const sendUserData = async () => {

    const queryParams = new URLSearchParams(window.location.search);
    let referrerId = queryParams.get("start");
    if (referrerId) {
      referrerId = referrerId.replace(/\D/g, "");
    }


    if (telegramUser) {
      const { id: userId, username, first_name: firstName, last_name: lastName } = telegramUser;

      // Use first name and ID as username if no Telegram username exists
      const finalUsername = username || `${firstName}`;

      try {
        const userRef = doc(db, 'telegramUsers', userId.toString());
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setBalance(userData.balance);
          setProfitPerHour(userData.profitPerHour);
          setTapBalance(userData.tapBalance);
          setTapValue(userData.tapValue);
          setCardsValue(userData.cardValue);
          setFreeGuru(userData.freeGuru);
          setFullTank(userData.fullTank);
          setTimeSta(userData.timeSta);
          setTimeStaTank(userData.timeStaTank);
          setTimeSpin(userData.timeSpin);
          setUserNo(userData.userNo)
          setClaimedMilestones(userData.claimedMilestones || []);
          setClaimedReferralRewards(userData.claimedReferralRewards || []);
          // setEnergy(userData.energy);
          setBattery(userData.battery);
          setRefiller(userData.battery.energy);
          setTimeRefill(userData.timeRefill);
          setLevel(userData.level);
          setId(userData.userId);
          SetRefBonus(userData.refBonus || 0);
          await updateReferrals(userRef);
          setInitialized(true);
          setLoading(false);
          fetchData(userData.userId); // Fetch data for the existing user
          console.log("Battery is:", userData.battery.energy)
          return;
        }

        const userData = {
          userId: userId.toString(),
          username: finalUsername,
          userNo,
          firstName,
          lastName,
          totalBalance: 0,
          balance: 0,
          freeGuru: 3,
          fullTank: 3,
          tapBalance: 0,
          timeSta: null,
          timeStaTank: null,
          favorite: false,
          timeSpin: new Date(),
          tapValue: { level: 1, value: 1 },
          timeRefill: { level: 1, duration: 10, step: 600 },
          level: { id: 1, name: "iron", imgUrl: 'iron.webp' }, // Set the initial level with id and name
          energy: 500,
          battery: { level: 1, energy: 500 },
          refereeId: referrerId || null,
          referrals: []
        };

        await setDoc(userRef, userData);
        setEnergy(500);
        setBattery(userData.battery);
        setRefiller(userData.battery.energy);
        setTapValue(userData.tapValue);
        setTimeRefill(userData.timeRefill);
        setFreeGuru(userData.freeGuru);
        setFullTank(userData.fullTank);
        setId(userId.toString()); // Set the id state for the new user

        if (referrerId) {
          const referrerRef = doc(db, 'telegramUsers', referrerId);
          const referrerDoc = await getDoc(referrerRef);
          if (referrerDoc.exists()) {
            await updateDoc(referrerRef, {
              referrals: arrayUnion({
                userId: userId.toString(),
                username: finalUsername,
                balance: 0,
                level: { id: 1, name: "iron", imgUrl: '/iron.webp' }, // Include level with id and name
              })
            });
            console.log('Referrer updated in Firestore');
          }
        }

        setInitialized(true);
        setLoading(false);
        fetchData(userId.toString()); // Fetch data for the new user

      } catch (error) {
        console.error('Error saving user in Firestore:', error);
      }
    }
  };


  const updateReferrals = async (userRef) => {
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();
    const referrals = userData.referrals || [];

    const updatedReferrals = await Promise.all(referrals.map(async (referral) => {
      const referralRef = doc(db, 'telegramUsers', referral.userId);
      const referralDoc = await getDoc(referralRef);
      if (referralDoc.exists()) {
        const referralData = referralDoc.data();
        return {
          ...referral,
          balance: referralData.balance,
          level: referralData.level,
        };
      }
      return referral;
    }));

    await updateDoc(userRef, {
      referrals: updatedReferrals,
    });

    const totalEarnings = updatedReferrals.reduce((acc, curr) => acc + curr.balance, 0);
    const refBonus = Math.floor(totalEarnings * 0.1);
    const totalBalance = `${balance}` + refBonus;
    console.log(`Total earnings: ${totalEarnings}, Referrer bonus: ${refBonus}`);

    // Save the refBonus to the user's document
    try {
      await updateDoc(userRef, { refBonus, totalBalance });
    } catch (error) {
      console.error('Error updating referrer bonus:', error);
    }
  };

  const getFavouriteCounts = async () => {
    try {
      const userRef = collection(db, "telegramUsers");
      const querySnapshot = await getDocs(userRef);
      let favoriteCount = 0; // Initialize favourite count

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        if (data.favorite && data.favorite === true) {
          favoriteCount++;
        }

      });
      setFavouriteCounts(favoriteCount); // Set the favourite count to state
      setLoading(false); // Set loading to false once data is fetched
    } catch (error) {
      console.error("Error fetching users: ", error);
      setLoading(false); // Set loading to false if there's an error
    }
  };


  const fetchData = async (userId) => {
    if (!userId) return; // Ensure userId is set
    try {
      // Fetch tasks
      const tasksQuerySnapshot = await getDocs(collection(db, 'tasks'));
      const tasksData = tasksQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(tasksData);

      // Fetch user data
      const userDocRef = doc(db, 'telegramUsers', userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setCompletedTasks(userData.tasksCompleted || []);
        setUserManualTasks(userData.manualTasks || []);
      }

      // Fetch manual tasks
      const manualTasksQuerySnapshot = await getDocs(collection(db, 'manualTasks'));
      const manualTasksData = manualTasksQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setManualTasks(manualTasksData);

    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const fetchReferrals = async () => {
    const telegramUser = window.Telegram.WebApp.initDataUnsafe?.user;
    if (telegramUser) {
      const { id: userId } = telegramUser;
      const userRef = doc(db, 'telegramUsers', userId.toString());
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setReferrals(userData.referrals || []);
      }
      setLoading(false);
    }
  };

  const updateUserLevel = async (userId, newTapBalance) => {
    let newLevel = { id: 1, name: "Iron", imgUrl: '/iron.webp' };

    if (newTapBalance >= 1000 && newTapBalance < 50000) {
      newLevel = { id: 2, name: "Bronze", imgUrl: '/bronze.webp' };
    } else if (newTapBalance >= 50000 && newTapBalance < 500000) {
      newLevel = { id: 3, name: "Silver", imgUrl: '/silver.webp' };
    } else if (newTapBalance >= 500000 && newTapBalance < 1000000) {
      newLevel = { id: 4, name: "Gold", imgUrl: '/gold.webp' };
    } else if (newTapBalance >= 1000000 && newTapBalance < 2500000) {
      newLevel = { id: 5, name: "Platinum", imgUrl: '/platinum.webp' };
    } else if (newTapBalance >= 2500000 && newTapBalance < 5000000) {
      newLevel = { id: 6, name: "Diamond", imgUrl: '/dimaond.webp' };
    } else if (newTapBalance >= 5000000 && newTapBalance < 10000000) {
      newLevel = { id: 7, name: "Master", imgUrl: '/master.webp' };
    } else if (newTapBalance >= 10000000 && newTapBalance < 25000000) {
      newLevel = { id: 8, name: "Grandmaster", imgUrl: '/grandmaster.webp' };
    } else if (newTapBalance >= 25000000) {
      newLevel = { id: 9, name: "Challenger", imgUrl: '/challenger.webp' };
    }


    if (newLevel.id !== level.id) {
      setLevel(newLevel);
      const userRef = doc(db, 'telegramUsers', userId);
      await updateDoc(userRef, { level: newLevel });
      console.log(`User level updated to ${newLevel.name}`);
    }
  };





  useEffect(() => {

    sendUserData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (id) {
      const storedEnergy = localStorage.getItem('energy');
      const lastRefillTime = localStorage.getItem('lastRefillTime');

      if (storedEnergy && lastRefillTime) {
        const energyValue = Number(storedEnergy);
        const lastTime = Number(lastRefillTime);

        if (!isNaN(energyValue) && energyValue >= 0 && !isNaN(lastTime) && lastTime > 0) {
          const elapsedTime = Date.now() - lastTime;
          const elapsedSteps = Math.floor(elapsedTime / (refillDuration / refillSteps));
          const restoredEnergy = Math.min(energyValue + elapsedSteps * incrementValue, refiller);

          if (!isNaN(restoredEnergy) && restoredEnergy >= 0) {
            setEnergy(restoredEnergy);
            localStorage.setItem('energy', restoredEnergy); // Update the stored energy
            localStorage.setItem('lastRefillTime', Date.now()); // Update the last refill time

            if (restoredEnergy < refiller) {
              setIsRefilling(false);
              refillEnergy();
            }
          }
        } else {
          // If stored energy or last time is invalid, reset energy to default value
          setEnergy(defaultEnergy);
          localStorage.setItem('energy', defaultEnergy);
          localStorage.setItem('lastRefillTime', Date.now());
        }
      } else if (storedEnergy) {
        const energyValue = Number(storedEnergy);
        if (!isNaN(energyValue) && energyValue >= 0) {
          setEnergy(energyValue);
        } else {
          setEnergy(defaultEnergy);
          localStorage.setItem('energy', defaultEnergy);
          localStorage.setItem('lastRefillTime', Date.now());
        }
      } else {
        setEnergy(defaultEnergy);
        localStorage.setItem('energy', defaultEnergy);
        localStorage.setItem('lastRefillTime', Date.now());
      }

      fetchData(id);
      console.log('MY REFIILER IS:', refiller)
    }
    // eslint-disable-next-line
  }, [id]);

  const checkAndUpdateFreeGuru = async () => {
    const userRef = doc(db, 'telegramUsers', id.toString());
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const lastDate = userData.timeSta.toDate(); // Convert Firestore timestamp to JS Date
      const formattedDates = lastDate.toISOString().split('T')[0]; // Get the date part in YYYY-MM-DD format
      const currentDate = new Date(); // Get the current date
      const formattedCurrentDates = currentDate.toISOString().split('T')[0]; // Get the date part in YYYY-MM-DD format

      if (formattedDates !== formattedCurrentDates && userData.freeGuru <= 0) {
        await updateDoc(userRef, {
          freeGuru: 3,
          timeSta: new Date()

        });
        setFreeGuru(3);
      }
    }
  };

  const checkAndUpdateFullTank = async () => {
    const userRef = doc(db, 'telegramUsers', id.toString());
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const lastDateTank = userData.timeStaTank.toDate(); // Convert Firestore timestamp to JS Date
      const formattedDate = lastDateTank.toISOString().split('T')[0]; // Get the date part in YYYY-MM-DD format
      const currentDate = new Date(); // Get the current date
      const formattedCurrentDate = currentDate.toISOString().split('T')[0]; // Get the date part in YYYY-MM-DD format

      // const timeDifference = (currentTime - lastTimeSta) / 1000; // Time difference in seconds
      console.log('timesta is:', lastDateTank)
      console.log('formated timesta is:', formattedDate)
      console.log('current time is:', currentDate)
      console.log('formatted current time is:', formattedCurrentDate)
      // console.log('time difference is:', timeDifference)

      if (formattedDate !== formattedCurrentDate && userData.fullTank <= 0) {
        await updateDoc(userRef, {
          fullTank: 3,
          timeStaTank: new Date()

        });
        setFullTank(3);
      }
    }
  };

  useEffect(() => {
    // Fetch the remaining clicks from Firestore when the component mounts
    const fetchRemainingClicks = async () => {
      if (id) {
        const userRef = doc(db, 'telegramUsers', id.toString());
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFreeGuru(userData.freeGuru || 0);
          setFullTank(userData.fullTank || 0);
        }
      }
    };

    fetchRemainingClicks();
  }, [id]);


  useEffect(() => {
    const telegramUsername =
      window.Telegram.WebApp.initDataUnsafe?.user?.username;
    const telegramUserid = window.Telegram.WebApp.initDataUnsafe?.user?.id;

    if (telegramUsername) {
      setUsername(telegramUsername);
    }
    if (telegramUserid) {
      setIdme(telegramUserid);
    }

    fetchFavourite(telegramUserid);
    // Fetch total count from Firestore
    fetchTotalCountFromFirestore().then((totalCount) => {
      setTotalCount(totalCount);
      const divided = calculateDividedCount(totalCount);
      setDividedCount(divided);
    });

    fetchAllUsers(); // Fetch all users when the component mounts
    fetchAllData();
    getFavouriteCounts();
  }, []);

  const fetchTotalCountFromFirestore = async () => {
    try {
      const userRef = collection(db, "telegramUsers");
      const querySnapshot = await getDocs(userRef);
      let totalCount = 0;
      let largestUserNo = 0;
      querySnapshot.forEach((doc) => {
        if (doc.data().userNo > largestUserNo) {
          largestUserNo = doc.data().userNo;
        }
        setUserNo(largestUserNo + 1);
        totalCount += doc.data().balance;
      });
      return totalCount;
    } catch (e) {
      console.error("Error fetching documents: ", e);
      return 0;
    }
  };

  const fetchAllUsers = async () => {
    try {
      const userRef = collection(db, "telegramUsers");
      const querySnapshot = await getDocs(userRef);
      const allUsers = [];
      const uniqueUsernames = new Set(); // Using a Set to store unique usernames

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const username = data.username;
        const firstName = data.firstName;
        const refereeId = data.refereeId;
        const balance = data.balance;
        const favorite = data.favorite;

        // Check if the username is unique, if yes, add it to the allUsers array and set
        // a flag indicating that it has been added
        if (!uniqueUsernames.has(username)) {
          allUsers.push({ username, firstName, refereeId, balance, favorite });
          uniqueUsernames.add(username);
        }
      });

      setUsers(allUsers.length);
      setDividedUsers(allUsers.length / 2);
      setLoading(false); // Set loading to false once data is fetched
      // Update the count of unique users
    } catch (error) {
      console.error("Error fetching users: ", error);
      setLoading(false); // Set loading to false if there's an error
    }
  };

  const fetchFavourite = async (id) => {
    const userRef = doc(db, 'telegramUsers', id.toString());
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();

      setIsFavorited(userData.favorite);
    }
  }

  const fetchAllData = async () => {
    try {
      const userRef = collection(db, "telegramUsers");

      // Create a query with a limit of 300 users
      const limitedQuery = query(userRef, limit(300));

      const querySnapshot = await getDocs(limitedQuery);
      const allUsers = [];
      const uniqueUsernames = new Set();

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const username = data.username;
        const balance = data.balance;
        const level = data.level;

        // Add the user if the username is unique
        if (!uniqueUsernames.has(username)) {
          allUsers.push({ username, balance, level });
          uniqueUsernames.add(username);
        }
      });

      console.log("All users Data", allUsers)
      setAllUsersData(allUsers || []);
      setLoading(false); // Set loading to false once data is fetched
    } catch (error) {
      console.error("Error fetching users: ", error);
      setLoading(false); // Set loading to false if there's an error
    }
  };

  const calculateDividedCount = (count) => {
    return count / 4;
  };


  // Call this function when appropriate, such as on component mount or before handleClick
  useEffect(() => {
    if (id) {
      checkAndUpdateFreeGuru();
      checkAndUpdateFullTank();
    }
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    if (id) {
      updateUserLevel(id, tapBalance);

    }
    // eslint-disable-next-line
  }, [tapBalance, id]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  useEffect(() => {
    fetchReferrals();
  }, []);

  return (
    <UserContext.Provider value={{
      balance,
      battery,
      freeGuru,
      fullTank,
      taskCompleted,
      setTaskCompleted,
      isFavorited,
      allUsersData,
      taskCompleted2,
      setTaskCompleted2,
      setFullTank,
      timeStaTank,
      setTimeStaTank,
      timeSta,
      userNo,
      timeSpin,
      setTimeSpin,
      setFreeGuru,
      time,
      setTime,
      startTimer,
      tapGuru,
      setTapGuru,
      mainTap,
      setMainTap,
      timeRefill,
      setTimeRefill,
      refiller,
      setRefiller,
      count,
      setCount,
      isRefilling,
      setIsRefilling,
      refillIntervalRef,
      setBattery,
      refillEnergy,
      tapValue,
      setTapValue,
      cardsValue,
      setCardsValue,
      tapBalance,
      setTapBalance,
      profitPerHour,
      level,
      energy,
      setEnergy,
      setBalance,
      setLevel,
      loading,
      setLoading,
      id,
      setId,
      sendUserData,
      initialized,
      setInitialized,
      refBonus,
      SetRefBonus,
      manualTasks,
      setManualTasks,
      userManualTasks,
      setUserManualTasks,
      tasks,
      setTasks,
      setFavouriteCounts,
      completedTasks,
      setCompletedTasks,
      claimedMilestones,
      setClaimedMilestones,
      referrals,
      claimedReferralRewards,
      setClaimedReferralRewards,
      idme,
      setIdme,
      totalCount,
      setTotalCount,
      dividedCount,
      setDividedCount,
      users,
      setUsers,
      dividedUsers,
      setDividedUsers,
      username,
      setUsername,
      openInfoTwo,
      favouriteCounts,
      setOpenInfoTwo
    }}>
      {children}
    </UserContext.Provider>
  );
};
