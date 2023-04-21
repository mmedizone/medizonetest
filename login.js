import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

function loginFirebase(email,password){

    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        window.location.href = 'dashboard.html';
        // Signed in 
        const user = userCredential.user;
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    });
}