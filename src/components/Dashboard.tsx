import React from 'react';
import { User, Coins, TrendingUp, MessageCircle, Trophy } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface DashboardProps {
  onPageChange: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onPageChange }) => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Current Balance',
      value: `$${user?.balance.toLocaleString() || 0}`,
      icon: Coins,
      color: 'text-green-400',
      bg: 'bg-green-900/20',
      border: 'border-green-500/30',
    },
    {
      title: 'Games Played',
      value: JSON.parse(localStorage.getItem('gameHistory') || '[]').length,
      icon: Trophy,
      color: 'text-purple-400',
      bg: 'bg-purple-900/20',
      border: 'border-purple-500/30',
    },
    {
      title: 'Total Inquiries',
      value: JSON.parse(localStorage.getItem('inquiries') || '[]').filter((i: any) => i.userId === user?.id).length,
      icon: MessageCircle,
      color: 'text-blue-400',
      bg: 'bg-blue-900/20',
      border: 'border-blue-500/30',
    },
  ];

  const recentGames = JSON.parse(localStorage.getItem('gameHistory') || '[]').slice(-3);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-gray-400">Ready to test your luck?</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.bg} ${stat.border} border rounded-lg p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <stat.icon className={`${stat.color}`} size={32} />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => onPageChange('game')}
            className="p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg hover:from-purple-600/30 hover:to-pink-600/30 transition-all duration-200 text-left"
          >
            <div className="flex items-center space-x-3">
              <Trophy className="text-purple-400" size={24} />
              <div>
                <h3 className="text-lg font-medium text-white">Play Snail Race</h3>
                <p className="text-gray-400 text-sm">Test your luck and double your money</p>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => onPageChange('inquiries')}
            className="p-6 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-lg hover:from-blue-600/30 hover:to-cyan-600/30 transition-all duration-200 text-left"
          >
            <div className="flex items-center space-x-3">
              <MessageCircle className="text-blue-400" size={24} />
              <div>
                <h3 className="text-lg font-medium text-white">Support Center</h3>
                <p className="text-gray-400 text-sm">Get help or ask questions</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <TrendingUp className="mr-2" size={20} />
          Recent Activity
        </h2>
        
        {recentGames.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="mx-auto mb-4 text-gray-600" size={48} />
            <p className="text-gray-400">No recent games</p>
            <button
              onClick={() => onPageChange('game')}
              className="mt-4 text-purple-400 hover:text-purple-300 transition-colors"
            >
              Play your first game
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {recentGames.map((game: any) => (
              <div key={game.id} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-md">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🐌</span>
                  <div>
                    <div className="text-white font-medium">Snail Race</div>
                    <div className="text-sm text-gray-400">
                      Bet ${game.betAmount} • {game.selectedSnail === 1 ? 'Left' : 'Right'} • {new Date(game.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className={`font-bold ${
                  game.result === 'win' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {game.result === 'win' ? `+$${game.betAmount}` : `-$${game.betAmount}`}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
        <h3 className="text-yellow-400 font-medium mb-2">⚠️ Important Notice</h3>
        <p className="text-yellow-300 text-sm">
          This is a demonstration platform for educational purposes only. 
          All currency is virtual and has no real-world value. 
          Please gamble responsibly and be aware of the risks associated with real gambling.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;