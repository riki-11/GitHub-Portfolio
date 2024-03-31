<script setup>
// Import Packages
import { onBeforeMount } from 'vue'
import router from '../router'

// Project constants
import { API_URL } from '../constants'

// Import vue components
import MemberProfileLeft from '../components/profiles/MemberProfileLeft.vue'
import MemberProfileRight from '../components/profiles/MemberProfileRight.vue'
import DashboardTopBar from '../components/DashboardTopBar.vue'

// Stores
import { useProfileDataStore } from '../stores/profileData'
const profileDataStore = useProfileDataStore()

// Props
const props = defineProps({
    username: {
        type: String,
        required: true
    }
})

// Lifecycle hooks
onBeforeMount(async () => {
    if (profileDataStore.profileData && profileDataStore.profileData.username === props.username)
        return

    const { token } = window.$cookies.get('credentials')

    const params = new URLSearchParams()
    params.set('username', props.username)
    const users = await fetch(`${API_URL}/users/search?${params}`, {
        credentials: 'omit',
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
    }).then((res) => res.json())

    const matchedUser = users[0]
    if (!matchedUser || matchedUser.username !== props.username) {
        router.replace({ name: 'Member Profiles View' })
        return
    }

    profileDataStore.setProfileData(users[0])
})
</script>
<template>
    <div class="d-flex flex-column w-100 pl-8">
        <!-- Top Bar of Dashboard -->
        <DashboardTopBar :breadcrumbs="['Profiles', 'Member Profiles', username]" />

        <!-- Main Dashboard Body -->
        <div class="dashboard-body d-flex flex-column h-100 py-3">
            <h2>Member Profiles</h2>

            <div class="d-flex flex-row h-100">
                <div class="left pa-2">
                    <VExpandTransition>
                        <MemberProfileLeft />
                    </VExpandTransition>
                </div>

                <div class="right pa-2">
                    <VExpandTransition>
                        <MemberProfileRight />
                    </VExpandTransition>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.left {
    width: 30%;
    height: 100%;
}

.right {
    width: 70%;
    height: 100%;
}
.header {
    font-size: 1.7rem;
}
.dashboard-body {
    gap: 1.25rem;
}

.dashboard-body {
    gap: 1.25rem;
}

.bg-off-white {
    background-color: var(--vt-c-white-off);
}
</style>
