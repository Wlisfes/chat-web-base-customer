<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useMouse, useStore } from '@/store'

const dots = ref<HTMLCanvasElement>()
const { inverted } = useStore(useMouse)
let stop: (() => void) | undefined

type ThemePaint = {
    dot: string
    dotAlpha: number
    dotBoost: number
}

const darkPaint: ThemePaint = {
    dot: '210, 222, 245',
    dotAlpha: 0.5,
    dotBoost: 0.42
}

const lightPaint: ThemePaint = {
    dot: '62, 80, 124',
    dotAlpha: 0.4,
    dotBoost: 0.22
}

onMounted(() => {
    const dotEl = dots.value
    if (!dotEl) return
    const ctx = dotEl.getContext('2d')
    if (!ctx) return
    const dotCanvas: HTMLCanvasElement = dotEl
    const dotContext: CanvasRenderingContext2D = ctx

    const field: Array<{ x: number; y: number }> = []
    const gap = 16
    const pointer = { x: -9999, y: -9999 }
    const current = { x: pointer.x, y: pointer.y }
    let frame = 0
    let visible = true

    function resize() {
        const width = window.innerWidth
        const height = window.innerHeight
        const scale = Math.min(window.devicePixelRatio || 1, 1.5)
        dotCanvas.width = Math.round(width * scale)
        dotCanvas.height = Math.round(height * scale)
        field.length = 0
        for (let y = gap / 2; y < height; y += gap) {
            for (let x = gap / 2; x < width; x += gap) field.push({ x, y })
        }
    }

    function onMove(event: MouseEvent) {
        pointer.x = event.clientX
        pointer.y = event.clientY
    }

    function onVisibility() {
        visible = document.visibilityState !== 'hidden'
    }

    function draw() {
        if (visible) {
            const paint = inverted.value ? darkPaint : lightPaint
            current.x += (pointer.x - current.x) * 0.2
            current.y += (pointer.y - current.y) * 0.2
            const viewWidth = window.innerWidth
            const viewHeight = window.innerHeight
            dotContext.setTransform(dotCanvas.width / viewWidth, 0, 0, dotCanvas.height / viewHeight, 0, 0)
            dotContext.clearRect(0, 0, viewWidth, viewHeight)
            const radius = 220
            for (const dot of field) {
                const ox = dot.x - current.x
                const oy = dot.y - current.y
                const dist = Math.hypot(ox, oy)
                let x = dot.x
                let y = dot.y
                let alpha = paint.dotAlpha
                let size = 0.8
                if (dist < radius && dist > 0) {
                    const force = (1 - dist / radius) ** 2
                    x += (ox / dist) * force * 36
                    y += (oy / dist) * force * 36
                    alpha += force * paint.dotBoost
                    size += force * 0.65
                }
                dotContext.fillStyle = `rgba(${paint.dot}, ${alpha})`
                dotContext.beginPath()
                dotContext.arc(x, y, size, 0, Math.PI * 2)
                dotContext.fill()
            }
        }
        frame = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)
    document.addEventListener('visibilitychange', onVisibility)
    frame = requestAnimationFrame(draw)
    stop = () => {
        cancelAnimationFrame(frame)
        window.removeEventListener('resize', resize)
        window.removeEventListener('mousemove', onMove)
        document.removeEventListener('visibilitychange', onVisibility)
    }
})

onBeforeUnmount(() => stop?.())
</script>

<template>
    <div class="layout-canvas" :class="{ 'is-dark': inverted }">
        <canvas ref="dots" class="dots"></canvas>
    </div>
</template>

<style lang="scss" scoped>
.layout-canvas {
    position: fixed;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    pointer-events: none;
    background: #f7f8fc;
    transition: background 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.layout-canvas.is-dark {
    background: #05060a;
}

.dots {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
}
</style>