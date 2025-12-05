using ExpenseTracker_UseCase.DTOs;
using ExpenseTracker_UseCase.Models;
using System.Threading.Tasks;

namespace ExpenseTracker_UseCase.Services.Interfaces
{
    public interface IAuthService
    {
        Task<(bool Success, string? ErrorMessage)> RegisterAsync(RegisterDto dto);
        Task<(bool Success, string? Token, string? Name, string? Email, string? ErrorMessage)> LoginAsync(LoginDto dto);
        string GenerateToken(User user); 
    }
}
