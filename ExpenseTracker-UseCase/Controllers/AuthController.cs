using ExpenseTracker_UseCase.DTOs;
using ExpenseTracker_UseCase.Models;
using ExpenseTracker_UseCase.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTracker_UseCase.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var result = await _authService.RegisterAsync(dto);
            if (!result.Success)
                return BadRequest(result.ErrorMessage);

            return Ok(new { message = "User registered successfully" });
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var result = await _authService.LoginAsync(dto);
            if (!result.Success)
                return Unauthorized(result.ErrorMessage);

            return Ok(new
            {
                token = result.Token,
                name = result.Name,
                email = result.Email
            });
        }
    }
}
