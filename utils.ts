import { resourceLimits } from "node:worker_threads";
import { ModelType } from "./src/model/Model.ts";
import {
  CloudType,
  GeneraCloudMap,
  GeneraCloudType,
  SpeciesCloudMap,
  SpeciesCloudType,
  VarietyCloudMap,
  VarietyCloudType,
} from "./src/model/ModelTypes.ts";

export function getMostProbable(
  data: Float32Array<ArrayBufferLike> | Int32Array<ArrayBufferLike> | Uint8Array<ArrayBufferLike>
) {
  const array = Array.from(data);

  const max = {
    index: 0,
    probability: 0,
  };
  for (let i = 0; i < array.length; i++) {
    const element = array[i];

    if (element > max.probability) {
      max.index = i;
      max.probability = element;
    }
  }

  return max;
}

export function getProbabilitiesPastThreshold(
  data: Float32Array<ArrayBufferLike> | Int32Array<ArrayBufferLike> | Uint8Array<ArrayBufferLike>,
  thresholdProbability = 0.75
) {
  const array = Array.from(data);

  const results: {
    index: number;
    probability: number;
  }[] = [];

  for (let i = 0; i < array.length; i++) {
    const element = array[i];

    if (element >= thresholdProbability) {
      results.push({
        index: i,
        probability: element,
      });
    }
  }

  return results;
}

export function getNameFromIndex<T extends CloudType>(type: ModelType, index: T) {
  switch (type) {
    case ModelType.GENERA:
      return GeneraCloudMap[index as GeneraCloudType];
    case ModelType.SPECIES:
      return SpeciesCloudMap[index as SpeciesCloudType];
    case ModelType.VARIETIES:
      return VarietyCloudMap[index as VarietyCloudType];
  }
}
