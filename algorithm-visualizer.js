import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';
import Table from 'cli-table3';

// Sorting algorithms
const bubbleSort = (arr) => {
    let iterations = 0;
    const n = arr.length;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            iterations++;
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return { sorted: arr, iterations };
};

const quickSort = (arr) => {
    let iterations = 0;
    const sort = (arr, low, high) => {
        if (low < high) {
            let pi = partition(arr, low, high);
            sort(arr, low, pi - 1);
            sort(arr, pi + 1, high);
        }
    };

    const partition = (arr, low, high) => {
        let pivot = arr[high];
        let i = low - 1;
        for (let j = low; j < high; j++) {
            iterations++;
            if (arr[j] < pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        }
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        return i + 1;
    };

    sort(arr, 0, arr.length - 1);
    return { sorted: arr, iterations };
};

const insertionSort = (arr) => {
    let iterations = 0;
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            iterations++;
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
    return { sorted: arr, iterations };
};

const mergeSort = (arr) => {
    let iterations = 0;
    const merge = (left, right) => {
        let result = [];
        let leftIndex = 0;
        let rightIndex = 0;

        while (leftIndex < left.length && rightIndex < right.length) {
            iterations++;
            if (left[leftIndex] < right[rightIndex]) {
                result.push(left[leftIndex]);
                leftIndex++;
            } else {
                result.push(right[rightIndex]);
                rightIndex++;
            }
        }

        return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
    };

    const sort = (arr) => {
        if (arr.length <= 1) {
            return arr;
        }

        const middle = Math.floor(arr.length / 2);
        const left = arr.slice(0, middle);
        const right = arr.slice(middle);

        return merge(sort(left), sort(right));
    };

    const sorted = sort(arr);
    return { sorted, iterations };
};

const heapSort = (arr) => {
    let iterations = 0;
    const heapify = (arr, n, i) => {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;

        if (left < n && arr[left] > arr[largest]) {
            largest = left;
        }

        if (right < n && arr[right] > arr[largest]) {
            largest = right;
        }

        if (largest !== i) {
            iterations++;
            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            heapify(arr, n, largest);
        }
    };

    const n = arr.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }

    for (let i = n - 1; i > 0; i--) {
        iterations++;
        [arr[0], arr[i]] = [arr[i], arr[0]];
        heapify(arr, i, 0);
    }

    return { sorted: arr, iterations };
};

const countingSort = (arr) => {
    let iterations = 0;
    const max = Math.max(...arr);
    const min = Math.min(...arr);
    const range = max - min + 1;
    const count = new Array(range).fill(0);
    const output = new Array(arr.length);

    for (let i = 0; i < arr.length; i++) {
        count[arr[i] - min]++;
        iterations++;
    }

    for (let i = 1; i < count.length; i++) {
        count[i] += count[i - 1];
        iterations++;
    }

    for (let i = arr.length - 1; i >= 0; i--) {
        output[count[arr[i] - min] - 1] = arr[i];
        count[arr[i] - min]--;
        iterations++;
    }

    for (let i = 0; i < arr.length; i++) {
        arr[i] = output[i];
        iterations++;
    }

    return { sorted: arr, iterations };
};

const radixSort = (arr) => {
    let iterations = 0;
    const getMax = (arr) => {
        let max = arr[0];
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] > max) {
                max = arr[i];
            }
            iterations++;
        }
        return max;
    };

// Searching Algortihms
const linearSearch = (arr, target) => {
    let iterations = 0;
    for (let i = 0; i < arr.length; i++) {
        iterations++;
        if (arr[i] === target) {
            return { found: true, index: i, iterations };
        }
    }
    return { found: false, index: -1, iterations };
};

const binarySearch = (arr, target) => {
    let iterations = 0;
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
        iterations++;
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) {
            return { found: true, index: mid, iterations };
        }
        if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return { found: false, index: -1, iterations };
};

const jumpSearch = (arr, target) => {
    let iterations = 0;
    const n = arr.length;
    let step = Math.floor(Math.sqrt(n));
    let prev = 0;

    while (arr[Math.min(step, n) - 1] < target) {
        iterations++;
        prev = step;
        step += Math.floor(Math.sqrt(n));
        if (prev >= n) {
            return { found: false, index: -1, iterations };
        }
    }

    while (arr[prev] < target) {
        iterations++;
        prev++;
        if (prev === Math.min(step, n)) {
            return { found: false, index: -1, iterations };
        }
    }

    if (arr[prev] === target) {
        return { found: true, index: prev, iterations };
    }

    return { found: false, index: -1, iterations };
};

