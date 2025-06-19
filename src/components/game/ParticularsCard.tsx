
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { PlayerParticulars } from '../SG60Game';

interface ParticularsCardProps {
  playerName: string;
  onSubmit: (particulars: PlayerParticulars) => void;
}

export const ParticularsCard: React.FC<ParticularsCardProps> = ({ 
  playerName, 
  onSubmit 
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName.trim() && phone.trim() && email.trim()) {
      const particulars: PlayerParticulars = {
        name: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        rating: 0
      };
      
      // Save to CSV format (for now, just log to console)
      const csvData = `${fullName.trim()},${phone.trim()},${email.trim()},0`;
      console.log('Player particulars CSV:', csvData);
      
      onSubmit(particulars);
    }
  };

  return (
    <Card className="w-full bg-white shadow-lg border-0 rounded-3xl p-8">
      <CardContent className="text-center space-y-6">
        <h2 className="sg-subheading">
          Almost done, {playerName}!
        </h2>
        
        <p className="sg-body">
          Please provide your contact details to claim your prize.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full Name"
            className="text-center text-lg py-6 rounded-full border-2 border-gray-300 focus:border-[#005da9] focus:ring-0"
            required
          />
          
          <Input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number"
            className="text-center text-lg py-6 rounded-full border-2 border-gray-300 focus:border-[#005da9] focus:ring-0"
            required
          />
          
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="text-center text-lg py-6 rounded-full border-2 border-gray-300 focus:border-[#005da9] focus:ring-0"
            required
          />
          
          <Button
            type="submit"
            disabled={!fullName.trim() || !phone.trim() || !email.trim()}
            className="sg-button rounded-full px-8 py-6 text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            Continue to Results
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
