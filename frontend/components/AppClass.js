import React from 'react';
import axios from 'axios';

const initialMessage = '';
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4;

const URL = 'http://localhost:9000/api/result';

class AppClass extends React.Component {
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
    
    let y
    if (this.state.index < 3) y = 1
    else if (this.state.index < 6) y = 2
    else if (this.state.index < 9) y = 3
    return [x, y];
  };
  getNextIndex = (direction) => {
    const { index } = this.state
    switch (direction) {
      case 'up':
        return (index < 3) ? index : index - 3
      case 'down':
        return (index > 5) ? index : index + 3
      case 'left':
        return (index % 3 === 0) ? index : index - 1
      case 'right':
        return ((index - 2) % 3 === 0) ? index : index + 1
    }
  }
  
  reset = () => {
    this.setState({
      message: initialMessage,
      email: initialEmail,
      index: initialIndex,
      steps: initialSteps,
    });
  };

  move = (towards) => {
    if (towards === 'reset') return this.reset();
    
    
    const newIndex = this.getNextIndex(towards)
    
    if (newIndex !== this.state.index) {
      this.setState({ ...this.state,
        steps: this.state.steps + 1,
        message: initialMessage,
        index: newIndex});
    } else {
      
      this.setState({ message: `You can't go ${towards}` });
    }
  };
  

  onChange = (evt) => {
    this.setState({ email: evt.target.value });
  };

  onSubmit = (evt) => {
    evt.preventDefault();

    const [x, y] = this.getXY();
    const payload = { email: this.state.email, steps: this.state.steps, x, y };
    axios
      .post(URL, payload)
      .then((response) => {
        this.setState({
          message: response.data.message,
          email: initialEmail,
        });
      })
      .catch((error) => {
        this.setState({
          message: error.response.data.message,
          email: initialEmail,
        });
      });
  };

  render() {
    const [x, y] = this.getXY();
    return (
      <div id="wrapper" className={this.props.className}>
        <div className="info">
          <h3 id="coordinates">Coordinates ({x}, {y})</h3>
          <h3 id="steps">{`You moved ${this.state.steps} time${this.state.steps == 1 ? '' : 's'}`}</h3>
        </div>
        <div id="grid">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
              {idx === this.state.index ? 'B' : null}
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
          <input id="email" type="email" placeholder="type email" value={this.state.email} onChange={this.onChange} />
          <input id="submit" type="submit" />
        </form>
      </div>
    );
  }
}

export default AppClass;
