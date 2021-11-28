export default {
    body: {
        type: 'object',
        required: ['id'],
        properties: {
            id: {
                type: 'string'
            },
            favorites: {
                type: 'boolean'
            }
        }
    }
}
