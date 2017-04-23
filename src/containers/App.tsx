import * as React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

const Foo = () => (
  <div>
    <h2>Foo</h2>
    <p>Lorem Ipsum</p>
  </div>
)

const Hello = () => (
  <div>
    <h2>Yet Another Hello World</h2>
    <p>Yes you have another Hello World</p>
  </div>
)

const About = () => (
  <div>
    <h2>About ReactTypescriptStarter</h2>
    <p>
      An attempt to create my own starter pack for React Typescript package.
    </p>
  </div>
)

class App extends React.Component<any, any> {
  render() {
    return (
      <Router>
        <div>
          <h4>Example App</h4>
          <ul>
            <li><Link to="/">Hello</Link></li>
            <li><Link to="/foo">Foo</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
          <hr />

          <Route exact path="/" component={Hello} />
          <Route path="/about" component={About} />
          <Route path="/foo" component={Foo} />
        </div>
      </Router>
    );
  }
}

export default App;