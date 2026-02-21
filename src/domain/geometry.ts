/**
 * Базовая модель прямоугольника
 */
export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Ограничивает числовое значение в заданном диапазоне
 * @param value
 * @param min
 * @param max
 */
export function clamp(
  value: number,
  min: number,
  max: number
): number {
  return Math.max(min, Math.min(value, max));
}

/**
 * Проверяет пересечение двух прямоугольников (AABB)
 * @param rectA
 * @param rectB
 */
export function isIntersecting(rectA: Rect, rectB: Rect): boolean {
  return !(
    rectA.x + rectA.width <= rectB.x ||
    rectA.x >= rectB.x + rectB.width ||
    rectA.y + rectA.height <= rectB.y ||
    rectA.y >= rectB.y + rectB.height
  );
}

/**
 * Ограничивает прямоугольник границами контейнера.
 * Изменяет только позицию
 * @param rect
 * @param bounds
 */
export function constrainToBounds(
  rect: Rect,
  bounds: Rect
): Rect {
  return {
    ...rect,
    x: clamp(rect.x, bounds.x, bounds.width - rect.width),
    y: clamp(rect.y, bounds.y, bounds.height - rect.height),
  }
}
