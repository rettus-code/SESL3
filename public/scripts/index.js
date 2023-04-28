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

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const functions = getFunctions();
// const auth = getAuth(app);
// const db = getFirestore(app);
const word = httpsCallable(functions, 'words');
let curWord = [];
let playerChallenge = false;
let index = 0;
let wrongCount = 0;//tracks the current words wrong guess count
let guesses = [];/*Maintains all guessed letters any repeats
are automatically scored as incorrect.*/
let correctCount = 0;
import { player } from "./auth.js";
import { update } from "./auth.js";
import { buildBoard} from "./auth.js";
export function pcPlay(){
  playerChallenge = false;
  resetGame();
  buildBoard();
  word().then((result) => {
    curWord = result.data.split("");
    challengeDisplay();
  })
}
export function pVP(){
  playerChallenge = true;
  resetGame();
  buildBoard();
  if(player.challenges.length < 1){
    alert("You have no current challenges")
    return
  }
  selectBuild();
  document.getElementById("challengeChoice").style.display = "block"
}
function selectBuild(){
  let form = document.getElementById("challengeSel");
  removeAllChildNodes(form);
  form.innerText = "Choose Your Challenger";
  for(let i = 0; i < player.challenges.length; i++){
    let s = document.createElement("option");
    s.value =  i;
    s.text = player.challenges[i].challenger;
    form.add(s);
  }
}
export function challengeSelect(){
  let form = document.getElementById("challengeSel");
  index = form.value;
  curWord = player.challenges[index].word.split("");
  document.getElementById("challengeChoice").style.display = "none"
  challengeDisplay();
}
function challengeDisplay(){
  wrongCount = 0;
  correctCount = 0;
  guesses = [];
  let chall = document.getElementById("challenge");
  removeAllChildNodes(chall);
  chall.innerHTML = "Your word to solve<br></br>";
  for(let i = 0; i < curWord.length; i++){
    let li = document.createElement("p");
    li.setAttribute("id", "list" + i);
    li.style.display = "inline";
    li.innerText = "_";
    chall.appendChild(li);
  }
  document.getElementById("guessForm").style.display = "block"
  document.getElementById("resultField").style.display = "block"
}
export function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}
export function guessForm(e){
  e.preventDefault();
  const data = document.getElementById("guessForm");
  let temp = data["letter"].value;
  if(validation(temp)){
    temp = temp.toLowerCase();
  } else {
    data.reset()
    return;
  }
  if(guesses.includes(temp)){
    wrongCount++;
    data.reset()
    botUpdate();
  } else if(!charMatch(temp)){
    wrongCount++;
    guesses.push(temp);
    data.reset()
    guessedLetters();
    botUpdate();
  } else {
    guesses.push(temp);
    data.reset()
    guessedLetters();
  }
}
function validation(char){
  const letters = new RegExp(/^[A-Za-z]+$/);
  if(char.length !== 1){
    alert("One Character Must Be Submitted!")
    wrongCount++;
    botUpdate();
    return false;
  }
  if(!char.match(letters)){
    alert("Only Letter Inputs Are Valid");
    wrongCount++;
    botUpdate();
    return false;
  }
  return true;
}
function botUpdate(){
  document.getElementById("wrong" + wrongCount).style.backgroundColor = "transparent"
  if(wrongCount > 5){
    update("l");
    document.getElementById("guessForm").style.display = "none";
    document.getElementById("lost").style.display = "block";
    document.getElementById("resultField").style.display = "none"
  }
}
function guessedLetters(){
  let gl = document.getElementById("guessedLetters");
  removeAllChildNodes(gl);
  gl.innerText = "Letters you've guessed: ";
  for(let i = 0; i < guesses.length; i++){
    let li = document.createElement("p");
    li.setAttribute("id", "letter" + i);
    li.style.display = "inline";
    li.innerText = guesses[i];
    gl.appendChild(li);
  }
}
function charMatch(char){
  let match = false;
  for(let i = 0; i < curWord.length; i++){
    if(char === curWord[i]){
      correctCount++;
      document.getElementById("list" + i).innerText = char;
      match = true;
      if(correctCount === curWord.length){
        win();
      }
    }
  }
  return match;
}
function win(){
  if(playerChallenge){
    player.challenges.splice(index, 1);
    index = 0;
  }
  update("w");
  document.getElementById("guessForm").style.display = "none";
  document.getElementById("lost").innerText = "You Won!!"
  document.getElementById("lost").style.display = "block";
  document.getElementById("resultField").style.display = "none"
}
function resetGame(){
  for(let i = 1; i <= 6; i++){
    document.getElementById("wrong" + i).style.backgroundColor = "#ffffff"
  }
  document.getElementById("lost").style.display = "none"
  
  guesses = [];
  wrongCount = 0;
  correctCount = 0;
  guessedLetters();
}