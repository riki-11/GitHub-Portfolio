<script setup>
// Packages
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// Vue components
import ContentBlock from '../components/ContentBlock.vue'
import DashboardTopBar from '../components/DashboardTopBar.vue'
import StepCounterLoanTransaction from '../components/StepCounterNewTransaction.vue'

// Project constants needed
import { PATH_NAMES } from '../constants'

const step = ref('1')

function updateStepCounter(to) {
    if (to.endsWith(PATH_NAMES.LOAN_TRANSACTIONS.MEMBER_INPUT)) {
        step.value = '1'
    } else if (to.endsWith(PATH_NAMES.LOAN_TRANSACTIONS.TRANSACTION_DETAILS)) {
        step.value = '2'
    }
}

// Watch for route changes then change the step accordingly
const route = useRoute()
watch(() => route.path, updateStepCounter)

onMounted(() => updateStepCounter(route.path))
</script>

<template>
    <div class="d-flex flex-column w-100 pl-8">
        <!-- Top Bar of Dashboard -->
        <DashboardTopBar :breadcrumbs="['Loans', 'Enter Loan Transaction']" />

        <!-- Main Dashboard Body -->
        <div class="dashboard-body d-flex flex-column h-100 py-4">
            <h2>Enter Loan Transaction</h2>
            <ContentBlock
                :width="100"
                :height="100"
                :maxWidth="80"
                :unit="'%'"
                :maxUnit="'vw'"
                :bg-color="'#FFF'"
            >
                <StepCounterLoanTransaction :step="step" />
            </ContentBlock>

            <ContentBlock
                :width="100"
                :height="100"
                :maxWidth="80"
                :unit="'%'"
                :maxUnit="'vw'"
                :bg-color="'#FFF'"
            >
                <RouterView />
            </ContentBlock>
        </div>
    </div>
</template>

<style></style>
