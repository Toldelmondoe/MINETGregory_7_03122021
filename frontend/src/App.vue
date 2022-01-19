<template>
    <div id="app">
      <Accueil></Accueil>
      <router-view></router-view>
    </div>
</template>

<script>
import Accueil from './components/Accueil.vue'
export default {
    name: "App",
    components: {
        Accueil
    }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
