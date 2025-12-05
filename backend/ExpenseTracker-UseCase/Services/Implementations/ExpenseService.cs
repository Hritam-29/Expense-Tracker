using ExpenseTracker_UseCase.Data;
using ExpenseTracker_UseCase.DTOs;
using ExpenseTracker_UseCase.Models;
using ExpenseTracker_UseCase.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ExpenseTracker_UseCase.Services.Implementations
{
    public class ExpenseService : IExpenseService
    {
        private readonly AppDbContext _context;

        public ExpenseService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Expense> CreateExpenseAsync(int userId, CreateExpenseDto dto)
        {
            var expense = new Expense
            {
                Title = dto.Title,
                Amount = dto.Amount,
                Category = dto.Category,
                Date = dto.Date,
                UserId = userId
            };

            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();
            return expense;
        }

        public async Task<List<Expense>> GetExpensesAsync(int userId)
        {
            return await _context.Expenses
                .Where(e => e.UserId == userId)
                .OrderByDescending(e => e.Date)
                .ToListAsync();
        }

        public async Task<Expense?> GetExpenseByIdAsync(int id, int userId)
        {
            return await _context.Expenses
                .FirstOrDefaultAsync(e => e.ExpenseId == id && e.UserId == userId);
        }

        public async Task<bool> UpdateExpenseAsync(int id, int userId, UpdateExpenseDto dto)
        {
            var expense = await GetExpenseByIdAsync(id, userId);
            if (expense == null) return false;

            expense.Title = dto.Title;
            expense.Amount = dto.Amount;
            expense.Category = dto.Category;
            expense.Date = dto.Date;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> PatchExpenseAsync(int id, int userId, Dictionary<string, object> updates)
        {
            var expense = await GetExpenseByIdAsync(id, userId);
            if (expense == null) return false;

            foreach (var item in updates)
            {
                switch (item.Key.ToLower())
                {
                    case "title":
                        expense.Title = item.Value.ToString();
                        break;
                    case "amount":
                        if (decimal.TryParse(item.Value.ToString(), out decimal amount))
                        {
                            if (amount <= 0) throw new ArgumentException("Amount must be greater than 0");
                            expense.Amount = amount;
                        }
                        break;
                    case "category":
                        expense.Category = item.Value.ToString();
                        break;
                    case "date":
                        if (DateTime.TryParse(item.Value.ToString(), out DateTime date))
                        {
                            expense.Date = date;
                        }
                        break;
                }
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteExpenseAsync(int id, int userId)
        {
            var expense = await GetExpenseByIdAsync(id, userId);
            if (expense == null) return false;

            _context.Expenses.Remove(expense);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<Expense>> FilterExpensesAsync(int userId, string? category, DateTime? start, DateTime? end)
        {
            var query = _context.Expenses.Where(e => e.UserId == userId).AsQueryable();

            if (!string.IsNullOrEmpty(category))
                query = query.Where(e => e.Category != null && e.Category.ToLower() == category.ToLower());

            if (start.HasValue)
                query = query.Where(e => e.Date >= start.Value);

            if (end.HasValue)
                query = query.Where(e => e.Date <= end.Value);

            return await query.OrderByDescending(e => e.Date).ToListAsync();
        }
    }
}

