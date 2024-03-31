<template>
    <div>
        <div class="input-form">

            <div id="top-half">
                <div class="title-prompt">
                    <div class="title">
                        <img id="logo" :src="require('@/assets/logo.png')" alt="">
                        <h3>SereniGuide</h3>
                    </div>
                    <h1>Learn Your Sleep Habits</h1>
                    <h3>start your tracking today</h3>
                </div>
                <div class="image-container">
                    <img id="moon" :src="require('@/assets/moon.png')" alt="Image" />
                </div>
            </div>

            <div id="bottom-half">
                <form class="form-container" action="">
                    <div class="form1">
                        <div class="form-floating mb-3">
                            <input type="number" class="form-control inpt" id="age" placeholder="test" required>
                            <label for="age">1&rpar; Age</label>
                        </div>
                        <div class="form-floating mb-3">
                            <input type="number" class="form-control inpt" id="sleep-duration" placeholder="test"
                                required>
                            <label for="sleep-duration">2&rpar; Duration of Sleep (Hours)</label>
                        </div>
                        <div id="awake-floating" class="form-floating mb-3">
                            <input type="number" class="form-control inpt" id="awakenings" placeholder="test" required
                                data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                data-bs-offset="0,10"
                                data-bs-title="Refers to the number of awakenings during the night (sleep duration).">
                            <label for="awakenings">3&rpar; No. of Awakenings</label>
                        </div>
                    </div>
                    <div class="form2">
                        <div class="form-floating">
                            <select class="form-select smokeselect inpt" id="smoking"
                                aria-label="Floating label select example">
                                <option value="">Select...</option>
                                <option value=1>Yes</option>
                                <option value=0>No</option>

                            </select>
                            <label for="smoking">4&rpar; Do you smoke?</label>
                        </div>
                        <div class="form-floating mb-3">
                            <input type="number" class="form-control inpt" id="exercise" placeholder="test" required>
                            <label for="exercise">5&rpar; Weekly Exercise Frequency</label>
                        </div>
                        <div class="form-floating mb-3">
                            <input type="number" class="form-control inpt" id="caffeine" placeholder="test" required
                                data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                data-bs-offset="0,10"
                                data-bs-title="Refers to alcohol taken per day. Assumes a cup of coffee contains around 90mg of Caffeine.">
                            <label for="caffeine">6&rpar; No. of Coffee Cups</label>
                        </div>
                        <div class="form-floating mb-3">
                            <input type="number" class="form-control inpt" id="alcohol" placeholder="test" required
                                data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip"
                                data-bs-offset="0,10"
                                data-bs-title="Refers to alcohol taken per day. Assumes a standard drink contains 14g or 0.6 ounces of alcohol.">
                            <label for="alcohol">7&rpar; No. of Alcoholic Drinks</label>
                        </div>
                    </div>
                </form>
                <br>
                <div id="btn-div">
                    <input type="button" value="Submit" class="btn-s" @click="handleSubmit">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'Input-Form',
    mounted() {
        // Enable Bootstrap tooltips
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl, {
            customClass: 'custom-tooltip'
        }))

    },
    methods: {
        validateForm() {
            // Get references to form fields
            const age = document.getElementById('age').value;
            const sleepDuration = document.getElementById('sleep-duration').value;
            const awakenings = document.getElementById('awakenings').value;
            const smoking = document.getElementById('smoking').value;
            const exercise = document.getElementById('exercise').value;
            const caffeine = document.getElementById('caffeine').value;
            const alcohol = document.getElementById('alcohol').value;
            // Validate each field
            if (!age || !sleepDuration || !awakenings || !smoking || !exercise || !caffeine || !alcohol) {
                alert('Please fill in all fields.');
                return false; // Prevent form submission
            }
            // You can add more specific validation logic here if needed
            return true; // Form is valid, allow submission
        },
        handleSubmit() {
            let recoValues = [0, 0, 0, 0, 0];
            if (this.validateForm()) {
                // Gather form data
                const age = document.getElementById('age').value;
                const sleepDuration = document.getElementById('sleep-duration').value;
                const awakenings = document.getElementById('awakenings').value;
                const smoking = document.getElementById('smoking').value;
                const exercise = document.getElementById('exercise').value;
                var caffeine = document.getElementById('caffeine').value;
                var alcohol = document.getElementById('alcohol').value;

                caffeine = caffeine * 90;
                alcohol = alcohol * 14000;

                // Form data object
                const formData = {
                    age,
                    sleepDuration,
                    awakenings,
                    caffeine,
                    alcohol,
                    smoking,
                    exercise
                };

                recoValues = this.getRecommendations(formData)
                const formDataArray = [formData]

                document.getElementById('age').value = "";
                document.getElementById('sleep-duration').value = "";
                document.getElementById('awakenings').value = "";
                document.getElementById('smoking').value = "";
                document.getElementById('exercise').value = "";
                document.getElementById('caffeine').value = "";
                document.getElementById('alcohol').value = "";

                console.log(recoValues)

                // Make Axios POST request
                axios.post('http://127.0.0.1:5000/input', formDataArray)
                    .then(response => {
                        // Handle response data as needed
                        // Redirect to results page
                        
                        this.$router.push({
                            path: '/results',
                            query: { responseData: JSON.stringify(response.data), recoValues: JSON.stringify(recoValues)}
                        });
                    })
                    .catch(error => {
                        console.error('Error submitting form:', error);
                    });
            
            }
        },
        getRecommendations(formData) {
            // Initialize Array
            let values = Array(5).fill(0);

            // Duration of Sleep (connected with age)
            if (formData.age == 0) {
                if (formData.sleepDuration < 11) {
                    values[0] = 1;
                }
            }
            else if (formData.age >= 1 && formData.age <= 5) {
                if (formData.sleepDuration < 9) {
                    values[0] = 2;
                }
            }
            else if (formData.age >= 6 && formData.age <= 13) {
                if (formData.sleepDuration < 7) {
                    values[0] = 3;
                }
            }
            else if (formData.age >= 14 && formData.age <= 17) {
                if (formData.sleepDuration < 7) {
                    values[0] = 4;
                }
            }
            else if (formData.age >= 18 && formData.age <= 25) {
                if (formData.sleepDuration < 6) {
                    values[0] = 5;
                }
            }
            else if (formData.age >= 26 && formData.age <= 64) {
                if (formData.sleepDuration < 6) {
                    values[0] = 6;
                }
            }   
            else if (formData.age >= 65) {
                if (formData.sleepDuration < 5) {
                    values[0] = 7;
                }
            }
            
            // No. of Awakenings
            if (formData.awakenings >= 2) {
                values[1] = 1;
            }

            // Smoke
            if (formData.smoking == 1) {
                values[2] = 1;
            }

            // Weekly Exercise Frequency
            if (formData.exercise <= 1) {
                values[3] = 1;
            }

            // No. of Coffee Cups
            if ((formData.caffeine / 90) >= 3){
                values[4] = 1;
            }

            return values;
        }
    }
}
</script>

