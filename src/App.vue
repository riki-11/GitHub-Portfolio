<template>
  <div class="forlanding">
    <Landing v-if="showLanding" />  
  </div>
  <router-view></router-view>
</template>

<script>
import Landing from './components/Landing.vue'

export default {
  name: 'App',
  components: {
    Landing
  },
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

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Poppins', sans-serif; 
}

body {

  background: linear-gradient(-45deg, #383364, #2c2751, #1f1a3e, #140e2b, #0c051a);
  animation: gradient 5s ease infinite;
	height: 100vh;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

@keyframes gradient {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
}


</style>
