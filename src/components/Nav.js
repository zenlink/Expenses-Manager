import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from "../AppContext";



const Nav = () => {
    const [state, setState] = useContext(AppContext);
   
    return (
        <div className="navHead">
            <div className="title" onClick={() => { setState(s => { return { ...s, currentComponentIndex: 0, activeButton: 0 } }) }}>{state.navArr[0]}</div>
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