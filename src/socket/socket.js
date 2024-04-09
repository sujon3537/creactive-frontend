import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// "undefined" means the URL will be computed from the `window.location` object
const URL = backendUrl;

export const socket = io(URL);
