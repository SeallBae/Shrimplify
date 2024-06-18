import { io } from "socket.io-client";

const api_url = process.env.REACT_APP_BE_URL || "http://localhost:7000";
const socket = io(api_url);

export default socket;
