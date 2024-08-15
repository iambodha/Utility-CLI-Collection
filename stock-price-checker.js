import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';
import axios from 'axios';

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
