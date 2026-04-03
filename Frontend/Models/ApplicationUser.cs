using Microsoft.AspNetCore.Identity;

namespace TaskManager.Models
{
    public class ApplicationUser:IdentityUser
    {
        public string FullName { get; set; }
    }
}
