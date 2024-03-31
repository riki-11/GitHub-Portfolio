<script setup>
// Import vue components
import { ref } from 'vue'

import ContentBlock from '../../components/ContentBlock.vue'
import DepositSettingsTable from '../../components/settings/DepositSettingsTable.vue'

const tab = ref('option-1')
</script>

<template>
    <ContentBlock :width="100" :height="100" :unit="'%'" :padding="3">
        <h3>Deposit Settings</h3>

        <div class="d-flex flex-row mt-2">
            <v-tabs v-model="tab" direction="vertical" color="primary" class="mt-9">
                <v-tab value="share-capital">
                    <div class="capitalize">Share Capital</div>
                </v-tab>

                <v-tab value="savings">
                    <div class="capitalize">Savings</div>
                </v-tab>

                <v-tab value="time-deposit">
                    <div class="capitalize">Time Deposit</div>
                </v-tab>
            </v-tabs>

            <v-window v-model="tab" class="ml-2 w-100">
                <v-window-item value="share-capital">
                    <DepositSettingsTable :header="`Share Capital`" />
                </v-window-item>

                <v-window-item value="savings">
                    <DepositSettingsTable :header="`Savings`" />
                </v-window-item>

                <v-window-item value="time-deposit">
                    <DepositSettingsTable :header="`Time Deposit`" />
                </v-window-item>
            </v-window>
        </div>
    </ContentBlock>
</template>
