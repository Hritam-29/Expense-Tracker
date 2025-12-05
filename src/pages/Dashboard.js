import { useState, useEffect, useContext } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { AuthContext } from "../context/AuthContext";

function Dashboard() {

  const [expenses, setExpenses] = useState([]);

  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStart, setFilterStart] = useState("");
  const [filterEnd, setFilterEnd] = useState("");

  const { userName } = useContext(AuthContext);

  const totalAmount = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const averageAmount = filteredExpenses.length > 0 ? (totalAmount / filteredExpenses.length).toFixed(2) : 0;
  const today = new Date().toISOString().split("T")[0];

  const categoryTotals = filteredExpenses.reduce((acc, exp) => {
  if (!acc[exp.category]) {
    acc[exp.category] = 0;
  }
  acc[exp.category] += exp.amount;
  return acc;
  }, {});

  const currentYear = new Date().getFullYear();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ];


  const monthlyTotals = new Array(12).fill(0);

  // sorting expenses month-wise
  filteredExpenses.forEach((exp) => {
    const expDate = new Date(exp.date);
    const expMonth = expDate.getMonth();
    const expYear = expDate.getFullYear();

    if (expYear === currentYear) {
      monthlyTotals[expMonth] += exp.amount;
    }
    });

  // current year total
  const yearlyTotal = filteredExpenses
  .filter((exp) => new Date(exp.date).getFullYear() === currentYear)
  .reduce((sum, exp) => sum + exp.amount, 0);

  // category-wise total in the year
  const yearlyCategoryTotals = {};

  filteredExpenses.forEach((exp) => {
  const expYear = new Date(exp.date).getFullYear();

  if (expYear === currentYear) {
    if (!yearlyCategoryTotals[exp.category]) {
      yearlyCategoryTotals[exp.category] = 0;
    }
      yearlyCategoryTotals[exp.category] += exp.amount;
    }
    });

  useEffect(() => {
    loadExpenses();
  }, []);

  const navigate = useNavigate();


  const loadExpenses = async () => {
    try {
      const response = await api.get("/expenses");
      setExpenses(response.data);
      setFilteredExpenses(response.data);

    } catch (err) {
      console.log("Error fetching expenses", err);
    }
  };

  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this expense?")) return;

  try {
    await api.delete(`/expenses/${id}`);
    loadExpenses();
  } catch (err) {
    console.log("Delete failed", err);
  }
  };

  const applyFilters = () => {
  let result = [...expenses];

  // category filter
  if (filterCategory) {
    result = result.filter((exp) => exp.category === filterCategory);
  }

  // date filter
  if (filterStart) {
    result = result.filter(
      (exp) => new Date(exp.date) >= new Date(filterStart)
    );
  }

  if (filterEnd) {
    result = result.filter(
      (exp) => new Date(exp.date) <= new Date(filterEnd)
    );
  }

  setFilteredExpenses(result);
  };

  const resetFilters = () => {
  setFilterCategory("");
  setFilterStart("");
  setFilterEnd("");
  setFilteredExpenses(expenses);
  };

  return (
    <div className="dashboard-wrapper" >
      <h2> Hello {userName ? userName : ""}!</h2>
      <div className="filter-box">
      <h3>Filter Expenses</h3>

      <select
        value={filterCategory}
        onChange={(e) => setFilterCategory(e.target.value)}
      >
        <option value="">All Categories</option>
        <option value="Food">Food</option>
        <option value="Transport">Transport</option>
        <option value="Shopping">Shopping</option>
        <option value="Health">Health</option>
        <option value="Bills">Bills</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Groceries">Groceries</option>
        <option value="Travel">Travel</option>
        <option value="Other">Other</option>
      </select>

      <input
        type="date"
        value={filterStart}
        onChange={(e) => setFilterStart(e.target.value)}
        max={today}
      />

      <input
        type="date"
        value={filterEnd}
        onChange={(e) => setFilterEnd(e.target.value)}
        max={today}
      />

      <button onClick={applyFilters}>Apply</button>
      <button className="btn-reset" onClick={resetFilters}>Reset</button>
      </div>

      <table className="expense-table" border="2" cellPadding="8" style={{ marginTop: "20px", width: "100%" }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
            <th className="mod-col">Modifications</th>
          </tr>
        </thead>

        <tbody>
          {filteredExpenses.map((exp) => (
            <tr key={exp.expenseId}>
              <td>{exp.title}</td>
              <td>{exp.amount}</td>
              <td>{exp.category}</td>
              <td>{exp.date?.split("T")[0]}</td>

              <td className="mod-col">
                <div className="actions">
                <button className="icon-btn edit-btn" onClick={() => navigate(`/edit/${exp.expenseId}`)}>
                  ✏️
                </button>
                <button
                  className="icon-btn delete-btn"
                  onClick={() => handleDelete(exp.expenseId)}
                >
                   ❌
                </button>
                </div>
              </td>

            </tr>
          ))}
        </tbody>
      </table>

      
      <p>Total Expenses: {filteredExpenses.length}</p>


      <div className="summary-container">
        
        <div className="summary-card">
          <h4>Total Spending</h4>
          <p className="amount">₹ {totalAmount}</p>
        </div>

        <div className="summary-card">
          <h4>Average Spending</h4>
          <p className="amount">₹ {averageAmount}</p>
        </div>

        <div className="summary-card ">
          <h4>{currentYear} Yearly Total</h4>
          <p className="amount">₹ {yearlyTotal}</p>
        </div>

        <div className="summary-card wide-card">
          <h4>Category-wise Totals</h4>
          <ul>
            {Object.entries(categoryTotals).map(([cat, amt]) => (
              <li key={cat}>{cat}: ₹ {amt}</li>
            ))}
          </ul>
        </div>

        <div className="summary-card wide-card">
          <h4>{currentYear} Monthly Totals</h4>
          <ul>
          {Object.entries(monthlyTotals).map(([index, amount]) => (
            <li key={index}>
              {monthNames[index]}: ₹ {amount}
            </li>
          ))}
          </ul>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;
