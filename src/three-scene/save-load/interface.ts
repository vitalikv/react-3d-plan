export interface IFileJSON {
  level: {
    point: { id: number; pos: THREE.Vector3 }[] | [];
    wall: { id: number; point: { id: number; pos: { x: number; y: number; z: number } }[] }[] | [];
    name: string;
    h: { y1: number; y2: number };
  }[];
}
