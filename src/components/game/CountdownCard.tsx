
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface CountdownCardProps {
  onComplete: () => void;
}

export const CountdownCard: React.FC<CountdownCardProps> = ({ onComplete }) => {
  const [count, setCount] = useState(3);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Preload and prepare audio immediately
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.volume = 1.0;
      
      // Set up event listeners
      audioRef.current.oncanplaythrough = () => {
        console.log('Audio preloaded and ready to play');
        // Play immediately when ready
        if (audioRef.current) {
          audioRef.current.play().catch(console.error);
        }
      };

      audioRef.current.onerror = (error) => {
        console.error('Error loading countdown audio:', error);
      };
    }
  }, []);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => {
        setCount(count - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        // Stop the music when countdown completes
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        onComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [count, onComplete]);

  return (
    <Card className="w-full bg-white shadow-lg border-0 rounded-3xl p-8">
      <CardContent className="text-center space-y-8">
        <h2 className="sg-subheading">
          Game starts in
        </h2>
        
        <div className="text-8xl font-bold text-[#005da9] animate-pulse">
          {count > 0 ? count : 'Go!'}
        </div>
        
        <audio
          ref={audioRef}
          src="/sg60-sound-game-start-sound.mp3"
          loop
          preload="auto"
          playsInline
        />
      </CardContent>
    </Card>
  );
};
