import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Leaderboard } from './Leaderboard';
import type { PlayerResult, SoundData, Player, PlayerParticulars } from '../SG60Game';

interface ResultsCardProps {
  playerName: string;
  results: PlayerResult[];
  sounds: SoundData[];
  totalTime: number;
  playerParticulars: PlayerParticulars | null;
  feedbackData: {
    rating: number;
    interestedInHearingTest: string;
    selectedOutlet: string;
  } | null;
  onRetakeQuiz: () => void;
}

export const ResultsCard: React.FC<ResultsCardProps> = ({
  playerName,
  results,
  sounds,
  totalTime,
  playerParticulars,
  feedbackData,
  onRetakeQuiz,
}) => {
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const score = results.filter((r) => r.correct).length;

  useEffect(() => {
    const saveAndFetch = async () => {
      try {
        const res = await fetch('api/save-participant.php', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'X-SG60-Secret': 'ZheWfSfNl2xJrJfB9H1C6LHgIGpfpOIx',
          },
          body: JSON.stringify({
            name: playerParticulars.name,
            phone: playerParticulars?.phone,
            email: playerParticulars?.email,
            leaderboard_name: playerName,
            rating: feedbackData?.rating,
            outlet: feedbackData?.selectedOutlet,
            interested: feedbackData?.interestedInHearingTest,
            score,
            totalTime: Math.floor(totalTime / 1000),
          }),
        });
        await res.json();
      } catch (e) {
        console.error('Failed to save participant:', e);
      }
 
      try {
        const leaderboardRes = await fetch('api/get-leaderboard.php');
        const data = await leaderboardRes.json();
        const sorted = data
          .filter((p: any) => p.name && p.score != null && p.total_time != null)
          .map((p: any) => ({
            name: p.name,
            score: Number(p.score),
            totalTime: Number(p.total_time),
            timestamp: new Date(p.created_at).getTime(), // mock timestamp for key
          }))
          .sort((a: Player, b: Player) => {
            if (a.score !== b.score) return b.score - a.score;
            return a.totalTime - b.totalTime;
          })
          .slice(0, 5);

        setLeaderboard(sorted);

      } catch (e) {
        console.error('Failed to fetch leaderboard:', e);
      }
    };

    saveAndFetch();
  }, [playerName, score, totalTime, feedbackData, playerParticulars]);

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getChineseTranslation = (answer: string) => {
    const translations: { [key: string]: string } = {
      'MRT Chime': '地铁铃声',
      'Bus Doors Closing': '巴士关门提示',
      'Koel Bird ("Uwu" Bird)': '噪鹃鸟 ("呜呜"鸟)',
      'Hawker Centre': '小贩中心',
      'Ice Cream Cart Bell': '冰淇淋推车铃',
      'Kallang Wave': '加冷人浪',
      'Lion Dance': '舞狮',
      'Wet Market': '巴杀',
      'National Anthem': '国歌',
      Mahjong: '麻将',
    };
    return translations[answer] || '';
  };

  return (
    <div className="space-y-6">
      <Card className="w-full bg-white shadow-lg border-0 rounded-3xl p-4 md:p-8">
        <CardContent className="space-y-6 md:space-y-8">
          <div className="text-center space-y-4">
            <h2 className="sg-subheading">Results for {playerName}</h2>
            <div className={`text-6xl font-bold ${getScoreColor(score)}`}>{score}/{sounds.length}</div>
            <p className="sg-body">You got {score} out of {sounds.length} sounds correct!</p>
            <p className="sg-body text-sm opacity-70">Total time: {Math.floor(totalTime / 1000)} seconds</p>
          </div>

          <div className="space-y-4">
            <h3 className="sg-subheading text-xl text-center">Sound Breakdown</h3>
            <div className="grid gap-3">
              {results.map((result, index) => {
                const soundNumber = index + 1;
                const chineseTranslation = getChineseTranslation(result.selectedAnswer);
                return (
                  <div
                    key={result.soundId}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="sg-body font-medium">Sound {soundNumber}</span>
                    <div className="text-right">
                      <span className={`font-bold ${result.correct ? 'text-green-600' : 'text-red-600'}`}>
                        {result.correct ? '✓ Correct' : '✗ Wrong'}
                      </span>
                      <div className="text-xs opacity-70">
                        Your answer: {result.selectedAnswer}
                        {chineseTranslation && <div className="text-xs opacity-60">{chineseTranslation}</div>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4 p-4 md:p-6 bg-blue-50 rounded-xl">
            <h3 className="sg-subheading text-xl text-center leading-8">Redeem your FREE gift and hearing test in our clinic!</h3>
            <p className="sg-body text-center">
              Show this page to our friendly staff to redeem your gift*. Do note that each player can only redeem their
              gift and hearing test once.
            </p>
            <p className="opacity-50 text-center italic text-[12px] font-light">
              *Online players are encouraged to give us a call at 6238 8832 before heading down to redeem your items at
              any of our clinics to ensure availability of gifts.
            </p>
          </div>
        </CardContent>
      </Card>

      <Leaderboard leaderboard={leaderboard} playerName={playerName} totalSounds={sounds.length} />
    </div>
  );
};
