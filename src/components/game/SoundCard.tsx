
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play } from 'lucide-react';
import type { SoundData } from '../SG60Game';

interface SoundCardProps {
  sound: SoundData;
  soundNumber: number;
  totalSounds: number;
  onResponse: (heard: boolean) => void;
}

export const SoundCard: React.FC<SoundCardProps> = ({ 
  sound, 
  soundNumber, 
  totalSounds, 
  onResponse 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlaySound = async () => {
    setIsPlaying(true);
    setHasPlayed(true);
    
    try {
      // Create audio element if it doesn't exist
      if (!audioRef.current) {
        audioRef.current = new Audio(sound.audioUrl);
        audioRef.current.preload = 'metadata';
        
        // Add event listeners
        audioRef.current.onended = () => {
          setIsPlaying(false);
        };
        
        audioRef.current.onerror = () => {
          console.error('Error loading audio:', sound.audioUrl);
          playBeepSound();
        };
      }
      
      // Reset audio to beginning
      audioRef.current.currentTime = 0;
      
      // For mobile devices, we need to handle user interaction requirements
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        console.log(`Playing sound: ${sound.name} from ${sound.audioUrl}`);
      }
      
      // Set a timeout as backup in case onended doesn't fire
      setTimeout(() => {
        setIsPlaying(false);
      }, 10000);
      
    } catch (error) {
      console.error('Error playing audio:', error);
      // Fallback to beep sound
      playBeepSound();
    }
  };

  const playBeepSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
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
      }, 2000);
    } catch (error) {
      console.error('Error playing beep sound:', error);
      setIsPlaying(false);
    }
  };

  return (
    <Card className="w-full bg-white shadow-lg border-0 rounded-3xl p-2 md:p-8">
      <CardContent className="text-center space-y-4 md:space-y-6">
        <div className="space-y-2">
          <p className="sg-body opacity-70">
            Sound {soundNumber} of {totalSounds}
          </p>
          <h2 className="sg-subheading">
            {sound.name}
          </h2>
          <p className="sg-body">
            {sound.description}
          </p>
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
          
          {hasPlayed && (
            <div className="space-y-4">
              <p className="sg-body font-medium">
                Did you hear the sound clearly?
              </p>
              <div className="flex flex-col gap-3 justify-center">
                <Button
                  onClick={() => onResponse(true)}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6 py-3 md:py-4 text-base md:text-lg transition-colors w-full"
                >
                  Yes, I heard it
                </Button>
                <Button
                  onClick={() => onResponse(false)}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6 py-3 md:py-4 text-base md:text-lg transition-colors w-full"
                >
                  No, I didn't hear it
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
