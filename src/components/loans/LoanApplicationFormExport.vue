<script setup>
// Import packages
import { ref, onMounted, onUnmounted } from 'vue'
import { PDFDocument, TextAlignment } from 'pdf-lib'

// Import constants
import { API_URL, FILENAMES } from '../../constants/index.js'

// Import stores
import { useApplicationFormStore } from '../../stores/applicationForm.js'
import { useMemberSearchStore } from '../../stores/memberSearch.js'
const appFormStore = useApplicationFormStore()
const memberSearchStore = useMemberSearchStore()

// Define reactive variables
const pdfUrl = ref('')
const errorAlert = ref(false)
const errorMessage = ref('')
const disableSubmit = ref(false)
const loading = ref(false)
const snackbar = ref(false)

// Submit loan application
const submit = async () => {
    const credentials = window.$cookies.get('credentials')

    if (!credentials || !credentials.token) {
        errorAlert.value = true
        errorMessage.value = 'You are not logged in.'
        return false
    }

    loading.value = true

    const { error, message } = await fetch(
        `${API_URL}/loans/user/${memberSearchStore.data.username}`,
        {
            credentials: 'omit',
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${credentials.token}`
            },
            body: JSON.stringify(appFormStore.getLoanData())
        }
    ).then((res) => res.json())

    loading.value = false

    if (error) {
        errorAlert.value = true
        errorMessage.value = message
        return false
    } else {
        errorAlert.value = false
        errorMessage.value = ''
        disableSubmit.value = true
        snackbar.value = true
        return true
    }
}

// Fetch PDF file from API
const fetchPDF = async () => {
    const { token } = window.$cookies.get('credentials')

    // Fetch PDF file
    const formBytes = await fetch(`${API_URL}/private/${FILENAMES.LOAN_APPLICATION}`, {
        credentials: 'omit',
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
    }).then((res) => res.arrayBuffer())

    // Load a PDFDocument from the existing PDF bytes
    const pdfDoc = await PDFDocument.load(formBytes)

    // ----- Fill form fields -----
    const form = pdfDoc.getForm()
    const loanData = appFormStore.getLoanData()

    // Set date field
    form.getTextField('Date').setText(new Date().toLocaleDateString('en-PH', { dateStyle: 'long' }))

    // Set classification
    form.getCheckBox({ new: 'New', renewal: 'Renewal' }[loanData.classification]).check()

    // Set term
    const termTextField = form.getTextField('Term of Loan')
    termTextField.setAlignment(TextAlignment.Center)
    termTextField.setText(loanData.term)

    // Set amount
    form.getTextField('Amount').setText(
        Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            currencyDisplay: 'code'
        })
            .format(loanData.amount)
            .replace('PHP', '')
    )

    // Set type of loan
    const loanTypes = Object.freeze({
        emergency: 'Emergency',
        multipurpose: 'Multi-Purpose',
        educational: 'Educational',
        pettyCash: 'Petty Cash',
        commercial: 'Commercial',
        livelihood: 'Livelihood'
    })
    form.getCheckBox(loanTypes[loanData.type]).check()

    // Set borrower's information
    form.getTextField('Surname').setText(memberSearchStore.data.name.last)
    form.getTextField('Given Name').setText(memberSearchStore.data.name.given)
    form.getTextField('Middle Name').setText(memberSearchStore.data.name.middle)
    const birthday = new Date(memberSearchStore.data.birthday)
    form.getTextField('Date of Birth').setText(
        birthday.toLocaleDateString('en-PH', { dateStyle: 'long' })
    )
    const ageTextField = form.getTextField('Age')
    ageTextField.setAlignment(TextAlignment.Center)
    ageTextField.setText(
        Math.abs(birthday.getUTCFullYear() - new Date().getUTCFullYear()).toLocaleString()
    )
    form.getTextField('Place of Birth').setText(memberSearchStore.data.birthplace)
    form.getCheckBox({ M: 'Male', F: 'Female' }[memberSearchStore.data.sex]).check()
    const civilStatusTextField = form.getTextField('Civil Status')
    civilStatusTextField.setAlignment(TextAlignment.Center)
    civilStatusTextField.setText(memberSearchStore.data.civil_status)
    form.getTextField('TIN').setText(memberSearchStore.data.tin_no)
    const contactNumberTextField = form.getTextField('Contact No')
    contactNumberTextField.setAlignment(TextAlignment.Center)
    contactNumberTextField.setText(memberSearchStore.data.contact_no)
    form.getTextField('Residence Address').setText(
        [
            memberSearchStore.data.address.street,
            memberSearchStore.data.address.barangay,
            memberSearchStore.data.address.city,
            memberSearchStore.data.address.province
        ].join(', ')
    )
    form.getTextField('Monthly Income').setText(
        Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            currencyDisplay: 'code'
        })
            .format(memberSearchStore.data.monthly_income)
            .replace('PHP', '')
    )
    form.getTextField('Source of Income').setText(memberSearchStore.data.occupation)

    // Set spouse's information
    if (memberSearchStore.data.civil_status === 'Married') {
        form.getTextField('Spouse Surname').setText(memberSearchStore.data.spouse.name.last)
        form.getTextField('Spouse Given Name').setText(memberSearchStore.data.spouse.name.given)
        form.getTextField('Spouse Middle Name').setText(memberSearchStore.data.spouse.name.middle)
        const spouseBirthday = new Date(memberSearchStore.data.spouse.birthday)
        form.getTextField('Spouse Date of Birth').setText(
            spouseBirthday.toLocaleDateString('en-PH', { dateStyle: 'long' })
        )
        const spouseAgeTextField = form.getTextField('Spouse Age')
        spouseAgeTextField.setAlignment(TextAlignment.Center)
        spouseAgeTextField.setText(
            Math.abs(spouseBirthday.getUTCFullYear() - new Date().getUTCFullYear()).toLocaleString()
        )
        form.getTextField('Spouse Place of Birth').setText(memberSearchStore.data.spouse.birthplace)
        form.getTextField('Spouse Source of Income').setText(
            memberSearchStore.data.spouse.occupation
        )
        const spouseContactNumberTextField = form.getTextField('Spouse Contact No')
        spouseContactNumberTextField.setAlignment(TextAlignment.Center)
        spouseContactNumberTextField.setText(memberSearchStore.data.spouse.contact_no)
    }

    // Set coborrower information, if any
    if (
        Object.entries(loanData.coborrower.name).every(([, val]) => {
            return val !== '' && val !== null
        })
    ) {
        form.getTextField('Coborrower Surname').setText(loanData.coborrower.name.last)
        form.getTextField('Coborrower Given Name').setText(loanData.coborrower.name.given)
        form.getTextField('Coborrower Middle Name').setText(loanData.coborrower.name.middle)
        const coborrowerBirthday = new Date(loanData.coborrower.birthday)
        form.getTextField('Coborrower Date of Birth').setText(
            coborrowerBirthday.toLocaleDateString('en-PH', { dateStyle: 'long' })
        )
        const coborrowerAgeTextField = form.getTextField('Coborrower Age')
        coborrowerAgeTextField.setAlignment(TextAlignment.Center)
        coborrowerAgeTextField.setText(
            Math.abs(
                coborrowerBirthday.getUTCFullYear() - new Date().getUTCFullYear()
            ).toLocaleString()
        )
        form.getTextField('Coborrower Place of Birth').setText(loanData.coborrower.birthplace)
        form.getTextField('Coborrower Source of Income').setText(loanData.coborrower.occupation)
        const coborrowerContactNumberTextField = form.getTextField('Coborrower Contact No')
        coborrowerContactNumberTextField.setAlignment(TextAlignment.Center)
        coborrowerContactNumberTextField.setText(loanData.coborrower.contact_no)
    }

    // Flatten form fields
    form.flatten()

    // Save PDF bytes
    const pdfBytes = await pdfDoc.save()
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' })
    pdfUrl.value = URL.createObjectURL(pdfBlob)
}

// Define lifecycle hooks
onMounted(fetchPDF)
onUnmounted(() => {
    URL.revokeObjectURL(pdfUrl.value)
    appFormStore.reset()
})
</script>

<template>
    <embed :src="pdfUrl" type="application/pdf" width="100%" height="720px" />
    <div class="d-flex justify-end ga-3">
        <VBtn :href="pdfUrl" 
            download="Loan Application Form.pdf" 
            class="bg-purple-darken-3 text-capitalize"
            prepend-icon="mdi-download">
            Download application form as PDF
        </VBtn>
        <VBtn
            type="submit"
            class="bg-orange-darken-4 text-capitalize"
            :loading="loading"
            @click.prevent="submit"
            :disabled="disableSubmit"
            prepend-icon="mdi-send"
        >
            {{ disableSubmit ? 'Form Submitted' : 'Submit application form' }}
        </VBtn>
        <VAlert
            v-if="errorAlert"
            v-model="errorAlert"
            type="error"
            closable=""
            density="comfortable"
            elevation="5"
        >
            {{ errorMessage }}
        </VAlert>
        <v-snackbar v-model="snackbar" rounded="pill"
            >Loan application successfully submitted!
            <template #actions>
                <v-btn :to="{ name: 'Loan Status' }" variant="text" color="blue"
                    >Go to Pending Loans</v-btn
                >
            </template>
        </v-snackbar>
    </div>
</template>

<style scoped></style>
