<template>
    <div id="modalEditComment" tabindex="-1" aria-labelledby="modalEditComment" aria-hidden="false">
        <div class="modal-dialog">
            <div class="modal-content">
                <form enctype="multipart/form-data">
                    <div class="modal-header d-flex flex-column flex-md-row align-items-center justify-content-start">
                        <p class="modal-title h5 mr-1">Editer commentaire</p>
                        <p class="modal-title mt-1" :class="editorColor">{{editorTag}}</p>
                    </div>
                    <div class="row modal-body">
                        <div class="col-12 justify-content-center form-group">
                            <label for="editComment" class="sr-only">Commentaire :</label>
                            <textarea class="form-control" v-model="editComment" id="editComment" name="content" rows="10" placeholder="Votre commentaire ici..."></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <div class="row w-100 justify-content-spacebetween">
                            <div class="col-6"><a href="/compte/comments" class="btn btn-secondary btn-block">Annuler</a></div>
                            <div class="col-6"><button type="submit" @click.prevent="updateComment()" class="btn btn-success btn-block">Valider</button></div>
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
    name: "Comment Edit",
    data() {
        return {
            editComment: "",
            postId: "",
            editUserId: "",
            editorTag: "",
            editorColor: "text-secondary",
        }
    },
    methods: {
        updateComment() {
            axios.put("http://localhost:3000/api/comments/" + this.$route.params.id, {"content":this.editComment}, {headers: { "Authorization":"Bearer " + localStorage.getItem("token") }})
            .then(res => {
                if (res.status === 200) {
                    Swal.fire({
                        text: "Le commentaire à été mis à jour !",
                        footer: "Redirection en cours...",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false,
                        timerProgressBar: true,
                        willClose: () => { router.push("/Compte/comments/") }
                    })
                }
            })
            .catch(function(error) {
                const codeError = error.message.split("code ")[1]
                let messageError = ""
                switch (codeError) {
                    case "400": messageError = "Le commentaire n'a pas été mis à jour !"; break
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
        axios.get("http://localhost:3000/api/comments/" + this.$route.params.id, { headers: { "Authorization": "Bearer " + localStorage.getItem("token")}})
        .then(res => {
            console.log(res);
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
            this.editUserId = res.data.userId
            this.editorTag = "( publié par " + res.data.username + " )"
            this.editorColor = "text-danger"
            this.editComment = res.data.content
            this.postId = res.data.postId
        }).catch(err=>{
            console.log(err);
        });
    },
    deleteComment(){

    }

}
</script>
