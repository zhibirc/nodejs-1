export default {
    body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
            email: {
                type: 'string',
                format: 'email'
            },
            password: {
                type: 'string',
                // Must contain at least one: Latin lowercase letter, Latin uppercase letter, decimal digit, special character.
                pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-~`!@#$%^&*()_+={}|<>[\\]\'"])[-A-Za-z\\d~`!@#$%^&*()_+={}|<>[\\]\'"]+$',
                minLength: 20,
                maxLength: 32
            }
        }
    }
}
