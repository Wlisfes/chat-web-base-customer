import { onBeforeUnmount, onMounted, ref } from 'vue'
import AOS from 'aos-observer'

const NARROW_SCREEN = 1080

function readScrollTop(event?: Event) {
    const target = event?.target
    if (target instanceof HTMLElement) return target.scrollTop
    return 0
}

function currentScrollTop() {
    const scroller = document.querySelector('.n-scrollbar-container')
    return scroller instanceof HTMLElement ? scroller.scrollTop : 0
}

export function useAosObserver() {
    const element = ref<Array<AOS.AosElement>>([])
    let frame = 0

    function fetchInitialize() {
        element.value =
            AOS.init({
                scroll: false,
                once: true,
                offset: 80,
                duration: 700,
                easing: 'ease-out-cubic',
                disable: () => window.innerWidth < NARROW_SCREEN
            }) ?? []
        cancelAnimationFrame(frame)
        frame = requestAnimationFrame(() => {
            AOS.refresh(true)
            AOS.handleScroll(element.value, currentScrollTop())
        })
    }

    /**内部滚动条不走 window，位置要用容器的 scrollTop 计算。**/
    function fetchScrollbar(event?: Event) {
        if (!element.value.length) fetchInitialize()
        AOS.handleScroll(element.value, readScrollTop(event))
    }

    onMounted(fetchInitialize)
    onBeforeUnmount(() => cancelAnimationFrame(frame))

    return { AOS, element, fetchScrollbar, fetchInitialize }
}
