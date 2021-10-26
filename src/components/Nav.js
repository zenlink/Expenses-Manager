import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from "../AppContext";
import { MdDehaze } from "react-icons/md";
import { FaRegListAlt } from "react-icons/fa";
import { MdClose } from "react-icons/md";


const Nav = () => {
    const [state, setState] = useContext(AppContext);
    const [isOpen, setIsOpen] = useState(false);
    // const [activeButton, setActiveButton] = useState(0);

    const handleNavButton = () => {
        setIsOpen(!isOpen)
    }
    return (
        <div>
            <nav className="nav">
                <div className="navContainer">
                    <div onClick={handleNavButton}
                        className="navHead">
                        <div className="title"><FaRegListAlt></FaRegListAlt> expenses manager</div>
                        <button className="button">
                            {isOpen ? <MdClose className="navIcon" /> : <MdDehaze className="navIcon" />}
                        </button>
                    </div>

                    <ul className={isOpen ? "navLinks showNav" : "navLinks"}>
                        {state.navArr.map((item, index) => {
                            return (
                                <li key={index}
                                    className={state.activeButton === index? "label":null}
                                    onClick={() => {  setIsOpen(!isOpen); setState(s=>{return{ ...s, currentComponentIndex: index, activeButton: index }}) }}>
                                    {item}
                                </li>
                            )
                        })}

                    </ul>
                </div>
            </nav>
        </div>
    )
}
export default Nav;