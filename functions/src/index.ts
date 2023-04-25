import functions = require("firebase-functions");
import admin = require("firebase-admin");
import fs = require("fs")
// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
admin.initializeApp();
let wordsCom = "";
fs.promises.readFile("Words.txt").then((res) => {
  wordsCom = res.toString().trim();
}).catch((err) => {
  functions.logger.info(err);
});


export const words = functions.https.onCall(() => {
  while (wordsCom === null) {
    // this is bad but it will do.
  }
  const wordArr = wordsCom.split("\r\n");
  return wordArr[Math.floor(Math.random() * wordArr.length)];
});

