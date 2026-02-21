import { onBeforeUnmount } from 'vue'
import { constrainToBounds, isIntersecting, type Rect } from '@/domain/geometry'

type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface UseResizeOptions {
  rect: () => Rect;
  bounds: Rect;
  obstacles: Rect[];
  corner: Corner;
  minWidth?: number;
  minHeight?: number;
  onResize: (next: Rect) => void;
  canShrink?: () => boolean;
}

export function useResize(options: UseResizeOptions) {
  let startX = 0;
  let startY = 0;
  let currentRect: Rect | null = null;

  const minW = options.minWidth ?? 80;
  const minH = options.minHeight ?? 60;

  const onPointerMove = (e: PointerEvent) => {
    if (!currentRect) return;

    const canShrink = options.canShrink?.() ?? true;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    let next = { ...currentRect };

    switch (options.corner) {
      case 'bottom-right': {
        const newWidth = currentRect.width + dx;
        const newHeight = currentRect.height + dy;

        const clampedWidth = Math.max(minW, newWidth);
        const clampedHeight = Math.max(minH, newHeight);

        if (clampedWidth !== currentRect.width) {
          next.width = clampedWidth;
        }

        if (clampedHeight !== currentRect.height) {
          next.height = clampedHeight;
        }

        break;
      }

      case 'top-right': {
        const newWidth = currentRect.width + dx;
        const newHeight = currentRect.height - dy;

        const clampedWidth = Math.max(minW, newWidth);
        const clampedHeight = Math.max(minH, newHeight);

        if (clampedWidth !== currentRect.width) {
          next.width = clampedWidth;
        }

        if (clampedHeight !== currentRect.height) {
          next.height = clampedHeight;
          next.y = currentRect.y + dy;
        }

        break;
      }

      case 'bottom-left': {
        const newWidth = currentRect.width - dx;
        const newHeight = currentRect.height + dy;

        const clampedWidth = Math.max(minW, newWidth);
        const clampedHeight = Math.max(minH, newHeight);

        if (clampedWidth !== currentRect.width) {
          next.width = clampedWidth;
          next.x = currentRect.x + dx;
        }

        if (clampedHeight !== currentRect.height) {
          next.height = clampedHeight;
        }

        break;
      }

      case 'top-left': {
        const newWidth = currentRect.width - dx;
        const newHeight = currentRect.height - dy;

        const clampedWidth = Math.max(minW, newWidth);
        const clampedHeight = Math.max(minH, newHeight);

        if (clampedWidth !== currentRect.width) {
          next.width = clampedWidth;
          next.x = currentRect.x + dx;
        }

        if (clampedHeight !== currentRect.height) {
          next.height = clampedHeight;
          next.y = currentRect.y + dy;
        }

        break;
      }
    }

    const isWidthShrinking = next.width < currentRect.width;
    const isHeightShrinking = next.height < currentRect.height;

    if (!canShrink) {
      if (isWidthShrinking) {
        next.width = currentRect.width;
        next.x = currentRect.x;
      }

      if (isHeightShrinking) {
        next.height = currentRect.height;
        next.y = currentRect.y;
      }
    }

    next = constrainToBounds(next, options.bounds);

    const current = currentRect;

    const xRect: Rect = {
      ...current,
      x: next.x,
      width: next.width,
    };

    const collisionX = options.obstacles.some(o =>
      isIntersecting(xRect, o)
    );

    const yRect: Rect = {
      ...current,
      y: next.y,
      height: next.height,
    };

    const collisionY = options.obstacles.some(o =>
      isIntersecting(yRect, o)
    );

    const finalRect: Rect = {
      ...current,
      ...(collisionX ? {} : { x: next.x, width: next.width }),
      ...(collisionY ? {} : { y: next.y, height: next.height }),
    };

    if (finalRect.width === current.width) {
      finalRect.x = current.x;
    }

    if (finalRect.height === current.height) {
      finalRect.y = current.y;
    }

    if (
      finalRect.x === current.x &&
      finalRect.y === current.y &&
      finalRect.width === current.width &&
      finalRect.height === current.height
    ) {
      return;
    }

    options.onResize(finalRect);

    currentRect = finalRect;
    startX = e.clientX;
    startY = e.clientY;
  };

  const onPointerUp = () => {
    currentRect = null;
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
  };

  const onPointerDown = (e: PointerEvent) => {
    e.preventDefault();

    startX = e.clientX;
    startY = e.clientY;
    currentRect = { ...options.rect() };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  onBeforeUnmount(() => {
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
  });

  return { onPointerDown };
}
