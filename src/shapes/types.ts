/**
 * Base shape type that all shapes must extend
 */
export interface BaseShape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  fillColor: string;
}

/**
 * Supported shape types
 */
export type ShapeType = 'rectangle' | 'circle' | 'triangle' | 'star';

/**
 * Rectangle shape definition
 */
export interface RectangleShape extends BaseShape {
  type: 'rectangle';
  width: number;
  height: number;
}

/**
 * Circle shape definition
 */
export interface CircleShape extends BaseShape {
  type: 'circle';
  radius: number;
}

/**
 * Triangle shape definition
 */
export interface TriangleShape extends BaseShape {
  type: 'triangle';
  width: number;
  height: number;
}

/**
 * Star shape definition
 */
export interface StarShape extends BaseShape {
  type: 'star';
  outerRadius: number;
  innerRadius: number;
  points: number;
}

/**
 * Union type of all shapes
 */
export type Shape = RectangleShape | CircleShape | TriangleShape | StarShape;

/**
 * Generic editable fields that apply to all shapes
 */
export interface BaseEditableFields {
  x: number;
  y: number;
  fillColor: string;
}

/**
 * Editable fields specific to rectangle shapes
 */
export interface RectangleEditableFields extends BaseEditableFields {
  width: number;
  height: number;
}

/**
 * Editable fields specific to circle shapes
 */
export interface CircleEditableFields extends BaseEditableFields {
  radius: number;
}

/**
 * Editable fields specific to triangle shapes
 */
export interface TriangleEditableFields extends BaseEditableFields {
  width: number;
  height: number;
}

/**
 * Editable fields specific to star shapes
 */
export interface StarEditableFields extends BaseEditableFields {
  outerRadius: number;
  innerRadius: number;
}

/**
 * Union type of all editable field sets
 */
export type EditableFields = RectangleEditableFields | CircleEditableFields | TriangleEditableFields | StarEditableFields;

