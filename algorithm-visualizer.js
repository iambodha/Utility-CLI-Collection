import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';
import Table from 'cli-table3';

const sleep = (ms = 2000) => new Promise((resolve) => setTimeout(resolve, ms));

const welcome = async () => {
    const title = 'Algorithm Visualizer';
    figlet(title, (err, data) => {
        console.log(gradient.pastel.multiline(data));
    });
    await sleep();
    console.log(chalk.green(`
Welcome to the ${chalk.blue('Enhanced Algorithm Visualizer CLI')}!
This tool allows you to visualize and compare various sorting and searching algorithms.
    `));
};

const sortingAlgorithms = {
    'Bubble Sort': bubbleSort,
    'Quick Sort': quickSort
};

const searchingAlgorithms = {
    'Linear Search': linearSearch,
    'Binary Search': binarySearch
};

const getAlgorithmType = async () => {
    const answer = await inquirer.prompt({
        name: 'type',
        type: 'list',
        message: 'Which type of algorithm would you like to visualize?',
        choices: ['Sorting', 'Searching'],
    });
    return answer.type;
};

const getAlgorithm = async (type) => {
    const algorithms = type === 'Sorting' ? sortingAlgorithms : searchingAlgorithms;
    const answer = await inquirer.prompt({
        name: 'algorithm',
        type: 'list',
        message: `Which ${type.toLowerCase()} algorithm would you like to visualize?`,
        choices: [...Object.keys(algorithms), 'Compare All'],
    });
    return answer.algorithm;
};

const getDataSize = async () => {
    const answer = await inquirer.prompt({
        name: 'size',
        type: 'input',
        message: 'Enter the size of the data (number of elements):',
        validate: (input) => {
            const num = parseInt(input);
            return !isNaN(num) && num > 0 ? true : 'Please enter a valid positive number.';
        },
    });
    return parseInt(answer.size);
};

const generateRandomArray = (size) => {
    return Array.from({ length: size }, () => Math.floor(Math.random() * 1000)).sort((a, b) => a - b);
};

const main = async () => {
    await welcome();
    const algorithmType = await getAlgorithmType();
    const algorithm = await getAlgorithm(algorithmType);
    const dataSize = await getDataSize();

    const spinner = createSpinner('Generating random data...').start();
    await sleep(1000);
    const data = generateRandomArray(dataSize);
    spinner.success({ text: 'Random data generated!' });

    let target;
    if (algorithmType === 'Searching') {
        displayDataSample(data);
        const targetAnswer = await inquirer.prompt({
            name: 'target',
            type: 'input',
            message: 'Enter the target value to search for:',
            validate: (input) => {
                const num = parseInt(input);
                return !isNaN(num) ? true : 'Please enter a valid number.';
            },
        });
        target = parseInt(targetAnswer.target);
    }

    if (algorithm === 'Compare All') {
        await compareAllAlgorithms(algorithmType, data, target);
    } else {
        const result = algorithmType === 'Sorting'
            ? await visualizeSortingAlgorithm(algorithm, data)
            : await visualizeSearchingAlgorithm(algorithm, data, target);

        console.log(chalk.yellow('\nResults:'));
        console.log(chalk.cyan(`Algorithm: ${result.name}`));
        console.log(chalk.cyan(`Data size: ${dataSize}`));
        console.log(chalk.cyan(`Time taken: ${result.time}`));
        console.log(chalk.cyan(`Number of iterations: ${result.iterations}`));
        console.log(chalk.cyan(`Memory usage: ${result.memory}`));
        if (algorithmType === 'Searching') {
            console.log(chalk.cyan(`Target found: ${result.found ? 'Yes' : 'No'}`));
            console.log(chalk.cyan(`Index: ${result.index}`));
        }
    }

    const answer = await inquirer.prompt({
        name: 'again',
        type: 'confirm',
        message: 'Would you like to visualize another algorithm?',
    });

    if (answer.again) {
        console.clear();
        main();
    } else {
        console.log(chalk.green('Thank you for using the Enhanced Algorithm Visualizer CLI!'));
        process.exit(0);
    }
};

main();
