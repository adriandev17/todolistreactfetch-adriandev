import React, { useState, useEffect } from "react";

const Home = () => {
    const [inputValue, setInputValue] = useState("");
    const [todos, setTodos] = useState([]);

    const username = "adrian_dev_17"; 
    const apiUrl = "https://playground.4geeks.com/todo";

    useEffect(() => {
        getTodos();
    }, []);

    const getTodos = () => {
        fetch(`${apiUrl}/users/${username}`)
            .then(resp => {
                if (resp.status === 404) {
                    createUser(); 
                    return null;
                }
                return resp.json();
            })
            .then(data => {
                if (data) setTodos(data.todos);
            })
            .catch(error => console.error(error));
    };

    const createUser = () => {
        fetch(`${apiUrl}/users/${username}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        }).then(() => getTodos());
    };

    const addTask = (e) => {
        if (e.key === "Enter" && inputValue.trim() !== "") {
            const newTask = { label: inputValue, is_done: false };
            fetch(`${apiUrl}/todos/${username}`, {
                method: "POST",
                body: JSON.stringify(newTask),
                headers: { "Content-Type": "application/json" }
            }).then(resp => {
                if (resp.ok) {
                    setInputValue("");
                    getTodos();
                }
            });
        }
    };

    const deleteTask = (todoId) => {
        fetch(`${apiUrl}/todos/${todoId}`, { method: "DELETE" })
            .then(resp => {
                if (resp.ok) getTodos();
            });
    };

    const cleanAllTasks = () => {
        const deletePromises = todos.map(todo => 
             fetch(`${apiUrl}/todos/${todo.id}`, { method: "DELETE" })
        );
        Promise.all(deletePromises).then(() => getTodos());
    };

    return (
        <div className="container d-flex flex-column align-items-center justify-content-center mt-5">
            
            <h1 className="text-center mb-4 text-muted" style={{ fontWeight: "300", letterSpacing: "2px" }}>
                MI LISTA DE TAREAS
            </h1>

            <div className="card shadow-lg border-0 rounded-4 w-100" style={{ maxWidth: "600px" }}>
                
                <div className="card-body p-4">
                    <div className="input-group input-group-lg mb-4">
                        <span className="input-group-text bg-white border-end-0 text-muted">
                            <i className="fas fa-pencil-alt"></i> {/* Icono de lápiz (opcional si tienes FontAwesome) */}
                        </span>
                        <input 
                            type="text" 
                            className="form-control border-start-0 fs-5" 
                            placeholder="¿Qué necesitas hacer hoy?"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={addTask}
                            style={{ boxShadow: "none" }} // Quita el borde azul feo al hacer click
                        />
                    </div>

                    <ul className="list-group list-group-flush">
                        {todos.length === 0 ? (
                            <div className="text-center text-muted py-5">
                                <p>¡Todo limpio! No tienes tareas pendientes.</p>
                            </div>
                        ) : (
                            todos.map((item) => (
                                <li 
                                    key={item.id} 
                                    className="list-group-item d-flex justify-content-between align-items-center py-3 border-bottom task-item"
                                >
                                    <span className="fs-5 text-dark">
                                        {item.label}
                                    </span>
                                    
                                    <button 
                                        className="btn btn-outline-danger btn-sm border-0"
                                        onClick={() => deleteTask(item.id)}
                                        title="Eliminar tarea"
                                    >
                                        ✖ 
                                    </button>
                                </li>
                            ))
                        )}
                    </ul>
                </div>

                <div className="card-footer bg-light border-0 rounded-bottom-4 p-3 d-flex justify-content-between align-items-center">
                    <span className="text-muted small">
                        <strong>{todos.length}</strong> items pendientes
                    </span>
                    
                    {todos.length > 0 && (
                        <button 
                            className="btn btn-outline-danger btn-sm rounded-pill px-3"
                            onClick={cleanAllTasks}
                        >
                            Limpiar todo
                        </button>
                    )}
                </div>
            </div>
            
            <p className="mt-4 text-muted small">
                Hecho por Adrián con React & Fetch
            </p>
        </div>
    );
};

export default Home;