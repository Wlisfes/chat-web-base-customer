function success<T>(data: T) {
    return Promise.resolve({ code: 200, message: 'success', data, timestamp: '' })
}

function storageKey(keyName: string) {
    return `chat-web-customer:column:${keyName}`
}

/**查询字段配置。服务端没有 localStorage，返回空配置。*/
export function httpBaseColumnChunkCustomize(data: Omix<{ keyName: string }>) {
    if (typeof window === 'undefined') return success({ customize: [], database: [] })
    try {
        return success(JSON.parse(window.localStorage.getItem(storageKey(data.keyName)) ?? '{}'))
    } catch {
        return success({ customize: [], database: [] })
    }
}

/**更新搜索栏字段配置。*/
export async function httpBaseUpdateChunkSearch(data: Omix<{ keyName: string; fields: Array<Omix> }>) {
    const current = await httpBaseColumnChunkCustomize(data)
    if (typeof window !== 'undefined') {
        window.localStorage.setItem(storageKey(data.keyName), JSON.stringify({ ...current.data, database: data.fields }))
    }
    return success({ success: true })
}

/**更新表头字段配置。*/
export async function httpBaseUpdateChunkColumns(data: Omix<{ keyName: string; fields: Array<Omix> }>) {
    const current = await httpBaseColumnChunkCustomize(data)
    if (typeof window !== 'undefined') {
        window.localStorage.setItem(storageKey(data.keyName), JSON.stringify({ ...current.data, customize: data.fields }))
    }
    return success({ success: true })
}