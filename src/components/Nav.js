import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from "../AppContext";
import { FaGithub } from "react-icons/fa";

const Nav = () => {
    const [state, setState] = useContext(AppContext);

    const handleGithubClick = () => {
        window.location.href = "https://github.com/zenlink/Expenses-Manager"
    }
    return (
        <div className="navHead">
            <div className="title" onClick={() => { setState(s => { return { ...s, currentComponentIndex: 0, activeButton: 0 } }) }}>{state.navArr[0]}
                <span className="githubicon"><FaGithub onClick={handleGithubClick} /></span></div>
            <div className="navLinks">
                {state.navArr.map((x, index) => {
                    return (
                        index !== 0 && <div className={state.activeButton === index ? "label" : "singleItem"}
                            onClick={() => { setState(s => { return { ...s, currentComponentIndex: index, activeButton: index } }) }}>{x}</div>
                    )
                })}
            </div>
        </div>
    )
}
export default Nav;