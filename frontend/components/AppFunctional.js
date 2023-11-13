import React, { useState } from 'react';
import axios from 'axios';

const initialMessage = '';
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4;

const URL = 'http://localhost:9000/api/result';

const AppFunctional = (props) => {
  const [index, setIndex] = useState(initialIndex);
  const [steps, setSteps] = useState(initialSteps);
  const [email, setEmail] = useState(initialEmail);
  const [message, setMessage] = useState(initialMessage);

  const getXY = () => {
    const x = (index % 3) + 1;

    let y;
    if (index < 3) y = 1;
    else if (index < 6) y = 2;
    else if (index < 9) y = 3;
    return [x, y];
  };

  const getNextIndex = (direction) => {
    switch (direction) {
      case 'up':
        return index < 3 ? index : index - 3;
      case 'down':
        return index > 5 ? index : index + 3;
      case 'left':
        return index % 3 === 0 ? index : index - 1;
      case 'right':
        return (index - 2) % 3 === 0 ? index : index + 1;
      default:
        return index;
    }
  };

  const reset = () => {
    setSteps(initialSteps);
    setMessage(initialMessage);
    setEmail(initialEmail);
    setIndex(initialIndex);
  };

  const move = (towards) => {
    if (towards === 'reset') return reset();

    const newIndex = getNextIndex(towards);

    if (newIndex !== index) {
      setSteps((prevSteps) => prevSteps + 1);
      setMessage(initialMessage);
      setIndex(newIndex);
    } else {
      setMessage(`You can't go ${towards}`);
    }
  };

  const onChange = (evt) => {
    setEmail(evt.target.value);
  };

  const onSubmit = (evt) => {
    evt.preventDefault();

    const [x, y] = getXY();
    const payload = { email, steps, x, y };
    axios
      .post(URL, payload)
      .then((response) => {
        setMessage(response.data.message);
        setEmail(initialEmail);
      })
      .catch((error) => {
        setMessage(error.response.data.message);
        setEmail(initialEmail);
      });
  };

  const getXYMessage = () => {
    const [x, y] = getXY();
    return `(${x}, ${y})`;
  };

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">Coordinates {getXYMessage()}</h3>
        <h3 id="steps">{`You moved ${steps} time${steps === 1 ? '' : 's'}`}</h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
            {idx === index ? 'B' : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={() => move('left')}>
          LEFT
        </button>
        <button id="up" onClick={() => move('up')}>
          UP
        </button>
        <button id="right" onClick={() => move('right')}>
          RIGHT
        </button>
        <button id="down" onClick={() => move('down')}>
          DOWN
        </button>
        <button id="reset" onClick={reset}>
          RESET
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="Type email" value={email} onChange={onChange} />
        <input id="submit" type="submit" />
      </form>
    </div>
  );
};

export default AppFunctional;
