namespace TaskManager.DTOs
{
    public class CreateTaskDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int ProjectId { get; set; }
        public string AssignedToUserId { get; set; } = string.Empty; // Developer's userId
    }
}
