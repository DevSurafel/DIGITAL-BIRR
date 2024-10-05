import React, { useState, useRef } from "react";
import { useUser } from "../context/userContext";
import { IoCheckmarkCircle, IoClose } from "react-icons/io5";







const chargingValues = [
    {
        level: 1,
        duration: 10,
        step: 600,
    },
    {
        level: 2,
        duration: 6,
        step: 360,
    },
    {
        level: 3,
        duration: 4,
        step: 240,
    },
    {
        level: 4,
        duration: 2,
        step: 120,
    },
    {
        level: 5,
        duration: 1,
        step: 60,
    },
]
const upgradeCosts = [0, 2000, 5000, 10000, 20000, 40000, 80000, 100000, 150000, 200000, 250000, 300000, 400000, 500000];


const energyUpgradeCosts = [0, 3000, 6000, 12000, 24000, 50000, 100000, 200000, 300000, 400000, 600000, 800000, 1000000, 2000000];


const chargingUpgradeCosts = [0, 2000, 30000, 100000, 200000];


const Cards = () => {

    const { balance, id, freeGuru, refiller, setRefiller, setFreeGuru, setTapGuru, fullTank, setFullTank, setMainTap, startTimer, timeRefill, setTimeRefill, tapValue, cardsValue, setCardsValue, setTapValue, battery, setEnergy, setBattery, setBalance, refBonus, setProfitPerHour } = useUser();
    const [openInfo, setOpenInfo] = useState(false);
    const [openInfoTwo, setOpenInfoTwo] = useState(false);
    const [isUpgradeModalVisible, setIsUpgradeModalVisible] = useState(false);
    const [isUpgradeModalVisibleEn, setIsUpgradeModalVisibleEn] = useState(false);
    const [isUpgradeModalVisibleEnc, setIsUpgradeModalVisibleEnc] = useState(false);
    const [congrats, setCongrats] = useState(false)
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [isUpgradingEn, setIsUpgradingEn] = useState(false);
    const [isUpgradingEnc, setIsUpgradingEnc] = useState(false);
    const [guru, setGuru] = useState(false);
    const [tank, setTank] = useState(false);
    const [bot, setBot] = useState(false);
    const [showCards, setshowCards] = useState(false)
    const [blurItem, setBlurItem] = useState([]);
    const [blurredCardId, setBlurredCardId] = useState([]);
    const [image, setImage] = useState();
    const [index, setIndex] = useState(0);

    const [selectedCards, setSelectedCards] = useState([]);
    const [timers, setTimers] = useState({});

    const [startTimerClock, setStartTimerClock] = useState(false);
    const infoRef = useRef(null);
    const infoRefTwo = useRef(null);

    const handleClickOutside = (event) => {
        if (infoRef.current && !infoRef.current.contains(event.target)) {
            setOpenInfo(false);
        }
        if (infoRefTwo.current && !infoRefTwo.current.contains(event.target)) {
            setOpenInfoTwo(false);
        }
    };


    // useEffect(() => {
    //     if (openInfo || openInfoTwo) {
    //         document.addEventListener('mousedown', handleClickOutside);
    //     } else {
    //         document.removeEventListener('mousedown', handleClickOutside);
    //     }

    //     return () => {
    //         document.removeEventListener('mousedown', handleClickOutside);
    //     };
    // }, [openInfo, openInfoTwo]);

    const formatNumber = (num) => {
        if (num < 1000) {
            // Less than 1,000: no suffix
            return num.toString();
        } else if (num < 1000000) {
            // From 1,000 to less than 1,000,000: add 'k'
            return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
        } else if (num < 1000000000) {
            // From 1,000,000 to less than 1 billion: add 'M'
            return (num / 1000000).toFixed(2).replace(/\.0+$/, "") + "M";
        } else if (num < 1000000000000) {
            // From 1 billion to less than 1 trillion: add 'B'
            return (num / 1000000000).toFixed(2).replace(/\.0+$/, "") + "B";
        } else {
            // 1 trillion or more: add 'T'
            return (num / 1000000000000).toFixed(2).replace(/\.0+$/, "") + "T";
        }
    };



    const handleUpgrade = async () => {
        setshowCards(false)
        // const updatedData = cardData.map((card) => {
        //     if (card.index === index) {
        //         return { ...card, blur: !card.blur, timer: !card.timer };
        //     }
        //     return card;
        // });
        // setCardData(updatedData);

        // const nextLevel = cardsValue.level;
        // const upgradeCost = upgradeCosts[nextLevel];
        // if (nextLevel < cardValues.length && (balance + refBonus) >= upgradeCost && id) {
        //     const newTapValue = cardValues[nextLevel];
        //     const userRef = doc(db, 'telegramUsers', id.toString());
        //     try {
        //         await updateDoc(userRef, {
        //             cardsValue: newTapValue,
        //             balance: balance - upgradeCost,

        //         });
        //         setCardsValue(newTapValue);
        //         setBalance((prevBalance) => prevBalance - upgradeCost);

        //         console.log('Tap value upgraded successfully');
        //     } catch (error) {
        //         console.error('Error updating tap value:', error);
        //     }

        // }

    };

    // const nextUpgradeCost = upgradeCosts[tapValue.level];
    // // const hasSufficientBalance = (balance + refBonus) >= nextUpgradeCost;
    // const hasSufficientBalance = true;
    // const nextEnergyUpgradeCost = energyUpgradeCosts[battery.level];
    // const hasSufficientBalanceEn = (balance + refBonus) >= nextEnergyUpgradeCost;

    // const nextChargingUpgradeCost = chargingUpgradeCosts[timeRefill.level];
    // const hasSufficientBalanceEnc = (balance + refBonus) >= nextChargingUpgradeCost;

    // const [isDisabled, setIsDisabled] = useState(false);

    //Display Cards
    const DisplayCards = (item, index) => {
        // if (item.timer === true) {
        //     return false;
        // }
        setshowCards(true);
        setImage(item.image)
        setIndex(index)
        // toggleCardSelection(index);

    }




    // useEffect(() => {
    //     const intervals = {};

    //     // Set up timers for selected cards
    //     selectedCards.forEach((index) => {
    //         if (timers[index] > 0) {
    //             intervals[index] = setInterval(() => {
    //                 setTimers((prev) => {
    //                     const newTimer = prev[index] - 1;
    //                     if (newTimer <= 0) {
    //                         clearInterval(intervals[index]);

    //                         return { ...prev, [index]: 0 }; // Ensure timer doesn't go below 0
    //                     }
    //                     return { ...prev, [index]: newTimer };
    //                 });
    //             }, 1000); // Decrement timer every second
    //         }
    //     });

    //     return () => {
    //         // Cleanup intervals on unmount
    //         Object.values(intervals).forEach(clearInterval);
    //     };
    // }, [selectedCards, timers]);
    // const formatTime = (seconds) => {
    //     const minutes = Math.floor(seconds / 60);
    //     const remainingSeconds = seconds % 60;
    //     return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    // };

    // const toggleCardSelection = (index) => {
    //     setSelectedCards((prev) => {
    //         if (prev.includes(index)) {
    //             return prev.filter((id) => id !== index); // Deselect the card
    //         }
    //         return [...prev, index]; // Select the card
    //     });
    // };


    // const handlerRechargeUpgrade = async () => {
    //     setIsUpgradingEnc(true);
    //     const nextChargingLevel = timeRefill.level;
    //     const chargingUpgradeCost = chargingUpgradeCosts[nextChargingLevel];
    //     if (nextChargingLevel < chargingValues.length && (balance + refBonus) >= chargingUpgradeCost && id) {
    //         const newChargingValue = chargingValues[nextChargingLevel];
    //         const userRef = doc(db, 'telegramUsers', id.toString());
    //         try {
    //             await updateDoc(userRef, {
    //                 timeRefill: newChargingValue,
    //                 balance: balance - chargingUpgradeCost,
    //             });
    //             setTimeRefill(newChargingValue);
    //             setBalance((prevBalance) => prevBalance - chargingUpgradeCost);
    //             setIsUpgradingEnc(false);
    //             setEnergy(battery.energy);
    //             setCongrats(true)
    //             setIsUpgradeModalVisibleEnc(false);
    //             setTimeout(() => {
    //                 setCongrats(false)
    //             }, 2000)
    //             console.log('Energy value upgraded successfully');
    //             console.log('Energy value upgraded successfully +', newChargingValue.value);
    //         } catch (error) {
    //             console.error('Error updating energy value:', error);
    //         }

    //     }

    // };
    const CardData = [
        {
            title: 'Binance',
            image: require("../images/binance.png"),
            subtitle: 'Reward',
            price: 16100,
            amount: 200000,
    
        },
    
        {
    
            title: 'Dogs',
            image: require("../images/dog.png"),
            subtitle: 'Reward',
            price: 900,
            amount: 100000,
    
        }, {
    
            title: 'Krypto',
            image: require("../images/paragon.png"),
            subtitle: 'Reward',
            price: 25000,
            amount: 1900000,
        }, {
    
            title: 'Ethereum',
            image: require("../images/Ethreum.png"),
            subtitle: 'Reward',
            price: 12000,
            amount: 200000,
        }, {
    
            title: 'Litecoin',
            image: require("../images/litecoin.png"),
            subtitle: 'Reward',
            price: 2510,
            amount: 4000000,
        }, {
    
            title: 'BitCoin ',
            image: require("../images/bitcoincash.png"),
            subtitle: 'Reward',
            price: 20000,
            amount: 1200000,
        }, {
    
            title: 'Thether',
            image: require("../images/tether.png"),
            subtitle: 'Reward',
            price: 16100,
            amount: 9000000,
        },
        {
            title: 'Notcoin',
            image: require("../images/notcoin.png"),
            subtitle: 'Reward',
            price: 6000,
            amount: 100000,
        },
    ]

    const chunkArray = (array, size) => {
        const chunkedArray = [];
        for (let i = 0; i < array.length; i += size) {
            chunkedArray.push(array.slice(i, i + size));
        }
        return chunkedArray;
    };

    const chunkedData = chunkArray(CardData, 2); // Chunk the data into groups of two

    return (
        <div className="w-full">
            <div className={`${congrats === true ? "visible bottom-6" : "invisible bottom-[-10px]"} z-[60] ease-in duration-300 w-full fixed left-0 right-0 px-4`}>
                <div className="w-full text-[#54d192] flex items-center space-x-2 px-4 bg-[#121620ef] h-[50px] rounded-[8px]">



                    <IoCheckmarkCircle size={24} className="" />

                    <span className="font-medium">
                        Good
                    </span>

                </div>


            </div>
            <div
                className={`${showCards === true ? "visible" : "invisible"
                    } absolute bottom-0 left-0 right-0 h-fit bg-[#1e2340f7] z-[100] rounded-tl-[20px] rounded-tr-[20px] flex justify-center px-4 py-5`}
            >
                <div className="w-full flex flex-col justify-between py-8">
                    <button
                        onClick={() => setshowCards(false)}
                        className="flex items-center justify-center absolute right-8 top-8 text-center rounded-[12px] font-medium text-[16px]"
                    >
                        <IoClose size={24} className="text-[#9a96a6]" />
                    </button>

                    <div className="w-full flex justify-center flex-col items-center">
                        <div className="w-[120px] h-[120px] rounded-[25px] bg-[#252e57] flex items-center justify-center">
                            <img alt="claim" src={image} className="w-[100px] h-[100px]" />
                        </div>
                        <h3 className="font-semibold text-[32px] py-4">
                            X2 Income
                        </h3>
                        <div className=" text-[18px]">
                            Tap the menu diamond to buy upgrades for your income
                        </div>

                        <div className="flex flex-1 items-center space-x-2">

                        </div>
                    </div>

                    <div className="w-full flex justify-center pb-6 pt-4">
                        <button
                            // onClick={handleUpgrade}
                            // disabled={!hasSufficientBalance}
                            className={`w-full py-5 px-3 flex items-center justify-center bg-gradient-to-b from-[#3a5fd4] to-[#5078e0] text-center rounded-[12px] font-semibold text-[22px]`}
                        >
                            {/* {isUpgrading ? 'Boosting...' : hasSufficientBalance ? 'Get it!' : 'Insufficient Balance'} */}
                            Comming Soon
                        </button>
                    </div>
                </div>
            </div>
            <div className="w-full items-center justify-center pb-2 flex ">
                <h2 className="text-[#9d99a9] text-[20px] font-medium">
                    Your Total Balance
                </h2>
            </div>
            <div className="flex space-x-1 ml-[-8px] justify-center items-center ">
                <div className="w-[50px] h-[50px]">
                    <img src={require('../images/coinsmall.png')} className="w-full" alt="coin" />
                </div>
                <h1 className="text-[#fff] text-[42px] font-extrabold">
                    {formatNumber(balance + refBonus)}
                </h1>
            </div>
            <div className="bg-borders w-full px-5 h-[1px] !mt-3 !mb-5 " ></div>

            <div className="max-h-[400px] overflow-y-scroll">
                {chunkedData.map((row, rowIndex) => (
                    <div
                        key={rowIndex}
                        className="flex justify-between items-center mb-4 m-5 max-h-[500px]"

                    >
                        {row.map((item, index) => (
                            <button
                                onClick={() => DisplayCards(item, item.index)}
                                key={index}
                                className={` w-[48%] border-[1px] border-borders rounded-[8px] p-[16px] flex flex-col items-start bg-cards
                        `}
                            >

                                <div className="flex w-full items-center">
                                    <div className="w-[40px] h-[40px] flex items-center justify-center mr-[12px]">
                                        <img
                                            src={item.image}
                                            alt="Description of your new image"
                                            className={`w-full`}
                                        />

                                    </div>
                                    <div className="flex flex-1 flex-col">
                                        <span className={`text-white font-semibold `}>{item.title}</span>
                                        <span className={`text-gray-400 text-[10px] font-medium`}>{item.subtitle}</span>
                                        <div className="flex items-center justify-center relative">
                                            {/* Conditionally render the timer or price based on item.blur */}

                                            <div className="flex items-center justify-center">
                                                <img src={require('../images/coinsmall.png')} alt="Price icon" className="w-[16px] h-[16px] mr-2" />
                                                <span className="text-[14px] font-medium">{formatNumber(item.price)}</span>
                                            </div>

                                        </div>

                                    </div>
                                </div>


                                <hr className="w-full my-[8px] border-gray-600" />


                                <div className="flex justify-between w-full items-center relative">
                                    {/* Level Section */}

                                    <span className={`text-gray-400 text-[14px] `}> 0 lvl</span>

                                    {/* Timer Display in the Center */}

                                    {/* Coins Section */}
                                    <div className={`flex items-center `}>
                                        <img
                                            src={require('../images/coinsmall.png')}
                                            className="w-5 h-5 mr-1"
                                            alt="Coin Icon"
                                        />
                                        <span className={`text-[16px] font-semibold `}>{formatNumber(item.amount)}</span>
                                    </div>
                                </div>



                                {/* Timer section: display only when card is blurred */}

                            </button>
                        ))}
                    </div>
                ))}
            </div>


        </div>
    );
}
export default Cards;