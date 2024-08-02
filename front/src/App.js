import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CreateReference from './components/CreateReference';
import RegisterWithReference from './components/RegisterWithReference';
import ReferenceList from './components/ReferenceList';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/create-reference" component={CreateReference} />
          <Route path="/register" component={RegisterWithReference} />
          <Route path="/references" component={ReferenceList} />
          <Route path="/" exact>
            <h1>Welcome to the Referral App</h1>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
