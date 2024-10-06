import { useEffect, useState } from "react"
import Cart from "../assets/lottery-cards/car.svg"
import Moto from "../assets/lottery-cards/biclycle.svg"
import Phone from "../assets/lottery-cards/phone.svg"
import Notebook from "../assets/lottery-cards/notebook.svg"
import { doc, updateDoc } from "@firebase/firestore"
import { db } from "../firebase"
import { useUser } from "../context/userContext"
const veicles = [
  {
    name: "Rolls Royace",
    value: "250",
    image: Cart,
    heart: true,
    title: <strong className="text-white text-[15px]">COMING SOON!💰</strong>,
    description: (
      <>
        <p className="text-white/60 text-base">Get ready to shift your luck into high gear!</p>
        <p className="text-white/60 text-base">Tokens will be distributed soon and can be traded on major exchanges.

We're in the mining phase where players earn more $BIRR for the airdrop.

The airdrop date will be announced soon in our Telegram channel.</p>
        <p className="text-white/60 text-base">#StayTuned</p>
      </>
    )

  },
  {
    name: "Iphone 15 pro max",
    value: "40 000",
    image: Phone,
    heart: false,
    title: <strong className="text-white text-[17px]">WIN THE LATEST iPHONE 15 PRO MAX!</strong>,
    description: (
      <>
        <p className="text-white/60 text-base">Enter our exciting lottery for a chance to get your hands on the brand-new iPhone 15 Pro Max!</p>
        <p className="text-white/60 text-base">- Prize: iPhone 15 Pro Max (256GB/512GB/1TB)</p>
        <p className="text-white/60 text-base">- Draw date: [insert date]</p>
        <p className="text-white/60 text-base">- Tickets available until [insert time]</p>
        <p className="text-white/60 text-base">Experience the cutting-edge technology, stunning display, and advanced cameras of Apple's flagship device!</p>
        <p className="text-white/60 text-base">Don't miss out! Get your ticket now and take a chance to upgrade your mobile experience!</p>
        <p className="text-white/60 text-base">Good luck!</p>
      </>
    )

  },

  {
    name: "Ducati Panigale V4 S",
    value: "2 0000",
    image: Moto,
    heart: true,
    title: <strong className="text-white text-[17px]">REV UP YOUR DREAMS!</strong>,
    description: (
      <>
        <p className="text-white/60 text-base">Enter our high-octane lottery for a chance to win the ultimate ride - a Ducati Panigale V4 S (2023)!</p>
        <p className="text-white/60 text-base">- Prize: Ducati Panigale V4 S (2023) - 1103cc, 214 HP, 7-speed gearbox</p>
        <p className="text-white/60 text-base">- Draw date: [insert date]</p>
        <p className="text-white/60 text-base">- Tickets available until [insert time]</p>
        <p className="text-white/60 text-base">Feel the rush of adrenaline as you take this beast on the road! With its sleek design and exceptional performance, this bike is a true champion's ride.</p>
        <p className="text-white/60 text-base">Get your ticket now and shift your luck into high gear!</p>
        <p className="text-white/60 text-base">Good luck!</p>
      </>
    )
  },
  {
    name: "Macbook air m2",
    value: "1 0000",
    image: Notebook,
    heart: true,
    title: <strong className="text-white text-[17px]">WIN THE ULTIMATE LAPTOP EXPERIENCE!</strong>,
    description: (
      <>
        <p className="text-white/60 text-base">Enter our exciting lottery for a chance to win $5,000 CASH!</p>
        <p className="text-white/60 text-base">- Prize: $5,000</p>
        <p className="text-white/60 text-base">- Draw date: [insert date]</p>
        <p className="text-white/60 text-base">- Tickets available until [insert time]</p>
        <p className="text-white/60 text-base">Imagine the possibilities with an extra $5,000 in your pocket!</p>
        <p className="text-white/60 text-base">Pay off bills, treat yourself, or invest in your future - the choice is yours!</p>
        <p className="text-white/60 text-base">Get your ticket now and make your dreams a reality!</p>
        <p className="text-white/60 text-base">Good luck!</p>
      </>
    )
  },
]

const Stats = () => {
  const [current] = useState(0);
  const { isFavorited, favouriteCounts, } = useUser();
  const [isFavoritedSelect, setIsFavoritedSelect] = useState(isFavorited);
  const telegramUser = window.Telegram.WebApp.initDataUnsafe?.user;
  const [totalcounts, setTotalCounts] = useState(favouriteCounts);

  useEffect(() => {
    // Update local state when `isFavorited` changes
    setIsFavoritedSelect(isFavorited);
    setTotalCounts(favouriteCounts);
  }, [isFavorited, favouriteCounts]); // Depend on isFavorited to trigger re-render when it changes

  const favorite = async () => {
    try {
      const newValue = !isFavoritedSelect;
      const newCount = newValue ? totalcounts + 1 : totalcounts - 1; // Increment or decrement count

      setIsFavoritedSelect(newValue);  // Update UI immediately
      setTotalCounts(newCount);      // Update favorite count immediately

      await sendUserData(newValue);    // Sync with Firestore
    } catch (error) {
      console.error('Failed to update favorite status:', error);
      // Optionally revert state on error
      setIsFavoritedSelect(isFavorited);
    }
  };

  const sendUserData = async (newValue) => {
    try {
      if (telegramUser) {
        const { id: userId } = telegramUser;
        const userRef = doc(db, 'telegramUsers', userId.toString());
        await updateDoc(userRef, { favorite: newValue });
        console.log('User data updated successfully');
      }
    } catch (error) {
      console.error('Error saving user in Firestore:', error);
      throw error;
    }
  };



  const HeartIcon = ({ filled }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="30"
      height="30"
      stroke={filled ? 'none' : 'gray'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#ff4e50", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#f00000", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill={filled ? 'url(#heartGradient)' : 'none'}
      />
    </svg>
  );


  return (
    <div className="h-screen  overflow-y-auto flex flex-col">
      <div className="flex-1 flex flex-col pt-8 px-6 max-w-[728px] mx-auto w-full">

        {/* Scrollable content */}
        <main className="mt-12  flex-1 max-h-[calc(100vh-100px)]">
          <div>
            <div className="relative">
              <div className="p-4 flex justify-center items-center">
                <img
                  src={veicles[current].image}
                  alt="scr"
                  className="h-[150px] object-contain"
                />
              </div>

              <div className="absolute top-[-40%] right-0 sm:right-6 md:right-0 lg:right-10 flex flex-col items-center justify-center pr-2">
                <button onClick={favorite} className="focus:outline-none mb-2 transform scale-150">
                  <HeartIcon filled={isFavoritedSelect} />
                </button>
                <div className="text-white mt-0">
                  <span className="text-[#3CA4EB]  flex justify-center items-center rounded-md w-20 h-8">
                    {totalcounts} Likes
                  </span>
                </div>
              </div>




            </div>

          </div>

          <div className="mt-8">
            <span className="text-[#3CA4EB] bg-[#323B4F] flex justify-center items-center rounded-md w-32 h-12">
              AIRDROP 💳
            </span>
            <div className="mt-6 flex flex-col gap-2">
              {veicles[current].title}
              {veicles[current].description}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Stats;
