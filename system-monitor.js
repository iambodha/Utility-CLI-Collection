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

  await sleep();
  console.log(
    chalk.green(
      'Welcome to the System Resource Monitor CLI! Let\'s check your system resources.'
    )
  );
  await sleep();
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

function formatUptime(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  return `${days}d ${hours}h ${minutes}m ${secs}s`;
}

async function displaySystemInfo() {
  const spinner = createSpinner('Fetching system information...').start();
  await sleep(1500);

  const info = getSystemInfo();
  spinner.success({ text: 'System information retrieved successfully!' });

  console.log('\n');
  console.log(chalk.blue.bold('System Information:'));
  console.log(chalk.yellow('Platform:'), info.platform);
  console.log(chalk.yellow('Architecture:'), info.arch);
  console.log(chalk.yellow('CPUs:'), info.cpus.length);
  console.log(chalk.yellow('Total Memory:'), formatBytes(info.totalMem));
  console.log(chalk.yellow('Free Memory:'), formatBytes(info.freeMem));
  console.log(chalk.yellow('Uptime:'), formatUptime(info.uptime));

  console.log('\n');
  const cpuUsage = chalkAnimation.radar('CPU Usage: Monitoring...');
  await sleep(3000);
  cpuUsage.stop();

  console.log('\n');
  const memUsage = chalkAnimation.rainbow(`Memory Usage: ${((info.totalMem - info.freeMem) / info.totalMem * 100).toFixed(2)}%`);
  await sleep(3000);
  memUsage.stop();
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
