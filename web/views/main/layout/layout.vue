<script lang="tsx">
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
    name: 'MainLayout',
    setup() {
        const route = useRoute()
        const isRegister = computed(() => route.path.startsWith('/main/register'))

        return () => (
            <n-element class="auth-layout">
                <section class="auth-visual">
                    <router-link to="/" class="auth-brand">
                        <common-element-wrapper name="nest-logo" color="#8eb6ff" size={36}></common-element-wrapper>
                        <span>ChatBook</span>
                    </router-link>
                    <div class="auth-visual-copy">
                        <p>WHY CHOOSE US</p>
                        <h1>把短信发送、路由和回执收在同一张网上</h1>
                        <ul>
                            <li>覆盖 190+ 国家 / 地区</li>
                            <li>800+ 运营商网络</li>
                            <li>独立后台，实时回执</li>
                        </ul>
                        <p class="auth-visual-note">中间的光是调度核心。外圈的地球、月球、木星和土星是接入节点：短信从核心发出，落到当地运营商，回执再沿原路返回。</p>
                        <ul class="auth-legend">
                            <li><i class="auth-legend-mark auth-legend-earth"></i><span>地球，客户从这里接入</span></li>
                            <li><i class="auth-legend-mark auth-legend-moon"></i><span>月球，回执从这里返回</span></li>
                            <li><i class="auth-legend-mark auth-legend-jupiter"></i><span>木星，当地运营商节点</span></li>
                            <li><i class="auth-legend-mark auth-legend-saturn"></i><span>土星，路由绕开拥堵，回执沿环回来</span></li>
                        </ul>
                    </div>
                    <div class="auth-stage" aria-hidden="true">
                        <div class="auth-stars"></div>
                        <div class="auth-system">
                            <div class="auth-nebula"></div>
                            <div class="auth-halo"></div>
                            <div class="auth-disk"></div>
                            <div class="auth-core">
                                <span class="auth-corona"></span>
                                <span class="auth-sun"></span>
                            </div>
                            <div class="auth-orbit auth-orbit-a">
                                <span class="auth-ringline"></span>
                                <span class="auth-glint"></span>
                                <span class="auth-trail"></span>
                                <span class="auth-moon auth-moon-moon"></span>
                            </div>
                            <div class="auth-orbit auth-orbit-b">
                                <span class="auth-ringline"></span>
                                <span class="auth-glint"></span>
                                <span class="auth-moon auth-moon-earth"></span>
                            </div>
                            <div class="auth-belt"></div>
                            <div class="auth-orbit auth-orbit-c">
                                <span class="auth-ringline"></span>
                                <span class="auth-glint"></span>
                                <span class="auth-moon auth-moon-saturn"></span>
                            </div>
                            <div class="auth-orbit auth-orbit-d">
                                <span class="auth-ringline"></span>
                                <span class="auth-moon auth-moon-jupiter"></span>
                                <span class="auth-anchor auth-anchor-mars"><span class="auth-moon auth-moon-mars"></span></span>
                            </div>
                        </div>
                    </div>
                </section>
                <section class="auth-panel">
                    <div class="auth-card">
                        <router-link to="/" class="auth-brand auth-brand-mobile">
                            <common-element-wrapper name="nest-logo" color="#8eb6ff" size={32}></common-element-wrapper>
                            <span>ChatBook</span>
                        </router-link>
                        <div class="auth-heading">
                            <h2>{isRegister.value ? '创建客户账号' : '欢迎回来'}</h2>
                            <p>{isRegister.value ? '注册后即可使用邮箱登录客户门户。' : '使用邮箱登录 ChatBook 客户门户。'}</p>
                        </div>
                        <router-view></router-view>
                    </div>
                </section>
            </n-element>
        )
    }
})
</script>

<style lang="scss" scoped>
.auth-layout {
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(420px, 0.8fr);
    height: 100%;
    min-height: 100%;
    background: #0b1220;
    color: #eef3ff;
}

