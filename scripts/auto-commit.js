#!/usr/bin/env node

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
function autoCommitAndPush() {
  console.log('Checking for changes...');
  
  // Check if there are any changes
  const status = runGitCommand('git status --porcelain');
  
  if (!status || status === '') {
    console.log('No changes to commit.');
    return;
  }
  
  console.log('Changes detected. Adding files...');
  
  // Add all changes
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

// Run the function
autoCommitAndPush();