import { io } from "socket.io-client";

const socket_url =
	process.env.NODE_ENV === "development"
		? process.env.REACT_APP_API_URL || ""
		: "/";

const socket = io(`${socket_url}game`, {
	withCredentials: true,
});

export default socket;
