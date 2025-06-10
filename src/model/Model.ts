import * as tf from "@tensorflow/tfjs";
import { Accessor, createSignal, Setter } from "solid-js";

export enum PrimaryCloudType {
  Ac,
  As,
  Cb,
  Cc,
  Ci,
  Clear,
  Cs,
  Ct,
  Cu,
  Ns,
  Sc,
  St,
}

export const PrimaryCloudMap: Record<PrimaryCloudType, string> = {
  [PrimaryCloudType.Ac]: "Altocumulus",
  [PrimaryCloudType.As]: "Altostratus",
  [PrimaryCloudType.Cb]: "Cumulonimbus",
  [PrimaryCloudType.Cc]: "Cirrocumulus",
  [PrimaryCloudType.Ci]: "Cirrus",
  [PrimaryCloudType.Clear]: "Clear",
  [PrimaryCloudType.Cs]: "Cirrostratus",
  [PrimaryCloudType.Ct]: "Contrail",
  [PrimaryCloudType.Cu]: "Cumulus",
  [PrimaryCloudType.Ns]: "Nimbostratus",
  [PrimaryCloudType.Sc]: "Stratocumulus",
  [PrimaryCloudType.St]: "Stratus",
} as const;

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

  static async imageToTensor(image: HTMLImageElement) {
    return await tf.browser.fromPixelsAsync(image);
  }

  async predict(model: ModelType, data: tf.Tensor) {
    if (!this.ready()) return new Error("Model not initialized");

    switch (model) {
      case ModelType.GENERA:
        return await this.generaModel!.predictAsync(data);
      case ModelType.SPECIES:
        return await this.speciesModel!.predictAsync(data);
      case ModelType.VARIETIES:
        return await this.varietiesModel!.predictAsync(data);
    }
  }
}

export default new Model();
