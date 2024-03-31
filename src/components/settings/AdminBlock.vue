<script setup>
// Packages
import { ref } from 'vue'

// Components
import ContentBlock from '../../components/ContentBlock.vue'

// Project constants
import { API_URL, FORM_RULES } from '../../constants'

// Reactive variables
const form = ref(null)
const newPassword = ref('')
const confirmNewPassword = ref('')
const errorAlert = ref(false)
const errorMessage = ref('')
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const done = ref(false)

// Form rules
const rules = {
    mustMatch: (v) => (!!v && v === newPassword.value) || 'Passwords do not match'
}

// Methods
const submitForm = async () => {
    const { valid } = await form.value.validate()
    if (!valid) return

    loading.value = true

    const { token } = window.$cookies.get('credentials')

    const res = await fetch(`${API_URL}/officers/admin/password`, {
        credentials: 'omit',
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ password: newPassword.value })
    })

    if (!res.ok) {
        const { message } = await res.json()
        errorAlert.value = true
        errorMessage.value = message
        loading.value = false
        return
    }

    loading.value = false
    done.value = true
}
</script>

<template>
    <ContentBlock :width="100" :height="100" :unit="'%'" :padding="2">
        <div class="rounded-lg">
            <VForm ref="form">
                <div class="">
                    <div class="form-wrapper">
                        <VForm id="login-form" ref="form">
                            <div class="header2">Change Password</div>

                            <!-- Password -->
                            <div class="row-tab">
                                <div class="label">
                                    <div>* New Password:</div>
                                </div>

                                <VTextField
                                    v-model="newPassword"
                                    class="username-pw-input"
                                    label="Enter New Password"
                                    :rules="[
                                        FORM_RULES.required,
                                        FORM_RULES.min8,
                                        FORM_RULES.max255,
                                        FORM_RULES.password
                                    ]"
                                    :disabled="done || loading"
                                    :type="showPassword ? 'text' : 'password'"
                                    :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                                    @click:append-inner="showPassword = !showPassword"
                                />
                            </div>

                            <!-- Password -->
                            <div class="row-tab">
                                <div class="label">
                                    <div>* Re-enter New Password:</div>
                                </div>

                                <VTextField
                                    v-model="confirmNewPassword"
                                    class="username-pw-input"
                                    label="Re-enter New Password"
                                    :rules="[
                                        FORM_RULES.required,
                                        FORM_RULES.min8,
                                        FORM_RULES.max255,
                                        FORM_RULES.password,
                                        rules.mustMatch
                                    ]"
                                    :disabled="done || loading"
                                    :type="showConfirmPassword ? 'text' : 'password'"
                                    :append-inner-icon="
                                        showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'
                                    "
                                    @click:append-inner="showConfirmPassword = !showConfirmPassword"
                                />
                            </div>
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

                            <div class="btn-wrapper">
                                <VBtn
                                    type="submit"
                                    class="btn capitalize-text"
                                    @click.prevent="submitForm"
                                    :loading="loading"
                                    :disabled="done"
                                    >{{ done ? 'Changed Password!' : 'Change Password' }}
                                </VBtn>
                            </div>
                        </VForm>
                    </div>
                </div>
            </VForm>
        </div>
    </ContentBlock>
</template>

<style scoped>
.wrapper {
}

.row-tab {
    /* border: 1px solid black; */
    display: flex;
}

.label {
    margin-top: 5.2%;
    margin-right: 6%;

    /* border: 1px solid black; */
    width: 67%;

    display: inline-block;
    text-align: right;
    vertical-align: top;
}

.btn {
    font-weight: 600;
    color: var(--vt-c-white-off);
    background: var(--vt-c-blue);

    display: flex;
    align-items: center;
    text-align: center;

    border-radius: 5px;
    text-transform: capitalize;
}

.btn-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 7%;
}

.bg {
    height: 100vh;
    width: 100vw;
    overflow: hidden;

    display: flex;
    justify-content: center;
    align-items: center;

    position: fixed;
    z-index: 9999;

    background-color: rgba(0, 0, 0, 0.5);
}

.wrapper {
    background: var(--vt-c-white);
    border-radius: 5px;

    width: 60vw;
    max-height: 80vh;

    display: flex;
    flex-direction: column;
    overflow: auto;
}

.info-fields {
    background-color: var(--vt-c-white);
    padding: 5%;
    padding-top: 2%;
    padding-bottom: 2%;
    overflow: auto;
}

.form-wrapper {
    background-color: var(--vt-c-white);
}

.header {
    background-color: var(--vt-c-white-off);
    width: 100%;
    padding-bottom: 3%;

    position: sticky;
    top: 0;
    z-index: 1000;

    font-size: 1.5rem;
    font-weight: bold;
    margin-left: 5%;
}

.header-text {
}

.header2 {
    font-size: 1.2rem;
    margin-bottom: 3%;
    font-weight: bold;
}

.row-tab {
    /* border: 1px solid black; */
    display: flex;
    margin-bottom: 1%;
}

.label {
    margin-top: 15px;
    margin-right: 2%;
    /* border: 1px solid black; */
    width: 30%;

    display: inline-block;
    text-align: right;
    vertical-align: top;
}

.error-msg-wrapper {
    width: 100%;
    height: 7vh;
    position: absolute;
    z-index: 999;
}

.btn {
    font-weight: 600;
    color: var(--vt-c-white-off);
    background: var(--vt-c-blue);

    display: flex;
    align-items: center;
    text-align: center;

    border-radius: 5px;
    text-transform: capitalize;
}

.btn-wrapper {
    height: min-content;
    display: flex;
    justify-content: flex-end;
    margin-top: 2%;
}

.capitalize-text {
    text-transform: capitalize;
}

.btn:hover {
    background: var(--vt-c-blue-dark);
}

.rememberMe {
    font-size: 0.9em;
    color: var(--primary-color-jade);
    font-weight: 500;
    margin: -15px 2 15px;
    display: flex;
    justify-content: right;
    margin-top: 5px;
    margin-bottom: 20px;
}

.error {
    display: flex;
    font-size: 0.9em;
    text-align: center;
    color: red;
    font-weight: 400;
    margin: 25px 1 10px;
    justify-content: center;
}
</style>
