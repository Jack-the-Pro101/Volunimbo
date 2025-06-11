import * as tf from "@tensorflow/tfjs";
import { Accessor, createSignal, Setter } from "solid-js";

export enum PrimaryCloudType {
  Ac,
  As,
  Cb,
  Cc,
  Ci,
  Cs,
  Ct,
  Cu,
  Ns,
  Sc,
  St,
  Clear,
}

export enum SpeciesCloudType {
  Calvus,
  Capillatus,
  Castellanus,
  Congestus,
  Fibratus,
  Floccus,
  Fractus,
  Humilis,
  Lenticularis,
  Mediocris,
  Nebulosus,
  Spissatus,
  Stratiformis,
  Uncinus,
  Volutus,
}

export enum VarietyCloudType {
  Arcus,
  Asperitas,
  Cavum,
  Duplicatus,
  Flammagenitus,
  Fluctus,
  Homogenitus,
  Incus,
  Intortus,
  Lacunosus,
  Mamma,
  Nacreous,
  Noctilucent,
  Opacus,
  Pannus,
  Perlucidus,
  Pileus,
  Praecipitatio,
  Radiatus,
  Translucidus,
  Tuba,
  Undulatus,
  Velum,
  Vertebratus,
  Virga,
}

export const PrimaryCloudMap: Record<PrimaryCloudType, string> = {
  [PrimaryCloudType.Ac]: "Altocumulus",
  [PrimaryCloudType.As]: "Altostratus",
  [PrimaryCloudType.Cb]: "Cumulonimbus",
  [PrimaryCloudType.Cc]: "Cirrocumulus",
  [PrimaryCloudType.Ci]: "Cirrus",
  [PrimaryCloudType.Cs]: "Cirrostratus",
  [PrimaryCloudType.Ct]: "Contrail",
  [PrimaryCloudType.Cu]: "Cumulus",
  [PrimaryCloudType.Ns]: "Nimbostratus",
  [PrimaryCloudType.Sc]: "Stratocumulus",
  [PrimaryCloudType.St]: "Stratus",
  [PrimaryCloudType.Clear]: "Clear",
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

  async imageToTensor(image: HTMLImageElement) {
    const tensor = await tf.browser.fromPixelsAsync(image, 3);

    const mean = tf.tensor1d([0.5333, 0.53, 0.5399]);
    const std = tf.tensor1d([0.23, 0.2306, 0.2221]);

    return tensor.div(255).sub(mean).div(std).expandDims(0);
  }

  async predict(model: ModelType, data: tf.Tensor) {
    if (!this.ready()) return new Error("Model not initialized");

    switch (model) {
      case ModelType.GENERA:
        return this.generaModel!.execute(data);
      case ModelType.SPECIES:
        return await this.speciesModel!.executeAsync(data);
      case ModelType.VARIETIES:
        return await this.varietiesModel!.executeAsync(data);
    }
  }
}

export default new Model();
