import React from "react";
import boost from "../images/boost.webp";
import tasks from "../images/tasks.webp";
import lot from '../images/lot.svg'
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const Footer = () => {
  const task = useSelector((state) => state.tasks.task);
  const redDotStyle = {
    width: '10px',
    height: '10px',
    backgroundColor: 'red',
    borderRadius: '50%',
    position: 'absolute',
    top: '27px',
    left: '32%',
  };
  return (
    <div className="flex items-center justify-center w-full space-x-1">
      <NavLink
        to="/ref"
        className={({ isActive }) => {
          return `

${isActive
              ? "w-[20%] h-[65px] pt-1 bg-activebg border-[1px] border-activeborder flex flex-col rounded-[10px] items-center justify-center text-[#fff] text-[15px]"
              : "w-[20%] h-[65px] pt-1 bg-cards border-[1px] border-borders flex flex-col rounded-[10px] items-center justify-center text-[#fff] text-[15px]"
            }
    `;
        }}
      >
        <img src={require('../images/stats.png')} className="w-[32px] -mb-1" alt="ref" />
        <span className="font-medium">Inside</span>
      </NavLink>
      <NavLink
        to="/tasks"
        className={({ isActive }) => {
          return `

${isActive
              ? "w-[20%] h-[65px] pt-1 bg-activebg border-[1px] border-activeborder flex flex-col rounded-[10px] items-center justify-center text-[#fff] text-[15px]"
              : "w-[20%] h-[65px] pt-1 bg-cards border-[1px] border-borders flex flex-col rounded-[10px] items-center justify-center text-[#fff] text-[15px]"
            }
    `;
        }}
      >
        <img src={tasks} className="w-[30px]" alt="tasks" />
        {task && (<div style={redDotStyle}></div>)}
        <span className="font-medium">Tasks</span>
      </NavLink>

      {/*  */}

      <NavLink
        to="/"
        className={({ isActive }) => {
          return `

${isActive
              ? "w-[20%] h-[65px] pt-1 bg-activebg border-[1px] border-activeborder flex flex-col rounded-[10px] items-center justify-center text-[#fff] text-[15px]"
              : "w-[20%] h-[65px] pt-1 bg-cards border-[1px] border-borders flex flex-col rounded-[10px] items-center justify-center text-[#fff] text-[15px]"
            }
    `;
        }}
      >
        <img src={require('../images/coinsmall.png')} className="w-[30px] -mb-[1px]" alt="tap" />
        <span className="font-medium">Earn</span>
      </NavLink>

      <NavLink
        to="/boost"
        className={({ isActive }) => {
          return `

${isActive
              ? "w-[20%] h-[65px] pt-[8px] bg-activebg border-[1px] border-activeborder flex flex-col rounded-[10px] items-center justify-center text-[#fff] text-[15px]"
              : "w-[20%] h-[65px] pt-[8px] bg-cards border-[1px] border-borders flex flex-col rounded-[10px] items-center justify-center text-[#fff] text-[15px]"
            }
    `;
        }}
      >
        <img src={boost} className="w-[28px] -mb-[2px]" alt="boost" />
        <span className="font-medium">Boost</span>
      </NavLink>
      <NavLink
        to="/cards"
        className={({ isActive }) => {
          return `

${isActive
              ? "w-[20%] h-[65px] pt-[8px] bg-activebg border-[1px] border-activeborder flex flex-col rounded-[10px] items-center justify-center text-[#fff] text-[15px]"
              : "w-[20%] h-[65px] pt-[8px] bg-cards border-[1px] border-borders flex flex-col rounded-[10px] items-center justify-center text-[#fff] text-[15px]"
            }
    `;
        }}
      >
        <img src={require('../images/card.png')} className="w-[28px] -mb-[2px]" alt="boost" />
        <span className="font-medium">Cards</span>
      </NavLink>

      {/*  */}

      <NavLink
        to="/stats"
        className={({ isActive }) => {
          return `

${isActive
              ? "w-[20%] h-[65px] pt-[8px] bg-activebg border-[1px] border-activeborder flex flex-col rounded-[10px] items-center justify-center text-[#fff] text-[15px]"
              : "w-[20%] h-[65px] pt-[8px] bg-cards border-[1px] border-borders flex flex-col rounded-[10px] items-center justify-center text-[#fff] text-[15px]"
            }
    `;
        }}
      >
        <img src={lot} className="w-[24px]" alt="stats" />
        <span className="font-medium">Airdrop</span>
      </NavLink>
    </div>
  );
};

export default Footer;
