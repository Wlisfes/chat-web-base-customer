<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useMouse, useStore } from '@/store'

const glow = ref<HTMLCanvasElement>()
const dots = ref<HTMLCanvasElement>()
const { inverted } = useStore(useMouse)
let stop: (() => void) | undefined

type Ribbon = {
    base: number
    amp: number
    freq: number
    phase: number
    hue: number
    width: number
    speed: number
    flow: number
    lift: number
}

type ThemePaint = {
    sat: number
    light: number[]
    alpha: number[]
    pulseLight: number
    pulseHue: number
    dot: string
    dotAlpha: number
    dotBoost: number
}

const ribbons: Ribbon[] = [
    { base: 0.56, amp: 0.07, freq: 1.15, phase: 0.2, hue: 268, width: 0.15, speed: 0.55, flow: 0.045, lift: 0.1 },
    { base: 0.66, amp: 0.08, freq: 0.9, phase: 1.7, hue: 226, width: 0.12, speed: 0.42, flow: -0.034, lift: 0.08 },
    { base: 0.76, amp: 0.06, freq: 1.35, phase: 2.8, hue: 188, width: 0.1, speed: 0.62, flow: 0.056, lift: 0.06 },
    { base: 0.62, amp: 0.085, freq: 0.72, phase: 4.1, hue: 292, width: 0.09, speed: 0.36, flow: -0.048, lift: 0.12 },
    { base: 0.84, amp: 0.05, freq: 1.05, phase: 0.9, hue: 168, width: 0.08, speed: 0.5, flow: 0.028, lift: 0.04 }
]

const darkPaint: ThemePaint = {
    sat: 48,
    light: [34, 36, 38, 32, 34],
    alpha: [0.16, 0.13, 0.11, 0.1, 0.08],
    pulseLight: 3,
    pulseHue: 8,
    dot: '156, 176, 214',
    dotAlpha: 0.32,
    dotBoost: 0.45
}

const lightPaint: ThemePaint = {
    sat: 54,
    light: [40, 42, 44, 38, 41],
    alpha: [0.3, 0.26, 0.22, 0.2, 0.16],
    pulseLight: 2,
    pulseHue: 6,
    dot: '48, 64, 108',
    dotAlpha: 0.32,
    dotBoost: 0.22
}

onMounted(() => {
    const glowEl = glow.value
    const dotEl = dots.value
    if (!glowEl || !dotEl) return
    const glowCtx = glowEl.getContext('2d')
    const ctx = dotEl.getContext('2d')
    if (!glowCtx || !ctx) return
    const glowCanvas: HTMLCanvasElement = glowEl
    const dotCanvas: HTMLCanvasElement = dotEl
    const glowContext: CanvasRenderingContext2D = glowCtx
    const dotContext: CanvasRenderingContext2D = ctx

    const field: Array<{ x: number; y: number }> = []
    const gap = 16
    const pointer = { x: -9999, y: -9999 }
    const current = { x: pointer.x, y: pointer.y }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    let visible = true

    function sample(x: number, ribbon: Ribbon, time: number, width: number, height: number) {
        const nx = x / width
        const travel = nx - time * ribbon.flow
        const edge = Math.sin(Math.min(1, Math.max(0, nx)) * Math.PI)
        return (
            height * ribbon.base +
            Math.sin(travel * Math.PI * 2 * ribbon.freq + ribbon.phase + time * ribbon.speed) * height * ribbon.amp +
            Math.sin(travel * Math.PI * 2 * ribbon.freq * 0.37 + ribbon.phase * 1.6 - time * ribbon.speed * 0.45) *
                height *
                ribbon.amp *
                0.62 -
            (1 - edge) * height * ribbon.lift
        )
    }

    function drawRibbon(ribbon: Ribbon, index: number, paint: ThemePaint, time: number, width: number, height: number) {
        glowContext.lineCap = 'round'
        glowContext.lineJoin = 'round'
        const step = 36
        const light = paint.light[index]
        const alpha = paint.alpha[index]
        for (let x = -step; x <= width + step; x += step) {
            const y = sample(x, ribbon, time, width, height)
            const next = sample(x + step, ribbon, time, width, height)
            const mid = (x + step / 2) / width - time * ribbon.flow
            const pulse = 0.62 + 0.38 * Math.sin(mid * Math.PI * 2 * 1.6 + ribbon.phase)
            glowContext.beginPath()
            glowContext.moveTo(x, y)
            glowContext.quadraticCurveTo(x, y, x + step / 2, (y + next) / 2)
            glowContext.lineTo(x + step, next)
            glowContext.strokeStyle = `hsla(${ribbon.hue + pulse * paint.pulseHue}, ${paint.sat}%, ${light + pulse * paint.pulseLight}%, ${alpha * pulse})`
            glowContext.lineWidth = height * ribbon.width * (0.78 + pulse * 0.35)
            glowContext.stroke()
        }
    }

    function resize() {
        const width = window.innerWidth
        const height = window.innerHeight
        const scale = Math.min(window.devicePixelRatio || 1, 1.5)
        glowCanvas.width = Math.max(2, Math.round(width * 0.7))
        glowCanvas.height = Math.max(2, Math.round(height * 0.7))
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

    function draw(now: number) {
        if (visible) {
            const paint = inverted.value ? darkPaint : lightPaint
            const width = glowCanvas.width
            const height = glowCanvas.height
            const time = reduced ? 1.6 : now / 1000
            glowContext.clearRect(0, 0, width, height)
            ribbons.forEach((ribbon, index) => drawRibbon(ribbon, index, paint, time, width, height))

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
        <canvas ref="glow" class="glow"></canvas>
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

.glow,
.dots {
    position: absolute;
    width: 100%;
    height: 100%;
}

.glow {
    inset: -8%;
    width: 116%;
    height: 116%;
    filter: blur(1.45vw);
}

.dots {
    inset: 0;
}
</style>
