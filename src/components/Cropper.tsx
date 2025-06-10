import CropperJs from "cropperjs";
import { Portal } from "solid-js/web";
import { Accessor, createUniqueId, onMount } from "solid-js";

import styles from "./Cropper.module.css";

export default function Cropper({
  src,
  callbacks,
}: {
  src: Accessor<string>;
  callbacks: { cancel: () => void; done: () => void };
}) {
  let imageElem!: HTMLImageElement;
  let container!: HTMLDivElement;
  let cropper;

  onMount(() => {
    cropper = new CropperJs(imageElem, {
      template: `
        <cropper-canvas background>
        <cropper-image initialCenterSize="contain" scalable translatable></cropper-image>
        <cropper-shade hidden></cropper-shade>
        <cropper-handle action="select" plain></cropper-handle>
        <cropper-selection initial-coverage="0.8" movable resizable initial-aspect-ratio="1" aspect-ratio="1">
          <cropper-grid role="grid" bordered covered></cropper-grid>
          <cropper-crosshair centered></cropper-crosshair>
          <cropper-handle action="move" theme-color="rgba(255, 255, 255, 0.35)"></cropper-handle>
          <cropper-handle action="n-resize"></cropper-handle>
          <cropper-handle action="e-resize"></cropper-handle>
          <cropper-handle action="s-resize"></cropper-handle>
          <cropper-handle action="w-resize"></cropper-handle>
          <cropper-handle action="ne-resize"></cropper-handle>
          <cropper-handle action="nw-resize"></cropper-handle>
          <cropper-handle action="se-resize"></cropper-handle>
          <cropper-handle action="sw-resize"></cropper-handle>
        </cropper-selection>
      </cropper-canvas>`,
    });
  });

  return (
    <Portal>
      <div class={styles.container} ref={container}>
        <div class={styles.content}>
          <img src={src()} alt="" ref={imageElem} />

          <div class={styles.buttons}>
            <button>Cancel</button>
            <button
              on:click={async () => {
                // @ts-expect-error
                const element = await container.querySelector("cropper-selection")!.$toCanvas();

                document.body.append(element);
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
