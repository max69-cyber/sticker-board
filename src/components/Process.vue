<script setup lang="ts">
import type { Rect } from '@/domain/geometry.ts'

defineProps<{
  process: Rect
}>();
</script>

<template>
  <div
    :class="$style.process"
    :style="{
      left: process.x + 'px',
      top: process.y + 'px',
      width: process.width + 'px',
      height: process.height + 'px',
    }"
  />
</template>

<style module>
.process {
  position: absolute;

  background: #e6e6e6;
  border: 1px solid #d0d0d0;
  border-radius: 16px;

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.6),
    0 2px 6px rgba(0, 0, 0, 0.05);

  pointer-events: none;
}
</style>
