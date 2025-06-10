/* @refresh reload */
import { render } from "solid-js/web";
import "./index.css";
import App from "./App.tsx";

const root = document.querySelector("body");

render(() => <App />, root!);
