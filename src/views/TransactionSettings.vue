<script setup>
// Import vue components
import DashboardTopBar from '../components/DashboardTopBar.vue'

import LoanSettings from '../components/settings/LoanSettings.vue'
import DepositSettings from '../components/settings/DepositSettings.vue'
</script>

<template>
    <div class="d-flex flex-column w-100 pl-8">
        <!-- Top Bar of Dashboard -->
        <DashboardTopBar :breadcrumbs="['Settings', 'Loans & Deposits']" />

        <!-- Main Dashboard Body -->
        <div class="dashboard-body d-flex flex-column h-100 py-3">
            <h2>Loan & Deposit Settings</h2>

            <div class="d-flex flex-row h-100">
                <div class="left pa-2">
                    <LoanSettings />
                </div>

                <div class="right pa-2">
                    <DepositSettings />
                </div>
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
