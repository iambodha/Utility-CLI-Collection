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