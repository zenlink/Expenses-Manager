import React, { PureComponent, useState, useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppContext } from "../../AppContext";
import { isTemplateElement } from '@babel/types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList } from 'recharts';

const useStyles = makeStyles(theme => ({
    style: {
        width: '80%',
        margin: '0 auto',
    },
}));

const All = () => {
    const classes = useStyles();
    const [state, setState] = useContext(AppContext);
    const [allSummary, setAllSummary] = useState([]);
    const [allTotal, setAllTotal] = useState(0);
    useEffect(() => {
        if (state.expenses && state.expenses.length > 0) {
            getAllSummary();
        }
    }, [state.expenses])

    const getAllSummary = () => {
        let summary = {};
        let total = 0;
        let value;
        state.expenses.map((x, index) => {
            total += parseFloat(x.amount);
            if (!summary[x.category]) {
                value = parseFloat(x.amount);
            } else {
                value = summary[x.category] + parseFloat(x.amount);
            }
            summary = { ...summary, [x.category]: value };
        })

        setAllSummary(Object.entries(summary));
        setAllTotal(total);
    }
    const getColorStyle = (category) => {
        return { background: state.color[state.categories.indexOf(category)] }
    }
    const data = allSummary.map((item, index) => {
        return { "name": item[0], "value": item[1] }
    })
    const dataPercentage = allSummary.map((item, index) => {
        let percentage = parseFloat((item[1] * 100 / allTotal).toFixed(2));
        return { "name": item[0], "value": percentage }
    })
    const colors = (category) => {
        return state.color[state.categories.indexOf(category)]
    }
    return (
        <div className={classes.style}>
            {state.expenses && state.expenses.length > 0 ?
                <>
                    <div className="summaryList">

                        <div className="summaryItem subTitle"><span>color</span><span>cat.</span><span>Exp.</span><span>Exp.%</span></div>

                        {allSummary.map((item, index) => {
                            return (
                                <div className="summaryItem" key={index}>
                                    <span className="color" style={getColorStyle(item[0])}></span><span>{item[0]}</span><span>${item[1]}</span><span>{(item[1] * 100 / allTotal).toFixed(2)}%</span>
                                </div>
                            )
                        })}
                        <div className="summaryItem total"> <span className="color"></span><span>Total</span><span>${allTotal}</span><span>100%</span></div>
                    </div>

                    <div className="chartDivision">
                        {/* <PieChart width={window.innerWidth * 0.6} height={300}> */}
                        <div>
                            <PieChart
                                width={300}

                                height={300}>
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
                                    <LabelList dataKey="name" position="top" offset={30} angle="45" />
                                </Bar>
                            </BarChart>
                            <div className="topic">Expenses Percentage</div>
                        </div>
                    </div>
                </> : <div className="noActivity">No Activity</div>}
        </div>
    )
}
export default All;

