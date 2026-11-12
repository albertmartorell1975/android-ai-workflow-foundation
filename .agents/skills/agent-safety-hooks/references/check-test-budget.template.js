#!/usr/bin/env node

const { execSync } = require('child_process');

try {
    // 1. Get list of added/modified test files in the staged commit
    const diffFiles = execSync('git diff --cached --name-only').toString().trim().split('\n');
    const testFiles = diffFiles.filter(file => file.endsWith('Test.kt'));

    if (testFiles.length === 0) {
        process.exit(0); // No test files modified, allow commit
    }

    let totalNewTests = 0;

    // 2. Count new @Test annotations in those files
    for (const file of testFiles) {
        try {
            // Get only the added lines for this file
            const addedLines = execSync(`git diff --cached -U0 "${file}" | grep "^+" | grep -v "^+++" || true`).toString();

            // Count occurrences of @Test
            const testMatches = addedLines.match(/@Test/g);
            if (testMatches) {
                totalNewTests += testMatches.length;
            }
        } catch (err) {
            // Ignore grep errors (e.g. no match found)
        }
    }

    // 3. Apply the Strict Test Budget (Max 6)
    if (totalNewTests > 6) {
        console.error(`\n\x1b[31m\x1b[1m❌ COMMIT BLOCKED: Strict Test Budget Exceeded (${totalNewTests} > 6 max tests allowed).\x1b[0m\n`);
        console.error(`You are violating the 'Zero Trivial Tests Mandate' of this project.`);
        console.error(`To pass this gate, you MUST review your *Test.kt files and DELETE the least important tests based on these exact rules:\n`);
        console.error(`  1. DELETE tests for 1:1 pass-through UseCases (no conditional logic).`);
        console.error(`  2. DELETE tests for Data Class properties, getters, or default values.`);
        console.error(`  3. DELETE tests for static preview data or hardcoded mapping lists.`);
        console.error(`  4. CONSOLIDATE multiple @Test methods into a single one if they test branches of the same function.\n`);
        console.error(`\x1b[33mDo not ask the user. Delete the trivial tests and try committing again.\x1b[0m\n`);
        process.exit(1); // Block the commit
    }

    process.exit(0);
} catch (error) {
    // Fail open if git commands fail, to not block legitimate development unnecesarily
    process.exit(0);
}
