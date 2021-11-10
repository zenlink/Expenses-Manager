import React, { useContext, useEffect } from 'react';
import { AppContext } from "./AppContext";
import Alert from './components/Alert'


const Container = () => {
    const [state, setState] = useContext(AppContext);

    // useEffect(() => {
    //     localStorage.setItem("spending", JSON.stringify(state.expenses));

    // }, [state.expenses]);

    useEffect(() => {
        if (state.alert.show) {
            setTimeout(() => {
                setState((s) => { return { ...s, alert: { show: false } } })
            }, 2000)
        }
    }, [state.alert.show])

    return (
        <div>
            {state.alert.show && <Alert />}
            {state.componentsArr[state.currentComponentIndex]}
        </div>
    )
}
export default Container;