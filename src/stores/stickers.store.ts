import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Sticker } from '@/types/sticker'

let zCounter = 1;

export const useStickersStore = defineStore('stickers', () => {
  const stickers = ref<Sticker[]>([]);
  const activeStickerId = ref<string | null>(null);

  const createSticker = (): void => {
    stickers.value.push({
      id: crypto.randomUUID(),
      text: 'New stickerNew stickerNew stickerNew stickerNew stickerNew stickerNew stickerNew stickerNew stickerNew stickerNew stickerNew stickerNew stickerNew sticker',
      x: 50,
      y: 50,
      width: 200,
      height: 120,
      zIndex: zCounter++,
    })
  };

  const updateSticker = (
    id: string,
    payload: Partial<Sticker>
  ): void => {
    const sticker = stickers.value.find(s => s.id === id);
    if (!sticker) return;
    Object.assign(sticker, payload);
  };

  const bringToFront = (id: string): void => {
    const sticker = stickers.value.find(s => s.id === id);
    if (!sticker) return;
    sticker.zIndex = zCounter++;
  };

  const setActive = (id: string | null) => {
    activeStickerId.value = id;
  };

  return {
    stickers,
    activeStickerId,
    createSticker,
    updateSticker,
    bringToFront,
    setActive,
  };
})
