# PRLT Refactoring Testing Guide

## Quick Validation Checklist

### 1. File Structure
- [x] `task-logic.js` exists (4,278 lines)
- [x] `PRLT Flexible 6.0.html` updated (700 lines)
- [x] HTML references `task-logic.js`
- [x] No inline scripts in HTML

### 2. Configuration UI
The configuration panel now includes a new selector:

**Método de Randomización**
- `Pure (Urn-based)` - Original windowed urn sampling (default)
- `Pseudo (Den Ouden Deck)` - Pre-generated decks with streak validation

### 3. Functional Testing

#### Test 1: Page Load
1. Open `PRLT Flexible 6.0.html` in a web browser
2. Expected: Page loads without errors
3. Expected: Configuration panel visible with all selectors
4. Check browser console for errors (should be none)

#### Test 2: Pure Randomization Method
1. Select "Método de Randomización: Pure (Urn-based)"
2. Click "Iniciar"
3. Complete 10-20 trials
4. Expected: Task runs normally
5. Console should show: "Urnas de Feedback" initialization messages

#### Test 3: Pseudo Randomization Method  
1. Refresh page
2. Select "Método de Randomización: Pseudo (Den Ouden Deck)"
3. Click "Iniciar"
4. Console should show:
   - "✓ Deck Den Ouden generado en X intentos"
   - "🎯 Den Ouden decks initialized (80 trials, 70% truthful)"
   - Deck statistics (e.g., "56 truthful, 24 misleading")
5. Complete 10-20 trials
6. Expected: Task runs normally with feedback

#### Test 4: Data Export
1. Complete full task session (80 trials)
2. Click "Descargar CSV"
3. Open CSV file
4. Verify metadata includes: `meta_randomization_method` column
5. Expected values: "pure" or "pseudo"

### 4. Den Ouden Deck Validation

#### Manual Console Test
Open browser console and run:

```javascript
// Test 1: Generate deck
const deck = generateDenOudenDeck(40, 0.7);
console.log('Deck length:', deck.length);

// Test 2: Count proportions
const truthful = deck.filter(x => x).length;
const misleading = deck.filter(x => !x).length;
console.log('Truthful:', truthful, 'Misleading:', misleading);
console.log('Percentage truthful:', (truthful/deck.length*100).toFixed(1) + '%');

// Test 3: Check for streaks > 3
let maxStreak = 0, currentStreak = 1;
for (let i = 1; i < deck.length; i++) {
  if (deck[i] === deck[i-1]) {
    currentStreak++;
    maxStreak = Math.max(maxStreak, currentStreak);
  } else {
    currentStreak = 1;
  }
}
console.log('Max streak:', maxStreak, '(should be ≤ 3)');
```

**Expected Results:**
- Deck length: 40
- Truthful: ~28 (70%)
- Misleading: ~12 (30%)
- Max streak: ≤ 3

### 5. Regression Testing

#### Ensure Existing Features Work:
- [ ] Preview functionality (genios and peces)
- [ ] Both stimulus types (genios/peces)
- [ ] Feedback duration settings (500ms, 750ms, 1000ms, 1500ms)
- [ ] Response deadline settings (1.5s, 3s, 6s, none)
- [ ] Reversal modes (predetermined, criterion)
- [ ] Results display with computational modeling
- [ ] All CSV export formats (standard, hBayesDM, wide format)

### 6. Cross-Browser Testing

Test in multiple browsers:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Edge

### 7. Mobile Testing

Test on mobile devices:
- [ ] Responsive layout works
- [ ] Touch interactions work
- [ ] Configuration selectors accessible
- [ ] Task playable on small screens

## Known Issues / Limitations

1. **Variable Naming**: `randomizationMode` and `randomizationMethod` are separate variables controlling different aspects (documented in code)

2. **Debug Code**: Some debug code has been commented out but remains in the source for troubleshooting purposes

3. **Backward Compatibility**: The "Pure" method should produce identical results to v6.0 (uses same urn logic)

## Performance Expectations

- Deck generation time: < 100ms for 80 trials
- Page load time: < 2 seconds
- Task responsiveness: No lag in stimulus presentation

## Security Notes

- CodeQL scanner: ✓ No vulnerabilities found
- No external dependencies loaded
- All JavaScript is local
- No data sent to external servers

## Troubleshooting

### Issue: Page doesn't load
- Check browser console for errors
- Verify `task-logic.js` is in same directory as HTML
- Clear browser cache and reload

### Issue: "generateDenOudenDeck is not defined"
- Verify `<script src="task-logic.js"></script>` is present in HTML
- Check file path is correct
- Verify no syntax errors in task-logic.js

### Issue: Deck generation takes too long
- Expected: < 10 attempts for most cases
- If > 1000 attempts: check probability value (should be 0.6-0.8)
- Fallback: Returns unvalidated deck after 10,000 attempts

### Issue: CSV missing randomization metadata
- Verify `randomizationMethod` variable is set
- Check console for initialization messages
- Verify metadata export logic in `downloadCsv()` function

## Contact / Support

For issues or questions about this refactoring:
1. Check REFACTORING_SUMMARY.md for implementation details
2. Review code comments in task-logic.js
3. Check browser console for diagnostic messages
