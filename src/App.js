// export: makes the function accessible outside of this file
// default: it is the main function in this file
// className: for css styling

import { useState, useEffect } from 'react';
import helmetData from './helmets-data.json'

function Dropdown({label, options, onChange, value}) {
  return (
    <div>
      <label>{label}: </label>
      <select onChange={(e) => onChange(e.target.value)} value={value}>
        {/* {!value && <option value="" disabled>Select </option>} */}
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
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

  useEffect(() => {
    findBestHelmets();
  }, [circumference, headShape])

  function calculateFit(helmet, userCircumference, userHeadShape) {
    let widthCalc = Math.sqrt((2 * Math.pow(userCircumference / 6.28, 2)) / (1 + Math.pow(userHeadShape, 2))) * 2;
    let lengthCalc = widthCalc * userHeadShape;

    let userWidGap = Number(helmet['Width Interior']) - widthCalc;
    let userLenGap = Number(helmet['Length Interior']) - lengthCalc;

    // console.log("Length Interior: " + helmet['Length Interior'])
    // console.log("Width Interior: " + helmet['Width Interior'])
    // console.log(helmet['Helmet Name'] + " userCircumference: " + userCircumference)
    // console.log(helmet['Helmet Name'] + " userHeadShape: " + userHeadShape)
    // console.log(helmet['Helmet Name'] + " userLenGap: " + userLenGap)
    // console.log(helmet['Helmet Name'] + " userWidGap: " + userWidGap)

    // Helmets that don't fit are assigned a high unfit score of 999
    let fitScore = (userLenGap < 0 || userWidGap < 0) ? 999 : Math.sqrt(Math.pow(userWidGap, 2) + Math.pow(userLenGap, 2));

    return {
      fitScore,
      userWidGap,
      userLenGap
    }
  };

  function findBestHelmets() {
    // For each helmet in helmetData... 
    let scoredHelmets = helmetData.map(helmet => {
      let {fitScore, userWidGap, userLenGap} = calculateFit(helmet, circumference, headShape);
      console.log(helmet['Helmet Name'] + " circumference: " + circumference)
      console.log(helmet['Helmet Name'] + " headShape: " + headShape)
      console.log(helmet['Helmet Name'] + " lenGap: " + userLenGap)
      console.log(helmet['Helmet Name'] + " widGap: " + userWidGap)  
      return {
        ...helmet, // All the helmet data + new properties
        fitScore,
        userWidGap,
        userLenGap
      };
    });

    // If the comparator function returns a negative, a comes before b
    scoredHelmets.sort((a, b) => a.fitScore - b.fitScore);
    setBestHelmets(scoredHelmets.slice(0, 6));
  };

  // Update and find helmets when user changes input
  function handleCircumferenceChange(value) {
    setCircumference(Number(value));
  };

  function handleHeadShapeChange(value) {
    setHeadShape(Number(value));
  };

  return (
    <div>
      <Dropdown
        label="Head Circumference"
        options={Array.from({length: 21}, (_, i) => ({label: 48 + i, value: 480 + i * 10 }))}
        onChange={(value) => handleCircumferenceChange(value)}
        value={circumference}
      />
      <Dropdown
        label="Head Shape"
        options={[
          {label: 'Very Round', value: 1.2},
          {label: 'Round', value: 1.225},
          {label: 'Intermediate', value: 1.25},
          {label: 'Oval', value: 1.275},
          {label: 'Aero', value: 1.3}
        ]}
        onChange={(value) => handleHeadShapeChange(value)}
        value={headShape}
      />
      <div>
        <h2>Top 3 Helmets</h2>
        <div className="helmet-container">
          {bestHelmets.map((helmet, index) => (
            <div key={index} className="helmet-info">
              <h3>{helmet['Helmet Name']}</h3>
              <p>VTech Rating: {helmet['VTech Rating']}</p>
              <p>Price: {helmet['Retail Price']}</p>
              <p>Width Gap: {helmet.userWidGap}</p>
              <p>Length Gap: {helmet.userLenGap}</p>
              <p>Fit Score: {helmet.fitScore}</p>
            </div>
          ))}
        </div>
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