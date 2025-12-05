using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExpenseTracker_UseCase.Models  
{
    public class Expense
    {
        [Key]
        public int ExpenseId { get; set; }

        [Required]
        public int UserId { get; set; }           

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = null!;

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [MaxLength(100)]
        public string? Category { get; set; }

        [Required]
        public DateTime Date { get; set; } = DateTime.UtcNow;

        // Foreign-Key Relation
        public User? User { get; set; }
    }
}
