/**
 * Rules for frontend validation.
 * @module constants/rules
 */

export const FORM_RULES = Object.freeze({
    required: (v) => !!v || 'Required',
    min6: (v) => (v && v.length >= 6) || 'Minimum of 6 characters',
    min8: (v) => (v && v.length >= 8) || 'Minimum of 8 characters',
    max20: (v) => (v && v.length <= 20) || 'Maximum of 20 characters',
    max255: (v) => (v && v.length <= 255) || 'Maximum of 255 characters',
    username: (v) =>
        (v && /^[a-zA-Z0-9_]+$/.test(v)) || 'Username can only be alphanumeric and underscore',
    password: (v) =>
        (v && !/^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/.test(v)) ||
        'Password must contain at least one uppercase, one lowercase, one number and one special character',
    tin: (v) =>
        (v && /^[0-9]{3}-[0-9]{3}-[0-9]{3}-[0-9]{3}$/.test(v)) ||
        'TIN number must be of the format XXX-XXX-XXX-XXX where X is a number from 0 to 9'
})
