import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';
import axios from 'axios';

const API_KEY = 'YOUR_API_KEY';

const BASE_URL = 'https://www.alphavantage.co/query';

async function fetchStockData(symbol) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'TIME_SERIES_INTRADAY',
        symbol,
        interval: '1min',
        apikey: API_KEY
      }
    });

    const data = response.data['Time Series (1min)'];
    const latestTimestamp = Object.keys(data)[0];
    const latestData = data[latestTimestamp];

    return {
      symbol,
      price: parseFloat(latestData['1. open']),
      change: ((parseFloat(latestData['1. close']) - parseFloat(latestData['1. open'])) / parseFloat(latestData['1. open'])) * 100
    };
  } catch (error) {
    console.error(chalk.red('Error fetching stock data:'), error);
    return null;
  }
}

async function welcome() {
  const title = 'Stock Market CLI';
  figlet(title, (err, data) => {
    console.log(gradient.pastel.multiline(data));
  });

  await sleep();
  console.log(
    chalk.green(
      'Welcome to the Stock Market CLI! Here you can check stock prices, browse listings, and get detailed information.'
    )
  );
}

async function searchStock() {
  const answers = await inquirer.prompt({
    name: 'stock_symbol',
    type: 'input',
    message: 'Enter the stock symbol you want to search:',
    default() {
      return 'AAPL';
    },
  });
async function mainMenu() {
  const choices = [
    { name: 'Search for a stock', value: 'search' },
    { name: 'Browse stock listings', value: 'browse' },
    { name: 'Exit', value: 'exit' },
  ];

  while (true) {
    const answer = await inquirer.prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices,
    });

    switch (answer.action) {
      case 'search':
        await searchStock();
        break;
      case 'browse':
        await browseStocks();
        break;
      case 'exit':
        console.log(chalk.yellow('Thank you for using Stock Market CLI. Goodbye!'));
        return;
    }

    await sleep(1000);
  }
}


async function main() {
  await welcome();
  await mainMenu();
}

main().catch((error) => {
  console.error(chalk.red('An error occurred:'), error);
});
