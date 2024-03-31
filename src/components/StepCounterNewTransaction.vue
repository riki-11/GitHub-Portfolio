<script setup>
// Import packages
import { watch } from 'vue'

// Import components
import StepCounterTimelineItem from '../components/StepCounterTimelineItem.vue'

let props = defineProps({
    step: {
        type: String,
        default: '1'
    }
})

let step1DotColor = 'var(--vt-c-blue-dark)'
let step1Icon = 1
let step2DotColor = 'var(--vt-c-blue)'
let step2Icon = 2

// Watch props.step and change accordingly
watch(
    () => props.step,
    (step) => {
        if (step === '1') {
            step1DotColor = 'var(--vt-c-blue-dark)'
            step1Icon = 1
            step2DotColor = 'var(--vt-c-blue)'
            step2Icon = 2
        } else if (step === '2') {
            step2DotColor = 'var(--vt-c-blue-dark)'
            step1DotColor = 'var(--vt-c-green)'
            step1Icon = 0
            step2Icon = 2
        }
    }
)
</script>

<template>
    <!-- TODO: Make this much more skinnier -->
    <div class="step-wrapper">
        <v-timeline
            direction="horizontal"
            line-thickness="3"
            truncate-line="both"
            line-inset="5"
            side="end"
        >
            <StepCounterTimelineItem
                :dotColor="step1DotColor"
                :icon="step1Icon"
                :def="'Search Member'"
            >
            </StepCounterTimelineItem>

            <StepCounterTimelineItem
                :dotColor="step2DotColor"
                :icon="step2Icon"
                :def="'Fill up form'"
            >
            </StepCounterTimelineItem>
        </v-timeline>
    </div>
</template>

<style scoped>
.step-wrapper {
    padding: 5%;
    padding-top: 2%;
    padding-bottom: 2%;
    overflow: auto;
}
</style>
