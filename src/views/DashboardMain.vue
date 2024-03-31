<script setup>
// Import vue components
import ContentBlock from '../components/ContentBlock.vue'
import DashboardTopBar from '../components/DashboardTopBar.vue'
import CentralLoanBlock from '../components/loans/CentralLoanBlock.vue'
</script>

<template>
    <div class="d-flex flex-column w-100 pl-8">
        <!-- Top Bar of Dashboard -->
        <DashboardTopBar :breadcrumbs="['Loans', 'Loan Dashboard']" />
        <h2>Loan Dashboard</h2>

        <!-- Main Dashboard Body -->
        <div class="dashboard-body d-flex flex-column h-100 py-4">
            <ContentBlock :width="100" :height="100" :unit="'%'" :bg-color="'#FFF'">
                <CentralLoanBlock />
            </ContentBlock>
        </div>
    </div>
</template>

<style></style>
