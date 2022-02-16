<template>
    <div id="modalDropComment" tabindex="-1" aria-labelledby="modalDropComment" aria-hidden="false">
        <div class="modal-dialog">
            <div class="modal-content border border-danger">
                <form enctype="multipart/form-data">
                    <div class="modal-header d-flex flex-column flex-md-row align-items-center justify-content-start">
                        <p class="modal-title h5 mr-1 text-danger">Supprimer le commentaire ?</p>
                        <p class="modal-title mt-1" :class="editorColor">{{editorTag}}</p>
                    </div>
                    <div class="row modal-body">
                        <div class="col-12 justify-content-center form-group">
                            <label for="editComment" class="sr-only">Commentaire :</label>
                            <textarea class="form-control" v-model="editComment" id="editComment" name="comment" rows="10" disabled></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <div class="row w-100 justify-content-spacebetween">
                            <div class="col-6"><a :href="postId" class="btn btn-secondary btn-block">Annuler</a></div>
                            <div class="col-6"><button type="submit" @click.prevent="deleteComment()" class="btn btn-success btn-block">Valider</button></div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios"
import router from "../router"
import Swal from "sweetalert2"
export default {
    name: "Comment Drop",
    data() {
        return {
            editComment: "",
            editUserId: "",
            editorTag: "",
            editorColor: "text-secondary",
            postId: ""
        }
    },
    methods: {
        deleteComment() {
            axios.delete("http://localhost/api/comments/" + this.$route.params.id, { headers: { "Authorization": "Bearer " + localStorage.getItem("token")}})
            .then(res => {
                if (res.status === 200) {
                    Swal.fire({
                        text: "Le commentaire à été supprimé !",
                        footer: "Redirection en cours...",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false,
                        timerProgressBar: true,
                        willClose: () => { router.push(this.postId.slice(1)); this.postId = "" }
                    })
                }
            })
            .catch(function(error) {
                const codeError = error.message.split("code ")[1]
                let messageError = ""
                switch (codeError) {
                    case "400": messageError = "Le commentaire n'a pas été supprimé !"; break
                    case "401": messageError = "Requête non-authentifiée !"; break
                }
                Swal.fire({
                    title: "Une erreur est survenue",
                    text: messageError || error.message,
                    icon: "error",
                    timer: 1500,
                    showConfirmButton: false,
                    timerProgressBar: true
                })  
            })
        }
    },
    beforeMount () {
        axios.get("http://localhost/api/comments/" + this.$route.params.id, { headers: { "Authorization": "Bearer " + localStorage.getItem("token")}})
        .then(res => {
            if (res.data === null) {
                Swal.fire({
                    title: "Une erreur est survenue",
                    text: "Ce commentaire n'existe pas !",
                    icon: "error",
                    timer: 1500,
                    showConfirmButton: false,
                    timerProgressBar: true,
                    willClose: () => { router.push("/posts") }
                })
            }
            this.editUserId = res.data.UserId
            this.postId = "/comments/" + res.data.PostId
            if (this.editUserId == localStorage.getItem('userId')) {
                this.editorTag = "( Utilisateur : " + res.data.username + " )"
                this.editComment = res.data.comment
            } else if (localStorage.getItem('roles') == "true") {
                this.editorTag = "( Administrateur : " + localStorage.getItem('username') + " )"
                this.editComment = res.data.comment
                this.editorColor = "text-danger"
            } else {
                Swal.fire({
                    title: "Une erreur est survenue",
                    text: "Vous n'avez pas accès à cette fonctionnalité !",
                    icon: "error",
                    timer: 1500,
                    showConfirmButton: false,
                    timerProgressBar: true,
                    willClose: () => { router.push(this.postId) }
                })  
            }
        })
    }
}
</script>