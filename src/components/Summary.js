import React, { useState, useContext } from 'react';
import { AppContext } from "../AppContext";
import Weekly from './summary/Weekly';
import Monthly from './summary/Monthly';
import HalfYearly from './summary/HalfYearly';
import Yearly from './summary/Yearly';
import All from './summary/All';

const Summary = () => {
    const [state, setState] = useContext(AppContext);
    const [categorySummary, setCategorySummary] = useState([["weekly", <Weekly />], ["monthly", <Monthly />], ["semiyearly", <HalfYearly />], ["yearly", <Yearly />], ["all", <All />]]);
    const [currentSummary, setCurrentSummary] = useState(categorySummary[0][1]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div>
            <div className="navTimeHead">
                <ul className="timeContainer">
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
                                    <div className="singleItem">{item[0]}</div>
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