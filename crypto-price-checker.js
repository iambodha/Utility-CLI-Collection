import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';
import fetch from 'node-fetch';

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

async function welcome() {
  const title = 'Crypto Price Checker';
  figlet(title, (err, data) => {
    console.log(gradient.pastel.multiline(data));
  });

  await sleep();
  console.log(
    chalk.green(
      `Welcome to the Cryptocurrency Price Checker CLI!
      Let's check some crypto prices!`
    )
  );
}

async function getCryptoList() {
  const spinner = createSpinner('Fetching cryptocurrency list...').start();
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/list');
    const data = await response.json();
    spinner.success({ text: 'Cryptocurrency list fetched successfully!' });
    return data.map(coin => ({ name: coin.name, id: coin.id, symbol: coin.symbol }));
  } catch (error) {
    spinner.error({ text: 'Failed to fetch cryptocurrency list. Please try again.' });
    process.exit(1);
  }
}

async function chooseCryptoMethod() {
  const answers = await inquirer.prompt({
    name: 'method',
    type: 'list',
    message: 'How would you like to select a cryptocurrency?',
    choices: ['Search', 'Choose from list'],
  });

  return answers.method;
}

async function askToContinue() {
  const answer = await inquirer.prompt({
    name: 'continue',
    type: 'confirm',
    message: 'Would you like to check another cryptocurrency?',
  });

  return answer.continue;
}
