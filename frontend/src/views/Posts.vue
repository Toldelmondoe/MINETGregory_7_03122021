<template>
    <div>
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-12 col-md-10 col-lg-8" id="allPosts">
                    <a  href="" data-toggle="modal" data-target="#modalAddPost" class="my-2 btn btn-lm btn-block btn-success">Publier un nouveau message</a>
                    <div class="modal fade" id="modalAddPost" tabindex="-1" aria-labelledby="modalAddPost" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <form enctype="multipart/form-data">
                                    <div class="modal-header">
                                        <p class="modal-title h5">Publier un nouveau message</p>
                                    </div>
                                    <div class="row modal-body">
                                        <div class="col-12 justify-content-center form-group">
                                            <label for="newContent" class="sr-only">Message :</label>
                                            <textarea class="form-control" v-model="newContent" id="newContent" name="post" rows="10" placeholder="Votre message ici..."></textarea>
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
                            <div v-if="post.userId == this.currentUserId">
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
                            <a :href="'/comments/' + post.id"  class="h6 small">Voir les commentaires</a>
                        </div>
                    </div>
                    <div class="card bg-info">
                        <p class="my-2 text-center text-white">Il n'y a pas de messages plus ancien ...</p>
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
                                <p class="modal-title mt-1">publié par {{postToEdit.username}}</p>
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

export default {
    name: "Posts",
    data() {
        return {
            currentUserId: "", 
            // Informations for new post creation
            newContent: "",
            newImage: "",
            file: null,
            
            // Information for delete post
            postToDelete: null,
            
            // List of posts
            posts: [],
            
            // Informations for Edit Post
            postToEdit: "",
            editorColor: "text-secondary",
        }
    },
    methods: {
        preEdit(id) {
            this.postToEdit = this.posts.find(function(item){
              return item.id === id;
            });
        },
        preDelete(id){
            this.postToDelete = id;
        },
        onFileChange() {
            this.file = this.$refs.file.files[0];
            this.newImage = URL.createObjectURL(this.file)
        },
        addNewPost() {
            const formData = new FormData()
            formData.set("image", this.file)
            formData.set("userId", localStorage.getItem("userId"))
            formData.set("content", this.newContent.toString())
            axios.post("http://localhost:3000/api/posts/", formData, { headers: { "Authorization":"Bearer " + localStorage.getItem("token")}})
            .then(()=> {
                this.userId = ""
                this.newContent = ""
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
                const codeError = error.message.split("code")[1]
                let messageError = ""
                switch (codeError){
                    case "400": messageError = "Le message n'a pas été publié !"; break
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
                      willClose: () => {
                        this.created();
                      }
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
            axios.put("http://localhost:3000/api/posts/" + this.postToEdit.id, formData, { headers: { "Authorization":"Bearer " + localStorage.getItem("token")}})
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
        created: function() {
            this.currentUserId = localStorage.getItem("userId")
            if (localStorage.getItem("refresh")===null) {
                localStorage.setItem("refresh", 0)
                location.reload()
            }
            axios.get("http://localhost:3000/api/posts",{ headers: {"Authorization": "Bearer " + localStorage.getItem("token")}})
            .then(res => {
                const rep = res.data.ListPosts
                this.posts = rep
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
    },
    beforeMount() {
      this.created();
    }
}
</script>