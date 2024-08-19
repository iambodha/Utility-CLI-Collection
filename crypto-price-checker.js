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

async function searchCrypto(cryptoList) {
  const answers = await inquirer.prompt({
    name: 'search',
    type: 'input',
    message: 'Enter the name or symbol of the cryptocurrency:',
  });

  const searchTerm = answers.search.toLowerCase();
  const results = cryptoList.filter(coin => 
    coin.name.toLowerCase().includes(searchTerm) || 
    coin.symbol.toLowerCase().includes(searchTerm)
  );

  if (results.length === 0) {
    console.log(chalk.red('No cryptocurrencies found. Please try again.'));
    return searchCrypto(cryptoList);
  }

  return askCrypto(results);
}

async function askCrypto(cryptoList) {
  const answers = await inquirer.prompt({
    name: 'crypto',
    type: 'list',
    message: 'Which cryptocurrency would you like to check?',
    choices: cryptoList.map(coin => `${coin.name} (${coin.symbol.toUpperCase()})`),
  });

  const selectedCrypto = answers.crypto.match(/^(.+) \(/)[1];
  return cryptoList.find(coin => coin.name === selectedCrypto);
}

async function getPrice(cryptoId) {
  const spinner = createSpinner('Fetching price...').start();
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoId}&vs_currencies=usd`);
    const data = await response.json();
    spinner.success({ text: 'Price fetched successfully!' });
    return data[cryptoId].usd;
  } catch (error) {
    spinner.error({ text: 'Failed to fetch price. Please try again.' });
    process.exit(1);
  }
}

function displayPrice(crypto, price) {
  const formattedPrice = price < 0.01 ? price.toFixed(8) : price.toFixed(2);
  console.log(
    chalk.yellow(`Current price of ${crypto} is: `) +
    chalk.green(`$${formattedPrice}`)
  );

  const priceAnimation = chalkAnimation.rainbow(`$${formattedPrice}`);
  setTimeout(() => {
    priceAnimation.stop();
  }, 3000);
}

async function askToContinue() {
  const answer = await inquirer.prompt({
    name: 'continue',
    type: 'confirm',
    message: 'Would you like to check another cryptocurrency?',
  });

  return answer.continue;
}

async function main() {
  await welcome();
  
  let continueChecking = true;
  const cryptoList = await getCryptoList();

  while (continueChecking) {
    const method = await chooseCryptoMethod();
    let selectedCrypto;

    if (method === 'Search') {
      selectedCrypto = await searchCrypto(cryptoList);
    } else {
      selectedCrypto = await askCrypto(cryptoList.slice(0, 20));
    }

    const price = await getPrice(selectedCrypto.id);
    displayPrice(selectedCrypto.name, price);
    continueChecking = await askToContinue();
  }

  console.log(chalk.blue('Thank you for using the Crypto Price Checker CLI!'));
}

main().catch(console.error);
