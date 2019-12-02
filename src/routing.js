import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import HomePage from './components/homepage';
import SearchResults from './components/search';
export const routing = (
    <Router>
      <Switch>
        <Route exact path="/(|home)" component={HomePage} />
        <Route exact path="/search" component={SearchResults} />
      </Switch>
    </Router>
)