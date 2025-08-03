#!/usr/bin/env node

/**
 * Test Runner Script for Jazz MIDI
 * Orchestrates unit, integration, and e2e tests
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
	reset: '\x1b[0m',
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	magenta: '\x1b[35m',
	cyan: '\x1b[36m'
};

function log(color, message) {
	console.log(`${color}${message}${colors.reset}`);
}

function runCommand(command, description) {
	log(colors.blue, `\n🏃 Running: ${description}`);
	log(colors.cyan, `Command: ${command}`);

	try {
		execSync(command, { stdio: 'inherit' });
		log(colors.green, `✅ ${description} completed successfully`);
		return true;
	} catch (error) {
		log(colors.red, `❌ ${description} failed`);
		return false;
	}
}

function checkFileExists(filePath) {
	return fs.existsSync(path.join(__dirname, filePath));
}

function main() {
	const args = process.argv.slice(2);
	const command = args[0] || 'all';

	log(colors.magenta, '🎹 Jazz MIDI Test Suite Runner');
	log(colors.yellow, `Command: ${command}`);

	let results = {
		unit: null,
		integration: null,
		e2e: null,
		lint: null,
		typecheck: null
	};

	switch (command) {
		case 'unit':
			results.unit = runUnitTests();
			break;

		case 'integration':
			results.integration = runIntegrationTests();
			break;

		case 'e2e':
			results.e2e = runE2ETests();
			break;

		case 'lint':
			results.lint = runLinting();
			break;

		case 'typecheck':
			results.typecheck = runTypeCheck();
			break;

		case 'ci':
			results.lint = runLinting();
			results.typecheck = runTypeCheck();
			results.unit = runUnitTests();
			results.integration = runIntegrationTests();
			// Skip E2E in CI unless explicitly requested
			break;

		case 'all':
		default:
			results.lint = runLinting();
			results.typecheck = runTypeCheck();
			results.unit = runUnitTests();
			results.integration = runIntegrationTests();

			if (checkE2EAvailable()) {
				results.e2e = runE2ETests();
			} else {
				log(colors.yellow, '⚠️  E2E tests skipped (Playwright not installed)');
				log(
					colors.cyan,
					'To install: npm install --save-dev @playwright/test && npx playwright install'
				);
			}
			break;
	}

	printSummary(results);
}

function runLinting() {
	log(colors.blue, '\n📝 Running ESLint...');
	return runCommand('npm run lint', 'ESLint');
}

function runTypeCheck() {
	log(colors.blue, '\n🔍 Running TypeScript Check...');
	return runCommand('npm run check', 'TypeScript Check');
}

function runUnitTests() {
	log(colors.blue, '\n🧪 Running Unit Tests...');
	return runCommand('npm test -- --run src/**/*.test.ts', 'Unit Tests');
}

function runIntegrationTests() {
	log(colors.blue, '\n🔗 Running Integration Tests...');
	return runCommand('npm test -- --run src/test/', 'Integration Tests');
}

function runE2ETests() {
	log(colors.blue, '\n🌐 Running E2E Tests...');

	if (checkFileExists('node_modules/@playwright/test')) {
		// Build the app first
		if (runCommand('npm run build', 'Build for E2E')) {
			return runCommand('npx playwright test', 'E2E Tests');
		}
		return false;
	} else {
		log(colors.yellow, '⚠️  Playwright not installed, skipping E2E tests');
		return null;
	}
}

function checkE2EAvailable() {
	return checkFileExists('node_modules/@playwright/test');
}

function printSummary(results) {
	log(colors.magenta, '\n📊 Test Results Summary');
	log(colors.cyan, '========================');

	Object.entries(results).forEach(([test, result]) => {
		if (result === null) {
			log(colors.yellow, `${test.toUpperCase()}: SKIPPED`);
		} else if (result) {
			log(colors.green, `${test.toUpperCase()}: PASSED ✅`);
		} else {
			log(colors.red, `${test.toUpperCase()}: FAILED ❌`);
		}
	});

	const passed = Object.values(results).filter((r) => r === true).length;
	const failed = Object.values(results).filter((r) => r === false).length;
	const skipped = Object.values(results).filter((r) => r === null).length;

	log(colors.cyan, '\n📈 Statistics:');
	log(colors.green, `Passed: ${passed}`);
	log(colors.red, `Failed: ${failed}`);
	log(colors.yellow, `Skipped: ${skipped}`);

	if (failed > 0) {
		log(colors.red, '\n❌ Some tests failed!');
		process.exit(1);
	} else {
		log(colors.green, '\n🎉 All tests passed!');
		process.exit(0);
	}
}

if (require.main === module) {
	main();
}

module.exports = {
	runUnitTests,
	runIntegrationTests,
	runE2ETests,
	runLinting,
	runTypeCheck
};
