import * as tf from "@tensorflow/tfjs";
import { CNN_INPUT_SIZE } from "../constants.ts";
import {
  ModelType,
  WorkerMessage,
  WorkerMessageType,
  WorkerPredictMessage,
  WorkerPredictResponse,
  WorkerResponseType,
} from "./ModelTypes.ts";

const IMAGE_SHAPE = [1, CNN_INPUT_SIZE, CNN_INPUT_SIZE, 3];

class Model {
  private generaModel?: tf.GraphModel;
  private speciesModel?: tf.GraphModel;
  private varietiesModel?: tf.GraphModel;

  async init() {
    // Download and load models from static directory
    [this.generaModel, this.speciesModel, this.varietiesModel] = await Promise.all([
      tf.loadGraphModel("./tfjs/genera/model.json"),
      tf.loadGraphModel("./tfjs/species/model.json"),
      tf.loadGraphModel("./tfjs/varieties/model.json"),
    ]);

    // Warm up models by passing blank data, allowing resources to be allocated beforehand
    const blankData = tf.zeros(IMAGE_SHAPE);
    await Promise.all([
      this.predict(ModelType.GENERA, blankData),
      this.predict(ModelType.SPECIES, blankData),
      this.predict(ModelType.VARIETIES, blankData),
    ]);
  }

  /**
   * Run the model on an image
   * @param model The model to use
   * @param data A Tensorflow tensor containing the image data
   * @returns The results as an array of native numbers
   */
  async predict(model: ModelType, data: tf.Tensor) {
    switch (model) {
      case ModelType.GENERA:
        return await (this.generaModel!.execute(data) as tf.Tensor).data();
      case ModelType.SPECIES:
        return await (this.speciesModel!.execute(data) as tf.Tensor).data();
      case ModelType.VARIETIES:
        return await (this.varietiesModel!.execute(data) as tf.Tensor).data();
    }
  }
}

// Instantiate the model singleton
const model = new Model();

// Listen for messages from the main thread
self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  switch (event.data.type) {
    case WorkerMessageType.INIT: {
      await model.init();
      self.postMessage({ type: WorkerResponseType.INITIALIZED });

      break;
    }
    case WorkerMessageType.PREDICT: {
      const data = event.data as WorkerPredictMessage;
      const result = await model.predict(data.model, tf.tensor(data.data, IMAGE_SHAPE));
      self.postMessage({ type: WorkerResponseType.PREDICT_RESULT, result, id: data.id } as WorkerPredictResponse);

      break;
    }
  }
};
