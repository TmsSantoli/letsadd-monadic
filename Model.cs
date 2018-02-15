using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace Model
{
  public class AgendaContext : DbContext
  {
    //this is actual entity object linked to the movies in our DB
    public DbSet<MyTask> MyTask { get; set; }
    //this is actual entity object linked to the actors in our DB
    public DbSet<Urgent> Urgent { get; set; }
    public DbSet<Tascoll> Tascoll { get; set; }

    //this method is run automatically by EF the first time we run the application
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
      //here we define the name of our database
      optionsBuilder.UseNpgsql("User ID=postgres;Password=nonsisa;Host=localhost;Port=5432;Database=AnotherDB;Pooling=true;");
    }
  }

  // public class MyTask
  // {
  //     public int Id { get; set; }
  //     public string Title { get; set; }
  //     public string Description { get; set;}
  // }

  public class MyTask

  {
    public int Id { get; set; }
    public string Title { get; set; }
    public int TascollId { get; set; }
  }
  public class Urgent
  {
    public int Id { get; set; }
    public string Title { get; set; }
    public int TascollId { get; set; }

  }

  public class Tascoll
  {
    public int Id { get; set; }
    public string Title { get; set; }
    public List<Urgent> UrgInner { get; set; }

    public List<MyTask> Inner { get; set; }
  }
}