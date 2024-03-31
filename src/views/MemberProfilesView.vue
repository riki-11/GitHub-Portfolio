<script setup>
// Packages
import { watchDebounced } from '@vueuse/core'

// Import vue components
import ContentBlock from '../components/ContentBlock.vue'
import MemberProfileRegister from '../components/profiles/MemberProfileRegister.vue'
import UserProfileBtn from '../components/profiles/UserProfileBtn.vue'
import DashboardTopBar from '../components/DashboardTopBar.vue'

// Import Packages
import { ref, onMounted } from 'vue'

import { API_URL } from '../constants'

const searchQuery = ref('')
const users = ref([])

/**
 * Grabs all officers registered in the database.
 */
async function getAllUsers() {
    const credentials = window.$cookies.get('credentials')
    if (!credentials) return

    const { token } = credentials
    if (!token) return

    let url = ''
    const params = new URLSearchParams()
    if (searchQuery.value) {
        params.set('username', searchQuery.value)
        url += `search?${params}`
    }

    try {
        const response = await fetch(`${API_URL}/users/${url}`, {
            credentials: 'omit',
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` }
        })
        users.value = await response.json()
    } catch (e) {
        console.error(e)
    }
}

// Refresh users listing when there is a change in the searchbar
watchDebounced(searchQuery, getAllUsers, { debounce: 1000 })

// Upon loading the page
onMounted(getAllUsers)
</script>

<template>
    <div class="d-flex flex-column w-100 pl-8">
        <!-- Top Bar of Dashboard -->
        <DashboardTopBar :breadcrumbs="['Profiles', 'Member Profiles']" />

        <!-- Main Dashboard Body -->
        <div class="dashboard-body d-flex flex-column h-100 py-3">
            <h2>Member Profiles</h2>

            <div class="upper-wrapper">
                <!-- Search bar -->
                <div class="search-wrapper">
                    <v-text-field
                        v-model="searchQuery"
                        prepend-inner-icon="mdi-magnify"
                        label="Search Member"
                        clearable=""
                    />
                </div>

                <div class="btn-wrapper">
                    <v-dialog width="1200">
                        <template #activator="{ props }">
                            <!-- Create Member Profile Button -->
                            <v-btn
                                class="btn capitalize-text"
                                v-bind="props"
                                text="Create Member Profile"
                            >
                            </v-btn>
                        </template>

                        <!-- Form popup -->
                        <template #default="{ isActive }">
                            <v-card close-on-back contained class="form-wrapper">
                                <v-container>
                                    <v-row justify="end">
                                        <v-card-actions>
                                            <v-btn
                                                class="ma-2 capitalize-text"
                                                color="var(--vt-c-blue)"
                                                @click="isActive.value = false"
                                                icon="mdi-close"
                                            >
                                            </v-btn>
                                        </v-card-actions>
                                    </v-row>
                                </v-container>

                                <MemberProfileRegister
                                    :onsubmit="
                                        () => getAllUsers().then(() => (isActive.value = false))
                                    "
                                />
                            </v-card>
                        </template>
                    </v-dialog>
                </div>
            </div>

            <ContentBlock :width="100" :height="102" :unit="'%'" :bg-color="'#FFF'">
                <!-- List of members -->
                <div
                    v-for="user in users"
                    :key="user.username"
                    class="officer-list-box d-flex flex-column"
                >
                    <UserProfileBtn :user="user" :onsubmit="getAllUsers" />
                </div>
            </ContentBlock>
        </div>
    </div>
</template>

<style scoped>
.dashboard-top {
    width: 100%;
    height: 58px;
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
}

.dashboard-top-right {
    display: flex;
    gap: 1.5rem;
}

.breadcrumbs-wrapper {
    margin-left: -15px;
    font-weight: 600;
}

.dashboard-body {
    gap: 1.25rem;
}

.upper-wrapper {
    height: 10%;

    display: flex;
    align-items: center;
    justify-content: space-between;

    /* border: 1px solid black; */
}

.search-wrapper {
    display: flex;
    width: 85%;
}

.btn-wrapper {
    display: flex;
    margin-bottom: 22px;
    /* border: 1px solid black; */
}

.btn {
    font-weight: 600;
    color: var(--vt-c-white-off);
    background: var(--vt-c-blue);

    display: flex;
    align-items: center;
    text-align: center;

    padding-top: 15%;
    padding-bottom: 15%;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    text-transform: capitalize;
}

.btn:hover {
    background: var(--vt-c-blue-dark);
}

.form-wrapper {
    background-color: var(--vt-c-white-off);
}

.dashboard-body {
    gap: 1.25rem;
}

.gap-1_25 {
    gap: 1.25rem;
}

.bg-off-white {
    background-color: var(--vt-c-white-off);
}
</style>
