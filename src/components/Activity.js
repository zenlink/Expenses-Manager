import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from "../AppContext";
import { MdEdit, MdDelete, MdDeleteForever } from "react-icons/md"
import Table from "./Table"

const Activity = () => {
    const [state, setState] = useContext(AppContext);

    return (
        <div>
            {state.expenses && state.expenses.length > 0 ? <Table /> : <div className="noActivity">No Activity</div>}
          
        </div>
    )
}
export default Activity