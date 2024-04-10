export const canvasConfig = {
  width: 1008,
  height: 704,
};
//by doing this we can add left + down and get downLeft
export const Orientation = Object.freeze({
  left: 1 << 0, // 0001
  right: 1 << 1, // 0010
  up: 1 << 2, // 0100
  down: 1 << 3, // 1000
  upLeft: (1 << 2) | (1 << 0), // 0101
  upRight: (1 << 2) | (1 << 1), // 0110
  downRight: (1 << 3) | (1 << 1), // 1010
  downLeft: (1 << 3) | (1 << 0), // 1001
});
