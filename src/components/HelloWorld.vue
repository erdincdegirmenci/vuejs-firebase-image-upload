<template>
  <div>
    <div style="text-align: -webkit-center;">
      <v-col>
          <v-alert
          border="top"
          color="blue-grey"
          dark
        >
          Konuşmaaaaağ Yükleeee
          <v-icon>mdi-hand-wave-outline</v-icon>
        </v-alert>
      <!-- <input type="file" @change="previewImage" accept="image/*" >       -->
        <v-file-input
          :rules="rules"
          accept="image/*, video/*"
          placeholder="Pick an file"
          prepend-icon="mdi-camera"
          label="Image or Video"
          @change="previewImage"
        ></v-file-input>    
        <v-progress-linear
          v-model="uploadValue"
          height="25"
        >
        <strong>{{ Math.ceil(uploadValue) }}%</strong>
        </v-progress-linear>

          <div v-if="imageData!=null">                     
            <img class="preview" :src="picture">
            <br>
            <v-btn
              :loading="loading"
              :disabled="loading"
              color="blue-grey"
              class="white--text"
              style="width: 100%;"
              @click="onUpload"
            >
              Upload
              <v-icon
                right
                dark
              >
                mdi-cloud-upload
              </v-icon>
            </v-btn>
        </div>   
      </v-col>      
    </div>
      <!-- <p>Progress: {{uploadValue.toFixed()+"%"}} -->
      <!-- <progress id="progress" :value="uploadValue" max="100" ></progress>  </p> -->
    <v-divider style="border-color: grey;border-width: thin 0 2px 0;"></v-divider>

    <v-row>
    <v-col
      v-for="n in uploadedPhotos"
      :key="n.imageName"
      class="d-flex child-flex"
      cols="4"
    >
    <v-container fluid>
    <v-row justify="space-around">
      <v-col cols="12">
        <div class="text-h12 mb-1">
          {{n.imageName}}
        </div>
        <!-- <button @click="deleteFiles(n.imageName)">Delete</button> -->
         <!-- <v-col cols="10"> -->
        <v-btn
              color="error"
              class="white--text"
              style="width: inherit"
              @click="deleteFiles(n.imageName)"
            >
              Delete
              <v-icon
                right
                dark
              >
                mdi-delete
              </v-icon>
        </v-btn>
                <v-btn
              color="warning"
              class="white--text"
              style="width: inherit"
              @click="downloadFiles(n.imageName)"
            >
              Download
              <v-icon
                right
                dark
              >
                mdi-download
              </v-icon>
        </v-btn>
         <!-- </v-col> -->
        <v-img
        :src="n.imageUrl"
        :lazy-src="n.imageUrl"
        aspect-ratio="1"
        class="grey lighten-2"
      >
        <template v-slot:placeholder>
          <v-row
            class="fill-height ma-0"
            align="center"
            justify="center"
          >
            <v-progress-circular
              indeterminate
              color="grey lighten-5"
            ></v-progress-circular>
          </v-row>
        </template>
      </v-img>
		
      </v-col>
    </v-row>
  </v-container>
      
    </v-col>
  </v-row>
  </div>
  
</template>

<script>
// eslint-disable-next-line no-unused-vars
import *as firebase from './../services/firebase'
import { getStorage, ref, uploadBytesResumable, getDownloadURL, listAll, deleteObject } from "firebase/storage";
export default {
  name: 'Upload',
  data(){	  
	return{
      rules: [
        value => !value || value.size < 1000000000 || 'File size should be less than 1 GB!',
      ],
      imageData: null,  
      picture: null,
      uploadValue: 0,
      uploadedPhotos: [],
      loading: false,
	}
  },
  watch: {
  },
  created () {
    // this.pageTokenExample()
    this.listAllFiles()
  },
  methods:{
    previewImage(event) {
      this.uploadValue=0;
      this.picture=null;
      console.log(event)
      this.imageData = event
    },
    onUpload(){
      
      const storage = getStorage();
      // Create the file metadata
        /** @type {any} */
        // const metadata = {
        //   contentType: 'image/jpeg, '
        // };
      const storageRef = ref(storage, 'images/' + this.imageData.name);

      
      const uploadTask = uploadBytesResumable(storageRef, this.imageData);
      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on('state_changed', 
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          this.uploadValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + this.uploadValue + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              this.loading = true
              console.log('Upload is running');
              break;
          }
          
        }, 
        (error) => {
          // Handle unsuccessful uploads
          // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              console.log('storage/unauthorized')
              break;
            case 'storage/canceled':
              // User canceled the upload
              console.log('storage/canceled')
              break;

            // ...

            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              console.log('storage/unknown')
              break;
          }
        }, 
        () => {
          
          this.loading = false
          this.listAllFiles()
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          // getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          //   console.log('File available at', downloadURL);
          // });
        }
      );
    },
    
    listAllFiles () {
      this.uploadedPhotos = []
      const storage = getStorage();

      // Create a reference under which you want to list
      const listRef = ref(storage, 'images/');
      // Find all the prefixes and items.
      listAll(listRef)
        .then((res) => {
          console.log(res)
          res.prefixes.forEach((folderRef) => {
            // All the prefixes under listRef.
            // You may call listAll() recursively on them.
            console.log(folderRef)
          });
          res.items.forEach((itemRef) => {
            // All the items under listRef.
            console.log(itemRef)
            // All the items under listRef.
                getDownloadURL(itemRef).then(downloadURL=>{
                    this.uploadedPhotos.push({imageUrl: downloadURL, imageName: itemRef.name});
                })
          });
        }).catch((error) => {
          // Uh-oh, an error occurred!
          console.log(error)
        });
    },
    deleteFiles (imageName) {
      console.log(imageName)
      const storage = getStorage();

      // Create a reference to the file to delete
      const desertRef = ref(storage, 'images/' + imageName);

      // Delete the file
      deleteObject(desertRef).then(() => {
         this.listAllFiles()
        // File deleted successfully
      }).catch((error) => {
        // Uh-oh, an error occurred!
        console.log(error)
      });
    },
    downloadFiles (imageName) {
      // Create a reference to the file we want to download
      const storage = getStorage();
      const starsRef = ref(storage, 'images/' + imageName);
      // Get the download URL
      getDownloadURL(starsRef)
        .then((url) => {
              const link = document.createElement('a')
              link.href = url // or any other extension
              document.body.appendChild(link)
              link.click()
        })
        .catch((error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/object-not-found':
              console.log('storage/object-not-found')
              // File doesn't exist
              break;
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              console.log('storage/unauthorized')
              break;
            case 'storage/canceled':
              // User canceled the upload
              console.log('storage/canceled')
              break;

            // ...

            case 'storage/unknown':
              // Unknown error occurred, inspect the server response
              break;
          }
        });
    }
        
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
img.preview {
    width: 200px;
}
</style>