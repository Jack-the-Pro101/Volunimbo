import { ModelType } from "./model/Model.ts";
import {
  CloudType,
  GeneraCloudMap,
  GeneraCloudType,
  SpeciesCloudMap,
  SpeciesCloudType,
  VarietyCloudMap,
  VarietyCloudType,
} from "./model/ModelTypes.ts";

type TensorflowData = Float32Array<ArrayBufferLike> | Int32Array<ArrayBufferLike> | Uint8Array<ArrayBufferLike>;

export function compileResults(type: ModelType, data: TensorflowData) {
  return Array.from(data)
    .map((value, i) => ({ index: i, name: getNameFromIndex(type, i), probability: value }))
    .sort((a, b) => b.probability - a.probability);
}

export function getMostProbable(data: TensorflowData) {
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

export function round(number: number, places = 2) {
  const multiplier = 10 ** places;
  return Math.round(number * multiplier) / multiplier;
}
