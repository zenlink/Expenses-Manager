import React, { useState, useContext } from 'react';
import { AppContext } from "../AppContext";
import { FaAlignRight } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import Weekly from './summary/Weekly';
import Monthly from './summary/Monthly';
import HalfYearly from './summary/HalfYearly';
import Yearly from './summary/Yearly';
import All from './summary/All';
import { createContext } from 'vm';


const Summary = () => {
    const [state, setState] = useContext(AppContext);
    const [categorySummary, setCategorySummary] = useState([["weekly", <Weekly />], ["monthly", <Monthly />], ["semiyearly", <HalfYearly />], ["yearly", <Yearly />], ["all", <All />]]);
    const [currentSummary, setCurrentSummary] = useState(categorySummary[0][1]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(true);

    const handleTimeNav = () => {
        setIsOpen(!isOpen)
    }
    const getWeekRange = (day) => {
        var curr = new Date; // get current date
        var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
        var last = first + 6; // last day is the first day + 6

        var firstday = new Date(curr.setDate(first));
        var lastday = new Date(curr.setDate(last));


        /*    let data = JSON.parse(localStorage.getItem("expenses"))
            let total = 0;
            for (let i=0;i<data.length;i++)
            {
                console.log(data[i])
                let tdate = new Date(data[i].selectedDate)
                if (tdate>=firstday && tdate<=lastday)
                    total += Math.float.parseFloat(data[i].amount);
            }
            console.log(total)
        */
    }

    getWeekRange(null)
    return (
        <div>
            <div className="navTimeHead">
                {/* <button onClick={handleTimeNav} className="button">
                {isOpen ?  <FaAlignRight className="navIcon" />:<MdClose className="navIcon" /> }
                </button> */}

                <ul className= "timeContainer">
                    {categorySummary.map((item, index) => {
                        return (
                            <>
                                <li onClick={() => {
                                    setCurrentSummary(categorySummary[index][1]);
                                    setCurrentIndex(index);
                                    setIsOpen(!isOpen);
                                }}
                                    className={currentIndex === index ? "timeLabel currentLabel" : "timeLabel"}
                                    key={index}>
                                    <div className ="singleItem">{item[0]}</div>
                                    {/* <div >{item[1]}</div> */}

                                </li>
                            </>
                        )
                    })}
                </ul>
            </div>
            <div className="currentSummary">
                {currentSummary}
            </div>
        </div>

    )
}
export default Summary;