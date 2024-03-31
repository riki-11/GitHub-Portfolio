<script setup>
import { ref } from 'vue'

// Import vue components
import ContentBlock from '../components/ContentBlock.vue'
import DashboardTopBar from '../components/DashboardTopBar.vue'
import LoanStatusItem from '../components/loans/LoanStatusItem.vue'

const tab = ref('pending')
</script>

<template>
    <div class="d-flex flex-column w-100 pl-8">
        <!-- Top Bar of Dashboard -->
        <DashboardTopBar :breadcrumbs="['Loans', 'Pending Loans']" />

        <!-- Main Dashboard Body -->
        <div class="dashboard-body d-flex flex-column h-100 py-4">
            <h2>Pending Loans</h2>

            <ContentBlock :width="100" :height="100" :maxWidth="100" :unit="'%'" :bg-color="'#FFF'">
                <div class="d-flex flex-column ml-2">
                    <v-tabs v-model="tab" color="primary">
                        <v-tab value="pending">
                            <div class="capitalize">Pending Loans</div>
                        </v-tab>

                        <v-tab value="rejected">
                            <div class="capitalize">Rejected</div>
                        </v-tab>

                        <v-tab value="complete">
                            <div class="capitalize">Complete</div>
                        </v-tab>
                    </v-tabs>

                    <v-window v-model="tab" class="ml-5 mt-2">
                        <v-window-item value="pending">
                            <LoanStatusItem />
                        </v-window-item>

                        <v-window-item value="rejected">
                            <LoanStatusItem status="rejected" />
                        </v-window-item>

                        <v-window-item value="complete">
                            <LoanStatusItem status="complete" />
                        </v-window-item>
                    </v-window>
                </div>
            </ContentBlock>
        </div>
    </div>
</template>

<style></style>
