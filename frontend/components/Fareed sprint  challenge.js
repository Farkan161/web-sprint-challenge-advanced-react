import React from 'react';
import axios from 'axios';

const initialMessage = '';
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4;

const URL = 'http://localhost:9000/api/result'

export default class AppClass extends React.Component {
  constructor() {
    super();
    this.state = {
      message: initialMessage,
      email: initialEmail,
      index: initialIndex,
      steps: initialSteps,
    };
  }

  getXY = () => {
    const x = (this.state.index % 3) + 1;
    const y = Math.floor(this.state.index / 3) + 1;
    return [x, y ];
  };

  getXYMessage = () => {
    const [x, y ] = this.getXY();
    return `Coordinates (${x}, ${y})`;
  };

  reset = () => {
    this.setState({
      message: initialMessage,
      email: initialEmail,
      index: initialIndex,
      steps: initialSteps,
    });
  };

  getNextIndex = (towards) => {
    let { index } = this.state;
    const mapping = { left: -1, right: 1, up: -3, down: 3 };
    index += mapping[towards] || 0;
    index = Math.max(0, Math.min(8, index));
    return index;
  };
  
  move = (towards) => {
    if (towards === 'reset') {
      this.reset();
    } else {
      const newIndex = this.getNextIndex(towards);
      const steps = this.state.steps + 1;
      this.setState({
        index: newIndex,
        steps,
        message: `Moved ${towards}`,
      });
    }
  };

  onChange = (evt) => {
    this.setState({ email: evt.target.value });
  };

  onSubmit = (evt) => {
    evt.preventDefault();
    
    
    const [x, y] = this.getXY()
    const payload = {'email': this.state.email, 'steps': this.state.steps, x, y }
    axios.post(URL, payload)
    .then(response => {
      this.setState({...this.state,
        message: response.data.message,
        email: initialEmail,}); 
    })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  render() {
    
    return (
      <div id="wrapper" className={this.props.className}>
        <div className="info">
          <h3 id="coordinates">Coordinates (2, 2)</h3>
          <h3 id="steps">You moved 0 times</h3>
        </div>
        <div id="grid">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <div key={idx} className={`square${idx === 4 ? ' active' : ''}`}>
              {idx === 4 ? 'B' : null}
            </div>
          ))}
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={() => this.move('left')}>
            LEFT
          </button>
          <button id="up" onClick={() => this.move('up')}>
            UP
          </button>
          <button id="right" onClick={() => this.move('right')}>
            RIGHT
          </button>
          <button id="down" onClick={() => this.move('down')}>
            DOWN
          </button>
          <button id="reset" onClick={() => this.move('reset')}>
            RESET
          </button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input id="email" type="email" placeholder="type email" value={this.state.email} onChange={this.onChange}></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    );
  }
}