.auth-visual {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    height: 100%;
    min-height: 0;
    overflow: hidden;
    padding: 36px 56px 24px;
    background:
        radial-gradient(circle at 48% 64%, rgba(83, 109, 254, 0.28), transparent 26%),
        radial-gradient(circle at 18% 16%, rgba(83, 109, 254, 0.28), transparent 24%),
        radial-gradient(circle at 78% 78%, rgba(88, 214, 255, 0.1), transparent 22%),
        linear-gradient(165deg, #121a33 0%, #0b1220 62%, #10182c 100%);
}

.auth-visual::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: linear-gradient(rgba(142, 182, 255, 0.08) 1px, transparent 1px),
        linear-gradient(90deg, rgba(142, 182, 255, 0.08) 1px, transparent 1px);
    background-size: 28px 28px;
    mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.5), transparent 46%);
    pointer-events: none;
}

.auth-brand,
.auth-visual-copy {
    position: relative;
    z-index: 1;
}

.auth-brand {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: #f5f7ff;
    font-size: 22px;
    font-weight: 650;
    text-decoration: none;
}

.auth-brand-mobile {
    display: none;
    margin-bottom: 28px;
}

.auth-visual-copy {
    max-width: 520px;
    margin-top: 36px;
}

.auth-visual-copy p {
    margin: 0 0 12px;
    color: #8eb6ff;
    letter-spacing: 0.16em;
    font-size: 13px;
}

.auth-visual-copy h1 {
    margin: 0;
    font-size: 40px;
    line-height: 1.25;
}

.auth-visual-copy ul {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin: 24px 0 0;
    padding: 0;
    list-style: none;
}

.auth-visual-copy li {
    padding: 8px 12px;
    border: 1px solid rgba(142, 182, 255, 0.24);
    border-radius: 999px;
    background: rgba(83, 109, 254, 0.14);
    color: #d7e4ff;
    font-size: 13px;
}


.auth-visual-copy .auth-visual-note {
    max-width: 540px;
    margin: 18px 0 0;
    color: rgba(215, 228, 255, 0.78);
    letter-spacing: 0;
    font-size: 14px;
    line-height: 1.7;
}

.auth-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 16px;
    max-width: 560px;
    margin: 14px 0 0;
    padding: 0;
    list-style: none;
}

.auth-visual-copy .auth-legend li {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 0;
    border: 0;
    border-radius: 0;
    background: transparent;
    color: #d7e4ff;
    font-size: 13px;
    line-height: 1.4;
}

.auth-legend-mark {
    flex: none;
    width: 18px;
    height: 18px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
}

.auth-legend-earth { background-image: url('@/assets/images/planets/earth.png'); }
.auth-legend-moon { background-image: url('@/assets/images/planets/moon.png'); }
.auth-legend-jupiter { background-image: url('@/assets/images/planets/jupiter.png'); }
.auth-legend-saturn {
    width: 30px;
    background-image: url('@/assets/images/planets/saturn.png');
}

