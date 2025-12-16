/**
 * Layer represents a shape's position in the layer stack
 * Each layer references a shape via shapeId (foreign key)
 */
export interface Layer {
  id: string;
  shapeId: string;
  name: string;
  order: number; // Lower numbers render first (bottom layer)
}
