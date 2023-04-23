import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getAuth, signOut } from "firebase/auth"; 

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const PORT = 3000;

var firebaseConfig = {
    apiKey: "AIzaSyBa8lhp0n83wZD09bitPlvr0ByZykPpv7E",
    authDomain: "mmedizone-436ee.firebaseapp.com",
    projectId: "mmedizone-436ee",
    storageBucket: "mmedizone-436ee.appspot.com",
    messagingSenderId: "514581965020",
    appId: "1:514581965020:web:d5a00069090b2576afac19"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth()

export {auth,db}

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

app.get('/', (req, res)=>{
    res.status(200);
    res.sendFile(path.join(__dirname, 'frontend/index.html'));
});

app.post('/login', async(req,res)=>{
    const { email, password } = req.body;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function(user) { res.redirect('/dashboard'); })
        .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage)
        });
});

app.post('/logout', async(req,res)=>{
    
    const user = firebase.auth().currentUser

    firebase.auth().signOut()
    .then(function(user) { res.redirect('/'); })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage)
        });
});


app.get('/category', (req, res)=>{
    res.status(200);
    res.sendFile(path.join(__dirname, 'frontend/category.html'));
});

app.get('/dashboard', (req, res)=>{
    res.status(200);
    res.sendFile(path.join(__dirname, 'frontend/dashboard.html'));
});

app.get('/doctor', (req, res)=>{
    res.status(200);
    res.sendFile(path.join(__dirname, 'frontend/doctor.html'));
});

app.get('/transaction', (req, res)=>{
    res.status(200);
    res.sendFile(path.join(__dirname, 'frontend/transaction.html'));
});

app.get('/users', (req, res)=>{
    res.status(200);
    res.sendFile(path.join(__dirname, 'frontend/users.html'));
});
  
app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT)
    else 
        console.log("Error occurred, server can't start", error);
    }
);