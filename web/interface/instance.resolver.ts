export type { ResultResolver } from './modules/request.resolver'

export interface ResultColumn<T = any> {
    page: number
    size: number
    total: number
    list: Array<Omix<T>>
    message?: string
}

export type ChunkName = string

export interface ChunkOptionGroup extends Omix {
    type: string
    count: number
    options: Array<Omix>
}