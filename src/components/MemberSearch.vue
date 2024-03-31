<script setup>
// Import packages
import { ref, reactive, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'

// Import router
import router from '../router'

// Import components
import MemberProfileRegister from './profiles/MemberProfileRegister.vue'

// Import constants
import { API_URL } from '../constants'

// Import stores
import { useMemberSearchStore } from '../stores/memberSearch'
const memberSearchStore = useMemberSearchStore()

// Props
const props = defineProps({
    to: {
        type: String,
        required: true
    },
    canCreateNewMember: {
        type: Boolean,
        default: true
    }
})

// Define reactive variables
const searchUsername = ref(null)
const user = ref(null)
const searching = ref(false)
const errorAlert = ref(false)
const errorMessage = ref('')
const searchedMembers = reactive([])

// Define methods
const searchMember = async () => {
    if (!searchUsername.value) return

    const credentials = window.$cookies.get('credentials')

    if (!credentials || !credentials.token) {
        errorAlert.value = true
        errorMessage.value = 'Please log in as officer to continue'
        return
    }

    const params = new URLSearchParams()
    params.set('username', searchUsername.value)
    const loanees = await fetch(`${API_URL}/users/search?${params}`, {
        credentials: 'omit',
        method: 'GET',
        headers: { Authorization: `Bearer ${credentials.token}` }
    }).then((res) => res.json())

    searchedMembers.splice(
        0,
        searchedMembers.length,
        ...loanees.slice(0, 5).map((loanee) => ({
            ...loanee,
            parsedName: `${loanee.name.last}, ${loanee.name.given}`
        }))
    )

    searching.value = false
}

const sendToNext = async () => {
    const memberData = searchedMembers.find((member) => member.username === user.value)
    memberSearchStore.setData(memberData)

    router.push({ name: props.to })
}

// Lifecycle hooks
const searchDebounce = useDebounceFn(searchMember, 2000)
watch(searchUsername, () => {
    if (user.value !== null) return
    searching.value = true
    searchedMembers.splice(0, searchedMembers.length)
    searchDebounce()
})
</script>

<template>
    <div class="wrapper">
        <VForm>
            <div class="header2">Search Existing Member or Create Member Profile</div>

            <!-- Search bar -->
            <div class="search-wrapper">
                <VAutocomplete
                    v-model="user"
                    v-model:search="searchUsername"
                    :items="searchedMembers"
                    item-title="parsedName"
                    item-value="username"
                    prepend-inner-icon="mdi-magnify"
                    label="Search Member by Name or Username"
                    clearable=""
                    auto-select-first
                    :custom-filter="() => true"
                >
                    <template #no-data>
                        <VListItem>
                            <VListItemTitle v-if="!searchUsername">
                                Enter the member's name or username to search for them...
                            </VListItemTitle>
                            <VListItemTitle v-else-if="!searching">
                                No results matching "<strong>{{ searchUsername }}</strong
                                >" were found.
                            </VListItemTitle>
                            <VListItemTitle v-else>
                                Searching for "<strong>{{ searchUsername }}</strong
                                >"...
                            </VListItemTitle>
                        </VListItem>
                    </template>
                    <template #item="{ props, item }">
                        <VListItem
                            v-bind="props"
                            :title="item.title"
                            :subtitle="item.props.value"
                        />
                    </template>
                </VAutocomplete>
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
            </div>
            <div class="create-member mt-n5" v-if="canCreateNewMember">
                <v-dialog width="1200">
                    <template #activator="{ props }">
                        <!-- Create Member Profile Button -->
                        <v-btn
                            class="capitalize-text mt-2"
                            v-bind="props"
                            variant="plain"
                            text="New Member? Click here to create Member Profile instead"
                            flat=""
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

                            <MemberProfileRegister />
                        </v-card>
                    </template>
                </v-dialog>
            </div>

            <div class="btn-wrapper">
                <VBtn
                    type="submit"
                    class="btn capitalize-text"
                    @click.prevent="sendToNext"
                    :disabled="!user"
                >
                    Next
                </VBtn>
            </div>
        </VForm>
    </div>
</template>

<style scoped>
.wrapper {
    padding: 5%;
    padding-top: 2%;
    padding-bottom: 2%;
    overflow: auto;
    /* border: 1px solid black; */
}

.header2 {
    font-size: 1.2rem;
    margin-bottom: 3%;
    font-weight: bold;
}

.create-member {
    color: var(--vt-c-blue-dark);
    font-weight: 500;
}

.btn {
    color: var(--vt-c-white-off);
    font-weight: 600;
    background: var(--vt-c-blue);

    border: none;
    border-radius: 5px;
    cursor: pointer;
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
    text-decoration: underline;
}
</style>
