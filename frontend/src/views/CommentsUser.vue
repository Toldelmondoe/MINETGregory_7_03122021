<template>
    <div>
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-12 col-md-10 col-lg-8" id="allPosts">
                    <div class="row my-2">
                        <div class="col-6 pr-1"><a href="/posts" class="btn btn-sm btn-block btn-success">... retour au fil d'actualité</a></div>
                        <div class="col-6 pl-1"><a href="/compte" class="btn btn-sm btn-block btn-primary">retour à mon compte ...</a></div>
                    </div>
                    <div v-for="comment in userComments" :key="comment.id" class="card bg-light my-3">
                        <div class="card-header bg-light d-flex flex-column justify-content-between m-0 p-1">
                            <div>
                                <span class="small text-dark m-0 p-1" >
                                    Posté par {{comment.username}} 
                                    <span v-if="!comment.isActive" class="small text-danger">(supprimé)</span>, 
                                    le {{comment.createdAt.slice(0,10).split('-').reverse().join('/') + ' à ' + comment.createdAt.slice(11,16)}}
                                </span>
                            </div>                                
                            <div class="d-flex justify-content-end">
                                <button type="button" class="btn pt-0 pr-2" data-toggle="modal" @click.prevent="preEditCom(comment.id)" data-target="#confirmEditCom">
                                    <img src="/images/edit.png" alt="remove" height="35" class="my-0 rounded-circle"/>
                                </button>
                                <button type="button" class="btn pt-0 pl-2" data-toggle="modal" @click.prevent="preDeleteCom(comment.id)" data-target="#confirmCom">
                                    <img src="/images/remove.png" alt="remove" height="30" class="my-0 rounded-circle"/>
                                </button>
                            </div>                               
                        </div>
                        <div class="card-body text-dark text-left">
                            <p class="small" v-if="comment.content !== ''"> {{comment.content}} </p>
                        </div>
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
                                <p class="modal-title mt-1 text-red">publié par {{commentToEdit.username}}</p>
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
export default {
    name: "Comments User",
    data() {
        return {
            currentUserId: "", 
            newComment: "",
            file: null,
            userComments: [],
            commentToDelete: null,
            commentToEdit: "",
        }
    },
    methods: {
        preDeleteCom(id){
            this.commentToDelete = id
        },
        preEditCom(id) {
            this.commentToEdit = this.userComments.find(function(item){
              return item.id === id;
            });
        },
        deleteComment() {
            if(this.commentToDelete != null && this.commentToDelete!=""){
                axios.delete("http://localhost:3000/api/comments/" + this.commentToDelete, { headers: { "x-access-token": localStorage.getItem("token") }})
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
        updateComment() {
            axios.put("http://localhost:3000/api/comments/" + this.commentToEdit.id, {"content":this.commentToEdit.content}, { headers: { "x-access-token": localStorage.getItem("token") }})
            .then(res=> {
                if (res.status === 200) {
                    Swal.fire({
                        text: "Le commentaire à été mis à jour !",
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
    created: function() {
        if (localStorage.getItem("refresh")===null) {
            localStorage.setItem("refresh", 0)
            location.reload()
        }
        axios.get("http://localhost:3000/api/comments/users/" + localStorage.getItem("userId") ,{ headers: {"Authorization": "Bearer " + localStorage.getItem("token")} })
        .then(res => {
            const rep = res.data.ListComments
            this.userComments = rep
        })
        .catch((error)=>{
            const codeError = error.message.split("code ")[1]
            let messageError = ""
            switch (codeError){
                case "400": messageError = "La liste des commentaires n'a pas été récupérée !"; break
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