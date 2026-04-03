using System.ComponentModel.DataAnnotations;

namespace TaskManager.Models
{
    public class TaskItem
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        [Required]
        public string Description { get; set; } = string.Empty;
        public  string Status { get; set; } = string.Empty;//ToDo , progress ,done
        public string? AssignedToUserId { get; set; }    // ← add ?
        public ApplicationUser? AssignedToUser { get; set; } // ← add ?

        public string? CreatedByUserId { get; set; }     // ← add ?

        public int ProjectId { get; set; }
        public Project? Project { get; set; }

    }
}
