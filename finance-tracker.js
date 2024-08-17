import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';
import fs from 'fs/promises';

const DATA_FILE = 'finance_data.json';
let transactions = [];
let balance = 0;

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

async function loadData() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const parsedData = JSON.parse(data);
    transactions = parsedData.transactions;
    balance = parsedData.balance;
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error(chalk.red('Error loading data:'), error);
    }
  }
}

async function saveData() {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify({ transactions, balance }));
  } catch (error) {
    console.error(chalk.red('Error saving data:'), error);
  }
}

async function welcome() {
  const title = 'Finance Tracker';
  figlet(title, (err, data) => {
    console.log(gradient.pastel.multiline(data));
  });

  await sleep();
  console.log(
    chalk.green(
      `Welcome to your personal Finance Tracker CLI!
      Let's manage your finances together.`
    )
  );
}

function viewTransactions(start = 0, limit = 10) {
  console.log(chalk.blue.bold('\nYour Transactions:'));
  const end = Math.min(start + limit, transactions.length);
  transactions.slice(start, end).forEach((t, index) => {
    const color = t.type === 'Income' ? chalk.green : chalk.red;
    console.log(
      color(`${start + index + 1}. ${t.type}: $${t.amount.toFixed(2)} - ${t.description} (${new Date(t.date).toLocaleDateString()})`)
    );
  });
}