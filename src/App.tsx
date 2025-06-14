import { createEffect, createMemo, createSignal, For, onCleanup, onMount, Show } from "solid-js";
import { createStore } from "solid-js/store";

import { CloudClassification } from "../types.d.ts";
import { compileResults, getNameFromIndex } from "./utils.ts";

import styles from "./App.module.css";

import AboutSection from "./components/AboutSection.tsx";
import CloudDetailPanel from "./components/CloudDetailPanel.tsx";
import Cropper from "./components/Cropper.tsx";
import Footer from "./components/Footer.tsx";
import { CNN_INPUT_SIZE } from "./constants.ts";
import Model from "./model/Model.ts";
import { GeneraCloudType, ModelType } from "./model/ModelTypes.ts";
import Loader from "./components/Loader.tsx";

function App() {
  let input!: HTMLInputElement;
  let imageElem!: HTMLImageElement;

  const [file, setFile] = createSignal<File>();
  const ogImage = createMemo<string | null>((value) => {
    if (value) URL.revokeObjectURL(value);
    return file() == null ? null : URL.createObjectURL(file()!);
  });
  const [cropping, setCropping] = createSignal(false);
  const [image, setImage] = createSignal<string>();
  const [imageLoaded, setImageLoaded] = createSignal(false);
  const [cloud, setCloud] = createStore<CloudClassification>({
    genera: { name: undefined, probabilities: [] },
    species: { name: undefined, probabilities: [] },
    varieties: { name: undefined, probabilities: [] },
  });
  const [busy, setBusy] = createSignal(false);
  const canPredict = () => Model.ready() && !busy();

  onMount(() => {
    Model.init();

    imageElem.addEventListener("load", updateImageLoaded);
  });

  function imageChanged() {
    const newFile = input.files?.item(0)!;

    if (newFile == null) return;

    setFile(newFile);
    setCropping(true);

    input.value = "";
  }

  function updateImageLoaded() {
    setImageLoaded(true);
  }

  createEffect(async () => {
    if (image() == null || !imageLoaded()) return;

    setBusy(true);
    try {
      const imageData = await Model.imageToTensor(imageElem);

      const [generaResult, speciesResult, varietiesResult] = await Promise.all([
        Model.predict(ModelType.GENERA, imageData),
        Model.predict(ModelType.SPECIES, imageData),
        Model.predict(ModelType.VARIETIES, imageData),
      ]);

      if (generaResult) {
        const results = compileResults(ModelType.GENERA, generaResult);

        setCloud("genera", "name", results[0].name);
        setCloud("genera", "probabilities", results);

        if (
          (results[0].index as GeneraCloudType) == GeneraCloudType.Clear ||
          (results[0].index as GeneraCloudType) == GeneraCloudType.Ct
        ) {
          // Clear sky and contrail clouds do not have additional features, done classifying
          setCloud("species", "name", null);
          setCloud("species", "probabilities", []);
          setCloud("varieties", "name", undefined);
          setCloud("varieties", "probabilities", []);
          return;
        }
      } else {
        setCloud("genera", "name", undefined);
      }

      if (speciesResult) {
        const results = compileResults(ModelType.SPECIES, speciesResult);

        setCloud("species", "name", results[0].probability > 0.6 ? results[0].name : null);
        setCloud("species", "probabilities", results);
      } else {
        setCloud("species", "name", undefined);
      }

      if (varietiesResult) {
        const results = compileResults(ModelType.VARIETIES, varietiesResult);
        const confidentResults = results
          .filter((result) => result.probability >= 0.7)
          .map((result) => getNameFromIndex(ModelType.VARIETIES, result.index));

        setCloud("varieties", "name", confidentResults.length > 0 ? confidentResults.join(" ") : null);
        setCloud("varieties", "probabilities", results);
      } else {
        setCloud("varieties", "name", undefined);
      }
    } catch (error) {
      alert(`Failed to predict ${error}`);
    }
    setBusy(false);
  });

  onCleanup(() => {
    imageElem.removeEventListener("load", updateImageLoaded);
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
                  setImageLoaded(false);
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
                onChange={imageChanged}
                ref={input}
                required
              />
            </label>
          </form>
          <div class={styles.app}>
            <Show
              when={Model.ready()}
              fallback={
                <div class={styles.app__splashscreen}>
                  <h2>Loading model...</h2>
                  <Loader />
                </div>
              }
            >
              <h2 class={styles.app__cloudName}>
                <Show
                  when={cloud.genera.name}
                  fallback={
                    <For each={[30, 20, 40]}>
                      {(number) => (
                        <span class={styles.app__cloudNameSkeleton} style={{ "--width": `${number}%` }}>
                          {" "}
                        </span>
                      )}
                    </For>
                  }
                >
                  {cloud.genera.name} {cloud.species.name} {cloud.varieties.name}
                </Show>
              </h2>

              <p></p>

              <ol class={styles.app__details}>
                <CloudDetailPanel cloud={cloud.genera} type="Genera" />
                <CloudDetailPanel cloud={cloud.species} type="Species" />
                <CloudDetailPanel cloud={cloud.varieties} type="Supplementary features / Varieties" />
              </ol>
            </Show>
          </div>
        </section>
        <AboutSection />
        <Footer />
      </main>
    </>
  );
}

export default App;
