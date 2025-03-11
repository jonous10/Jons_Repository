const { useState, useEffect } = React;

let aiMemory = JSON.parse(localStorage.getItem("aiMemory")) || { states: {} };
let epsilon = parseFloat(localStorage.getItem("epsilon")) || 0.8;

function saveMemory() {
  localStorage.setItem("aiMemory", JSON.stringify(aiMemory));
  localStorage.setItem("epsilon", epsilon.toString());
  console.log("Saved AI Memory:", JSON.parse(localStorage.getItem("aiMemory"))); // Debugging
}

function resetMemory() {
  console.log("MEMORY RESET!")
  aiMemory = {};
  epsilon = 0.8;
  saveMemory();
  alert("AI memory reset!");
}

function getRandomMove(squares) {
  const availableMoves = squares
    .map((val, idx) => (val === null ? idx : null))
    .filter(v => v !== null);
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

function getBiasedMove(squares) {
  const key = JSON.stringify(squares);
  const availableMoves = squares
    .map((val, idx) => (val === null ? idx : null))
    .filter(v => v !== null);

  if (!aiMemory[key]) aiMemory[key] = {};

  let bestMove = availableMoves[0];
  let bestScore = -Infinity;

  availableMoves.forEach(move => {
    if (!aiMemory[key][move]) aiMemory[key][move] = { wins: 0, losses: 0 };

    const score = aiMemory[key][move].wins - aiMemory[key][move].losses;
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  });

  return bestMove;
}

function aiMove(squares) {
  return Math.random() < epsilon ? getRandomMove(squares) : getBiasedMove(squares);
}

function adjustEpsilon() {
  if (Object.keys(aiMemory).length > 50) {
    epsilon = Math.max(0.1, epsilon * 0.99);
    saveMemory();
  }
}

function updateMemory(gameStates, result) {
  console.log("Updating AI Memory for", result);
  gameStates.forEach(({ state, move }) => {
    if (!Array.isArray(state)) return;
    
    const key = JSON.stringify(state);
    
    if (!aiMemory.states) aiMemory.states = {}; // Ensure `states` exists
    if (!aiMemory.states[key]) aiMemory.states[key] = {}; // Ensure `key` exists
    if (!aiMemory.states[key][move]) aiMemory.states[key][move] = { wins: 0, losses: 0 }; // Ensure `move` exists
    
    // Update win/loss count
    if (result === "X") aiMemory.states[key][move].wins += 1;
    else if (result === "O") aiMemory.states[key][move].losses += 1;

    console.log("Memory before saving:", aiMemory); // Debugging
    saveMemory(); // Save the updated memory
  });
}

function Square({ value, onSquareClick, disabled }) {
  return <button className="square" onClick={onSquareClick} disabled={value !== null || disabled}>{value}</button>;
}

function Board({ xIsNext, squares, onPlay }) {
  useEffect(() => {
    if (xIsNext && !calculateWinner(squares) && squares.includes(null)) {
      setTimeout(() => {
        const move = aiMove(squares);
        if (move === undefined || move === null) return;

        const nextSquares = squares.slice();
        nextSquares[move] = "X";
        onPlay(nextSquares, move);
      }, 500);
    }
  }, [xIsNext, squares, onPlay]);

  return (
    <div>
      {[0, 3, 6].map(row => (
        <div className="board-row" key={row}>
          {[0, 1, 2].map(col => (
            <Square
              key={row + col}
              value={squares[row + col]}
              onSquareClick={() => {
                if (xIsNext || squares[row + col]) return;
                const nextSquares = squares.slice();
                nextSquares[row + col] = "O";
                onPlay(nextSquares, row + col);
                epsilon -= 1;
                updateMemory();
              }}
              disabled={xIsNext}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null), move: null }]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  function handlePlay(nextSquares, move) {
    const newHistory = [...history.slice(0, currentMove + 1), { squares: nextSquares, move }];
    setHistory(newHistory);
    setCurrentMove(currentMove + 1);

    const winner = calculateWinner(nextSquares);
    if (winner) {
      console.log("Winner!, running updateMemory()")
      updateMemory(newHistory, winner);
    }
    if (!nextSquares.includes(null)) adjustEpsilon();
  }

  return (
    <div className="game">
      <button onClick={resetMemory}>Reset AI Memory</button>
      <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<Game />);

console.log(localStorage.getItem("aiMemory"));