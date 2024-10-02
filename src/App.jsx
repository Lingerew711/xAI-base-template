import React from "react";

function App() {
  const [tasks, setTasks] = React.useState([
    { text: "Task 1", done: true },
    { text: "Task 2", done: true },
    { text: "Task 3", done: false },
    { text: "Task 4", done: false },
    { text: "Task 5", done: false }
  ]);
  const [remainingTasks, setRemainingTasks] = React.useState(0);
  const [editIndex, setEditIndex] = React.useState(-1);
  const [editText, setEditText] = React.useState("");
  const addTaskInput = React.useRef();

  React.useEffect(() => {
    setRemainingTasks(tasks.filter(taskItem => !taskItem.done).length);
  }, [tasks]);

  function addTask() {
    const newTask = addTaskInput.current.value;
    if (newTask.trim() && !tasks.some(task => task.text === newTask.trim())) {
      const newTaskObj = { text: newTask.trim(), done: false };
      setTasks(tasks => [...tasks, newTaskObj]);
      addTaskInput.current.value = "";
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter') {
      addTask();
    }
  }

  function startEdit(task, index) {
    setEditIndex(index);
    setEditText(task.text);
  }

  function cancelEdit() {
    setEditIndex(-1);
    setEditText("");
  }

  function submitEdit() {
    if (editText.trim()) {
      const updatedTasks = tasks.map((task, index) => {
        if (index === editIndex) {
          return { ...task, text: editText.trim() };
        }
        return task;
      });
      setTasks(updatedTasks);
      cancelEdit();
    }
  }

  function handleEditKey(e) {
    if (e.key === 'Enter') {
      submitEdit();
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-gray-100">
      <div className="relative w-full max-w-md rounded bg-white shadow-lg text-center overflow-hidden">
        <div className="py-8 bg-gradient-to-r from-green-300 via-blue-500 to-blue-800 text-white">
          <h1 className="text-2xl font-bold">Todo List</h1>
          <small className="block mt-2 text-base font-medium">
            {tasks.length > 0 && remainingTasks === 0 ? (
              "All done! =D"
            ) : (
              <>
                You have <b>{remainingTasks}</b> of <b>{tasks.length}</b> tasks remaining
              </>
            )}
          </small>
        </div>
        <div className="flex w-full border-b border-gray-200 py-2 px-6">
          <input
            ref={addTaskInput}
            type="text"
            placeholder="Add task..."
            onKeyUp={handleKey}
            className="block w-full text-lg font-bold bg-transparent outline-none px-3 py-2"
          />
          <button onClick={addTask} className="flex-shrink-0 w-8 h-8 rounded-full text-3xl leading-none font-bold text-blue-800 transition duration-300 ease-in-out hover:text-gray-800">
            +
          </button>
        </div>
        <div className="relative p-8 pb-24 max-h-96 overflow-auto">
          <List tasks={tasks} setTasks={setTasks} startEdit={startEdit} editIndex={editIndex} editText={editText} handleEditKey={handleEditKey} submitEdit={submitEdit} setEditText={setEditText} />
        </div>
      </div>
    </div>
  );
}


const List = ({ tasks, setTasks, startEdit, editIndex, editText, handleEditKey, submitEdit, setEditText }) => {
  if (tasks.length === 0) {
    return (
      <div className="empty text-center mt-4">
        <svg className="mx-auto mb-4 w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path d="m3.65939616 0h8.68120764c.4000282 0 .7615663.23839685.9191451.6060807l2.7402511 6.3939193v4c0 1.1045695-.8954305 2-2 2h-12c-1.1045695 0-2-.8954305-2-2v-4l2.74025113-6.3939193c.15757879-.36768385.51911692-.6060807.91914503-.6060807z" />
            <path d="m0 7h4c.55228475 0 1 .44771525 1 1v1c0 .55228475.44771525 1 1 1h4c.5522847 0 1-.44771525 1-1v-1c0-.55228475.4477153-1 1-1h4" />
        </svg>
        <p className="text-gray-500 mb-2">Empty list</p>
        <p className="text-sm">Add a new task above</p>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {tasks.map((task, index) => (
        <Task
          key={index}
          task={task}
          index={index}
          setTasks={setTasks}
          startEdit={startEdit}
          editIndex={editIndex}
          editText={editText}
          handleEditKey={handleEditKey}
          submitEdit={submitEdit}
          setEditText={setEditText}  // Ensure this is passed here
        />
      ))}
    </ul>
  );
};

const Task = ({
  task,
  setTasks,
  index,
  startEdit,
  editIndex,
  editText,
  handleEditKey,
  submitEdit,
  setEditText
}) => {
  function toggleTask() {
    setTasks(tasks =>
      tasks.map((item, i) =>
        i === index ? { ...item, done: !item.done } : item
      )
    );
  }

  function removeTask() {
    setTasks(tasks => tasks.filter((_, i) => i !== index));
  }

  return (
    <li className={`flex items-center justify-between ${task.done ? "text-gray-400" : "text-gray-800"} group`}>
      <div className="flex items-center flex-grow">
        <input type="checkbox" checked={task.done} onChange={toggleTask} className="form-checkbox rounded text-primary h-5 w-5 mr-2" />
        {editIndex === index ? (
          <>
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyUp={handleEditKey}
              className="flex-1 mx-2 text-lg font-bold bg-transparent outline-none"
            />
            <button onClick={submitEdit} className="ml-2">
              <svg className="fill-current h-6 w-6 text-green-500 hover:text-green-700" viewBox="0 0 20 20">
                <path d="M0 11l2-2 5 5 9-9 2 2-11 11z" />
              </svg>
            </button>
          </>
        ) : (
          <span onClick={() => startEdit(task, index)} className={`flex-1 cursor-pointer ${task.done ? "line-through" : ""}`}>
            {task.text}
          </span>
        )}
      </div>
      {editIndex !== index && (
        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
          <button onClick={removeTask} className="ml-2">
            <svg className="fill-current h-6 w-6 text-red-500 hover:text-red-700" viewBox="0 0 20 20">
              <path d="M8.707 10.707L13.414 6l1.414 1.414L10.121 12l4.707 4.707-1.414 1.414L8.707 13.414l-4.707 4.707-1.414-1.414L7.293 12 2.586 7.293 4 5.879l4.707 4.708z" />
            </svg>
          </button>
          <button onClick={() => startEdit(task, index)} className="ml-2">
            <svg className="fill-current h-6 w-6 text-blue-500 hover:text-blue-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
              <path fillRule="evenodd" d="M2 6a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm2 0v10h10V6H4z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
    </li>
  );
};


export default App;
