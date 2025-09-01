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
  
  try {
    // Check if there are any changes to commit
    const status = runGitCommand('git status --porcelain');
    
    if (!status || status === '') {
      console.log('No changes to commit.');
      return;
    }
    
    // Add all changes
    console.log('Adding all changes...');
    runGitCommand('git add .');
    
    // Get current timestamp for commit message
    const timestamp = new Date().toISOString();
    const commitMessage = `Auto commit: ${timestamp}`;
    
    console.log(`Committing with message: ${commitMessage}`);
    
    // Commit changes
    const commitResult = runGitCommand(`git commit -m "${commitMessage}"`);
    
    if (commitResult) {
      console.log('Commit successful.');
      
      // Push changes
      console.log('Pushing changes...');
      const pushResult = runGitCommand('git push origin main');
      
      if (pushResult !== null) {
        console.log('Push successful.');
      } else {
        console.log('Push failed.');
      }
    } else {
      console.log('Commit failed.');
    }
  } catch (error) {
    console.error('Error during auto commit and push:', error.message);
  }
}

// Debounce function to prevent too many commits
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Create a debounced version of autoCommitAndPush
const debouncedAutoCommitAndPush = debounce(autoCommitAndPush, 5000); // 5 second delay

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
    /Thumbs.db/,
    /\.env/,
    /\.env.local/,
    /\.env.development.local/,
    /\.env.test.local/,
    /\.env.production.local/
  ]
});

console.log('Watching for file changes...');

// Listen for file changes
watcher
  .on('change', (path) => {
    debouncedAutoCommitAndPush(path);
  })
  .on('add', (path) => {
    debouncedAutoCommitAndPush(path);
  })
  .on('unlink', (path) => {
    console.log(`File ${path} has been removed.`);
    // For deletions, we need to handle them specially
    runGitCommand(`git rm "${path}"`);
    debouncedAutoCommitAndPush(path);
  });

// Keep the process running
process.stdin.resume();