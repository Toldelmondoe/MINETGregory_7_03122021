<template>
    <div id="navbarContent" class="m-0 p-0 justify-content-end align-self-center">
        <div class="nav-item dropdown m-0 p-0">
            <a class="nav-item navbar-link m-0 p-0" href="" data-toggle="dropdown" id="my_account" aria-haspopup="true" aria-expanded="false">
                <span class="navbar-toggler-icon"></span>
            </a>
            <div class="container">
                <div class="btn-group-vertical" role="group" aria-label="Groupe de boutons en colonne">
                    <button type="button" class="btn btn-info mb-4 active">Se connecter</button>
                    <button type="button" class="btn btn-info mb-3 active">S'enregistrer</button>
                </div>
            </div>
        </div>           
    </div>
</template>

<script>
export default {
    name: "NavDefault"
}
</script>