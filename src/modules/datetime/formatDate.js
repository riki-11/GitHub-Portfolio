/**
 * Module for functions that help format dates to be displayed on the webpage.
 * @module modules.datetime.formatDate
 * @exports formatUTC
 * @exports formatDate
 */

/**
 * Converts a string in UTC format to YYYY-MM-DD
 * @param {String} utcString - The string to format
 * @return the input string converted to YYYY-MM-DD format
 */
const formatUTC = function (utcString) {
    return utcString.substring(0, 10)
}

/**
 * Format a Date object to a String in YYYY-MM-DD
 * @param {Date} date - The Date object to format
 * @return the Date object converted to YYYY-MM-DD
 */
const formatDate = function (date) {
    let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date)
    let month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date)
    let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date)
    return `${year}-${month}-${day}`
}

export { formatUTC, formatDate }
