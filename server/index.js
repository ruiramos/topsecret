import React, {useState} from 'react';
import ReactDOM from 'react-dom';

const App = () => {
  const [counter, setCounter] = useState(0);

  return (
    <div>
      <h1>hello there!</h1>
      <p>I'm at {counter}</p>
      <div>
        <button onClick={() => setCounter(counter => counter + 1)}>up</button>
        <button onClick={() => setCounter(counter => counter - 1)}>down</button>
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.querySelector('#app'));
