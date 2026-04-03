namespace TaskManager.Models
{
    public class Project
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? CreatedByUserId { get; set; }         // ← add ?
        public ApplicationUser? CreatedByUser { get; set; } // ← add ?
        public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
    }
}
