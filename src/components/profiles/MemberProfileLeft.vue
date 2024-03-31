<script setup>
// Import stores
import { useProfileDataStore } from '../../stores/profileData.js'
const { profileData } = useProfileDataStore()

// Components
import ContentBlock from '../ContentBlock.vue'
</script>

<template>
    <!-- Details -->
    <ContentBlock :width="100" :height="100" :unit="'%'" :padding="3" v-if="profileData.username">
        <div class="d-flex">
            <v-icon icon="mdi-account-circle" size="large" class="mt-1 mr-2" />
            <h2>{{ profileData.username }}</h2>
        </div>
        <div class="ml-9">
            <div class="row-tab">
                <div class="label">
                    <h3>Name</h3>
                </div>
            </div>
            <div class="row-tab">
                <div class="sub-label">Last</div>
                <div class="field">{{ profileData.name.last }}</div>
            </div>
            <div class="row-tab">
                <div class="sub-label">First</div>
                <div class="field">{{ profileData.name.given }}</div>
            </div>
            <div class="row-tab" v-if="profileData.name.middle">
                <div class="sub-label">Middle</div>
                <div class="field">{{ profileData.name.middle }}</div>
            </div>

            <v-divider class="mt-2"></v-divider>

            <div class="row-tab pt-2">
                <div class="sub-label">Birthday</div>
                <div class="field">
                    {{
                        new Date(profileData.birthday).toLocaleDateString('en-PH', {
                            dateStyle: 'long'
                        })
                    }}
                </div>
            </div>

            <div class="row-tab pt-2">
                <div class="sub-label">Birthplace</div>
                <div class="field">{{ profileData.birthplace }}</div>
            </div>

            <div class="row-tab pt-2">
                <div class="sub-label">Gender</div>
                <div class="field">{{ profileData.sex }}</div>
            </div>

            <div class="row-tab pt-2">
                <div class="sub-label">Civil Status</div>
                <div class="field">{{ profileData.civil_status }}</div>
            </div>

            <div class="row-tab pt-2">
                <div class="sub-label">Tin Number</div>
                <div class="field">{{ profileData.tin_no }}</div>
            </div>

            <div class="row-tab pt-2">
                <div class="sub-label">Occupation</div>
                <div class="field">{{ profileData.occupation }}</div>
            </div>

            <v-divider class="mt-2"></v-divider>

            <div class="row-tab pt-2">
                <div class="label">
                    <h3>Address</h3>
                </div>
            </div>
            <div class="row-tab">
                <div class="sub-label">Street</div>
                <div class="field">{{ profileData.address.street }}</div>
            </div>
            <div class="row-tab">
                <div class="sub-label">Barangay</div>
                <div class="field">{{ profileData.address.barangay }}</div>
            </div>
            <div class="row-tab">
                <div class="sub-label">City</div>
                <div class="field">{{ profileData.address.city }}</div>
            </div>
            <div class="row-tab">
                <div class="sub-label">Province</div>
                <div class="field">{{ profileData.address.province }}</div>
            </div>

            <div v-if="profileData.spouse">
                <v-divider class="mt-2"></v-divider>

                <div class="row-tab pt-2">
                    <h3 class="label">Spouse</h3>
                </div>
                <div class="row-tab">
                    <div class="sub-label">Last</div>
                    <div class="field">{{ profileData.spouse.name.last }}</div>
                </div>
                <div class="row-tab">
                    <div class="sub-label">First</div>
                    <div class="field">{{ profileData.spouse.name.given }}</div>
                </div>
                <div class="row-tab" v-if="profileData.spouse.name.middle">
                    <div class="sub-label">Middle</div>
                    <div class="field">{{ profileData.spouse.name.middle }}</div>
                </div>
            </div>
        </div>
    </ContentBlock>
</template>

<!-- Stylesheet -->
<style scoped>
.bborder {
    border: 1px solid black;
}
.form-wrapper {
    background: var(--vt-c-white);
}

.row-tab {
    /* border: 1px solid black; */
    display: flex;
    /* margin-bottom: 1%; */
}

.label {
    margin-right: 2%;
    width: 25%;

    display: inline-block;
    vertical-align: top;
}

.sub-label {
    color: var(--vt-c-gray-dark);
    margin-right: 2%;
    margin-left: 10%;
    width: 30%;

    display: inline-block;
    vertical-align: top;
}

.field {
    text-align: right;
    font-weight: 500;
}

.btn {
    color: var(--vt-c-white-off);
    font-weight: 600;
    background: var(--vt-c-blue);

    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.btn-wrapper {
    height: min-content;
    display: flex;
    justify-content: flex-end;
    margin-top: 2%;
}

.capitalize-text {
    text-transform: capitalize;
}

.btn:hover {
    background: var(--vt-c-blue-dark);
}
</style>
