import { createEffect, createMemo, createSignal, onCleanup, onMount, Show } from "solid-js";
import { createStore } from "solid-js/store";
import Model, { ModelType } from "./model/Model.ts";
import styles from "./App.module.css";
import Cropper from "./components/Cropper.tsx";
import { CNN_INPUT_SIZE } from "./constants.ts";
import { Tensor } from "@tensorflow/tfjs";
import AboutSection from "./components/AboutSection.tsx";
import Footer from "./components/Footer.tsx";
import { getMostProbable, getNameFromIndex } from "../utils.ts";
import { GeneraCloudType } from "./model/ModelTypes.ts";

interface CloudName {
  genera: string | undefined;
  species: string | undefined | null;
  varieties: string[] | undefined;
}

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
  const [cloudName, setCloudName] = createStore<CloudName>({
    genera: undefined,
    species: undefined,
    varieties: undefined,
  });

  onMount(async () => {
    await Model.init();

    imageElem.addEventListener("load", updateImageLoaded);
  });

  function imageChanged() {
    const newFile = input.files?.item(0)!;

    if (newFile == null) return;

    setFile(newFile);
    setCropping(true);
  }

  function updateImageLoaded() {
    setImageLoaded(true);
  }

  createEffect(async () => {
    const imageSrc = image();

    if (imageSrc == null || !imageLoaded()) return;

    try {
      const imageData = await Model.imageToTensor(imageElem);

      const [generaResult, speciesResult, varietiesResult] = await Promise.all([
        Model.predict(ModelType.GENERA, imageData),
        Model.predict(ModelType.SPECIES, imageData),
        Model.predict(ModelType.VARIETIES, imageData),
      ]);

      if (generaResult instanceof Tensor) {
        const data = await generaResult.data();
        const result = getMostProbable(data);
        setCloudName("genera", getNameFromIndex(ModelType.GENERA, result.index));
        console.log(result);

        if (
          (result.index as GeneraCloudType) == GeneraCloudType.Clear ||
          (result.index as GeneraCloudType) == GeneraCloudType.Ct
        )
          // Clear sky and contrail clouds do not have additional features, done classifying
          return;
      }

      if (speciesResult instanceof Tensor) {
        const data = await speciesResult.data();
        const result = getMostProbable(data);
        setCloudName("species", getNameFromIndex(ModelType.SPECIES, result.index));
      }
      if (varietiesResult instanceof Tensor) {
        const data = await varietiesResult.data();
        console.log(data);
      }
    } catch (error) {
      alert(`Failed to predict ${error}`);
    }
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
                <p>{cloudName.genera}</p>

                <ol></ol>
              </div>
              <div class={styles.app__detailPanel}>
                <h3>Species</h3>
                <p>{cloudName.species}</p>

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
        <AboutSection />
        <Footer />
      </main>
    </>
  );
}

export default App;
