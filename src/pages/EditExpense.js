
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import "./AddExpense.css";

function EditExpense() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  useEffect(() => {
    loadExpense();
  }, []);

  const loadExpense = async () => {
    try {
      const response = await api.get(`/expenses/${id}`);
      const exp = response.data;

      setTitle(exp.title);
      setAmount(exp.amount);
      setCategory(exp.category);
      setDate(exp.date.split("T")[0]);
    } catch (err) {
      console.log("Error loading expense", err);
      setError("Unable to load expense.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ Client-side validation for amount > 0
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    try {
      await api.put(`/expenses/${id}`, {
        title,
        amount: parsedAmount,
        category: category === "Other" ? customCategory : category,
        date,
      });

      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      setError("Update failed.");
    }
  };

  return (
    <div className="expense-container">
      <h2>Edit Expense</h2>

      <form onSubmit={handleUpdate}>
        <input
          type="text"
          value={title}
          placeholder="Expense title"
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="number"
          value={amount}
          placeholder="Amount"
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <select
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
            type="text"
            placeholder="Enter custom category"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            required
          />
        )}

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <button type="submit">Update Expense</button>
      </form>

      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

export default EditExpense;
