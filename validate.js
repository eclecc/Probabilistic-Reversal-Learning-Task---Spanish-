// Validation script for PRLT refactoring
const fs = require('fs');

console.log('=== PRLT Refactoring Validation ===\n');

// 1. Check if task-logic.js exists
if (!fs.existsSync('task-logic.js')) {
  console.error('❌ task-logic.js not found!');
  process.exit(1);
}
console.log('✓ task-logic.js exists');

// 2. Check if HTML file was updated
const html = fs.readFileSync('PRLT Flexible 6.0.html', 'utf8');
if (!html.includes('task-logic.js')) {
  console.error('❌ HTML does not reference task-logic.js');
  process.exit(1);
}
console.log('✓ HTML references task-logic.js');

// 3. Check if randomizationMethodSelect was added
if (!html.includes('randomizationMethodSelect')) {
  console.error('❌ randomizationMethodSelect not found in HTML');
  process.exit(1);
}
console.log('✓ randomizationMethodSelect added to HTML');

// 4. Check if HTML has inline scripts (should not)
const scriptMatches = html.match(/<script>[\s\S]*?<\/script>/g);
if (scriptMatches && scriptMatches.length > 0) {
  // Filter out the external script tag
  const inlineScripts = scriptMatches.filter(s => !s.includes('src='));
  if (inlineScripts.length > 0) {
    console.error('❌ HTML still contains inline scripts');
    console.error('Found:', inlineScripts.length, 'inline script blocks');
    process.exit(1);
  }
}
console.log('✓ No inline scripts in HTML');

// 5. Check task-logic.js for key functions
const js = fs.readFileSync('task-logic.js', 'utf8');
const requiredFunctions = [
  'createPracticeMachine',
  'createLakeStimulus',
  'createGeniusStimulus',
  'generateDenOudenDeck',
  'getFeedback',
  'drawFromUrn',
  'startMainTask',
  'processChoice',
  'showResults',
  'downloadCsv'
];

let missingFunctions = [];
requiredFunctions.forEach(fn => {
  if (!js.includes('function ' + fn)) {
    missingFunctions.push(fn);
  }
});

if (missingFunctions.length > 0) {
  console.error('❌ Missing functions:', missingFunctions.join(', '));
  process.exit(1);
}
console.log('✓ All required functions present');

// 6. Check for Den Ouden implementation
if (!js.includes('generateDenOudenDeck')) {
  console.error('❌ generateDenOudenDeck not found');
  process.exit(1);
}
console.log('✓ Den Ouden deck generation implemented');

// 7. Check for randomizationMethod variable
if (!js.includes('randomizationMethod')) {
  console.error('❌ randomizationMethod variable not found');
  process.exit(1);
}
console.log('✓ randomizationMethod variable present');

// 8. Check for metadata export
if (!js.includes('meta_randomization_method')) {
  console.error('❌ meta_randomization_method not in CSV export');
  process.exit(1);
}
console.log('✓ Randomization method included in CSV metadata');

// 9. Check for Fisher-Yates shuffle
if (!js.includes('[deck[i], deck[j]] = [deck[j], deck[i]]')) {
  console.error('❌ Fisher-Yates shuffle not found');
  process.exit(1);
}
console.log('✓ Fisher-Yates shuffle implemented');

// 10. Check for streak validation
if (!js.includes('deck[i+1]') && !js.includes('deck[i+2]') && !js.includes('deck[i+3]')) {
  console.error('❌ Streak validation not found');
  process.exit(1);
}
console.log('✓ Streak validation implemented');

console.log('\n=== All validations passed! ===');
