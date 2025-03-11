const { useState } = React;

// Setting Squares by the value X, O, or null, 
function Square({ value, onSquareClick, isPulsing }) {
    return (
        <button
            className="square"
            id={value}
            onClick={onSquareClick}
        >
        </button>
    );
}
// Setting up the Board where the game takes place
function Board({ xIsNext, squares, onPlay }) {
    const [pulsingSquares, setPulsingSquares] = useState(Array(9).fill(false));

    function handleClick(i) {
        if (calculateWinner(squares) || square[i]) {
            return;
        }

        const nextSquares = squares.slice();
        nextSquares[i] = xIsNext ? "X" : "O"
        onPlay(nextSquares);
    }
}