import { ref, watch, nextTick } from 'vue'
import { MAX_FONT_SIZE, MIN_FONT_SIZE } from '@/consts/sticker.ts'

interface Options {
  element: () => HTMLElement | null;
  text: () => string;
  width: () => number;
  height: () => number;
}

export function useAutoFontSize(options: Options) {
  const fontSize = ref(16);

  const minSize = MIN_FONT_SIZE;
  const maxSize = MAX_FONT_SIZE;

  const updateFontSize = async () => {
    await nextTick();

    const el = options.element();
    if (!el) return;

    let size = maxSize;
    el.style.fontSize = size + 'px';

    while (
      size > minSize &&
      (el.scrollHeight > el.clientHeight ||
        el.scrollWidth > el.clientWidth)
      ) {
      size -= 1
      el.style.fontSize = size + 'px'
    }

    fontSize.value = size;
  }

  watch(
    [options.text, options.width, options.height],
    updateFontSize,
    { immediate: true }
  );

  return { fontSize };
}
