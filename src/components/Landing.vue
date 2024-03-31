<template>
    <div v-if="showLanding" id="welcome">
        <div id="text-container">
            <img id="main-logo" :src="require('@/assets/logo.png')" alt="">
            <h1 id="welcome-text">SereniGuide</h1>
        </div>
        <router-link v-if="showButton" to="/input"><button>Get Started</button></router-link>
    </div>
</template>

<script>
export default {
    name: 'Landing',
    data() {
        return {
            showLanding: true,
            showButton: true 
        };
    },
    created() {
        this.$router.beforeEach((to, from, next) => {
            if (to.path === '/') {
                this.showLanding = true;
                this.showButton = true;
            } else {
                this.showLanding = false;
                this.showButton = false;
            }
            next();
        });
    }
}
</script>

<style scoped>
body {
    display: flex;
    justify-content: center;
}

#welcome {
    display: flex;
    margin: auto;
    justify-content: center;
    align-items: center;
    width: 65%;
    height: 100%;
    color: #111;
    flex-direction: column;
}

#text-container {
    display: flex;
    align-items: center;
    gap: 25px;
}

#welcome-text{
    font-size: 7vw;
    color: #fff;
}

#main-logo{
    height: 7vw;
}

button {
    background-color: #fff;
    color: #000;
    height: 3.5vw; 
    width: 12vw; 
    padding: 0.25vw 0.75vw; 
    margin: 5px;
    border: 2px solid #fff; 
    border-radius: 20vw;
    cursor: pointer;
    text-decoration: none;
    font-size: 1.5vw; 
    font-family: inherit;
    transition: background-color 0.4s, color 0.4s; 
}

button:hover {
    color: #fff;
    background-color: #383364;
    border: 2px solid #fff; 
}

</style>