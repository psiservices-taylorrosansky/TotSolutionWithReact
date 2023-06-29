using System.ComponentModel.DataAnnotations;

namespace GamesCatalog.Models
{
    public class Game
    {
        public int Id { get; set; }
        public string Name { get; set; }
        [DataType(DataType.DateTime)]
        public DateTime? ReleaseDate { get; set; }
        public string Developer { get; set; }
    }
}
