const { useState } = React;

function Square({ value, onSquareClick, style }) {
  return (
    <button
      className="square"
      id={value}
      onClick={onSquareClick}
      style={style}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const [clickedSquares, setClickedSquares] = useState(Array(9).fill(false));

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    const newClickedSquares = [...clickedSquares];
    newClickedSquares[i] = true;
    setClickedSquares(newClickedSquares);

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status = winner ? `Winner: ${winner}` : `Next player: ${xIsNext ? 'X' : 'O'}`;

  return (
    <div className="main-board">
      <div className="status">{status}</div>
      <div className="board-row">
        <Square
          value={squares[0]}
          onSquareClick={() => handleClick(0)}
          style={{ width: clickedSquares[0] ? '200px' : '100px', height: clickedSquares[0] ? '200px' : '100px' }}
        />
        <Square
          value={squares[1]}
          onSquareClick={() => handleClick(1)}
          style={{ width: clickedSquares[1] ? '200px' : '100px', height: clickedSquares[1] ? '200px' : '100px' }}
        />
        <Square
          value={squares[2]}
          onSquareClick={() => handleClick(2)}
          style={{ width: clickedSquares[2] ? '200px' : '100px', height: clickedSquares[2] ? '200px' : '100px' }}
        />
      </div>
      <div className="board-row">
        <Square
          value={squares[3]}
          onSquareClick={() => handleClick(3)}
          style={{ width: clickedSquares[3] ? '200px' : '100px', height: clickedSquares[3] ? '200px' : '100px' }}
        />
        <Square
          value={squares[4]}
          onSquareClick={() => handleClick(4)}
          style={{ width: clickedSquares[4] ? '200px' : '100px', height: clickedSquares[4] ? '200px' : '100px' }}
        />
        <Square
          value={squares[5]}
          onSquareClick={() => handleClick(5)}
          style={{ width: clickedSquares[5] ? '200px' : '100px', height: clickedSquares[5] ? '200px' : '100px' }}
        />
      </div>
      <div className="board-row">
        <Square
          value={squares[6]}
          onSquareClick={() => handleClick(6)}
          style={{ width: clickedSquares[6] ? '200px' : '100px', height: clickedSquares[6] ? '200px' : '100px' }}
        />
        <Square
          value={squares[7]}
          onSquareClick={() => handleClick(7)}
          style={{ width: clickedSquares[7] ? '200px' : '100px', height: clickedSquares[7] ? '200px' : '100px' }}
        />
        <Square
          value={squares[8]}
          onSquareClick={() => handleClick(8)}
          style={{ width: clickedSquares[8] ? '200px' : '100px', height: clickedSquares[8] ? '200px' : '100px' }}
        />
      </div>
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