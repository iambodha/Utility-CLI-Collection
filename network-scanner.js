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