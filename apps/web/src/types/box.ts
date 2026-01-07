type BoxPosition = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type BoxMap = {
  clients?: BoxPosition;
  gateway?: BoxPosition;
  backend?: BoxPosition;
};
export type { BoxPosition, BoxMap };
