import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from"https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";
import { collection, getDoc, setDoc, doc } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js"


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
apiKey: "AIzaSyA5Xoy031BKSPUcTWzgiw721LprZetYiso",
authDomain: "sesl3-d8975.firebaseapp.com",
databaseURL: "https://sesl3-d8975-default-rtdb.firebaseio.com",
projectId: "sesl3-d8975",
storageBucket: "sesl3-d8975.appspot.com",
messagingSenderId: "908221585980",
appId: "1:908221585980:web:8b90754eebd4485ae3c139",
measurementId: "G-ENM8KEH2CC"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export let player = {
    email: '',
    wins: 0,
    losses: 0,
    credential: ""
}

const password = "12345678";
export async function userInfo(e){
    e.preventDefault();
    let user = document.getElementById("userInfo");
    console.log(user);
    player.email = user["email"].value;
    let exists = await checkUser(user["email"].value);
    if(exists){
        signIn(user["email"].value);
    } else {
        createUser(user["email"].value);
    }
    user.reset()
    startGame(user);
}
function startGame(){
    document.getElementById("login").style.display = "none";
    document.getElementById("email").style.display = "none";
    document.getElementById("loginButton").style.display = "none";
    document.getElementById("logout").style.display = "block";
    document.getElementById("pcPlay").disabled = false;
    document.getElementById("userPlay").disabled = false;
}
function signIn(email){
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        player.credential = userCredential.user;
        console.log(player.credential);
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    });
}
function createUser(email){
    console.log(email);
    createDoc(email);
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        player.credential = userCredential.user;
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorCode, errorMessage);
    });
}
async function createDoc(email){
    try {
      const docRef = await setDoc(doc(db, "players", email), {
          wins: player.wins,
          losses: player.losses
      });
      console.log("Document written with ID: ", email);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
}
export function update(condition){
    if(condition === "w"){
        player.wins++;
    } else {
        player.losses++;
    }
    updateDoc();
}
async function updateDoc(){
    console.log(player);
    try {
      const docRef = await setDoc(doc(db, "players", player.email), {
          wins: player.wins,
          losses: player.losses
      });
      console.log("Document written with ID: ", player.email);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
}
async function checkUser(user){
    console.log("here")
    const docRef = doc(db, "players", user);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        player.losses = docSnap.data().losses;
        player.wins = docSnap.data().wins;
        console.log("doc exists")
        return true;
    } else {
        console.log("doc doesn't exist")
        return false;
    }
}
