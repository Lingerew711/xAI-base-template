import React, { useState, useEffect } from "react";

function App() {
  const [exercises, setExercises] = useState([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(null);
  const [timer, setTimer] = useState(0);
  const [active, setActive] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [loop, setLoop] = useState(false);

  useEffect(() => {
    if (active && timer > 0) {
      const interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && active) {
      toggleRestOrNextExercise();
    }
  }, [timer, active]);

  const handleAddExercise = (e) => {
    e.preventDefault();
    const name = e.target.exerciseName.value;
    const duration = parseInt(e.target.exerciseDuration.value, 10);
    const rest = parseInt(e.target.restDuration.value, 10);
    const repetitions = parseInt(e.target.repetitionCount.value, 10);
    const newExercise = {
      name,
      duration,
      rest,
      repetitions,
      originalDuration: duration,
      repsRemaining: repetitions,
    };
    setExercises([...exercises, newExercise]);
    if (currentExerciseIndex === null) {
      setCurrentExerciseIndex(0);
      setTimer(duration);
    }
    e.target.reset();
  };

  const startExercise = () => {
    if (exercises.length > 0 && !active) {
      setTimer(exercises[currentExerciseIndex].duration);
      setActive(true);
      setIsResting(false);
    }
  };

  const toggleRestOrNextExercise = () => {
    let current = exercises[currentExerciseIndex];
    if (isResting) {
      if (current.repsRemaining > 1 && loop) {
        current.repsRemaining--;
        setTimer(current.duration);
        setIsResting(false);
      } else {
        let nextIndex = currentExerciseIndex + 1;
        if (nextIndex < exercises.length) {
          setCurrentExerciseIndex(nextIndex);
          setTimer(exercises[nextIndex].duration);
          exercises[nextIndex].repsRemaining = exercises[nextIndex].repetitions;
        } else {
          setActive(false);
          setCurrentExerciseIndex(null);
        }
        setIsResting(false);
      }
    } else {
      if (current.rest > 0) {
        setIsResting(true);
        setTimer(current.rest);
      } else {
        toggleRestOrNextExercise();
      }
    }
  };

  const pauseTimer = () => {
    setActive(!active);
  };

  const resetTimer = () => {
    if (currentExerciseIndex !== null) {
      const current = exercises[currentExerciseIndex];
      setTimer(current.originalDuration);
      current.repsRemaining = current.repetitions;
      setIsResting(false);
      setActive(false);
    }
  };

  const toggleLoop = () => {
    setLoop(!loop);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center py-5">
      <div className="w-full max-w-4xl bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 items-center">
        <div>
          <h1 className="text-3xl font-bold text-center mb-4">
            Fitness Tracker
          </h1>
        </div>
        <div>
          <form onSubmit={handleAddExercise} className="mb-4">
            <div className="grid grid-cols-4 gap-4 mb-4">
              <input
                className="col-span-2 p-2 border rounded"
                name="exerciseName"
                placeholder="Exercise Name"
                required
              />
              <input
                className="col-span-2 p-2 border rounded"
                name="exerciseDuration"
                type="number"
                placeholder="Duration (s)"
                min="1"
                required
              />
              <input
                className="col-span-2 p-2 border rounded"
                name="restDuration"
                type="number"
                placeholder="Rest Duration (s)"
                min="1"
                required
              />
              <input
                className="col-span-2 p-2 border rounded"
                name="repetitionCount"
                type="number"
                placeholder="Repetitions"
                min="1"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              <svg
                className="h-6 w-6 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add Exercise
            </button>
          </form>
        </div>
      </div>
      <div className="w-full max-w-4xl bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 overflow-y-auto">
        {exercises.length > 0 ? (
          exercises.map((ex, index) => (
            <div
              key={index}
              className="p-4 hover:bg-blue-100 cursor-pointer flex justify-between items-center"
            >
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg">{ex.name}</span>
                <span className="text-sm text-gray-600">
                  Duration: {ex.duration}s
                </span>
                <span className="text-sm text-gray-600">Rest: {ex.rest}s</span>
                <span className="text-sm text-gray-600">
                  Reps: {ex.repetitions}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">
            <p className="text-lg font-medium py-10">
              No current exercises. Add one to start!
            </p>
          </div>
        )}
      </div>

      <div className="w-full max-w-4xl bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex justify-between items-center">
        <div className="flex-1">
          {currentExerciseIndex !== null ? (
            <>
              <h2 className="text-2xl font-bold">
                {isResting ? "Rest" : exercises[currentExerciseIndex].name}
              </h2>
              <p className="text-sm text-gray-500">
                {!isResting && currentExerciseIndex + 1 < exercises.length
                  ? `Next: ${exercises[currentExerciseIndex + 1].name}`
                  : ""}
              </p>
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={startExercise}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11.596 8.304L6 11.736V4.264l5.596 4.04z" />
                  </svg>
                  Start
                </button>
                <button
                  onClick={pauseTimer}
                  className={`px-4 py-2 rounded ${
                    active
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white font-bold flex items-center`}
                >
                  <svg
                    className="h-6 w-6 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-4-3a1 1 0 10-2 0v6a1 1 0 102 0V7zm-4 0a1 1 0 10-2 0v6a1 1 0 102 0V7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {active ? "Pause" : "Resume"}
                </button>
                <button
                  onClick={resetTimer}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center"
                >
                  <svg
                    className="h-6 w-6 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 10a5 5 0 1110 0H5zm5-7a7 7 0 100 14 7 7 0 000-14z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Reset
                </button>
                <button
                  onClick={toggleLoop}
                  className={`px-4 py-2 rounded ${
                    loop
                      ? "bg-indigo-500 hover:bg-indigo-600"
                      : "bg-gray-300 hover:bg-gray-400"
                  } text-white font-bold flex items-center`}
                >
                  <svg
                    className="h-6 w-6 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 3a7 7 0 00-7 7h2a5 5 0 0110 0h2a7 7 0 00-7-7z" />
                    <path d="M3 10a7 7 0 007 7v-2a5 5 0 01-5-5H3z" />
                  </svg>
                  {loop ? "Disable Loop" : "Enable Loop"}
                </button>
              </div>
            </>
          ) : (
            <h2 className="text-2xl font-semibold">No Exercise Selected</h2>
          )}
        </div>
        <div className="flex items-center justify-center">
          <div className="flex items-center justify-center w-40 h-40 border-8 border-blue-500 rounded-full text-blue-500 text-6xl font-bold">
            {timer}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
