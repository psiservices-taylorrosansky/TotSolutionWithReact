CREATE PROCEDURE [dbo].[UpdateGame]
	@Id INT,
	@Name VARCHAR(50),
	@ReleaseDate datetime2(7) = NULL,
	@Developer VARCHAR(50)
AS
BEGIN
	UPDATE GamesTable
	SET Name = @Name,
	ReleaseDate = @ReleaseDate,
	Developer = @Developer
	WHERE Id = @Id
END