import { GlobalThemeOverrides, ThemeCommonVars } from 'naive-ui'

export interface CustomThemeCommonVars extends Omix<ThemeCommonVars> {}

export function addLight(color: string, amount: number) {
    const cc = parseInt(color, 16) + amount
    const c = cc > 255 ? 255 : cc
    return c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`
}

export function lighten(color: string, amount: number) {
    color = color.indexOf('#') >= 0 ? color.substring(1, color.length) : color
    amount = Math.trunc((255 * amount) / 100)
    return `#${addLight(color.substring(0, 2), amount)}${addLight(color.substring(2, 4), amount)}${addLight(color.substring(4, 6), amount)}`
}

export function themeOverrides(inverted: boolean, state: Omix): Omix<GlobalThemeOverrides & { common: Partial<CustomThemeCommonVars> }> {
    const lightenStr = lighten(state.primaryColor, 6)
    const common = {
        fontWeightStrong: '600',
        primaryColor: state.primaryColor,
        primaryColorHover: lightenStr,
        primaryColorPressed: lightenStr,
        primaryColorSuppl: state.primaryColor
    }
    if (inverted) {
        return {
            common: {
                ...common,
                bodyColor: '#0b1224',
                cardColor: '#162033',
                modalColor: '#162033',
                popoverColor: '#1b2740',
                tableColor: '#162033',
                inputColor: '#121b30',
                borderColor: 'rgba(158, 184, 255, 0.18)',
                dividerColor: 'rgba(158, 184, 255, 0.14)',
                textColor1: '#f5f7ff',
                textColor2: '#d5def2',
                textColor3: '#9aabc8'
            },
            Card: {
                color: '#162033',
                colorEmbedded: '#121b30',
                borderColor: 'rgba(158, 184, 255, 0.16)'
            },
            Layout: {
                color: '#0b1224',
                headerColor: 'transparent',
                textColor: '#f5f7ff'
            },
            Scrollbar: { width: '8px', height: '8px', color: 'rgba(158, 184, 255, 0.45)', colorHover: 'rgba(180, 202, 255, 0.7)' }
        }
    }
    return {
        common,
        Layout: { headerColor: 'transparent' },
        Scrollbar: { width: '8px', height: '8px' }
    }
}