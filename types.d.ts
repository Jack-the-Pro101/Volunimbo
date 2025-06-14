export interface Probability {
  index: number;
  name: string;
  probability: number;
}
export interface CloudClassification {
  genera: {
    name: string | undefined;
    probabilities: Probability[];
  };
  species: {
    name: string | undefined | null;
    probabilities: Probability[];
  };
  varieties: {
    name: string | undefined | null;
    probabilities: Probability[];
  };
}

type TensorflowData = Float32Array<ArrayBufferLike> | Int32Array<ArrayBufferLike> | Uint8Array<ArrayBufferLike>;
