
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface CountdownCardProps {
  onComplete: () => void;
}

export const CountdownCard: React.FC<CountdownCardProps> = ({ onComplete }) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => {
        setCount(count - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
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
      </CardContent>
    </Card>
  );
};
