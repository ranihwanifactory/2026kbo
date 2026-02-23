import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, Send, History } from 'lucide-react';

export default function NumberBaseball() {
  const [target, setTarget] = useState<number[]>([]);
  const [guess, setGuess] = useState<string>('');
  const [logs, setLogs] = useState<{ guess: string; strike: number; ball: number }[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [message, setMessage] = useState('4자리 숫자를 맞춰보세요!');

  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const result = [];
    for (let i = 0; i < 4; i++) {
      const index = Math.floor(Math.random() * numbers.length);
      result.push(numbers[index]);
      numbers.splice(index, 1);
    }
    setTarget(result);
    setLogs([]);
    setGuess('');
    setIsGameOver(false);
    setMessage('새 게임이 시작되었습니다!');
  };

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.length !== 4 || isNaN(Number(guess))) {
      setMessage('4자리 숫자를 입력해주세요.');
      return;
    }

    const guessArr = guess.split('').map(Number);
    let strike = 0;
    let ball = 0;

    guessArr.forEach((num, i) => {
      if (num === target[i]) {
        strike++;
      } else if (target.includes(num)) {
        ball++;
      }
    });

    const newLog = { guess, strike, ball };
    setLogs([newLog, ...logs]);
    setGuess('');

    if (strike === 4) {
      setIsGameOver(true);
      setMessage('홈런! 축하합니다!');
    } else {
      setMessage(`${strike} 스트라이크, ${ball} 볼입니다.`);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 glass-card rounded-3xl">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-display font-bold flex items-center gap-2">
          <Trophy className="text-yellow-500" /> 숫자 야구
        </h2>
        <button
          onClick={initGame}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          title="다시 시작"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      <div className="text-center mb-8">
        <p className="text-slate-600 font-medium">{message}</p>
      </div>

      <form onSubmit={handleGuess} className="flex gap-2 mb-8">
        <input
          type="text"
          maxLength={4}
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          disabled={isGameOver}
          placeholder="0-9 서로 다른 4자리"
          className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-kbo-blue/20 font-mono text-xl tracking-widest text-center"
        />
        <button
          type="submit"
          disabled={isGameOver}
          className="px-6 py-3 bg-kbo-blue text-white rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
        >
          <Send size={18} /> 투구
        </button>
      </form>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          <History size={14} /> 경기 기록
        </div>
        <AnimatePresence initial={false}>
          {logs.map((log, i) => (
            <motion.div
              key={logs.length - i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100"
            >
              <span className="font-mono text-lg font-bold text-slate-700">{log.guess}</span>
              <div className="flex gap-2">
                <span className={`px-2 py-1 rounded-md text-xs font-bold ${log.strike > 0 ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-500'}`}>
                  {log.strike}S
                </span>
                <span className={`px-2 py-1 rounded-md text-xs font-bold ${log.ball > 0 ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>
                  {log.ball}B
                </span>
                {log.strike === 0 && log.ball === 0 && (
                  <span className="px-2 py-1 rounded-md text-xs font-bold bg-slate-800 text-white">OUT</span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {logs.length === 0 && (
          <p className="text-center text-slate-400 text-sm py-8 italic">아직 기록이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
