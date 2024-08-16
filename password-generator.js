import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

async function welcome() {
  const title = 'Password Generator';
  figlet(title, (err, data) => {
    console.log(gradient.pastel.multiline(data));
  });

  await sleep();
  console.log(
    chalk.cyan(
      `Welcome to the Password Generator CLI!\nLet's create a secure password for you.`
    )
  );
}

function generateStandardPassword(length, useUppercase, useLowercase, useNumbers, useSpecial) {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let chars = '';
  if (useUppercase) chars += uppercase;
  if (useLowercase) chars += lowercase;
  if (useNumbers) chars += numbers;
  if (useSpecial) chars += special;

  return Array(length)
    .fill(null)
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join('');
}

function generateXKCDPassword(words) {
  const wordList = ['correct', 'horse', 'battery', 'staple', 'apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape', 'honeydew'];
  return Array(words)
    .fill(null)
    .map(() => wordList[Math.floor(Math.random() * wordList.length)])
    .join('-');
}

function generatePINPassword(length) {
  return Array(length)
    .fill(null)
    .map(() => Math.floor(Math.random() * 10))
    .join('');
}

function transformPhrase(phrase) {
  const transformations = {
    'a': '@',
    'e': '3',
    'i': '1',
    'o': '0',
    's': '$',
    't': '7',
    'b': '8',
    'g': '9',
    'l': '1'
  };

  return phrase.split('').map(char => {
    const lowerChar = char.toLowerCase();
    return transformations[lowerChar] || char;
  }).join('');
}

async function getPasswordOptions() {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'algorithm',
      message: 'Choose a password generation algorithm:',
      choices: ['Standard', 'XKCD Style', 'PIN', 'Phrase Transformation'],
    },
    {
      type: 'number',
      name: 'length',
      message: 'Enter password length:',
      default: 12,
      when: (answers) => answers.algorithm === 'Standard' || answers.algorithm === 'PIN',
    },
    {
      type: 'number',
      name: 'words',
      message: 'Enter number of words:',
      default: 4,
      when: (answers) => answers.algorithm === 'XKCD Style',
    },
    {
      type: 'input',
      name: 'phrase',
      message: 'Enter a phrase to transform:',
      when: (answers) => answers.algorithm === 'Phrase Transformation',
      validate: (input) => input.length > 0 || 'Please enter a phrase',
    },
    {
      type: 'confirm',
      name: 'uppercase',
      message: 'Include uppercase letters?',
      default: true,
      when: (answers) => answers.algorithm === 'Standard',
    },
    {
      type: 'confirm',
      name: 'lowercase',
      message: 'Include lowercase letters?',
      default: true,
      when: (answers) => answers.algorithm === 'Standard',
    },
    {
      type: 'confirm',
      name: 'numbers',
      message: 'Include numbers?',
      default: true,
      when: (answers) => answers.algorithm === 'Standard',
    },
    {
      type: 'confirm',
      name: 'special',
      message: 'Include special characters?',
      default: true,
      when: (answers) => answers.algorithm === 'Standard',
    },
  ]);

  return answers;
}

async function generatePassword(options) {
  const spinner = createSpinner('Generating your password...').start();
  await sleep(1500);

  let password;
  switch (options.algorithm) {
    case 'Standard':
      password = generateStandardPassword(
        options.length,
        options.uppercase,
        options.lowercase,
        options.numbers,
        options.special
      );
      break;
    case 'XKCD Style':
      password = generateXKCDPassword(options.words);
      break;
    case 'PIN':
      password = generatePINPassword(options.length);
      break;
    case 'Phrase Transformation':
      password = transformPhrase(options.phrase);
      break;
  }

  spinner.success({ text: 'Password generated successfully!' });
  return password;
}

async function main() {
  await welcome();
  const options = await getPasswordOptions();
  const password = await generatePassword(options);

  console.log('\nYour generated password is:');
  const rainbow = chalkAnimation.rainbow(password);
  await sleep(2000);
  rainbow.stop();

  console.log(chalk.green('\nPassword strength:'));
  if (options.algorithm === 'Standard' && options.length >= 12 && options.uppercase && options.lowercase && options.numbers && options.special) {
    console.log(chalk.green('Strong - Good job!'));
  } else if (options.algorithm === 'XKCD Style' && options.words >= 4) {
    console.log(chalk.green('Strong - Good job!'));
  } else if (options.algorithm === 'PIN' && options.length >= 6) {
    console.log(chalk.yellow('Moderate - Consider using a longer PIN or a different algorithm for sensitive accounts.'));
  } else if (options.algorithm === 'Phrase Transformation' && password.length >= 12) {
    console.log(chalk.green('Strong - Good job!'));
  } else {
    console.log(chalk.red('Weak - Consider increasing length or complexity.'));
  }
}

main().catch((error) => {
  console.error(chalk.red('An error occurred:'), error);
});