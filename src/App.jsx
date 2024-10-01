import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

// Icon imports
const icons = {
  play: "https://cdns.iconmonstr.com/wp-content/releases/preview/2013/96/iconmonstr-media-control-4.png",
  pause: "https://cdns.iconmonstr.com/wp-content/releases/preview/2013/96/iconmonstr-media-control-8.png",
  previous: "https://cdns.iconmonstr.com/wp-content/releases/preview/2013/96/iconmonstr-media-control-18.png",
  next: "https://cdns.iconmonstr.com/wp-content/releases/preview/2013/96/iconmonstr-media-control-13.png",
  shuffleOn: "https://cdns.iconmonstr.com/wp-content/releases/preview/2018/96/iconmonstr-random-thin.png",
  shuffleOff: "https://cdns.iconmonstr.com/wp-content/releases/preview/2013/96/iconmonstr-media-control-39.png",
  repeatOn: "https://cdns.iconmonstr.com/wp-content/releases/preview/2013/96/iconmonstr-media-control-38.png",
  repeatOff: "https://cdns.iconmonstr.com/wp-content/releases/preview/2013/96/iconmonstr-media-control-39.png",
  favoriteOff: "https://cdns.iconmonstr.com/wp-content/releases/preview/7.7.0/96/iconmonstr-heart-lined.png",
  favoriteOn: "https://cdns.iconmonstr.com/wp-content/releases/preview/7.7.0/96/iconmonstr-heart-filled.png",
  youtube: "https://cdns.iconmonstr.com/wp-content/releases/preview/2012/240/iconmonstr-arrow-62.png"
};

// Music data
const musicList = [
  // ... (insert your music data here as provided)
];

function MusicPlayer() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isFavorite, setIsFavorite] = useState(musicList[currentSongIndex].favorited);
  const audioRef = useRef(new Audio(musicList[currentSongIndex].source));
  const intervalRef = useRef();

  const startTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        if (!isRepeat) handleNext();
        else audioRef.current.play();
      } else {
        setProgress(audioRef.current.currentTime / audioRef.current.duration * 100);
      }
    }, 1000);
  };

  useEffect(() => {
    audioRef.current.src = musicList[currentSongIndex].source;
    setIsFavorite(musicList[currentSongIndex].favorited);
    if (isPlaying) {
      audioRef.current.play();
      startTimer();
    } else {
      audioRef.current.pause();
    }
  }, [currentSongIndex, isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      audioRef.current.play();
      startTimer();
    } else {
      audioRef.current.pause();
      clearInterval(intervalRef.current);
    }
  };

  const handleNext = () => {
    setCurrentSongIndex((prevIndex) => 
      (prevIndex + 1) % musicList.length
    );
  };

  const handlePrevious = () => {
    setCurrentSongIndex((prevIndex) => 
      prevIndex === 0 ? musicList.length - 1 : prevIndex - 1
    );
  };

  const handleShuffle = () => {
    setIsShuffle(!isShuffle);
    if (!isShuffle) {
      // Simple shuffle logic
      let shuffledList = [...musicList].sort(() => Math.random() - 0.5);
      setCurrentSongIndex(shuffledList.findIndex(song => song.source === musicList[currentSongIndex].source));
    }
  };

  const handleRepeat = () => {
    setIsRepeat(!isRepeat);
  };

  const handleFavorite = () => {
    let newList = [...musicList];
    newList[currentSongIndex].favorited = !newList[currentSongIndex].favorited;
    musicList[currentSongIndex] = newList[currentSongIndex];
    setIsFavorite(newList[currentSongIndex].favorited);
  };

  const handleProgressChange = (value) => {
    audioRef.current.currentTime = (value / 100) * audioRef.current.duration;
    setProgress(value);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-sm w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <img src={musicList[currentSongIndex].cover} alt="Music Cover" className="w-full h-64 object-cover"/>
        <div className="p-4">
          <h2 className="text-xl font-bold">{musicList[currentSongIndex].name}</h2>
          <p className="text-gray-600">{musicList[currentSongIndex].artist}</p>
          <Slider value={[progress]} onValueChange={handleProgressChange} max={100} className="my-4"/>
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => window.open(musicList[currentSongIndex].url, '_blank')}>
              <img src={icons.youtube} alt="Go to YouTube" className="h-5 w-5"/>
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handlePrevious}><img src={icons.previous} alt="Previous" className="h-5 w-5"/></Button>
              <Button variant="outline" onClick={handlePlayPause}>
                <img src={isPlaying ? icons.pause : icons.play} alt={isPlaying ? "Pause" : "Play"} className="h-5 w-5"/>
              </Button>
              <Button variant="outline" onClick={handleNext}><img src={icons.next} alt="Next" className="h-5 w-5"/></Button>
            </div>
            <Button variant="outline" onClick={handleShuffle}>
              <img src={isShuffle ? icons.shuffleOn : icons.shuffleOff} alt="Shuffle" className="h-5 w-5"/>
            </Button>
            <Button variant="outline" onClick={handleRepeat}>
              <img src={isRepeat ? icons.repeatOn : icons.repeatOff} alt="Repeat" className="h-5 w-5"/>
            </Button>
            <Button variant="outline" onClick={handleFavorite}>
              <img src={isFavorite ? icons.favoriteOn : icons.favoriteOff} alt="Favorite" className="h-5 w-5"/>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return <MusicPlayer />;
}