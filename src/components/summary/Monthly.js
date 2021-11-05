import React, { PureComponent, useState, useEffect, useContext, useRef } from "react";
import { AppContext } from "../../AppContext";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
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

const getMonthRange = (dateObject) => {
    //get day
    const dayOfMonth = dateObject.getDate();
    // Offset with milliseconds * dow
    let firstDayOfMonth = new Date(dateObject.getTime() - (dayOfMonth - 1) * dayOffset);
    firstDayOfMonth.setHours(0, 0, 0, 0)

    let lastDayOfMonth = new Date((firstDayOfMonth).getTime() + 32 * dayOffset);
    lastDayOfMonth = new Date(lastDayOfMonth.getTime() - lastDayOfMonth.getDate() * dayOffset);
    // lastDayOfMonth = new Date(lastDayOfMonth.getTime() - (lastDayOfMonth.getDate() - 1) * dayOffset);

    lastDayOfMonth.setHours(23, 59, 0, 0)
    return [firstDayOfMonth, lastDayOfMonth];
}

const Monthly = () => {

    const classes = useStyles();
    const [state, setState] = useContext(AppContext);
    const [monthRange, setMonthRange] = useState([]);
    const [monthSummary, setMonthSummary] = useState([]);
    const [monthTotal, setMonthTotal] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState(0);
    const selectRef = useRef();

    useEffect(() => {
        if (state.expenses && state.expenses.length > 0) {
            let maxDate = new Date();//new Date(state.expenses[0].selectedDate);
            maxDate.setHours(0, 0, 0, 0);
            let minDate = new Date(state.expenses[state.expenses.length - 1].selectedDate);
            minDate.setHours(0, 1, 0, 0);

            let monthRanges = [];
            let workDate = new Date(maxDate);
            let range = null;
            do {
                range = getMonthRange(workDate);
                monthRanges = [...monthRanges, range]
                workDate = new Date(range[0].getTime() - 3 * dayOffset);
            }
            while (minDate <= range[0])

            setMonthRange(monthRanges)
            // construct week rages
            getMonthSummary(monthRanges[0][0], monthRanges[0][1])
        }
    }, []);

    const handleMonthRangeChange = (e) => {
        setSelectedMonth(e.target.value);
        getMonthSummary(monthRange[e.target.value][0], monthRange[e.target.value][1])
    }

    const getMonthSummary = (minDate, maxDate) => {
        let t = 0;
        let summary = {}
        state.expenses.map((x) => {
            let dt = new Date(x.selectedDate)
            dt.setHours(23, 59, 0, 0)
            if (dt >= minDate && dt <= maxDate) {
                t += parseFloat(x.amount);
                let v = (summary[x.category] ? summary[x.category] : 0) + parseFloat(x.amount);
                summary = { ...summary, [x.category]: v };

            }
        });
        setMonthTotal(t)
        setMonthSummary(Object.entries(summary));
    }

    const getColorStyle = (category) => {
        return { background: state.color[state.categories.indexOf(category)] }
    }
    const data = monthSummary.map((item, index) => {
        return { "name": item[0], "value": item[1] }
    })
    const dataPercentage = monthSummary.map((item, index) => {
        let percentage = parseFloat((item[1] * 100 / monthTotal).toFixed(2));
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
                                value={selectedMonth}
                                onChange={handleMonthRangeChange}
                                SelectProps={{
                                    MenuProps: {
                                        className: classes.menu,
                                    },
                                }}
                                helperText="Please select your month"
                                margin="normal"
                            >
                                {monthRange.map((option, i) => (
                                    <MenuItem key={option} value={i}>
                                        {option[0].toLocaleDateString()}-{option[1].toLocaleDateString()}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>
                    </form>

                    {monthSummary && monthSummary.length > 0 ?
                        <>
                            <div className="summaryList ">
                                <div className="summaryItem subTitle"> <span>color</span><span>cat.</span><span>Exp.</span><span>Exp.%</span></div>
                                {monthSummary.map((item, index) => {
                                    return (
                                        <div className="summaryItem" key={index}>
                                            <span className="color" style={getColorStyle(item[0])}></span><span>{item[0]}</span><span>${item[1]}</span><span>{(item[1] * 100 / monthTotal).toFixed(2)}%</span>
                                        </div>
                                    )
                                })}
                                <div className="summaryItem total"> <span className="color"></span><span>Total</span><span>${monthTotal}</span><span>100%</span></div>
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
                                        width={400}
                                        height={300} data={dataPercentage} >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis interval={0} />
                                        <YAxis type='number' unit="%" domain={[0,'dataMax+10']}/>
                                        <Tooltip />
                                        {/* <Legend /> */}
                                        <Bar dataKey="value" fill="#8884d8">
                                            {
                                                dataPercentage.map((entry, index) =>
                                                    <Cell key={`cell-${index}`} fill={colors(entry["name"])} />
                                                )
                                            }
                                            <LabelList dataKey="name" position="top" offset={30} angle="45"/>
                                        </Bar>
                                    </BarChart>
                                    <div className="topic">Expenses Percentage</div>
                                </div>
                            </div>
                        </> : <div className="noActivity">No Activity</div>}
                </> : <div className="noActivity">No Activity</div>}

        </div >
    )
}

export default Monthly;