import React, { useState, useRef, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the path as needed
import styled, { keyframes } from "styled-components";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import Spinner from '../Components/Spinner';
import { useUser } from '../context/userContext';
import Levels from '../Components/Levels';
import flash from "../images/flash.webp";
import { IoCheckmarkCircle, IoClose } from 'react-icons/io5';
import ref from '../images/ref.webp';
import { useNavigate } from 'react-router-dom';
import lot from '../images/lot.webp';

const slideUp = keyframes`
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  80% {
    opacity: 1;
    transform: translateY(-350px);
  }
  100% {
    opacity: 0;
    transform: translateY(-350px);
  }
`;

const SlideUpText = styled.div`
  position: absolute;
  animation: ${slideUp} 3s ease-out;
  font-size: 2.1em;
  color: #ffffffa6;
  font-weight: 600;
  left: ${({ x }) => x}px;
  top: ${({ y }) => y}px;
  pointer-events: none;
`;

const Container = styled.div`
  position: relative;
  display: inline-block;
  text-align: center;
  width: 100%;
  height: 100%;
`;

const Plutos = () => {
  const imageRef = useRef(null);
  const [clicks, setClicks] = useState([]);
  const { referrals, balance, tapBalance, energy, battery, tapGuru, mainTap, setIsRefilling, refillIntervalRef, refillEnergy, setEnergy, tapValue, setTapBalance, setBalance, refBonus, level, id } = useUser();
  const [copied, setCopied] = useState(false);
  const [congrats, setCongrats] = useState(false);
  const [showLevels, setShowLevels] = useState(false);
  const debounceTimerRef = useRef(null);
  const isUpdatingRef = useRef(false);
  const accumulatedBalanceRef = useRef(balance);
  const accumulatedEnergyRef = useRef(energy);
  const accumulatedTapBalanceRef = useRef(tapBalance);
  const refillTimeoutRef = useRef(null);
  const [showMining, setShowMining] = useState(false);
  const [showInvitation, setShowInvitation] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  function triggerHapticFeedback() {
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isIOS && window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    } else if (isAndroid && 'vibrate' in navigator) {
      navigator.vibrate(50);
    } else {
      console.warn('Haptic feedback not supported on this device.');
    }
  }

  const handleClick = (e) => {
    triggerHapticFeedback();

    if (energy <= 0 || isUpdatingRef.current) {
      return;
    }

    const { offsetX, offsetY, target } = e.nativeEvent;
    const { clientWidth, clientHeight } = target;

    const horizontalMidpoint = clientWidth / 2;
    const verticalMidpoint = clientHeight / 2;

    const animationClass =
      offsetX < horizontalMidpoint
        ? 'wobble-left'
        : offsetX > horizontalMidpoint
        ? 'wobble-right'
        : offsetY < verticalMidpoint
        ? 'wobble-top'
        : 'wobble-bottom';

    imageRef.current.classList.remove(
      'wobble-top',
      'wobble-bottom',
      'wobble-left',
      'wobble-right'
    );

    imageRef.current.classList.add(animationClass);

    setTimeout(() => {
      imageRef.current.classList.remove(animationClass);
    }, 500);

    const rect = e.target.getBoundingClientRect();
    const newClick = {
      id: Date.now(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    setClicks((prevClicks) => [...prevClicks, newClick]);

    setEnergy((prevEnergy) => {
      const newEnergy = Math.max(prevEnergy - tapValue.value, 0);
      accumulatedEnergyRef.current = newEnergy;
      return newEnergy;
    });

    setBalance((prevBalance) => {
      const newBalance = prevBalance + tapValue.value;
      accumulatedBalanceRef.current = newBalance;
      return newBalance;
    });

    setTapBalance((prevTapBalance) => {
      const newTapBalance = prevTapBalance + tapValue.value;
      accumulatedTapBalanceRef.current = newTapBalance;
      return newTapBalance;
    });

    setTimeout(() => {
      setClicks((prevClicks) =>
        prevClicks.filter((click) => click.id !== newClick.id)
      );
    }, 1000);

    clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(updateFirestore, 1000);

    clearInterval(refillIntervalRef.current);
    setIsRefilling(false);
    clearTimeout(refillTimeoutRef.current);
    refillTimeoutRef.current = setTimeout(() => {
      if (energy < battery.energy) {
        refillEnergy();
      }
    }, 1000);
  };

  const handleClickGuru = (e) => {
    // Implementation similar to handleClick, but with guru-specific logic
    // ...
  };

  const updateFirestore = async () => {
    const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (telegramUser) {
      const { id: userId } = telegramUser;
      const userRef = doc(db, 'telegramUsers', userId.toString());

      isUpdatingRef.current = true;

      try {
        await updateDoc(userRef, {
          balance: accumulatedBalanceRef.current,
          energy: accumulatedEnergyRef.current,
          tapBalance: accumulatedTapBalanceRef.current,
        });

        accumulatedBalanceRef.current = balance;
        accumulatedEnergyRef.current = energy;
        accumulatedTapBalanceRef.current = tapBalance;
      } catch (error) {
        console.error('Error updating balance and energy:', error);
      } finally {
        isUpdatingRef.current = false;
      }
    }
  };

  const energyPercentage = (energy / battery.energy) * 100;

  const formatNumber = (num) => {
    if (num < 100000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else if (num < 1000000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else {
      return (num / 1000000).toFixed(3).replace(".", ".") + " M";
    }
  };

  const startMining = () => {
    setShowMining(false);
    navigate('/cards');
  };

  const copyToClipboard = () => {
    const reflink = `https://t.me/ENIGMA_TOOL_BOT?start=r${id}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(reflink)
        .then(() => {
          setCopied(true);
          setShowInvitation(false);
          setCongrats(true);
          setTimeout(() => setCopied(false), 10000);
          setTimeout(() => {
            setCongrats(false);
          }, 4000);
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = reflink;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy", err);
      }
      document.body.removeChild(textArea);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col justify-center w-full overflow-hidden">
      {/* Invitation Modal */}
      {showInvitation && (
        <div className="absolute bottom-0 left-0 right-0 h-fit bg-[#1e2340f7] z-[100] rounded-tl-[20px] rounded-tr-[20px] flex justify-center px-4 py-5">
          {/* Invitation modal content */}
          <button onClick={() => setShowInvitation(false)}>
            <IoClose size={24} className="text-[#9a96a6]" />
          </button>
          {/* ... other invitation content ... */}
          <button onClick={copyToClipboard}>Copy</button>
        </div>
      )}

      {/* Mining Modal */}
      {showMining && (
        <div className="absolute bottom-0 left-0 right-0 h-fit bg-[#1e2340f7] z-[100] rounded-tl-[20px] rounded-tr-[20px] flex justify-center px-4 py-5">
          {/* Mining modal content */}
          <button onClick={() => setShowMining(false)}>
            <IoClose size={24} className="text-[#9a96a6]" />
          </button>
          {/* ... other mining content ... */}
          <button onClick={startMining}>Start Mining</button>
        </div>
      )}

      {/* Top Section with Counters */}
      <div className="border-[1px] border-borders flex items-center justify-between mx-[25px] p-2 bg-[#1F2942] rounded-lg">
        {/* Counter items */}
        {/* ... */}
      </div>

      {/* Bottom Section */}
      <div className="flex items-center justify-between m-1 p-1 mt-[0.5px] rounded-lg w-full">
        {/* Level and Invite buttons */}
        <div onClick={() => setShowLevels(true)} className="cursor-pointer flex border-[1px] border-borders items-center justify-center w-auto max-w-[200px] bg-[#1F2942] rounded-lg ml-4 p-1">
          <img src={level.imgUrl} className="w-[30px] mr-2" alt="level" />
          <h2 className="cursor-pointer text-[17px] font-normal text-white">
            {level.name}
          </h2>
          <MdOutlineKeyboardArrowRight className="w-[30px] h-[30px] text-[#9d99a9] mt-[2px]" />
        </div>

        <div className="flex cursor-pointer border-[1px] border-borders P-1 bg-[#1F2942] rounded-lg justify-center w-[110px] mr-6">
          <img src={ref} className="w-[37px] mr-2" alt="invite" />
          <button
            onClick={() => setShowInvitation(true)}
            className="flex items-center justify-center text-white font-normal py-1 text-[17px] rounded-md w-full"
          >
            Invite
            <MdOutlineKeyboardArrowRight className="w-[30px] h-[30px] mr-1 text-[#9d99a9]" />
          </button>
        </div>
      </div>

      {/* Balance Display */}
      <div className="flex space-x-[2px] justify-center items-center">
        <div className="w-[50px] h-[50px]">
          <img src={require('../images/coinsmall.png')} className="w-[40px] mt-1" alt="coin" />
        </div>
        <h1 className="text-[#fff] text-[42px] font-extrabold">
          {formatNumber(balance + refBonus)}
        </h1>
      </div>

      {/* Main Game Area */}
      <div className="relative flex items-center justify-center w-full pb-24">
        <div className="bg-[#35389e] blur-[50px] absolute rotate-[35deg] w-[400px] h-[160px] top-10 -left-40 rounded-full"></div>

        <div className={`pyro ${tapGuru ? 'block' : 'hidden'}`}>
          <div className="before"></div>
          <div className="after"></div>
        </div>

        <div className="w-[350px] h-[350px] relative flex items-center justify-center">
          <img src="/lihgt.webp" alt="light" className={`mb-12 ml-3 absolute w-[330px] rotate-45 ${tapGuru ? 'block' : 'hidden'}`} />

          <div className="image-container mb-10">
            {mainTap && (
              <Container>
                <img
                  onPointerDown={handleClick}
                  ref={imageRef}
                  src={require('../images/bcen.png')}
                  alt="Wobble"
                  className="wobble-image !w-[270px] select-none"
                />
                {clicks.map((click) => (
                  <SlideUpText key={click.id} x={click.x} y={click.y}>
                    +{tapValue.value}
                  </SlideUpText>
                ))}
              </Container>
            )}
            {tapGuru && (
              <Container>
                <img
                  onPointerDown={handleClickGuru}
                  ref={imageRef}
                  src={require('../images/bcen.png')}
                  alt="Wobble"
                  className="wobble-image !w-[270px] select-none"
                />
                {clicks.map((click) => (
                  <SlideUpText key={click.id} x={click.x} y={click.y}>
                    +{tapValue.value * 5}
                  </SlideUpText>
                ))}
              </Container>
            )}
          </div>
        </div>
      </div>

      {/* Energy Bar */}


            <div className="flex flex-col space-y-6 fixed bottom-[120px] left-0 right-0 justify-center items-center px-5">
              <div className="flex flex-col items-center justify-center w-full">
                <div className="flex pb-[6px] space-x-1 items-center justify-center text-[#fff]">
                  <img alt="flash" src={flash} className="w-[20px]" />
                  <div>
                    <span className="text-[14px] font-bold">{energy.toFixed(0)}</span>
                    <span className="text-[14px] font-medium">/ {battery.energy}</span>
                  </div>
                </div>
                <div className="flex w-full p-[4px] h-[20px] items-center bg-energybar rounded-[12px] border-[1px] border-borders2">
                  <div
                    className="bg-[#D329E9] h-full rounded-full transition-width duration-100"

                    style={{ width: `${energyPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className={`${congrats === true ? "visible bottom-6" : "invisible bottom-[-10px]"} z-[60] ease-in duration-300 w-full fixed left-0 right-0 px-4`}>
              <div className="w-full text-[#54d192] flex items-center space-x-2 px-4 bg-[#121620ef] h-[50px] rounded-[8px]">
                <IoCheckmarkCircle size={24} className="" />
                <span className="font-medium">
                  Good
                </span>
              </div>
            </div>

            <Levels showLevels={showLevels} setShowLevels={setShowLevels} />
          </div>

       
      )}
    </>
  );

};


export default Plutos;