const interpolationSearch = (arr, target) => {
    let iterations = 0;
    let low = 0;
    let high = arr.length - 1;

    while (low <= high && target >= arr[low] && target <= arr[high]) {
        iterations++;
        if (low === high) {
            if (arr[low] === target) return { found: true, index: low, iterations };
            return { found: false, index: -1, iterations };
        }

        let pos = low + Math.floor(((high - low) / (arr[high] - arr[low])) * (target - arr[low]));

        if (arr[pos] === target) return { found: true, index: pos, iterations };
        if (arr[pos] < target) low = pos + 1;
        else high = pos - 1;
    }
    return { found: false, index: -1, iterations };
};

const exponentialSearch = (arr, target) => {
    let iterations = 0;
    if (arr[0] === target) {
        return { found: true, index: 0, iterations: 1 };
    }

    let i = 1;
    while (i < arr.length && arr[i] <= target) {
        iterations++;
        i *= 2;
    }

    const binarySearchResult = binarySearch(arr.slice(i / 2, Math.min(i, arr.length)), target);
    return {
        found: binarySearchResult.found,
        index: binarySearchResult.found ? i / 2 + binarySearchResult.index : -1,
        iterations: iterations + binarySearchResult.iterations
    };
};

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
    'Quick Sort': quickSort,
    'Insertion Sort': insertionSort,
    'Selection Sort': selectionSort,
    'Merge Sort': mergeSort,
    'Heap Sort': heapSort,
    'Counting Sort': countingSort,
    'Radix Sort': radixSort,
    'Bucket Sort': bucketSort,
    'Shell Sort': shellSort,
    'Comb Sort': combSort
};

const searchingAlgorithms = {
    'Linear Search': linearSearch,
    'Binary Search': binarySearch,
    'Jump Search': jumpSearch,
    'Interpolation Search': interpolationSearch,
    'Exponential Search': exponentialSearch
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

const displayDataSample = (data) => {
    const sampleSize = Math.min(20, data.length);
    console.log(chalk.yellow('\nSample of generated data:'));
    console.log(chalk.cyan(data.slice(0, sampleSize).join(', ') + (data.length > sampleSize ? ', ...' : '')));
    console.log(chalk.yellow(`\nData range: ${data[0]} to ${data[data.length - 1]}`));
    console.log(chalk.yellow(`Total elements: ${data.length}`));
};


const visualizeSortingAlgorithm = async (algorithmName, data) => {
    const spinner = createSpinner('Sorting...').start();
    const startTime = process.hrtime();
    const startMemory = process.memoryUsage().heapUsed;

    const algorithm = sortingAlgorithms[algorithmName];
    const result = algorithm([...data]);

    const endTime = process.hrtime(startTime);
    const endMemory = process.memoryUsage().heapUsed;
    spinner.success({ text: 'Sorting completed!' });

    return {
        name: algorithmName,
        time: `${endTime[0]}s ${(endTime[1] / 1000000).toFixed(3)}ms`,
        iterations: result.iterations,
        memory: `${((endMemory - startMemory) / 1024 / 1024).toFixed(2)} MB`
    };
};

const visualizeSearchingAlgorithm = async (algorithmName, data, target) => {
    const spinner = createSpinner('Searching...').start();
    const startTime = process.hrtime();
    const startMemory = process.memoryUsage().heapUsed;

    const algorithm = searchingAlgorithms[algorithmName];
    const result = algorithm([...data], target);

    const endTime = process.hrtime(startTime);
    const endMemory = process.memoryUsage().heapUsed;
    spinner.success({ text: 'Searching completed!' });

    return {
        name: algorithmName,
        time: `${endTime[0]}s ${(endTime[1] / 1000000).toFixed(3)}ms`,
        iterations: result.iterations,
        memory: `${((endMemory - startMemory) / 1024 / 1024).toFixed(2)} MB`,
        found: result.found,
        index: result.index
    };
};

const compareAllAlgorithms = async (type, data, target = null) => {
    console.log(chalk.yellow(`\nComparing all ${type.toLowerCase()} algorithms...`));
    const results = [];

    const algorithms = type === 'Sorting' ? sortingAlgorithms : searchingAlgorithms;
    for (const [name, algorithm] of Object.entries(algorithms)) {
        const result = type === 'Sorting' 
            ? await visualizeSortingAlgorithm(name, data)
            : await visualizeSearchingAlgorithm(name, data, target);
        results.push(result);
    }

    const table = new Table({
        head: type === 'Sorting'
            ? ['Algorithm', 'Time', 'Iterations', 'Memory Usage']
            : ['Algorithm', 'Time', 'Iterations', 'Memory Usage', 'Found', 'Index'],
        colWidths: type === 'Sorting'
            ? [20, 20, 15, 20]
            : [20, 20, 15, 20, 10, 10]
    });

    results.forEach(result => {
        const row = [result.name, result.time, result.iterations, result.memory];
        if (type === 'Searching') {
            row.push(result.found ? 'Yes' : 'No', result.index);
        }
        table.push(row);
    });

    console.log(table.toString());
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