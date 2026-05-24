/**
 * Returns { winner, winningLine } if a player has won, otherwise null.
 * Diagonals are only checked for square grids (rows === cols).
 */
export function calculateWinner(squares, rows, cols) {
  // Rows
  for (let r = 0; r < rows; r++) {
    const start = r * cols;
    const first = squares[start];
    if (!first) continue;
    const line = Array.from({ length: cols }, (_, c) => start + c);
    if (line.every((idx) => squares[idx] === first)) {
      return { winner: first, winningLine: line };
    }
  }

  // Columns
  for (let c = 0; c < cols; c++) {
    const first = squares[c];
    if (!first) continue;
    const line = Array.from({ length: rows }, (_, r) => r * cols + c);
    if (line.every((idx) => squares[idx] === first)) {
      return { winner: first, winningLine: line };
    }
  }

  // Diagonals — only valid for square grids
  if (rows === cols) {
    const topLeft = squares[0];
    if (topLeft) {
      const line = Array.from({ length: rows }, (_, i) => i * cols + i);
      if (line.every((idx) => squares[idx] === topLeft)) {
        return { winner: topLeft, winningLine: line };
      }
    }

    const topRight = squares[cols - 1];
    if (topRight) {
      const line = Array.from({ length: rows }, (_, i) => i * cols + (cols - i - 1));
      if (line.every((idx) => squares[idx] === topRight)) {
        return { winner: topRight, winningLine: line };
      }
    }
  }

  return null;
}

export function isBoardFull(squares) {
  return squares.every((sq) => sq !== null);
}
