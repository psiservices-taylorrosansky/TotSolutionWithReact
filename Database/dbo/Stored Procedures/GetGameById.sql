CREATE PROCEDURE [dbo].[GetGameById]
	@Id INT
AS
BEGIN
	SELECT * FROM GamesTable
	WHERE Id = @Id
END