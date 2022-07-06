import { initializeApp } from "firebase/app";
// Your web app's Firebase configuration
const firebaseConfig = {
  // your config
  apiKey: "AIzaSGB3HbY_koHTu-ci6cYIEA4-87g56L4eJ9w",
  authDomain: "vuejs-image-upload.firebaseapp.com",
  projectId: "vuejs-image-upload",
  storageBucket: "vuejs-image-upload.appspot.com",
  messagingSenderId: "532523016535",
  appId: "1:534255033333:web:fc005008c6b2ce28781c12"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Storage and get a reference to the service

export default app
