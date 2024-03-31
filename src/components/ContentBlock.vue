<script setup>

    // Dynamically define the width and height of the block.
    defineProps({
        width: [Number, String],
        height: [Number, String],
        maxWidth: {
            type: [Number, String],
            default: null
        },
        maxHeight: {
            type: [Number, String],
            default: null
        },
        unit: String, // for width and height
        maxUnit: String, // for maxWidth and maxHeight
        bgColor: {
            type: String,
            default: '#FFF'
        },
        margin: {
            type: [Number, String],
            default: '0' // Default margin value
        },
        padding: {
            type: [Number, String],
            default: '0.5' // Default padding value
        }
    });
</script>

<template>
    <!-- Dynamically set the width and height of the content block  -->
    <div class="elevation-5 rounded-lg" 
        :style="{
                width: `${width}${unit}`, 
                height: `${height}${unit}`, 
                maxWidth: `${maxWidth}${maxUnit}`,
                maxHeight: `${maxHeight}${maxUnit}`,
                backgroundColor: `${bgColor}`,
                margin: `${margin}${unit}`,
                padding: `${padding}${unit}`,
            }"
    >
        <slot></slot>
    </div>
</template>
