import { createSignal, createUniqueId, For, Show } from "solid-js";
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
  const inputId = createUniqueId();
  const [showAll, setShowAll] = createSignal(false);

  return (
    <div class={styles.panel}>
      <h3>{type}</h3>
      <p>
        <span>{cloud.name != null ? cloud.name : cloud.name === null ? "None/uncertain" : "-"}</span>
      </p>

      <ol class={styles.list} classList={{ [styles.visible]: showAll() }}>
        <For each={cloud.probabilities}>
          {({ name, probability }) => (
            <li>
              <span>{name}</span>
              <span>{round(probability * 100, 4)}%</span>
            </li>
          )}
        </For>
      </ol>
      <label for={inputId} class={styles.showLabelBtn}>
        {!showAll() ? "Show all" : "Hide"}
      </label>
      <input
        type="checkbox"
        hidden
        name="show-all"
        id={inputId}
        onInput={() => {
          setShowAll((showing) => !showing);
        }}
      />
    </div>
  );
}
