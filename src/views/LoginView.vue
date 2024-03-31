<script setup>
// Import packages
import { ref, onMounted } from 'vue'
import jwt_decode from 'jwt-decode'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()

onMounted(() => {
    console.log(mobile.value) // false
})

// Import vue components
import router from '../router'

// Import constants
import { API_URL } from '../constants'

// Import stores
import { useCurrentUserStore } from '../stores/currentUser'

// Define stores
const currentUserStore = useCurrentUserStore()

// Define refs
const username = ref('')
const password = ref('')
const form = ref(null)
const errorMessage = ref('')
const errorAlert = ref(false)
const remember = ref(false)
const showPassword = ref(false)
const loading = ref(false)

// Define methods
const logIn = async () => {
    loading.value = true

    const { token, message } = await fetch(`${API_URL}/auth/login`, {
        credentials: 'omit',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: username.value,
            password: password.value
        })
    }).then((res) => res.json())

    if (!token) {
        errorMessage.value = message
        errorAlert.value = true
        loading.value = false
        return
    }

    // Decode token
    const { uuid } = jwt_decode(token)
    currentUserStore.id = uuid

    // TODO: Use refresh token instead of storing token itself in cookies
    // Set cookie
    window.$cookies.set(
        'credentials',
        { token, persist: remember.value },
        remember.value ? '30d' : 0
    )

    // Fetch user
    await currentUserStore.fetchUser()

    loading.value = false

    // Redirect to dashboard
    return router.replace({ name: 'Loan Dashboard' })
}
</script>

<template>
    <div v-if="!mobile" class="bg">
        <div class="wrapper">
            <div class="login">
                <div class="d-flex justify-center w-100">
                    <svg width="300" height="80" xmlns="http://www.w3.org/2000/svg" class="ml-n5">
                        <image href="/assets/logo-full-black.svg" width="300" height="100" />
                    </svg>
                </div>

                <div class="error-msg-wrapper">
                    <VAlert
                        v-if="errorAlert"
                        v-model="errorAlert"
                        type="error"
                        variant="tonal"
                        closable=""
                    >
                        {{ errorMessage }}
                    </VAlert>
                </div>

                <div class="login-form-wrapper">
                    <VForm id="login-form" ref="form">
                        <VTextField
                            class="username-pw-input"
                            v-model="username"
                            id="login-username"
                            label="Username"
                            required
                        />
                        <VTextField
                            class="username-pw-input"
                            v-model="password"
                            id="login-pw"
                            label="Password"
                            required
                            :type="showPassword ? 'text' : 'password'"
                            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                            @click:append-inner="showPassword = !showPassword"
                        />

                        <div class="remember-me-wrapper">
                            <div class="remember-me">
                                <VCheckbox
                                    id="checkbox"
                                    v-model="remember"
                                    color="var(--vt-c-blue)"
                                    label="Remember Me"
                                />
                            </div>
                        </div>

                        <VBtn
                            type="submit"
                            class="btn capitalize-text"
                            :loading="loading"
                            @click.prevent="logIn"
                        >
                            Log In
                        </VBtn>
                    </VForm>
                </div>
            </div>
        </div>
    </div>

    <div v-if="mobile" class="bg">
        <div class="wrapper w-75">
            <div class="login w-75">
                <div class="d-flex justify-center w-100">
                    <!-- BUG: DOESNT SCALE AAAAAAAAAA -->
                    <svg width="150" height="100" xmlns="http://www.w3.org/2000/svg" class="mt-2">
                        <image href="/assets/logo.svg" width="150" height="100" />
                    </svg>
                </div>

                <div class="error-msg-wrapper">
                    <VAlert
                        v-if="errorAlert"
                        v-model="errorAlert"
                        type="error"
                        variant="tonal"
                        closable=""
                    >
                        {{ errorMessage }}
                    </VAlert>
                </div>

                <div class="login-form-wrapper">
                    <VForm id="login-form" ref="form">
                        <VTextField
                            class="username-pw-input"
                            v-model="username"
                            id="login-username"
                            label="Username"
                            required
                        />
                        <VTextField
                            class="username-pw-input"
                            v-model="password"
                            id="login-pw"
                            label="Password"
                            required
                            :type="showPassword ? 'text' : 'password'"
                            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                            @click:append-inner="showPassword = !showPassword"
                        />

                        <div class="remember-me-wrapper">
                            <div class="remember-me">
                                <VCheckbox
                                    id="checkbox"
                                    v-model="remember"
                                    color="var(--vt-c-blue)"
                                    label="Remember Me"
                                />
                            </div>
                        </div>

                        <VBtn
                            type="submit"
                            class="btn capitalize-text"
                            :loading="loading"
                            @click.prevent="logIn"
                        >
                            Log In
                        </VBtn>
                    </VForm>
                </div>
            </div>
        </div>
    </div>
</template>

<!-- Stylesheet -->
<style scoped>
.bg {
    height: 100vh;
    width: 100vw;
    background-image: url('/assets/bg.svg');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    background-attachment: fixed;
    background-color: var(--vt-c-blue-very-dark);
    overflow: hidden;

    display: flex;
    justify-content: center; /* Horizontal centering */
    align-items: center;
}

.wrapper {
    min-width: 320px;
    min-height: 60vh;

    background: var(--vt-c-white);
    border-radius: 5px;

    display: flex;
    justify-content: center;
    overflow: auto;
    padding: 2%;
}

.login {
    width: 20vw;
    margin: auto;
}

.header {
    font-size: 1.5rem;
    font-weight: bold;

    color: var(--vt-c-black);
    text-align: center;
    margin-top: 3%;
    margin-bottom: 2%;
}

.error-msg-wrapper {
    width: 100%;
    height: 7vh;
}

.login-form-wrapper {
    margin-top: 3%;
}

.username-pw-input {
    position: relative;
    width: 100%;
}

.btn {
    width: 100%;
    padding: 2%;

    color: var(--vt-c-white-off);
    font-weight: 600;
    background: var(--vt-c-blue);

    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 20%;
    margin-bottom: 5%;
}

.btn:hover {
    background: var(--vt-c-blue-dark);
}

.remember-me-wrapper {
    display: flex;
    justify-content: flex-end;
}

.remember-me {
    font-size: 1rem;
    color: var(--primary-color-jade);
    display: flex;
    width: fit-content;
}
</style>
