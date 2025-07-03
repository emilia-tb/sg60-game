
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { PlayerParticulars } from '../SG60Game';

interface FeedbackCardProps {
  playerName: string;
  playerParticulars: PlayerParticulars | null;
  onComplete: (rating: number, interestedInHearingTest: string, selectedOutlet: string) => void;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({
  playerName,
  playerParticulars,
  onComplete
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [interestedInHearingTest, setInterestedInHearingTest] = useState('');
  const [selectedOutlet, setSelectedOutlet] = useState('');

  const outlets = ["Ang Mo Kio", "Camden Medical (Hearing and Balance Centre)", "Clementi", "Farrer Park (Diagnostic Centre)", "Lucky Plaza (Diagnostic Centre)", "Novena (Diagnostic Centre)", "Parkway Parade", "Tampines", "Yishun"];

  const handleSubmit = () => {
    if (rating > 0 && interestedInHearingTest) {
      onComplete(rating, interestedInHearingTest, selectedOutlet);
    }
  };

  const canSubmit = rating > 0 && interestedInHearingTest && (interestedInHearingTest === 'no' || selectedOutlet);

  return (
    <Card className="w-full bg-white shadow-lg border-0 rounded-3xl p-4 md:p-8">
      <CardContent className="space-y-6 md:space-y-8">
        <div className="text-center space-y-4">
          <h2 className="sg-subheading">
            Thanks for playing, {playerName}!
          </h2>
          <p className="sg-body">
            Before we show your results, we'd love to get your feedback.
          </p>
        </div>

        <div className="space-y-4 p-4 md:p-6 bg-yellow-50 rounded-xl">
          <h3 className="sg-subheading text-xl text-center leading-8">How did you enjoy the SG60 Sound Game?</h3>
          <p className="sg-body text-center">Please rate your experience!</p>
          
          <div className="flex justify-center space-x-2" onMouseLeave={() => setHoveredRating(0)}>
            {[1, 2, 3, 4, 5].map(star => (
              <button 
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                className={`text-3xl transition-colors ${
                  star <= (hoveredRating || rating) ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'
                }`}
              >
                {star <= (hoveredRating || rating) ? '⭐' : '☆'}
              </button>
            ))}
          </div>
          
          {rating > 0 && (
            <p className="sg-body text-center text-sm opacity-70">
              Thank you for your feedback! ({rating} star{rating !== 1 ? 's' : ''})
            </p>
          )}
        </div>

        <div className="space-y-4 p-4 md:p-6 bg-green-50 rounded-xl">
          <div className="space-y-4">
            <div>
              <h3 className="sg-subheading text-lg text-center mb-4 leading-8">Would you be interested in a free hearing test for yourself or your loved ones? *</h3>
              <RadioGroup value={interestedInHearingTest} onValueChange={setInterestedInHearingTest} className="flex justify-center space-x-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes" />
                  <Label htmlFor="yes" className="sg-body">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no" className="sg-body">No</Label>
                </div>
              </RadioGroup>
            </div>

            {interestedInHearingTest === 'yes' && (
              <div className="space-y-2">
                <p className="sg-body text-center">If yes, indicate the outlet you'd like to visit:</p>
                <Select value={selectedOutlet} onValueChange={setSelectedOutlet}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an outlet" />
                  </SelectTrigger>
                  <SelectContent>
                    {outlets.map(outlet => (
                      <SelectItem key={outlet} value={outlet}>
                        {outlet}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <Button 
            onClick={handleSubmit} 
            disabled={!canSubmit}
            className="text-white px-8 py-3 bg-[#e40048] rounded-3xl font-bold text-base disabled:opacity-50"
          >
            Continue to Results
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
