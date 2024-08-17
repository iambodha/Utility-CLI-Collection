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

  await sleep();
  console.log(
    chalk.green(
      `Welcome to the ${chalk.bold('Git Commit Visualizer')}!\nLet's explore your Git history in style!\n`
    )
  );
}

function getGitLog(limit = 10, branch = 'HEAD') {
  try {
    const command = `git log ${branch} -n ${limit} --pretty=format:"%h|%s|%an|%ar|%b"`;
    const output = execSync(command).toString().trim();
    return output.split('\n\n').map(commit => {
      const [hash, subject, author, date, ...bodyParts] = commit.split('|');
      const body = bodyParts.join('|').trim();
      return { hash, subject, author, date, body };
    });
  } catch (error) {
    console.error(chalk.red("Error: Unable to fetch Git log. Make sure you're in a Git repository."));
    process.exit(1);
  }
}

function getBranches() {
  try {
    const command = 'git branch';
    const output = execSync(command).toString().trim();
    return output.split('\n').map(branch => branch.replace('* ', '').trim());
  } catch (error) {
    console.error(chalk.red('Error: Unable to fetch Git branches.'));
    process.exit(1);
  }
}

function visualizeCommits(commits) {
  console.log(chalk.blue('\nCommit History:\n'));
  commits.forEach((commit, index) => {
    const coloredHash = chalk.yellow(commit.hash);
    const coloredSubject = chalk.green(commit.subject);
    const coloredAuthor = chalk.cyan(commit.author);
    const coloredDate = chalk.magenta(commit.date);

    console.log(`${chalk.blue('●')} ${coloredHash} - ${coloredSubject}`);
    console.log(`  ${chalk.gray('Author:')} ${coloredAuthor}`);
    console.log(`  ${chalk.gray('Date:')} ${coloredDate}`);
    if (commit.body) {
      console.log(`  ${chalk.gray('Message:')} ${chalk.white(commit.body)}`);
    }

    if (index < commits.length - 1) {
      console.log(chalk.blue('│'));
    }
  });
}

async function getCommitLimit() {
  const answer = await inquirer.prompt({
    name: 'limit',
    type: 'input',
    message: 'How many commits would you like to visualize?',
    default: '10',
    validate: (input) => {
      const num = parseInt(input);
      return !isNaN(num) && num > 0 ? true : 'Please enter a valid positive number.';
    },
  });

  return parseInt(answer.limit);
}

async function selectBranch(branches) {
  const answer = await inquirer.prompt({
    name: 'branch',
    type: 'list',
    message: 'Which branch would you like to visualize?',
    choices: ['HEAD', ...branches],
  });

  return answer.branch;
}

async function selectVisualizationOptions() {
  const answer = await inquirer.prompt({
    name: 'options',
    type: 'checkbox',
    message: 'Select additional information to display:',
    choices: [
      { name: 'Show commit message body', value: 'body', checked: false },
      { name: 'Show branch graph', value: 'graph', checked: false },
    ],
  });

  return answer.options;
}

function visualizeBranchGraph(branch) {
  try {
    const command = `git log --graph --oneline --decorate --all -n 20`;
    const output = execSync(command).toString().trim();
    console.log(chalk.blue('\nBranch Graph:\n'));
    console.log(chalk.white(output));
  } catch (error) {
    console.error(chalk.red('Error: Unable to generate branch graph.'));
  }
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