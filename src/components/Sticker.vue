<script setup lang="ts">
import { type Sticker } from '@/types/sticker.ts'
import { constrainToBounds, isIntersecting, type Rect } from '@/domain/geometry.ts'
import { useDrag } from '@/composables/useDrag.ts'
import { useResize } from '@/composables/useResize.ts'
import { nextTick, ref, watch } from 'vue'
import { useAutoFontSize } from '@/composables/useAutoFontSize.ts'
import { MIN_FONT_SIZE } from '@/consts/sticker.ts'

const props = defineProps<{
  sticker: Sticker
  bounds: Rect
  obstacles: Rect[]
  active: boolean
}>()

const emit = defineEmits<{
  (e: 'update', payload: Partial<Sticker>): void
  (e: 'drag-start'): void
}>()

const textRef = ref<HTMLElement | null>(null)
const isEditing = ref(false)

const onInput = (e: Event) => {
  const target = e.target as HTMLElement
  emit('update', { text: target.innerText })
}

const rect = (): Rect => ({
  x: props.sticker.x,
  y: props.sticker.y,
  width: props.sticker.width,
  height: props.sticker.height,
})

const { fontSize } = useAutoFontSize({
  element: () => textRef.value,
  text: () => props.sticker.text,
  width: () => props.sticker.width,
  height: () => props.sticker.height,
})

const { onPointerDown } = useDrag({
  rect,
  onMove(next) {
    const constrained = constrainToBounds(next, props.bounds)

    const current = rect()

    const xOnly: Rect = {
      ...current,
      x: constrained.x,
    }

    const collisionX = props.obstacles.some((obstacle) => isIntersecting(xOnly, obstacle))

    const yOnly: Rect = {
      ...current,
      y: constrained.y,
    }

    const collisionY = props.obstacles.some((obstacle) => isIntersecting(yOnly, obstacle))

    emit('update', {
      x: collisionX ? current.x : constrained.x,
      y: collisionY ? current.y : constrained.y,
    })
  },
  onStart() {
    emit('drag-start')
  },
})

const resizeTL = useResize({
  rect,
  bounds: props.bounds,
  obstacles: props.obstacles,
  corner: 'top-left',
  canShrink: () => fontSize.value > MIN_FONT_SIZE,
  onResize(next) {
    emit('update', next)
  },
}).onPointerDown

const resizeTR = useResize({
  rect,
  bounds: props.bounds,
  obstacles: props.obstacles,
  corner: 'top-right',
  canShrink: () => fontSize.value > MIN_FONT_SIZE,
  onResize(next) {
    emit('update', next)
  },
}).onPointerDown

const resizeBL = useResize({
  rect,
  bounds: props.bounds,
  obstacles: props.obstacles,
  corner: 'bottom-left',
  canShrink: () => fontSize.value > MIN_FONT_SIZE,
  onResize(next) {
    emit('update', next)
  },
}).onPointerDown

const resizeBR = useResize({
  rect,
  bounds: props.bounds,
  obstacles: props.obstacles,
  corner: 'bottom-right',
  canShrink: () => fontSize.value > MIN_FONT_SIZE,
  onResize(next) {
    emit('update', next)
  },
}).onPointerDown

watch(
  () => props.sticker.text,
  async (value) => {
    if (!textRef.value) return
    if (isEditing.value) return

    await nextTick()
    textRef.value.innerText = value
  },
  { immediate: true },
)
</script>

<template>
  <div
    :class="[
      $style.sticker,
      props.active && $style.stickerActive,
      isEditing && $style.stickerEditing,
    ]"
    :style="{
      left: props.sticker.x + 'px',
      top: props.sticker.y + 'px',
      width: props.sticker.width + 'px',
      height: props.sticker.height + 'px',
      zIndex: props.sticker.zIndex,
    }"
    @pointerdown="(e) => { if (!isEditing) onPointerDown(e) }"
    @click.stop="emit('drag-start')"
  >
    <div
      :class="$style.content"
      ref="textRef"
      :style="{ fontSize: fontSize + 'px' }"
      :contenteditable="isEditing"
      @dblclick.stop="isEditing = true"
      @blur="isEditing = false"
      @input="onInput"
    ></div>

    <template v-if="props.active">
      <div :class="$style.handleTL" @pointerdown.stop.prevent="resizeTL" />
      <div :class="$style.handleTR" @pointerdown.stop.prevent="resizeTR" />
      <div :class="$style.handleBL" @pointerdown.stop.prevent="resizeBL" />
      <div :class="$style.handleBR" @pointerdown.stop.prevent="resizeBR" />
    </template>
  </div>
</template>

<style module>
.sticker {
  position: absolute;
  background: #ffeb3b;
  border: 1px solid #e2d200;
  border-radius: 14px;

  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 8px;
  box-sizing: border-box;
  user-select: none;

  cursor: grab;
  transition: box-shadow 0.15s ease;
}

.sticker:active {
  cursor: grabbing;
}

.stickerActive {
  box-shadow:
    0 0 0 2px #d0d0d0,
    0 4px 10px rgba(0, 0, 0, 0.08);
}

.stickerEditing {
  border: 2px solid #4caf50;
}

.content {
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  text-align: center;
  word-break: break-word;

  outline: none;
}

.content {
  cursor: grab;
}

.sticker:active .content {
  cursor: grabbing;
}

.content[contenteditable='true'] {
  cursor: text;
}

.handleTL,
.handleTR,
.handleBL,
.handleBR {
  position: absolute;
  width: 12px;
  height: 12px;
  background: white;
  border: 1px solid #999;
  border-radius: 50%;
  z-index: 10;
}

.handleTL {
  top: -6px;
  left: -6px;
  cursor: nwse-resize;
}
.handleTR {
  top: -6px;
  right: -6px;
  cursor: nesw-resize;
}
.handleBL {
  bottom: -6px;
  left: -6px;
  cursor: nesw-resize;
}
.handleBR {
  bottom: -6px;
  right: -6px;
  cursor: nwse-resize;
}
</style>
