import React, {useContext} from 'react';
import { AppContext } from "../AppContext";

const Alert = () => {
    const [state, setState] = useContext(AppContext);
    return (
        <div className = {`alert alert-${state.alert.type}`}>
            {state.alert.text}
        </div>
    )
}
export default Alert

