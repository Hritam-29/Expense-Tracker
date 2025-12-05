using Xunit;
using Microsoft.EntityFrameworkCore;
using ExpenseTracker_UseCase.Services.Implementations;
using ExpenseTracker_UseCase.Data;
using ExpenseTracker_UseCase.DTOs;
using ExpenseTracker_UseCase.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ExpenseTracker.Tests.Services
{
    public class ExpenseServiceTests
    {
        private AppDbContext GetDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            return new AppDbContext(options);
        }

        [Fact]
        public async Task CreateExpenseAsync_ShouldAddExpense()
        {
            var context = GetDbContext();
            var service = new ExpenseService(context);

            var dto = new CreateExpenseDto
            {
                Title = "Lunch",
                Amount = 200,
                Category = "Food",
                Date = DateTime.Today
            };

            var result = await service.CreateExpenseAsync(1, dto);

            Assert.NotNull(result);
            Assert.Equal("Lunch", result.Title);
        }

        [Fact]
        public async Task GetExpensesAsync_ShouldReturnList()
        {
            var context = GetDbContext();
            var service = new ExpenseService(context);

            context.Expenses.Add(new Expense { UserId = 1, Title = "Tea", Amount = 10, Date = DateTime.Today });
            context.Expenses.Add(new Expense { UserId = 1, Title = "Snacks", Amount = 50, Date = DateTime.Today });
            context.SaveChanges();

            var result = await service.GetExpensesAsync(1);

            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task UpdateExpenseAsync_ShouldReturnTrue_WhenUpdated()
        {
            var context = GetDbContext();
            var service = new ExpenseService(context);

            var expense = new Expense { UserId = 1, Title = "Old", Amount = 10, Date = DateTime.Today };
            context.Expenses.Add(expense);
            context.SaveChanges();

            var dto = new UpdateExpenseDto
            {
                Title = "New Expense",
                Amount = 100,
                Category = "Food",
                Date = DateTime.Today
            };

            var result = await service.UpdateExpenseAsync(expense.ExpenseId, 1, dto);

            Assert.True(result);
        }

        [Fact]
        public async Task DeleteExpenseAsync_ShouldRemoveExpense()
        {
            var context = GetDbContext();
            var service = new ExpenseService(context);

            var expense = new Expense { UserId = 1, Title = "Grocery", Amount = 60, Date = DateTime.Today };
            context.Expenses.Add(expense);
            context.SaveChanges();

            var result = await service.DeleteExpenseAsync(expense.ExpenseId, 1);

            Assert.True(result);
        }

        [Fact]
        public async Task FilterExpensesAsync_ShouldFilterByCategory()
        {
            var context = GetDbContext();
            var service = new ExpenseService(context);

            context.Expenses.Add(new Expense { UserId = 1, Title = "Expense1", Category = "Food", Amount = 50, Date = DateTime.Today });
            context.Expenses.Add(new Expense { UserId = 1, Title = "Expense2", Category = "Bills", Amount = 500, Date = DateTime.Today });
            context.SaveChanges();

            var result = await service.FilterExpensesAsync(1, "Food", null, null);

            Assert.Single(result);
        }
    }
}
