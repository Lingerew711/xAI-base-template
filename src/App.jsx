import { useState, useEffect, useRef } from "react";

const tracks = [
  {
    name: "Mekanın Sahibi",
    artist: "Norm Ender",
    cover: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/1.jpg",
    source: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/1.mp3",
    url: "https://www.youtube.com/watch?v=z3wAjJXbYzA",
    favorited: false
  },
  {
    name: "Everybody Knows",
    artist: "Leonard Cohen",
    cover: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/2.jpg",
    source: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/2.mp3",
    url: "https://www.youtube.com/watch?v=Lin-a2lTelg",
    favorited: true
  },
  {
    name: "Extreme Ways",
    artist: "Moby",
    cover: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/3.jpg",
    source: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/3.mp3",
    url: "https://www.youtube.com/watch?v=ICjyAe9S54c",
    favorited: false
  },
  {
    name: "Butterflies",
    artist: "Sia",
    cover: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/4.jpg",
    source: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/4.mp3",
    url: "https://www.youtube.com/watch?v=kYgGwWYOd9Y",
    favorited: false
  },
  {
    name: "The Final Victory",
    artist: "Haggard",
    cover: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/5.jpg",
    source: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/5.mp3",
    url: "https://www.youtube.com/watch?v=0WlpALnQdN8",
    favorited: true
  },
  {
    name: "Genius ft. Sia, Diplo, Labrinth",
    artist: "LSD",
    cover: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/6.jpg",
    source: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/6.mp3",
    url: "https://www.youtube.com/watch?v=HhoATZ1Imtw",
    favorited: false
  },
  {
    name: "The Comeback Kid",
    artist: "Lindi Ortega",
    cover: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/7.jpg",
    source: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/7.mp3",
    url: "https://www.youtube.com/watch?v=me6aoX0wCV8",
    favorited: true
  },
  {
    name: "Overdose",
    artist: "Grandson",
    cover: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/8.jpg",
    source: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/8.mp3",
    url: "https://www.youtube.com/watch?v=00-Rl3Jlx-o",
    favorited: false
  },
  {
    name: "Rag'n'Bone Man",
    artist: "Human",
    cover: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/img/9.jpg",
    source: "https://raw.githubusercontent.com/muhammederdem/mini-player/master/mp3/9.mp3",
    url: "https://www.youtube.com/watch?v=L3wKzyIN1yk",
    favorited: false
  }
];

