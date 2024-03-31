<script setup>
// Import packages
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// Import components
import ContentBlock from '../components/ContentBlock.vue'
import StepCounter from '../components/loans/StepCounterLoanApp.vue'
import DashboardTopBar from '../components/DashboardTopBar.vue'

// Import path name constants
import { PATH_NAMES } from '../constants'

// Define reactive variables
const step = ref('1')

function updateStepCounter(to) {
    if (to.endsWith(PATH_NAMES.APP_FORM.MEMBER_INPUT)) {
        step.value = '1'
    } else if (to.endsWith(PATH_NAMES.APP_FORM.APPLICATION_DETAILS)) {
        step.value = '2'
    } else if (to.endsWith(PATH_NAMES.APP_FORM.EXPORT_FORM)) {
        step.value = '3'
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
        <DashboardTopBar :breadcrumbs="['Loans', 'Create a New Loan Application']" />

        <!-- Main Dashboard Body -->
        <div class="dashboard-body d-flex flex-column h-100 py-4">
            <h2>Create a New Loan Application</h2>
            <div class="dashboard-body d-flex flex-column h-100 py-4">
                <ContentBlock :width="100" :height="100" :unit="'%'" :bg-color="'#FFF'">
                    <StepCounter :step="step" />
                </ContentBlock>

                <ContentBlock :width="100" :height="100" :unit="'%'" :bg-color="'#FFF'">
                    <RouterView />
                </ContentBlock>
            </div>
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
</style>
