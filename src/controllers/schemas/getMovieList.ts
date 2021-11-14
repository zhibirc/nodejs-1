export default {
    querystring: {
        // There are multiple choices for specifying enumeration as query parameter's value:
        // ?id=[1,2] | ?id=1&id=2 | ?id=1,2
        // The last one was chosen.
        fields: {
            type: 'string'
        },
        // for pagination
        limit: {
            type: 'number',
            pattern: '^[1-9]\\d*$'
        },
        offset: {
            type: 'number',
            pattern: '^\\d+$'
        }
    }
}