function App() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [favorited, setFavorited] = useState(tracks[0].favorited);
  const audioRef = useRef(null);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [shuffledTracks, setShuffledTracks] = useState([]);



  const toggleRepeat = () => {
    setIsRepeat(!isRepeat);
  };
  
  const shuffleTracks = () => {
    let indices = tracks.map((_, index) => index);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]]; // ES6 destructuring assignment to swap elements
    }
    setShuffledTracks(indices);
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
    if (!isShuffle) { // If shuffle is about to be turned on
      shuffleTracks();
    }
  };
  

  useEffect(() => {
    const audio = new Audio(tracks[currentTrackIndex].source);
  
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };
  
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
  
    const handleTrackEnd = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        changeTrack('next');
      }
    };
  
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleTrackEnd);
  
    // Set the audioRef to the new Audio object
    audioRef.current = audio;
    if (isPlaying) {
      audioRef.current.play();
    }
  
    return () => {
      audioRef.current.pause();
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleTrackEnd);
    };
  }, [currentTrackIndex, isRepeat, isPlaying]);
  

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const togglePlay = () => {
    const playing = !isPlaying;
    setIsPlaying(playing);
    if (playing) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  const toggleFavorite = () => {
    const newFavorited = !favorited;
    setFavorited(newFavorited);
    tracks[currentTrackIndex].favorited = newFavorited;
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressBarClick = (e) => {
    const bar = e.target;
    const rect = bar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickedValue = (x / rect.width) * duration;
    audioRef.current.currentTime = clickedValue;
    setCurrentTime(clickedValue);
  };
  const changeTrack = (direction) => {
    if (isShuffle) {
      const currentIndex = shuffledTracks.indexOf(currentTrackIndex);
      const nextIndex = direction === 'next'
        ? (currentIndex + 1) % shuffledTracks.length
        : (currentIndex - 1 + shuffledTracks.length) % shuffledTracks.length;
      setCurrentTrackIndex(shuffledTracks[nextIndex]);
    } else {
      const newIndex = direction === 'next'
        ? (currentTrackIndex + 1) % tracks.length
        : (currentTrackIndex - 1 + tracks.length) % tracks.length;
      setCurrentTrackIndex(newIndex);
    }
  };
  

  const goToYouTube = () => {
    window.open(tracks[currentTrackIndex].url, '_blank');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-500">
      <div className="bg-white rounded-lg shadow-lg p-5 w-96 py-8">
        <div className="flex justify-center">
          <img
            src={tracks[currentTrackIndex].cover}
            alt={tracks[currentTrackIndex].name}
            
            className={`rounded-full w-40 h-40 object-cover ${isPlaying ? 'animate-spin' : ''}`}
    style={isPlaying ? { animation: "spin 10s linear infinite" } : {}}
          />
        </div>
        <div className="text-center mt-3">
          <h2 className="text-lg">{tracks[currentTrackIndex].artist}</h2>
          <h1 className="text-xl font-bold">{tracks[currentTrackIndex].name}</h1>
        </div>
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-1.5 mt-1 relative cursor-pointer" onClick={handleProgressBarClick}>
            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
          </div>
        </div>
        <div className="flex justify-around mb-5 py-8">
  <button onClick={() => changeTrack('prev')}>
    <img src="https://cdns.iconmonstr.com/wp-content/releases/preview/2013/96/iconmonstr-media-control-18.png" alt="Previous" className="w-6 h-6 rounded-full" />
  </button>
  <button onClick={togglePlay}>
    {isPlaying ? (
      <img src="https://cdns.iconmonstr.com/wp-content/releases/preview/2013/96/iconmonstr-media-control-8.png" alt="Pause" className="w-6 h-6 rounded-full" />
    ) : (
      <img src="https://cdns.iconmonstr.com/wp-content/releases/preview/2013/96/iconmonstr-media-control-4.png" alt="Play" className="w-6 h-6 rounded-full" />
    )}
  </button>
  <button onClick={() => changeTrack('next')}>
    <img src="https://cdns.iconmonstr.com/wp-content/releases/preview/2013/96/iconmonstr-media-control-13.png" alt="Next" className="w-6 h-6 rounded-full" />
  </button>
</div>
<div className="flex justify-around mt-5 py-8">
  <button onClick={toggleFavorite}>
    {favorited ? (
      <img src="https://cdns.iconmonstr.com/wp-content/releases/preview/7.7.0/96/iconmonstr-heart-filled.png" alt="Favorite On" className="w-6 h-6 rounded-full" />
    ) : (
      <img src="https://cdns.iconmonstr.com/wp-content/releases/preview/7.7.0/96/iconmonstr-heart-lined.png" alt="Favorite Off" className="w-6 h-6 rounded-full" />
    )}
  </button>
  <button onClick={toggleShuffle}>
    {isShuffle ? (
      <img src="https://cdns.iconmonstr.com/wp-content/releases/preview/2018/96/iconmonstr-random-thin.png" alt="Shuffle On" className="w-6 h-6 rounded-full" />
    ) : (
      <img src="https://cdns.iconmonstr.com/wp-content/releases/preview/2013/96/iconmonstr-media-control-39.png" alt="Shuffle Off" className="w-6 h-6 rounded-full" />
    )}
  </button>
  <button onClick={toggleRepeat}>
    {isRepeat ? (
      <img src="https://cdns.iconmonstr.com/wp-content/releases/preview/2013/96/iconmonstr-media-control-38.png" alt="Repeat On" className="w-6 h-6 rounded-full" />
    ) : (
      <img src="https://cdns.iconmonstr.com/wp-content/releases/preview/2013/96/iconmonstr-media-control-39.png" alt="Repeat Off" className="w-6 h-6 rounded-full" />
    )}
  </button>
  <button onClick={goToYouTube}>
    <img src="https://cdns.iconmonstr.com/wp-content/releases/preview/2012/240/iconmonstr-arrow-62.png" alt="Go to YouTube" className="w-6 h-6 rounded-full" />
  </button>
</div>

      </div>
    </div>
  );
}

export default App;