import { onBeforeUnmount } from 'vue'
import type { Rect } from '@/domain/geometry'

interface UseDragOptions {
  rect: () => Rect;
  onMove: (next: Rect) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

export function useDrag(options: UseDragOptions) {
  let startX = 0;
  let startY = 0;
  let initialRect: Rect | null = null;

  const onPointerMove = (e: PointerEvent) => {
    if (!initialRect) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    const nextRect: Rect = {
      ...initialRect,
      x: initialRect.x + dx,
      y: initialRect.y + dy,
    };

    options.onMove(nextRect);
  };

  const onPointerUp = () => {
    initialRect = null;
    options.onEnd?.();

    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
  };

  const onPointerDown = (e: PointerEvent) => {
    startX = e.clientX;
    startY = e.clientY;
    initialRect = { ...options.rect() };

    options.onStart?.();

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  onBeforeUnmount(() => {
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
  });

  return {
    onPointerDown,
  };
}
