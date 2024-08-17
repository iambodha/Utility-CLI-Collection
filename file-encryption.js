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