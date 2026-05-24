import { useState, useEffect, useCallback } from "react";
import Board from "./Board";
import { calculateWinner, isBoardFull } from "../utils/gameLogic";

const MIN_SIZE = 3;
const MAX_SIZE = 10;

export default function Game() {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [score, setScore] = useState({ X: 0, O: 0, draw: 0 });

  const result = calculateWinner(squares, rows, cols);
  const winner = result?.winner ?? null;
  const winningLine = result?.winningLine ?? null;
  const isDraw = !winner && isBoardFull(squares);
  const gameOver = !!winner || isDraw;

  // Reset board whenever grid dimensions change
  useEffect(() => {
    setSquares(Array(rows * cols).fill(null));
    setXIsNext(true);
  }, [rows, cols]);

  const handleSquareClick = useCallback(
    (i) => {
      if (gameOver || squares[i]) return;

      const next = squares.slice();
      next[i] = xIsNext ? "X" : "O";

      // Determine outcome immediately so score update is atomic with move
      const moveResult = calculateWinner(next, rows, cols);
      const moveWinner = moveResult?.winner;
      const moveDraw = !moveWinner && isBoardFull(next);

      if (moveWinner) {
        setScore((prev) => ({ ...prev, [moveWinner]: prev[moveWinner] + 1 }));
      } else if (moveDraw) {
        setScore((prev) => ({ ...prev, draw: prev.draw + 1 }));
      }

      setSquares(next);
      setXIsNext(!xIsNext);
    },
    [gameOver, squares, xIsNext, rows, cols]
  );

  const handleNewGame = () => {
    setSquares(Array(rows * cols).fill(null));
    setXIsNext(true);
  };

  const handleResetAll = () => {
    setScore({ X: 0, O: 0, draw: 0 });
    setSquares(Array(rows * cols).fill(null));
    setXIsNext(true);
  };

  const changeSize = (type, delta) => {
    if (type === "rows") {
      setRows((v) => Math.min(MAX_SIZE, Math.max(MIN_SIZE, v + delta)));
    } else {
      setCols((v) => Math.min(MAX_SIZE, Math.max(MIN_SIZE, v + delta)));
    }
  };

  // Status text + colour
  let statusText, statusColor;
  if (winner) {
    statusText = `Player ${winner} wins! 🎉`;
    statusColor = winner === "X" ? "text-blue-400" : "text-rose-400";
  } else if (isDraw) {
    statusText = "It's a draw!";
    statusColor = "text-yellow-400";
  } else {
    statusText = `Player ${xIsNext ? "X" : "O"}'s turn`;
    statusColor = xIsNext ? "text-blue-400" : "text-rose-400";
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-1">
            Tic-Tac-Toe
          </h1>
          <p className="text-slate-500 text-sm">
            {rows === cols
              ? "Fill a row, column, or diagonal to win"
              : "Fill a complete row or column to win"}
          </p>
        </div>

        {/* Score board */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Player X", key: "X", border: "border-blue-800", text: "text-blue-400" },
            { label: "Draws", key: "draw", border: "border-slate-700", text: "text-slate-300" },
            { label: "Player O", key: "O", border: "border-rose-800", text: "text-rose-400" },
          ].map(({ label, key, border, text }) => (
            <div
              key={key}
              className={`bg-slate-800 border ${border} rounded-2xl p-3 text-center`}
            >
              <div className={`text-3xl font-bold ${text}`}>{score[key]}</div>
              <div className="text-xs text-slate-500 mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Status */}
        <p
          aria-live="polite"
          className={`text-center text-xl font-semibold mb-5 h-8 transition-colors duration-300 ${statusColor}`}
        >
          {statusText}
        </p>

        {/* Board */}
        <div className="bg-slate-800 rounded-2xl p-4 mb-5 shadow-xl shadow-black/40">
          <Board
            squares={squares}
            cols={cols}
            onSquareClick={handleSquareClick}
            winningLine={winningLine}
            gameOver={gameOver}
          />
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mb-5">
          <button
            onClick={handleNewGame}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            New Game
          </button>
          <button
            onClick={handleResetAll}
            className="flex-1 bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Reset Score
          </button>
        </div>

        {/* Grid size controls */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest text-center mb-4">
            Grid Size
          </p>
          <div className="flex justify-center gap-10">
            {[
              { label: "Rows", val: rows, type: "rows" },
              { label: "Cols", val: cols, type: "cols" },
            ].map(({ label, val, type }) => (
              <div key={type} className="flex flex-col items-center gap-2">
                <span className="text-slate-500 text-xs">{label}</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => changeSize(type, -1)}
                    disabled={val <= MIN_SIZE}
                    aria-label={`Decrease ${label}`}
                    className="w-9 h-9 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-white text-lg font-bold transition-colors"
                  >
                    −
                  </button>
                  <span className="text-white font-bold text-xl w-5 text-center">
                    {val}
                  </span>
                  <button
                    onClick={() => changeSize(type, 1)}
                    disabled={val >= MAX_SIZE}
                    aria-label={`Increase ${label}`}
                    className="w-9 h-9 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-white text-lg font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="text-slate-600 text-xs text-center mt-4">
            Changing size starts a new game
          </p>
        </div>
      </div>
    </div>
  );
}
