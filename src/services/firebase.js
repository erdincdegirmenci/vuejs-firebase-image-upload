import { initializeApp } from "firebase/app";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3HbY_koHTu-ci6cYIEA4-87g56L4eJ9w",
  authDomain: "xrt-image-uploader.firebaseapp.com",
  projectId: "xrt-image-uploader",
  storageBucket: "xrt-image-uploader.appspot.com",
  messagingSenderId: "534355016535",
  appId: "1:534355016535:web:fc005008c6b2ce28781c12"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Storage and get a reference to the service

export default app
