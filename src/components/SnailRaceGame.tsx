import React, { useState, useEffect } from 'react';
import { Play, ArrowLeft, ArrowRight, Coins, TrendingUp } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface Snail {
  id: number;
  name: string;
  position: number;
  emoji: string;
  color: string;
}

const SnailRaceGame: React.FC = () => {
  const { user, updateBalance } = useAuth();
  const [snails, setSnails] = useState<Snail[]>([
    { id: 1, name: 'Lightning', position: 0, emoji: '🐌', color: 'text-blue-400' },
    { id: 2, name: 'Thunder', position: 0, emoji: '🐌', color: 'text-red-400' },
  ]);
  const [betAmount, setBetAmount] = useState(100);
  const [selectedSnail, setSelectedSnail] = useState<number | null>(null);
  const [isRacing, setIsRacing] = useState(false);
  const [raceResult, setRaceResult] = useState<string | null>(null);
  const [gameHistory, setGameHistory] = useState<any[]>([]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('gameHistory') || '[]');
    setGameHistory(history.slice(-5)); // Show last 5 games
  }, []);

  const startRace = () => {
    if (!selectedSnail || !user || betAmount > user.balance) return;

    setIsRacing(true);
    setRaceResult(null);
    
    // Reset positions
    setSnails(prev => prev.map(snail => ({ ...snail, position: 0 })));

    // Simulate race
    const raceInterval = setInterval(() => {
      setSnails(prev => prev.map(snail => ({
        ...snail,
        position: snail.position + Math.random() * 10
      })));
    }, 100);

    // End race after 3 seconds
    setTimeout(() => {
      clearInterval(raceInterval);
      setIsRacing(false);
      
      // Determine winner (random for demo)
      const winner = Math.floor(Math.random() * 2) + 1;
      const didWin = winner === selectedSnail;
      const winAmount = didWin ? betAmount * 2 : 0;
      const newBalance = didWin ? user.balance + betAmount : user.balance - betAmount;
      
      setRaceResult(didWin ? 'win' : 'lose');
      updateBalance(newBalance);
      
      // Save to history
      const gameResult = {
        id: Date.now(),
        betAmount,
        selectedSnail,
        winner,
        result: didWin ? 'win' : 'lose',
        winAmount,
        timestamp: new Date().toISOString(),
      };
      
      const history = JSON.parse(localStorage.getItem('gameHistory') || '[]');
      history.push(gameResult);
      localStorage.setItem('gameHistory', JSON.stringify(history));
      setGameHistory(history.slice(-5));
    }, 3000);
  };

  const maxPosition = Math.max(...snails.map(s => s.position));

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
          🐌 Snail Race Game
        </h1>
        <p className="text-gray-400">Choose your snail and double your money!</p>
      </div>

      {/* Betting Panel */}
      <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Coins className="mr-2" size={20} />
          Place Your Bet
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Bet Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400">$</span>
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                min="10"
                max={user?.balance || 0}
                className="w-full pl-8 pr-4 py-2 bg-gray-800/50 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Choose Direction
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedSnail(1)}
                className={`flex-1 px-4 py-2 rounded-md border transition-all ${
                  selectedSnail === 1
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                <ArrowLeft className="mx-auto" size={20} />
                <span className="block text-xs mt-1">Left</span>
              </button>
              <button
                onClick={() => setSelectedSnail(2)}
                className={`flex-1 px-4 py-2 rounded-md border transition-all ${
                  selectedSnail === 2
                    ? 'bg-red-600 border-red-500 text-white'
                    : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                <ArrowRight className="mx-auto" size={20} />
                <span className="block text-xs mt-1">Right</span>
              </button>
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={startRace}
              disabled={!selectedSnail || isRacing || !user || betAmount > user.balance}
              className="w-full px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-md font-medium transition-all duration-200 flex items-center justify-center"
            >
              <Play className="mr-2" size={16} />
              {isRacing ? 'Racing...' : 'Start Race'}
            </button>
          </div>
        </div>

        {betAmount > (user?.balance || 0) && (
          <p className="text-red-400 text-sm mt-2">Insufficient balance</p>
        )}
      </div>

      {/* Race Track */}
      <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
        <h2 className="text-xl font-semibold text-white mb-4">Race Track</h2>
        
        <div className="space-y-4">
          {snails.map((snail, index) => (
            <div key={snail.id} className="relative">
              <div className="flex items-center mb-2">
                <span className={`text-lg font-medium ${snail.color}`}>
                  {snail.name} {index === 0 ? '(Left)' : '(Right)'}
                </span>
                {selectedSnail === snail.id && (
                  <span className="ml-2 px-2 py-1 bg-purple-600 text-white text-xs rounded-full">
                    Your Pick
                  </span>
                )}
              </div>
              
              <div className="relative h-12 bg-gray-800 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-green-600 opacity-30"></div>
                <div 
                  className="absolute top-1/2 transform -translate-y-1/2 text-2xl transition-all duration-200"
                  style={{ 
                    left: `${maxPosition > 0 ? (snail.position / maxPosition) * 85 : 0}%`,
                    transform: 'translateY(-50%)'
                  }}
                >
                  {snail.emoji}
                </div>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-2xl">
                  🏁
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Result */}
        {raceResult && (
          <div className={`mt-6 p-4 rounded-lg text-center ${
            raceResult === 'win' 
              ? 'bg-green-900/30 border border-green-500/30' 
              : 'bg-red-900/30 border border-red-500/30'
          }`}>
            <div className={`text-2xl font-bold ${
              raceResult === 'win' ? 'text-green-400' : 'text-red-400'
            }`}>
              {raceResult === 'win' ? '🎉 You Won!' : '😔 You Lost!'}
            </div>
            <div className="text-gray-300 mt-2">
              {raceResult === 'win' 
                ? `You won $${betAmount}! Your balance: $${user?.balance.toLocaleString()}`
                : `You lost $${betAmount}. Your balance: $${user?.balance.toLocaleString()}`
              }
            </div>
          </div>
        )}
      </div>

      {/* Game History */}
      <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <TrendingUp className="mr-2" size={20} />
          Recent Games
        </h2>
        
        {gameHistory.length === 0 ? (
          <p className="text-gray-400 text-center">No games played yet</p>
        ) : (
          <div className="space-y-2">
            {gameHistory.map((game) => (
              <div key={game.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-md">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🐌</span>
                  <div>
                    <div className="text-sm text-gray-300">
                      Bet: ${game.betAmount} • {game.selectedSnail === 1 ? 'Left' : 'Right'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(game.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className={`font-medium ${
                  game.result === 'win' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {game.result === 'win' ? `+$${game.betAmount}` : `-$${game.betAmount}`}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SnailRaceGame;