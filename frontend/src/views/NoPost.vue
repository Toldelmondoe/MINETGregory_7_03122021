<template>
    <div class="card bg-light">
        <p class="h5 my-3 text-center" style="color:#091F43;">Bienvenue sur le réseau social interne Groupomania</p>
        <div class="card-header bg-light d-flex justify-content-center">
            <img src="../assets/icon-left-font-monochrome-black.svg" class="w-75 m-0 p-0" alt="logo groupomania">
        </div>
        <div class="card-body d-flex flex-column flex-md-row justify-content-center align-items-center p-1 m-1">
            <div class="col-12 col-md-9 mt-3 mt-md-0 p-0 p-md">
                <p>Il n'y a aucun message, pour le moment ...</p>
                <p>À vous de commencer en publiant le premier message.</p>
            </div>
            <div class="col-12 col-md-3 text-center">
                <a  href="" data-toggle="modal" data-target="#modalAddPost" class="my-2 btn btn-sm"><img src="/images/edit.png" width="100" height="100"></a>
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
            </div>
        </div>
    </div>           
</template>

<script>
export default {
    Name: "No Post"
}
</script>