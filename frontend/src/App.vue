<template>
  <div id="app">
    <NavHeader></NavHeader>
    <router-link to="/"></router-link>
    <router-view/>
  </div>
</template>

<script>
import NavHeader from "./views/NavHeader"
export default {
    name: "App",
    components: { 
        NavHeader
    }
}
</script>

