CREATE TABLE [dbo].[GamesTable]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY,
	[Name] VARCHAR(50) NOT NULL,
	[ReleaseDate] DATE NULL,
	[Developer] VARCHAR(50) NOT NULL
);