<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const glow = ref<HTMLCanvasElement>()
const dots = ref<HTMLCanvasElement>()
let stop: (() => void) | undefined

type Ribbon = {
    base: number
    amp: number
    freq: number
    phase: number
    hue: number
    light: number
    alpha: number
    width: number
    speed: number
    flow: number
    lift: number
}

const ribbons: Ribbon[] = [
    { base: 0.56, amp: 0.07, freq: 1.15, phase: 0.2, hue: 268, light: 34, alpha: 0.16, width: 0.15, speed: 0.55, flow: 0.045, lift: 0.1 },
    { base: 0.66, amp: 0.08, freq: 0.9, phase: 1.7, hue: 226, light: 36, alpha: 0.13, width: 0.12, speed: 0.42, flow: -0.034, lift: 0.08 },
    { base: 0.76, amp: 0.06, freq: 1.35, phase: 2.8, hue: 188, light: 38, alpha: 0.11, width: 0.1, speed: 0.62, flow: 0.056, lift: 0.06 },
    { base: 0.62, amp: 0.085, freq: 0.72, phase: 4.1, hue: 292, light: 32, alpha: 0.1, width: 0.09, speed: 0.36, flow: -0.048, lift: 0.12 },
    { base: 0.84, amp: 0.05, freq: 1.05, phase: 0.9, hue: 168, light: 34, alpha: 0.08, width: 0.08, speed: 0.5, flow: 0.028, lift: 0.04 }
]

onMounted(() => {
    const glowEl = glow.value
    const dotEl = dots.value
    if (!glowEl || !dotEl) return
    const glowCtx = glowEl.getContext('2d')
    const ctx = dotEl.getContext('2d')
    if (!glowCtx || !ctx) return

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
        return height * ribbon.base
            + Math.sin(travel * Math.PI * 2 * ribbon.freq + ribbon.phase + time * ribbon.speed) * height * ribbon.amp
            + Math.sin(travel * Math.PI * 2 * ribbon.freq * 0.37 + ribbon.phase * 1.6 - time * ribbon.speed * 0.45) * height * ribbon.amp * 0.62
            - (1 - edge) * height * ribbon.lift
    }

    function drawRibbon(ribbon: Ribbon, time: number, width: number, height: number) {
        glowCtx.lineCap = 'round'
        glowCtx.lineJoin = 'round'
        const step = 36
        for (let x = -step; x <= width + step; x += step) {
            const y = sample(x, ribbon, time, width, height)
            const next = sample(x + step, ribbon, time, width, height)
            const mid = (x + step / 2) / width - time * ribbon.flow
            const pulse = 0.62 + 0.38 * Math.sin(mid * Math.PI * 2 * 1.6 + ribbon.phase)
            glowCtx.beginPath()
            glowCtx.moveTo(x, y)
            glowCtx.quadraticCurveTo(x, y, x + step / 2, (y + next) / 2)
            glowCtx.lineTo(x + step, next)
            glowCtx.strokeStyle = `hsla(${ribbon.hue + pulse * 8}, 48%, ${ribbon.light + pulse * 3}%, ${ribbon.alpha * pulse})`
            glowCtx.lineWidth = height * ribbon.width * (0.78 + pulse * 0.35)
            glowCtx.stroke()
        }
    }

    function resize() {
        const width = window.innerWidth
        const height = window.innerHeight
        const scale = Math.min(window.devicePixelRatio || 1, 1.5)
        glowEl.width = Math.max(2, Math.round(width * 0.7))
        glowEl.height = Math.max(2, Math.round(height * 0.7))
        dotEl.width = Math.round(width * scale)
        dotEl.height = Math.round(height * scale)
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
            const width = glowEl.width
            const height = glowEl.height
            const time = reduced ? 1.6 : now / 1000
            glowCtx.clearRect(0, 0, width, height)
            ribbons.forEach(ribbon => drawRibbon(ribbon, time, width, height))

            current.x += (pointer.x - current.x) * 0.2
            current.y += (pointer.y - current.y) * 0.2
            const viewWidth = window.innerWidth
            const viewHeight = window.innerHeight
            ctx.setTransform(dotEl.width / viewWidth, 0, 0, dotEl.height / viewHeight, 0, 0)
            ctx.clearRect(0, 0, viewWidth, viewHeight)
            const radius = 220
            for (const dot of field) {
                const ox = dot.x - current.x
                const oy = dot.y - current.y
                const dist = Math.hypot(ox, oy)
                let x = dot.x
                let y = dot.y
                let alpha = 0.32
                let size = 0.8
                if (dist < radius && dist > 0) {
                    const force = (1 - dist / radius) ** 2
                    x += (ox / dist) * force * 36
                    y += (oy / dist) * force * 36
                    alpha += force * 0.45
                    size += force * 0.65
                }
                ctx.fillStyle = `rgba(156, 176, 214, ${alpha})`
                ctx.beginPath()
                ctx.arc(x, y, size, 0, Math.PI * 2)
                ctx.fill()
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
    <div class="neon-bg">
        <canvas ref="glow" class="glow"></canvas>
        <canvas ref="dots" class="dots"></canvas>
    </div>
</template>

<style lang="scss" scoped>
.neon-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    pointer-events: none;
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

