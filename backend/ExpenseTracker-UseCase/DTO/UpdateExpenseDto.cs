using System.ComponentModel.DataAnnotations;

namespace ExpenseTracker_UseCase.DTOs
{
    public class UpdateExpenseDto
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = null!;

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
        public decimal Amount { get; set; }

        [MaxLength(100)]
        public string? Category { get; set; }

        [Required]
        public DateTime Date { get; set; }
    }
}
