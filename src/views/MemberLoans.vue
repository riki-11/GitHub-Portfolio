<script setup>
// Import vue components
import ContentBlock from '../components/ContentBlock.vue'
import LoanLedger from '../components/loans/LoanLedger.vue'
import DashboardTopBar from '../components/DashboardTopBar.vue'
</script>

<template>
    <div class="d-flex flex-column w-100 pl-8">
        <!-- Top Bar of Dashboard -->
        <DashboardTopBar :breadcrumbs="['Loans', 'Dashboard']" />

        <!-- Main Dashboard Body -->
        <div class="dashboard-body d-flex flex-column h-100 py-4">
            <ContentBlock
                :width="100"
                :height="100"
                :maxWidth="1600"
                :unit="'%'"
                :maxUnit="'px'"
                :bg-color="'#FFF'"
            >
                <!-- <LoanStatusItem/> -->
                <LoanLedger />
            </ContentBlock>
        </div>
    </div>
</template>

<style></style>
