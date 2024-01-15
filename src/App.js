// export: makes the function accessible outside of this file
// default: it is the main function in this file
// className: for css styling

import { useState } from 'react';
import helmetData from './helmets-data.json'

function Dropdown({ label, options, onChange }) {
  return (
    <div>
      <label>{label}: </label>
      <select onChange={(e) => onChange(e.target.value)}>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function HelmetFinder() {
  const [circumference, setCircumference] = useState(48);
  const [headShape, setHeadShape] = useState(1.2);
  const [bestHelmets, setBestHelmets] = useState([]);

  const calculateFit = (helmet, userCircumference, userHeadShape) => {
    let widthCalc = Math.sqrt((2 * Math.pow(userCircumference / 6.28, 2)) / (1 + Math.pow(userHeadShape, 2))) * 2;
    let lengthCalc = widthCalc * userHeadShape;

    let userLenGap = helmet['Length interior'] - lengthCalc;
    let userWidGap = helmet['Width interior'] - widthCalc;

    return userLenGap < 0 || userWidGap < 0 ? 999 : Math.sqrt(Math.pow(userWidGap, 2) + Math.pow(userLenGap, 2));
  };

  const findBestHelmets = () => {
    let scoredHelmets = helmetData.map(helmet => ({
      ...helmet,
      fitCalc: calculateFit(helmet, circumference, headShape)
    }));

    scoredHelmets.sort((a, b) => a.fitCalc - b.fitCalc);
    setBestHelmets(scoredHelmets.slice(0, 3));
  };

  // Update and find helmets when user changes input
  const handleCircumferenceChange = (value) => {
    setCircumference(Number(value));
    findBestHelmets();
  };

  const handleHeadShapeChange = (value) => {
    setHeadShape(Number(value));
    findBestHelmets();
  };

  return (
    <div>
      <Dropdown
        label="Head Circumference"
        options={Array.from({ length: 21 }, (_, i) => 48 + i)}
        onChange={handleCircumferenceChange}
      />
      <Dropdown
        label="Head Shape"
        options={Array.from({ length: 5 }, (_, i) => 1 + i)}
        onChange={handleHeadShapeChange}
      />
      <div>
        <h2>Top 3 Helmets</h2>
        {bestHelmets.map((helmet, index) => (
          <div key={index}>
            <p>{helmet.Helmet}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// pass a prop 

/*
function Square({value, onSquareClick}) {    
  return (
    <button 
    className="square"
    onClick = {onSquareClick}
    >
      {value}
    </button>
  )
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null))

  function handleClick(i) {
    if(squares[i] || calculateWinner(squares)) {
      return;
    }
    
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    setSquares(nextSquares)
    setXIsNext(!xIsNext);
  }

  const winner = calculateWinner(squares)
  let status; 
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status"> {status} </div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  )
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
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
*/