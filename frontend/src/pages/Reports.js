import { useEffect, useState } from "react";
import api from "../api/api";
import "./Reports.css";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

function Reports() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    loadExpenses();
  }, []);

  // category-wise spend for pie chart
  const categoryTotals = expenses.reduce((acc, exp) => {
    if (!acc[exp.category]) {
      acc[exp.category] = 0;
    }
    acc[exp.category] += exp.amount;
    return acc;
  }, {});

  
  const pieData = Object.entries(categoryTotals).map(([category, total]) => ({
    name: category,
    value: total
  }));

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// monthly total for bar graph
const monthlyTotals = new Array(12).fill(0);

expenses.forEach((exp) => {
  const expDate = new Date(exp.date);
  const monthIndex = expDate.getMonth();
  monthlyTotals[monthIndex] += exp.amount;
});


const barData = monthNames.map((month, index) => ({
  month: month,
  amount: monthlyTotals[index]
}));


  const loadExpenses = async () => {
    try {
      const response = await api.get("/expenses");
      setExpenses(response.data);
    } catch (err) {
      console.log("Error loading expenses", err);
    }
  };

  const COLORS = [
  "#0088FE",
  "#FF8042",
  "#00C49F",
  "#FFBB28",
  "#AF19FF",
  "#FF5E78",
  "#0f118dff",
  "#845EC2",
  "#B39CD0",
  "#FF6F91"
  ];

  return (
    <div className="reports-container">
      <h2>Expense Reports</h2>

      {/* Pie */}
      <div className="report-section">
        <h3>Category-wise Expense Distribution</h3>
        <div className="chart-box">
          <PieChart width={350} height={350}>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
        </div>
      </div>

      {/* Bar*/}
      <div className="report-section">
        <h3>Monthly Expense Totals</h3>
        <div className="chart-box">
          <BarChart width={650} height={350} data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" interval={0} angle={-30} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
        </div>
      </div>
    </div>
  );
}

export default Reports;
