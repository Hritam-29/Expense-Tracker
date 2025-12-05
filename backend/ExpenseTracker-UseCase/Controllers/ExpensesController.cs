using ExpenseTracker_UseCase.DTOs;
using ExpenseTracker_UseCase.Models;
using ExpenseTracker_UseCase.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ExpenseTracker_UseCase.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ExpensesController : ControllerBase
    {
        private readonly IExpenseService _expenseService;

        public ExpensesController(IExpenseService expenseService)
        {
            _expenseService = expenseService;
        }

        // helper: get logged-in user's id from JWT (we set NameIdentifier in token)
        private int GetUserId()
        {
            var idClaim = User.FindFirstValue(ClaimTypes.NameIdentifier)
                          ?? User.FindFirstValue(ClaimTypes.Name); // fallback if needed

            return int.Parse(idClaim);
        }

        // POST: api/expenses
        [HttpPost]
        public async Task<IActionResult> CreateExpense(CreateExpenseDto dto)
        {
            int userId = GetUserId();
            var expense = await _expenseService.CreateExpenseAsync(userId, dto);
            return Ok(new { message = "Expense added successfully", expense });
        }

        // GET: api/expenses
        [HttpGet]
        public async Task<IActionResult> GetExpenses()
        {
            int userId = GetUserId();
            var expenses = await _expenseService.GetExpensesAsync(userId);
            return Ok(expenses);
        }

        // GET: api/expenses/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetExpenseById(int id)
        {
            int userId = GetUserId();
            var expense = await _expenseService.GetExpenseByIdAsync(id, userId);
            if (expense == null) return NotFound("Expense not found");
            return Ok(expense);
        }

        // PUT: api/expenses/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExpense(int id, UpdateExpenseDto dto)
        {
            int userId = GetUserId();
            var ok = await _expenseService.UpdateExpenseAsync(id, userId, dto);
            if (!ok) return NotFound("Expense not found");
            var expense = await _expenseService.GetExpenseByIdAsync(id, userId);
            return Ok(new { message = "Expense updated successfully", expense });
        }

        // PATCH: api/expenses/{id}
        [HttpPatch("{id}")]
        public async Task<IActionResult> PatchExpense(int id, [FromBody] Dictionary<string, object> updates)
        {
            int userId = GetUserId();

            try
            {
                var ok = await _expenseService.PatchExpenseAsync(id, userId, updates);
                if (!ok) return NotFound("Expense not found");

                var expense = await _expenseService.GetExpenseByIdAsync(id, userId);
                return Ok(new { message = "Expense updated successfully", expense });
            }
            catch (ArgumentException ex)
            {
                // service throws ArgumentException for invalid amount etc.
                return BadRequest(ex.Message);
            }
        }

        // DELETE: api/expenses/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpense(int id)
        {
            int userId = GetUserId();
            var ok = await _expenseService.DeleteExpenseAsync(id, userId);
            if (!ok) return NotFound("Expense not found");
            return Ok(new { message = "Expense deleted successfully" });
        }

        // GET: api/expenses/filter?category=...&startDate=...&endDate=...
        [HttpGet("filter")]
        public async Task<IActionResult> FilterExpenses(string? category, DateTime? startDate, DateTime? endDate)
        {
            int userId = GetUserId();
            var results = await _expenseService.FilterExpensesAsync(userId, category, startDate, endDate);
            return Ok(results);
        }
    }
}
