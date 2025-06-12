import { For } from "solid-js";
import styles from "./CloudDetailPanel.module.css";
import { round } from "../utils.ts";
import { CloudClassification } from "../../types.d.ts";

export default function CloudDetailPanel<T extends CloudClassification[keyof CloudClassification]>({
  cloud,
  type,
}: {
  cloud: T;
  type: string;
}) {
  return (
    <div class={styles.panel}>
      <h3>{type}</h3>
      <p>{cloud.name != null ? cloud.name : cloud.name === null ? "None/uncertain" : "-"}</p>

      <ol class={styles.list}>
        <For each={cloud.probabilities}>
          {({ name, probability }) => (
            <li>
              <span>{name}</span>
              <span>{round(probability * 100, 4)}%</span>
            </li>
          )}
        </For>
      </ol>
    </div>
  );
}
