using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TaskManager.DTOs;
using TaskManager.Models;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Manager")]
public class ProjectsController : ControllerBase
{
    private readonly AppDbContext _db;

    public ProjectsController(AppDbContext db)
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

        var projects = await _db.Projects
            .Where(p => p.CreatedByUserId == userId)
            .Include(p => p.Tasks)
            .ToListAsync();

        return Ok(projects);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var userId = CurrentUserId;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized("User not found in token");

        var project = await _db.Projects
            .Include(p => p.Tasks)
            .FirstOrDefaultAsync(p => p.Id == id && p.CreatedByUserId == userId);

        if (project == null)
            return NotFound("Project not found");

        return Ok(project);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProjectDto dto)
    {
        var userId = CurrentUserId;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized("User not found in token");

        var project = new Project
        {
            Name = dto.Name,
            Description = dto.Description,
            CreatedByUserId = userId  // ✅
        };

        _db.Projects.Add(project);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Project created", project.Id });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateProjectDto dto)
    {
        var userId = CurrentUserId;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized("User not found in token");

        var project = await _db.Projects
            .FirstOrDefaultAsync(p => p.Id == id && p.CreatedByUserId == userId);

        if (project == null)
            return NotFound("Project not found");

        project.Name = dto.Name;
        project.Description = dto.Description;
        await _db.SaveChangesAsync();

        return Ok("Project updated");
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = CurrentUserId;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized("User not found in token");

        var project = await _db.Projects
            .FirstOrDefaultAsync(p => p.Id == id && p.CreatedByUserId == userId);

        if (project == null)
            return NotFound("Project not found");

        _db.Projects.Remove(project);
        await _db.SaveChangesAsync();

        return Ok("Project deleted");
    }
}