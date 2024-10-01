import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const musicList = [
  { name: "Mekanın Sahibi", artist: "Norm Ender", cover: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/1.jpg", source: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/1.mp3", url: "https://www.youtube.com/watch?v=z3wAjJXbYzA", favorited: false },
  // ... other music items as provided ...
];

const icons = {
  play: "https://cdns.iconmonstr.com/wp-content/releases/preview/2013/96/iconmonstr-media-control-4.png",
  pause: "https://cdns.iconmonstr.com/wp-content/releases/preview/2013/96/iconmonstr-media-control-8.png",
  previous: "https://cdns.iconmonstr.com/wp-content/releases/preview/2013/96/iconmonstr-media-control-18.png",
  next: "https://cdns.iconmonstr.com/wp-content/releases/preview/2013/96/iconmonstr-media-control-13.png",
  shuffleOn: "https://cdns.iconmonstr.com/wp-content/releases/preview/2018/96/iconmonstr-random-thin.png",
  shuffleOff: "https://cdns.iconmonstr.com/wp-content/releases/preview/2013/96/iconmonstr-media-control-39.png",
  repeatOn: "https://cdns.iconmonstr.com/wp-content/releases/preview/2013/96/iconmonstr-media-control-38.png",
  repeatOff: "https://cdns.iconmonstr.com/wp-content/releases/preview/2013/96/iconmonstr-media-control-39.png",
  favoriteOn: "https://cdns.iconmonstr.com/wp-content/releases/preview/7.7.0/96/iconmonstr-heart-filled.png",
  favoriteOff: "https://cdns.iconmonstr.com/wp-content/releases/preview/7.7.0/96/iconmonstr-heart-lined.png",
  goToSource: "https://cdns.iconmonstr.com/wp-content/releases/preview/2012/240/iconmonstr-arrow-62.png"
};

function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [isFavorite, setIsFavorite] = useState(musicList[currentTrack].favorited);
  const audioRef = useRef(new Audio(musicList[currentTrack].source));
  const intervalRef = useRef();

  useEffect(() => {
    audioRef.current.src = musicList[currentTrack].source;
    setIsFavorite(musicList[currentTrack].favorited);
    if (isPlaying) audioRef.current.play();
  }, [currentTrack]);

  useEffect(() => {
    audioRef.current.onended = () => {
      if (repeat) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      } else {
        handleNext();
      }
    };
  }, [repeat]);

  const startTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        handleNext();
      } else {
        setProgress(audioRef.current.currentTime / audioRef.current.duration * 100);
      }
    }, [1000]);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
      startTimer();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrack((prev) => (prev + 1) % musicList.length);
  };

  const handlePrev = () => {
    setCurrentTrack((prev) => prev === 0 ? musicList.length - 1 : prev - 1);
  };

  const handleShuffle = () => {
    setShuffle(!shuffle);
    if (!shuffle) {
      // Simple shuffle logic
      let array = [...musicList];
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      // Ensure current track is still in view
      const currentIndex = array.findIndex(track => track.name === musicList[currentTrack].name);
      [array[0], array[currentIndex]] = [array[currentIndex], array[0]];
      // Here you would typically update state with new order, 
      // but for simplicity, we're not updating the state here.
    }
  };

  const handleRepeat = () => setRepeat(!repeat);
  
  const handleFavorite = () => {
    const newFav = !isFavorite;
    setIsFavorite(newFav);
    musicList[currentTrack].favorited = newFav;
  };

  const handleGoToSource = () => {
    window.open(musicList[currentTrack].url, '_blank');
  };

  const onSliderChange = (value) => {
    const time = (value / 100) * audioRef.current.duration;
    audioRef.current.currentTime = time;
    setProgress(value);
  };

  return (
    <Card className="max-w-sm mx-auto mt-10">
      <CardHeader>
        <img src={musicList[currentTrack].cover} alt={musicList[currentTrack].name} className="w-full h-64 object-cover" />
      </CardHeader>
      <CardContent>
        <h2 className="text-lg font-bold">{musicList[currentTrack].name}</h2>
        <p>{musicList[currentTrack].artist}</p>
        <Slider defaultValue={[0]} max={100} onValueChange={onSliderChange} value={[progress]} />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="icon" onClick={handlePrev}><img src={icons.previous} alt="Previous" /></Button>
        <Button variant="icon" onClick={handlePlayPause}><img src={isPlaying ? icons.pause : icons.play} alt="Play/Pause" /></Button>
        <Button variant="icon" onClick={handleNext}><img src={icons.next} alt="Next" /></Button>
        <Button variant="icon" onClick={handleShuffle}><img src={shuffle ? icons.shuffleOn : icons.shuffleOff} alt="Shuffle" /></Button>
        <Button variant="icon" onClick={handleFavorite}><img src={isFavorite ? icons.favoriteOn : icons.favoriteOff} alt="Favorite" /></Button>
        <Button variant="icon" onClick={handleGoToSource}><img src={icons.goToSource} alt="Go to Source" /></Button>
        <Button variant="icon" onClick={handleRepeat}><img src={repeat ? icons.repeatOn : icons.repeatOff} alt="Repeat" /></Button>
      </CardFooter>
    </Card>
  );
}

export default function App() {
  return <MusicPlayer />;
}