export default {
    body: {
        type: 'object',
        required: ['name'],
        properties: {
            // name of the movie, overwrites original film title if given
            name: {
                type: 'string'
            },
            // user's comment
            comment: {
                type: 'string',
                pattern: '^\\S.*\\S$',
                minLength: 4
            },
            // user's movie score
            personalScore: {
                type: 'number'
            }
        }
    }
}
