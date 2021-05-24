import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Game from "./pages/Game";
import Home from "./pages/Home";
import Join from "./pages/Join";
import "./styles/index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Main = () => (
	<Router>
		<Switch>
			<Route exact path="/" component={Home} />
			<Route path="/game" component={Game} />
			<Route path="/join/:gameId" component={Join} />
		</Switch>
		<ToastContainer limit={3} />
	</Router>
);

ReactDOM.render(
	<React.StrictMode>
		<Main />
	</React.StrictMode>,
	document.getElementById("root")
);
