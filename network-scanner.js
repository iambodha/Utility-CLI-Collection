import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';
import { networkInterfaces } from 'os';
import ping from 'ping';
import dns from 'dns';
import { promisify } from 'util';

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

async function welcome() {
  const title = 'Network Scanner';
  figlet(title, (err, data) => {
    console.log(gradient.pastel.multiline(data));
  });

  await sleep();
  console.log(`
    ${chalk.bgBlue('HOW TO USE')}
    I will scan your network and provide information about connected devices.
    If you want to quit, press ${chalk.bgRed('Ctrl + C')}
    Let's begin...
  `);
}

async function getLocalIP() {
  const interfaces = networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

async function scanNetwork(baseIP) {
  const spinner = createSpinner('Scanning network...').start();
  const devices = [];

  for (let i = 1; i < 255; i++) {
    const ip = baseIP.replace(/\d+$/, i);
    const res = await ping.promise.probe(ip, {
      timeout: 1,
      extra: ['-c', '1'],
    });

    if (res.alive) {
      try {
        const hostname = await promisify(dns.reverse)(ip);
        devices.push({ ip, hostname: hostname[0] || 'Unknown' });
      } catch (error) {
        devices.push({ ip, hostname: 'Unknown' });
      }
    }
  }

  spinner.success({ text: 'Scan complete!' });
  return devices;
}

async function displayResults(devices) {
  console.log(chalk.green('\nDevices found:'));
  devices.forEach((device, index) => {
    console.log(chalk.yellow(`${index + 1}. IP: ${device.ip}, Hostname: ${device.hostname}`));
  });
}

async function chooseAction() {
  const answers = await inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
      'Scan network',
      'View last scan results',
      'Exit',
    ],
  });

  return answers.action;
}

async function main() {
  await welcome();
  let devices = [];

  while (true) {
    const action = await chooseAction();

    if (action === 'Scan network') {
      const localIP = await getLocalIP();
      const baseIP = localIP.substring(0, localIP.lastIndexOf('.') + 1);
      const rainbow = chalkAnimation.rainbow('Starting network scan...');
      await sleep(1000);
      rainbow.stop();

      devices = await scanNetwork(baseIP);
      await displayResults(devices);
    } else if (action === 'View last scan results') {
      if (devices.length === 0) {
        console.log(chalk.red('No scan results available. Please perform a scan first.'));
      } else {
        await displayResults(devices);
      }
    } else {
      console.log(chalk.blue('Thank you for using the Network Scanner CLI!'));
      process.exit(0);
    }

    await sleep(1000);
  }
}

main().catch((error) => {
  console.error(chalk.red('An error occurred:'), error);
  process.exit(1);
});