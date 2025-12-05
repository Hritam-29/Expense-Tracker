
import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import "./AddExpense.css";

function AddExpense() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const today = new Date().toISOString().split("T")[0];

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ Client-side validation
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    try {
      await api.post("/expenses", {
        title,
        amount: parsedAmount,
        category: category === "Other" ? customCategory : category,
        date
      });

      navigate("/dashboard");
    } catch (err) {
      // Optionally read server error here
      setError("Failed to add expense");
    }
  };

  return (
    <div className="expense-container">
      <h2>Add Expense</h2>

      <form onSubmit={handleSubmit}>
        <input
          data-testid="title-input"            // ✅ test id
          type="text"
          placeholder="Expense title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          data-testid="amount-input"           // ✅ test id
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        {error && <p className="error-text">{error}</p>}

        <select
          data-testid="category-select"        // ✅ test id
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
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

        {category === "Other" && (
          <input
            data-testid="custom-category-input" // ✅ test id
            type="text"
            placeholder="Enter custom category"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            required
          />
        )}

        <input
          data-testid="date-input"              // ✅ test id
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={today}
          required
        />

        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
}

export default AddExpense;
