<template>
    <div>
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-12 col-md-10 col-lg-8" id="allPosts">
                    <div class="row my-2">
                        <div class="col-6 pr-1"><a href="/posts" class="btn btn-sm btn-block btn-success">... retour au fil d'actualité</a></div>
                        <div class="col-6 pl-1"><a href="/compte" class="btn btn-sm btn-block btn-primary">retour à mon compte ...</a></div>
                    </div>
                    <div v-for="post in userPosts" :key="post.id" class="card bg-light my-3">
                        <div class="card-header bg-light d-flex align-items-center justify-content-between m-0 p-1">
                            <div>
                                <img :src="post.avatar" height="40" class="m-0 rounded-circle"/>
                                <span class="small text-dark m-0 p-1" >
                                    Posté par {{post.username}} 
                                    <span v-if="!post.isActive" class="small text-danger">(supprimé)</span>, 
                                    le {{post.createdAt.slice(0,10).split('-').reverse().join('/') + ' à ' + post.createdAt.slice(11,16)}}
                                </span>
                            </div>                                
                            <div>
                                <button type="button" class="btn" data-toggle="modal" @click.prevent="preEdit(post.id)" data-target="#confirmEdit">
                                    <img src="/images/edit.png" alt="remove" height="35" class="my-0 rounded-circle"/>
                                </button>
                                <button type="button" class="btn" data-toggle="modal" @click.prevent="preDelete(post.id)" data-target="#confirm">
                                    <img src="/images/remove.png" alt="remove" height="30" class="my-0 rounded-circle"/>
                                </button>
                            </div>                               
                        </div>
                        <div class="card-body text-dark text-left">
                            <p class="small" v-if="post.content !== ''"> {{post.content}} </p>
                            <img class="w-100" :src="post.postUrl" v-if="post.postUrl !== ''">
                        </div>
                        <div class="card-footer bg-light text-dark text-left m-0">
                            <a :href="'/comments/' + post.id" class="h6 small">Voir les commentaires</a>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Modal For post delete -->
            <div id="confirm" class="modal">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-body">
                            Voulez-vous supprimer ce post?
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
                                <p class="modal-title mt-1 text-red">Publié par {{postToEdit.username}}</p>
                            </div>
                            <div class="row modal-body">
                                <div class="col-12 justify-content-center form-group">
                                    <label for="editContent" class="sr-only">Message :</label>
                                    <textarea class="form-control" v-model="postToEdit.content" id="editContent" name="content" rows="10" placeholder="Votre message ici ..."></textarea>
                                </div>
                                <div class="col-12 justify-content-center text-center">
                                    <img :src="postToEdit.postUrl" class="w-50 rounded">
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
        </div>
    </div>
</template>

<script>
import axios from "axios"
import Swal from "sweetalert2"
//import router from "../router"

export default {
    name: "Posts User",
    data() {
        return {
            newImage: "",
            file: null,
            postToDelete: null,
            userPosts: [],
            postToEdit: "",
        }
    },
    created: function() {
        if (localStorage.getItem("refresh")===null) {
            localStorage.setItem("refresh", 0)
            location.reload()
        }
        axios.get("http://localhost:3000/api/posts/users/" + localStorage.getItem("userId") ,{ headers: {"Authorization": "Bearer " + localStorage.getItem("token")} })
        .then(res => {
            const rep = res.data.ListPosts
            this.userPosts = rep
        })
        .catch((error)=>{
            const codeError = error.message.split("code ")[1]
            let messageError = ""
            switch (codeError){
                case "400": messageError = "La liste des messages n'a pas été récupérée !"; break
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
    },
    methods : {
        preDelete(id){
          this.postToDelete = id;
        },
        preEdit(id) {
            this.postToEdit = this.userPosts.find(function(item){
              return item.id === id;
            });
        },
        onFileChange() {
            this.file = this.$refs.file.files[0];
            this.newImage = URL.createObjectURL(this.file)
        },
        deletePost() {
            if(this.postToDelete != null && this.postToDelete!=""){
                axios.delete("http://localhost:3000/api/posts/" + this.postToDelete, { headers: { "x-access-token": localStorage.getItem("token") }})
                .then(res=> {
                    if (res.status === 200) {
                        Swal.fire({
                            text: "Le message a été supprimé !",
                            footer: "Redirection en cours...",
                            icon: "success",
                            timer: 1500,
                            showConfirmButton: false,
                            timerProgressBar: true,
                            willClose: () => { location.reload() }
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
        },
        updatePost() {
            const formData = new FormData()
            formData.set("image", this.file)
            formData.set("content", this.postToEdit.content.toString())
            axios.put("http://localhost:3000/api/posts/" + this.postToEdit.id, formData, { headers: { "x-access-token": localStorage.getItem("token") }})
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
    },
}
</script>