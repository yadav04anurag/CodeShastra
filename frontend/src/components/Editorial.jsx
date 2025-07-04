// import { useState, useRef, useEffect } from 'react';
// import { Pause, Play } from 'lucide-react';



// const Editorial = ({ secureUrl, thumbnailUrl, duration }) => {


//   const videoRef = useRef(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [isHovering, setIsHovering] = useState(false);

//   // Format seconds to MM:SS
//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
//   };

//   const togglePlayPause = () => {
//     if (videoRef.current) {
//       if (isPlaying) {
//         videoRef.current.pause();
//       } else {
//         videoRef.current.play();
//       }
//       setIsPlaying(!isPlaying);
//     }
//   };

//   // Update current time during playback
//   useEffect(() => {
//     const video = videoRef.current;
    
//     const handleTimeUpdate = () => {
//       if (video) setCurrentTime(video.currentTime);
//     };
    
//     if (video) {
//       video.addEventListener('timeupdate', handleTimeUpdate);
//       return () => video.removeEventListener('timeupdate', handleTimeUpdate);
//     }
//   }, []);

//   return (
//     <div 
//       className="relative w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-lg"
//       onMouseEnter={() => setIsHovering(true)}
//       onMouseLeave={() => setIsHovering(false)}
//     >
//       {/* Video Element */}
//       <video
//         ref={videoRef}
//         src={secureUrl}
//         poster={thumbnailUrl}
//         onClick={togglePlayPause}
//         className="w-full aspect-video bg-black cursor-pointer"
//       />
      
//       {/* Video Controls Overlay */}
//       <div 
//         className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity ${
//           isHovering || !isPlaying ? 'opacity-100' : 'opacity-0'
//         }`}
//       >
//         {/* Play/Pause Button */}
//         <button
//           onClick={togglePlayPause}
//           className="btn btn-circle btn-primary mr-3"
//           aria-label={isPlaying ? "Pause" : "Play"}
//         >
//           {isPlaying ? (
//             <Pause/>
//           ) : (
//             <Play/>
//           )}
//         </button>
        
//         {/* Progress Bar */}
//         <div className="flex items-center w-full mt-2">
//           <span className="text-white text-sm mr-2">
//             {formatTime(currentTime)}
//           </span>
//           <input
//             type="range"
//             min="0"
//             max={duration}
//             value={currentTime}
//             onChange={(e) => {
//               if (videoRef.current) {
//                 videoRef.current.currentTime = Number(e.target.value);
//               }
//             }}
//             className="range range-primary range-xs flex-1"
//           />
//           <span className="text-white text-sm ml-2">
//             {formatTime(duration)}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };


// export default Editorial;


import { useState, useRef, useEffect } from 'react';
import { Pause, Play, Gauge, Maximize2, Minimize2 } from 'lucide-react';

const Editorial = ({ secureUrl, thumbnailUrl, duration }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [showSpeedOptions, setShowSpeedOptions] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(e => console.error("Play failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const changePlaybackRate = (rate) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
    setShowSpeedOptions(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      // Enter fullscreen
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen(); // Safari
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen(); // IE11
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen(); // Safari
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen(); // IE11
      }
    }
  };

  // Event handlers
  useEffect(() => {
    const video = videoRef.current;
    
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => setIsLoading(false);
    const handleLoadedData = () => setIsLoading(false);
    const handleRateChange = () => setPlaybackRate(video.playbackRate);
    
    // Fullscreen change handlers
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement || 
        document.webkitFullscreenElement || 
        document.msFullscreenElement
      );
    };
    
    if (video) {
      video.playbackRate = playbackRate;
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('waiting', handleWaiting);
      video.addEventListener('playing', handlePlaying);
      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('ratechange', handleRateChange);
      
      // Fullscreen events
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.addEventListener('msfullscreenchange', handleFullscreenChange);
      
      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('waiting', handleWaiting);
        video.removeEventListener('playing', handlePlaying);
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('ratechange', handleRateChange);
        
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.removeEventListener('msfullscreenchange', handleFullscreenChange);
      };
    }
  }, [playbackRate]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full mx-auto rounded-2xl overflow-hidden shadow-2xl bg-gray-900 ${
        isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'max-w-4xl'
      }`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={secureUrl}
        poster={thumbnailUrl}
        onClick={togglePlayPause}
        className={`w-full bg-black cursor-pointer object-cover ${
          isFullscreen ? 'h-screen' : 'aspect-video'
        }`}
      />
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="h-12 w-12 text-indigo-500 animate-spin">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
            </svg>
          </div>
        </div>
      )}
      
      {/* Video Controls Overlay */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 transition-all duration-300 ${
          isHovering || !isPlaying || showSpeedOptions ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center justify-between w-full">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-lg"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 text-white fill-current" />
            ) : (
              <Play className="h-5 w-5 text-white fill-current ml-0.5" />
            )}
          </button>
          
          {/* Time Display */}
          <div className="flex items-center w-full max-w-md mx-4">
            <span className="text-gray-300 text-xs font-mono min-w-[40px] text-right">
              {formatTime(currentTime)}
            </span>
            
            {/* Progress Bar */}
            <div className="relative flex-1 mx-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-indigo-600 rounded-full"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={(e) => {
                  const time = Number(e.target.value);
                  setCurrentTime(time);
                  if (videoRef.current) videoRef.current.currentTime = time;
                }}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            
            <span className="text-gray-400 text-xs font-mono min-w-[40px]">
              {formatTime(duration)}
            </span>
          </div>
          
          {/* Controls Group */}
          <div className="flex items-center gap-2">
            {/* Speed Control */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedOptions(!showSpeedOptions)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors group"
              >
                <Gauge className="h-4 w-4 text-gray-300 group-hover:text-white" />
                <span className="text-gray-300 text-sm font-medium">
                  {playbackRate}x
                </span>
              </button>
              
              {showSpeedOptions && (
                <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg shadow-xl z-20 w-32 overflow-hidden border border-gray-700">
                  {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(speed => (
                    <button
                      key={speed}
                      onClick={() => changePlaybackRate(speed)}
                      className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-700/70 transition-colors ${
                        speed === playbackRate 
                          ? 'text-indigo-400 bg-gray-700/50 font-medium' 
                          : 'text-gray-300'
                      }`}
                    >
                      {speed}x{speed === 1 && ' (Normal)'}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="flex items-center justify-center h-10 w-10 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4 text-gray-300" />
              ) : (
                <Maximize2 className="h-4 w-4 text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Play Button Overlay */}
      {!isPlaying && !isHovering && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlayPause}
            className="flex items-center justify-center h-16 w-16 rounded-full bg-black/50 backdrop-blur-sm hover:bg-indigo-600/80 transition-all"
            aria-label="Play"
          >
            <Play className="h-8 w-8 text-white fill-current ml-1" />
          </button>
        </div>
      )}
      
      {/* Keyboard Shortcut Hint */}
      {(isHovering && !isPlaying) && (
        <div className="absolute top-4 right-4 bg-black/60 text-gray-300 text-xs px-3 py-1.5 rounded-lg backdrop-blur-sm">
          Press <kbd className="px-1.5 py-0.5 bg-gray-700 rounded mx-0.5">Space</kbd> to play
        </div>
      )}
    </div>
  );
};

export default Editorial;