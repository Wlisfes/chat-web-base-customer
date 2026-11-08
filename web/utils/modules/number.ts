import big from 'big.js'

export function fetchDivNumber(a: any, b: any) {
    return new big(Number(a || 0)).div(Number(b || 0)).toNumber()
}

export function fetchTimesNumber(a: any, b: any) {
    return new big(Number(a || 0)).times(Number(b || 0)).toNumber()
}

/**金额缩小转换**/
export function fetchShrinkNumber(a: any, b: number = 1000000) {
    return fetchDivNumber(a, b)
}

/**金额放大转换**/
export function fetchZoomNumber(a: any, b: number = 1000000) {
    return fetchTimesNumber(a, b)
}
