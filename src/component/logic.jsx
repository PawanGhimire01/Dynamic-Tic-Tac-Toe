import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button
      className="w-12 h-12 border-2 border-black text-xl font-bold"
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

export default function Board() {
  const [row, setRow] = useState(3);
  const [col, setCol] = useState(3);

  const total = row * col;

  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(total).fill(null));

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) return;

    const next = squares.slice();
    next[i] = xIsNext ? "X" : "O";

    setSquares(next);
    setXIsNext(!xIsNext);
  }

  return (
    <>
      {/* INPUTS */}
      <div className="flex gap-2 mb-4">
        <input
          type="number"
          value={row}
          onChange={(e) => setRow(Number(e.target.value))}
          placeholder="rows"
          className="border p-1 w-20"
        />

        <input
          type="number"
          value={col}
          onChange={(e) => setCol(Number(e.target.value))}
          placeholder="cols"
          className="border p-1 w-20"
        />
      </div>

      {/* GRID */}
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${col}, 50px)`,
        }}
      >
        {Array.from({ length: total }).map((_, i) => (
          <Square
            key={i}
            value={squares[i]}
            onSquareClick={() => handleClick(i)}
          />
        ))}
      </div>
    </>
  );

  function calculateWinner(squares) {
    let win;
    for (let r = 0; r < row; r++) {
      const start = r * col;
      const first = squares[start];

      if (first) {
        win = true;

        for (let c = 1; c < col; c++) {
          if (squares[start + c] != first) {
            win = false;
            break;
          }
        }
        if (win) return first;
      }
    }

    for (let c = 0; c < col; c++) {
      const first = squares[c];
      if (first) {
        win = true;

        for (let r = 1; r < row; r++) {
          if (squares[r * col + c] != first) {
            win = false;
            break;
          }
        }
        if (win) return first;
      }
    }

    const first1 = squares[0];
    if (first1) {
      let win = true;

      for (let i = 1; i < row; i++) {
        if (squares[i * col + i] !== first1) {
          win = false;
          break;
        }
      }

      if (win) return first1;
    }

    const first = squares[col - 1];
    if (first) {
      let win = true;

      for (let i = 1; i < row; i++) {
        if (squares[i * col + col - i - 1] !== first) {
          win = false;
          break;
        }
      }

      if (win) return first;
    }
  }
}
