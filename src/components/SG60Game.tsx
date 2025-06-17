
import React, { useState, useEffect } from 'react';
import { WelcomeCard } from './game/WelcomeCard';
import { NameCard } from './game/NameCard';
import { SoundCard } from './game/SoundCard';
import { ResultsCard } from './game/ResultsCard';
import { Leaderboard } from './game/Leaderboard';

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
    audioUrl: "/SG60 Sound Game - MRT.mp3"
  },
  {
    id: 2,
    name: "Hawker Sounds",
    description: "The bustling sounds of a Singapore hawker centre",
    audioUrl: "/SG60 Sound Game - Hawker.mp3"
  },
  {
    id: 3,
    name: "Birdsong",
    description: "The sound of the iconic Koel bird",
    audioUrl: "/SG60 Sound Game - Koel Bird.mp3"
  },
  {
    id: 4,
    name: "Lion Dance",
    description: "Traditional lion dance performance",
    audioUrl: "/SG60 Sound Game - Lion Dance.mp3"
  },
  {
    id: 5,
    name: "National Anthem",
    description: "Singapore's national anthem",
    audioUrl: "/SG60 Sound Game - National Athem.mp3"
  },
  {
    id: 6,
    name: "Wet Market",
    description: "The lively sounds of a traditional wet market",
    audioUrl: "/SG60 Sound Game - Market.mp3"
  },
  {
    id: 7,
    name: "Airplane",
    description: "Aircraft sounds from Changi Airport",
    audioUrl: "/SG60 Sound Game - Airplane.mp3"
  },
  {
    id: 8,
    name: "Bus Doors Closing",
    description: "Singapore bus door closing beep",
    audioUrl: "/SG60 Sound Game - Bus doors closing.mp3"
  },
  {
    id: 9,
    name: "Kallang Wave",
    description: "The roar of the Kallang Wave at the stadium",
    audioUrl: "/SG60 Sound Game - Kallang Wave.mp3"
  },
  {
    id: 10,
    name: "Ice Cream Cart",
    description: "The sound of an ice cream scoop",
    audioUrl: "/SG60 Sound Game - Ice cream cart.mp3"
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
            onRetakeQuiz={handleRetakeQuiz}
          />
        );
      default:
        return <WelcomeCard onStart={handleStartGame} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl mb-6">
        {renderCard()}
      </div>
      {leaderboard.length > 0 && (
        <div className="w-full max-w-2xl mt-6">
          <Leaderboard leaderboard={leaderboard.slice(0, 5)} playerName={playerName} totalSounds={sounds.length} />
        </div>
      )}
    </div>
  );
};

export default SG60Game;
