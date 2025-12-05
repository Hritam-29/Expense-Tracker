using Xunit;
using Moq;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using ExpenseTracker_UseCase.Services.Implementations;
using ExpenseTracker_UseCase.Services.Interfaces;
using ExpenseTracker_UseCase.Data;
using ExpenseTracker_UseCase.Models;
using ExpenseTracker_UseCase.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ExpenseTracker.Tests.Services
{
    public class AuthServiceTests
    {
        private AppDbContext GetDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "AuthTestDB")
                .Options;

            return new AppDbContext(options);
        }

        private IConfiguration GetFakeConfig()
        {
            var inMemorySettings = new Dictionary<string, string> {
                {"Jwt:Key", "THIS_IS_A_SAMPLE_TEST_KEY_123456"},
                {"Jwt:Issuer", "TestIssuer"},
                {"Jwt:Audience", "TestAudience"}
            };

            return new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings)
                .Build();
        }

        [Fact]
        public async Task RegisterAsync_ShouldRegisterUser_WhenNewEmail()
        {
            var context = GetDbContext();
            var config = GetFakeConfig();
            var service = new AuthService(context, config);

            var dto = new RegisterDto
            {
                Name = "Kailash",
                Email = "kailash@example.com",
                Password = "123456"
            };

            var result = await service.RegisterAsync(dto);

            Assert.True(result.Success);
            Assert.Null(result.ErrorMessage);
        }

        [Fact]
        public async Task RegisterAsync_ShouldFail_WhenEmailExists()
        {
            var context = GetDbContext();
            var config = GetFakeConfig();
            var service = new AuthService(context, config);

            context.Users.Add(new User { Name = "AB", Email = "ab@a.com", PasswordHash = "123" });
            context.SaveChanges();

            var dto = new RegisterDto
            {
                Name = "ABC",
                Email = "ab@a.com",
                Password = "123456"
            };

            var result = await service.RegisterAsync(dto);

            Assert.False(result.Success);
            Assert.Equal("Email already exists", result.ErrorMessage);
        }

        [Fact]
        public async Task LoginAsync_ShouldReturnToken_WhenCredentialsValid()
        {
            var context = GetDbContext();
            var config = GetFakeConfig();
            var service = new AuthService(context, config);

            var user = new User
            {
                Name = "David",
                Email = "david@test.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456")
            };

            context.Users.Add(user);
            context.SaveChanges();

            var dto = new LoginDto { Email = "david@test.com", Password = "123456" };
            var result = await service.LoginAsync(dto);

            Assert.True(result.Success);
            Assert.NotNull(result.Token);
            Assert.Equal("David", result.Name);
        }

        [Fact]
        public async Task LoginAsync_ShouldFail_WhenPasswordWrong()
        {
            var context = GetDbContext();
            var config = GetFakeConfig();
            var service = new AuthService(context, config);

            context.Users.Add(new User
            {
                Name = "Virat",
                Email = "virat@test.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456")
            });
            context.SaveChanges();

            var dto = new LoginDto { Email = "ivrat@test.com", Password = "wrongpass" };

            var result = await service.LoginAsync(dto);

            Assert.False(result.Success);
            Assert.Equal("Invalid email or password", result.ErrorMessage);
        }
    }
}
