import { io } from "socket.io-client";
import { API_URL } from "./constants";

const socket_url = API_URL;

const socket = io(`${socket_url}game`, {
	withCredentials: true,
});

export default socket;
