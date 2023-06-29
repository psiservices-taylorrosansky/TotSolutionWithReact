import { useState, useEffect } from "react";

const App = () => {

    const [games, setGames] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [updateGame, setUpdateGame] = useState(false)
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        releaseDate: "",
        developer: ""
    });

    const fetchGames = () => {
        fetch("api/Game")
            .then(response => { return response.json() })
            .then(responseJson => {
                setGames(responseJson)
            })
            .catch(error => {
                console.error(error);
            })
    }

    // Get DB data from API
    useEffect(() => {
        fetchGames();
    }, [])


    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!updateGame) {
            fetch('api/Game', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
            fetchGames();
        }
        else {
            fetch(`api/Game/${formData.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
            fetchGames();
        }
    }

    const handleCancelButton = () => {
        setFormData({
            id: "",
            name: "",
            releaseDate: "",
            developer: ""
        });
        setShowForm(false);
        setUpdateGame(false);
    }

    const handleGameUpdate = gameInfo => {
        setFormData({
            id: gameInfo.id,
            name: gameInfo.name,
            releaseDate: gameInfo.releaseDate,
            developer: gameInfo.developer
        })
        setShowForm(true);
        setUpdateGame(true);
    };

    const handleGameDelete = gameId => {
        fetch(`api/Game/${gameId}`, {
            method: "DELETE"
        })
            .then(() => {
                fetchGames();
                console.log("Gottem");
            })
            .catch(error => {
                console.error(error);
             });
    };

    const resetForm = () => {
        handleCancelButton();
        setShowForm(true)
    }



    return (
        <div className="container">
            <h1>Games</h1>
            <div className="row">
                <div className="col-sm-12">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Release Date</th>
                                <th>Developer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                games.map((game) => (
                                    <tr>
                                        <td>{game.id}</td>
                                        <td>{game.name}</td>
                                        <td>{game.releaseDate}</td>
                                        <td>{game.developer}</td>
                                        <td>
                                            <button onClick={() => handleGameUpdate(game)}>Update</button>
                                        </td>
                                        <td>
                                            <button onClick={() => handleGameDelete(game.id)}>Delete</button>
                                        </td>
                                        
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    <button onClick={() => resetForm()}>Add Game</button>

                    {showForm &&
                        <div>
                            <form onSubmit={handleFormSubmit}>
                                <div>
                                    <label>Name</label>
                                    <input type="text" placeholder="Enter Game Name..." id="formName" className="form-control" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                                </div>
                                <div>
                                    <label>Release Date</label>
                                    <input type="text" placeholder="Enter Release Date..." id="formReleaseDate" className="form-control" value={formData.releaseDate} onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })} />
                                </div>
                                <div>
                                    <label>Developer</label>
                                    <input type="text" placeholder="Enter Developer..." id="formDev" className="form-control" value={formData.developer} onChange={(e) => setFormData({...formData, developer: e.target.value})} required />
                                </div>
                                <button type="submit">Submit</button>
                            </form>
                            <button onClick={() => handleCancelButton()}> Cancel</button>
                        </div>
                    }
                </div>
            </div>

        </div>
    )
}

export default App;