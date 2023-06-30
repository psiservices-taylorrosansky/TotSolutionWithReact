import { useState, useEffect } from "react";
import { DateTime } from 'luxon';
import * as yup from 'yup';

const App = () => {

    const [games, setGames] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [updateGame, setUpdateGame] = useState(false)
    const [showFormError, setShowFormError] = useState(false)
    const [formErrorText, setFormErrorText] = useState("Darn!")
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        releaseDate: "",
        developer: ""
    });

    // Get DB data from API
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

    const validationSchema = yup
        .object()
        .shape({
            name: yup.string().required("Name is required!").max(50),
            releaseDate: yup.string().matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format(yyyy - mm - dd)'),
            developer: yup.string().required("Developer is required!").max(50)
        })
        .required();

    //checks if the form is for updating or adding
    const handleFormSubmit = (e) => {
        e.preventDefault();

        validationSchema.validate(formData, { abortEarly: false })
            .then(() => {

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
                handleCancelButton();
            })
            .catch((errors) => {
                const validationErrors = {};
                errors.inner.forEach((error) => {
                    const { path, message } = error;
                    validationErrors[path] = message;
                });
                console.log(errors);
                setFormErrorText(Object.values(validationErrors).join('\n'));
                setShowFormError(true);
            });
    }

    const handleCancelButton = () => {
        setFormData({
            id: "",
            name: "",
            releaseDate: "",
            developer: ""
        });
        setShowForm(false);
        setShowFormError(false);
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

    // So you can go bewteen Add and Update
    const resetForm = () => {
        handleCancelButton();
        setShowForm(true)
    }

    const fixDate = (dt) => {
        if (dt) {
            let newDate = DateTime.fromISO(dt, { zone: 'utc' }).toLocaleString(DateTime.DATE_SHORT);
            console.log(newDate);
            return newDate;
        }
        else {
            return '';
        }
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
                                        <td>{fixDate(game.releaseDate)}</td>
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
                                    <label>Release Date  (yyyy-mm-dd)</label>
                                    <input type="text" placeholder="Enter Release Date..." id="formReleaseDate" className="form-control" value={formData.releaseDate} onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })} />
                                </div>
                                <div>
                                    <label>Developer</label>
                                    <input type="text" placeholder="Enter Developer..." id="formDev" className="form-control" value={formData.developer} onChange={(e) => setFormData({...formData, developer: e.target.value})} required />
                                </div>
                                {showFormError &&
                                    <pre style={{ color: 'red' }}>{formErrorText}</pre>    
                                }
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