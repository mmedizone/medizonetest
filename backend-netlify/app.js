import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { initializeApp } from 'firebase-admin/app';
import { getAuth  } from "firebase/auth"; 
import { collection, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";


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

const firebaseAdmin = initializeApp();

export {auth,db}

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


app.get('/category', async (req, res)=>{
    res.status(200);

    const arr = []

    const querySnapshot = await getDocs(collection(db, "category"));
    querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
        arr.push(doc.id)
    });

    res.render('category',{catArr:arr})
});


app.get('/categoryAdd', (req, res)=>{
    res.status(200);
    res.render('categoryAdd')
});

app.post('/categoryAdd',async (req, res)=>{
    res.status(200);

    const { cat } = req.body;

    await setDoc(doc(db, "category", cat), {});

    res.redirect('/category')
});

app.post('/categoryDel',async (req, res)=>{
    res.status(200);

    const selected = req.body.sel;

    await deleteDoc(doc(db, "category", selected[0]));

    res.redirect('/category')
});

app.get('/dashboard', (req, res)=>{
    res.status(200);
    var displayName = "admin"

    const authData = getAuth();
    const user = authData.currentUser;

    if(user) {
        displayName = user.displayName
    }


    res.render('dashboard',{userName:displayName})
});

app.get('/doctor', async (req, res)=>{
    res.status(200);

    const arr = []

    const querySnapshot = await getDocs(collection(db, "doctors"));
    querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
        arr.push({name: doc.id, cat: doc.data().category, price: doc.data().price})
    });

    res.render('doctor',{docArr:arr})
});

app.get('/doctorAdd', async (req, res)=>{
    res.status(200);

    const arr = []

    const querySnapshot = await getDocs(collection(db, "category"));
    querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
        arr.push(doc.id)
    });

    res.render('doctorAdd', {catArr:arr})
});

app.post('/doctorAdd',async (req, res)=>{
    res.status(200);

    const { docName, docCat, docPrice } = req.body;

    await setDoc(doc(db, "doctors", docName), {category: docCat, price: docPrice});

    res.redirect('/doctor')
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