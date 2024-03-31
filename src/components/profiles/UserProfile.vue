<script setup>
// Import stores
import { useCurrentUserStore } from '../../stores/currentUser.js'

// Define stores
const currentUserStore = useCurrentUserStore()
</script>

<template>
    <div class="profile-box rounded-lg elevation-5 hover-scale-md pl-5 pr-5 pt-1 pb-1">
        <div class="d-flex flex-column">
            <p class="font-weight-bold name-text">
                {{ currentUserStore.name.given }} {{ currentUserStore.name.last }}
            </p>
            <p class="title-text">{{ currentUserStore.role.toUpperCase() }}</p>
        </div>
    </div>
</template>

<style scoped>
.profile-box {
    background-color: var(--vt-c-white);
}

.user-avatar {
    background-color: var(--vt-c-gray-dark);
}

.name-text {
    font-size: 1.25rem;
    height: 25px;
}

.title-text {
    color: var(--vt-c-gray);
    font-size: 0.9rem;
}
</style>
