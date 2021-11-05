import React, { useState, useContext, useEffect } from 'react';
// import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { MdSend, MdAttachMoney, MdLocalGroceryStore, MdDescription, MdBorderColor, MdEdit } from "react-icons/md";
import { v4 as uuidv4 } from 'uuid';
import { AppContext } from "../AppContext";

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        width: "470px",
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    margin: {
        margin: theme.spacing(1),
    },
    withoutLabel: {
        marginTop: theme.spacing(3),
    },
    textField: {
        width: "470px",
    },
}));


const initialExpenses = localStorage.getItem("spending") ?
JSON.parse(localStorage.getItem("spending")) : [];

const Expense = () => {
    const [state, setState] = useContext(AppContext);

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [amount, setAmount] = useState("");
    const [payee, setPayee] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (state.index !== -1) {
            let expense = state.expenses.filter((x, index) => { return index === state.index })[0];
            setAmount(expense.amount);
            setPayee(expense.payee);
            setCategory(expense.category);
            setDescription(expense.description);
            setSelectedDate(expense.selectedDate)
        }
    }, [state.index]);

   

    const handleDateChange = date => {
        setSelectedDate(date);
    };

    const handleAmount = (e) => {
        setAmount(e.target.value);
    }
    const handlePayee = (e) => {
        setPayee(e.target.value)
    }
    const handleDescription = (e) => {
        setDescription(e.target.value)
    }

    const classes = useStyles();
    const [category, setCategory] = React.useState('');

    const inputLabel = React.useRef(null);
    const [labelWidth, setLabelWidth] = React.useState(0);

    const handleChange = event => {
        setCategory(event.target.value);
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        if (amount > 0 && payee && category) {
            // console.log(selectedDate)
            // let currentDate = selectedDate.toLocaleDateString() + ' ' + selectedDate.toLocaleTimeString()

            let singleExpense = { id: uuidv4(), selectedDate, amount, payee, category, description };
            if (state.index > -1) {
                let tempExpenses = [...state.expenses];
                tempExpenses[state.index] = singleExpense;
                setState((s)=>{return{
                    ...s, expenses: tempExpenses, currentComponentIndex: 1, index: -1,
                    alert: { show: true, type: "success", text: "Item updated" }, activeButton: 1
                }})
            } else {
                setState((s) => {
                    return {
                        ...s, expenses: [...s.expenses, singleExpense], currentComponentIndex: 1,
                        alert: { show: true, type: "success", text: "Item added" }, activeButton: 1
                    }
                   
                })

            }
            setAmount("");
            setPayee("");
            setCategory("");
            setDescription("");
            setSelectedDate(new Date());

        } else {
            setState((s)=>{return { ...s, alert: { show: true, type: "danger", text: "Please fill in the Amount, Payee and select category!" } }})
        }
    }
    return (
        <div className ="expenseContainer">
            <form className="form-center" onSubmit={handleSubmit}>

                <div className="form-group">
                    {/* <label htmlFor="date">Date:</label> */}
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            // className="form-control"
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            // label="Date picker inline"
                            value={selectedDate}
                            onChange={handleDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                        <KeyboardTimePicker
                            margin="normal"
                            id="time-picker"
                            // label="Time picker"
                            value={selectedDate}
                            onChange={handleDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change time',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                </div>
                <div className="form-group">
                    <FormControl fullWidth className={classes.textField}>
                        <InputLabel htmlFor="standard-adornment-amount">Amount</InputLabel>
                        <Input
                            // id="standard-adornment-amount"
                            value={amount}
                            onChange={handleAmount}
                            startAdornment={<InputAdornment position="start">< MdAttachMoney /></InputAdornment>}
                        />
                    </FormControl>
                </div>
                <div className="form-group">
                    <FormControl fullWidth className={classes.textField}>
                        <InputLabel htmlFor="standard-adornment-amount">Payee</InputLabel>
                        <Input
                            // id="standard-adornment-amount"
                            value={payee}
                            onChange={handlePayee}
                            startAdornment={<InputAdornment position="start"><MdLocalGroceryStore /></InputAdornment>}
                        />
                    </FormControl>
                </div>
                <div className="form-group">
                    <FormControl fullWidth className={classes.textField}>
                        <InputLabel id="demo-simple-select-label"
                        ><MdDescription></MdDescription>Category</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={category}
                            onChange={handleChange}
                        >
                            {state.categories.map((item, index) => {
                                return (
                                    <MenuItem value={item} key={index}>{item}</MenuItem>
                                )

                            })}
                        </Select>
                    </FormControl>
                </div>
                <div className="form-group">
                    <FormControl fullWidth className={classes.textField}>
                        <InputLabel htmlFor="standard-adornment-amount">DesCription</InputLabel>
                        <Input
                            // id="standard-adornment-amount"
                            value={description}
                            onChange={handleDescription}
                            startAdornment={<InputAdornment position="start"><MdBorderColor /></InputAdornment>}
                        />
                    </FormControl>
                </div>
                <button type="submit" className={state.index !== -1 ? "btn update" : "btn submit"}>
                    {state.index !== -1 ? "Update" : "submit"}
                    <MdSend className="btn-icon" />
                </button>

            </form>
        </div>
    )
}
export default Expense;