import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';
import fetch from 'node-fetch';

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

async function welcome() {
  const title = 'Website Monitor';
  figlet(title, (err, data) => {
    console.log(gradient.pastel.multiline(data));
  });

  await sleep();
  console.log(`
    ${chalk.bgBlue('HOW TO USE')}
    I will ask you to enter a website URL.
    Then I will monitor its status and response time.
    
    ${chalk.bgRed('NOTE:')} Make sure to include the protocol (http:// or https://)
  `);
}

async function askWebsite() {
  const answers = await inquirer.prompt({
    name: 'website_url',
    type: 'input',
    message: 'Enter the website URL you want to monitor:',
    default() {
      return 'https://www.example.com';
    },
  });

  return answers.website_url;
}

async function monitorWebsite(url) {
  const spinner = createSpinner('Monitoring website...').start();
  try {
    const start = Date.now();
    const response = await fetch(url);
    const end = Date.now();
    const responseTime = end - start;

    if (response.ok) {
      spinner.success({ text: `${chalk.green('Website is up!')} Response time: ${chalk.yellow(responseTime + 'ms')}` });
    } else {
      spinner.error({ text: `${chalk.red('Website is down!')} Status: ${response.status} ${response.statusText}` });
    }
  } catch (error) {
    spinner.error({ text: `${chalk.red('Error occurred:')} ${error.message}` });
  }
}

async function main() {
  await welcome();
  const website = await askWebsite();
  
  console.log(`\nStarting monitoring for ${chalk.cyan(website)}\n`);
  
  while (true) {
    await monitorWebsite(website);
    await sleep(5000);
  }
}

main().catch((error) => {
  console.error('An error occurred:', error);
  process.exit(1);
});
