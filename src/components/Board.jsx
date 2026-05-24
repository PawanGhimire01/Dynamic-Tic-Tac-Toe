import Square from "./Square";

export default function Board({ squares, cols, onSquareClick, winningLine, gameOver }) {
  // Scale font size down as columns increase
  const fontSize =
    cols <= 3 ? "2rem" : cols <= 5 ? "1.5rem" : cols <= 7 ? "1.25rem" : "1rem";

  return (
    <div
      role="grid"
      aria-label="Tic-tac-toe board"
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {squares.map((value, i) => (
        <Square
          key={i}
          value={value}
          onClick={() => onSquareClick(i)}
          isWinner={winningLine ? winningLine.includes(i) : false}
          disabled={!!value || gameOver}
          fontSize={fontSize}
        />
      ))}
    </div>
  );
}
