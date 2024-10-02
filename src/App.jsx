import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// SVG Icons - Placeholder for actual SVGs
const PlayIcon = () => <svg>Play</svg>;
const PauseIcon = () => <svg>Pause</svg>;
const ResetIcon = () => <svg>Reset</svg>;
const LoopIcon = ({active}) => <svg style={{color: active ? 'green' : 'gray'}}>Loop</svg>;
const NextIcon = () => <svg>Next</svg>;
const AddIcon = () => <svg>Add</svg>;

export default function App() {
  const [exercises, setExercises] = useState([]);
  const [activeExercise, setActiveExercise] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isRest, setIsRest] = useState(false);
  const [loop, setLoop] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime > 0) return prevTime - 1;
          
          if (isRest) {
            if (exercises.length > activeExercise + 1) {
              setActiveExercise(activeExercise + 1);
              setIsRest(false);
              return exercises[activeExercise + 1].duration;
            } else if (loop) {
              setActiveExercise(0);
              setIsRest(false);
              return exercises[0].duration;
            } else {
              clearInterval(intervalRef.current);
              return 0;
            }
          } else {
            setIsRest(true);
            return exercises[activeExercise].rest;
          }
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, isRest, activeExercise, exercises, loop]);

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(isRest ? exercises[activeExercise].rest : exercises[activeExercise].duration);
  };

  const addExercise = (newExercise) => {
    setExercises([...exercises, { ...newExercise, id: Date.now() }]);
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
      <ExerciseForm onAddExercise={addExercise} />
      <div className="flex-grow">
        <ExerciseList exercises={exercises} />
        <TimerSection 
          exercise={exercises[activeExercise]} 
          timeLeft={timeLeft}
          isRunning={isRunning}
          isRest={isRest}
          onStart={startTimer}
          onPause={pauseTimer}
          onReset={resetTimer}
          onLoop={() => setLoop(!loop)}
          loop={loop}
        />
      </div>
    </div>
  );
}

function ExerciseForm({ onAddExercise }) {
  const [exercise, setExercise] = useState({ name: '', duration: 0, rest: 0, repetitions: 1 });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Exercise</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Form fields for name, duration, rest, repetitions */}
        <Button onClick={() => onAddExercise(exercise)}><AddIcon /> Add Exercise</Button>
      </CardContent>
    </Card>
  );
}

function ExerciseList({ exercises }) {
  return (
    <div>
      {exercises.map((ex) => <ExerciseItem key={ex.id} exercise={ex} />)}
    </div>
  );
}

function ExerciseItem({ exercise }) {
  return (
    <Card className="mb-2">
      <CardContent>
        <p>{exercise.name} - {exercise.duration}s work / {exercise.rest}s rest</p>
      </CardContent>
    </Card>
  );
}

function TimerSection({ exercise, timeLeft, isRunning, isRest, onStart, onPause, onReset, onLoop, loop }) {
  return (
    <Card className="flex flex-row items-center justify-between p-4">
      <div className="space-y-2">
        <h2>{exercise.name}</h2>
        <div className="flex space-x-2">
          <Button onClick={isRunning ? onPause : onStart}>
            {isRunning ? <PauseIcon /> : <PlayIcon />} {isRunning ? 'Pause' : 'Start'}
          </Button>
          <Button onClick={onReset}><ResetIcon /> Reset</Button>
          <Button onClick={onLoop}><LoopIcon active={loop} /> Loop</Button>
        </div>
      </div>
      <TimerDisplay time={timeLeft} isRest={isRest} />
    </Card>
  );
}

function TimerDisplay({ time, isRest }) {
  return (
    <div className="text-4xl text-center rounded-full border-4 border-blue-500 p-6">
      {Math.floor(time / 60).toString().padStart(2, '0')}:{(time % 60).toString().padStart(2, '0')}
    </div>
  );
}