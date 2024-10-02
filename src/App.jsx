import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Edit, Trash, Save } from 'lucide-react';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);

  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem('todos') || '[]');
    if (savedTodos.length) {
      setTodos(savedTodos);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { text: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  const toggleComplete = (index) => {
    setTodos(todos.map((todo, i) => 
      i === index ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const removeTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  const startEdit = (index, text) => {
    setEditingTodo({ index, text });
  };

  const saveEdit = () => {
    if (editingTodo) {
      const newTodos = [...todos];
      newTodos[editingTodo.index].text = editingTodo.text;
      setTodos(newTodos);
      setEditingTodo(null);
    }
  };

  const remainingTasks = todos.filter(todo => !todo.completed).length;
  const totalTasks = todos.length;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 sm:p-8">
      <Card className="w-full max-w-md">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <CardTitle>Todo List</CardTitle>
          <p>{`${remainingTasks} of ${totalTasks} tasks remaining`}</p>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4">
            <Input 
              value={newTodo} 
              onChange={(e) => setNewTodo(e.target.value)} 
              placeholder="Add a new todo"
              className="flex-grow mr-2"
            />
            <Button onClick={addTodo}>Add</Button>
          </div>
          <ul>
            {todos.map((todo, index) => (
              <li 
                key={index} 
                className="flex items-center justify-between p-2 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
              >
                {editingTodo && editingTodo.index === index ? (
                  <>
                    <Input 
                      value={editingTodo.text} 
                      onChange={(e) => setEditingTodo({...editingTodo, text: e.target.value})}
                      className="flex-grow mr-2"
                    />
                    <Button variant="outline" onClick={saveEdit}>
                      <Save className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={todo.completed} 
                        onChange={() => toggleComplete(index)} 
                        className="mr-2"
                      />
                      <span className={todo.completed ? 'line-through text-gray-500' : ''}>
                        {todo.text}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => startEdit(index, todo.text)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => removeTodo(index)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="text-sm text-gray-500">
          Hover over a task to see edit and delete options.
        </CardFooter>
      </Card>
    </div>
  );
}