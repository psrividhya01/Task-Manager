using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TaskManager.DTOs;
using TaskManager.Models;
using TaskManager.Services;

[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly EmailService _emailService;

    private readonly IConfiguration _configuration;

    public AuthController(UserManager<ApplicationUser> userManager,
                          SignInManager<ApplicationUser> signInManager,
                          EmailService emailService,
                          IConfiguration configuration)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _emailService = emailService;
        _configuration = configuration;
    }

    // 🔹 REGISTER (Developer)
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
        var user = new ApplicationUser
        {
            UserName = model.Email,
            Email = model.Email,
            FullName = model.FullName
        };

        var result = await _userManager.CreateAsync(user, model.Password);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        await _userManager.AddToRoleAsync(user, "Developer");
        // 🔹 Generate email verification token
        var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

        // 🔹 Create verification link
        var link = $"       https://contrastingly-wersh-stuart.ngrok-free.dev/api/auth/confirm-email?userId={user.Id}&token={Uri.EscapeDataString(token)}";
        var subject = "Email Verification";
        var body = $"<h3>Click below link to verify your email:</h3><a href='{link}'>Verify Email</a>";

        // 🔹 Send email
        _emailService.SendEmail(user.Email, subject, body);

        // 🔥 For now return link (instead of sending email)
        return Ok("Registration successful. Check your email.");

    }

    // 🔹 LOGIN (Manager + Developer)
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email);

        if (user == null)
            return BadRequest("User not found");

        if (!user.EmailConfirmed)
            return BadRequest("Verify email first");

        var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);

        if (!result.Succeeded)
            return BadRequest("Invalid password");

        // 🔹 Get roles
        var roles = await _userManager.GetRolesAsync(user);

        // 🔹 Create claims
        var claims = new List<Claim>
    {
        new Claim(ClaimTypes.Name, user.Email),
        new Claim(ClaimTypes.NameIdentifier, user.Id)
    };

        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        // 🔹 Generate JWT
        var jwtSettings = _configuration.GetSection("Jwt");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]));

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(Convert.ToDouble(jwtSettings["DurationInMinutes"])),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        );

        return Ok(new
        {
            token = new JwtSecurityTokenHandler().WriteToken(token)
        });
    }
    [HttpGet("confirm-email")]
    public async Task<IActionResult> ConfirmEmail(string userId, string token)
    {
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
            return BadRequest("Invalid user");

        var result = await _userManager.ConfirmEmailAsync(user, token);

        if (result.Succeeded)
            return Ok("Email verified successfully");

        return BadRequest("Error verifying email");
    }
}