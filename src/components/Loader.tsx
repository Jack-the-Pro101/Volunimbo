import { JSX } from "solid-js";
import src from "../assets/img/loading.svg";

export default function Loader(props: JSX.IntrinsicElements["img"]) {
  return <img src={src} alt="Loading icon" style={{ color: "var(--clr-neutral-9)" }} {...props} />;
}
