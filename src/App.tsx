import { createEffect, createMemo, createSignal, onMount, Show } from "solid-js";
import { createStore } from "solid-js/store";
import Model, { ModelType } from "./model/Model.ts";
import styles from "./App.module.css";
import Cropper from "./components/Cropper.tsx";
import { CNN_INPUT_SIZE } from "./constants.ts";
import { Tensor } from "@tensorflow/tfjs";

interface CloudName {
  genera: string | undefined;
  species: string | undefined | null;
  varieties: string[] | undefined;
}

function App() {
  onMount(async () => {
    await Model.init();
  });

  const [file, setFile] = createSignal<File>();
  const ogImage = createMemo<string | null>((value) => {
    if (value) URL.revokeObjectURL(value);
    return file() == null ? null : URL.createObjectURL(file()!);
  });
  const [cropping, setCropping] = createSignal(false);
  const [image, setImage] = createSignal<string>();
  const [cloudName, setCloudName] = createStore<CloudName>({
    genera: undefined,
    species: undefined,
    varieties: undefined,
  });

  let input!: HTMLInputElement;
  let imageElem!: HTMLImageElement;

  function imageChanged() {
    const newFile = input.files?.item(0)!;

    if (newFile == file() || newFile == null) return;

    setFile(newFile);
    setCropping(true);
  }

  createEffect(async () => {
    const imageSrc = image();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (imageSrc == null) return;

    console.log(await Model.imageToTensor(imageElem).then((t) => t.data()));
    const result = await Model.predict(ModelType.GENERA, await Model.imageToTensor(imageElem));

    if (result instanceof Tensor) {
      const data = await result.data();
      console.log(data);
    }
  });

  return (
    <>
      <Show when={ogImage()}>
        {(src) => (
          <Show when={cropping()}>
            <Cropper
              src={src}
              callbacks={{
                cancel() {
                  setCropping(false);
                },
                done(blob) {
                  setCropping(false);

                  if (!blob) return;

                  setImage((image) => {
                    if (image) URL.revokeObjectURL(image);
                    return URL.createObjectURL(blob);
                  });
                },
              }}
            />
          </Show>
        )}
      </Show>
      <header class={styles.header}>
        <h1>Volunimbo</h1>
        <p>AI cloud type classifier</p>
      </header>
      <main class={styles.main}>
        <section class={styles.container}>
          <form action="#" class={styles.form}>
            <label for="cloud" class={styles.form__select}>
              <img src={image() || ""} alt={file()?.name} class={styles.form__img} />
              <img
                src={image() || ""}
                alt={file()?.name}
                hidden
                width={CNN_INPUT_SIZE}
                height={CNN_INPUT_SIZE}
                ref={imageElem}
              />
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
