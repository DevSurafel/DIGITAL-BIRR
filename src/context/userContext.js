import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useRef,
    useCallback
} from "react";
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    arrayUnion,
    getDocs,
    collection,
    limit,
    query
} from "firebase/firestore";
import { db } from "../firebase"; // Adjust the path as needed

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    // State Management
    const [balance, setBalance] = useState(0);
    const [tapBalance, setTapBalance] = useState(0);
    const [level, setLevel] = useState({ id: 1, name: "Iron", imgUrl: "/iron.webp" });
    const [tapValue, setTapValue] = useState({ level: 1, value: 1 });
    const [cardsValue, setCardsValue] = useState({ level: 0, value: 0 });
    const [timeRefill, setTimeRefill] = useState({ level: 1, duration: 10, step: 600 });
    const [id, setId] = useState("");
    const [loading, setLoading] = useState(true);
    const [energy, setEnergy] = useState(500);
    const [battery, setBattery] = useState({ level: 1, energy: 500 });
    const [initialized, setInitialized] = useState(false);
    const [refBonus, setRefBonus] = useState(0);
    const [manualTasks, setManualTasks] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [referrals, setReferrals] = useState([]);
    const [refiller, setRefiller] = useState(0);
    const [tapGuru, setTapGuru] = useState(false);
    const [mainTap, setMainTap] = useState(true);
    const [time, setTime] = useState(22);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [freeGuru, setFreeGuru] = useState(3);
    const [fullTank, setFullTank] = useState(3);
    const [username, setUsername] = useState("");
    const [userNo, setUserNo] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [userRank, setUserRank] = useState(null);
    const [users, setUsers] = useState(0);
    const [allUsersData, setAllUsersData] = useState([]);
    
    const refillIntervalRef = useRef(null);
    const accumulatedEnergyRef = useRef(energy);
    const [isRefilling, setIsRefilling] = useState(false);

    const refillDuration = timeRefill.duration * 60 * 1000; // Convert minutes to milliseconds
    const refillSteps = timeRefill.step; // Number of increments
    const incrementValue = refiller / refillSteps; // Amount to increment at each step
    const defaultEnergy = refiller; // Default energy value

    // Refilling energy logic
    const refillEnergy = () => {
        if (isRefilling) return;

        setIsRefilling(true);
        refillIntervalRef.current = setInterval(() => {
            setEnergy((prevEnergy) => {
                if (prevEnergy >= refiller) {
                    clearInterval(refillIntervalRef.current);
                    setIsRefilling(false);
                    return refiller;
                }

                const newEnergy = Math.min(prevEnergy + incrementValue, refiller);
                accumulatedEnergyRef.current = newEnergy;
                localStorage.setItem("energy", newEnergy);
                localStorage.setItem("lastRefillTime", Date.now());
                return newEnergy;
            });
        }, refillDuration / refillSteps);
    };

    useEffect(() => {
        if (energy < refiller && !isRefilling) {
            refillEnergy();
        }
    }, [energy, isRefilling]);

    useEffect(() => {
        return () => clearInterval(refillIntervalRef.current);
    }, []);

    const startTimer = useCallback(() => {
        setTime(22);
        setTapGuru(true);
        setIsTimerRunning(true);
    }, []);

    const sendUserData = async () => {
        const telegramUser = window.Telegram.WebApp.initDataUnsafe?.user;
        if (!telegramUser) return;

        const { id: userId, username, first_name: firstName, last_name: lastName } = telegramUser;
        const finalUsername = username || firstName;

        try {
            const userRef = doc(db, "telegramUsers", userId.toString());
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                // Set state with fetched user data
                setBalance(userData.balance);
                setBattery(userData.battery);
                setRefiller(userData.battery.energy);
                setTimeRefill(userData.timeRefill);
                setLevel(userData.level);
                setId(userData.userId);
                setRefBonus(userData.refBonus || 0);
                setInitialized(true);
                fetchData(userData.userId); // Fetch user-specific data
                return;
            }

            // Create new user data
            const userData = {
                userId: userId.toString(),
                username: finalUsername,
                freeGuru: 3,
                fullTank: 3,
                tapBalance: 0,
                timeSpin: new Date(),
                tapValue: { level: 1, value: 1 },
                timeRefill: { level: 1, duration: 10, step: 600 },
                level: { id: 1, name: "Iron", imgUrl: "/iron.webp" },
                energy: 500,
                battery: { level: 1, energy: 500 },
                refereeId: null,
                referrals: []
            };

            await setDoc(userRef, userData);
            setEnergy(500);
            setBattery(userData.battery);
            setRefiller(userData.battery.energy);
            setLevel(userData.level);
            setId(userId.toString());
            setInitialized(true);
            fetchData(userId.toString());

        } catch (error) {
            console.error("Error saving user in Firestore:", error);
        }
    };

    const fetchData = async (userId) => {
        if (!userId) return;

        try {
            const tasksQuerySnapshot = await getDocs(collection(db, "tasks"));
            const tasksData = tasksQuerySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setTasks(tasksData);

            const userDocRef = doc(db, "telegramUsers", userId);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setCompletedTasks(userData.tasksCompleted || []);
            }

            const manualTasksQuerySnapshot = await getDocs(collection(db, "manualTasks"));
            const manualTasksData = manualTasksQuerySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setManualTasks(manualTasksData);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    // Handle user state synchronization and initialization
    useEffect(() => {
        sendUserData();
    }, []);

    useEffect(() => {
        if (id) {
            fetchData(id);
        }
    }, [id]);

    return (
        <UserContext.Provider value={{
            balance,
            battery,
            freeGuru,
            fullTank,
            tapBalance,
            setTapBalance,
            refBonus,
            setRefBonus,
            energy,
            setEnergy,
            loading,
            username,
            mainTap,
            setMainTap,
            loading,
            setLoading,
            tasks,
            setTasks,
            manualTasks,
            setManualTasks,
            users,
            setUsers,
            allUsersData,
            setAllUsersData,
            // Add more values as needed
        }}>
            {children}
        </UserContext.Provider>
    );
};
