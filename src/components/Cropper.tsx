import CropperJs from "cropperjs";
import "cropperjs/dist/cropper.css";
import { Portal } from "solid-js/web";
import { Accessor, createUniqueId, onMount } from "solid-js";

import styles from "./Cropper.module.css";
import { CNN_INPUT_SIZE } from "../constants.ts";

export default function Cropper({
  src,
  callbacks,
}: {
  src: Accessor<string>;
  callbacks: { cancel: () => void; done: BlobCallback };
}) {
  let imageElem!: HTMLImageElement;
  let container!: HTMLDivElement;
  let cropper: CropperJs;

  onMount(() => {
    cropper = new CropperJs(imageElem, {
      aspectRatio: 1,
      initialAspectRatio: 1,
      zoomable: false,
      scalable: false,
      autoCrop: true,
      minCropBoxHeight: CNN_INPUT_SIZE,
      minCropBoxWidth: CNN_INPUT_SIZE,
    });
  });

  return (
    <Portal>
      <div class={styles.container} ref={container}>
        <div class={styles.content}>
          <div class={styles.imageContainer}>
            <img src={src()} alt="" ref={imageElem} />
          </div>

          <div class={styles.buttons}>
            <button type="button" onClick={callbacks.cancel}>
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                cropper
                  .getCroppedCanvas({
                    imageSmoothingEnabled: true,
                    imageSmoothingQuality: "high",
                    width: CNN_INPUT_SIZE,
                    height: CNN_INPUT_SIZE,
                  })
                  .toBlob(callbacks.done);
              }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
