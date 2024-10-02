import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Edit, Trash2, Save } from 'react-feather';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);

  // Function to add a new todo
  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  // Function to toggle todo completion
  const toggleComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // Function to remove a todo
  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Function to start editing a todo
  const startEdit = (todo) => {
    setEditingTodo(todo);
  };

  // Function to save edited todo
  const saveEdit = (todo, newText) => {
    setTodos(todos.map(t => (t.id === todo.id ? { ...t, text: newText } : t)));
    setEditingTodo(null);
  };

  // Count remaining tasks
  const remainingTasks = todos.filter(todo => !todo.completed).length;

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex justify-center items-center">
      <Card className="w-full max-w-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4">
          <CardTitle className="text-2xl">Todo List</CardTitle>
          <p className="mt-2 text-sm">
            {`${remainingTasks} of ${todos.length} tasks remaining`}
          </p>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex">
            <Input 
              value={newTodo} 
              onChange={(e) => setNewTodo(e.target.value)} 
              placeholder="Add new todo..."
              className="flex-grow mr-2"
            />
            <Button onClick={addTodo}>Add</Button>
          </div>
          <ul>
            {todos.map((todo) => (
              <li key={todo.id} className="flex items-center justify-between p-2 mb-2 rounded shadow bg-white hover:shadow-lg transition-shadow">
                {editingTodo && editingTodo.id === todo.id ? (
                  <Input 
                    value={todo.text} 
                    onChange={(e) => saveEdit(todo, e.target.value)}
                    onBlur={() => setEditingTodo(null)}
                    autoFocus
                  />
                ) : (
                  <span className={todo.completed ? 'line-through text-gray-500' : ''}>
                    {todo.text}
                  </span>
                )}
                <div className="flex space-x-2">
                  {!editingTodo || editingTodo.id !== todo.id ? (
                    <>
                      <Button variant="ghost" size="icon" onClick={() => toggleComplete(todo.id)}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => startEdit(todo)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => removeTodo(todo.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" size="icon" onClick={() => saveEdit(todo, todo.text)}>
                      <Save className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default function App() {
  return <TodoApp />;
}