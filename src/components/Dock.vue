<script setup lang="ts">
import { useStickersStore } from '@/stores/stickers.store.ts'

const store = useStickersStore();
</script>

<template>
  <div :class="$style.dockWrapper">
    <div :class="$style.dock">
      <button
        :class="$style.toolButton"
        @click="store.createSticker"
      >
        📋
      </button>
    </div>
  </div>
</template>

<style module>
.dockWrapper {
  position: fixed;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
}

.dock {
  pointer-events: all;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;

  background: white;
  border-radius: 20px;
  border: 1px solid #ececec;
}

.toolButton {
  min-width: 44px;
  height: 44px;
  padding: 0 14px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #111;
  color: white;
  border: none;
  border-radius: 12px;

  cursor: pointer;
  font-size: 16px;
  transition: all 0.15s ease;
}

.toolButton:hover {
  background: #333;
  transform: translateY(-1px);
}

.toolButton:active {
  transform: translateY(0);
}
</style>
