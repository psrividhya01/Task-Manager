using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TaskManager.DTOs;
using TaskManager.Models;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Manager")]
public class TasksController : ControllerBase
{
    private readonly AppDbContext _db;

    public TasksController(AppDbContext db)
    {
        _db = db;
    }

    private string? CurrentUserId =>
        User.FindFirstValue(ClaimTypes.NameIdentifier);

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = CurrentUserId;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized("User not found in token");

        try
        {
            var tasks = await _db.Tasks
                .Include(t => t.AssignedToUser)
                .Include(t => t.Project)
                .Select(t => new
                {
                    t.Id,
                    t.Title,
                    t.Description,
                    t.Status,
                    AssignedToUser = t.AssignedToUser != null
                        ? new { t.AssignedToUser.FullName, t.AssignedToUser.Email }
                        : null,
                    Project = t.Project != null
                        ? new { t.Project.Name }
                        : null
                })
                .ToListAsync();

            return Ok(tasks);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpGet("project/{projectId}")]
    public async Task<IActionResult> GetByProject(int projectId)
    {
        var tasks = await _db.Tasks
            .Where(t => t.ProjectId == projectId)
            .Include(t => t.AssignedToUser)
            .Select(t => new
            {
                t.Id,
                t.Title,
                t.Description,
                t.Status,
                AssignedToName = t.AssignedToUser != null
                    ? t.AssignedToUser.FullName
                    : "Unassigned" // ✅
            })
            .ToListAsync();

        return Ok(tasks);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTaskDto dto)
    {
        var userId = CurrentUserId;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized("User not found in token");

        var project = await _db.Projects.FindAsync(dto.ProjectId);
        if (project == null)
            return NotFound("Project not found");

        var task = new TaskItem
        {
            Title = dto.Title,
            Description = dto.Description,
            Status = "To Do",
            ProjectId = dto.ProjectId,
            AssignedToUserId = dto.AssignedToUserId,
            CreatedByUserId = userId  // ✅
        };

        _db.Tasks.Add(task);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Task created and assigned", task.Id });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateTaskDto dto)
    {
        var task = await _db.Tasks.FindAsync(id);
        if (task == null)
            return NotFound("Task not found");

        task.Title = dto.Title;
        task.Description = dto.Description;
        task.AssignedToUserId = dto.AssignedToUserId;

        await _db.SaveChangesAsync();
        return Ok("Task updated");
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var task = await _db.Tasks.FindAsync(id);
        if (task == null)
            return NotFound("Task not found");

        _db.Tasks.Remove(task);
        await _db.SaveChangesAsync();
        return Ok("Task deleted");
    }

    [HttpGet("developers")]
    public async Task<IActionResult> GetDevelopers(
        [FromServices] UserManager<ApplicationUser> userManager)
    {
        var devs = await userManager.GetUsersInRoleAsync("Developer");
        var result = devs.Select(d => new
        {
            d.Id,
            d.FullName,
            d.Email
        });
        return Ok(result);
    }

    [HttpGet("{id}/comments")]
    public async Task<IActionResult> GetComments(int id)
    {
        var comments = await _db.Comments
            .Where(c => c.TaskId == id)
            .Include(c => c.Author)
            .Select(c => new
            {
                c.Id,
                c.Content,
                c.CreatedAt,
                AuthorName = c.Author != null
                    ? c.Author.FullName
                    : "Unknown"  // ✅
            })
            .ToListAsync();

        return Ok(comments);
    }

    [HttpGet("kanban/{projectId}")]
    public async Task<IActionResult> GetKanban(int projectId)
    {
        var tasks = await _db.Tasks
            .Where(t => t.ProjectId == projectId)
            .Include(t => t.AssignedToUser)
            .ToListAsync();

        var kanban = new
        {
            toDo = tasks
                .Where(t => t.Status == "To Do")
                .Select(t => new
                {
                    t.Id,
                    t.Title,
                    t.Description,
                    AssignedTo = t.AssignedToUser != null
                        ? t.AssignedToUser.FullName
                        : "Unassigned"  // ✅
                }),

            inProgress = tasks
                .Where(t => t.Status == "In Progress")
                .Select(t => new
                {
                    t.Id,
                    t.Title,
                    t.Description,
                    AssignedTo = t.AssignedToUser != null
                        ? t.AssignedToUser.FullName
                        : "Unassigned"  // ✅
                }),

            done = tasks
                .Where(t => t.Status == "Done")
                .Select(t => new
                {
                    t.Id,
                    t.Title,
                    t.Description,
                    AssignedTo = t.AssignedToUser != null
                        ? t.AssignedToUser.FullName
                        : "Unassigned"  // ✅
                })
        };

        return Ok(kanban);
    }
}
