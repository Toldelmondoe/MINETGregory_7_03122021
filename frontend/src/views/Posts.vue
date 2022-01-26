<template>
    <div>
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-12 col-md-10 col-lg-8" id="allPosts">
                    <a  href="" data-toggle="modal" data-target="#modalAddPost" class="my-2 btn btn-sm btn-block btn-success">Publier un message...</a>
                    <div class="modal fade" id="modalAddPost" tabindex="-1" aria-labelledby="modalAddPost" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <form enctype="multipart/form-data">
                                    <div class="modal-header">
                                        <p class="modal-title h5">Publier un nouveau message</p>
                                    </div>
                                    <div class="row modal-body">
                                        <div class="col-12 justify-content-center form-group">
                                            <label for="newPost" class="sr-only">Message :</label>
                                            <textarea class="form-control" v-model="newPost" id="newPost" name="post" rows="10" placeholder="Votre message ici..."></textarea>
                                        </div>
                                        <div class="col-12 justify-content-center text-center">
                                            <img :src="newImage" class="w-50 rounded">
                                            <p class="small text-center">Image à partager</p>
                                        </div>
                                        <div class="col-12 justify-content-center">
                                            <div class="form-group justify-content-center">
                                                <label for="File" class="sr-only">Choisir une nouvelle photo</label>
                                                <input @change="onFileChange()" type="file" ref="file" name="image" class="form-control-file" id="File" accept=".jpg, .jpeg, .gif, .png">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <div class="row w-100 justify-content-spacebetween">
                                            <div class="col-6"><a data-dismiss="modal" class="btn btn-secondary btn-block">Annuler</a></div>
                                            <div class="col-6"><button type="submit" @click.prevent="addNewPost()" class="btn btn-success btn-block">Publier</button></div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div v-for="post in posts" :key="post.id" class="card bg-light my-3">
                        <div class="card-header bg-light d-flex align-items-center justify-content-between m-0 p-1">
                            <div>
                                <img :src="post.avatar" height="40" class="m-0 rounded-circle"/>
                                <span class="small text-dark m-0 p-1" >
                                    Posté par {{post.username}} 
                                    <span v-if="!post.isActive" class="small text-danger">(supprimé)</span>, 
                                    le {{post.createdAt.slice(0,10).split('-').reverse().join('/') + ' à ' + post.createdAt.slice(11,16)}}
                                </span>
                            </div>                                
                            <div v-if="post.userId == this.currentuserId || this.isAdmin == 'true'">
                                <a :href="'#/post/edit/' + post.id"><img src="/images/edit.png" class="m-1 p-0" alt="Editer le message" title="Editer le message"/></a>
                                <a :href="'#/post/delete/' + post.id"><img src="/images/delete.png" class="m-1 p-0" alt="Supprimer le message" title="Supprimer le message"/></a>
                            </div>                               
                        </div>
                        <div class="card-body text-dark text-left">
                            <p class="small" v-if="post.post !== ''"> {{post.post}} </p>
                            <img class="w-100" :src="post.postUrl" v-if="post.postUrl !== ''">
                        </div>
                        <div class="card-footer bg-light text-dark text-left m-0">
                            <a :href="'#/commentaires/' + post.id" class="h6 small">Voir les commentaires</a>
                        </div>
                    </div>
                    <NoPost v-if="noPost"></NoPost>
                    <div class="card bg-danger">
                        <p class="my-2 text-center text-white">Il n'y a pas de messages plus ancien que celui au-dessus...</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import NoPost from "./NoPost"
import axios from "axios"
import Swal from "sweetalert2"
export default {
    name: "Posts",
    components: { 
        NoPost
    },
    data() {
        return {
            noPost: false,
            isAdmin: false,
            isActive: true,
            newImage: "",
            currentuserId: "", 
            newPost: "",
            file: null,
            posts: [],
        }
    },
    methods: {
        onFileChange() {
            this.file = this.$refs.file.files[0];
            this.newImage = URL.createObjectURL(this.file)
        },
        addNewPost() {
            const formData = new FormData()
            formData.set("image", this.file)
            formData.set("userId", this.currentuserId.toString())
            formData.set("post", this.newPost.toString())
            axios.post("http://localhost:3000/api/posts/", formData, { headers: { "Authorization":"Bearer " + localStorage.getItem("token")}})
            .then(()=> {
                this.userId = ""
                this.newPost = ""
                this.file = null
                Swal.fire({
                    text: "Message posté !",
                    footer: "Redirection en cours...",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false,
                    timerProgressBar: true,
                    willClose: () => { location.reload() }
                })
            })
            .catch((error)=>{
                const codeError = error.message.split("code ")[1]
                let messageError = ""
                switch (codeError){
                    case "400": messageError = "Le message n'a pas été posté !"; break
                    case "401": messageError = "Requête non-authentifiée !"; break
                }
                Swal.fire({
                    title: "Une erreur est survenue",
                    text: messageError || error.message,
                    icon: "error",
                    timer: 3500,
                    showConfirmButton: false,
                    timerProgressBar: true
                }) 
            })
        }
    },
    created: function() {
        this.isAdmin = localStorage.getItem("role")
        this.currentuserId = localStorage.getItem("userId")
        if (localStorage.getItem("refresh")===null) {
            localStorage.setItem("refresh", 0)
            location.reload()
        }
        axios.get("http://localhost:3000/api/posts",{ headers: {"Authorization": "Bearer " + localStorage.getItem("token")} })
        .then(res => {
            const rep = res.data.ListPosts
            if (rep.length === 0) { this.noPost = true } else { this.noPost = false }
            this.posts = rep
        })
        .catch((error)=>{
            const codeError = error.message.split("code ")[1]
            let messageError = ""
            switch (codeError){
                case "400": messageError = "La liste des messages n'a pas été récupérer !"; break
            }
            Swal.fire({
                title: "Une erreur est survenue",
                text: messageError || error.message,
                icon: "error",
                timer: 3500,
                showConfirmButton: false,
                timerProgressBar: true
            }) 
        })
    }
}
</script>