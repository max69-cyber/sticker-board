<script setup lang="ts">
import Canvas from '@/components/Canvas.vue'
import Dock from '@/components/Dock.vue'
</script>

<template>
  <div :class="$style.page">
    <div :class="$style.workspace">
      <Canvas />
    </div>

    <Dock />
  </div>
</template>

<style module>
.page {
  min-height: 100vh;
  background: #f2f3f5;
  display: flex;
  flex-direction: column;
}

.workspace {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}
</style>
