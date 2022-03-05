<template>
    <div class="container">
        <div class="row">
            <nav class="col navbar mb-3">
                <NavBrand v-if="isLogged"></NavBrand>
                <NavUserMenu v-if="isLogged"></NavUserMenu>
            </nav>
        </div>
    </div>
</template>

<script>
import NavBrand from "./NavBrand"
import NavUserMenu from "./NavUserMenu"
export default {
    name: "NavHeader",
    components: { 
        NavBrand,
        NavUserMenu
    },
    computed:{
        isLogged() {
            if (localStorage.getItem("token") !== null) {   
                return true
            }
            return false
        }
    }
}
</script>