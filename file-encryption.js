import fs from 'fs';
import crypto from 'crypto';
import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

async function welcome() {
  const title = 'File Encryption CLI';
  figlet(title, (err, data) => {
    console.log(gradient.pastel.multiline(data));
  });

  await sleep();
  console.log(`
    ${chalk.bgBlue('HOW TO USE')}
    I will ask you a few questions about the file you want to encrypt or decrypt.
    Please make sure the file is in the same directory as this script.
  `);
}

const algorithms = [
  'aes-256-cbc',
  'aes-192-cbc',
  'aes-128-cbc',
  'des-ede3-cbc',
  'camellia-256-cbc',
  'aria-256-cbc',
];

async function askQuestions() {
  const questions = [
    {
      type: 'list',
      name: 'operation',
      message: 'What do you want to do?',
      choices: ['Encrypt', 'Decrypt'],
    },
    {
      type: 'input',
      name: 'inputFile',
      message: 'Enter the name of the input file:',
    },
    {
      type: 'input',
      name: 'outputFile',
      message: 'Enter the name of the output file:',
    },
    {
      type: 'password',
      name: 'password',
      message: 'Enter the encryption/decryption password:',
      mask: '*',
    },
    {
      type: 'list',
      name: 'algorithm',
      message: 'Choose an encryption algorithm:',
      choices: algorithms,
    },
  ];

  return inquirer.prompt(questions);
}

function encryptFile(inputFile, outputFile, password, algorithm) {
  const spinner = createSpinner('Encrypting file...').start();

  try {
    const input = fs.readFileSync(inputFile);
    const key = crypto.scryptSync(password, 'salt', 32);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([iv, cipher.update(input), cipher.final()]);

    fs.writeFileSync(outputFile, encrypted);

    spinner.success({ text: chalk.green('File encrypted successfully!') });
  } catch (error) {
    spinner.error({ text: chalk.red(`Error: ${error.message}`) });
  }
}

function decryptFile(inputFile, outputFile, password, algorithm) {
  const spinner = createSpinner('Decrypting file...').start();

  try {
    const input = fs.readFileSync(inputFile);
    const key = crypto.scryptSync(password, 'salt', 32);
    const iv = input.slice(0, 16);
    const encryptedData = input.slice(16);

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);

    fs.writeFileSync(outputFile, decrypted);

    spinner.success({ text: chalk.green('File decrypted successfully!') });
  } catch (error) {
    spinner.error({ text: chalk.red(`Error: ${error.message}`) });
  }
}

async function main() {
  await welcome();
  const answers = await askQuestions();

  if (answers.operation === 'Encrypt') {
    encryptFile(answers.inputFile, answers.outputFile, answers.password, answers.algorithm);
  } else {
    decryptFile(answers.inputFile, answers.outputFile, answers.password, answers.algorithm);
  }

  console.log(chalk.yellow('\nThank you for using the File Encryption CLI!'));
  const rainbowTitle = chalkAnimation.rainbow('Come back soon!');
  await sleep();
  rainbowTitle.stop();
}

main().catch((error) => {
  console.error(chalk.red('An error occurred:'), error);
});