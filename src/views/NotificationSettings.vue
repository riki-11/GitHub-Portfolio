<script setup>
// Import vue components
import DashboardTopBar from '../components/DashboardTopBar.vue'
import NotificationBlock from '../components/settings/NotificationBlock.vue'
</script>

<template>
    <div class="d-flex flex-column w-100 pl-8">
        <!-- Top Bar of Dashboard -->
        <DashboardTopBar :breadcrumbs="['Settings', 'Notifications']" />

        <!-- Main Dashboard Body -->
        <div class="dashboard-body d-flex flex-column h-100 py-3">
            <h2>Notification Settings</h2>

            <div class="d-flex flex-row h-100">
                <NotificationBlock />
            </div>
        </div>
    </div>
</template>

<style scoped>
.left {
    width: 50%;
    height: 100%;
}

.right {
    width: 50%;
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
