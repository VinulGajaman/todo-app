import React, { useState, useEffect } from "react";
import "./App.css";
import InputField from "./components/InputField";
import { Todo } from "./model";
import TodoList from "./components/TodoList";
import axios from "axios";

const App: React.FC = () => {
  const [todo, setTodo] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);

  // Fetch all todos when the component loads
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/todos");
        setTodos(response.data);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    fetchTodos();
  }, []);



  ////////////////////////////////////////////////////////// 

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (todo) {
      try {
        const response = await axios.post("http://localhost:8080/api/todos", {
          todo: todo,  // Changed 'title' to 'description'
          completed: false,
        });
        setTodos([...todos, response.data]); // Add the new todo to the list
        setTodo("");
      } catch (error) {
        console.error("Error creating todo:", error);
      }
    }
  };
  

  console.log(todo);

  return (
    <div className="App">
      <span className="heading">TASKIFY</span>
      <InputField todo={todo} setTodo={setTodo} handleAdd={handleAdd} />
      <TodoList todos={todos} setTodos={setTodos} />
    </div>
  );
};

export default App;
