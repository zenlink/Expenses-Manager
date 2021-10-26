import React, { useState, createContext } from 'react';
import Expense from './components/Expense';
import Summary from './components/Summary';
import Activity from './components/Activity';
import Chart from './components/Chart';


const AppContext = createContext([{}, () => { }]);

const AppProvider = (props) => {
    const [state, setState] = useState({
        alert: {
            show: false,
            type: null,
            text: null,
        },
        index: -1,
        expenses: [],
        categories: ["Mortgage", "Insurances", "Utilities", "Food", "Personal", "Recreation", "Invest","Automobile", "Clothes", "Tax", "Health care", "Household", "Family", "Misc."],
        color:["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "pink", "#a65628", "#f781bf", "#999999","#8dd3c7", "#98243A", "#bebada", "blue", "#80b1d3"], 
        // timeLabelArr: [ [<MdViewWeek />, "weekly"], [<MdDvr />,"monthly"], [<MdViewAgenda/>,"half Yearly"], [<MdFilterNone/>,"yearly"],[<MdPresentToAll/>,"all"]],
       currentComponentIndex: 0, 
       
        activeButton: 0,
        navArr: ["expense", "activity", "summary", ],
        componentsArr: [<Expense />, <Activity />, <Summary />, ]
    });
    return (
        <AppContext.Provider value={[state, setState]}>
            {props.children}
        </AppContext.Provider>
    );
}

export { AppContext, AppProvider };