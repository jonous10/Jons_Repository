const { useState } = React;

function Square({ value, onSquareClick, isPulsing }) {
  return (
    <button
      className={`square ${isPulsing ? "pulse" : ""}`}
      id={value}
      onClick={onSquareClick}
    >
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const [pulsingSquares, setPulsingSquares] = useState(Array(9).fill(false));

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);

    // Trigger pulse effect
    setPulsingSquares((prev) => {
      const newPulsing = [...prev];
      newPulsing[i] = true;
      return newPulsing;
    });

    // Remove pulse effect after animation
    setTimeout(() => {
      setPulsingSquares((prev) => {
        const newPulsing = [...prev];
        newPulsing[i] = false;
        return newPulsing;
      });
    }, 500);
  }

  const winner = calculateWinner(squares);
  let status = winner ? `Our Winner is ${winner} !!!` : `${xIsNext ? "X" : "O"}'s turn`;

  return (
    <div className="main-board">
      <div className="status">{status}</div>
      {[0, 3, 6].map((row) => (
        <div className="board-row" key={row}>
          {[0, 1, 2].map((col) => {
            const index = row + col;
            return (
              <Square
                key={index}
                value={squares[index]}
                onSquareClick={() => handleClick(index)}
                isPulsing={pulsingSquares[index]}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((_, move) => (
    <li key={move}>
      <button onClick={() => jumpTo(move)}>
        {move > 0 ? `Go to move #${move}` : 'Go to game start'}
      </button>
    </li>
  ));

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// Render the Game component
const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<Game />);