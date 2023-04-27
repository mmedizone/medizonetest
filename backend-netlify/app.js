import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getAuth  } from "firebase/auth"; 
import { collection, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
// import { initializeApp } from 'firebase-admin/app';

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
const authTest = firebase.auth()
// const appAdmin = initializeApp();

app.get('/', (req, res)=>{
    res.status(200);
    // res.sendFile(path.join(__dirname, 'frontend/index.html'));
    res.render('index')
});

app.post('/login', async(req,res)=>{
    const { email, password } = req.body;

    const arrAccepted = ['admin@gmail.com']

    var found = false


    for (var i = 0; i < arrAccepted.length; i++) {
        if(email === arrAccepted[i]){
            found = true
            firebase.auth().signInWithEmailAndPassword(email, password)
            .then(function(user) { res.redirect('/dashboard'); })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorMessage)
                res.redirect('/')
            });
        }
    }

    if(found === false){
        res.redirect('/')
    }
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
    var userEmail = "admin"

    const authData = getAuth();
    const user = authData.currentUser;

    if(user) {
        userEmail = user.email
    }


    res.render('dashboard',{email:userEmail})
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

app.post('/doctorDel',async (req, res)=>{
    res.status(200);

    const selected = req.body.sel;

    await deleteDoc(doc(db, "doctors", selected[0]));

    res.redirect('/doctor')
});

app.get('/transaction', async (req, res)=>{
    res.status(200);

    const arr = []
    const arrId = []
    const arrPatient = []
    const arrDoctor = []
    const arrTime = []
    const arrDate = []

    const querySnapshot = await getDocs(collection(db, "booking"));
    querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
        arrId.push(doc.id)
        arrPatient.push(doc.get("patient"))
        arrDoctor.push(doc.get("doctor"))
        arrTime.push(doc.get("time"))
        arrDate.push(doc.get("date"))
    });

    for(let i=0;i<arrId.length;i++){
        arr.push([i,arrDate[i],arrTime[i],arrPatient[i],arrDoctor[i],arrId[i]])
    }

    res.render('transaction', {arr:arr})
});

app.post('/transactionDel',async (req, res)=>{
    res.status(200);

    const selected = req.body.sel;

    await deleteDoc(doc(db, "booking", selected[0]));

    res.redirect('/transaction')
});

app.get('/users', (req, res)=>{
    
    res.status(200);

    const listAllUsers = (nextPageToken) => {
        // List batch of users, 1000 at a time.
        auth()
          .listUsers(1000, nextPageToken)
          .then((listUsersResult) => {
            listUsersResult.users.forEach((userRecord) => {
              console.log('user', userRecord.toJSON());
            });
            if (listUsersResult.pageToken) {
              // List next batch of users.
              listAllUsers(listUsersResult.pageToken);
            }
          })
          .catch((error) => {
            console.log('Error listing users:', error);
          });
      };
      // Start listing users from the beginning, 1000 at a time.
      listAllUsers();

    res.render('users')
});
  
app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT)
    else 
        console.log("Error occurred, server can't start", error);
    }
);  

export {authTest,db}