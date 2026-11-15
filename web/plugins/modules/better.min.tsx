import BScroll from '@better-scroll/core'
import MouseWheel from '@better-scroll/mouse-wheel'
import ObserveDOM from '@better-scroll/observe-dom'
import ObserveImage from '@better-scroll/observe-image'
import ScrollBar from '@better-scroll/scroll-bar'
BScroll.use(MouseWheel)
BScroll.use(ObserveDOM)
BScroll.use(ObserveImage)
BScroll.use(ScrollBar)
export { BScroll }
