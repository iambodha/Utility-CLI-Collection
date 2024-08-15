import os from 'os';
import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';

const sleep = (ms = 2000) => new Promise((resolve) => setTimeout(resolve, ms));

async function welcome() {
  const title = 'System Resource Monitor';
  figlet(title, (err, data) => {
    console.log(gradient.pastel.multiline(data));
  });

}

function getSystemInfo() {
  return {
    platform: os.platform(),
    arch: os.arch(),
    cpus: os.cpus(),
    totalMem: os.totalmem(),
    freeMem: os.freemem(),
    uptime: os.uptime(),
  };
}

function formatBytes(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

async function monitorResources() {
  while (true) {
    await displaySystemInfo();
    const { action } = await inquirer.prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'Refresh',
        'Exit'
      ],
    });

    if (action === 'Exit') {
      console.log(chalk.green('Thank you for using the System Resource Monitor CLI!'));
      process.exit(0);
    }
  }
}

async function main() {
  await welcome();
  await monitorResources();
}

main().catch((error) => {
  console.error(chalk.red('An error occurred:'), error);
  process.exit(1);
});
