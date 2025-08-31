#!/usr/bin/env node

const chokidar = require('chokidar');
const { execSync } = require('child_process');
const path = require('path');

// Function to run git commands
function runGitCommand(command) {
  try {
    const result = execSync(command, { cwd: process.cwd(), encoding: 'utf-8' });
    return result.trim();
  } catch (error) {
    console.error(`Error running command: ${command}`);
    console.error(error.message);
    return null;
  }
}

// Function to auto commit and push
function autoCommitAndPush(filePath) {
  console.log(`File ${filePath} has been modified. Auto-committing changes...`);
  
  // Add the specific file
  runGitCommand(`git add \"${filePath}\"`);
  
  // Get current timestamp for commit message
  const timestamp = new Date().toISOString();
  const fileName = path.basename(filePath);
  const commitMessage = `Auto commit: Updated ${fileName} - ${timestamp}`;
  
  console.log(`Committing with message: ${commitMessage}`);
  
  // Commit changes
  const commitResult = runGitCommand(`git commit -m \"${commitMessage}\"`);
  
  if (commitResult) {
    console.log('Commit successful.');
    
    // Push changes
    console.log('Pushing changes...');
    const pushResult = runGitCommand('git push origin master');
    
    if (pushResult !== null) {
      console.log('Push successful.');
    } else {
      console.log('Push failed.');
    }
  } else {
    console.log('Commit failed.');
  }
}

// Create a watcher for all files in the project
const watcher = chokidar.watch('.', {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true,
  ignoreInitial: true,
  cwd: '.',
  ignored: [
    /node_modules/,
    /\.git/,
    /\.next/,
    /out/,
    /coverage/,
    /\.DS_Store/,
    /Thumbs.db/
  ]
});

console.log('Watching for file changes...');

// Listen for file changes
watcher
  .on('change', (path) => {
    autoCommitAndPush(path);
  })
  .on('add', (path) => {
    autoCommitAndPush(path);
  })
  .on('unlink', (path) => {
    console.log(`File ${path} has been removed.`);
    // For deletions, we need to handle them specially
    runGitCommand(`git rm \"${path}\"`);
  });

// Keep the process running
process.stdin.resume();