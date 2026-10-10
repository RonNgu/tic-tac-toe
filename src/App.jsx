import { useState } from 'react';

function Square({ value, onSquareClick, winning }) {
  return (
    <button className={winning ? 'square square-winning' : 'square'} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(row, col) {
    const i = row * 3 + col;
    if (calculateWinner(squares) || squares[i] || draw) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }

    onPlay(nextSquares);
  }

  const winningLine = calculateWinner(squares);
  const winner = winningLine ? squares[winningLine[0]] : null;
  const draw = !winner && squares.every((square) => square !== null);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else if(draw) {
    status = 'Draw';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const board = [];
  for(let i = 0; i < 3; i++){
    const row = [];
    for(let j = 0; j < 3; j++){
      const index = i * 3 + j;
      row.push(<Square key={index} value={squares[index]} onSquareClick={() => handleClick(i, j)} winning={winningLine && winningLine.includes(index)}/>);
    }
    board.push(<div className='board-row' key={i}>{row}</div>);
  }
  return (
    <>
      <div className="status">{status}{board}</div>
    </> 
  ); //npm run dev
} 

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [ascend, setAscend] = useState(true);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moveOrder = history.map((squares, move) => move);
  if (!ascend) moveOrder.reverse();

  const moves = moveOrder.map((move) => {
    let description = 'Go to game start';
    if (move > 0) {
      const previousSquares = history[move - 1];
      const squareIndex = history[move].findIndex(
        (square, index) => square !== previousSquares[index]
      );
      const row = Math.floor(squareIndex / 3) + 1;
      const col = (squareIndex % 3) + 1;
      description = 'Go to move #' + move + ' (' + row + ', ' + col + ')';
    }
    return (
      <li key={move}>
        <p onClick={() => jumpTo(move)}>{description}</p>
      </li>
    );
  }); 

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={() => setAscend((ascending) => !ascending)}>
          {ascend ? 'Sort descending' : 'Sort ascending'}
        </button>
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
    [2, 4, 6],];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i]
    }
  }
  return null;
}
