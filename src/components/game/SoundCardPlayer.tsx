
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import type { SoundData } from '../SG60Game';

interface SoundCardPlayerProps {
  sound: SoundData;
  onPlayComplete: () => void;
}

export const SoundCardPlayer: React.FC<SoundCardPlayerProps> = ({ sound, onPlayComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [isPreloaded, setIsPreloaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Aggressive preloading with immediate audio setup
  useEffect(() => {
    const preloadAudio = () => {
      try {
        const audio = new Audio();
        audioRef.current = audio;
        
        // Set audio properties for faster loading
        audio.preload = 'auto';
        audio.crossOrigin = 'anonymous';
        audio.volume = 1.0;
        
        const handleCanPlayThrough = () => {
          console.log(`Audio preloaded and ready: ${sound.name}`);
          setIsPreloaded(true);
        };
        
        const handleError = (error: any) => {
          console.error(`Error preloading audio: ${sound.audioUrl}`, error);
          setAudioError(true);
        };

        const handleLoadStart = () => {
          console.log(`Starting to load: ${sound.name}`);
        };

        const handleProgress = () => {
          if (audio.buffered.length > 0) {
            const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
            const duration = audio.duration;
            if (duration > 0) {
              const percentLoaded = (bufferedEnd / duration) * 100;
              console.log(`Loading progress for ${sound.name}: ${percentLoaded.toFixed(1)}%`);
            }
          }
        };

        // Add event listeners
        audio.addEventListener('canplaythrough', handleCanPlayThrough);
        audio.addEventListener('error', handleError);
        audio.addEventListener('loadstart', handleLoadStart);
        audio.addEventListener('progress', handleProgress);

        // Start loading immediately
        audio.src = sound.audioUrl;
        audio.load();

        return () => {
          audio.removeEventListener('canplaythrough', handleCanPlayThrough);
          audio.removeEventListener('error', handleError);
          audio.removeEventListener('loadstart', handleLoadStart);
          audio.removeEventListener('progress', handleProgress);
        };
      } catch (error) {
        console.error('Error setting up audio preload:', error);
        setAudioError(true);
      }
    };

    const cleanup = preloadAudio();

    return () => {
      if (cleanup) cleanup();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [sound.audioUrl, sound.name]);

  const handlePlaySound = async () => {
    console.log(`Attempting to play sound: ${sound.name} from URL: ${sound.audioUrl}`);
    setIsPlaying(true);
    onPlayComplete();
    setAudioError(false);
    
    try {
      const audio = audioRef.current;
      
      if (!audio) {
        throw new Error('Audio not initialized');
      }

      // Reset audio to beginning
      audio.currentTime = 0;
      
      // Set up event listeners for this play session
      const handleEnded = () => {
        console.log(`Audio ended: ${sound.name}`);
        setIsPlaying(false);
      };
      
      const handlePlayError = (error: any) => {
        console.error(`Error playing audio: ${sound.audioUrl}`, error);
        setAudioError(true);
        setIsPlaying(false);
        playBeepSound();
      };

      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handlePlayError);

      // Play immediately since audio is preloaded
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        console.log(`Successfully playing: ${sound.name}`);
        
        // Auto-stop after 10 seconds
        setTimeout(() => {
          if (audio && !audio.paused) {
            audio.pause();
            setIsPlaying(false);
          }
          // Clean up listeners
          audio.removeEventListener('ended', handleEnded);
          audio.removeEventListener('error', handlePlayError);
        }, 10000);
      }
      
    } catch (error) {
      console.error('Error playing audio:', error);
      setAudioError(true);
      setIsPlaying(false);
      playBeepSound();
    }
  };

  const playBeepSound = () => {
    console.log('Playing fallback beep sound');
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();
      
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 2);
      
      setTimeout(() => {
        setIsPlaying(false);
        audioContext.close();
      }, 2000);
    } catch (error) {
      console.error('Error playing beep sound:', error);
      setIsPlaying(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 text-center">
      <Button
        onClick={handlePlaySound}
        disabled={isPlaying || !isPreloaded}
        className="sg-button rounded-full px-6 md:px-8 py-4 md:py-6 text-base md:text-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-3 mx-auto"
      >
        <Play size={20} />
        {isPlaying ? 'Playing...' : !isPreloaded ? 'Loading...' : 'Play Sound'}
      </Button>

      {audioError && (
        <p className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
          Audio file couldn't load. Playing backup sound instead.
        </p>
      )}
    </div>
  );
};
