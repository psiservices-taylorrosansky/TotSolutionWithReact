using System.ComponentModel.DataAnnotations;

namespace GamesCatalog.ViewModels
{
    public class AddGame
    {
        public string Name { get; set; }
        [DataType(DataType.DateTime)]
        public DateTime ReleaseDate { get; set; }
        public string Developer { get; set; }
    }
}
