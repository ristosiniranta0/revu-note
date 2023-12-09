/* complex_code.js */
/*
 * This code implements a complex algorithm to solve the traveling salesman problem using a genetic algorithm approach.
 * The code takes a list of cities and finds the shortest possible path that visits each city exactly once and returns to starting city.
 *
 * The algorithm starts by generating an initial population of potential solutions represented as permutations of the cities.
 * It then applies a combination of selection, crossover, and mutation operations to evolve the population towards better solutions.
 * The evolution process continues until a termination condition is met, such as a maximum number of generations or a satisfactory fitness threshold.
 *
 * The fitness of each solution is calculated by summing the distances between consecutive cities in the particular permutation.
 * A roulette wheel selection is used to determine the parents for crossover and mutation operations.
 * The crossover operation combines the genetic material of two parents to create offspring, while mutation introduces small changes to the offspring.
 *
 * This code makes use of several helper functions such as generating random numbers, calculating distances between cities,
 * performing permutation operations, and selecting parents based on fitness. Additionally, it includes some utility functions
 * to initialize the population, generate random permutations, and evaluate the fitness of each solution.
 */

// Helper function: Generate a random number between min and max (inclusive)
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function: Calculate the Euclidean distance between two cities
function calculateDistance(city1, city2) {
    const xDistance = Math.abs(city1.x - city2.x);
    const yDistance = Math.abs(city1.y - city2.y);
    return Math.sqrt((xDistance * xDistance) + (yDistance * yDistance));
}

// Helper function: Swap two elements in an array
function swapArrayElements(array, index1, index2) {
    const temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
}

// Helper function: Generate a random permutation of cities
function generateRandomPermutation(cities) {
    const permutation = cities.slice();
    for (let i = permutation.length - 1; i > 0; i--) {
        const j = getRandomNumber(0, i);
        swapArrayElements(permutation, i, j);
    }
    return permutation;
}

// Main function: Initialize the population with random permutations
function initializePopulation(cities, populationSize) {
    const population = [];
    for (let i = 0; i < populationSize; i++) {
        const permutation = generateRandomPermutation(cities);
        population.push(permutation);
    }
    return population;
}

// Helper function: Calculate the fitness of a solution (permutation)
function calculateFitness(solution) {
    let distance = 0;
    for (let i = 0; i < solution.length - 1; i++) {
        distance += calculateDistance(solution[i], solution[i + 1]);
    }
    return distance;
}

// Helper function: Calculate the total fitness of a population
function calculateTotalFitness(population) {
    let totalFitness = 0;
    for (const solution of population) {
        totalFitness += calculateFitness(solution);
    }
    return totalFitness;
}

// Helper function: Select parents for crossover and mutation using roulette wheel selection
function selectParents(population, totalFitness) {
    const rouletteWheel = [];
    for (const solution of population) {
        const fitness = calculateFitness(solution);
        const normalizedFitness = fitness / totalFitness;
        rouletteWheel.push({
            solution,
            fitness,
            normalizedFitness
        });
    }
    const randomValue = Math.random();
    let accumulatedFitness = 0;
    for (const wheelSlice of rouletteWheel) {
        accumulatedFitness += wheelSlice.normalizedFitness;
        if (randomValue <= accumulatedFitness) {
            return wheelSlice.solution;
        }
    }
}

// Helper function: Perform ordered crossover between two parent solutions
function performCrossover(parent1, parent2) {
    const offspring = Array(parent1.length).fill(null);
    const start = getRandomNumber(0, parent1.length - 1);
    const end = getRandomNumber(start + 1, parent1.length);
    for (let i = start; i < end; i++) {
        offspring[i] = parent1[i];
    }
    let parent2Index = 0;
    for (let i = 0; i < parent2.length; i++) {
        const gene = parent2[i];
        if (!offspring.includes(gene)) {
            for (let j = 0; j < offspring.length; j++) {
                if (offspring[j] === null) {
                    offspring[j] = gene;
                    parent2Index++;
                    break;
                }
            }
        }
    }
    return offspring;
}

// Helper function: Perform mutation by swapping two random cities in the solution
function performMutation(solution) {
    const mutatedSolution = solution.slice();
    const index1 = getRandomNumber(0, solution.length - 1);
    let index2 = getRandomNumber(0, solution.length - 1);
    while (index2 === index1) {
        index2 = getRandomNumber(0, solution.length - 1);
    }
    swapArrayElements(mutatedSolution, index1, index2);
    return mutatedSolution;
}

// Main function: Evolve the population through selection, crossover, and mutation
function evolvePopulation(population, populationSize, eliteSize, mutationRate) {
    const totalFitness = calculateTotalFitness(population);
    const eliteCount = Math.round(populationSize * eliteSize);

    const newPopulation = [];
    for (let i = 0; i < eliteCount; i++) {
        const bestSolution = selectParents(population, totalFitness);
        newPopulation.push(bestSolution);
    }

    for (let i = eliteCount; i < populationSize; i++) {
        const parent1 = selectParents(population, totalFitness);
        const parent2 = selectParents(population, totalFitness);
        const offspring = performCrossover(parent1, parent2);
        if (Math.random() < mutationRate) {
            const mutatedOffspring = performMutation(offspring);
            newPopulation.push(mutatedOffspring);
        } else {
            newPopulation.push(offspring);
        }
    }

    return newPopulation;
}

// Main function: Solve the Traveling Salesman Problem using a genetic algorithm
function solveTSP(cities, populationSize, eliteSize, mutationRate, generations) {
    let population = initializePopulation(cities, populationSize);
    let bestFitness = Infinity;
    let bestSolution;

    for (let i = 0; i < generations; i++) {
        population = evolvePopulation(population, populationSize, eliteSize, mutationRate);
        const currentBestSolution = selectParents(population, calculateTotalFitness(population));
        const currentBestFitness = calculateFitness(currentBestSolution);
        if (currentBestFitness < bestFitness) {
            bestFitness = currentBestFitness;
            bestSolution = currentBestSolution;
        }
    }

    return {
        bestFitness,
        bestSolution
    };
}

// Example usage:
const cities = [
    { name: "City 1", x: 2, y: 3 },
    { name: "City 2", x: 5, y: 7 },
    { name: "City 3", x: 9, y: 1 },
    { name: "City 4", x: 4, y: 6 },
    { name: "City 5", x: 8, y: 2 }
];

const populationSize = 100;
const eliteSize = 0.2;
const mutationRate = 0.1;
const generations = 50;

const { bestFitness, bestSolution } = solveTSP(cities, populationSize, eliteSize, mutationRate, generations);

console.log("Best Fitness:", bestFitness);
console.log("Best Solution:", bestSolution);