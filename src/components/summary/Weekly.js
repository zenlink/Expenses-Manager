import React, { PureComponent, useState, useEffect, useContext, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { AppContext } from "../../AppContext";
import { PieChart, Pie, Cell } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList } from 'recharts';

const useStyles = makeStyles(theme => ({
    style: {
        width: '80%',
        margin: '0 auto',
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    textField: {
        // marginLeft: theme.spacing(1),
        // marginRight: theme.spacing(1),
        width: 300,
        marginBottom: "1rem",
    },
    menu: {
        width: 200,
    },
}));

const dayOffset = 86400000;

const getWeekRange = (dateObject) => {
    // Get weekday (0-6)
    const dayOfWeek = dateObject.getDay();
    // Offset with milliseconds * dow
    let firstDayOfWeek = new Date(dateObject.getTime() - dayOfWeek * dayOffset);
    firstDayOfWeek.setHours(1, 1, 0, 0)
    let lastDayOfWeek = new Date(firstDayOfWeek.getTime() + 6 * dayOffset)
    lastDayOfWeek.setHours(0, 0, 0, 0)
    return [firstDayOfWeek, lastDayOfWeek];
}
const Weekly = () => {
    const classes = useStyles();
    const [state, setState] = useContext(AppContext);
    const [selector, setSelector] = useState([]);
    const [summary, setSummary] = useState([]);
    const [total, setTotal] = useState(0);
    const [selectedWeek, setSelectedWeek] = useState(0);
    const selectRef = useRef();

    useEffect(() => {
        if (state.expenses && state.expenses.length > 0) {
            let maxDate = new Date();//new Date(state.expenses[0].selectedDate);
            maxDate.setHours(0, 0, 0, 0);
            let minDate = new Date(state.expenses[state.expenses.length - 1].selectedDate);
            minDate.setHours(0, 0, 0, 0);

            let weekRange = [];
            let workDate = new Date(maxDate);
            let range = null;
            do {
                range = getWeekRange(workDate);
                weekRange = [...weekRange, range]
                workDate = new Date(range[0].getTime() - 3 * dayOffset);
            }
            while (minDate < range[0])
            setSelector(weekRange)
            // construct week rages
            getWeekSummary(weekRange[0][0], weekRange[0][1])
        }
    }, []);
    const onRangeChange = (e) => {
        setSelectedWeek(e.target.value)
        // let i = selectRef.current.selectedIndex;
        getWeekSummary(selector[e.target.value][0], selector[e.target.value][1])
    }

    const getWeekSummary = (minDate, maxDate) => {
        let t = 0;
        let summary = {};
        state.expenses.map((x) => {
            let dt = new Date(x.selectedDate)
            console.log(dt)
            dt.setHours(0, 0, 0, 0)
            if (dt >= minDate && dt <= maxDate) {
                t += parseFloat(x.amount);
                let v = (summary[x.category] ? summary[x.category] : 0) + parseFloat(x.amount);
                summary = { ...summary, [x.category]: v };
            }
        });
        setTotal(t)
        setSummary(Object.entries(summary));

    }
    const getColorStyle = (category) => {
        return { background: state.color[state.categories.indexOf(category)] }
    }
    const data = summary.map((item, index) => {
        return { "name": item[0], "value": item[1] }
    })
    const dataPercentage = summary.map((item, index) => {
        let percentage = parseFloat((item[1] * 100 / total).toFixed(2));
        return { "name": item[0], "value": percentage }
    })
    const colors = (category) => {
        return state.color[state.categories.indexOf(category)]
    }
    return (

        <div className={classes.style}>
            {state.expenses && state.expenses.length > 0 ?
                <>
                    <form className={classes.container} noValidate autoComplete="off">
                        <div>
                            <TextField
                                ref={selectRef}
                                select
                                label="Select"
                                className={classes.textField}
                                value={selectedWeek}
                                onChange={onRangeChange}
                                SelectProps={{
                                    MenuProps: {
                                        className: classes.menu,
                                    },
                                }}
                                helperText="Please select your week"
                                margin="normal"
                            >
                                {selector.map((option, i) => (
                                    <MenuItem key={i} value={i}>
                                        {option[0].toLocaleDateString()}-{option[1].toLocaleDateString()}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>
                    </form>
                  
                    {summary && summary.length > 0 ?
                        <>
                            <div className="summaryList">

                                <div className="summaryItem subTitle"> <span>color</span><span>cat.</span><span>Exp.</span><span>Exp.%</span></div>

                                {summary.map((item, index) => {
                                    return (
                                        <div className="summaryItem" key={index}> <span className="color" style={getColorStyle(item[0])} ></span><span>{item[0]}</span><span>${item[1]}</span><span>{(item[1] * 100 / total).toFixed(2)}%</span></div>
                                    )
                                })
                                }
                                <div className="summaryItem total"> <span className="color"></span><span>Total</span><span>${total}</span><span>100%</span></div>
                            </div>
                         
                            <div className="chartDivision">
                                <div>
                                    <PieChart width={300} height={300}>
                                        <Pie
                                            data={data}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={40}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            paddingAngle={1}
                                            dataKey="value"
                                            nameKey="name"
                                            label>
                                            {
                                                data.map((entry, index) => <Cell key={`cell-${index}`} fill={colors(entry["name"])} />)
                                            }
                                        </Pie>
                                    </PieChart>
                                    <div className="topic">Expenses</div>
                                </div>
                                <div>
                                    <BarChart
                                        width={600}
                                        height={300} data={dataPercentage} >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis interval={0} />
                                        <YAxis type='number' unit="%" domain={[0, 'dataMax+10']} />
                                        <Tooltip />
                                        {/* <Legend /> */}
                                        <Bar dataKey="value" fill="#8884d8">
                                            {
                                                dataPercentage.map((entry, index) =>
                                                    <Cell key={`cell-${index}`} fill={colors(entry["name"])} />
                                                )
                                            }
                                            <LabelList dataKey="name" position="top" />
                                        </Bar>
                                    </BarChart>
                                    <div className="topic">Expenses Percentage</div>
                                </div>
                            </div>
                        </> : <div className="noActivity">No Activity</div>}
                </> : <div className="noActivity">No Activity</div>}
        </div>
    )
}

export default Weekly;