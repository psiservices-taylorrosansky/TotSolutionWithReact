CREATE PROCEDURE [dbo].[AddGame]
	@Name VARCHAR(50),
	@ReleaseDate datetime2(7) = NULL,
	@Developer VARCHAR(50)
AS
BEGIN
	INSERT INTO GamesTable(Name, ReleaseDate, Developer)
	VALUES(@Name, @ReleaseDate, @Developer)
END