<style>
.custom-tooltip {
    --bs-tooltip-bg: #191919f5 !important;
    --bs-tooltip-color: var(--bs-white);
    --bs-tooltip-font-size: .70vw !important;
}
</style>

<style scoped>
#logo {
    height: 1.6vw;
}

.title {
    display: flex;
    flex-direction: row;
    gap: 10px;
}

#top-half {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 10vw;
    width: 100%;
    height: 30%;
    color: #fff;
    padding: 15px;
    margin-bottom: 30px;
}

.title-prompt h3 {
    font-size: 1.6vw;
}

.title-prompt h1 {
    font-size: 4.2vw;
    font-weight: bold;
}

#bottom-half {
    width: 100%;
}

#moon {
    width: 15vw;
}

.form-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1vw;
    width: 100%;
    height: auto;
    color: #fff;
}

.form1 .form-floating {
    width: 25%;
    height: 80%;
}

.form2 .form-floating {
    width: 25%;

}

.inpt {
    border-radius: 10px;
    background: #19191952;
    color: #fff;

}

.form-floating>.form-control-plaintext:focus,
.form-floating>.form-control-plaintext:not(:placeholder-shown),
.form-floating>.form-control:focus,
.form-floating>.form-control:not(:placeholder-shown) {
    padding-top: 2.2rem;
    padding-bottom: 0.625rem;
}

.form-floating>.form-select {
    padding-top: 1.8rem;
    padding-bottom: 0.625rem;
}

label {
    color: #e7e7e7 !important;
    background-color: transparent !important;
    font-size: 0.90vw;
    font-weight: 590;
}

label:after {
    background-color: transparent !important;
}

select option {
    background-color: #1b142c;
}


.inpt:focus {
    background: transparent;
    color: #fff;
}


.form1 {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-basis: start;
    gap: 1.5vw;
    width: 100%;
}

.form2 {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 1.5vw;
    width: 100%;
}

.btn-s {
    background-color: #fff;
    color: #000;
    height: 3vw;
    width: 10vw;
    padding: 0.25vw 0.75vw;
    margin: 5px;
    border: 2px solid #fff;
    border-radius: 20vw;
    cursor: pointer;
    text-decoration: none;
    font-size: 1.3vw;
    font-family: inherit;
    transition: background-color 0.4s, color 0.4s;
}

.btn-s:hover {
    color: #fff;
    background-color: #383364;
    border: 2px solid #fff;
}

#btn-div {
    width: 100%;
    display: flex;
    justify-content: center;
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
