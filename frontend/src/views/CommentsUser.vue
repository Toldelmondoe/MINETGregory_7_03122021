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
                        <div class="card-header bg-light d-flex align-items-center justify-content-between m-0 p-1">
                            <div>
                                <span class="small text-dark m-0 p-1" >
                                    Posté par {{comment.username}} 
                                    <span v-if="!comment.isActive" class="small text-danger">(supprimé)</span>, 
                                    le {{comment.createdAt.slice(0,10).split('-').reverse().join('/') + ' à ' + comment.createdAt.slice(11,16)}}
                                </span>
                            </div>                                
                            <div>
                                <a :href="'/comment/edit/' + comment.id"><img src="/images/edit.png" class="m-1 p-0" height="35" alt="Editer le commentaire" title="Editer le commentaire"/></a>
                                <button type="button" class="btn" data-toggle="modal" @click.prevent="preDeleteCom(comment.id)" data-target="#confirmCom">
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
                            <button type="button" data-dismiss="modal" class="btn btn-primary" id="delete" @click.prevent="deleteComment()">OUI</button>
                            <button type="button" data-dismiss="modal" class="btn">Annuler</button>
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

export default {
    name: "Comments User",
    data() {
        return {
            currentUserId: "", 
            newComment: "",
            file: null,
            userComments: []
        }
    },
    methods: {
        preDeleteCom(id){
            this.commentToDelete = id
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
        }
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