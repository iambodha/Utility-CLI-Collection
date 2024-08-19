import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

async function welcome() {
  const title = 'Calculator CLI';
  figlet(title, (err, data) => {
    console.log(gradient.pastel.multiline(data));
  });

  await sleep();
  console.log(
    chalk.cyan(
      `Welcome to the most ${chalk.bold('awesome')} calculator CLI you've ever seen!`
    )
  );
}

async function askOperation() {
  const operations = await inquirer.prompt({
    name: 'operation',
    type: 'list',
    message: 'What operation would you like to perform?',
    choices: [
      'Addition',
      'Subtraction',
      'Multiplication',
      'Division',
      'Exit'
    ],
  });

  return operations.operation;
}

async function askNumbers() {
  const numbers = await inquirer.prompt([
    {
      name: 'num1',
      type: 'number',
      message: 'Enter the first number:',
      validate: (input) => {
        if (isNaN(input)) {
          return 'Please enter a valid number';
        }
        return true;
      },
    },
    {
      name: 'num2',
      type: 'number',
      message: 'Enter the second number:',
      validate: (input) => {
        if (isNaN(input)) {
          return 'Please enter a valid number';
        }
        return true;
      },
    },
  ]);

  return [numbers.num1, numbers.num2];
}