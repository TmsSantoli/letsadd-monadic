using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Model;

namespace letsadd_monadic.Controllers
{
  [Route("api/[controller]")]
  public class DataCollectorController : Controller
  {
    [HttpPost("NewTask/{coll_i}")]
    public IActionResult AddTask(int coll_i)
    {
      using (var db = new AgendaContext())
      {
        db.MyTask.Add(new MyTask { Title = "new task", TascollId = coll_i });
        db.SaveChanges();
      }
      return Ok();
    }

    [HttpPost("NewUrgent/{coll_i}")]
    public IActionResult AddUrgent(int coll_i)
    {
      using (var db = new AgendaContext())
      {
        db.Urgent.Add(new Urgent { Title = "urgent task", TascollId = coll_i });
        db.SaveChanges();
      }
      return Ok();
    }

    [HttpPost("NewCollection")]
    public IActionResult AddColl()
    {
      using (var db = new AgendaContext())
      {
        db.Tascoll.Add(new Tascoll { Title = "New Collection", Inner = new List<MyTask>(), UrgInner = new List<Urgent>() });
        db.SaveChanges();
      }
      return Ok();
    }



    // [HttpDelete("RemoveTask/{tsk_i}")]
    // public IActionResult RemTask(int tsk_i)
    // {
    //     using (var db = new AgendaContext())
    //     {
    //         db.MyTask.Remove(db.MyTask.Find(tsk_i));
    //         db.SaveChanges();
    //     }
    //     return Ok();
    // }

    [HttpDelete("RemoveTask/{tsk_i}")]
    public IActionResult RemTask(int tsk_i)
    {
      using (var db = new AgendaContext())
      {
        var ta = (from t in db.MyTask
                  where t.Id == tsk_i
                  select t).FirstOrDefault();
        if (ta == null)
        {
          db.SaveChanges();
          Console.WriteLine("Nothing happened");
          return Ok();
        }
        else
        {
          db.MyTask.Remove(ta);
          db.SaveChanges();
          return Ok();
        }
      }
    }

    [HttpDelete("RemoveUrgent/{tsk_i}")]
    public IActionResult RemUrgent(int tsk_i)
    {
      using (var db = new AgendaContext())
      {
        var ur = (from t in db.Urgent
                  where t.Id == tsk_i
                  select t).FirstOrDefault();
        if (ur == null)
        {
          db.SaveChanges();
          Console.WriteLine("Nothing happened");
          return Ok();
        }
        else
        {
          db.Urgent.Remove(ur);
          db.SaveChanges();
          return Ok();
        }
      }
    }

    [HttpDelete("RemoveCollection/{coll_i}")]
    public IActionResult RemColl(int coll_i)
    {
      using (var db = new AgendaContext())
      {
        var co = (from t in db.Tascoll
                  where t.Id == coll_i
                  select t).FirstOrDefault();
        if (co == null)
        {
          db.SaveChanges();
          Console.WriteLine("Nothing happened");
          return Ok();
        }
        else
        {
          db.Tascoll.Remove(co);
          db.SaveChanges();
          return Ok();
        }
      }
    }


    [HttpGet("everything")]
    public IActionResult GetEverything()
    {
      using (var db = new AgendaContext())
      {
        var priority = db.Urgent.ToList();
        var colls = db.Tascoll.ToList();
        db.SaveChanges();
        return Ok(new Everything { Priority = priority, MyCollections = colls });
      }
    }


    [HttpGet("minimalinfo")]
    public IActionResult GetMinimal()
    {
      using (var db = new AgendaContext())
      {
        var priority = db.Urgent.ToList();
        var colls = db.Tascoll.Select(coll => new SimpleColl { Id = coll.Id, Title = coll.Title }).ToList();
        db.SaveChanges();
        return Ok(new Minimal { Priority = priority, SimpleCollections = colls });
      }
    }



    public class Everything
    {
      public List<Urgent> Priority { get; set; }
      public List<Tascoll> MyCollections { get; set; }
    }

    public class Minimal
    {
      public List<Urgent> Priority { get; set; }
      public List<SimpleColl> SimpleCollections { get; set; }
    }

    public class SimpleColl
    {
      public int Id { get; set; }
      public string Title { get; set; }
    }


  }
}