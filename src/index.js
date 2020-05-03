import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Router, Switch, Route, BrowserRouter } from "react-router-dom";
import { createBrowserHistory } from "history";
import * as serviceWorker from "./serviceWorker";

import Home from "./Home";
import App from "./game";
import Info from "./info"
import Join from "./Join"

const history = createBrowserHistory();

class Main extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/Game" component={App} />
          <Route path="/Info" component={Info} />
          <Route path="/join/:id" component={Join} />
        </Switch>
      </BrowserRouter>
    );
  }
}

ReactDOM.render(
  <Router history={history}>
    <Main history={history} />
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
