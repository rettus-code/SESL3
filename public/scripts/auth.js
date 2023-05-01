import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from"https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";
import { collection, getDoc, setDoc, getDocs, doc } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js"
import { removeAllChildNodes } from "./index.js";

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
    challenges: [],
    credential: ""
}
let challengeObj = {
    challenger: "",
    word: ""
}
let leaders = [];
const password = "12345678";
export async function userInfo(e){
    buildBoard();
    e.preventDefault();
    let user = document.getElementById("userInfo");
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
    document.getElementById("pVP").disabled = false;
    document.getElementById("issueChallenge").style.display = "block";
}
function signIn(email){
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        player.email = email;
        player.credential = userCredential.user;
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    });
}
function createUser(email){
    createDoc(email);
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        player.email = email;
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
          losses: player.losses,
          challenges: player.challenges
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
    try {
      const docRef = await setDoc(doc(db, "players", player.email), {
          wins: player.wins,
          losses: player.losses,
          challenges: player.challenges
      });
      console.log("Document written with ID: ", player.email);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
}
async function checkUser(user){
    const docRef = doc(db, "players", user);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        player.losses = docSnap.data().losses;
        player.wins = docSnap.data().wins;
        player.challenges = docSnap.data().challenges;
        return true;
    } else {
        return false;
    }
}
export async function buildBoard(){
        leaders = [];
        const gl = document.getElementById("leaderList");
        const querySnapshot = await getDocs(collection(db, "players"));
        querySnapshot.forEach((doc) => {
            let userId = doc.id;
            let userWins = doc.data().wins;
            let obj = { userId, userWins}
            leaders.push(obj);
    });
    addToList();
}
function addToList(){
    orderList();
    const gl = document.getElementById("leadList");
    removeAllChildNodes(gl);
    gl.innerHTML = "The players ordered by wins";
    for(let i = 0; i < leaders.length; i++){
        let li = document.createElement("p");
        li.setAttribute("id", "lead" + i);
        li.style.display = "block";
        li.innerText = leaders[i].userId + " has " + leaders[i].userWins + " wins.";
        gl.appendChild(li);
    }
}
function orderList(){
    leaders.sort((a,b) => b.userWins - a.userWins);
}

export function challengeForm(e){
    e.preventDefault();
    let challenged = document.getElementById("challengeForm");
    let chEmail = challenged["challengeEmail"].value.toLowerCase();
    if( chEmail === player.email){
        alert("You can't send yourself challenges");
        challenged.reset();
        return
    }
    let challengedPlayer = {
        email: chEmail,
        wins: 0,
        losses: 0,
        challenges: [],
    }
    addChallenge(challengedPlayer, challenged["playerWord"].value);
    challenged.reset();
}
async function addChallenge(cp, word){
    challengeObj.challenger = player.email;
    challengeObj.word = word;
    checkChallenged(cp)
}   
async function checkChallenged(cp){
    const docRef = doc(db, "players", cp.email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        cp.losses = docSnap.data().losses;
        cp.wins = docSnap.data().wins;
        cp.challenges = docSnap.data().challenges;
        cp.challenges.push(challengeObj)
        setChallenge(cp);
    } else {
        cp.challenges.push(challengeObj)
        setChallenge(cp);
    }
}
async function setChallenge(cp){
    try {
      const docRef = await setDoc(doc(db, "players", cp.email), {
          wins: cp.wins,
          losses: cp.losses,
          challenges: cp.challenges
      });
      console.log("Document written with ID: ", cp.email);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
}
