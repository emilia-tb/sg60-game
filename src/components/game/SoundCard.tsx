import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play } from 'lucide-react';
import type { SoundData } from '../SG60Game';

interface SoundCardProps {
  sound: SoundData;
  soundNumber: number;
  totalSounds: number;
  soundOptions: string[];
  elapsedTime: number;
  onResponse: (selectedAnswer: string) => void;
}

export const SoundCard: React.FC<SoundCardProps> = ({ 
  sound, 
  soundNumber, 
  totalSounds, 
  soundOptions,
  elapsedTime,
  onResponse 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [currentTime, setCurrentTime] = useState(elapsedTime);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setCurrentTime(elapsedTime);
  }, [elapsedTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlaySound = async () => {
    console.log(`Attempting to play sound: ${sound.name} from URL: ${sound.audioUrl}`);
    setIsPlaying(true);
    setHasPlayed(true);
    setAudioError(false);
    
    try {
      // Clean up previous audio instance
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      // Create new audio instance for mobile compatibility
      const audio = new Audio();
      audioRef.current = audio;
      
      // Set up event listeners before loading
      audio.onended = () => {
        console.log(`Audio ended: ${sound.name}`);
        setIsPlaying(false);
      };
      
      audio.onerror = (error) => {
        console.error(`Error loading audio: ${sound.audioUrl}`, error);
        console.log('Audio failed to load, using fallback beep sound');
        setAudioError(true);
        playBeepSound();
      };

      audio.onloadstart = () => {
        console.log(`Started loading: ${sound.audioUrl}`);
      };

      audio.oncanplay = () => {
        console.log(`Can play: ${sound.audioUrl}`);
      };

      // For mobile compatibility, set properties before loading
      audio.preload = 'auto';
      
      // Load the audio source
      audio.src = sound.audioUrl;
      audio.load();
      
      // Play with user gesture (required for mobile)
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
        }, 10000);
      }
      
    } catch (error) {
      console.error('Error playing audio:', error);
      console.log('Audio URL that failed:', sound.audioUrl);
      setAudioError(true);
      playBeepSound();
    }
  };

  const playBeepSound = () => {
    console.log('Playing fallback beep sound');
    try {
      // Use AudioContext for better mobile support
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();
      
      // Resume context if suspended (required for mobile)
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
    <Card className="w-full bg-white shadow-lg border-0 rounded-3xl p-2 md:p-8">
      <CardContent className="space-y-4 md:space-y-6">
        {/* Timer in top right */}
        <div className="flex justify-between items-center">
          <div></div>
          <div className="bg-[#005da9] text-white px-4 py-2 rounded-full text-lg md:text-xl font-bold">
            {formatTime(currentTime)}
          </div>
        </div>

        <div className="text-center space-y-2">
          <h2 className="sg-subheading">
            Sound {soundNumber} of {totalSounds}
          </h2>
        </div>
        
        <div className="space-y-4 md:space-y-6 text-center">
          <Button
            onClick={handlePlaySound}
            disabled={isPlaying}
            className="sg-button rounded-full px-6 md:px-8 py-4 md:py-6 text-base md:text-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-3 mx-auto"
          >
            <Play size={20} />
            {isPlaying ? 'Playing...' : 'Play Sound'}
          </Button>

          {audioError && (
            <p className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
              Audio file couldn't load. Playing backup sound instead.
            </p>
          )}
          
          {hasPlayed && (
            <div className="space-y-4">
              <p className="sg-body font-medium">
                What sound did you hear?
              </p>
              <div className="grid grid-cols-2 gap-3">
                {soundOptions.map((option) => (
                  <Button
                    key={option}
                    onClick={() => onResponse(option)}
                    className="bg-gray-100 hover:bg-[#005da9] hover:text-white text-gray-800 rounded-full px-4 py-4 text-sm transition-colors border border-gray-300 flex flex-col items-center min-h-[60px]"
                  >
                    <span className="leading-tight">{option}</span>
                    {option === "MRT Chime" && (
                      <span className="text-xs mt-0.5 opacity-70 leading-tight">地铁铃声</span>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
