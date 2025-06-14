import { TensorflowData } from "../../types.d.ts";

/**
 * These enums are all ordered based on the AI model's one-hot encoded indices. DO NOT CHANGE THEIR ORDER
 */
export enum GeneraCloudType {
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
// --- End of do not touch code ---
export type CloudType = GeneraCloudType | SpeciesCloudType | VarietyCloudType;

export const GeneraCloudMap: Record<GeneraCloudType, string> = {
  [GeneraCloudType.Ac]: "altocumulus",
  [GeneraCloudType.As]: "altostratus",
  [GeneraCloudType.Cb]: "cumulonimbus",
  [GeneraCloudType.Cc]: "cirrocumulus",
  [GeneraCloudType.Ci]: "cirrus",
  [GeneraCloudType.Cs]: "cirrostratus",
  [GeneraCloudType.Ct]: "contrail",
  [GeneraCloudType.Cu]: "cumulus",
  [GeneraCloudType.Ns]: "nimbostratus",
  [GeneraCloudType.Sc]: "stratocumulus",
  [GeneraCloudType.St]: "stratus",
  [GeneraCloudType.Clear]: "clear sky",
} as const;

export const SpeciesCloudMap: Record<SpeciesCloudType, string> = {
  [SpeciesCloudType.Calvus]: "calvus",
  [SpeciesCloudType.Capillatus]: "capillatus",
  [SpeciesCloudType.Castellanus]: "castellanus",
  [SpeciesCloudType.Congestus]: "congestus",
  [SpeciesCloudType.Fibratus]: "fibratus",
  [SpeciesCloudType.Floccus]: "floccus",
  [SpeciesCloudType.Fractus]: "fractus",
  [SpeciesCloudType.Humilis]: "humilis",
  [SpeciesCloudType.Lenticularis]: "lenticularis",
  [SpeciesCloudType.Mediocris]: "mediocris",
  [SpeciesCloudType.Nebulosus]: "nebulosus",
  [SpeciesCloudType.Spissatus]: "spissatus",
  [SpeciesCloudType.Stratiformis]: "stratiformis",
  [SpeciesCloudType.Uncinus]: "uncinus",
  [SpeciesCloudType.Volutus]: "volutus",
} as const;

export const VarietyCloudMap: Record<VarietyCloudType, string> = {
  [VarietyCloudType.Arcus]: "arcus",
  [VarietyCloudType.Asperitas]: "asperitas",
  [VarietyCloudType.Cavum]: "cavum",
  [VarietyCloudType.Duplicatus]: "duplicatus",
  [VarietyCloudType.Flammagenitus]: "flammagenitus",
  [VarietyCloudType.Fluctus]: "fluctus",
  [VarietyCloudType.Homogenitus]: "homogenitus",
  [VarietyCloudType.Incus]: "incus",
  [VarietyCloudType.Intortus]: "intortus",
  [VarietyCloudType.Lacunosus]: "lacunosus",
  [VarietyCloudType.Mamma]: "mamma",
  [VarietyCloudType.Nacreous]: "nacreous",
  [VarietyCloudType.Noctilucent]: "noctilucent",
  [VarietyCloudType.Opacus]: "opacus",
  [VarietyCloudType.Pannus]: "pannus",
  [VarietyCloudType.Perlucidus]: "perlucidus",
  [VarietyCloudType.Pileus]: "pileus",
  [VarietyCloudType.Praecipitatio]: "praecipitatio",
  [VarietyCloudType.Radiatus]: "radiatus",
  [VarietyCloudType.Translucidus]: "translucidus",
  [VarietyCloudType.Tuba]: "tuba",
  [VarietyCloudType.Undulatus]: "undulatus",
  [VarietyCloudType.Velum]: "velum",
  [VarietyCloudType.Vertebratus]: "vertebratus",
  [VarietyCloudType.Virga]: "virga",
} as const;

export enum ModelType {
  GENERA, // 10 cloud genera
  SPECIES, // 15 cloud species
  VARIETIES, // 30 (only 25 supported) cloud supplementary features/varieties
}

export enum WorkerMessageType {
  INIT,
  PREDICT,
}

export enum WorkerResponseType {
  INITIALIZED,
  PREDICT_RESULT,
}

export interface WorkerMessage {
  type: WorkerMessageType;
}

export interface WorkerResponse {
  type: WorkerResponseType;
}

export interface WorkerPredictMessage extends WorkerMessage {
  id: string;
  model: ModelType;
  data: TensorflowData;
}

export interface WorkerPredictResponse extends WorkerResponse {
  id: string;
  result: TensorflowData;
}
