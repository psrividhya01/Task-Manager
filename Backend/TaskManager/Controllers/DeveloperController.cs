using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TaskManager.DTOs;
using TaskManager.Models;

namespace TaskManager.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Developer")]
    public class DeveloperController : ControllerBase
    {
        private readonly AppDbContext _db;

        public DeveloperController(AppDbContext db)
        {
            _db = db;
        }

        private string? CurrentUserId =>
            User.FindFirstValue(ClaimTypes.NameIdentifier);

        // ✅ GET all tasks assigned to this developer
        [HttpGet("mytasks")]
        public async Task<IActionResult> GetMyTasks()
        {
            var userId = CurrentUserId;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User not found in token");

            var tasks = await _db.Tasks
                .Where(t => t.AssignedToUserId == userId)
                .Include(t => t.Project)
                .Select(t => new
                {
                    t.Id,
                    t.Title,
                    t.Description,
                    t.Status,
                    ProjectName = t.Project != null ? t.Project.Name : "No Project" // ✅
                })
                .ToListAsync();

            return Ok(tasks);
        }

        // ✅ GET single task details with comments
        [HttpGet("mytasks/{id}")]
        public async Task<IActionResult> GetTaskById(int id)
        {
            var userId = CurrentUserId;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User not found in token");

            var task = await _db.Tasks
                .Where(t => t.Id == id && t.AssignedToUserId == userId)
                .Include(t => t.Project)
                .Include(t => t.AssignedToUser)
                .FirstOrDefaultAsync();

            if (task == null)
                return NotFound("Task not found or not assigned to you");

            var comments = await _db.Comments
                .Where(c => c.TaskId == id)
                .Include(c => c.Author)
                .Select(c => new
                {
                    c.Id,
                    c.Content,
                    c.CreatedAt,
                    AuthorName = c.Author != null ? c.Author.FullName : "Unknown" // ✅
                })
                .ToListAsync();

            return Ok(new
            {
                task.Id,
                task.Title,
                task.Description,
                task.Status,
                ProjectName = task.Project != null ? task.Project.Name : "No Project", // ✅
                Comments = comments
            });
        }

        // ✅ UPDATE task status
        [HttpPatch("mytasks/{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusDto dto)
        {
            var userId = CurrentUserId;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User not found in token");

            var validStatuses = new[] { "To Do", "In Progress", "Done" };
            if (!validStatuses.Contains(dto.Status))
                return BadRequest("Invalid status. Use: To Do, In Progress, Done");

            var task = await _db.Tasks
                .FirstOrDefaultAsync(t => t.Id == id && t.AssignedToUserId == userId);

            if (task == null)
                return NotFound("Task not found or not assigned to you");

            task.Status = dto.Status;
            await _db.SaveChangesAsync();

            return Ok(new { message = "Status updated", newStatus = dto.Status });
        }

        // ✅ ADD comment to a task
        [HttpPost("mytasks/{id}/comments")]
        public async Task<IActionResult> AddComment(int id, [FromBody] CreateCommentDto dto)
        {
            var userId = CurrentUserId;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User not found in token");

            var task = await _db.Tasks
                .FirstOrDefaultAsync(t => t.Id == id && t.AssignedToUserId == userId);

            if (task == null)
                return NotFound("Task not found or not assigned to you");

            var comment = new Comment
            {
                Content = dto.Content,
                TaskId = id,
                AuthorId = userId, // ✅
                CreatedAt = DateTime.UtcNow
            };

            _db.Comments.Add(comment);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Comment added", comment.Id });
        }

        // ✅ GET all comments of a task
        [HttpGet("mytasks/{id}/comments")]
        public async Task<IActionResult> GetComments(int id)
        {
            var userId = CurrentUserId;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User not found in token");

            var task = await _db.Tasks
                .FirstOrDefaultAsync(t => t.Id == id && t.AssignedToUserId == userId);

            if (task == null)
                return NotFound("Task not found or not assigned to you");

            var comments = await _db.Comments
                .Where(c => c.TaskId == id)
                .Include(c => c.Author)
                .Select(c => new
                {
                    c.Id,
                    c.Content,
                    c.CreatedAt,
                    AuthorName = c.Author != null ? c.Author.FullName : "Unknown" // ✅
                })
                .ToListAsync();

            return Ok(comments);
        }
    }
}