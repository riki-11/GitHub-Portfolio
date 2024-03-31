<template>
    <div id="top-half">
        <div id="results">
            <div class="image-container">
                    <img v-if="sleepType === 'Deep Sleep'" id= "moon" :src="require('@/assets/moonv3.png')" alt="Image" />
                    <img v-else-if="sleepType === 'Light Sleep'" id= "moon" :src="require('@/assets/light-sleep-icon.png')" alt="Image" />
            </div>
            <h1>Your sleep last night showed more signs of </h1>
            <h1 id="type" class="type">{{ sleepType }}</h1>
        </div>
        <div class="button-container">
            <!-- <router-link to="/save"><button>Save Results</button></router-link> -->
            <router-link to="/"><button>Retake</button></router-link>
        </div>
        <span class="disclaimer">Disclaimer: This is not a professional diagnosis. Please consult a healthcare professional for a proper diagnosis.</span>
        <div class="text-container">
            <div class="pdx">
            <h4>Additional Information</h4>
            <h5>Light Sleep - The stage of sleep where your heart rate decreases, your body temperature drops, 
                and your breathing slows. This phase only lasts for 10 to 25 minutes. </h5>
            <h5>Deep Sleep - The stage of sleep that allows the the body to repair and regrow tissues, build bones 
                and muscles, and helps strengthen the immune system. Deep sleep ideally comprises 70% of your sleep 
                time: around 105 - 120 minutes for a healthy 8 hours.  </h5>

            <br>
                
            <h4 v-if="!areAllValuesZero(values)">Recommendations</h4>

            <h5 v-if="values[0] === 1">It seems like you're not getting enough sleep. For your age range (below 1 year old), The National Sleep Foundation recommends your sleep lasts between 12 to 17 hours.<br></h5>
            <h5 v-if="values[0] === 2">It seems like you're not getting enough sleep. For your age range (1-5 years old), The National Sleep Foundation recommends your sleep lasts between 10 to 14 hours.<br></h5>
            <h5 v-if="values[0] === 3">It seems like you're not getting enough sleep. For your age range (6-13 years old), The National Sleep Foundation recommends your sleep lasts between 9 to 11 hours.<br></h5>
            <h5 v-if="values[0] === 4">It seems like you're not getting enough sleep. For your age range (14-17 years old), The National Sleep Foundation recommends your sleep lasts between 8 to 10 hours.<br></h5>
            <h5 v-if="values[0] === 5">It seems like you're not getting enough sleep. For your age range (18-25 years old), The National Sleep Foundation recommends your sleep lasts between 7 to 9 hours.<br></h5>
            <h5 v-if="values[0] === 6">It seems like you're not getting enough sleep. For your age range (26-64 years old), The National Sleep Foundation recommends your sleep lasts between 7 to 9 hours.<br></h5>
            <h5 v-if="values[0] === 7">It seems like you're not getting enough sleep. For your age range (65 years old and above), The National Sleep Foundation recommends your sleep lasts between 7 to 8 hours.<br></h5>

            <h5 v-if="values[1] === 1">It appears that you've been waking up frequently in the middle of the night. This could be due to increased exposure to blue light before bedtime or consuming caffeine. If the issue persists, it's advisable to consult a doctor for further evaluation and guidance.<br></h5>

            <h5 v-if="values[2] ===1">Tobacco and nicotine usage are detrimental to sleep quality. Their addictive properties stimulate the brain and lead to nocturnal awakenings, insomnia, and sleep disturbance. Smoking also interferes with respiratory functions, sometimes leading to sleep apnea. SereniGuide recommends you reduce or cease your nicotine intake.<br></h5>

            <h5 v-if="values[3] ===1">It seems that you're not getting sufficient exercise. Engaging in aerobic activities such as jogging or swimming can significantly improve your sleep quality. However, low-intensity exercises like yoga may not have a noticeable impact on your sleep.<br></h5>

            <h5 v-if="values[4] ===1">It appears that you're consuming a significant amount of coffee. We recommend reducing your coffee intake. Additionally, try to consume it earlier in the day, as doctors advise having your last cup at least 10 hours before bedtime.<br></h5>

            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Results',
    data() {
        return {
            sleepType: '',
            sleepTypeIcon: '',
            values: []
        };
    },
    mounted() {
        const responseData = JSON.parse(this.$route.query.responseData);
        const recoValues = JSON.parse(this.$route.query.recoValues);
        
        const type = responseData[0]
        if (type === 0) {
            this.sleepType = 'Deep Sleep';
            this.sleepTypeIcon = '@/assets/moonv3.png';
        } else if (type === 1) {
            this.sleepType = 'Light Sleep';
            this.sleepTypeIcon = '@/assets/light-sleep-icon.png';
        } else {
            this.sleepType = 'Sleep Type Cannot Be Determined';
        }

        this.values = recoValues;
    },
    methods: {
        areAllValuesZero(values) {
            return values.every(value => value === 0);
        }
    }
}
</script>

<style scoped>
#top-half {
    display: flex;
    flex-direction: column;
    justify-content: center; 
    align-items: center; 
    height: 100vh;
    color: #fff;
    padding: 15px;
}

.image-container {
    display: flex; 
    justify-content: center;
    align-items: center; 
    margin-bottom: 10px;
}

#moon {
    width: 11vw;
}

.type {
    font-weight: bold;
    text-align: center;
}

.button-container {
    margin-top: 10px;
    display: flex;
    gap: 15px; 
}

.text-container {
    background-color:#19191952;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center; 
    width: 55%;
    margin: auto;
    color: #fff;
    padding: 15px;
    text-align: justify;
    text-justify: inter-word;
}

.pdx{
    margin: 15px;
    height: 200px;
    overflow-y: auto;
    padding-right: 10px
}

/* width */
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 5px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 5px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

button {
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
    font-size: 1.2vw; 
    font-family: inherit;
    transition: background-color 0.4s, color 0.4s; 
}

button:hover {
    color: #fff;
    background-color: #383364;
    border: 2px solid #fff; 
}

.disclaimer {
    margin-top: 5px;
    font-size: 0.8vw;
    margin-bottom: 35px;
}

h1 {
    font-size: 2.5vw;
    text-align: center;

}

h4 {
    font-weight: bold;
    font-size: 1.4vw;
}

h5 {
    font-size: 1.0vw;
    margin-top: 5px;
    margin-bottom: 5px;
}

</style>
