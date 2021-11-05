import React, { useState, useRef, useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { AppContext } from "../../AppContext";
import { PieChart, Pie, Cell } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList} from 'recharts';


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

const getHalfYear = (dateObject) => {
    //get day
    // const dayOfMonth = dateObject.getDate();
    //get month
    const month = dateObject.getMonth();
    const year = dateObject.getFullYear();
    let firstHalfYearNumber = "";
    let lastHalfYearNumber = "";
    if (month >= 6 && month <= 11) {
        firstHalfYearNumber = new Date(`7/1/${year}`);
        lastHalfYearNumber = new Date(`12/31/${year}`)
    } else {
        firstHalfYearNumber = new Date(`1/1/${year}`);
        lastHalfYearNumber = new Date(`6/30/${year}`)
    }

    return [firstHalfYearNumber, lastHalfYearNumber];
}

const HalfYearly = () => {

    const classes = useStyles();
    const [state, setState] = useContext(AppContext);
    const [halfYear, setHalfYear] = useState([]);
    const [halfYearSummary, setHalfYearSummary] = useState([]);
    const [halfYearTotal, setHalfYearTotal] = useState(0);
    const [selectedHalfYear, setSelectedHalfYear] = useState(0);
    const selectRef = useRef();

    useEffect(() => {
        if (state.expenses && state.expenses.length > 0) {
            let maxDate = new Date();//new Date(state.expenses[0].selectedDate);
            let minDate = new Date(state.expenses[state.expenses.length - 1].selectedDate);

            let halfYears = [];
            let workDate = new Date(maxDate);
            let range = null;
            do {
                range = getHalfYear(workDate);
                halfYears = [...halfYears, range]
                workDate = new Date(range[0].getTime() - 5 * dayOffset);
            }
            while (minDate < range[0])

            setHalfYear(halfYears)
            //setSelectedHalfYear(halfYears[0])
            // construct week rages
            getHalfYearSummary(halfYears[0][0], halfYears[0][1])
        }

    }, []);

    const handleHalfYearChange = (e) => {
        setSelectedHalfYear(e.target.value);
        getHalfYearSummary(halfYear[e.target.value][0], halfYear[e.target.value][1]);
        // getHalfYearSummary(e.target.value[0], e.target.value[1])

    }

    const getHalfYearSummary = (minDate, maxDate) => {
        let t = 0;
        let summary = {}
        state.expenses.map((x) => {
            let dt = new Date(x.selectedDate)
            if (dt >= minDate && dt <= maxDate) {
                t += parseFloat(x.amount);
                let v = (summary[x.category] ? summary[x.category] : 0) + parseFloat(x.amount);
                summary = { ...summary, [x.category]: v };

            }
        });
        setHalfYearTotal(t)
        setHalfYearSummary(Object.entries(summary));
    }
    const getColorStyle = (category) => {
        return { background: state.color[state.categories.indexOf(category)] }
    }
    const data = halfYearSummary.map((item, index) => {
        return { "name": item[0], "value": item[1] }
    })
    const dataPercentage = halfYearSummary.map((item, index) => {
        let percentage = parseFloat((item[1] * 100 / halfYearTotal).toFixed(2));
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
                                value={selectedHalfYear}
                                onChange={handleHalfYearChange}
                                SelectProps={{
                                    MenuProps: {
                                        className: classes.menu,
                                    },
                                }}
                                helperText="Please select your semiyear"
                                margin="normal"
                            >
                                {halfYear.map((option, i) => (
                                    <MenuItem key={i} value={i}>
                                        {option[0].toLocaleDateString()}-{option[1].toLocaleDateString()}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>
                    </form>
                   
                    {halfYearSummary && halfYearSummary.length > 0 ?
                        <>
                            <div className="summaryList">

                                <div className="summaryItem subTitle"> <span>color</span><span>cat.</span><span>Exp.</span><span>Exp.%</span></div>

                                {halfYearSummary.map((item, index) => {
                                    return (
                                        <div className="summaryItem" key={index}> <span className="color" style={getColorStyle(item[0])}></span><span>{item[0]}</span><span>${item[1]}</span><span>{(item[1] * 100 / halfYearTotal).toFixed(2)}%</span> </div>
                                    )
                                })}
                                <div className="summaryItem total"> <span className="color"></span><span>Total</span><span>${halfYearTotal}</span><span>100%</span></div>
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
                                    <YAxis type='number' unit="%" domain={[0,'dataMax+25']}/>
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
                                <div className = "topic">Expenses percentage</div>
                                </div>
                            </div>
                        </> : <div className="noActivity">No Activity</div>}
                </> : <div className="noActivity">No Activity</div>}
        </div>
    )
}
export default HalfYearly;