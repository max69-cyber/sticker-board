<script setup lang="ts">
import { useStickersStore } from '@/stores/stickers.store.ts'
import Sticker from '@/components/Sticker.vue'
import type { Rect } from '@/domain/geometry.ts'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '@/consts/canvas.ts'
import Process from '@/components/Process.vue'
import { processesMock } from '@/consts/processes.ts'

const store = useStickersStore();

const canvasBounds: Rect = {
  x: 0,
  y: 0,
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
};
</script>

<template>
  <div
    :class="$style.canvas"
    :style="{
      width: CANVAS_WIDTH + 'px',
      height: CANVAS_HEIGHT + 'px',
    }"
    @pointerdown="store.setActive(null)"
  >
    <Sticker
      v-for="sticker in store.stickers"
      :key="sticker.id"
      :sticker="sticker"
      :bounds="canvasBounds"
      :obstacles="processesMock"
      :active="store.activeStickerId === sticker.id"
      @update="(payload) => store.updateSticker(sticker.id, payload)"
      @drag-start="() => {
        store.bringToFront(sticker.id);
        store.setActive(sticker.id);
      }"
    />

    <Process
      v-for="(process, index) in processesMock"
      :key="index"
      :process="process"
    />
  </div>
</template>

<style module>
.canvas {
  position: relative;
  border: 1px solid #ccc;
  overflow: hidden;
  background: #f8f8f8;
  border-radius: 20px;
}
</style>
