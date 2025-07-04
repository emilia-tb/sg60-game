
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

  // Preload audio when component mounts
  useEffect(() => {
  const audio = new Audio();
  audioRef.current = audio;

  audio.preload = 'auto';
  audio.src = sound.audioUrl;

  audio.oncanplaythrough = () => {
    console.log('Audio preloaded and ready to play');
    
    setIsPreloaded(true);
    setAudioError(false);
  };

  audio.onerror = (error) => {
    console.error(`Error preloading audio: ${sound.audioUrl}`, error);
    setAudioError(true);
  };

  audio.load();

  return () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

     setIsPlaying(false); // Reset button state
  };
}, [sound.audioUrl]);


  const handlePlaySound = async () => {
    console.log(`Attempting to play sound: ${sound.name} from URL: ${sound.audioUrl}`);
    setIsPlaying(true);
    // onPlayComplete();
    setAudioError(false);
    
    try {
      const audio = audioRef.current;
      
      if (!audio) {
        throw new Error('Audio not initialized');
      }

      // Reset audio to beginning
      audio.currentTime = 0;
      
      // Set up event listeners for this play session
      audio.onended = () => {
        console.log(`Audio ended: ${sound.name}`);
        setIsPlaying(false);
        onPlayComplete();
      };
      
      audio.onerror = (error) => {
        console.error(`Error playing audio: ${sound.audioUrl}`, error);
        setAudioError(true);
        playBeepSound();
      };

      if (isPlaying) {
        audio.pause();
        audio.currentTime = 0;
      }

      // Play immediately since audio is preloaded
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        console.log(`Successfully playing: ${sound.name}`);
        setIsPlaying(true);
        
        // Auto-stop after 10 seconds
        setTimeout(() => {
          if (audio && !audio.paused) {
            audio.pause();
            setIsPlaying(false);
          }
        }, 10000);
      }
      
    } catch (error) {
      console.error('Error playing audio:', error);
      setAudioError(true);
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
