import { createMemo, createSignal, onMount, Show } from "solid-js";
import { createStore } from "solid-js/store";
import Model from "./model/Model.ts";
import styles from "./App.module.css";
import Cropperjs from "cropperjs";
import Cropper from "./components/Cropper.tsx";

interface CloudName {
  genera: string | undefined;
  species: string | undefined | null;
  varieties: string[] | undefined | null;
}

function App() {
  onMount(async () => {
    // await Model.init();
  });

  const [file, setFile] = createSignal<File>();
  const [cropping, setCropping] = createSignal(false);
  const image = createMemo(() => (file() == null ? null : URL.createObjectURL(file()!)));
  const [cloudName, setCloudName] = createStore<CloudName>({
    genera: "altocumulus",
    species: "stratiformis",
    varieties: ["cavum", "udulatus"],
  });

  let input!: HTMLInputElement;

  async function imageChanged() {
    const newFile = input.files?.item(0)!;

    if (newFile == file() || newFile == null) return;

    if (image()) URL.revokeObjectURL(image()!);

    setFile(newFile);
  }

  return (
    <>
      <header class={styles.header}>
        <h1>Volunimbo</h1>
        <p>AI cloud type classifier</p>
      </header>
      <main class={styles.main}>
        <section class={styles.container}>
          <form action="#" class={styles.form}>
            <label for="cloud" class={styles.form__select}>
              <Show when={image()}>
                {(src) => (
                  <>
                    <img src={image() || ""} alt={file()?.name} class={styles.form__img} />

                    {/* <Show when={cropping()}> */}
                    <Cropper src={src} />
                    {/* </Show> */}
                  </>
                )}
              </Show>
              Select image
              <input
                type="file"
                hidden
                name="cloud"
                id="cloud"
                accept="image/*"
                onInput={imageChanged}
                ref={input}
                required
              />
            </label>
          </form>
          <div class={styles.app}>
            <h2 class={styles.app__cloudName}>
              {cloudName.genera} {cloudName.species} {cloudName.varieties?.map((value) => value)?.join(" ")}
            </h2>

            <p></p>

            <div class={styles.app__details}>
              <div class={styles.app__detailPanel}>
                <h3>Genera</h3>
                <p></p>

                <ol></ol>
              </div>
              <div class={styles.app__detailPanel}>
                <h3>Species</h3>
                <p></p>

                <ol></ol>
              </div>
              <div class={styles.app__detailPanel}>
                <h3>Supplementary features / Varieties</h3>
                <p></p>

                <ol></ol>
              </div>
            </div>
          </div>
        </section>

        <section class={styles.about}>
          <h2>About</h2>

          <p>
            A cloud classifier powered by a convolutional neural network model that runs locally in-browser. All 3
            models share a CNN that was trained on the genera classification datasets, with the supplementary
            features/varieties models being made by transfer-learning on the common CNN.
          </p>

          <p>
            Data used to train the model is from the following (This project was developed as my ICS4U final project and
            is made for educational purposes, please don't sue me):
          </p>

          <p>Shared CNN and genera classifier:</p>
          <ul>
            <li>
              <a
                href="https://github.com/SadaharuZL/HuaYun-BJUT-MIP-Cloud-Dataset"
                target="_blank"
                rel="noopener noreferrer"
              >
                HuaYun-BJUT-MIP-Cloud-Dataset
              </a>
            </li>
            <li>
              <a
                href="https://github.com/shuangliutjnu/TJNU-Ground-based-Cloud-Dataset"
                target="_blank"
                rel="noopener noreferrer"
              >
                TJNU ground-based cloud dataset (GCD)
              </a>
            </li>
            <li>
              <a
                href="https://www.kaggle.com/competitions/cloud-type-classification2/data"
                target="_blank"
                rel="noopener noreferrer"
              >
                Some Kaggle competition
              </a>
            </li>
            <li>CCSN dataset</li>
          </ul>

          <p>Species and supplementary features/varieties classifier:</p>
          <ul>
            <li>
              <a
                href="https://cloudatlas.wmo.int/en/search-image-gallery.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                WMO Cloud Atlas
              </a>
            </li>
            <li>
              <a href="https://cloudappreciationsociety.org/gallery/" target="_blank" rel="noopener noreferrer">
                Cloud Appreciation Society
              </a>
            </li>
          </ul>
        </section>
      </main>
      <footer>
        <p>Made by Emperor of Bluegaria</p>
      </footer>
    </>
  );
}

export default App;
