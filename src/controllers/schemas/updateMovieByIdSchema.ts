export default {
    params: {
        id: {
            type: 'string',
            pattern: '^[a-z]{1,2}\\d{1,10}$'
        }
    },
    body: {
        comment: {
            type: 'string'
        },
        personalScore: {
            type: 'number'
        }
    }
}
