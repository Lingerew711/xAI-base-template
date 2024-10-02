import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// SVG Icons
const PlayIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>;
const PauseIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>;
const ResetIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg>;
const LoopIcon = ({active}) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "currentColor" : "gray"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>;
const AddIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;

function Timer({ initialSeconds, onEnd, type }) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef();

  useEffect(() => {
    if (isActive && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds(seconds => seconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      clearInterval(intervalRef.current);
      onEnd();
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, seconds]);

  const toggle = () => setIsActive(!isActive);
  const reset = () => setSeconds(initialSeconds);

  return (
    <div className="flex items-center">
      <Button onClick={toggle}>{isActive ? <PauseIcon /> : <PlayIcon />} {isActive ? 'Pause' : 'Start'}</Button>
      <Button onClick={reset} className="ml-2"><ResetIcon /> Reset</Button>
      <div className="ml-4 text-2xl">{`${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`}</div>
    </div>
  );
}

function ExerciseDisplay({ exercise, nextExercise, onNext, loop, toggleLoop }) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>{exercise.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between items-center">
        <div>
          <Button onClick={toggleLoop} variant={loop ? "secondary" : "outline"}><LoopIcon active={loop} /> Loop</Button>
        </div>
        <div className="text-right">
          <h2 className="text-lg font-bold">{nextExercise ? `Next: ${nextExercise.name}` : 'End of Session'}</h2>
          <Timer initialSeconds={exercise.isRest ? exercise.rest : exercise.duration} onEnd={onNext} type={exercise.isRest ? 'rest' : 'exercise'} />
        </div>
      </CardContent>
    </Card>
  );
}

function ExerciseList({ exercises, addExercise }) {
  const [newExercise, setNewExercise] = useState({ name: '', duration: 60, rest: 30, repetition: 1 });

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Add Exercise</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {['name', 'duration', 'rest', 'repetition'].map(field => (
            <Input 
              key={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={newExercise[field]}
              onChange={e => setNewExercise({...newExercise, [field]: field === 'name' ? e.target.value : Number(e.target.value)})}
            />
          ))}
          <Button onClick={() => addExercise(newExercise)}><AddIcon /> Add Exercise</Button>
        </div>
        <div className="mt-4">
          {exercises.map((ex, idx) => (
            <div key={idx} className="mb-2">{ex.name} - Duration: {ex.duration}s, Rest: {ex.rest}s, Reps: {ex.repetition}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [exercises, setExercises] = useState([{ name: 'Jumping Jacks', duration: 30, rest: 10, repetition: 3, isRest: false }]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loop, setLoop] = useState(false);

  const currentExercise = exercises[currentIndex];
  const nextExercise = exercises[currentIndex + 1];

  const addExercise = (exercise) => {
    setExercises([...exercises, { ...exercise, isRest: false }]);
  };

  const nextExerciseHandler = () => {
    if (loop && currentIndex === exercises.length - 1) {
      setCurrentIndex(0);
    } else if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:max-w-lg">
      <h1 className="text-3xl font-bold mb-4">Fitness Tracker</h1>
      <ExerciseDisplay 
        exercise={{...currentExercise, isRest: false}} 
        nextExercise={nextExercise} 
        onNext={nextExerciseHandler} 
        loop={loop}
        toggleLoop={() => setLoop(!loop)}
      />
      {currentExercise.rest > 0 && (
        <ExerciseDisplay 
          exercise={{...currentExercise, isRest: true}} 
          nextExercise={nextExercise} 
          onNext={nextExerciseHandler}
          loop={false}
        />
      )}
      <ExerciseList exercises={exercises} addExercise={addExercise} />
    </div>
  );
}