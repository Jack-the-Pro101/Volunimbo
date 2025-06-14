import * as tf from "@tensorflow/tfjs";
import { Accessor, createSignal, Setter } from "solid-js";
import {
  ModelType,
  WorkerMessageType,
  WorkerPredictMessage,
  WorkerPredictResponse,
  WorkerResponse,
  WorkerResponseType,
} from "./ModelTypes.ts";
import { TensorflowData } from "../../types.d.ts";

type PredictionResolver = (data: TensorflowData) => any;

class Model {
  public ready: Accessor<boolean>;
  private setReady: Setter<boolean>;
  private worker = new Worker(new URL("./Worker.ts", import.meta.url), { type: "module" });

  private queue: Map<string, PredictionResolver> = new Map();

  constructor() {
    [this.ready, this.setReady] = createSignal(false);

    // Begin listening for messages from the worker
    this.worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      switch (event.data.type) {
        case WorkerResponseType.INITIALIZED: {
          this.setReady(true);

          break;
        }
        case WorkerResponseType.PREDICT_RESULT: {
          const data = event.data as WorkerPredictResponse;
          const resolver = this.queue.get(data.id)!;
          resolver(data.result);

          this.queue.delete(data.id);

          break;
        }
      }
    };
  }

  /**
   * Initialize the model. Once done, the `Model.ready()` signal will be true.
   */
  init() {
    if (this.ready()) return new Error("Already initialized");

    this.worker.postMessage({ type: WorkerMessageType.INIT });
  }

  async imageToTensor(image: HTMLImageElement) {
    const tensor = await tf.browser.fromPixelsAsync(image, 3);

    // Normalization tensors the models were trained on
    const mean = tf.tensor1d([0.5333, 0.53, 0.5399]);
    const std = tf.tensor1d([0.23, 0.2306, 0.2221]);

    // Normalize pixel data from 0-255 to 0-1, then normalize based on above,
    // then add in 1 more dimension at beginning representing batch size of 1
    return tensor.div(255).sub(mean).div(std).expandDims(0);
  }

  async predict(model: ModelType, data: tf.Tensor) {
    const rawData = await data.data();

    const resolver = (resolve: PredictionResolver) => {
      const id = crypto.randomUUID();
      this.queue.set(id, resolve);

      this.worker.postMessage({ type: WorkerMessageType.PREDICT, id, model, data: rawData } as WorkerPredictMessage);
    };

    const promise = new Promise(resolver);

    return await promise;
  }
}

export default new Model();
