# PRLT JavaScript Refactoring Summary

## Changes Made

### 1. JavaScript Extraction (`task-logic.js`)
All JavaScript code from `PRLT Flexible 6.0.html` has been extracted into a new file `task-logic.js` (4,278 lines), including:

- **SVG Generation Functions**:
  - `createPracticeMachine()` - Unicode emoji-based practice stimuli
  - `createLakeStimulus()` - Fishing lake SVG with fish
  - `createGeniusStimulus()` - Genius SVG stimuli (types A and B)
  
- **SVG Constants**:
  - `GENIUS_SVG_INNER_A` - SVG template for Genius A
  - `GENIUS_SVG_INNER_B` - SVG template for Genius B
  - `COIN_SVG` - Coin feedback SVG
  
- **Preview System Logic**:
  - Preview initialization and control functions
  
- **Game Logic**:
  - `startMainTask()` - Main task initialization
  - `processChoice()` - Choice processing and reversal logic
  - `showFeedback()` - Feedback display
  - `showStimuli()` - Stimulus presentation
  - `showFixationCross()` - Inter-trial interval
  - `logTrial()` - Trial data logging
  
- **Analysis and Export Logic**:
  - `showResults()` - Results display
  - `downloadCsv()` - CSV data export
  - `fitAllModels()` - Computational modeling (Rescorla-Wagner, Q-learning, etc.)

### 2. Den Ouden Randomization Implementation

#### New Function: `generateDenOudenDeck(numTrials, probability)`
Creates pseudo-random feedback sequences according to Den Ouden et al. methodology:

1. **Exact Proportions**: Creates deck with precise number of truthful/misleading outcomes based on probability
2. **Fisher-Yates Shuffle**: Randomizes the deck order
3. **Streak Validation**: Ensures no more than 3 consecutive identical outcomes
4. **Retry Logic**: Attempts up to 10,000 shuffles to find valid sequence

```javascript
function generateDenOudenDeck(numTrials, probability) {
  // Creates deck, shuffles, validates streaks
  // Returns array of booleans (true = truthful, false = misleading)
}
```

#### New Function: `getFeedback(trueCorrect)`
Unified feedback retrieval supporting multiple randomization methods:

```javascript
function getFeedback(trueCorrect) {
  if (randomizationMethod === 'pseudo') {
    // Use pre-generated Den Ouden decks
  } else {
    // Use traditional urn-based system
  }
}
```

#### Global Variables Added:
- `randomizationMethod` - Selected method ('pure' or 'pseudo')
- `denOudenDeckCorrect` - Pre-generated deck for correct responses
- `denOudenDeckIncorrect` - Pre-generated deck for incorrect responses

#### Integration in `processChoice()`:
```javascript
if (randomizationMethod === 'pseudo') {
  feedbackCorrect = getFeedback(trueCorrect);
} else if (randomizationMode === 'deck') {
  // Use existing DeckManager
} else {
  // Use classic urn system
}
```

### 3. HTML Updates (`PRLT Flexible 6.0.html`)

#### New Configuration Selector:
```html
<label>
  Método de Randomización
  <select id="randomizationMethodSelect">
    <option value="pure" selected>Puro (Urn-based)</option>
    <option value="pseudo">Pseudo (Den Ouden Deck)</option>
  </select>
</label>
```

#### Removed:
- All inline `<script>` blocks (3,915+ lines of JavaScript)
- Embedded SVG generation code
- Embedded computational modeling code

#### Added:
- Single external script reference: `<script src="task-logic.js"></script>`

### 4. CSV Export Metadata

Added `meta_randomization_method` to CSV export metadata:

```javascript
meta_randomization_method: randomizationMethod || 'pure'
```

This ensures experimental data includes information about which randomization method was used.

## Randomization Methods Comparison

| Feature | Pure (Urn-based) | Pseudo (Den Ouden) |
|---------|------------------|-------------------|
| **Method** | Windowed sampling with refill | Pre-generated deck |
| **Proportions** | ~70% truthful (windowed) | Exactly 70% truthful (global) |
| **Streak Control** | No explicit control | Max 3 consecutive identical |
| **Memory** | Refills every 10 trials | Full deck pre-generated |
| **Predictability** | Low | Very low (validated shuffle) |

## File Statistics

- **PRLT Flexible 6.0.html**: Reduced from 4,860 to 700 lines (85.6% reduction)
- **task-logic.js**: 4,278 lines of modular JavaScript
- **Total lines**: Slightly increased due to new functionality

## Testing Recommendations

1. **Functional Testing**:
   - Load `PRLT Flexible 6.0.html` in browser
   - Verify preview functionality works
   - Test both randomization methods:
     - Pure: Should behave identically to v6.0
     - Pseudo: Should generate exact proportions with no streaks > 3

2. **Data Validation**:
   - Complete a full task session
   - Download CSV
   - Verify `meta_randomization_method` is present
   - Check feedback proportions match expected probability

3. **Console Logging**:
   - Check for Den Ouden deck generation messages
   - Verify deck statistics (truthful/misleading counts)

## Browser Compatibility

The refactored code maintains all existing browser compatibility:
- Modern ES6+ features (arrow functions, template literals)
- Mobile-responsive design preserved
- Touch event handling maintained
