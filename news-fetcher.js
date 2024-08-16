import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';
import fetch from 'node-fetch';

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

async function welcome() {
  const rainbowTitle = chalkAnimation.rainbow(
    'Welcome to the News Fetcher CLI!'
  );

  await sleep();
  rainbowTitle.stop();

}

async function askName() {
  const answers = await inquirer.prompt({
    name: 'user_name',
    type: 'input',
    message: 'What is your name?',
    default() {
      return 'User';
    },
  });

  return answers.user_name;
}

async function main() {
  await welcome();
  const userName = await askName();

  console.log(
    gradient.pastel.multiline(
      figlet.textSync(`Hello, ${userName}!`, {
        font: 'Small',
        horizontalLayout: 'fitted',
      })
    )
  );

  let fetchMore = true;
  while (fetchMore) {
    const category = await askCategory();
    const articles = await fetchNews(category);
    displayNews(articles);
    fetchMore = await askForMoreNews();
  }

  console.log(chalk.green.bold('Thank you for using the News Fetcher CLI!'));
}

main().catch((error) => {
  console.error(chalk.red('An error occurred:'), error);
  process.exit(1);
}); 