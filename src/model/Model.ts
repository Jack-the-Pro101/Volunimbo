import * as tf from "@tensorflow/tfjs";
import { Accessor, createSignal, Setter } from "solid-js";

export enum ModelType {
  GENERA, // 10 cloud genera
  SPECIES, // 15 cloud species
  VARIETIES, // 30 (only 25 supported) cloud supplementary features/varieties
}

class Model {
  private generaModel?: tf.GraphModel;
  private speciesModel?: tf.GraphModel;
  private varietiesModel?: tf.GraphModel;
  public ready: Accessor<boolean>;
  private setReady: Setter<boolean>;

  constructor() {
    [this.ready, this.setReady] = createSignal(false);
  }

  async init() {
    if (this.ready()) return new Error("Already initialized");

    [this.generaModel, this.speciesModel, this.varietiesModel] = await Promise.all([
      tf.loadGraphModel("/tfjs/genera/model.json"),
      tf.loadGraphModel("/tfjs/species/model.json"),
      tf.loadGraphModel("/tfjs/varieties/model.json"),
    ]);

    this.setReady(true);
    console.log("Model initialized");
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
    if (!this.ready()) return new Error("Model not initialized");

    switch (model) {
      case ModelType.GENERA:
        return await this.generaModel!.executeAsync(data);
      case ModelType.SPECIES:
        return await this.speciesModel!.executeAsync(data);
      case ModelType.VARIETIES:
        return await this.varietiesModel!.executeAsync(data);
    }
  }
}

export default new Model();
