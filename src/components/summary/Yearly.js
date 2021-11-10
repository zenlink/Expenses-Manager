import React, { useState, useContext, useEffect, useRef } from 'react';
import { AppContext } from "../../AppContext";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

import { PieChart, Pie, Cell } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList, Label } from 'recharts';

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

const Yearly = () => {
    const classes = useStyles();
    const [state, setState] = useContext(AppContext);
    const [year, setYear] = useState([]);
    const [yearSummary, setYearSummary] = useState([]);
    const [yearTotal, setYearTotal] = useState(0);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const selectRef = useRef();

    useEffect(() => {
        if (state.expenses && state.expenses.length > 0) {
            let maxDate = new Date();//new Date(state.expenses[0].selectedDate);
            let minDate = new Date(state.expenses[state.expenses.length - 1].selectedDate);

            let years = [];
            let range = maxDate.getFullYear();
            do {
                years = [...years, range]
                range -= 1;
            }
            while (minDate.getFullYear() <= range)
            setYear(years)
            // construct week rages
            getYearSummary(years[0])
        }
    }, []);

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value)
        let i = selectRef.current.selectedIndex;
        getYearSummary(e.target.value)

    }

    const getYearSummary = (year) => {
        let t = 0;
        let summary = {}
        state.expenses.map((x) => {
            let dt = new Date(x.selectedDate).getFullYear();

            if (dt === year) {
                t += parseFloat(x.amount);
                let v = (summary[x.category] ? summary[x.category] : 0) + parseFloat(x.amount);
                summary = { ...summary, [x.category]: v };

            }
        });
        setYearTotal(t)
        setYearSummary(Object.entries(summary));
    }



    const inputLabel = React.useRef(null);
    const [labelWidth, setLabelWidth] = React.useState(0);



    const getColorStyle = (category) => {
        return { background: state.color[state.categories.indexOf(category)] }
    }
    const data = yearSummary.map((item, index) => {
        return { "name": item[0], "value": item[1] }
    })
    const dataPercentage = yearSummary.map((item, index) => {
        let percentage = parseFloat((item[1] * 100 / yearTotal).toFixed(2));
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
                                id="standard-select-currency"
                                select
                                label="Select"
                                className={classes.textField}
                                value={selectedYear}
                                onChange={handleYearChange}
                                SelectProps={{
                                    MenuProps: {
                                        className: classes.menu,
                                    },
                                }}
                                helperText="Please select your year"
                                margin="normal"
                            >
                                {year.map(option => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>
                    </form>

                   
                    {yearSummary && yearSummary.length > 0 ?
                        <>
                            <div className="summaryList">

                                <div className="summaryItem subTitle"> <span>color</span><span>cat.</span><span>Exp.</span><span>Exp.%</span></div>

                                {yearSummary.map((item, index) => {
                                    return (
                                        <div className="summaryItem" key={index}> <span className="color" style={getColorStyle(item[0])}></span><span>{item[0]}</span><span>${item[1]}</span><span>{(item[1] * 100 / yearTotal).toFixed(2)}%</span></div>
                                    )
                                })}
                                <div className="summaryItem total"> <span className="color"></span><span>Total</span><span>${yearTotal}</span><span>100%</span></div>
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
                                    <div className = "topic">Expenses</div>
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
                                        <LabelList dataKey="name" position="top" offset={30} angle="45" />
                                    </Bar>
                                </BarChart>
                                <div className = "topic">Expenses Percentage</div>
                                </div>
                            </div>
                        </> : <div className="noActivity">No Activity</div>}
                </> : <div className="noActivity">No Activity</div>
            }
        </div >
    )
}
export default Yearly;
