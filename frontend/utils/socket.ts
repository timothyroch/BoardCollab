import { io } from "socket.io-client";

const socket = io('http://backend:5000', {withCredentials: true});

export default socket;