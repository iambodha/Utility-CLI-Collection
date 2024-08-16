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

  console.log(`
    ${chalk.bgBlue('HOW IT WORKS')}
    I will fetch news articles based on your preferences.
    Select a category, and I'll show you the latest news!
  `);
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

async function askCategory() {
  const answers = await inquirer.prompt({
    name: 'category',
    type: 'list',
    message: 'Which news category are you interested in?',
    choices: [
      'General',
      'Business',
      'Technology',
      'Science',
      'Health',
      'Sports',
      'Entertainment',
    ],
  });

  return answers.category.toLowerCase();
}

async function fetchNews(category) {
  const apiKey = 'YOUR_API_KEY_HERE';
  const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${apiKey}`;

  const spinner = createSpinner('Fetching news...').start();
  try {
    const response = await fetch(url);
    const data = await response.json();
    spinner.success({ text: 'News fetched successfully!' });
    return data.articles;
  } catch (error) {
    spinner.error({ text: 'Failed to fetch news. Please try again.' });
    console.error(error);
    process.exit(1);
  }
}

function displayNews(articles) {
  console.log('\n');
  articles.forEach((article, index) => {
    console.log(
      gradient.pastel(`${index + 1}. ${chalk.bold(article.title)}`)
    );
    console.log(chalk.dim(article.description));
    console.log(chalk.blue.underline(article.url));
    console.log('\n');
  });
}

async function askForMoreNews() {
  const answer = await inquirer.prompt({
    name: 'more_news',
    type: 'confirm',
    message: 'Would you like to fetch news from another category?',
  });

  return answer.more_news;
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