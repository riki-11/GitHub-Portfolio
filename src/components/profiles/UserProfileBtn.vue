<script setup>
// Router
import router from '../../router/index.js'

// Components
import MemberProfileRegister from './MemberProfileRegister.vue'
import DeletePrompt from '../DeletePrompt.vue'

// Stores
import { useProfileDataStore } from '../../stores/profileData.js'
const profileDataStore = useProfileDataStore()

// Props
const props = defineProps({
    user: {
        type: Object,
        required: true
    },
    onsubmit: {
        type: Function,
        default: () => () => null
    }
})

// Methods
const setUser = () => {
    profileDataStore.setProfileData(props.user)
    router.push({
        name: 'Profile View',
        params: { username: props.user.username }
    })
}
</script>

<template>
    <v-hover>
        <template #default="{ isHovering, props }">
            <v-card
                class="officer-profile-btn w-100 d-flex align-center rounded-lg elevation-2 pa-2 mb-3"
                v-bind="props"
                :color="isHovering ? 'rgba(239, 239, 239, 20)' : 'rgba(239, 239, 239, 0.525)'"
            >
                <!-- Profile Picture -->
                <div class="officer-icon-box">
                    <v-icon class="officer-icon w-100" icon="mdi-account-circle"></v-icon>
                </div>

                <!-- Information -->
                <div class="d-flex flex-column">
                    <h2 class="sm='0'">{{ user.name.last }}, {{ user.name.given }}</h2>
                    <div class="memberdiv">{{ user.username }}</div>
                </div>

                <!-- Actions -->
                <div class="officer-actions-box ml-auto d-flex">
                    <!-- Update Officer Profile Button -->
                    <div class="updatebtn-wrapper">
                        <v-dialog width="900">
                            <template #activator="{ props }">
                                <v-btn
                                    v-bind="props"
                                    icon="mdi-square-edit-outline"
                                    variant="plain"
                                >
                                </v-btn>
                            </template>

                            <!-- Form popup -->
                            <template #default="{ isActive }">
                                <v-card close-on-back contained class="form-wrapper">
                                    <v-container>
                                        <div class="d-flex flex-row">
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
                                        </div>
                                    </v-container>

                                    <MemberProfileRegister
                                        :action="`update`"
                                        :autofill="user"
                                        :onsubmit="
                                            () => {
                                                onsubmit()
                                                isActive.value = false
                                            }
                                        "
                                    />
                                </v-card>
                            </template>
                        </v-dialog>
                    </div>

                    <!-- Delete Officer Profile Button -->
                    <div class="deletebtn-wrapper">
                        <v-dialog width="600">
                            <template #activator="{ props }">
                                <v-btn v-bind="props" icon="mdi-trash-can-outline" variant="plain">
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
                                        <h2 class="ml-5">Delete Profile</h2>
                                    </v-container>
                                    <DeletePrompt
                                        profileType="Member"
                                        :name="`${user.name.last}, ${user.name.given}`"
                                        :identifier="user.username"
                                        :onsubmit="
                                            () => {
                                                onsubmit()
                                                isActive.value = false
                                            }
                                        "
                                    />
                                </v-card>
                            </template>
                        </v-dialog>
                    </div>

                    <v-btn
                        icon="mdi-arrow-right-circle-outline"
                        variant="plain"
                        @click.prevent="setUser"
                    >
                    </v-btn>
                </div>
            </v-card>
        </template>
    </v-hover>
</template>

<style>
.form-wrapper {
    background-color: var(--vt-c-white-off);
}

.memberdiv {
    margin-top: -7px;
    padding: 0;
}

.officer-profile-btn {
    background-color: rgba(239, 239, 239, 0.525);
    /* border: 1px solid black */
}

.officer-icon-box {
    min-width: 5.5rem;
}

.officer-icon {
    font-size: 4rem;
}

.officer-actions-box {
    gap: 0.5rem;
}

.officer-action-icon {
    font-size: 2rem;
}

.officer-action-icon:hover {
    opacity: 0.65;
}
</style>
