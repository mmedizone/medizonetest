import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getAuth, signOut, onAuthStateChanged  } from "firebase/auth"; 

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/frontend'));
// app.use(express.static(path.join(__dirname, 'frontend')));

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

const authData = getAuth();
const user = authData.currentUser;

app.get('/', (req, res)=>{
    res.status(200);
    // res.sendFile(path.join(__dirname, 'frontend/index.html'));
    res.render('index')
});

app.post('/login', async(req,res)=>{
    const { email, password } = req.body;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function(user) { res.redirect('/dashboard'); })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage)
            res.redirect('/')
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
    res.render('category')
});

app.get('/dashboard', (req, res)=>{
    res.status(200);
    var displayName = "admin"

    onAuthStateChanged(authData, (user) => {
        if (user) {
            var displayName = user.displayName
          // ...
        } else {
          // User is signed out
          // ...
        }
      });

    res.render('dashboard',{userName:displayName})
});

app.get('/doctor', (req, res)=>{
    res.status(200);
    res.render('doctor')
});

app.get('/transaction', (req, res)=>{
    res.status(200);
    res.render('transaction')
});

app.get('/users', (req, res)=>{
    res.status(200);
    res.render('users')
});
  
app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT)
    else 
        console.log("Error occurred, server can't start", error);
    }
);