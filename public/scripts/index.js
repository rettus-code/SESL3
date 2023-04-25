import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-functions.js";
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
let wrongCount = 0;
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const functions = getFunctions();
// const auth = getAuth(app);
// const db = getFirestore(app);
const word = httpsCallable(functions, 'words');
let curWord = [];
export function pcPlay(){
  word().then((result) => {
    curWord = result.data.split("");
    console.log(curWord);
    challengeDisplay();
  })
}
function challengeDisplay(){
  wrongCount = 0;
  let chall = document.getElementById("challenge");
  removeAllChildNodes(chall);
  chall.innerText = "Your word to solve";

  for(let i = 1; i <= curWord.length; i++){
    let li = document.createElement("p");
    li.setAttribute("id", "list" + i);
    li.style.listStyle = "none";
    li.style.display = "inline";
    li.innerText = "_";
    chall.appendChild(li);
  }
  document.getElementById("guessForm").style.display = "block"
}
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}