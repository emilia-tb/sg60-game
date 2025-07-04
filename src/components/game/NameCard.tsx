import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface NameCardProps {
  onSubmit: (name: string) => void;
}

export const NameCard: React.FC<NameCardProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <Card className="w-full bg-white shadow-lg border-0 rounded-3xl p-8">
      <CardContent className="text-center space-y-6">
        <h2 className="sg-subheading">What is your name?</h2>
        <p className="sg-body">This will be used for our leaderboard. The top 5 players with the highest scores and fastest times will be ranked!</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="text-center text-lg py-6 rounded-full border-2 border-gray-300 focus:border-[var(--sg-button)] focus:ring-0"
            required
          />
          <Button
            type="submit"
            disabled={!name.trim()}
            className="sg-button rounded-full px-8 py-6 text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            Continue
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};