// import { useState } from "preact/hooks";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import Game from "./pages/Game";
import Join from "./pages/Join";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Home />,
	},
	{
		path: "/game",
		element: <Game />,
	},
	{
		path: "/join/:gameId",
		element: <Join />,
	},
	{
		path: "*",
		element: <NotFoundPage />,
	},
]);

export function App() {
	return (
		<>
			<RouterProvider router={router} />
			<ToastContainer limit={3} />
		</>
	);
}
