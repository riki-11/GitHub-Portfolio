<script setup>
// Import packages
import { inject, watch, ref } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import jwt_decode from 'jwt-decode'

// Import stores
import { useCurrentUserStore } from './stores/currentUser'

// Import global components
import NavigationDrawer from './components/NavigationDrawer.vue'

// Define stores
const currentUserStore = useCurrentUserStore()

// Cookies
const $cookies = inject('$cookies')
const credentials = $cookies.get('credentials')
if (credentials) {
    // Decode the token
    const { uuid } = jwt_decode(credentials.token)
    currentUserStore.id = uuid

    // Fetch user
    currentUserStore.fetchUser()
}

const currentRoute = ref(null)
const route = useRoute()
watch(
    () => route.name,
    (to) => {
        currentRoute.value = to
    }
)
</script>

<template>
    <div class="bg-off-white d-flex px-4 py-2" v-if="currentRoute && currentRoute !== 'Login'">
        <NavigationDrawer />
        <RouterView />
    </div>
    <RouterView v-else />
</template>
