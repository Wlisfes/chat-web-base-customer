const path = require('path')

module.exports = function (options) {
    return {
        ...options,
        resolve: {
            ...options.resolve,
            alias: {
                ...(options.resolve && options.resolve.alias),
                '@server': path.resolve(__dirname, 'server')
            }
        }
    }
}