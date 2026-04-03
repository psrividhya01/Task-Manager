namespace TaskManager.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string AuthorId { get; set; } = string.Empty;
        public ApplicationUser? Author { get; set; }
        public int TaskId { get; set; }
        public TaskItem? Task { get; set; }
    }
}
