
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface CountdownCardProps {
  onComplete: () => void;
}

export const CountdownCard: React.FC<CountdownCardProps> = ({ onComplete }) => {
  const [count, setCount] = useState(3);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Aggressively preload and prepare audio immediately
    if (audioRef.current) {
      const audio = audioRef.current;
      
      // Set audio properties for immediate playback
      audio.volume = 1.0;
      audio.loop = true;
      audio.preload = 'auto';
      
      // Set up event listeners
      audio.oncanplaythrough = () => {
        console.log('Countdown audio preloaded and ready to play');
        setIsAudioReady(true);
        
        // Try to play immediately when ready
        audio.play().catch((error) => {
          console.log('Auto-play blocked, will play on user interaction:', error);
        });
      };

      audio.onloadeddata = () => {
        console.log('Audio data loaded');
        // Try to play as soon as data is loaded
        if (audio.readyState >= 2) {
          audio.play().catch(console.error);
        }
      };

      audio.onerror = (error) => {
        console.error('Error loading countdown audio:', error);
      };

      // Force immediate load
      audio.load();
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
          preload="auto"
          playsInline
          crossOrigin="anonymous"
        />
      </CardContent>
    </Card>
  );
};
