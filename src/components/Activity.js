import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from "../AppContext";
import { MdEdit, MdDelete, MdDeleteForever } from "react-icons/md"

const Activity = () => {
    const [state, setState] = useContext(AppContext);
  
    const handleEdit = (index) => {

        setState(s=>{return{
            ...s, index,
            currentComponentIndex: 0, activeButton: 0
        }})
    }

    const handleDelete = (id) => {
        let undeletedExpenses = state.expenses.filter(x => x.id !== id);
        setState(s=>{return{ ...s, expenses: undeletedExpenses, alert: { show: true, type: "danger", text: "Item deleted" } }})
    }
    const handleClear = () => {
        setState(s=>{return{ ...s, expenses: [], alert: { show: true, type: "danger", text: "All item deleted" } }})
    }
    return (
        <div className="activities">
            <ul className="list">
                {state.expenses && state.expenses.length > 0 ?
                    <li className="item actTitle">
                        <span>date</span><span>exp.</span><span>payee</span><span>cat.</span><span>des.</span><span>act.</span>
                    </li>
                    : <div className="noActivity">No Activity</div>}
                {state.expenses && state.expenses.map((expense, index) => {
                    return (
                            <li className='item' key={index}>
                                <div>{expense.selectedDate.toLocaleString().substring(0,10)}</div>
                                <div >${expense.amount}</div>
                                <div>{expense.payee}</div>
                                <div>{expense.category}</div>
                                <div>{expense.description}</div>
                                <div className="editButton" onClick={() => handleEdit(index)}><MdEdit /></div>
                                <div className="deleteButton" onClick={() => handleDelete(expense.id)}><MdDelete /></div>
                            </li>
                    )
                })}
            </ul>
            {state.expenses.length > 0 &&
                (<button onClick={handleClear} className="btn deleteAll" >Clear All
            <MdDeleteForever className="btn-icon "></MdDeleteForever></button>)}
        </div>
    )
}
export default Activity