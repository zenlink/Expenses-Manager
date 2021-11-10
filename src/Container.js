import React, { useContext, useEffect } from 'react';
import { AppContext } from "./AppContext";
import Alert from './components/Alert'

// let initialExpenses = localStorage.getItem("spending") ? JSON.parse(localStorage.getItem("spending")) : [];

const Container = () => {
    const [state, setState] = useContext(AppContext);

    // useEffect(() => {
    //     localStorage.setItem("spending", JSON.stringify(state.expenses));

    // }, [state.expenses]);

    // useEffect(() => {
        // convert date to obj
        // for (let i = 0; i < initialExpenses.length; i++) {
        //     let obj = initialExpenses[i]
        //     obj.selectedDate = new Date(obj.selectedDate)
        // }
        // Sort descending
        // initialExpenses.sort((a, b) => {
        //     return (new Date(b.selectedDate) - new Date(a.selectedDate))
        // })

    //     setState(s => { return { ...s, expenses: initialExpenses } });
    // }, [])
    useEffect(() => {
        if (state.alert.show) {
            setTimeout(() => {
                setState((s) => { return { ...s, alert: { show: false } } })
            }, 2000)
        }
    }, [state.alert.show])

    return (
        <div className="container">
            {state.alert.show && <Alert />}
            {state.componentsArr[state.currentComponentIndex]}
        </div>
    )
}
export default Container;