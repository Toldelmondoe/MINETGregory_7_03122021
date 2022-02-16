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
                                <a :href="'/post/edit/' + post.id"><img src="/images/edit.png" class="m-1 p-0" height="35" alt="Editer le message" title="Editer le message"/></a>
                                <a :href="'/post/drop/' + post.id"><img src="/images/remove.png" class="m-1 p-0" height="30" alt="Supprimer le message" title="Supprimer le message"/></a>
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
        </div>
    </div>
</template>

<script>
import axios from "axios"
import Swal from "sweetalert2"
export default {
    name: "Posts User",
    data() {
        return {
            newImage: "",
            currentUserId: "", 
            newPost: "",
            file: null,
            userPosts: []
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
    }
}
</script>