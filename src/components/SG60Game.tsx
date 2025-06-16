import React, { useState, useEffect } from 'react';
import { WelcomeCard } from './game/WelcomeCard';
import { NameCard } from './game/NameCard';
import { SoundCard } from './game/SoundCard';
import { ResultsCard } from './game/ResultsCard';

export interface SoundData {
  id: number;
  name: string;
  description: string;
  audioUrl: string;
}

export interface PlayerResult {
  soundId: number;
  heard: boolean;
}

export interface Player {
  name: string;
  score: number;
  timestamp: number;
}

const sounds: SoundData[] = [
  {
    id: 1,
    name: "MRT Chime",
    description: "The familiar sound of Singapore's MRT system",
    audioUrl: "/[High Volume] Singapore MRT Melodies Chimes [TubeRipper.com].mp3"
  },
  {
    id: 2,
    name: "Hawker Sounds",
    description: "The bustling sounds of a Singapore hawker centre",
    audioUrl: "https://www.youtube.com/watch?v=UYCJczAjlqE"
  },
  {
    id: 3,
    name: "Birdsong",
    description: "The melodious birds of Singapore",
    audioUrl: "https://www.youtube.com/watch?v=VvQaVyjXP1M"
  },
  {
    id: 4,
    name: "Lion Dance",
    description: "Traditional lion dance performance",
    audioUrl: "https://www.youtube.com/watch?v=B1_3YRI3YXs"
  },
  {
    id: 5,
    name: "Majulah Singapura",
    description: "Singapore's national anthem",
    audioUrl: "https://www.youtube.com/watch?v=che2uTVwtGw"
  },
  {
    id: 6,
    name: "Wet Market",
    description: "The lively sounds of a traditional wet market",
    audioUrl: "https://www.youtube.com/shorts/qRt9l21G3ZA"
  },
  {
    id: 7,
    name: "Airplane",
    description: "Aircraft sounds from Changi Airport",
    audioUrl: "https://www.youtube.com/shorts/Mxv4zHXHTCw"
  },
  {
    id: 8,
    name: "Bus Beep",
    description: "Singapore bus door closing beep",
    audioUrl: "https://www.youtube.com/watch?v=GAfPHQbuBIQ"
  },
  {
    id: 9,
    name: "Kallang Wave",
    description: "The roar of the Kallang Wave at the stadium",
    audioUrl: "https://www.youtube.com/shorts/xcR3qVKvha4"
  },
  {
    id: 10,
    name: "Ice Cream Cart",
    description: "The nostalgic melody of the ice cream uncle",
    audioUrl: "https://www.youtube.com/shorts/x3yySOUfP-A"
  }
];

const SG60Game: React.FC = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const [results, setResults] = useState<PlayerResult[]>([]);
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);

  useEffect(() => {
    // Load leaderboard from localStorage
    const savedLeaderboard = localStorage.getItem('sg60-leaderboard');
    if (savedLeaderboard) {
      setLeaderboard(JSON.parse(savedLeaderboard));
    }
  }, []);

  const handleStartGame = () => {
    setCurrentCard(1);
  };

  const handleNameSubmit = (name: string) => {
    setPlayerName(name);
    setCurrentCard(2);
  };

  const handleSoundResponse = (soundId: number, heard: boolean) => {
    const newResult: PlayerResult = { soundId, heard };
    const updatedResults = [...results, newResult];
    setResults(updatedResults);
    
    const nextCard = currentCard + 1;
    if (nextCard <= 11) {
      setCurrentCard(nextCard);
    } else {
      // Game finished, calculate score and update leaderboard
      const score = updatedResults.filter(result => result.heard).length;
      const newPlayer: Player = {
        name: playerName,
        score,
        timestamp: Date.now()
      };
      
      const updatedLeaderboard = [...leaderboard, newPlayer]
        .sort((a, b) => b.score - a.score)
        .slice(0, 50); // Keep top 50
      
      setLeaderboard(updatedLeaderboard);
      localStorage.setItem('sg60-leaderboard', JSON.stringify(updatedLeaderboard));
      setCurrentCard(12);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentCard(0);
    setPlayerName('');
    setResults([]);
  };

  const renderCard = () => {
    switch (currentCard) {
      case 0:
        return <WelcomeCard onStart={handleStartGame} />;
      case 1:
        return <NameCard onSubmit={handleNameSubmit} />;
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
      case 11:
        const soundIndex = currentCard - 2;
        const sound = sounds[soundIndex];
        const soundNumber = soundIndex + 1;
        return (
          <SoundCard
            sound={sound}
            soundNumber={soundNumber}
            totalSounds={sounds.length}
            onResponse={(heard) => handleSoundResponse(sound.id, heard)}
          />
        );
      case 12:
        return (
          <ResultsCard
            playerName={playerName}
            results={results}
            sounds={sounds}
            leaderboard={leaderboard.slice(0, 5)}
            onRetakeQuiz={handleRetakeQuiz}
          />
        );
      default:
        return <WelcomeCard onStart={handleStartGame} />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {renderCard()}
      </div>
    </div>
  );
};

export default SG60Game;
