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
                                <button type="button" class="btn" data-toggle="modal" @click.prevent="preEdit(onePost.id)" data-target="#confirmEdit">
                                    <img src="/images/edit.png" alt="edit" height="35" class="my-0 rounded-circle"/>
                                </button>
                                <button type="button" class="btn" data-toggle="modal" @click.prevent="preDelete(onePost.id)" data-target="#confirm">
                                    <img src="/images/remove.png" alt="remove" height="30" class="my-0 rounded-circle"/>
                                </button>
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
                                            <label for="newContent" class="sr-only">Commentaire :</label>
                                            <textarea class="form-control" v-model="newContent" id="newContent" name="comment" rows="10" placeholder="Votre commentaire ici..."></textarea>
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
                                    Commenté par {{comment.username}}
                                    <span v-if="!comment.isActive" class="small text-danger">(supprimé)</span>,
                                    le {{comment.createdAt.slice(0,10).split('-').reverse().join('/') +' à '+ comment.createdAt.slice(11,16)}}
                                </span>
                                <div :id="'addCmt' + comment.id"  v-if="comment.userId == this.currentUserId">
                                    
                                    <button type="button" class="btn" data-toggle="modal" @click.prevent="preEditCom(comment.id)" data-target="#confirmEditCom">
                                        <img src="/images/edit.png" alt="edit" height="35" class="my-0 rounded-circle"/>
                                    </button>
                                    <button type="button" class="btn" data-toggle="modal" @click.prevent="preDeleteCom(comment.id)" data-target="#confirmCom">
                                        <img src="/images/remove.png" alt="remove" height="30" class="my-0 rounded-circle"/>
                                    </button>
                                </div>
                            </div>
                            <hr class="m-0 p-0 bg-secondary">
                            <p class="small text-dark m-0 p-1"> {{comment.content}}</p>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Modal For post delete -->
            <div id="confirm" class="modal">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-body">
                            Voulez-vous supprimer ce post ?
                        </div>
                        <div class="modal-footer">
                            <button type="button" data-dismiss="modal" class="btn btn-info">Annuler</button>
                            <button type="button" data-dismiss="modal" class="btn btn-danger" id="delete" @click.prevent="deletePost()">Supprimer</button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Modal For post edit -->
            <div id="confirmEdit" class="modal">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <form enctype="multipart/form-data">
                            <div class="modal-header d-flex flex-column flex-md-row align-items-center justify-content-start">
                                <p class="modal-title h5 mr-1">Editer message</p>
                                <p class="modal-title mt-1">publié par {{onePost.username}}</p>
                            </div>
                            <div class="row modal-body">
                                <div class="col-12 justify-content-center form-group">
                                    <label for="editContent" class="sr-only">Message :</label>
                                    <textarea class="form-control" v-model="onePost.content" id="editContent" name="content" rows="10" placeholder="Votre message ici ..."></textarea>
                                </div>
                                <div class="col-12 justify-content-center text-center">
                                    <img :src="onePost.postUrl" class="w-50 rounded">
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
                                <button type="button" data-dismiss="modal" class="btn btn-info">Annuler</button>
                                <button type="button" data-dismiss="modal" class="btn btn-success " id="update" @click.prevent="updatePost()">Valider</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <!-- Modal For comment delete -->
            <div id="confirmCom" class="modal">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-body">
                            Voulez-vous supprimer ce commentaire ?
                        </div>
                        <div class="modal-footer">
                            <button type="button" data-dismiss="modal" class="btn btn-info">Annuler</button>
                            <button type="button" data-dismiss="modal" class="btn btn-danger" id="delete" @click.prevent="deleteComment()">Supprimer</button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Modal For comment edit -->
            <div id="confirmEditCom" class="modal">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <form enctype="multipart/form-data">
                            <div class="modal-header d-flex flex-column flex-md-row align-items-center justify-content-start">
                                <p class="modal-title h5 mr-1">Editer commentaire</p>
                                <p class="modal-title mt-1 text-red">Publié par {{commentToEdit.username}}</p>
                            </div>
                            <div class="row modal-body">
                                <div class="col-12 justify-content-center form-group">
                                    <label for="editContent" class="sr-only">Message :</label>
                                    <textarea class="form-control" v-model="commentToEdit.content" id="editContent" name="content" rows="10" placeholder="Votre message ici ..."></textarea>
                                </div>
                            </div>
                             <div class="modal-footer">
                                <button type="button" data-dismiss="modal" class="btn btn-info">Annuler</button>
                                <button type="button" data-dismiss="modal" class="btn btn-success " id="update" @click.prevent="updateComment()">Valider</button>
                            </div>
                        </form>
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
            // Informations for new comment creation
            isActive: true,
            newContent: "",
            onePost: [],
            currentUserId: "", 

            // List of comments
            comments: [],

            // Information for delete comment
            commentToDelete: null,

            // Information for edit comment
            commentToEdit: "",

            // List of posts
            posts: [],

            // Information for delete post
            postToDelete: null,

            // Informations for Edit Post
            newImage: "",
            file: null,
            editorColor: "text-secondary",
        }
    },
    methods: {
        preDelete(id){
            this.postToDelete = id
        },
        preEdit(id) {
            this.postToEdit = this.posts.find(function(item){
              return item.id === id;
            });
        },
        preDeleteCom(id){
            this.commentToDelete = id
        },
        preEditCom(id) {
            this.commentToEdit = this.comments.find(function(item){
              return item.id === id;
            });
        },
        onFileChange() {
            this.file = this.$refs.file.files[0];
            this.newImage = URL.createObjectURL(this.file)
        },
        addNewComment() {
            const formData = new FormData()
            formData.set("userId", localStorage.getItem("userId"))
            formData.set("content", this.newContent.toString())
            this.submitted = true
            axios.post("http://localhost:3000/api/comments/", { "PostId": this.$route.params.id, "UserId": this.currentUserId, "content": this.newContent }, { headers: { "Authorization": "Bearer " + localStorage.getItem("token")}})
            .then(()=> {
                this.userId = ""
                this.newContent = ""
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
        },
        updateComment() {
            axios.put("http://localhost:3000/api/comments/" + this.commentToEdit.id, {"content":this.commentToEdit.content}, {headers: { "Authorization":"Bearer " + localStorage.getItem("token") }})
            .then(res => {
                if (res.status === 200) {
                    Swal.fire({
                        text: "Le commentaire à été mis à jour !",
                        footer: "Redirection en cours...",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false,
                        timerProgressBar: true,
                        willClose: () => { location.reload() }
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
        },
        deleteComment() {
            if(this.commentToDelete != null && this.commentToDelete!=""){
                axios.delete("http://localhost:3000/api/comments/" + this.commentToDelete, { headers: { "Authorization": "Bearer " + localStorage.getItem("token")}})
                .then(res => {
                    if (res.status === 200) {
                        Swal.fire({
                            text: "Le commentaire a été supprimé !",
                            footer: "Redirection en cours...",
                            icon: "success",
                            timer: 1500,
                            showConfirmButton: false,
                            timerProgressBar: true,
                            willClose: () => { location.reload() }
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
        updatePost() {
            const formData = new FormData()
            formData.set("image", this.file)
            formData.set("content", this.onePost.content.toString())
            axios.put("http://localhost:3000/api/posts/" + this.onePost.id, formData, { headers: { "Authorization":"Bearer " + localStorage.getItem("token")}})
            .then(res=> {
                if (res.status === 200) {
                    Swal.fire({
                        text: "Le message à été mis à jour !",
                        footer: "Redirection en cours...",
                        icon: "success",
                        timer: 1000,
                        showConfirmButton: false,
                        timerProgressBar: true,
                        willClose: () => { location.reload() }
                    })
                }
            })
            .catch(function(error) {
                const codeError = error.message.split("code ")[1]
                let messageError = ""
                switch (codeError){
                    case "400": messageError = "Le message n'a pas été mis à jour !"; break
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
        },
        deletePost() {
            if(this.postToDelete != null && this.postToDelete!=""){
                axios.delete("http://localhost:3000/api/posts/" + this.postToDelete, { headers: { "Authorization":"Bearer " + localStorage.getItem("token") }})
                .then(res=> {
                    if (res.status === 200) {
                        Swal.fire({
                            text: "Le message a été supprimé !",
                            footer: "Redirection en cours...",
                            icon: "success",
                            timer: 1500,
                            showConfirmButton: false,
                            timerProgressBar: true,
                            willClose: () => { router.push("/posts") }
                        });
                        this.postToDelete = null;
                    }
                })
                .catch(function(error) {
                    const codeError = error.message.split("code ")[1]
                    let messageError = ""
                    switch (codeError){
                        case "400": messageError = "Le message n'a pas été supprimé !"; break
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