<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const canvas = ref<HTMLCanvasElement>()
let stop: (() => void) | undefined

type Section = {
    x1: number
    y1: number
    x2: number
    y2: number
    x3: number
    y3: number
    color: number
    delay: number
    phase: number
    alpha: number
    dir: 1 | -1
}

onMounted(() => {
    const el = canvas.value
    if (!el) return
    const ctx = el.getContext('2d')
    if (!ctx) return

    const dots: Array<{ x: number; y: number }> = []
    const gap = 16
    const mouse = { x: -9999, y: -9999 }
    const current = { x: mouse.x, y: mouse.y }
    let ribbons: Section[][] = []
    let frame = 0

    function spawnRibbon() {
        const dir: 1 | -1 = Math.random() > 0.5 ? 1 : -1
        let x = dir === 1 ? -180 : el.width + 180
        let y = el.height * (0.25 + Math.random() * 0.5)
        let color = Math.random() * 360
        let delay = 0
        const ribbon: Section[] = []
        const end = dir === 1 ? el.width + 220 : -220
        while ((dir === 1 && x < end) || (dir === -1 && x > end)) {
            const nx = x + dir * (90 + Math.random() * 120)
            const ny = Math.max(40, Math.min(el.height - 40, y + (Math.random() - 0.5) * el.height * 0.28))
            ribbon.push({
                x1: x,
                y1: y - 16,
                x2: x,
                y2: y + 16,
                x3: nx,
                y3: ny,
                color,
                delay,
                phase: 0,
                alpha: 0,
                dir
            })
            x = nx
            y = ny
            delay += 4
            color = (color + 7) % 360
        }
        return ribbon
    }

    function resize() {
        el.width = window.innerWidth
        el.height = window.innerHeight
        dots.length = 0
        for (let y = gap / 2; y < el.height; y += gap) {
            for (let x = gap / 2; x < el.width; x += gap) dots.push({ x, y })
        }
        ribbons = [spawnRibbon(), spawnRibbon(), spawnRibbon()]
    }

    function drawRibbons() {
        ctx.globalCompositeOperation = 'lighter'
        ribbons.forEach((ribbon, index) => {
            let done = 0
            ribbon.forEach(section => {
                if (section.phase >= 1 && section.alpha <= 0) {
                    done += 1
                    return
                }
                if (section.delay <= 0) {
                    section.phase += 0.012
                    section.alpha = Math.sin(Math.min(section.phase, 1) * Math.PI)
                    section.x1 += section.dir * 0.35
                    section.x2 += section.dir * 0.35
                    section.x3 += section.dir * 0.35
                } else {
                    section.delay -= 1
                }
                if (section.alpha <= 0) return
                ctx.beginPath()
                ctx.moveTo(section.x1, section.y1)
                ctx.lineTo(section.x2, section.y2)
                ctx.lineTo(section.x3, section.y3)
                ctx.closePath()
                ctx.fillStyle = `hsla(${section.color}, 85%, 62%, ${section.alpha * 0.55})`
                ctx.fill()
            })
            if (done >= ribbon.length) ribbons[index] = spawnRibbon()
        })
        ctx.globalCompositeOperation = 'source-over'
    }

    function onMove(event: MouseEvent) {
        mouse.x = event.clientX
        mouse.y = event.clientY
    }

    function draw() {
        current.x += (mouse.x - current.x) * 0.2
        current.y += (mouse.y - current.y) * 0.2
        ctx.clearRect(0, 0, el.width, el.height)
        drawRibbons()
        const radius = 220
        for (const dot of dots) {
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
        frame = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)
    frame = requestAnimationFrame(draw)
    stop = () => {
        cancelAnimationFrame(frame)
        window.removeEventListener('resize', resize)
        window.removeEventListener('mousemove', onMove)
    }
})

onBeforeUnmount(() => stop?.())
</script>

<template>
    <div class="neon-bg">
        <canvas ref="canvas"></canvas>
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

canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
}
</style>
