import React, { useEffect, useRef, useState } from "react";
import { Todo } from "../model";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { MdDone } from "react-icons/md";
import "./style.css";
import TodoList from "./TodoList";
import axios, { AxiosError } from 'axios';

type Props = {
  todo: Todo;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

const SingleTodo = ({ todo, todos, setTodos }: Props) => {
  /////////////////////////////////////////////////////////////////////

  const [edit, setEdit] = useState<boolean>(false);
  const [editTodo, setEditTodo] = useState<string>(todo.todo);

  /////////////////////////DONE/////////////////////////////////////////
  const handleDone = async (id: number) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, isDone: todo.isDone === 0 ? 1 : 0 } : todo
    );
  
    const todoToUpdate = updatedTodos.find((todo) => todo.id === id);
  
    if (todoToUpdate) {
      try {
        const response = await axios.put(`http://localhost:8080/api/todos/${id}/status`, {
          isDone: todoToUpdate.isDone,
        });
        setTodos(updatedTodos); // Update state after successful API call
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error(
          "Failed to update todo status",
          axiosError.response ? axiosError.response.data : axiosError.message
        );
      }
    }
  };
  

  
  ////////////////////////DELETE///////////////////////////////////////
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/todos/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  ////////////////////////EDIT///////////////////////////////////////
  const handleEdit = async (e: React.FormEvent, id: number) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:8080/api/todos/${id}`,
        {
          todo: editTodo,
          completed: todo.isDone, // Update completed status if needed
        }
      );
      setTodos(todos.map((todo) => (todo.id === id ? response.data : todo)));
      setEdit(false);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [edit]);

  return (
    <form className="todos__single" onSubmit={(e) => handleEdit(e, todo.id)}>
      {edit ? (
        <input
          ref={inputRef}
          value={editTodo}
          onChange={(e) => setEditTodo(e.target.value)}
          className="todos__single--text"
        />
      ) : todo.isDone === 1 ? (
        <s className="todos__single--text">{todo.todo}</s>
      ) : (
        <span className="todos__single--text">{todo.todo}</span>
      )}

      <div>
        <span
          className="icon"
          onClick={() => {
            if (!edit && !todo.isDone) {
              setEdit(!edit);
            }
          }}
        >
          <AiFillEdit />
        </span>
        <span className="icon" onClick={() => handleDelete(todo.id)}>
          <AiFillDelete />
        </span>
        <span className="icon" onClick={() => handleDone(todo.id)}>
          <MdDone />
        </span>
      </div>
    </form>
  );
};

export default SingleTodo;
