<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-12 col-md-10 col-lg-8">
                <div class="card bg-light">
                    <p class="h5 my-3 text-center" style="color:#008EAB;">Bienvenue sur le réseau social interne Groupomania</p>
                    <div class="card-header bg-light d-flex flex-column justify-content-center">
                        <img src="../assets/icon-left-font-monochrome-black.svg" class="m-0 p-0" height="60" alt="logo groupomania">
                        <h5 class="h6 text-center" style="color:#008EAB;">Informations utiles !</h5>
                    </div>
                    <div class="card-body">
                        <p>Cette application est strictement réservée au personnel du groupe.</p>
                        <p>Pour y accéder, merci de vous <router-link to="/signin">connecter</router-link> ou de vous <router-link to="/signup">inscrire</router-link> si vous ne l'avez pas encore fait.</p>
                    </div>
                    <div class="card-footer bg-light d-flex justify-content-between">
                        <span class="text-dark">Bonne navigation !</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    Name: "Accueil"
}
</script>
