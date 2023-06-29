using Microsoft.AspNetCore.Mvc;
using GamesCatalog.Models;
using Insight.Database;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using GamesCatalog.ViewModels;
//using GamesCatalog.Database;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace GamesCatalog.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameController : ControllerBase
    {
        private readonly IDbConnection _dbConnection;

        public GameController(IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("GamesDBConnection");
            _dbConnection = new SqlConnection(connectionString);
        }


        //GET: api/Game
        [HttpGet]
        public IEnumerable<Game> Get()
        {
            return _dbConnection.Query<Game>("GetAllGames");
        }

        // GET api/Game/{id}
        [HttpGet("{id}")]
        public IEnumerable<Game> Get(int id)
        {
            return _dbConnection.Query<Game>("GetGameById", new { Id = id });
        }

        // POST api/Game
        // Correct DateTime entry example: "releaseDate": "2023-06-21T19:43:48.958Z"
        [HttpPost]
        public void Post([FromBody] AddGame request)
        {
            if (String.IsNullOrEmpty(request.Name) || String.IsNullOrEmpty(request.Developer))
            {
                throw new ArgumentException("**ERROR: Name and Developer fields must be filled!");
            }
            var game = new Game
            {
                Name = request.Name,
                ReleaseDate = request.ReleaseDate,
                Developer = request.Developer
            };
            _dbConnection.Execute("AddGame", game);
        }

        // PUT api/Game/{id}
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] AddGame request)
        {
            if (String.IsNullOrEmpty(request.Name) || String.IsNullOrEmpty(request.Developer))
            {
                throw new ArgumentException("**ERROR: Name and Developer fields must be filled!");
            }
            var updatedGame = new Game
            {
                Id = id,
                Name = request.Name,
                ReleaseDate = request.ReleaseDate,
                Developer = request.Developer
            };
            if (_dbConnection.Execute("UpdateGame", updatedGame) == 0)
            {
                throw new ArgumentException("**ERROR: Failed to update record!");
            }
        }

        // DELETE api/Game/{id}
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            if (_dbConnection.Execute("DeleteGame", new { Id = id }) == 0)
            {
                throw new ArgumentException("**ERROR: Failed to delete record!");
            }
        }
    }
}

