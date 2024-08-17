import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';
import { execSync } from 'child_process';

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

async function welcome() {
  const title = 'Git Commit Visualizer';
  figlet(title, (err, data) => {
    console.log(gradient.pastel.multiline(data));
  });
}

async function main() {
  await welcome();

  const spinner = createSpinner('Fetching Git information...').start();
  await sleep(1000);

  const branches = getBranches();
  spinner.success({ text: 'Git information fetched successfully!' });

  const branch = await selectBranch(branches);
  const limit = await getCommitLimit();
  const options = await selectVisualizationOptions();

  spinner.start('Visualizing Git history...');
  await sleep(1000);

  const commits = getGitLog(limit, branch);
  visualizeCommits(commits.map(commit => ({
    ...commit,
    body: options.includes('body') ? commit.body : null,
  })));

  if (options.includes('graph')) {
    visualizeBranchGraph(branch);
  }

  spinner.success({ text: 'Git history visualized successfully!' });

  const rainbowTitle = chalkAnimation.rainbow(
    '\nThanks for using the Git Commit Visualizer!'
  );

  await sleep(2000);
  rainbowTitle.stop();
}

main().catch((error) => {
  console.error(chalk.red('An error occurred:'), error);
  process.exit(1);
});