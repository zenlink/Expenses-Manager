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
            let weekRange = getWeekRange();
            setSelector(weekRange)
            getWeekSummary(weekRange[0])
        }
    },
        [])

    const onRangeChange = (e) => {
        setSelectedWeek(e.target.value)
        // let i = selectRef.current.selectedIndex; 
        getWeekSummary(selector[e.target.value])
    }

    const getWeekRange = () => {
        let dayOffSet = 86400000;
        let sortedExp = state.expenses.sort((a, b) => {
            return (new Date(b.selectedDate) - new Date(a.selectedDate))
        })
        let minWeek = new Date(sortedExp[sortedExp.length - 1].selectedDate).getDay();
        let minTime = new Date(sortedExp[sortedExp.length - 1].selectedDate).getTime();
        let maxWeek = new Date(sortedExp[0].selectedDate).getDay();
        let maxTime = new Date(sortedExp[0].selectedDate).getTime();
        let start;
        let end;
        let weekRange = [];

        if (minWeek !== 0) {
            minTime = minTime - minWeek * dayOffSet;
        }

        if (maxWeek !== 6) {
            maxTime = maxTime + (6 - maxWeek) * dayOffSet;
        }
        for (let i = minTime; i < maxTime; i = i + 7 * dayOffSet) {
            start = new Date(i).toLocaleDateString();
            end = new Date(i + 6 * dayOffSet).toLocaleDateString();
            weekRange = [...weekRange, [start, end]];
        }
        weekRange.reverse();
        return weekRange
    }

    const getWeekSummary = (weekRange) => {
        let sortedExp = state.expenses.sort((a, b) => {
            return (new Date(b.selectedDate) - new Date(a.selectedDate))
        })

        let summary = {};
        let t = 0;
 
            let min = new Date(weekRange[0]);
            let max = new Date(weekRange[1]);
            let b = sortedExp.filter((y, id) => {
                let d = y.selectedDate;
                return (d >= min && d <= max)
            })

            b.length > 0 && b.forEach((z, num) => {
                if (!summary[z.category]) {
                    summary[z.category] = parseFloat(z.amount)
                } else {
                    summary[z.category] += parseFloat(z.amount)
                }
                t += parseFloat(z.amount)
            })      
        setTotal(t)
        setSummary(Object.entries(summary))
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
                                        {option[0]}-{option[1]}
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
                                        width={400}
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