.auth-stage {
    position: relative;
    z-index: 1;
    flex: 1;
    min-height: 0;
    container-type: size;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 6px;
  }
  .auth-stars, .auth-stars::before, .auth-stars::after {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-repeat: no-repeat;
  }
  .auth-stars {
    background-image:
      radial-gradient(1px 1px at 7% 18%, rgba(255,255,255,.85) 50%, transparent 52%),
      radial-gradient(1.5px 1.5px at 16% 34%, rgba(210,226,255,.7) 50%, transparent 52%),
      radial-gradient(1px 1px at 24% 12%, rgba(255,255,255,.45) 50%, transparent 52%),
      radial-gradient(2px 2px at 31% 46%, rgba(255,255,255,.9) 50%, transparent 52%),
      radial-gradient(1px 1px at 38% 22%, rgba(255,255,255,.4) 50%, transparent 52%),
      radial-gradient(1px 1px at 44% 58%, rgba(190,214,255,.7) 50%, transparent 52%),
      radial-gradient(1.5px 1.5px at 53% 16%, rgba(255,255,255,.75) 50%, transparent 52%),
      radial-gradient(1px 1px at 61% 38%, rgba(255,255,255,.5) 50%, transparent 52%),
      radial-gradient(2px 2px at 69% 24%, rgba(232,242,255,.95) 50%, transparent 52%),
      radial-gradient(1px 1px at 76% 48%, rgba(255,255,255,.55) 50%, transparent 52%),
      radial-gradient(1px 1px at 84% 18%, rgba(180,210,255,.6) 50%, transparent 52%),
      radial-gradient(1.5px 1.5px at 91% 36%, rgba(255,255,255,.8) 50%, transparent 52%),
      radial-gradient(1px 1px at 12% 62%, rgba(255,255,255,.4) 50%, transparent 52%),
      radial-gradient(1px 1px at 22% 74%, rgba(255,255,255,.65) 50%, transparent 52%),
      radial-gradient(2px 2px at 48% 78%, rgba(255,255,255,.8) 50%, transparent 52%),
      radial-gradient(1px 1px at 66% 68%, rgba(210,230,255,.55) 50%, transparent 52%),
      radial-gradient(1px 1px at 80% 72%, rgba(255,255,255,.45) 50%, transparent 52%),
      radial-gradient(1.5px 1.5px at 88% 84%, rgba(255,255,255,.7) 50%, transparent 52%);
    animation: auth-drift 90s linear infinite;
  }
  .auth-stars::before {
    content: "";
    background-image:
      radial-gradient(circle at 18% 42%, rgba(255,255,255,.95) 0 1.2px, rgba(142,182,255,.35) 2px, transparent 7px),
      radial-gradient(circle at 73% 30%, rgba(255,255,255,.9) 0 1.4px, rgba(88,214,255,.28) 2.4px, transparent 8px),
      radial-gradient(circle at 40% 70%, rgba(255,255,255,.8) 0 1px, rgba(142,182,255,.25) 2px, transparent 6px),
      radial-gradient(circle at 86% 62%, rgba(255,255,255,.75) 0 1.1px, rgba(180,210,255,.2) 2px, transparent 7px),
      radial-gradient(1px 1px at 9% 48%, rgba(255,255,255,.55) 50%, transparent 52%),
      radial-gradient(1px 1px at 28% 58%, rgba(255,255,255,.35) 50%, transparent 52%),
      radial-gradient(1px 1px at 57% 52%, rgba(255,255,255,.4) 50%, transparent 52%),
      radial-gradient(1px 1px at 94% 54%, rgba(255,255,255,.5) 50%, transparent 52%);
    animation: auth-twinkle 5.5s ease-in-out infinite;
  }
  .auth-system {
    position: relative;
    width: min(520px, 74%);
    max-height: calc(100vh - 520px);
    aspect-ratio: 1;
    container-type: size;
  }
  .auth-nebula {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background:
      radial-gradient(circle at 46% 48%, rgba(98,126,255,.34), transparent 46%),
      radial-gradient(circle at 62% 58%, rgba(88,214,255,.12), transparent 40%);
    filter: blur(18px);
    pointer-events: none;
  }
  .auth-halo {
    position: absolute;
    inset: 2%;
    border-radius: 50%;
    background: conic-gradient(from 24deg, transparent 0 16%, rgba(142,182,255,.22) 30%, transparent 46%, rgba(88,214,255,.14) 68%, transparent 84%);
    filter: blur(16px);
    animation: auth-spin 54s linear infinite;
    -webkit-mask: radial-gradient(circle, transparent 58%, #000 70% 76%, transparent 86%);
    mask: radial-gradient(circle, transparent 58%, #000 70% 76%, transparent 86%);
  }
  .auth-core {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 18cqi;
    height: 18cqi;
    margin: -9cqi 0 0 -9cqi;
  }
  .auth-corona, .auth-sun {
    position: absolute;
    border-radius: 50%;
  }
  .auth-corona {
    inset: -18%;
    background: radial-gradient(circle, rgba(255,255,255,.95) 0%, rgba(176,198,255,.72) 18%, rgba(83,109,254,.28) 46%, transparent 70%);
    box-shadow:
      0 0 24px 8px rgba(142,182,255,.5),
      0 0 70px 22px rgba(83,109,254,.32),
      0 0 120px 36px rgba(88,214,255,.14);
    animation: auth-breathe 5.2s ease-in-out infinite;
  }
  .auth-sun {
    inset: 18%;
    background: radial-gradient(circle at 34% 32%, #fff 0%, #e7efff 22%, #8eafff 58%, #3d5bff 100%);
    box-shadow: inset -8px -6px 12px rgba(18,28,72,.35);
  }
  .auth-disk {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 28cqi;
    height: 28cqi;
    margin: -14cqi 0 0 -14cqi;
    border-radius: 50%;
    background: conic-gradient(from 70deg, transparent 0 8%, rgba(210,226,255,.15) 16%, rgba(255,255,255,.7) 24%, rgba(120,210,255,.2) 34%, transparent 46%, transparent 70%, rgba(142,182,255,.4) 82%, transparent 92%);
    -webkit-mask: radial-gradient(circle, transparent 58%, #000 64% 68%, transparent 74%);
    mask: radial-gradient(circle, transparent 58%, #000 64% 68%, transparent 74%);
    animation: auth-spin 26s linear infinite;
  }
  .auth-orbit {
    position: absolute;
    left: 0; right: 0; top: 0; bottom: 0;
    margin: auto;
    border-radius: 50%;
    animation: auth-spin var(--dur) linear infinite;
    animation-delay: var(--delay, 0s);
  }
  .auth-orbit-a { --dur: 22s; --delay: -6s; --from: 10deg; width: 32%; height: 32%; }
  .auth-orbit-b { --dur: 34s; --delay: -15s; --from: 140deg; width: 50%; height: 50%; animation-direction: reverse; }
  .auth-orbit-c { --dur: 48s; --delay: -9s; --from: 200deg; width: 70%; height: 70%; }
  .auth-orbit-d { --dur: 68s; --delay: -24s; --from: 80deg; width: 86%; height: 86%; animation-direction: reverse; }
  .auth-orbit-a .auth-ringline { opacity: .95; }
  .auth-orbit-b .auth-ringline { opacity: .7; }
  .auth-orbit-c .auth-ringline { opacity: .48; }
  .auth-orbit-d .auth-ringline { opacity: .32; }
  .auth-ringline {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: conic-gradient(
      from var(--from, 20deg),
      rgba(176,202,255,.04) 0%,
      rgba(176,202,255,.22) 16%,
      rgba(236,244,255,.72) 27%,
      rgba(176,202,255,.16) 40%,
      rgba(176,202,255,.05) 58%,
      rgba(120,200,255,.28) 76%,
      rgba(176,202,255,.05) 100%
    );
    -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 1.6px), #000 calc(100% - 1px));
    mask: radial-gradient(farthest-side, transparent calc(100% - 1.6px), #000 calc(100% - 1px));
  }
  .auth-glint {
    position: absolute;
    top: 0;
    left: 50%;
    width: 22%;
    height: 6px;
    margin: -3px 0 0 -11%;
    border-radius: 999px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.95), transparent);
    filter: blur(1.2px);
    box-shadow: 0 0 12px rgba(186,214,255,.85);
  }
  .auth-trail {
    position: absolute;
    top: 0;
    left: 50%;
    width: 24%;
    height: 3px;
    margin: -1.5px 0 0 -24%;
    border-radius: 999px;
    background: linear-gradient(90deg, transparent, rgba(120,236,255,.2) 45%, rgba(210,250,255,.9));
    filter: blur(.8px);
  }
  .auth-moon {
    position: absolute;
    display: block;
    left: 50%;
    top: 0;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    filter: drop-shadow(0 0 10px rgba(150, 184, 255, 0.35));
    animation: auth-spin var(--dur) linear infinite reverse;
    animation-delay: var(--delay, 0s);
  }
  .auth-orbit-b .auth-moon,
  .auth-orbit-d .auth-moon { animation-direction: normal; }
  .auth-moon-moon {
    width: 3.2cqi;
    height: 3.2cqi;
    margin: -1.6cqi 0 0 -1.6cqi;
    background-image: url('@/assets/images/planets/moon.png');
  }
  .auth-moon-earth {
    width: 7.4cqi;
    height: 7.4cqi;
    margin: -3.7cqi 0 0 -3.7cqi;
    background-image: url('@/assets/images/planets/earth.png');
  }
  .auth-moon-saturn {
    width: 16cqi;
    height: 6cqi;
    margin: -3cqi 0 0 -8cqi;
    background-image: url('@/assets/images/planets/saturn.png');
    filter: drop-shadow(0 0 12px rgba(214, 196, 150, 0.32));
  }
  .auth-moon-jupiter {
    width: 5.4cqi;
    height: 5.4cqi;
    margin: -2.7cqi 0 0 -2.7cqi;
    background-image: url('@/assets/images/planets/jupiter.png');
  }
  .auth-moon-mars {
    width: 3.8cqi;
    height: 3.8cqi;
    margin: -1.9cqi 0 0 -1.9cqi;
    background-image: url('@/assets/images/planets/mars.png');
  }
    .auth-anchor { position: absolute; inset: 0; }
  .auth-anchor-mars { transform: rotate(128deg); }
  .auth-belt {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 59%;
    height: 59%;
    margin: -29.5% 0 0 -29.5%;
    border-radius: 50%;
    background: repeating-conic-gradient(rgba(220,232,255,.8) 0 .35deg, transparent .35deg 5.6deg);
    -webkit-mask: radial-gradient(circle, transparent 93.5%, #000 95% 96.6%, transparent 98%);
    mask: radial-gradient(circle, transparent 93.5%, #000 95% 96.6%, transparent 98%);
    opacity: .42;
    animation: auth-spin 120s linear infinite;
  }
  @keyframes auth-spin { to { transform: rotate(360deg); } }
  @keyframes auth-breathe {
    50% { transform: scale(1.07); opacity: .82; }
  }
  @keyframes auth-drift {
    from { transform: translate3d(0,0,0); }
    to { transform: translate3d(-28px,-16px,0); }
  }
  @keyframes auth-twinkle {
    50% { opacity: .45; }
  }

@media (prefers-reduced-motion: reduce) {
    .auth-orbit,
    .auth-moon,
    .auth-halo,
    .auth-disk,
    .auth-belt,
    .auth-stars,
    .auth-stars::before,
    .auth-corona,
    .auth-suborbit,
    .auth-submoon {
        animation: none;
    }
}

.auth-panel {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px 28px;
    background: #10182b;
}

.auth-card {
    width: min(100%, 420px);
}

.auth-heading h2 {
    margin: 0 0 8px;
    font-size: 28px;
    line-height: 1.3;
}

.auth-heading p {
    margin: 0 0 28px;
    color: rgba(238, 243, 255, 0.68);
    line-height: 1.6;
}

@media (max-width: 980px) {
    .auth-layout {
        grid-template-columns: 1fr;
    }

    .auth-visual {
        display: none;
    }

    .auth-brand-mobile {
        display: inline-flex;
    }

    .auth-panel {
        min-height: 100%;
        padding: 28px 20px;
    }
}
</style>
