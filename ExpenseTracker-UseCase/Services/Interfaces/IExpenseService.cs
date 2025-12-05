using ExpenseTracker_UseCase.DTOs;
using ExpenseTracker_UseCase.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ExpenseTracker_UseCase.Services.Interfaces
{
    public interface IExpenseService
    {
        Task<Expense> CreateExpenseAsync(int userId, CreateExpenseDto dto);
        Task<List<Expense>> GetExpensesAsync(int userId);
        Task<Expense?> GetExpenseByIdAsync(int id, int userId);
        Task<bool> UpdateExpenseAsync(int id, int userId, UpdateExpenseDto dto);
        Task<bool> PatchExpenseAsync(int id, int userId, Dictionary<string, object> updates);
        Task<bool> DeleteExpenseAsync(int id, int userId);
        Task<List<Expense>> FilterExpensesAsync(int userId, string? category, DateTime? start, DateTime? end);
    }
}
