# SESL3
First make sure you have node installed

Install Firebase CLI
npm install -g firebase-tools 
// firebase commands should be run in cmd prompt for windows

Clone Repo
git@github.com:rettus-code/SESL3.git

Install Dependencies
npm i

Run
firebase serve

to push to repo
-First make your own branch, avoid pushing directly to main
git checkout -b your-branch-name

-steps for push (or you can use vscode sync)
Stage files then commit, got to main branch, pull, back to your branch, merge commit again, push

git add filename.txt

git commit

git checkout main

git pull
 
git checkout your-branch-name

git merge main

git commit 

git push


