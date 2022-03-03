<template>
    <div>
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-12 col-md-10 col-lg-8">
                    <router-link to="/posts" class="my-2 btn btn-sm btn-block btn-info">... retour au fil d'actualité</router-link>                
                </div>
                <div class="col-12 col-md-10 col-lg-8" id="OnePost">
                    
                    <div class="card bg-light my-3">
                        <div class="card-header bg-light d-flex align-items-center justify-content-between m-0 p-1">
                            <div>
                                <img :src="onePost.avatar" height="40" class="m-0 rounded-circle"/>
                                <span class="small text-dark m-0 p-1">
                                    Posté par {{onePost.username}}
                                    <span v-if="!onePost.isActive" class="small text-danger">(supprimé)</span>, 
                                    le {{onePost.createdAt}}
                                </span>
                            </div>
                            <div :id="'addUsr' + onePost.id" v-if="onePost.userId == this.currentUserId">
                                <a :href="'/post/edit/' + onePost.id"><img src="/images/edit.png" class="m-1 p-0" height="35" alt="Editer le message" title="Editer le message"/></a>
                                <a :href="'/post/drop/' + onePost.id"><img src="/images/remove.png" class="m-1 p-0" height="30" alt="Supprimer le message" title="Supprimer le message"/></a>
                            </div>                               
                        </div>
                        <div class="card-body text-dark text-left" :id="'PostContainer' + onePost.id">
                        <p class="small" v-if="onePost.content !== ''"> {{onePost.content}} </p>
                            <img class="w-100" :src="onePost.postUrl" v-if="onePost.postUrl !== ''">
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-10 col-lg-8">
                    <a href="" data-toggle="modal" data-target="#modalAddComment" class="my-2 btn btn-sm btn-block btn-success">Publier un commentaire...</a>
                    <div class="modal fade" id="modalAddComment" tabindex="-1" aria-labelledby="modalAddComment" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <form enctype="multipart/form-data">
                                    <div class="modal-header">
                                        <p class="modal-title h5">Publier un nouveau commentaire</p>
                                    </div>
                                    <div class="row modal-body">
                                        <div class="col-12 justify-content-center form-group">
                                            <label for="newComment" class="sr-only">Commentaire :</label>
                                            <textarea class="form-control" v-model="newComment" id="newComment" name="comment" rows="10" placeholder="Votre commentaire ici..."></textarea>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <div class="row w-100 justify-content-spacebetween">
                                            <div class="col-6"><a data-dismiss="modal" class="btn btn-secondary btn-block">Annuler</a></div>
                                            <div class="col-6"><button type="submit" @click.prevent="addNewComment()" class="btn btn-success btn-block">Publier</button></div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-10 col-lg-8">
                    <div v-for="comment in comments" :key="comment.id" class="card bg-light my-3">
                        <div class="card-header align-items-center m-0 p-1">
                            <div class="d-flex justify-content-between">
                                <span class="small text-dark m-0 p-1">
                                    Commentaire de {{comment.username}}
                                    <span v-if="!comment.isActive" class="small text-danger">(supprimé)</span>,
                                    le {{comment.createdAt.slice(0,10).split('-').reverse().join('/') +' à '+ comment.createdAt.slice(11,16)}}
                                </span>
                                <div :id="'addCmt' + comment.id"  v-if="comment.userId == this.currentUserId">
                                    <a :href="'/comment/edit/' + comment.id"><img src="/images/edit.png" class="m-1 p-0" height="30" alt="Editer le commentaire" title="Editer le commentaire"/></a>
                                    <a :href="'/comment/drop/' + comment.id"><img src="/images/remove.png" class="m-1 p-0" height="25" alt="Supprimer le commentaire" title="Supprimer le commentaire"/></a>
                                </div>
                            </div>
                            <hr class="m-0 p-0 bg-secondary">
                            <p class="small text-dark m-0 p-1"> {{comment.content}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios"
import Swal from "sweetalert2"
import router from "../router"
export default {
    name: "Comments",
    data() {
        return {
            isActive: true,
            currentUserId: "",
            newComment: "",
            onePost: [],
            comments: [],
        }
    },
    methods: {
        addNewComment() {
            const formData = new FormData()
            formData.set("userId", localStorage.getItem("userId"))
            formData.set("content", this.newComment.toString())
            this.submitted = true
            axios.post("http://localhost:3000/api/comments/", { "PostId": this.$route.params.id, "UserId": this.currentUserId, "content": this.newComment }, { headers: { "Authorization": "Bearer " + localStorage.getItem("token")}})
            .then(()=> {
                this.userId = ""
                this.newComment = ""
                Swal.fire({
                    text: "Commentaire ajouté !",
                    footer: "Redirection en cours...",
                    icon: "success",
                    timer: 1000,
                    showConfirmButton: false,
                    timerProgressBar: true,
                    willClose: () => { location.reload() }
                })
            })
            .catch((error)=>{
                const codeError = error.message.split("code")[1]
                let messageError = ""
                switch (codeError){
                    case "400": messageError = "Le commentaire n'a pas été oublié !"; break
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
    created: function () {
        
        this.currentUserId = localStorage.getItem("userId")
        if (localStorage.getItem("refresh")===null) {
            localStorage.setItem("refresh", 0)
            location.reload()
        }
        axios.get("http://localhost:3000/api/posts/" + this.$route.params.id, { headers: {"Authorization": "Bearer " + localStorage.getItem("token")} })
        .then(res => {
            this.onePost = res.data
            this.onePost.createdAt = res.data.createdAt.slice(0,10).split('-').reverse().join('/') + ' à ' + res.data.createdAt.slice(11,16)
        })
        .catch((error)=> {
            const codeError = error.message.split("code ")[1]
            let messageError = ""
            switch (codeError){
                case "400": messageError = "Le message n'a pas été récupéré !"; break
                case "401": messageError = "Requête non-authentifiée !"; break
                case "404": messageError = "Le message n'a pas été trouvé !"; break
            }
            Swal.fire({
                title: "Une erreur est survenue",
                text: messageError || error.message,
                icon: "error",
                timer: 3500,
                showConfirmButton: false,
                timerProgressBar: true,
                willClose: () => { router.push("/posts") }
            })  
        })
        axios.get("http://localhost:3000/api/comments/post/" + this.$route.params.id, { headers: {"Authorization": "Bearer " + localStorage.getItem("token")} })
        .then(cmt => {
          console.log(cmt.data);
            this.comments = cmt.data.ListComments
        })
        .catch(function(error) {
            const codeError = error.message.split("code ")[1]
            let messageError = ""
            switch (codeError){
                case "400": messageError = "La liste des commentaires n'a pas été récupérée !"; break
                case "401": messageError = "Requête non-authentifiée !"; break
            }
            Swal.fire({
                title: "Une erreur est survenue",
                text: messageError || error.message,
                icon: "error",
                timer: 3500,
                showConfirmButton: false,
                timerProgressBar: true,
                willClose: () => { router.push("/posts") }
            })  
        })
    }
}
</script>