/**
 * A store for maintaining persistent data for the Loan Application Form.
 * @module stores/applicationForm
 */

// Import packages
import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

/**
 * Application form store
 */
export const useApplicationFormStore = defineStore('applicationForm', () => {
    const emptyCoborrower = Object.freeze({
        name: {
            given: '',
            middle: '',
            last: ''
        },
        birthday: '',
        birthplace: '',
        occupation: '',
        contact_no: ''
    })

    const date = ref('')
    const amount = ref(0)
    const runningBalance = ref(0)
    const term = ref(0)
    const paymentFrequency = ref('')
    const classification = ref('')
    const type = ref('')
    const status = ref('')
    const coborrower = reactive({ ...emptyCoborrower })

    /**
     * Reset the values of the store
     */
    const reset = () => {
        date.value = ''
        amount.value = 0
        runningBalance.value = 0
        term.value = 0
        paymentFrequency.value = ''
        classification.value = ''
        type.value = ''
        status.value = ''
        Object.assign(coborrower, { ...emptyCoborrower })
    }

    /**
     * Get data from the store
     * @return the data in the store, as an Object
     */
    const getLoanData = () => {
        return {
            date: date.value,
            amount: amount.value,
            runningBalance: runningBalance.value,
            term: term.value,
            paymentFrequency: paymentFrequency.value,
            classification: classification.value,
            type: type.value,
            status: status.value,
            coborrower
        }
    }

    /**
     * Set the data of the store.
     * Loan is an object that follows the fields listed in `parameters`:
     *
     * @param {String} date - Loan date
     * @param {Number} amount - Loan amount
     * @param {Number} term - Loan term.
     * @param {String} type - Loan type. Can be "emergency", "multipurpose", "educational", "pettyCash", "commercial", or "livelihood".
     * @param {String} status - Loan status. Default is 'pending'
     * @param {String} paymentFrequency - How often payments are made for the loan. Can be "daily", "weekly" or "monthly".
     * @param {String} classification - Loan classification. Can be "new" or "renewal".
     */
    const setLoanData = (loan) => {
        date.value = loan.date
        amount.value = loan.amount
        runningBalance.value = loan.amount
        term.value = loan.term
        type.value = loan.type
        status.value = loan.status || 'pending'
        paymentFrequency.value = loan.paymentFrequency
        classification.value = loan.classification
        Object.assign(coborrower, loan.coborrower)
    }

    return { getLoanData, setLoanData, reset }
})
