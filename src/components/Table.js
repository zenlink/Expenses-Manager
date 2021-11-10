import React, { useState, useContext } from 'react';
import { AppContext } from "../AppContext";
import { MdArrowDownward, MdArrowUpward, MdEdit, MdDelete } from "react-icons/md";


const rowArr = [5, 10, 20];

const Table = () => {
    const [state, setState] = useContext(AppContext);
    const [isCatDescend, setIsCatDescend] = useState(true);
    const [isExpDescend, setIsExpDescend] = useState(true);
    const [isPayeeDescend, setIsPayeeDescend] = useState(true);
    const [isDateDescent, setIsDateDescent] = useState(true);
    const [rowIndex, setRowIndex] = useState(5);
    const [pageIndex, setpageIndex] = useState(1);
   

    const getActitivityDescending = (col) => {
        state.expenses.sort((a, b) => {
            switch (col) {
                case 1:
                    if (isCatDescend) {
                        return b.category > a.category ? 1 : -1
                    } else {
                        return b.category > a.category ? -1 : 1
                    }

                case 2:
                    if (isExpDescend) {
                        return (parseFloat(b.amount) - parseFloat(a.amount))
                    } else {
                        return (parseFloat(a.amount) - parseFloat(b.amount))
                    }

                case 3:
                    if (isDateDescent) {
                        return (new Date(b.selectedDate) - new Date(a.selectedDate))
                    } else {
                        return (new Date(a.selectedDate) - new Date(b.selectedDate))
                    }
                case 4:
                    if (isPayeeDescend) {
                        return b.payee > a.payee ? 1 : -1
                    } else {
                        return b.payee > a.payee ? -1 : 1
                    }
            }
        })
        switch (col) {
            case 1:
                setIsCatDescend(!isCatDescend)
                break;
            case 2:
                setIsExpDescend(!isExpDescend)
                break;
            case 3:
                setIsDateDescent(!isDateDescent)
                break;
            case 4:
                setIsPayeeDescend(!isPayeeDescend)
                break;

        }
    }

    const handleCatClick = (e) => {
        getActitivityDescending(1)
    }
    const handleExpClick = (e) => {
        getActitivityDescending(2)
    }
    const handlePayeeClick = (e) => {
        getActitivityDescending(4)
    }
    const handleDateClick = (e) => {
        getActitivityDescending(3)
    }

    const handleRowChange = (e) => {
        if (e.target) {
            let i = e.target.value;
            setRowIndex(i)
            setpageIndex(1)
        }
    }
    const handlePrevious = () => {
        setpageIndex(pageIndex - 1)
    }
    const handleNext = () => {
        setpageIndex(pageIndex + 1)
    }
    const handleDelete = (id) => {
        let undeletedExpenses = state.expenses.filter(x => x.id !== id);
        setState(s => { return { ...s, expenses: undeletedExpenses, alert: { show: true, type: "danger", text: "Item deleted" } } })
        localStorage.setItem("spending", JSON.stringify(undeletedExpenses))
    }

    const handleEdit = (index) => {
        setState(s => {
            return {
                ...s, index,
                currentComponentIndex: 0, activeButton: 0
            }
        })
    }


    return (
        <div className="wholeTableContainer">
            <div className="displayContainer toptitle forActivity">
                <div className="sortTitle" onClick={handleDateClick}><span className="adIcon">
                    {isDateDescent ? <MdArrowDownward /> : <MdArrowUpward />}
                </span>Date</div>
                <div className="sortTitle" onClick={handleExpClick}>
                    <span className="adIcon">
                        {isExpDescend ? <MdArrowDownward /> : <MdArrowUpward />}
                    </span>EXP.($)
                </div>
                <div className="sortTitle" onClick={handlePayeeClick}>
                    <span className="adIcon">
                        {isPayeeDescend ? <MdArrowDownward /> : <MdArrowUpward />}
                    </span>PAYEE
                </div>
                <div className="sortTitle" onClick={handleCatClick}>
                    <span className="adIcon">
                        {isCatDescend ? <MdArrowDownward /> : <MdArrowUpward />}
                    </span>Cat.
                </div>
                <div className="sortTitle des">
                    Des.
                </div>
                <div className="sortTitle">
                    Act.
                </div>

            </div>

            {state.expenses && state.expenses.length > 0 &&
                state.expenses.slice((pageIndex - 1) * rowIndex, pageIndex * rowIndex).map((x, index) => {
                    return (
                        <div className="displayContainer forActivity">
                            <div>{x.selectedDate.toLocaleString().substring(0, 9)}</div>
                            <div>{x.amount}</div>
                            <div>{x.payee}</div>
                            <div>{x.category}</div>
                            <div className="des">{x.description}</div>
                            <div><span className="editButton" onClick={() => { handleEdit(index) }}><MdEdit /></span>
                                <span className="deleteButton"
                                    onClick={() => handleDelete(x.id)}><MdDelete /></span> </div>
                        </div>
                    )
                })}

            <div className="pageContainer">
                <div>Page: {pageIndex}/{state.expenses.length > 0 && Math.ceil(state.expenses.length / rowIndex)}</div>
            </div>
            <div className="rowPageContainer">
                <select className="box row" onChange={handleRowChange} value={rowIndex}>
                    {rowArr.map((x, index) => {
                        return (
                            <option value={x} key={index}>{x}</option>
                        )

                    })}
                </select>
                <div>
                    <button className={pageIndex !== 1 ? "tablebtn" : "tablebtn disableBtn"} onClick={handlePrevious}>Previous</button>
                    <button className={pageIndex !== Math.ceil(state.expenses.length / rowIndex) ? "tablebtn" : "tablebtn disableBtn"} onClick={handleNext}>Next</button>
                </div>
            </div>
        </div>)

}

export default Table