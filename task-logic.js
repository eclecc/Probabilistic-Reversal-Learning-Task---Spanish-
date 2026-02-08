// === PSEUDOALEATORIZACIÓN (DEN OUDEN METHOD) ===
/**
 * Genera una baraja de resultados pre-validada usando el método den Ouden
 * Asegura que no haya rachas de más de 3 resultados idénticos consecutivos
 * @param {number} numTrials - Número total de ensayos en la baraja
 * @param {number} probability - Probabilidad del resultado positivo (0-1)
 * @returns {boolean[]} - Array de resultados (true = positivo/recompensa, false = negativo/castigo)
 */
function generateDenOudenDeck(numTrials, probability) {
  const maxConsecutive = 3;
  const targetPositives = Math.round(numTrials * probability);
  const targetNegatives = numTrials - targetPositives;
  
  let deck = [];
  let isValid = false;
  let attempts = 0;
  const maxAttempts = 10000; // Evitar bucles infinitos
  
  while (!isValid && attempts < maxAttempts) {
    attempts++;
    deck = [];
    
    // Crear baraja con el número correcto de cada resultado
    for (let i = 0; i < targetPositives; i++) deck.push(true);
    for (let i = 0; i < targetNegatives; i++) deck.push(false);
    
    // Barajar usando Fisher-Yates
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    
    // Validar que no haya rachas de más de 3
    isValid = true;
    let consecutiveCount = 1;
    for (let i = 1; i < deck.length; i++) {
      if (deck[i] === deck[i - 1]) {
        consecutiveCount++;
        if (consecutiveCount > maxConsecutive) {
          isValid = false;
          break;
        }
      } else {
        consecutiveCount = 1;
      }
    }
  }
  
  if (attempts >= maxAttempts) {
    console.error('⚠️ No se pudo generar una baraja válida den Ouden después de', maxAttempts, 'intentos.');
    // Para probabilidades extremas, el método den Ouden puede ser imposible.
    // En este caso, retornamos la última baraja generada como fallback.
    // Nota: Esto solo debería ocurrir con probabilidades muy altas (>75%) o muy bajas (<25%)
    console.warn('⚠️ Usando última baraja generada como fallback. Considere usar el método de Urna Balanceada para esta configuración.');
  } else {
    console.log('✓ Baraja den Ouden generada en', attempts, 'intentos');
  }
  
  return deck;
}

// Variables globales para el método den Ouden
let denOudenDeckLearningCorrect = [];
let denOudenDeckLearningIncorrect = [];
let denOudenDeckReversalCorrect = [];
let denOudenDeckReversalIncorrect = [];
let denOudenIndexLearningCorrect = 0;
let denOudenIndexLearningIncorrect = 0;
let denOudenIndexReversalCorrect = 0;
let denOudenIndexReversalIncorrect = 0;

/**
 * Inicializa las barajas den Ouden para todas las fases
 */
function initializeDenOudenDecks(learningTrials, reversalTrials, probability) {
  console.log('🎴 Inicializando barajas den Ouden con probabilidad:', probability);
  
  // Generar barajas para fase de aprendizaje
  denOudenDeckLearningCorrect = generateDenOudenDeck(learningTrials, probability);
  denOudenDeckLearningIncorrect = generateDenOudenDeck(learningTrials, probability);
  
  // Generar barajas para fase de reversión
  denOudenDeckReversalCorrect = generateDenOudenDeck(reversalTrials, probability);
  denOudenDeckReversalIncorrect = generateDenOudenDeck(reversalTrials, probability);
  
  // Reset índices
  denOudenIndexLearningCorrect = 0;
  denOudenIndexLearningIncorrect = 0;
  denOudenIndexReversalCorrect = 0;
  denOudenIndexReversalIncorrect = 0;
  
  console.log('✓ Barajas den Ouden inicializadas correctamente');
}

/**
 * Obtiene el siguiente resultado de la baraja den Ouden apropiada
 * @param {boolean} trueCorrect - Si la elección del participante fue correcta
 * @returns {boolean} Si el feedback mostrado será positivo (true) o negativo (false)
 */
function drawFromDenOudenDeck(trueCorrect) {
  let deck, index;
  
  // Seleccionar la baraja y el índice correctos según fase y corrección
  if (isReversalPhase) {
    if (trueCorrect) {
      deck = denOudenDeckReversalCorrect;
      index = denOudenIndexReversalCorrect;
      denOudenIndexReversalCorrect = (denOudenIndexReversalCorrect + 1) % deck.length;
    } else {
      deck = denOudenDeckReversalIncorrect;
      index = denOudenIndexReversalIncorrect;
      denOudenIndexReversalIncorrect = (denOudenIndexReversalIncorrect + 1) % deck.length;
    }
  } else {
    if (trueCorrect) {
      deck = denOudenDeckLearningCorrect;
      index = denOudenIndexLearningCorrect;
      denOudenIndexLearningCorrect = (denOudenIndexLearningCorrect + 1) % deck.length;
    } else {
      deck = denOudenDeckLearningIncorrect;
      index = denOudenIndexLearningIncorrect;
      denOudenIndexLearningIncorrect = (denOudenIndexLearningIncorrect + 1) % deck.length;
    }
  }
  
  // Obtener el valor: giveTruthful indica si damos feedback coherente
  if (!deck || deck.length === 0) {
    console.error('Error: Baraja den Ouden vacía o no inicializada');
    // Fallback: retornar feedback veraz
    return trueCorrect;
  }
  
  const giveTruthful = deck[index];
  
  // giveTruthful=true y trueCorrect=true → feedback positivo
  // giveTruthful=true y trueCorrect=false → feedback negativo
  // giveTruthful=false → invertir el feedback (engañoso)
  return giveTruthful ? trueCorrect : !trueCorrect;
}



        // === FUNCIÓN PARA GENERAR MÁQUINAS/GENIOS DE PRÁCTICA (UNICODE DEL SISTEMA) ===
    function createPracticeMachine(type, size = 150) {
      // Genios unicode básicos (render del sistema)
      const isB = (type === 'B');
      const emoji = isB ? '🧞‍♀️' : '🧞‍♂️';
      const color = isB ? '#fb3f7f' : '#10b981';

      // Reutilizamos el mismo estilo que antes (halo + centrado), pero cambiamos el dibujo
      return `
        <div style="font-size:${size}px;
                    filter: drop-shadow(0 0 ${size * 0.05}px ${color});
                    display:flex;
                    align-items:center;
                    justify-content:center;">
          ${emoji}
        </div>
      `;
    }


        // === FUNCIÓN PARA GENERAR LAGO (VERSIÓN PECES) ===
    function createLakeStimulus(size = 512, showFish = false, fishSide = null) {
      // fishSide: 'left' (70% peces a la izquierda), 'right' (70% peces a la derecha), null (sin peces)
      const uniqueId = `lake-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
      
      let fishGroup = '';
      if (showFish && fishSide === 'left') {
        fishGroup = `
          <g id="fishSchool" clip-path="url(#${uniqueId}-clipLake)" opacity="0.92">
            <text class="emoji" x="132" y="204" font-size="11" transform="rotate(-12 132 204)">🐠</text>
            <text class="emoji" x="148" y="218" font-size="8"  transform="rotate(6 148 218)">🐠</text>
            <text class="emoji" x="165" y="202" font-size="11" transform="rotate(8 165 202)">🐠</text>
            <text class="emoji" x="182" y="216" font-size="8"  transform="rotate(-7 182 216)">🐠</text>
            <text class="emoji" x="200" y="206" font-size="11" transform="rotate(10 200 206)">🐠</text>
            <text class="emoji" x="220" y="220" font-size="8"  transform="rotate(-5 220 220)">🐠</text>

            <text class="emoji" x="140" y="236" font-size="8"  transform="rotate(5 140 236)">🐠</text>
            <text class="emoji" x="158" y="242" font-size="11" transform="rotate(-9 158 242)">🐠</text>
            <text class="emoji" x="176" y="246" font-size="8"  transform="rotate(7 176 246)">🐠</text>
            <text class="emoji" x="195" y="244" font-size="11" transform="rotate(-4 195 244)">🐠</text>
            <text class="emoji" x="214" y="242" font-size="8"  transform="rotate(9 214 242)">🐠</text>

            <text class="emoji" x="150" y="264" font-size="11" transform="rotate(12 150 264)">🐠</text>
            <text class="emoji" x="170" y="268" font-size="8"  transform="rotate(-6 170 268)">🐠</text>
            <text class="emoji" x="188" y="270" font-size="11" transform="rotate(5 188 270)">🐠</text>
            <text class="emoji" x="208" y="270" font-size="8"  transform="rotate(-10 208 270)">🐠</text>
            <text class="emoji" x="228" y="266" font-size="11" transform="rotate(7 228 266)">🐠</text>

            <text class="emoji" x="160" y="292" font-size="8"  transform="rotate(-8 160 292)">🐠</text>
            <text class="emoji" x="180" y="298" font-size="11" transform="rotate(6 180 298)">🐠</text>
            <text class="emoji" x="200" y="298" font-size="8"  transform="rotate(-4 200 298)">🐠</text>
            <text class="emoji" x="172" y="320" font-size="11" transform="rotate(9 172 320)">🐠</text>
            <text class="emoji" x="214" y="312" font-size="8"  transform="rotate(-7 214 312)">🐠</text>

            <text class="emoji" x="318" y="196" font-size="8"  transform="rotate(12 318 196)">🐠</text>
            <text class="emoji" x="356" y="188" font-size="11" transform="rotate(-8 356 188)">🐠</text>
            <text class="emoji" x="410" y="210" font-size="8"  transform="rotate(10 410 210)">🐠</text>
            <text class="emoji" x="340" y="234" font-size="8"  transform="rotate(-6 340 234)">🐠</text>
            <text class="emoji" x="392" y="252" font-size="11" transform="rotate(8 392 252)">🐠</text>
            <text class="emoji" x="430" y="274" font-size="8"  transform="rotate(-12 430 274)">🐠</text>
            <text class="emoji" x="330" y="292" font-size="11" transform="rotate(6 330 292)">🐠</text>
            <text class="emoji" x="372" y="308" font-size="8"  transform="rotate(-7 372 308)">🐠</text>
            <text class="emoji" x="412" y="326" font-size="11" transform="rotate(9 412 326)">🐠</text>
          </g>`;
      } else if (showFish && fishSide === 'right') {
        fishGroup = `
          <g id="fishSchool" clip-path="url(#${uniqueId}-clipLake)" opacity="0.92">
            <text class="emoji" x="322" y="204" font-size="11" transform="rotate(12 322 204)">🐠</text>
            <text class="emoji" x="340" y="218" font-size="8"  transform="rotate(-6 340 218)">🐠</text>
            <text class="emoji" x="358" y="202" font-size="11" transform="rotate(-8 358 202)">🐠</text>
            <text class="emoji" x="376" y="216" font-size="8"  transform="rotate(7 376 216)">🐠</text>
            <text class="emoji" x="394" y="206" font-size="11" transform="rotate(-10 394 206)">🐠</text>
            <text class="emoji" x="414" y="220" font-size="8"  transform="rotate(5 414 220)">🐠</text>

            <text class="emoji" x="332" y="236" font-size="8"  transform="rotate(-5 332 236)">🐠</text>
            <text class="emoji" x="350" y="242" font-size="11" transform="rotate(9 350 242)">🐠</text>
            <text class="emoji" x="368" y="246" font-size="8"  transform="rotate(-7 368 246)">🐠</text>
            <text class="emoji" x="387" y="244" font-size="11" transform="rotate(4 387 244)">🐠</text>
            <text class="emoji" x="406" y="242" font-size="8"  transform="rotate(-9 406 242)">🐠</text>

            <text class="emoji" x="342" y="264" font-size="11" transform="rotate(-12 342 264)">🐠</text>
            <text class="emoji" x="362" y="268" font-size="8"  transform="rotate(6 362 268)">🐠</text>
            <text class="emoji" x="380" y="270" font-size="11" transform="rotate(-5 380 270)">🐠</text>
            <text class="emoji" x="400" y="270" font-size="8"  transform="rotate(10 400 270)">🐠</text>
            <text class="emoji" x="420" y="266" font-size="11" transform="rotate(-7 420 266)">🐠</text>

            <text class="emoji" x="352" y="292" font-size="8"  transform="rotate(8 352 292)">🐠</text>
            <text class="emoji" x="372" y="298" font-size="11" transform="rotate(-6 372 298)">🐠</text>
            <text class="emoji" x="392" y="298" font-size="8"  transform="rotate(4 392 298)">🐠</text>
            <text class="emoji" x="364" y="320" font-size="11" transform="rotate(-9 364 320)">🐠</text>
            <text class="emoji" x="406" y="312" font-size="8"  transform="rotate(7 406 312)">🐠</text>

            <text class="emoji" x="132" y="196" font-size="8"  transform="rotate(-12 132 196)">🐠</text>
            <text class="emoji" x="170" y="188" font-size="11" transform="rotate(8 170 188)">🐠</text>
            <text class="emoji" x="224" y="210" font-size="8"  transform="rotate(-10 224 210)">🐠</text>
            <text class="emoji" x="148" y="234" font-size="8"  transform="rotate(6 148 234)">🐠</text>
            <text class="emoji" x="200" y="252" font-size="11" transform="rotate(-8 200 252)">🐠</text>
            <text class="emoji" x="236" y="274" font-size="8"  transform="rotate(12 236 274)">🐠</text>
            <text class="emoji" x="140" y="292" font-size="11" transform="rotate(-6 140 292)">🐠</text>
            <text class="emoji" x="182" y="308" font-size="8"  transform="rotate(7 182 308)">🐠</text>
            <text class="emoji" x="216" y="326" font-size="11" transform="rotate(-9 216 326)">🐠</text>
          </g>`;
      }

      return `
        <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512" role="img" aria-label="Lago de pesca">
          <defs>
            <linearGradient id="${uniqueId}-bgGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#bff0c8"/>
              <stop offset="1" stop-color="#97e0a9"/>
            </linearGradient>
            <linearGradient id="${uniqueId}-waterGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#2de2ff"/>
              <stop offset="0.55" stop-color="#1aa6ff"/>
              <stop offset="1" stop-color="#0a66ff"/>
            </linearGradient>
            <radialGradient id="${uniqueId}-waterGlow" cx="35%" cy="30%" r="70%">
              <stop offset="0" stop-color="#ffffff" stop-opacity="0.38"/>
              <stop offset="0.55" stop-color="#ffffff" stop-opacity="0.12"/>
              <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
            </radialGradient>
            <filter id="${uniqueId}-softShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000" flood-opacity="0.22"/>
            </filter>
            <filter id="${uniqueId}-innerShade" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="blur"/>
              <feOffset dy="3" result="off"/>
              <feComposite in="off" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="inner"/>
              <feColorMatrix in="inner" type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 0.32 0" result="innerAlpha"/>
              <feComposite in="innerAlpha" in2="SourceGraphic" operator="over"/>
            </filter>
            <path id="${uniqueId}-lakeShape" d="
              M 160 150
              C 105 150 70 190 70 245
              C 70 315 125 360 195 350
              C 225 346 240 332 250 320
              C 265 300 285 300 300 320
              C 320 346 355 365 395 360
              C 455 350 492 300 492 245
              C 492 180 440 135 375 140
              C 345 142 325 155 305 175
              C 290 190 280 200 265 198
              C 250 196 248 184 258 172
              C 272 156 288 138 270 123
              C 242 100 205 110 180 135
              C 172 143 168 148 160 150
              Z"/>
            <clipPath id="${uniqueId}-clipLake">
              <use href="#${uniqueId}-lakeShape"/>
            </clipPath>
            <style>
              .emoji { font-family: "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif; }
            </style>
          </defs>

          <rect x="0" y="0" width="512" height="512" rx="44" fill="url(#${uniqueId}-bgGrad)"/>

          <g opacity="0.35">
            <circle cx="90" cy="105" r="22" fill="#ffffff"/>
            <circle cx="128" cy="88" r="10" fill="#ffffff"/>
            <circle cx="430" cy="92" r="18" fill="#ffffff"/>
            <circle cx="402" cy="118" r="9" fill="#ffffff"/>
          </g>

          <g id="trees" class="emoji" opacity="0.95">
            <text x="22" y="118" font-size="26">🌲</text>
            <text x="58" y="136" font-size="22">🌳</text>
            <text x="18" y="158" font-size="18">🌳</text>
            <text x="440" y="116" font-size="24">🌳</text>
            <text x="472" y="134" font-size="22">🌲</text>
            <text x="452" y="156" font-size="18">🌳</text>
          </g>

          <g id="lakeScene" transform="translate(-30,0)">
            <g filter="url(#${uniqueId}-softShadow)">
              <use href="#${uniqueId}-lakeShape" fill="#ffe2b3"/>
              <use href="#${uniqueId}-lakeShape" fill="none" stroke="#d4b07a" stroke-width="6" stroke-opacity="0.55"/>
              <use href="#${uniqueId}-lakeShape" transform="translate(0,-1)" fill="url(#${uniqueId}-waterGrad)"/>
              <use href="#${uniqueId}-lakeShape" fill="url(#${uniqueId}-waterGlow)"/>
              <use href="#${uniqueId}-lakeShape" fill="transparent" filter="url(#${uniqueId}-innerShade)"/>

              <g clip-path="url(#${uniqueId}-clipLake)" opacity="0.12">
                <path d="M 255 175 C 240 205 240 235 255 260 C 270 285 270 315 255 340" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>
                <path d="M 270 175 C 255 205 255 235 270 260 C 285 285 285 315 270 340" fill="none" stroke="#0a2a66" stroke-opacity="0.16" stroke-width="10" stroke-linecap="round"/>
              </g>

              <g clip-path="url(#${uniqueId}-clipLake)" opacity="0.16" stroke="#ffffff" stroke-width="6" fill="none" stroke-linecap="round">
                <path d="M 130 205 C 165 190 200 190 235 205"/>
                <path d="M 135 252 C 175 236 215 236 255 252"/>
                <path d="M 300 205 C 335 190 370 190 405 205"/>
                <path d="M 305 265 C 342 248 380 248 417 265"/>
              </g>

              <g id="islands" clip-path="url(#${uniqueId}-clipLake)" opacity="0.95">
                <ellipse cx="266" cy="252" rx="18" ry="11" fill="#ffe2b3" stroke="#d4b07a" stroke-width="2" stroke-opacity="0.75"/>
                <ellipse cx="266" cy="252" rx="12" ry="7" fill="#2fbf71"/>
                <ellipse cx="292" cy="278" rx="14" ry="9" fill="#ffe2b3" stroke="#d4b07a" stroke-width="2" stroke-opacity="0.75"/>
                <ellipse cx="292" cy="278" rx="9" ry="5" fill="#36d07a"/>
              </g>

              <g opacity="0.9">
                <circle cx="140" cy="150" r="10" fill="#2fbf71"/>
                <circle cx="155" cy="158" r="6" fill="#36d07a"/>
                <circle cx="385" cy="300" r="10" fill="#2fbf71"/>
                <circle cx="370" cy="308" r="6" fill="#36d07a"/>
              </g>

              ${fishGroup}
            </g>

            <g id="docks" opacity="0.95">
              <g id="dock-left">
                <rect x="62" y="262" width="54" height="12" rx="6" fill="#8b5a2b"/>
                <rect x="62" y="274" width="54" height="8" rx="4" fill="#6f4522" opacity="0.9"/>
              </g>
              <g id="dock-right">
                <rect x="438" y="236" width="62" height="12" rx="6" fill="#8b5a2b"/>
                <rect x="438" y="248" width="62" height="8" rx="4" fill="#6f4522" opacity="0.9"/>
                <rect x="444" y="232" width="6" height="10" rx="3" fill="#6f4522" opacity="0.75"/>
                <rect x="492" y="232" width="6" height="10" rx="3" fill="#6f4522" opacity="0.75"/>
              </g>
            </g>

            <g id="fishingSpots" class="emoji" opacity="0.95">
              <text x="48" y="244" font-size="26">🎣</text>
              <text x="466" y="244" font-size="26">🎣</text>
            </g>
          </g>
        </svg>
      `;
    }
    // FINAL DE CREATELAKESTIMULUS


        // === ESTÍMULOS DE GENIOS (SVG embebido, sin dependencias externas) ===
    // Nota: Los SVG originales comparten IDs internos (gradients). Para evitar colisiones al renderizar varios,
    // prefijamos todos los id="..." y sus referencias url(#...) con un prefijo único por instancia.
    const GENIUS_SVG_INNER_A = `<radialGradient id="SVGID_1_" cx="31.8455" cy="116.7174" r="62.3384" gradientTransform="matrix(1.028679e-13 -1 1.0982 1.129720e-13 -96.3364 148.5629)" gradientUnits="userSpaceOnUse">
	<stop  offset="0.1444" style="stop-color:#29B6F6"/>
	<stop  offset="0.9451" style="stop-color:#0277BD"/>
</radialGradient>
<path style="fill:url(#SVGID_1_);" d="M111.17,87.23c-1.61,1.17-13.65,3.19-6.15-1.04c4.93-2.78,7.47-12.01-3.68-14.8
	C89.93,68.56,77.74,88.46,76,92.63c-4.13,9.89-9.85,18.2-21.58,24.17c-10.49,5.35-20.28,5.85-32.53-0.08
	c-9.98-4.83-13.16-13.96-11.79-25.88c0.17-1.51,0.36-2.83,0.56-3.99c0.14-0.82,0.28-1.56,0.42-2.24c1.39-6.75,2.75-7.67,0.64-16.95
	l18.23-2.03l3.12-0.35l25.61-2.86c0,6.72-0.77,11.82-10.54,21.28c-3.88,3.76-10.54,6.96-11.9,11.89c-0.45,1.65-0.75,3.41,0.72,5.6
	c1.68,2.52,13.54,8.51,24.79-7.46c1.15-1.63,7.52-11.3,9.25-13.91c4.26-6.43,8.9-12.1,16-15.64C112,51.7,123.92,77.96,111.17,87.23z
	"/>
<linearGradient id="SVGID_2_" gradientUnits="userSpaceOnUse" x1="47.8866" y1="46.0871" x2="22.5485" y2="18.3835" gradientTransform="matrix(1 0 0 -1 0 128)">
	<stop  offset="0" style="stop-color:#005584;stop-opacity:0"/>
	<stop  offset="0.8412" style="stop-color:#005584"/>
</linearGradient>
<path style="fill:url(#SVGID_2_);" d="M37.79,79.63c-3.48,3.22-7.56,5.71-11.37,8.54s-7.45,6.11-9.57,10.35s-2.46,9.63,0.15,13.59
	c1.16,1.76,4.5,5.43,13.12,7.74c0,0-13.46-6.56-5.76-17.6c2.44-3.5,12.48-9.35,15.72-12.12s2.52-1.64,5.48-4.71
	c3.37-3.49,7.68-8.67,9.43-13.19c1.23-3.18,2.97-8.37-2.41-8.37S40.87,76.79,37.79,79.63z"/>
<linearGradient id="SVGID_3_" gradientUnits="userSpaceOnUse" x1="88.4855" y1="39.3734" x2="116.42" y2="39.3734" gradientTransform="matrix(1 0 0 -1 0 128)">
	<stop  offset="0" style="stop-color:#FFD54F"/>
	<stop  offset="0.0951" style="stop-color:#FEC846"/>
	<stop  offset="0.2707" style="stop-color:#FAA630"/>
	<stop  offset="0.3849" style="stop-color:#F78C1F"/>
	<stop  offset="0.6891" style="stop-color:#F37F21"/>
	<stop  offset="1" style="stop-color:#ED6D23"/>
</linearGradient>
<path style="fill:url(#SVGID_3_);" d="M91.05,103.88c-0.61-0.2-1.31-0.42-1.49-0.78c-2.36-4.79-0.74-10.09,3.95-12.9
	c1.65-0.98,4.67-1.87,6.88-2.51c0.53-0.15,1.02-0.3,1.45-0.43c6.59-2.02,10.95-5.1,12.95-9.16c0.94-1.91,1.14-3.36,1.13-4.78
	c0.25,1.08,0.5,2.27,0.5,4.46c0,6.35-3.71,9.17-7.73,11.26c-2.2,1.15-4.47,1.58-6.87,2.03c-2.35,0.45-4.79,0.91-7.11,2.11
	c-2.33,1.21-3.8,2.77-4.35,4.66c-0.52,1.76-0.24,3.8,0.82,6.09C91.13,103.91,91.09,103.9,91.05,103.88z"/>
<linearGradient id="SVGID_4_" gradientUnits="userSpaceOnUse" x1="78.6181" y1="57.1888" x2="63.8231" y2="19.8083" gradientTransform="matrix(1 0 0 -1 0 128)">
	<stop  offset="0.3666" style="stop-color:#F78C1F"/>
	<stop  offset="0.6798" style="stop-color:#F37F21"/>
	<stop  offset="1" style="stop-color:#ED6D23"/>
</linearGradient>
<path style="fill:url(#SVGID_4_);" d="M49.23,119.06c3.15-3.02,10.55-10.57,13.37-18.86c6.64-19.59,9.45-22.73,13.71-27.5l0.07-0.08
	c4.77-5.57,10.3-9.01,16.02-10.62c-5.02,3.77-8.31,10.41-11.19,18.28c-2.86,7.84-6.11,16.74-12.89,26.01
	C64.04,112.14,56.66,116.93,49.23,119.06z"/>
<path style="fill:#FFD54F;" d="M49.24,118.98C64,109,71,92,76.82,76.67c1.04-2.59,2.27-5.09,3.66-7.49c1.39-2.4,2.94-4.71,4.59-6.94
	c0.86-1.15,1.84-2.23,2.91-3.22c1.09-0.97,2.28-1.85,3.56-2.58c2.58-1.44,5.53-2.26,8.49-2.29c2.97-0.02,5.9,0.75,8.49,2.12
	c2.57,1.39,4.91,3.38,6.36,6.04c0.74,1.32,1.18,2.83,1.37,4.25c0.21,1.44,0.23,2.9,0.09,4.33c-0.32,2.86-1.28,5.63-2.9,7.99
	c-0.81,1.17-1.82,2.22-2.87,3.11c-1.05,0.91-2.15,1.73-3.29,2.5c-2.28,1.52-4.68,2.92-7.29,3.71c1.26-0.52,2.43-1.21,3.55-1.96
	c1.13-0.74,2.22-1.55,3.26-2.4c2.05-1.72,4.16-3.49,5.4-5.75c1.29-2.24,1.98-4.81,2.08-7.36c0.11-2.53-0.31-5.18-1.54-7.2
	c-1.26-2.08-3.24-3.75-5.47-4.87s-4.74-1.68-7.21-1.63C97.59,57.07,95.16,57.77,93,59c-1.07,0.63-2.07,1.38-3.01,2.22
	c-0.91,0.87-1.77,1.8-2.55,2.81c-1.6,2.12-3.1,4.32-4.47,6.6c-0.01,0.02-0.03,0.05-0.04,0.07c-1.94,3.24-3.49,6.71-4.75,10.27
	c-5.26,14.93-12.97,27.91-27.06,37.11C50.54,118.46,49.93,118.83,49.24,118.98z"/>
<path style="fill:#039BE5;" d="M63.98,68.72l-6.28-0.11l-18.93-0.33l-1.24-0.03h-0.18l-2.04-0.04l-1.04-0.01l-1.22-0.02l-1.36-0.03
	H31.2l-1.3-0.03l-1.21-0.02l-14.5-0.26l-4.09-0.07c1.22-6.53,4.09-9.41,7.27-11c2.73-1.37,5.69-1.79,8.01-2.75
	c0.32-0.12,0.62-0.26,0.91-0.42c0.42-0.22,0.81-0.47,1.17-0.76c0.12-0.1,0.24-0.21,0.36-0.33c0.01,0,0.01,0,0.01,0
	c0-0.01,0.01-0.02,0.01-0.02c1.04-1.02,1.7-2.49,1.77-4.77l11.74-0.62c-0.14,2.65,0.73,4.3,2.2,5.44c0.07,0.06,0.14,0.11,0.21,0.16
	c0.17,0.12,0.35,0.24,0.53,0.35c0.45,0.26,0.93,0.5,1.45,0.72c0.31,0.12,0.62,0.24,0.95,0.35c0.27,0.1,0.55,0.19,0.84,0.27
	c0.04,0.02,0.08,0.03,0.12,0.04c0.15,0.05,0.3,0.09,0.45,0.14c0.08,0.02,0.16,0.04,0.25,0.06c1.62,0.46,3.37,0.85,5.1,1.38
	c0.25,0.08,0.52,0.17,0.81,0.27c0.62,0.2,1.24,0.44,1.85,0.7c0.21,0.1,0.4,0.18,0.57,0.26c0.06,0.02,0.12,0.05,0.18,0.08
	C60.5,59.1,63.48,62.19,63.98,68.72z"/>
<path style="opacity:0.35;fill:#212121;enable-background:new    ;" d="M46.87,87.3c-0.51,0.74-1.12,0.97-1.66,1
	c-0.63,0.03-1.16-0.23-1.28-0.3c-0.01,0-0.01-0.01-0.02-0.01c0,0-11.78-7.36-9.64-19.79c0.78-4.57,3.45-9.83,9.28-15.66
	c0.07,0.06,0.14,0.11,0.21,0.16c0.17,0.12,0.35,0.24,0.53,0.35c0.45,0.26,0.93,0.5,1.45,0.72c-0.28,0.34-0.96,1.14-1.78,2.2
	c-3.15,3.99-5.66,8.04-6.43,12.28c-0.31,1.69-0.34,3.41-0.02,5.18c1.03,5.62,4.83,9.49,7.06,11.91
	C45.51,86.27,46.87,87.28,46.87,87.3z"/>
<radialGradient id="SVGID_5_" cx="47.5065" cy="71.13" r="14.7183" gradientUnits="userSpaceOnUse">
	<stop  offset="0.3666" style="stop-color:#F78C1F"/>
	<stop  offset="0.6798" style="stop-color:#F37F21"/>
	<stop  offset="1" style="stop-color:#ED6D23"/>
</radialGradient>
<path style="fill:url(#SVGID_5_);" d="M57.7,68.61c-0.12,1.38-0.34,2.69-0.7,3.81c-0.12,0.39-0.26,0.75-0.42,1.09
	c-0.67,1.43-1.63,2.87-2.6,4.26c-0.17,0.24-0.33,0.48-0.5,0.72l-0.32,0.46c-1.27,1.81-3.74,5.49-5.44,8.03l-1.25,1.86l-0.25,0.37
	c-0.25-0.21-0.59-0.52-1.01-0.91c-2.38-2.3-7.02-7.64-7.88-15.08c0-0.01,0-0.01,0-0.02c-0.16-1.37-0.18-2.74-0.06-4.13
	c0.02-0.27,0.05-0.54,0.08-0.82c0.57-5.01,2.89-10.11,6.94-15.2c0.45,0.26,0.93,0.5,1.45,0.72c0.31,0.12,0.62,0.24,0.95,0.35
	c0.27,0.1,0.55,0.19,0.84,0.27c0.04,0.02,0.08,0.03,0.12,0.04c0.14,0.05,0.29,0.1,0.45,0.14c0.08,0.02,0.16,0.04,0.25,0.06
	c1.62,0.46,3.37,0.85,5.1,1.38c0.25,0.08,0.52,0.17,0.81,0.27c0.75,0.25,1.36,0.5,1.85,0.7c0.21,0.1,0.4,0.18,0.57,0.26
	c0.06,0.02,0.12,0.05,0.17,0.07l0.01,0.01C57.3,58.18,58.13,63.78,57.7,68.61z"/>
<path style="fill:#FCB316;" d="M47.72,86.98l-1.25,1.86l-0.25,0.37l-0.3,0.44c-0.42-0.31-1.13-0.87-1.99-1.65
	c-0.01,0-0.01-0.01-0.02-0.01c-3.6-3.26-9.8-10.36-8.6-19.78c0.6-4.67,3.01-9.89,8.45-15.51c0.17,0.12,0.35,0.24,0.53,0.35
	c0.45,0.26,0.93,0.5,1.45,0.72c0.31,0.12,0.62,0.24,0.95,0.35c-0.34,0.41-0.87,1.06-1.49,1.85c-3.15,4-5.67,8.06-6.43,12.31
	c-0.31,1.68-0.34,3.39-0.02,5.15c1.03,5.62,4.83,9.49,7.06,11.91C46.44,85.96,47.25,86.61,47.72,86.98z"/>
<path style="opacity:0.35;fill:#212121;enable-background:new    ;" d="M33.05,68.18c-0.12,1.18-0.39,2.47-0.87,3.88
	c-1.88,5.47-5.07,14.59-21.52,14.79c0.01-0.09,0.03-0.17,0.04-0.25c0.03-0.17,0.06-0.34,0.09-0.5c0.1-0.53,0.19-1.02,0.29-1.49
	c0.42-0.48,1.03-0.87,1.89-0.94c10.99-1.15,14.41-6.8,16.12-11.8c0.45-1.31,0.7-2.56,0.81-3.75c0.09-0.87,0.1-1.71,0.05-2.49
	c-0.08-1.53-0.37-2.86-0.69-3.93c-0.06-0.21-0.14-0.51-0.24-0.87c-0.58-2.15-1.37-4.39-1.68-5.05c-0.35-0.74-0.78-1.62-1.05-2.18
	c0.42-0.22,0.81-0.47,1.17-0.76c0.12-0.1,0.24-0.21,0.36-0.33c0.01,0,0.01,0,0.01,0c0.01,0.01,0.03,0.02,0.04,0.04
	c2.44,2.08,3.83,6.86,4.26,8.29c0.37,1.24,0.79,2.7,0.94,4.44C33.15,66.17,33.16,67.13,33.05,68.18z"/>
<radialGradient id="SVGID_6_" cx="19.2048" cy="69.53" r="14.5663" gradientUnits="userSpaceOnUse">
	<stop  offset="0.3666" style="stop-color:#F78C1F"/>
	<stop  offset="0.6798" style="stop-color:#F37F21"/>
	<stop  offset="1" style="stop-color:#ED6D23"/>
</radialGradient>
<path style="fill:url(#SVGID_6_);" d="M31.2,68.15c-0.02,0.28-0.06,0.57-0.1,0.86c-0.16,1.13-0.42,2.3-0.84,3.51
	c-0.3,0.89-0.67,1.82-1.12,2.76c-2.33,4.86-7.01,10-18.35,10.82c-1.04,0.08-2.13,0.12-3.29,0.12c-0.12-0.01-0.25-0.01-0.37-0.01
	c0.51-0.65,1.13-1.58,1.78-2.7h0.01c1.04-1.79,2.19-4.07,3.1-6.42c0.72-1.86,1.3-3.78,1.57-5.53l0.02-0.14l0.03-0.16
	c0.18-1.16,0.35-2.3,0.55-3.42c0.51-2.99,1.16-5.89,2.35-8.79c0.03-0.08,0.09-0.26,0.18-0.51c0.12-0.35,0.4-1.19,0.65-1.77
	c2.73-1.37,5.69-1.79,8.01-2.75c0.32-0.12,0.62-0.26,0.91-0.42c0.42-0.22,0.81-0.47,1.17-0.76c1.42,2.13,2.34,5.54,2.78,7.18
	c0.09,0.33,0.16,0.6,0.22,0.8C31.01,62.66,31.47,65.21,31.2,68.15z"/>
<path style="fill:#FCB316;" d="M31.69,68.15c-0.12,1.41-0.42,2.93-0.96,4.52C28.97,77.83,25.01,85.6,10.7,86.6
	c-1.01,0.07-2.08,0.11-3.2,0.11c-0.29,0-0.57,0-0.86-0.01c0.19-0.21,1.62-2.03,2.27-3.19h0.01c0.55,0,1.44,0.11,2.85-0.01
	c10.99-1.15,14.41-6.8,16.12-11.8c0.43-1.25,0.68-2.46,0.8-3.6c0.28-2.63-0.13-4.92-0.63-6.57c-0.06-0.21-0.14-0.51-0.24-0.87
	c-0.58-2.15-1.37-4.39-1.68-5.05c-0.24-0.51-0.52-1.09-0.76-1.59c0.32-0.12,0.62-0.26,0.91-0.42c0.42-0.22,0.81-0.47,1.17-0.76
	c0.12-0.1,0.24-0.21,0.36-0.33c0.01,0,0.01,0,0.01,0c0-0.01,0.01-0.02,0.01-0.02c0.01,0.02,0.02,0.04,0.03,0.06
	c1.74,2.59,2.7,6.91,3.06,8.11C31.46,62.44,31.99,65.05,31.69,68.15z"/>
<path style="opacity:0.35;fill:#212121;enable-background:new    ;" d="M57,72.42c-0.12,0.39-0.26,0.75-0.42,1.09
	c-0.67,1.43-1.63,2.87-2.6,4.26c-5.95-0.09-12.27-1.93-16-4.27l-0.65-0.28l-0.99-0.43c-1.64,0.55-4.2,1.55-7.2,2.49
	c-5.2,1.63-11.74,3.09-17.12,1.81c0.72-1.86,1.3-3.78,1.57-5.53l0.02-0.14c2.37-1.75,12.59-2.45,13.01-2.45
	c0.13,0,1.93,0.02,4.48,0.04c1.79,0.02,3.95,0.04,6.17,0.06c6.14,0.06,12.67,0.13,12.67,0.13L57,72.42z"/>
<path style="fill:#4FC3F7;" d="M63.07,63.87c0.38,0.45,2.66,2.58,2.64,4.76c-0.02,1.79-0.76,4.07-3.25,5.28
	c-6.59,3.22-18.85,0.65-24.47-2.9c-6.99-4.4-11.74-6.99-11.74-6.99c-6.14,1.3-11.25-1.74-11.25-1.74s-6.67,1.28-7.78,1.25
	c-1.75-0.04-2.18-2.4-0.73-2.9c2.86-0.99,9.7-5.02,12.36-4.87c1.45,0.08,16.13,2.9,20.35,4.1c1.36,0.39,9.53,1.85,9.53,1.85"/>
<path style="fill:#4FC3F7;" d="M39.49,59.94c0,0,12.81-4.24,15.7-3.6c7.22,1.6,10.66,7.25,10.77,8.28c-0.4,1.21-2.99,1.99-5.55,1.36
	c-3.42-0.84-7.29-3.35-11.7-4.27C48.71,61.71,39.69,60.12,39.49,59.94z"/>
<g>
	<path style="fill:#0277BD;" d="M65.96,64.62c-0.11,0.61-0.65,1.09-1.19,1.4c-0.55,0.32-1.16,0.51-1.78,0.64
		c-1.25,0.22-2.56,0.18-3.83-0.28c-1.29-0.43-2.3-1.33-3.2-2.05c-0.89-0.76-1.68-1.29-2.53-1.32L53.09,63l-0.46,0
		c-0.31,0-0.63,0.01-0.93,0c-0.62-0.02-1.23-0.05-1.84-0.12c-1.21-0.16-2.4-0.33-3.57-0.61c-2.34-0.55-4.66-1.21-6.8-2.34
		c2.37,0.32,4.72,0.55,7.05,0.8c1.17,0.09,2.32,0.22,3.48,0.26c0.57,0.02,1.15,0.06,1.71,0.05c0.29,0.01,0.56-0.01,0.84-0.02
		L53,61.01l0.56,0c0.75,0.06,1.5,0.32,2.1,0.69c0.61,0.37,1.11,0.79,1.55,1.2c0.87,0.84,1.64,1.56,2.57,2.04
		c0.91,0.46,2.03,0.72,3.13,0.74c0.56,0.02,1.12-0.04,1.66-0.17C65.08,65.36,65.65,65.14,65.96,64.62z"/>
</g>
<path style="fill:#4FC3F7;" d="M36.73,70.23c-1.46,1.08-15.26,6.36-24.71,4.24c-2.19-0.49-5.15-1.1-5.84-3.69
	c-0.84-3.18,2.91-7.44,2.91-7.44l5.9-1.04l3.51,1.32c1.06,0.4,2.18,0.58,3.31,0.55l4.43-0.14C26.24,64.02,37.25,70.23,36.73,70.23z"
	/>
<path style="fill:#039BE5;" d="M20.8,40.67c-1.06-0.23-2.92-0.81-4.21-2.16c-2.36-2.49-3.08-7.49-3.26-9.31
	c1.31,0.12,4.28,0.58,5.81,2.39L20.8,40.67z"/>
<path style="fill:#FCB316;" d="M18.04,38.42c-0.14,1.64-0.96,3.01-2.2,3.03c-1.24,0.03-2.27-1.3-2.3-2.95
	c-0.02-1.25,0.53-2.33,1.34-2.79l0.47,0.97c-0.41,0.28-0.76,0.95-0.74,1.81c0.02,1.14,0.65,1.92,1.21,1.91
	c0.56-0.01,1.16-0.81,1.15-1.95c-0.01-0.94-0.14-1.23-0.38-1.75c-0.39-0.88,0.26-1.56,0.88-0.7C17.47,36,18.17,36.84,18.04,38.42z"
	/>
<path style="fill:#039BE5;" d="M51.28,31.59c1.53-1.82,4.5-2.27,5.81-2.39c-0.18,1.82-0.9,6.82-3.26,9.31
	c-1.29,1.36-3.15,1.94-4.21,2.16L51.28,31.59z"/>
<path style="fill:#4FC3F7;" d="M33.68,52.13l1.22,0.08h1.62c9.01-0.6,15.04-8.94,15.23-22.14c0.19-13.13-7.9-19.75-16.23-19.87
	s-16.62,6.25-16.81,19.38C18.51,42.8,25.13,51.44,33.68,52.13z"/>
<g>
	<path style="fill:#01579B;" d="M30.76,29.8c-0.31,0.28-0.79,0.09-1.23-0.08c-0.98-0.37-1.44-0.66-2.53-0.87
		c-0.91-0.17-2.05-0.22-2.94,0.05c-0.81,0.24-0.72-0.05-0.17-0.52c1.15-0.98,2.14-1.15,3.63-1.09C29.71,27.39,31.8,28.86,30.76,29.8
		z"/>
	<path style="fill:#01579B;" d="M39.7,29.8c0.31,0.28,0.79,0.09,1.23-0.08c0.98-0.37,1.44-0.66,2.53-0.87
		c0.91-0.17,2.05-0.22,2.94,0.05c0.81,0.24,0.72-0.05,0.17-0.52c-1.15-0.98-2.14-1.15-3.63-1.09C40.76,27.39,38.67,28.86,39.7,29.8z
		"/>
</g>
<path style="fill:#0277BD;" d="M37.11,38.19c-0.05-0.02-0.1-0.03-0.15-0.04l-3.42-0.05c-0.05,0.01-0.1,0.02-0.16,0.04
	c-0.31,0.12-0.49,0.44-0.35,0.78s0.81,1.31,2.18,1.33s2.07-0.93,2.22-1.27S37.41,38.32,37.11,38.19z"/>
<path style="fill:#4E342E;" d="M39.31,42.13c-1.55,0.89-6.6,0.82-8.12-0.12c-0.88-0.54-1.79,0.25-1.44,1.06
	c0.35,0.79,3.08,2.67,5.46,2.7s5.13-1.76,5.5-2.54C41.08,42.43,40.2,41.62,39.31,42.13z"/>
<path style="fill:#FCB316;" d="M52.95,36c0.62-0.86,1.27-0.18,0.88,0.7c-0.24,0.52-0.37,0.81-0.38,1.75
	c-0.01,1.14,0.59,1.94,1.15,1.95s1.19-0.77,1.21-1.91c0.02-0.86-0.33-1.53-0.74-1.81l0.47-0.97c0.81,0.46,1.36,1.54,1.34,2.79
	c-0.03,1.65-1.06,2.98-2.3,2.95c-1.24-0.02-2.06-1.39-2.2-3.03C52.25,36.84,52.95,36,52.95,36z"/>
<g>
	<circle style="fill:#212121;" cx="27.29" cy="33.6" r="2.38"/>
	<circle style="fill:#212121;" cx="43.17" cy="33.6" r="2.38"/>
</g>
<linearGradient id="SVGID_7_" gradientUnits="userSpaceOnUse" x1="106.0931" y1="16.9589" x2="102.1031" y2="5.2189" gradientTransform="matrix(1 0 0 -1 0 128)">
	<stop  offset="0" style="stop-color:#EA6100"/>
	<stop  offset="1" style="stop-color:#ED6D23"/>
</linearGradient>
<path style="fill:url(#SVGID_7_);" d="M116.24,113.57c-5.58-0.89-5.1-2.6-5.63-4.19l-5.33-1.56c-1.22,1.05-2.38,3.23-6.97,0.99
	c-1.41-0.69-6.17-4.72-6.17-4.72l-3.59-0.91c0.46,0.42,4.37,5.45,7.7,9.66c4.16,5.27,6.65,6.25,8.48,6.78
	c2.74,0.8,5.92,0.4,5.92,0.4s5.34,0.58,9-0.76c3.8-1.39,5.53-4.9,5.53-4.9S118.76,113.81,116.24,113.57z M119.05,117.63
	c-1.38,0.5-3.06,0.7-4.54,0.76c1.28-0.93,2.13-2.06,2.66-2.98c1.02,0.09,2.51,0.23,4.71,0.42
	C121.16,116.52,120.22,117.21,119.05,117.63z"/>
<radialGradient id="SVGID_8_" cx="109.97" cy="15.13" r="8.6992" gradientTransform="matrix(0.9726 -0.2326 -0.2175 -0.9094 5.95 153.6492)" gradientUnits="userSpaceOnUse">
	<stop  offset="0.2716" style="stop-color:#FEBC12"/>
	<stop  offset="0.4999" style="stop-color:#FEA709"/>
	<stop  offset="0.809" style="stop-color:#FF9000"/>
</radialGradient>
<path style="fill:url(#SVGID_8_);" d="M121.88,115.84c-0.72,0.69-1.66,1.37-2.83,1.8c-1.38,0.5-3.06,0.7-4.54,0.76
	c1.08-0.79,2.13-2.16,2.66-2.98c-3,0.16-6.87-0.14-10.79-1.29c-7.36-2.16-13.58-8.93-14.64-10.14l-3.19-0.81
	c0.46,0.42,4.37,5.45,7.7,9.66c2.81,3.55,4.85,5.15,6.45,5.98c-3.41-0.11-5.44,1.97-5.44,1.97l13.17,3.86c0,0-0.59-2.87-3.56-4.62
	c2.03,0.22,3.78,0,3.78,0s5.34,0.58,9-0.76c3.8-1.39,5.53-4.9,5.53-4.9L121.88,115.84L121.88,115.84z"/>
<radialGradient id="SVGID_9_" cx="106.87" cy="27.3" r="3.7747" gradientTransform="matrix(0.9596 0.2812 0.2812 -0.9596 -0.1786 97.9058)" gradientUnits="userSpaceOnUse">
	<stop  offset="0" style="stop-color:#FEBC12"/>
	<stop  offset="1" style="stop-color:#FF8F00"/>
</radialGradient>
<path style="fill:url(#SVGID_9_);" d="M108.34,104.94l-3.27,3.12l5.65,1.66l-1.5-4.48l1.16-0.95c0.33-0.27,0.5-0.68,0.46-1.1
	l-0.21-2.42c-0.04-0.48-0.64-0.68-0.96-0.31l-1.61,1.85c-0.31,0.35-0.4,0.85-0.23,1.29C107.83,103.6,108.34,104.94,108.34,104.94z"
	/>
<radialGradient id="SVGID_10_" cx="106.8233" cy="6.94" r="4.3859" gradientTransform="matrix(0.9596 0.2812 0.2812 -0.9596 -0.1786 97.9058)" gradientUnits="userSpaceOnUse">
	<stop  offset="0" style="stop-color:#FEF59F"/>
	<stop  offset="0.9044" style="stop-color:#FAC537"/>
	<stop  offset="1" style="stop-color:#F9BF2C"/>
</radialGradient>
<polygon style="fill:url(#SVGID_10_);" points="110.04,123.59 98.19,120.11 99.67,119.33 109.18,122.12 "/>
<path style="fill:#0F3B7C;" d="M46.04,22.63c-3.84,0-7.52-1.38-10.94-4.11c-3.87-3.09-6.95-3.74-8.84-3.74
	c-1.03,0-1.86,0.18-2.49,0.4c0.38-3.46,2.4-6.75,5.31-8.54c2.31-1.43,4.89-2.15,7.68-2.15c2.19,0,4.02,0.47,4.92,0.87
	c3.22,1.44,5.28,2,7.34,2c1.34,0,2.72-0.25,4.37-0.79c-0.36,1.47-1.36,2.8-2.7,3.5l-1.08,0.57L50.79,11
	c0.61,0.18,1.27,0.27,1.95,0.27c4.05,0,8.14-3.21,9.79-4.68c0.18,3.19-0.29,13.06-12.46,15.57C49.28,22.33,47.81,22.63,46.04,22.63z
	"/>
<radialGradient id="SVGID_11_" cx="48.6143" cy="7.8484" r="25.9054" gradientTransform="matrix(0.9023 -0.4311 -0.3198 -0.6695 -1.6052 35.2139)" gradientUnits="userSpaceOnUse">
	<stop  offset="0.6107" style="stop-color:#00838F;stop-opacity:0"/>
	<stop  offset="1" style="stop-color:#00838F"/>
</radialGradient>
<path style="fill:url(#SVGID_11_);" d="M62.53,6.59c-0.07,1.06,1.16,12.6-12.42,15.54c-8.95,1.94-13.99-2.8-14.17-2.97
	c0,0,5.39,0.1,5.81-1.08c0.54-1.52-0.23-2.83-0.23-2.83C52.79,15.43,58.55,9.85,62.53,6.59z"/>
<radialGradient id="SVGID_12_" cx="18.1627" cy="-14.4217" r="20.4547" gradientTransform="matrix(-0.9674 0.2534 0.188 0.7177 61.917 22.9396)" gradientUnits="userSpaceOnUse">
	<stop  offset="0.6107" style="stop-color:#00838F;stop-opacity:0"/>
	<stop  offset="1" style="stop-color:#00838F"/>
</radialGradient>
<path style="fill:url(#SVGID_12_);" d="M23.77,15.18c0.21-0.8,0.68-8.61,10.38-10.47c0.64-0.12,1.43-0.17,2.15-0.23
	c2.21-0.16,4.38,0.48,5.78,1.05c1.57,0.64,2.57,1.07,4.21,1.49c2.48,0.64-0.49,3.37-3.29,3.68c-1.29,0.14-2.53,0.23-3.21,0.16
	c-0.56-0.06-6.38,6.05-9.55,4.74C27.26,14.38,24.43,14.82,23.77,15.18z"/>
<radialGradient id="SVGID_13_" cx="-21.355" cy="-68.1857" r="13.6886" gradientTransform="matrix(0.9811 0.1935 0.1435 -0.7279 72.3077 -42.1382)" gradientUnits="userSpaceOnUse">
	<stop  offset="0.6107" style="stop-color:#00838F;stop-opacity:0"/>
	<stop  offset="1" style="stop-color:#00838F"/>
</radialGradient>
<path style="fill:url(#SVGID_13_);" d="M53.39,6.57c-0.37,1.54-1.23,2.95-3.78,4.07c-1.51,0.66-4.28,0.94-5.35,0.61
	c-5.96-1.82-2-5.45,0.96-4.52C48.21,7.67,50.22,7.56,53.39,6.57z"/>
<g>
	<path style="fill:#0277BD;" d="M62.45,73.91c-2.87,1.63-6.32,2.06-9.61,2c-3.32-0.07-6.62-0.63-9.81-1.62
		c-1.59-0.51-3.17-1.11-4.67-1.93c-0.77-0.42-1.45-0.85-2.14-1.28l-2.08-1.26c-2.75-1.71-5.56-3.37-8.34-5l0.62,0.09
		c-1.01,0.17-2.03,0.3-3.05,0.28c-1.02-0.01-2.03-0.12-3.02-0.31c-0.99-0.19-1.97-0.45-2.9-0.82c-0.94-0.36-1.83-0.77-2.72-1.32
		l0.36,0.06c-1.31,0.18-2.61,0.34-3.93,0.49l-1.97,0.19c-0.66,0.04-1.32,0.1-1.98,0.06c0.65-0.07,1.29-0.24,1.93-0.38l1.92-0.45
		l3.83-0.92l0.16-0.04l0.21,0.1c0.8,0.4,1.71,0.73,2.6,0.98c0.9,0.25,1.81,0.45,2.73,0.56c0.92,0.12,1.84,0.16,2.76,0.11
		c0.92-0.01,1.82-0.17,2.71-0.35l0.32-0.06l0.3,0.15c2.92,1.52,5.72,3.19,8.52,4.87l2.08,1.3c0.69,0.44,1.38,0.88,2.04,1.25
		c1.36,0.74,2.81,1.38,4.3,1.92c1.5,0.52,3.03,0.96,4.59,1.33c1.56,0.34,3.14,0.63,4.73,0.8C56.09,75.02,59.36,75.02,62.45,73.91z"
		/>
</g>`;
    const GENIUS_SVG_INNER_B = `<path style="fill:#0F3B7C;" d="M56.47,58.7c-5,0-10.7-1.5-16.9-4.6c-5.1-2.5-4.6-9-4.1-15.3c0-0.7,0.1-1.3,0.2-2v-0.2l-12.5-20.9
	c0.1-4.9,5-12,12.4-12c5.23,0,12.3,0,19.7,11.5c9,14.1,13.3,16,16.6,16c4.3,0,7.3-1.2,8.8-3.6c1.8-2.8,1.2-6.4,0.5-8.4
	c1.7,0.9,4.6,2.7,6.2,5.9c1.7,3.4,1.6,7.5-0.1,12.2c-3.1,8.6-13.92,11.57-13.92,11.57c-0.49,0.96-1.57,2.82-3.38,4.63
	C66.37,57,61.87,58.7,56.47,58.7z"/>
<radialGradient id="SVGID_1_" cx="69.8348" cy="25.1451" r="15.9112" gradientTransform="matrix(0.8673 0.4978 -0.3764 0.6558 18.7343 -26.111)" gradientUnits="userSpaceOnUse">
	<stop  offset="0.3641" style="stop-color:#00838F"/>
	<stop  offset="0.9697" style="stop-color:#00838F;stop-opacity:0"/>
</radialGradient>
<path style="fill:url(#SVGID_1_);" d="M65.24,38.36c-0.91-0.39-1.78-0.87-2.59-1.44c-3.33-2.33-5.54-6.02-6.66-9.92
	c-1.12-3.9-1.23-8.03-0.96-12.09l2.11,3.14c2.61,3.88,5.44,8,9.16,10.92c1.62,1.27,3.47,2.23,5.58,2.23c4.3,0,7.3-1.2,8.8-3.6
	c0.2-0.31,1.78-2.97,1.71-3.2c0.54,1.69,0.81,3.46,0.82,5.23c0,1.22-0.13,2.46-0.63,3.56c-0.45,0.99-1.18,1.84-1.99,2.57
	c-2.39,2.18-5.54,3.51-8.76,3.72C69.57,39.63,67.3,39.23,65.24,38.36z"/>
<radialGradient id="SVGID_2_" cx="63.4348" cy="31.1416" r="24.5954" gradientUnits="userSpaceOnUse">
	<stop  offset="0.5252" style="stop-color:#00838F;stop-opacity:0"/>
	<stop  offset="1" style="stop-color:#00838F"/>
</radialGradient>
<path style="fill:url(#SVGID_2_);" d="M87.37,25.1c-1.6-3.2-4.5-5-6.2-5.9c0.7,2,1.3,5.6-0.5,8.4c-1.5,2.4-4.5,3.6-8.8,3.6
	c-2.05,0-3.86-0.91-5.46-2.14c-1.04-0.8-16.76,7.37-19.41,9.81c0,0,1.13,5.84,8.52,9.49c8.43,4.17,26.4,1.77,31.76-11.06
	C89.19,32.69,89.07,28.5,87.37,25.1z"/>
<radialGradient id="SVGID_3_" cx="47.636" cy="28.0996" r="19.5026" gradientTransform="matrix(0.8359 -0.5488 0.777 1.1835 -14.0178 20.9892)" gradientUnits="userSpaceOnUse">
	<stop  offset="0.7228" style="stop-color:#00838F;stop-opacity:0"/>
	<stop  offset="1" style="stop-color:#00838F"/>
</radialGradient>
<path style="fill:url(#SVGID_3_);" d="M35.67,36.6l-12.5-20.9c0.1-4.9,5-12,12.4-12c5.23,0,12.3,0,19.7,11.5
	C58.08,19.6,35.67,36.6,35.67,36.6z"/>
<radialGradient id="SVGID_4_" cx="54.9118" cy="43.5516" r="20.7424" gradientUnits="userSpaceOnUse">
	<stop  offset="0.4299" style="stop-color:#00838F;stop-opacity:0"/>
	<stop  offset="1" style="stop-color:#00838F"/>
</radialGradient>
<path style="fill:url(#SVGID_4_);" d="M47,40.25c-0.53-0.7-1.03-1.81-1.53-3.2c-0.01,0-0.02,0-0.04,0.01
	c-1.92,0.39-3.84,0.8-5.74,1.3c-1.17,0.31-3.43,0.54-4.17,1.62c-1.13,1.66-0.42,6.22-0.08,8.09c0.48,2.57,1.71,4.83,4.12,6.03
	c6.2,3.1,11.9,4.6,16.9,4.6c5.4,0,9.9-1.7,13.5-5.2c0.84-0.84,2.99-2.9,3.19-4.56C66.82,51.08,56.12,52.3,47,40.25z"/>
<path style="display:none;fill:#004D40;" d="M61.82,43.01c-8.3-6.6-2.22-16.61-10.38-28.47c-5.89-8.56-14.2-5.37-15.9-3.53
	c-1.85,2.01,2.53,1.08,2.43,0.98c2.9,0.7,5.52,23.62,9.03,28.25c9.21,12.16,19.89,10.8,26.35,8.62c3.55-1.19,6.4-2.93,6.4-2.93
	C75.8,46.82,68.01,48.03,61.82,43.01z"/>
<path style="fill:#FCB316;" d="M34.37,5.5h0.4c2.2,0,3.9,1.8,3.8,4v0.4c0,2.2-1.8,3.9-4,3.8h-0.4c-2.2,0-3.9-1.8-3.9-4V9.3
	C30.37,7.2,32.17,5.4,34.37,5.5z"/>
<radialGradient id="SVGID_5_" cx="30.7957" cy="114.5459" r="57.2643" gradientUnits="userSpaceOnUse">
	<stop  offset="0.1112" style="stop-color:#29B6F6"/>
	<stop  offset="1" style="stop-color:#0277BD"/>
</radialGradient>
<path style="fill:url(#SVGID_5_);" d="M111.17,87.23c-1.61,1.17-13.65,3.19-6.15-1.04c4.93-2.78,7.47-12.01-3.68-14.8
	C89.93,68.56,77.74,88.46,76,92.63c-4.13,9.89-9.85,18.2-21.58,24.17c-10.49,5.35-20.28,5.85-32.53-0.08
	c-9.98-4.83-13.16-13.96-11.79-25.88c0.17-1.51,0.36-2.83,0.56-3.99c0.14-0.82,0.28-1.56,0.42-2.24c1.39-6.75,2.75-7.67,0.64-16.95
	l18.23-2.03l3.12-0.35l25.61-2.86c0,6.72-0.77,11.82-10.54,21.28c-3.88,3.76-10.54,6.96-11.9,11.89c-0.45,1.65-0.75,3.41,0.72,5.6
	c1.68,2.52,13.54,8.51,24.79-7.46c1.15-1.63,7.52-11.3,9.25-13.91c4.26-6.43,8.9-12.1,16-15.64C112,51.7,123.92,77.96,111.17,87.23z
	"/>
<linearGradient id="SVGID_6_" gradientUnits="userSpaceOnUse" x1="47.8866" y1="47.8666" x2="22.5485" y2="20.163" gradientTransform="matrix(1 0 0 -1 0 129.7795)">
	<stop  offset="0" style="stop-color:#005584;stop-opacity:0"/>
	<stop  offset="0.8412" style="stop-color:#005584"/>
</linearGradient>
<path style="fill:url(#SVGID_6_);" d="M37.79,79.63c-3.48,3.22-7.56,5.71-11.37,8.54s-7.45,6.11-9.57,10.35s-2.46,9.63,0.15,13.59
	c1.16,1.76,4.5,5.43,13.12,7.74c0,0-13.46-6.56-5.76-17.6c2.44-3.5,12.48-9.35,15.72-12.12s2.52-1.64,5.48-4.71
	c3.37-3.49,7.68-8.67,9.43-13.19c1.23-3.18,2.97-8.37-2.41-8.37S40.87,76.79,37.79,79.63z"/>
<linearGradient id="SVGID_7_" gradientUnits="userSpaceOnUse" x1="89.8861" y1="98.5025" x2="124.6302" y2="73.3863">
	<stop  offset="0" style="stop-color:#B28FFF"/>
	<stop  offset="0.4115" style="stop-color:#A880FF"/>
	<stop  offset="0.7921" style="stop-color:#8E5AFF"/>
	<stop  offset="1" style="stop-color:#6A26FF"/>
</linearGradient>
<path style="fill:url(#SVGID_7_);" d="M91.05,103.88c-0.61-0.2-1.31-0.42-1.49-0.78c-2.36-4.79-0.74-10.09,3.95-12.9
	c1.65-0.98,4.67-1.87,6.88-2.51c0.53-0.15,1.02-0.3,1.45-0.43c6.59-2.02,10.95-5.1,12.95-9.16c0.94-1.91,1.14-3.36,1.13-4.78
	c0.25,1.08,0.5,2.27,0.5,4.46c0,6.35-3.71,9.17-7.73,11.26c-2.2,1.15-4.47,1.58-6.87,2.03c-2.35,0.45-4.79,0.91-7.11,2.11
	c-2.33,1.21-3.8,2.77-4.35,4.66c-0.52,1.76-0.24,3.8,0.82,6.09C91.13,103.91,91.09,103.9,91.05,103.88z"/>
<linearGradient id="SVGID_8_" gradientUnits="userSpaceOnUse" x1="78.6181" y1="58.9683" x2="63.8231" y2="21.5879" gradientTransform="matrix(1 0 0 -1 0 129.7795)">
	<stop  offset="0" style="stop-color:#651FFF"/>
	<stop  offset="0.7047" style="stop-color:#5914F2"/>
	<stop  offset="1" style="stop-color:#530EEB"/>
</linearGradient>
<path style="fill:url(#SVGID_8_);" d="M49.23,119.06c3.15-3.02,10.55-10.57,13.37-18.86c6.64-19.59,9.45-22.73,13.71-27.5l0.07-0.08
	c4.77-5.57,10.3-9.01,16.02-10.62c-5.02,3.77-8.31,10.41-11.19,18.28c-2.86,7.84-6.11,16.74-12.89,26.01
	C64.04,112.14,56.66,116.93,49.23,119.06z"/>
<path style="fill:#B39DDB;" d="M49.24,118.98C64,109,71,92,76.82,76.67c1.04-2.59,2.27-5.09,3.66-7.49c1.39-2.4,2.94-4.71,4.59-6.94
	c0.86-1.15,1.84-2.23,2.91-3.22c1.09-0.97,2.28-1.85,3.56-2.58c2.58-1.44,5.53-2.26,8.49-2.29c2.97-0.02,5.9,0.75,8.49,2.12
	c2.57,1.39,4.91,3.38,6.36,6.04c0.74,1.32,1.18,2.83,1.37,4.25c0.21,1.44,0.23,2.9,0.09,4.33c-0.32,2.86-1.28,5.63-2.9,7.99
	c-0.81,1.17-1.82,2.22-2.87,3.11c-1.05,0.91-2.15,1.73-3.29,2.5c-2.28,1.52-4.68,2.92-7.29,3.71c1.26-0.52,2.43-1.21,3.55-1.96
	c1.13-0.74,2.22-1.55,3.26-2.4c2.05-1.72,4.16-3.49,5.4-5.75c1.29-2.24,1.98-4.81,2.08-7.36c0.11-2.53-0.31-5.18-1.54-7.2
	c-1.26-2.08-3.24-3.75-5.47-4.87s-4.74-1.68-7.21-1.63C97.59,57.07,95.16,57.77,93,59c-1.07,0.63-2.07,1.38-3.01,2.22
	c-0.91,0.87-1.77,1.8-2.55,2.81c-1.6,2.11-3.1,4.32-4.47,6.6c-0.01,0.02-0.03,0.05-0.04,0.07c-1.94,3.24-3.49,6.71-4.75,10.27
	c-5.26,14.93-12.97,27.91-27.06,37.11C50.54,118.46,49.93,118.83,49.24,118.98z"/>
<path style="fill:#039BE5;" d="M63.98,68.72l-6.28-0.11l-18.93-0.33l-1.24-0.03h-0.18l-2.04-0.04l-1.04-0.01l-1.22-0.02l-1.36-0.03
	H31.2l-1.3-0.03l-1.21-0.02l-14.5-0.26l-4.09-0.07c1.22-6.53,4.09-9.41,7.27-11c2.73-1.37,5.69-1.79,8.01-2.75
	c0.32-0.12,0.62-0.26,0.91-0.42c0.42-0.22,0.81-0.47,1.17-0.76c0.12-0.1,0.24-0.21,0.36-0.33c0.01,0,0.01,0,0.01,0
	c0-0.01,0.01-0.02,0.01-0.02c1.04-1.02,1.7-2.49,1.77-4.77l11.74-0.62c-0.14,2.65,0.73,4.3,2.2,5.44c0.07,0.06,0.14,0.11,0.21,0.16
	c0.17,0.12,0.35,0.24,0.53,0.35c0.45,0.26,0.93,0.5,1.45,0.72c0.31,0.12,0.62,0.24,0.95,0.35c0.27,0.1,0.55,0.19,0.84,0.27
	c0.04,0.02,0.08,0.03,0.12,0.04c0.15,0.05,0.3,0.09,0.45,0.14c0.08,0.02,0.16,0.04,0.25,0.06c1.62,0.46,3.37,0.85,5.1,1.38
	c0.25,0.08,0.52,0.17,0.81,0.27c0.62,0.2,1.24,0.44,1.85,0.7c0.21,0.1,0.4,0.18,0.57,0.26c0.06,0.02,0.12,0.05,0.18,0.08
	C60.5,59.1,63.48,62.19,63.98,68.72z"/>
<path style="opacity:0.35;fill:#212121;enable-background:new    ;" d="M46.87,87.3c-0.51,0.74-1.12,0.97-1.66,1
	c-0.63,0.03-1.16-0.23-1.28-0.3c-0.01,0-0.01-0.01-0.02-0.01c0,0-11.78-7.36-9.64-19.79c0.78-4.57,3.45-9.83,9.28-15.66
	c0.07,0.06,0.14,0.11,0.21,0.16c0.17,0.12,0.35,0.24,0.53,0.35c0.45,0.26,0.93,0.5,1.45,0.72c-0.28,0.34-0.96,1.14-1.78,2.2
	c-3.15,3.99-5.66,8.04-6.43,12.28c-0.31,1.69-0.34,3.41-0.02,5.18c1.03,5.62,4.83,9.49,7.06,11.91
	C45.51,86.27,46.87,87.28,46.87,87.3z"/>
<linearGradient id="SVGID_9_" gradientUnits="userSpaceOnUse" x1="37.1929" y1="71.13" x2="57.8201" y2="71.13">
	<stop  offset="0" style="stop-color:#651FFF"/>
	<stop  offset="0.7047" style="stop-color:#5914F2"/>
	<stop  offset="1" style="stop-color:#530EEB"/>
</linearGradient>
<path style="fill:url(#SVGID_9_);" d="M57.7,68.61c-0.12,1.38-0.34,2.69-0.7,3.81c-0.12,0.39-0.26,0.75-0.42,1.09
	c-0.67,1.43-1.63,2.87-2.6,4.26c-0.17,0.24-0.33,0.48-0.5,0.72l-0.32,0.46c-1.27,1.81-3.74,5.49-5.44,8.03l-1.25,1.86l-0.25,0.37
	c-0.25-0.21-0.59-0.52-1.01-0.91c-2.38-2.3-7.02-7.64-7.88-15.08c0-0.01,0-0.01,0-0.02c-0.16-1.37-0.18-2.74-0.06-4.13
	c0.02-0.27,0.05-0.54,0.08-0.82c0.57-5.01,2.89-10.11,6.94-15.2c0.45,0.26,0.93,0.5,1.45,0.72c0.31,0.12,0.62,0.24,0.95,0.35
	c0.27,0.1,0.55,0.19,0.84,0.27c0.04,0.02,0.08,0.03,0.12,0.04c0.14,0.05,0.29,0.1,0.45,0.14c0.08,0.02,0.16,0.04,0.25,0.06
	c1.62,0.46,3.37,0.85,5.1,1.38c0.25,0.08,0.52,0.17,0.81,0.27c0.75,0.25,1.36,0.5,1.85,0.7c0.21,0.1,0.4,0.18,0.57,0.26
	c0.06,0.02,0.12,0.05,0.17,0.07l0.01,0.01C57.3,58.18,58.13,63.78,57.7,68.61z"/>
<path style="fill:#FCB316;" d="M47.72,86.98l-1.25,1.86l-0.25,0.37l-0.3,0.44c-0.42-0.31-1.13-0.87-1.99-1.65
	c-0.01,0-0.01-0.01-0.02-0.01c-3.6-3.26-9.8-10.36-8.6-19.78c0.6-4.67,3.01-9.89,8.45-15.51c0.17,0.12,0.35,0.24,0.53,0.35
	c0.45,0.26,0.93,0.5,1.45,0.72c0.31,0.12,0.62,0.24,0.95,0.35c-0.34,0.41-0.87,1.06-1.49,1.85c-3.15,4-5.67,8.06-6.43,12.31
	c-0.31,1.68-0.34,3.39-0.02,5.15c1.03,5.62,4.83,9.49,7.06,11.91C46.44,85.96,47.25,86.61,47.72,86.98z"/>
<path style="opacity:0.35;fill:#212121;enable-background:new    ;" d="M33.05,68.18c-0.12,1.18-0.39,2.47-0.87,3.88
	c-1.88,5.47-5.07,14.59-21.52,14.79c0.01-0.09,0.03-0.17,0.04-0.25c0.03-0.17,0.06-0.34,0.09-0.5c0.1-0.53,0.19-1.02,0.29-1.49
	c0.42-0.48,1.03-0.87,1.89-0.94c10.99-1.15,14.41-6.8,16.12-11.8c0.45-1.31,0.7-2.56,0.81-3.75c0.09-0.87,0.1-1.71,0.05-2.49
	c-0.08-1.53-0.37-2.86-0.69-3.93c-0.06-0.21-0.14-0.51-0.24-0.87c-0.58-2.15-1.37-4.39-1.68-5.05c-0.35-0.74-0.78-1.62-1.05-2.18
	c0.42-0.22,0.81-0.47,1.17-0.76c0.12-0.1,0.24-0.21,0.36-0.33c0.01,0,0.01,0,0.01,0c0.01,0.01,0.03,0.02,0.04,0.04
	c2.44,2.08,3.83,6.86,4.26,8.29c0.37,1.24,0.79,2.7,0.94,4.44C33.15,66.17,33.16,67.13,33.05,68.18z"/>
<linearGradient id="SVGID_10_" gradientUnits="userSpaceOnUse" x1="7.13" y1="69.53" x2="31.2795" y2="69.53">
	<stop  offset="0" style="stop-color:#651FFF"/>
	<stop  offset="0.7047" style="stop-color:#5914F2"/>
	<stop  offset="1" style="stop-color:#530EEB"/>
</linearGradient>
<path style="fill:url(#SVGID_10_);" d="M31.2,68.15c-0.02,0.28-0.06,0.57-0.1,0.86c-0.16,1.13-0.42,2.3-0.84,3.51
	c-0.3,0.89-0.67,1.82-1.12,2.76c-2.33,4.86-7.01,10-18.35,10.82c-1.04,0.08-2.13,0.12-3.29,0.12c-0.12-0.01-0.25-0.01-0.37-0.01
	c0.51-0.65,1.13-1.58,1.78-2.7h0.01c1.04-1.79,2.19-4.07,3.1-6.42c0.72-1.86,1.3-3.78,1.57-5.53l0.02-0.14l0.03-0.16
	c0.18-1.16,0.35-2.3,0.55-3.42c0.51-2.99,1.16-5.89,2.35-8.79c0.03-0.08,0.09-0.26,0.18-0.51c0.12-0.35,0.4-1.19,0.65-1.77
	c2.73-1.37,5.69-1.79,8.01-2.75c0.32-0.12,0.62-0.26,0.91-0.42c0.42-0.22,0.81-0.47,1.17-0.76c1.42,2.13,2.34,5.54,2.78,7.18
	c0.09,0.33,0.16,0.6,0.22,0.8C31.01,62.66,31.47,65.21,31.2,68.15z"/>
<path style="fill:#FCB316;" d="M31.69,68.15c-0.12,1.41-0.42,2.93-0.96,4.52C28.97,77.83,25.01,85.6,10.7,86.6
	c-1.01,0.07-2.08,0.11-3.2,0.11c-0.29,0-0.57,0-0.86-0.01c0.19-0.21,1.62-2.03,2.27-3.19h0.01c0.55,0,1.44,0.11,2.85-0.01
	c10.99-1.15,14.41-6.8,16.12-11.8c0.43-1.25,0.68-2.46,0.8-3.6c0.28-2.63-0.13-4.92-0.63-6.57c-0.06-0.21-0.14-0.51-0.24-0.87
	c-0.58-2.15-1.37-4.39-1.68-5.05c-0.24-0.51-0.52-1.09-0.76-1.59c0.32-0.12,0.62-0.26,0.91-0.42c0.42-0.22,0.81-0.47,1.17-0.76
	c0.12-0.1,0.24-0.21,0.36-0.33c0.01,0,0.01,0,0.01,0c0-0.01,0.01-0.02,0.01-0.02c0.01,0.02,0.02,0.04,0.03,0.06
	c1.74,2.59,2.7,6.91,3.06,8.11C31.46,62.44,31.99,65.05,31.69,68.15z"/>
<path style="opacity:0.35;fill:#212121;enable-background:new    ;" d="M57,72.42c-0.12,0.39-0.26,0.75-0.42,1.09
	c-0.67,1.43-1.63,2.87-2.6,4.26c-5.95-0.09-12.27-1.93-16-4.27l-0.65-0.28l-0.99-0.43c-1.64,0.55-4.2,1.55-7.2,2.49
	c-5.2,1.63-11.74,3.09-17.12,1.81c0.72-1.86,1.3-3.78,1.57-5.53l0.02-0.14c2.37-1.75,12.59-2.45,13.01-2.45
	c0.13,0,1.93,0.02,4.48,0.04c1.79,0.02,3.95,0.04,6.17,0.06c6.14,0.06,12.67,0.13,12.67,0.13L57,72.42z"/>
<path style="fill:#4FC3F7;" d="M63.07,63.87c0.38,0.45,2.66,2.58,2.64,4.76c-0.02,1.79-0.76,4.07-3.25,5.28
	c-6.59,3.22-18.85,0.65-24.47-2.9c-6.99-4.4-11.74-6.99-11.74-6.99c-6.14,1.3-11.25-1.74-11.25-1.74s-6.67,1.28-7.78,1.25
	c-1.75-0.04-2.18-2.4-0.73-2.9c2.86-0.99,9.7-5.02,12.36-4.87c1.45,0.08,16.13,2.9,20.35,4.1c1.36,0.39,9.53,1.85,9.53,1.85"/>
<path style="fill:#4FC3F7;" d="M39.49,59.94c0,0,12.81-4.24,15.7-3.6c7.22,1.6,10.66,7.25,10.77,8.28c-0.4,1.21-2.99,1.99-5.55,1.36
	c-3.42-0.84-7.29-3.35-11.7-4.27C48.71,61.71,39.69,60.12,39.49,59.94z"/>
<g>
	<path style="fill:#0277BD;" d="M65.96,64.62c-0.11,0.61-0.65,1.09-1.19,1.4c-0.55,0.32-1.16,0.51-1.78,0.64
		c-1.25,0.22-2.56,0.18-3.83-0.28c-1.29-0.43-2.3-1.33-3.2-2.05c-0.89-0.76-1.68-1.29-2.53-1.32L53.09,63l-0.46,0
		c-0.31,0-0.63,0.01-0.93,0c-0.62-0.02-1.23-0.05-1.84-0.12c-1.21-0.16-2.4-0.33-3.57-0.61c-2.34-0.55-4.66-1.21-6.8-2.34
		c2.37,0.32,4.72,0.55,7.05,0.8c1.17,0.09,2.32,0.22,3.48,0.26c0.57,0.02,1.15,0.06,1.71,0.05c0.29,0.01,0.56-0.01,0.84-0.02
		L53,61.01l0.56,0c0.75,0.06,1.5,0.32,2.1,0.69c0.61,0.37,1.11,0.79,1.55,1.2c0.87,0.84,1.64,1.56,2.57,2.04
		c0.91,0.46,2.03,0.72,3.13,0.74c0.56,0.02,1.12-0.04,1.66-0.17C65.08,65.36,65.65,65.14,65.96,64.62z"/>
</g>
<path style="fill:#4FC3F7;" d="M36.73,70.23c-1.46,1.08-15.26,6.36-24.71,4.24c-2.19-0.49-5.15-1.1-5.84-3.69
	c-0.84-3.18,2.91-7.44,2.91-7.44l5.9-1.04l3.51,1.32c1.06,0.4,2.18,0.58,3.31,0.55l4.43-0.14C26.24,64.02,37.25,70.23,36.73,70.23z"
	/>
<g>
	<path style="fill:#0277BD;" d="M62.45,73.91c-2.87,1.63-6.32,2.06-9.61,2c-3.32-0.07-6.62-0.63-9.81-1.62
		c-1.59-0.51-3.17-1.11-4.67-1.93c-0.77-0.42-1.45-0.85-2.14-1.28l-2.08-1.26c-2.75-1.71-5.56-3.37-8.34-5l0.62,0.09
		c-1.01,0.17-2.03,0.3-3.05,0.28c-1.02-0.01-2.03-0.12-3.02-0.31c-0.99-0.19-1.97-0.45-2.9-0.82c-0.94-0.36-1.83-0.77-2.72-1.32
		l0.36,0.06c-1.31,0.18-2.61,0.34-3.93,0.49l-1.97,0.19c-0.66,0.04-1.32,0.1-1.98,0.06c0.65-0.07,1.29-0.24,1.93-0.38l1.92-0.45
		l3.83-0.92l0.16-0.04l0.21,0.1c0.8,0.4,1.71,0.73,2.6,0.98c0.9,0.25,1.81,0.45,2.73,0.56c0.92,0.12,1.84,0.16,2.76,0.11
		c0.92-0.01,1.82-0.17,2.71-0.35l0.32-0.06l0.3,0.15c2.92,1.52,5.72,3.19,8.52,4.87l2.08,1.3c0.69,0.44,1.38,0.88,2.04,1.25
		c1.36,0.74,2.81,1.38,4.3,1.92c1.5,0.52,3.03,0.96,4.59,1.33c1.56,0.34,3.14,0.63,4.73,0.8C56.09,75.02,59.36,75.02,62.45,73.91z"
		/>
</g>
<path style="fill:#039BE5;" d="M20.8,40.67c-1.06-0.23-2.92-0.81-4.21-2.16c-2.36-2.49-3.08-7.49-3.26-9.31
	c1.31,0.12,4.28,0.58,5.81,2.39L20.8,40.67z"/>
<path style="fill:#FCB316;" d="M18.04,38.42c-0.14,1.64-0.96,3.01-2.2,3.03c-1.24,0.03-2.27-1.3-2.3-2.95
	c-0.02-1.25,0.53-2.33,1.34-2.79l0.47,0.97c-0.41,0.28-0.76,0.95-0.74,1.81c0.02,1.14,0.65,1.92,1.21,1.91
	c0.56-0.01,1.16-0.81,1.15-1.95c-0.01-0.94-0.14-1.23-0.38-1.75c-0.39-0.88,0.26-1.56,0.88-0.7C17.47,36,18.17,36.84,18.04,38.42z"
	/>
<path style="fill:#039BE5;" d="M51.28,31.59c1.53-1.82,4.5-2.27,5.81-2.39c-0.18,1.82-0.9,6.82-3.26,9.31
	c-1.29,1.36-3.15,1.94-4.21,2.16L51.28,31.59z"/>
<path style="fill:#4FC3F7;" d="M34.93,52.22L34.93,52.22L34.93,52.22c8.4,0.1,16.3-8.8,16.5-21.7s-7.7-19.4-15.9-19.5
	s-16.3,6.1-16.5,19C18.83,43.02,26.53,52.12,34.93,52.22z"/>
<g>
	<path style="fill:#01579B;" d="M30.76,29.8c-0.31,0.28-0.79,0.09-1.23-0.08c-0.98-0.37-1.44-0.66-2.53-0.87
		c-0.91-0.17-2.05-0.22-2.94,0.05c-0.81,0.24-0.72-0.05-0.17-0.52c1.15-0.98,2.14-1.15,3.63-1.09C29.71,27.39,31.8,28.86,30.76,29.8
		z"/>
	<path style="fill:#01579B;" d="M39.7,29.8c0.31,0.28,0.79,0.09,1.23-0.08c0.98-0.37,1.44-0.66,2.53-0.87
		c0.91-0.17,2.05-0.22,2.94,0.05c0.81,0.24,0.72-0.05,0.17-0.52c-1.15-0.98-2.14-1.15-3.63-1.09C40.76,27.39,38.67,28.86,39.7,29.8z
		"/>
</g>
<path style="fill:#0277BD;" d="M37.11,38.19c-0.05-0.02-0.1-0.03-0.15-0.04l-3.42-0.05c-0.05,0.01-0.1,0.02-0.16,0.04
	c-0.31,0.12-0.49,0.44-0.35,0.78s0.81,1.31,2.18,1.33s2.07-0.93,2.22-1.27S37.41,38.32,37.11,38.19z"/>
<path style="fill:#4E342E;" d="M39.31,42.13c-1.55,0.89-6.6,0.82-8.12-0.12c-0.88-0.54-1.79,0.25-1.44,1.06
	c0.35,0.79,3.08,2.67,5.46,2.7s5.13-1.76,5.5-2.54C41.08,42.43,40.2,41.62,39.31,42.13z"/>
<path style="fill:#FCB316;" d="M52.95,36c0.62-0.86,1.27-0.18,0.88,0.7c-0.24,0.52-0.37,0.81-0.38,1.75
	c-0.01,1.14,0.59,1.94,1.15,1.95s1.19-0.77,1.21-1.91c0.02-0.86-0.33-1.53-0.74-1.81l0.47-0.97c0.81,0.46,1.36,1.54,1.34,2.79
	c-0.03,1.65-1.06,2.98-2.3,2.95c-1.24-0.02-2.06-1.39-2.2-3.03C52.25,36.84,52.95,36,52.95,36z"/>
<g>
	<circle style="fill:#212121;" cx="27.29" cy="33.6" r="2.38"/>
	<circle style="fill:#212121;" cx="43.17" cy="33.6" r="2.38"/>
</g>
<linearGradient id="SVGID_11_" gradientUnits="userSpaceOnUse" x1="106.0931" y1="18.7385" x2="102.1031" y2="6.9985" gradientTransform="matrix(1 0 0 -1 0 129.7795)">
	<stop  offset="0" style="stop-color:#651FFF"/>
	<stop  offset="0.7047" style="stop-color:#5914F2"/>
	<stop  offset="1" style="stop-color:#530EEB"/>
</linearGradient>
<path style="fill:url(#SVGID_11_);" d="M116.24,113.57c-5.58-0.89-5.1-2.6-5.63-4.19l-5.33-1.56c-1.22,1.05-2.38,3.23-6.97,0.99
	c-1.41-0.69-6.17-4.72-6.17-4.72l-3.59-0.91c0.46,0.42,4.37,5.45,7.7,9.66c4.16,5.27,6.65,6.25,8.48,6.78
	c2.74,0.8,5.92,0.4,5.92,0.4s5.34,0.58,9-0.76c3.8-1.39,5.53-4.9,5.53-4.9S118.76,113.81,116.24,113.57z M119.05,117.63
	c-1.38,0.5-3.06,0.7-4.54,0.76c1.28-0.93,2.13-2.06,2.66-2.98c1.02,0.09,2.51,0.23,4.71,0.42
	C121.16,116.52,120.22,117.21,119.05,117.63z"/>
<radialGradient id="SVGID_12_" cx="110.2044" cy="17.194" r="8.6992" gradientTransform="matrix(0.9726 -0.2326 -0.2175 -0.9094 6.1709 155.5807)" gradientUnits="userSpaceOnUse">
	<stop  offset="0.2716" style="stop-color:#FEBC12"/>
	<stop  offset="0.4999" style="stop-color:#FEA709"/>
	<stop  offset="0.809" style="stop-color:#FF9000"/>
</radialGradient>
<path style="fill:url(#SVGID_12_);" d="M121.88,115.84c-0.72,0.69-1.66,1.37-2.83,1.8c-1.38,0.5-3.06,0.7-4.54,0.76
	c1.08-0.79,2.13-2.16,2.66-2.98c-3,0.16-6.87-0.14-10.79-1.29c-7.36-2.16-13.58-8.93-14.64-10.14l-3.19-0.81
	c0.46,0.42,4.37,5.45,7.7,9.66c2.81,3.55,4.85,5.15,6.45,5.98c-3.41-0.11-5.44,1.97-5.44,1.97l13.17,3.86c0,0-0.59-2.87-3.56-4.62
	c2.03,0.22,3.78,0,3.78,0s5.34,0.58,9-0.76c3.8-1.39,5.53-4.9,5.53-4.9L121.88,115.84L121.88,115.84z"/>
<radialGradient id="SVGID_13_" cx="106.6601" cy="28.7624" r="3.7747" gradientTransform="matrix(0.9596 0.2812 0.2812 -0.9596 -0.3884 99.3682)" gradientUnits="userSpaceOnUse">
	<stop  offset="0" style="stop-color:#FEBC12"/>
	<stop  offset="1" style="stop-color:#FF8F00"/>
</radialGradient>
<path style="fill:url(#SVGID_13_);" d="M108.34,104.94l-3.27,3.12l5.65,1.66l-1.5-4.48l1.16-0.95c0.33-0.27,0.5-0.68,0.46-1.1
	l-0.21-2.42c-0.04-0.48-0.64-0.68-0.96-0.31l-1.61,1.85c-0.31,0.35-0.4,0.85-0.23,1.29C107.83,103.6,108.34,104.94,108.34,104.94z"
	/>
<radialGradient id="SVGID_14_" cx="106.6134" cy="8.4024" r="4.3859" gradientTransform="matrix(0.9596 0.2812 0.2812 -0.9596 -0.3884 99.3682)" gradientUnits="userSpaceOnUse">
	<stop  offset="0" style="stop-color:#FEF59F"/>
	<stop  offset="0.9044" style="stop-color:#FAC537"/>
	<stop  offset="1" style="stop-color:#F9BF2C"/>
</radialGradient>
<polygon style="fill:url(#SVGID_14_);" points="110.04,123.59 98.19,120.11 99.67,119.33 109.18,122.12 "/>
<path style="fill:#0D47A1;" d="M35.16,9.25c-11.64,0-15.95,7.33-17.38,15.49c-0.87,4.97,0.79,9.59,1.59,10.87
	c-0.3-3.1,1.7-13.2,4.6-15.8l11.3,6.4l11.3-6.4c2.9,2.5,4.8,12.6,4.6,15.8c0.68-1.67,2.65-5.2,1.33-11.42
	C50.56,15.04,46.61,9.25,35.16,9.25z"/>
<radialGradient id="SVGID_15_" cx="34.9334" cy="26.2298" r="18.31" gradientUnits="userSpaceOnUse">
	<stop  offset="0.6107" style="stop-color:#00838F;stop-opacity:0"/>
	<stop  offset="1" style="stop-color:#00838F"/>
</radialGradient>
<path style="fill:url(#SVGID_15_);" d="M35.16,9.25c-11.64,0-15.95,7.33-17.38,15.49c-0.87,4.97,0.79,9.59,1.59,10.87
	c-0.3-3.1,1.7-13.2,4.6-15.8l11.3,6.4l11.3-6.4c2.9,2.5,4.8,12.6,4.6,15.8c0.68-1.67,2.65-5.2,1.33-11.42
	C50.56,15.04,46.61,9.25,35.16,9.25z"/>`;

    function prefixSvgIds(svgInner, prefix) {
      return svgInner
        .replace(/id="([^"]+)"/g, (m, id) => `id="${prefix}-${id}"`)
        .replace(/url\(#([^)]+)\)/g, (m, id) => `url(#${prefix}-${id})`);
    }

    function createGeniusStimulus(type, includeAnimation = true, size = 150) {
      const isB = (type === 'B');
      const glowColor = isB ? '#fb3f7f' : '#3fb1ff';
      const prefix = `genius-${type}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

      const inner = isB ? GENIUS_SVG_INNER_B : GENIUS_SVG_INNER_A;
      const patchedInner = prefixSvgIds(inner, prefix);

      return `
        <svg xmlns="http://www.w3.org/2000/svg"
             width="${size}" height="${size}" viewBox="0 0 128 128"
             style="overflow: visible; filter: drop-shadow(0 0 ${size * 0.05}px ${glowColor});"
             aria-label="${isB ? 'Genio B' : 'Genio A'}">
          ${patchedInner}
        </svg>
      `;
    }


    // === FUNCIÓN PARA ACTUALIZAR INSTRUCCIONES SEGÚN TIPO DE ESTÍMULO ===
    function updateInstructionsBasedOnStimulus() {
      const stimulusType = document.getElementById('stimulusTypeSelect').value;
      const instructionsDiv = document.getElementById('instructions');
      
      // Obtener referencias a los elementos que queremos actualizar
      const paragraphs = instructionsDiv.querySelectorAll('p');
      const showcaseTitle = document.getElementById('showcase-title');
      const previewDiv = document.getElementById('preview-machines');
      
      if (stimulusType === 'genios') {
        // Actualizar solo los párrafos de texto
        paragraphs[0].innerHTML = 'Cada vez que le des a uno de estos dos genios con  (pulsando ← o →) puede darte o quitarte dinero.';
        paragraphs[1].innerHTML = 'Uno de los dos genios suele dar dinero <strong>con más frecuencia</strong> que el otro, pero durante la prueba pueden intercambiarse sin avisar una o más veces';
        paragraphs[2].innerHTML = 'Tu objetivo es <strong>ganar el máximo dinero posible</strong>.';
        paragraphs[4].innerHTML = '<strong>Controles:</strong> Tecla "A" o ← para elegir el genio izquierdo, "L" o → para elegir el genio derecho.';
        
        // Actualizar título del showcase
        if (showcaseTitle) {
          showcaseTitle.textContent = 'Versión de Prueba:';
        }
      } else if (stimulusType === 'peces') {
        // Actualizar solo los párrafos de texto para peces
        paragraphs[0].innerHTML = 'Estás en un concurso de pesca deportiva, puedes elegir en qué lado del lago intentas pescar.';
        paragraphs[1].innerHTML = 'En los dos lados hay peces, pero hay un banco de peces que puede refugiarse en un lado o en el otro. Durante la prueba puede cambiar de lado una o más veces sin avisar.';
        paragraphs[2].innerHTML = 'Tu objetivo es <strong>pescar el máximo número de peces</strong>.';   
        paragraphs[4].innerHTML = '<strong>Controles:</strong> Tecla "A" o ← para pescar en el lado izquierdo, "L" o → para pescar en el lado derecho.';
        
        // Actualizar título del showcase
        if (showcaseTitle) {
          showcaseTitle.textContent = 'El Lago de Pesca';
        }
      } else {
        // Fallback genérico
        paragraphs[0].innerHTML = 'Selecciona una de estas opciones, con cada intento podrás ganar o perder dinero.';
        paragraphs[1].innerHTML = 'Una de estas dos opciones da premio <strong>con más frecuencia</strong> que la otra.';
        paragraphs[2].innerHTML = 'Tu objetivo es <strong>ganar el máximo dinero posible</strong> seleccionando la que creas que es más rentable.';
        paragraphs[3].innerHTML = '¡Ojo! Durante la prueba <strong>puede cambiar</strong> qué opción es más rentable sin avisar. Necesitarás adaptarte.';
        paragraphs[4].innerHTML = '<strong>Controles:</strong> Tecla "A" o ← para elegir la opción izquierda, "L" o → para elegir la opción derecha.';
        
        if (showcaseTitle) {
          showcaseTitle.textContent = 'Estímulos';
        }
      }
    }

      // Agregar event listener para el selector de tipo de estímulo
      document.addEventListener('DOMContentLoaded', () => {
        const stimulusTypeSelect = document.getElementById('stimulusTypeSelect');
        if (stimulusTypeSelect) {
          stimulusTypeSelect.addEventListener('change', updateInstructionsBasedOnStimulus);
        }
      });


    
// ========================================================================
// SECCIÓN 4: SELECTORES DE ELEMENTOS DEL DOM
// ========================================================================
// Referencias a elementos HTML que se manipulan durante la tarea.

    const stimuliDiv = document.getElementById('stimuli');           // Contenedor de estímulos (genios/lago)
    const startBtn = document.getElementById('start-btn');           // Botón de inicio de tarea
    const feedbackDiv = document.getElementById('feedback');         // Div de feedback (+5€ / -5€)
    const resultsDiv = document.getElementById('results');           // Div de resultados finales
    const instructions = document.getElementById('instructions');    // Div de instrucciones
    const probScheduleSelect = document.getElementById('probScheduleSelect');             // Selector de probabilidad
    const feedbackDurationSelect = document.getElementById('feedbackDurationSelect');     // Selector de duración de feedback
    const fixationCross = document.getElementById('fixation-cross'); // Cruz de fijación



    

    // Generar preview según el selector (inicialización)
    updateInstructionsBasedOnStimulus();

// ========================================================================
// SECCIÓN 5: SISTEMA DE PRÁCTICA INTERACTIVO (PREVIEW)
// ========================================================================
// Sistema de demostración interactiva que permite al participante
// familiarizarse con la tarea antes de comenzar los ensayos reales.

    (function() {
      const previewMachines = document.getElementById('preview-machines');
      const previewFeedback = document.getElementById('preview-feedback');
      const previewFixation = document.getElementById('preview-fixation');
      const instructions = document.getElementById('instructions');
      
      let previewBlocked = false;
      let previewTimeoutId = null;
      let previewHasStarted = false; // se activa tras la 1ª elección para evitar timeouts en reposo

      function getPreviewDeadlineMs() {
        const sel = document.getElementById('responseDeadlineSelect');
        if (!sel) return 6000;
        if (sel.value === 'none') return null;
        const ms = parseInt(sel.value, 10);
        return (isFinite(ms) && ms > 0) ? ms : 6000;
      }

      function updatePreviewDeadlineHint() {
        const hint = document.getElementById('preview-deadline-hint');
        if (!hint) return;
        const ms = getPreviewDeadlineMs();
        if (ms === null) {
          hint.textContent = 'Tiempo máximo de respuesta: sin límite';
        } else {
          hint.textContent = `Tiempo máximo de respuesta: ${(ms/1000).toFixed(1).replace('.', ',')} s`;
        }
      }

      function stopPreviewTimer() {
        if (previewTimeoutId !== null) {
          clearTimeout(previewTimeoutId);
          previewTimeoutId = null;
        }
      }

      function armPreviewTimer() {
        stopPreviewTimer();
        if (!previewHasStarted) return;
        if (!instructions || instructions.style.display === 'none') return;
        const ms = getPreviewDeadlineMs();
        if (ms === null) return;

        previewTimeoutId = setTimeout(() => {
          // Omission en preview: mostrar mensaje 1 vez y pausar el preview hasta nueva tecla
          if (previewBlocked) return;
          previewBlocked = true;
          previewHasStarted = false; // pausa
          previewFeedback.className = 'omission';
          previewFeedback.textContent = '⏰ ¡Muy lento!';

          const fbSel = document.getElementById('feedbackDurationSelect');
          const fbMs = fbSel ? (parseInt(fbSel.value) || 750) : 750;

          setTimeout(() => {
            previewFeedback.textContent = '';
            previewFeedback.className = '';
            previewBlocked = false;
            stopPreviewTimer();
          }, fbMs);
        }, ms);
      }

      // Exponer un stop global para limpiar timers al iniciar la tarea real
      window.__previewStop__ = function() {
        previewHasStarted = false;
        stopPreviewTimer();
      };

      
      // Inicializar con genios UNICODE (no SVG)
      function initPreviewStimuli() {
        previewMachines.innerHTML = `
          <div class="stimulus-preview" data-choice="A">
            ${createPracticeMachine('A', 80)}
            <p style="margin: 5px 0; font-size: 12px; text-align: center;">← Tecla A</p>
          </div>
          <div class="stimulus-preview" data-choice="B">
            ${createPracticeMachine('B', 80)}
            <p style="margin: 5px 0; font-size: 12px; text-align: center;">Tecla L →</p>
          </div>
        `;
      }
      
      initPreviewStimuli();
      updatePreviewDeadlineHint();

      const deadlineSel = document.getElementById('responseDeadlineSelect');
      if (deadlineSel) {
        deadlineSel.addEventListener('change', updatePreviewDeadlineHint);
      }

      
      // Actualizar cuando cambie el tipo de estímulo
      const stimulusTypeSelect = document.getElementById('stimulusTypeSelect');
      if (stimulusTypeSelect) {
        stimulusTypeSelect.addEventListener('change', function() {
          if (instructions.style.display === 'none') return;
          initPreviewStimuli();
          updatePreviewDeadlineHint();
        });
      }
      
      // Escuchar teclas
      document.addEventListener('keydown', function(e) {
        if (!instructions || instructions.style.display === 'none') return;
        if (previewBlocked) return;
        
        let choice = null;
        if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
          choice = 'A';
          e.preventDefault();
        } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'l') {
          choice = 'B';
          e.preventDefault();
        }
        
        if (choice) {
          stopPreviewTimer();
          runPreviewTrial(choice);
        }
      });

      // Escuchar taps/clicks (móvil/tablet)
      previewMachines.addEventListener('pointerdown', function(e) {
        if (!instructions || instructions.style.display === 'none') return;
        if (previewBlocked) return;
        const el = e.target.closest('.stimulus-preview');
        if (!el) return;
        const choice = el.getAttribute('data-choice');
        if (!choice) return;
        e.preventDefault();
        stopPreviewTimer();
        runPreviewTrial(choice);
      }, { passive: false });

      function runPreviewTrial(choice) {
        previewBlocked = true;
        previewHasStarted = true;

        
        // Animación de selección con recuadro azul
        const stimuli = previewMachines.querySelectorAll('.stimulus-preview');
        const selectedIndex = choice === 'A' ? 0 : 1;
        const selectedStimulus = stimuli[selectedIndex];
        
        if (selectedStimulus) {
          selectedStimulus.style.boxShadow = '0 0 0 4px #3b82f6';
          selectedStimulus.style.transform = 'translateY(-3px)';
          setTimeout(() => {
            selectedStimulus.style.boxShadow = '';
            selectedStimulus.style.transform = '';
          }, 200);
        }
        
        // Probabilidad 70/30: A tiene 70%, B tiene 30%
        const prob = choice === 'A' ? 0.7 : 0.3;
        const isPositive = Math.random() < prob;
        const feedbackDurationSelect = document.getElementById('feedbackDurationSelect');
        const feedbackDuration = feedbackDurationSelect ? parseInt(feedbackDurationSelect.value) : 750;
        
        // Mostrar feedback después de la animación
        setTimeout(() => {
          previewFeedback.className = isPositive ? 'correct' : 'incorrect';
          previewFeedback.textContent = isPositive ? '+5€' : '−5€';
          
          // Ocultar feedback y mostrar cruz de fijación
          setTimeout(() => {
            previewFeedback.textContent = '';
            previewFeedback.className = '';
            
            // MOSTRAR CRUZ DE FIJACIÓN con fade de los estímulos
            previewMachines.style.opacity = '0.3';
            previewFixation.style.display = 'block';
            
            // Duración aleatoria de la cruz (igual que en la tarea real)
            const fixationDuration = 500 + Math.random() * 500;
            setTimeout(() => {
              previewFixation.style.display = 'none';
              previewMachines.style.opacity = '1';
              previewBlocked = false;
              armPreviewTimer();
            }, fixationDuration);
            
          }, feedbackDuration);
        }, 200);
      }
    })();

// ========================================================================
// SECCIÓN 1: VARIABLES GLOBALES Y CONSTANTES
// ========================================================================
// Esta sección contiene todas las variables de estado de la tarea y 
// constantes de configuración que controlan el comportamiento del experimento.

    // --- Variables de Progreso y Puntuación ---
    let coins = 0;                          // Puntos acumulados del participante
    let trialCount = 0;                     // Contador de ensayos completados (0 a maxTrials-1)
    let maxTrials;                          // Número total de ensayos planificados
    let omissions = 0;                      // Contador de ensayos sin respuesta
    
    // --- Variables de Estímulos y Respuestas ---
    let correctStimulus = null;             // Estímulo correcto actual ('A' o 'B')
    let prevCorrectStimulus = null;         // Estímulo correcto previo (antes de reversión)
    let trials = [];                        // Array maestro con datos de todos los ensayos
    let trialStartTime;                     // Timestamp del inicio del ensayo actual
    let responseBlocked = true;             // Flag para bloquear respuestas durante transiciones
    let stimulusTimeoutId = null;           // ID del temporizador de deadline de respuesta
    
    // --- Variables de Reversión (Sistema Refactorizado) ---
    let reversalBlock = 0;                  // Bloque de aprendizaje actual (incrementa con cada reversión)
    let isReversalTrial = false;            // TRUE solo en el ensayo exacto de reversión
    let reversalPhase = false;              // TRUE a partir de la primera reversión (ambos modos)
    let isReversalPhase = false;            // Flag legacy de fase de reversión (mantener compatibilidad)
    let reversalTrial;                      // Ensayo de reversión en modo predetermined
    let reversalMode = 'predetermined';     // Modo de reversión: 'predetermined' o 'criterion'
    
    // --- Registro de Elecciones Correctas por Bloque ---
    // Necesario para calcular errores regresivos
    let correctChoicesInBlock = new Set();  // Set de ensayos donde hubo elección correcta en el bloque actual
    
    // --- Variables de Aprendizaje y Criterio ---
    let hasMadeCorrectInThisPhase = false;  // Si se ha acertado al menos una vez en la fase actual
    let performanceWindow = [];             // Ventana deslizante de aciertos recientes
    let windowSize;                         // Tamaño de ventana para criterio (ej: 10 ensayos)
    let accuracyThreshold;                  // Umbral de aciertos para criterio (ej: 8/10)
    let firstLearningTrial = null;          // Ensayo donde se alcanzó criterio inicial
    let reversalLearningTrial = null;       // Ensayo donde se alcanzó criterio en reversión
    let criterionReached = false;           // Si se alcanzó el criterio en la fase actual

    // --- Variables de Modo Criterio ---
    let reversalCount = 0;                  // Contador de reversiones en modo criterio
    let reversalData = [];                  // Array con datos de cada reversión en modo criterio
    let currentReversalErrors = 0;          // Errores en la reversión actual
    let currentReversalTrials = 0;          // Ensayos desde la última reversión
    let isFirstReversalTrial = false;       // Flag legacy (deprecado, usar isReversalTrial)
    
    // --- Constantes de Temporización (ms) ---
    let STIMULUS_TIMEOUT_MS = 6000;         // Deadline de respuesta (se actualiza según selector)
    let FEEDBACK_MS = 750;                  // Duración del feedback (se actualiza según selector)
    const SELECTION_ANIMATION_MS = 200;     // Duración de animación de selección
    const FIXATION_MIN_MS = 500;            // Duración mínima de cruz de fijación
    const FIXATION_MAX_MS = 1000;           // Duración máxima de cruz de fijación
    
    // --- Variables de Probabilidad de Feedback ---
    let feedbackProbability = 0.7;          // Probabilidad de feedback veraz (70% por defecto)
    
    // --- Variables para Bloque de Práctica ---
    let isPracticeMode = true;              // Flag de modo práctica
    let practiceTrialCount = 0;             // Contador de ensayos de práctica
    const MAX_PRACTICE_TRIALS = 10;         // Número de ensayos de práctica
    let practiceCorrectStimulus = 'A';      // Primera práctica siempre A
    let practiceSequence = [];              // Secuencia predeterminada de feedback para práctica
    let practiceInstruction = '';           // Instrucción actual mostrada en práctica
    let practiceVerificationActive = false; // Si está activa verificación en práctica

    // --- Urnas de Feedback (Sistema Determinístico Balanceado) ---
    // Se mantienen urnas separadas para elecciones correctas e incorrectas
    // para asegurar proporciones exactas de feedback veraz/engañoso
    let feedbackUrnLearningCorrect = [];    // Urna para respuestas correctas en fase inicial
    let feedbackUrnLearningIncorrect = [];  // Urna para respuestas incorrectas en fase inicial
    let feedbackUrnReversalCorrect = [];    // Urna para respuestas correctas en fase reversión
    let feedbackUrnReversalIncorrect = [];  // Urna para respuestas incorrectas en fase reversión
    
    // --- Variable de Auditoría: Cambios de Foco de Ventana ---
    let windowFocusChanges = 0;             // Contador de veces que el usuario sale/vuelve a la ventana

// ========================================================================
// SECCIÓN 2: MANEJADORES DE EVENTOS DE VENTANA (Auditoría)
// ========================================================================
// Rastrear cuántas veces el participante cambia el foco de la ventana
// (minimiza, cambia de pestaña, etc.) durante la tarea para control de calidad.

    /**
     * Manejador de evento blur: se dispara cuando la ventana pierde el foco.
     * Incrementa el contador de cambios de foco para auditoría.
     */
    window.addEventListener('blur', function() {
      windowFocusChanges++;
      console.log(`⚠️ Ventana perdió foco (cambio #${windowFocusChanges})`);
    });

    /**
     * Manejador de evento focus: se dispara cuando la ventana recupera el foco.
     * Se registra pero no incrementa contador (ya se contó en blur).
     */
    window.addEventListener('focus', function() {
      console.log(`✅ Ventana recuperó foco (total cambios: ${windowFocusChanges})`);
    });

// ========================================================================
// SECCIÓN 3: FUNCIONES DE GENERACIÓN DE URNAS DE FEEDBACK
// ========================================================================
// Sistema determinístico para asegurar proporciones exactas de feedback
// veraz vs. engañoso, manteniendo urnas separadas por corrección de respuesta.
       /**
        * Crea una urna con feedback balanceado.
        * @param {number} size - Tamaño máximo estimado de la urna (usaremos ventanas más pequeñas)
        * @param {number} probability - Probabilidad de feedback coherente (0.7 = 70%)
        * @param {boolean} forceFirstCoherent - Si el primer elemento debe ser coherente
        * @returns {Array} Urna con valores true (coherente) y false (engañoso)
        */
       function createFeedbackUrn(size, probability, forceFirstCoherent = false) {
        const urn = [];
        
        // Crear urna con ventanas pequeñas para mejor balance
        // Usamos ventanas de 10 trials para mantener proporción local
        const windowSize = 10;
        const numWindows = Math.ceil(size / windowSize);
        
        for (let w = 0; w < numWindows; w++) {
          const windowTrials = Math.min(windowSize, size - w * windowSize);
          if (windowTrials <= 0) break;
          
          let coherentCount = Math.round(windowTrials * probability);
          
          // Si es la primera ventana y forzamos coherente, ajustar
          if (w === 0 && forceFirstCoherent && windowTrials > 0) {
            urn.push(true);
            coherentCount = Math.max(0, coherentCount - 1);
            const remaining = windowTrials - 1;
            for (let i = 0; i < coherentCount; i++) urn.push(true);
            for (let i = 0; i < remaining - coherentCount; i++) urn.push(false);
          } else {
            // Llenar ventana normal
            for (let i = 0; i < coherentCount; i++) urn.push(true);
            for (let i = 0; i < windowTrials - coherentCount; i++) urn.push(false);
          }
          
          // Mezclar solo esta ventana
          const startIdx = (w === 0 && forceFirstCoherent) ? w * windowSize + 1 : w * windowSize;
          const endIdx = Math.min((w + 1) * windowSize, urn.length);
          for (let i = endIdx - 1; i > startIdx; i--) {
            const j = Math.floor(Math.random() * (i - startIdx + 1)) + startIdx;
            [urn[i], urn[j]] = [urn[j], urn[i]];
          }
        }
        
        return urn;
      }
      
      /**
       * Extrae feedback de la urna apropiada según si la elección fue correcta o incorrecta.
       * @param {boolean} trueCorrect - Si la elección del paciente fue correcta
       * @returns {boolean} Si el feedback mostrado será positivo (true) o negativo (false)
       */
      function drawFromUrn(trueCorrect) {
        // Seleccionar la urna correcta según fase y corrección de la elección
        let urn;
        if (isReversalPhase) {
          urn = trueCorrect ? feedbackUrnReversalCorrect : feedbackUrnReversalIncorrect;
        } else {
          urn = trueCorrect ? feedbackUrnLearningCorrect : feedbackUrnLearningIncorrect;
        }
        
        // Si la urna está vacía, rellenarla con nueva ventana balanceada
        if (urn.length === 0) {
          console.warn('⚠️ Urna vacía, rellenando con ventana balanceada...');
          const windowSize = 10;
          // Siempre usamos feedbackProbability para "coherente" (veraz)
          // Para ambas urnas, coherente=70%, engañoso=30%
          const probability = feedbackProbability;
          
          const coherentCount = Math.round(windowSize * probability);
          for (let i = 0; i < coherentCount; i++) urn.push(true);
          for (let i = 0; i < windowSize - coherentCount; i++) urn.push(false);
          
          // Mezclar
          for (let i = urn.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [urn[i], urn[j]] = [urn[j], urn[i]];
          }
        }
        
        // Extraer elemento (shift para primer trial de reversión, pop para el resto)
        const giveTruthful = isFirstReversalTrial ? urn.shift() : urn.pop();
        
        if (isFirstReversalTrial) {
          isFirstReversalTrial = false;
        }
        
        // giveTruthful indica si damos feedback coherente con la realidad
        // trueCorrect indica si la elección fue realmente correcta
        // Si giveTruthful=true y trueCorrect=true → mostrar feedback positivo (true)
        // Si giveTruthful=true y trueCorrect=false → mostrar feedback negativo (false)
        // Si giveTruthful=false → invertir el feedback (engañoso)
        return giveTruthful ? trueCorrect : !trueCorrect;
      }

      // Variable global para almacenar el método de aleatorización seleccionado
      // Valores válidos:
      //   - 'urn': Método de urna balanceada (estándar) - asegura proporción correcta en ventanas
      //   - 'denouden': Método de pseudoaleatorización den Ouden - sin rachas >3 consecutivas
      // Se establece al inicio de la tarea desde el selector HTML 'randomizationMethodSelect'
      let randomizationMethod = 'urn'; // Por defecto: método de urna balanceada

      /**
       * Función wrapper que llama al método de feedback apropiado según la configuración
       */
      function getFeedback(trueCorrect) {
        if (randomizationMethod === 'denouden') {
          return drawFromDenOudenDeck(trueCorrect);
        } else {
          return drawFromUrn(trueCorrect);
        }
      }


        //final FUNCIÓN DE URNA - BALANCEADA POR ESTÍMULO (CORRECTO/INCORRECTO)

        // PRÁCTICA: 10 secuencias pseudo-aleatorias para A (7 premios/10) y B (3 premios/10)
        // Total 10 sequences para mantener proporción ~70/30
        const PRACTICE_SEQUENCES_A = [
          [1, 1, 1, 0, 1, 1, 0, 1, 1, 0], // seq 1: 7/10
          [1, 1, 0, 1, 1, 1, 0, 1, 0, 1], // seq 2: 7/10
          [1, 0, 1, 1, 1, 0, 1, 1, 0, 1], // seq 3: 7/10
          [1, 1, 1, 1, 0, 1, 0, 1, 0, 1], // seq 4: 7/10
          [0, 1, 1, 1, 1, 0, 1, 1, 0, 1], // seq 5: 7/10
          [1, 1, 0, 1, 1, 1, 1, 0, 1, 0], // seq 6: 7/10
          [1, 0, 1, 1, 0, 1, 1, 1, 1, 0], // seq 7: 7/10
          [1, 1, 1, 0, 1, 0, 1, 1, 1, 0], // seq 8: 7/10
          [0, 1, 1, 1, 0, 1, 1, 1, 0, 1], // seq 9: 7/10
          [1, 1, 1, 1, 0, 1, 1, 0, 0, 1]  // seq 10: 7/10
        ];
        
        const PRACTICE_SEQUENCES_B = [
          [0, 0, 0, 1, 0, 0, 1, 0, 0, 1], // seq 1: 3/10
          [0, 0, 1, 0, 0, 0, 1, 0, 1, 0], // seq 2: 3/10
          [0, 1, 0, 0, 0, 1, 0, 0, 1, 0], // seq 3: 3/10
          [0, 0, 0, 0, 1, 0, 1, 0, 1, 0], // seq 4: 3/10
          [1, 0, 0, 0, 0, 1, 0, 0, 1, 0], // seq 5: 3/10
          [0, 0, 1, 0, 0, 0, 0, 1, 0, 1], // seq 6: 3/10
          [0, 1, 0, 0, 1, 0, 0, 0, 0, 1], // seq 7: 3/10
          [0, 0, 0, 1, 0, 1, 0, 0, 0, 1], // seq 8: 3/10
          [1, 0, 0, 0, 1, 0, 0, 0, 1, 0], // seq 9: 3/10
          [0, 0, 0, 0, 1, 0, 0, 1, 1, 0]  // seq 10: 3/10
        ];
        
        // Seleccionar una secuencia aleatoria al inicio
        let selectedPracticeSeqIdx = Math.floor(Math.random() * PRACTICE_SEQUENCES_A.length);
        const PRACTICE_SEQ_A = PRACTICE_SEQUENCES_A[selectedPracticeSeqIdx];
        const PRACTICE_SEQ_B = PRACTICE_SEQUENCES_B[selectedPracticeSeqIdx];


    // === FUNCIONES PARA BLOQUE DE PRÁCTICA ===
    function initializePracticeSequence() {
      // Secuencia: [true, true, true, false, true]
      // Esto significa: correcto da verde, correcto da verde, correcto da verde, correcto da rojo (misleading), correcto da verde

      //esta es la definiciónanterior, la dejo por si se usa en e´codigo para no romperlo
      practiceSequence = [true, true, true, false, true];
      practiceCorrectStimulus = 'A'; // Siempre A es correcto en práctica
    }

    

    function updatePracticeInstruction() {
      const instructionP = document.getElementById('practice-instruction');
      if (practiceTrialCount === 0) {
        instructionP.textContent = 'Elige un genio';
      } else if (practiceTrialCount === 5) {
        instructionP.textContent = 'Recuerda: el "bueno" a veces quita dinero y el "malo" a veces da dinero';
      }
    }

    function handlePracticeChoice(choice) {


      //lógica test
            // --- Verificación post-práctica: usar mismos estímulos y la misma entrada (teclado/click) ---
      if (practiceVerificationActive === true) {
        responseBlocked = true;
        clearTimeout(stimulusTimeoutId);
      
        const acertada = (choice === practiceCorrectStimulus);  // en práctica, 'A' es la "buena"
        if (acertada) {
          // Mensaje y habilitar SPACE para empezar (reutiliza la lógica ya existente en checkKey)
          const header = document.getElementById('practice-header');
          header.style.display = 'block';
          document.getElementById('practice-instruction').innerHTML =
            '<div style="font-size: 1.1rem; line-height: 1.8; text-align: center;">' +
            '<strong>Recuerda:</strong><br>' +
			'- Intenta ganar el máximo dinero posible. <br>' +
            '- Uno de los genios da dinero con más frecuencia que el otro.<br>' +
            '- Durante la prueba puede cambiar cual sin avisar. <br>' +
            '<div style="font-size: 1.4rem; margin-top: 15px;"><strong>Pulsa ESPACIO para empezar la prueba cuando estés listo</strong></div>' +
            '</div>';
      
          // Oculta feedback/estímulos (o déjalos, como prefieras visualmente)
          setStimuliVisible(false);
          feedbackDiv.style.display = 'none';
      
          // Clave: esto hace que tu checkKey permita SPACE → startMainTask()
          practiceTrialCount = MAX_PRACTICE_TRIALS;
          responseBlocked = false;  // permite pulsar espacio
        } else {
          // Mensaje frío y reinicio de la práctica
          const header = document.getElementById('practice-header');
          header.style.display = 'block';
          document.getElementById('practice-instruction').innerHTML =
            '<strong>Respuesta incorrecta.</strong> Repetimos la práctica.';
      
          practiceVerificationActive = false;
          practiceTrialCount = 0;
      
          setTimeout(() => {
            updatePracticeInstruction();   // tu función
            showFixationCross();           // relanza la práctica con el mismo flujo
          }, 600);
        }
        return;  // Importantísimo: no seguimos con la lógica de ensayo de práctica
      }
      //final lógica test




      
      if (responseBlocked) return;
      
      responseBlocked = true;
      clearTimeout(stimulusTimeoutId);
      
      const reactionTime = Date.now() - trialStartTime;
      const isCorrect = (choice === practiceCorrectStimulus);
      

     // PRÁCTICA: pseudoaleatorización fija por opción (10 trials con proporciones 7/10 y 3/10)
      let feedbackCorrect;
      {
        const idx = Math.min(practiceTrialCount, 9); // 0..9
        // 'choice' es 'A' o 'B' en tu código actual; si fuese distinto, mapea aquí.
        const fb = (choice === 'A') ? PRACTICE_SEQ_A[idx] : PRACTICE_SEQ_B[idx];
        feedbackCorrect = (fb === 1);
        // console.log(`[PRACTICE] t=${idx+1} choice=${choice} → fb=${fb}`);
      }

      
      triggerSelectionAnimation(choice);
      
      setTimeout(() => {
        showFeedback(feedbackCorrect);
        
        setTimeout(() => {
          practiceTrialCount++;
          
          // Actualizar instrucción si es necesario
          if (practiceTrialCount === 5) {
            updatePracticeInstruction();
          }
          
          if (practiceTrialCount >= MAX_PRACTICE_TRIALS) {
            // Finalizar práctica
            endPracticeBlock();
          } else {
            updatePracticeInstruction();
            showFixationCross();
          }
        }, FEEDBACK_MS);
      }, SELECTION_ANIMATION_MS);
    }


//FINAL DE LA PRÁCTICA

    
function endPracticeBlock() {
  // Activar verificación con los mismos estímulos visibles
  practiceVerificationActive = true;

  const header = document.getElementById('practice-header');
  header.style.display = 'block';
  document.getElementById('practice-instruction').innerHTML =
    '<strong style="font-size: 1.2rem;">Elige cuál crees que daba más premios para comprobar que has entendido la prueba (puedes consultar ahora las dudas que tengas)</strong>';

  // Mostrar los mismos estímulos (ya están en pantalla o estaban ocultos); permitir respuesta
  stimuliDiv.style.display = 'block';
  feedbackDiv.style.display = 'none';
  responseBlocked = false;  // ahora puede elegir A/B con teclado (y con click, si ya lo tienes)
}



    //INICIAR TAREA
    
// ========================================================================
// SECCIÓN 6: LÓGICA PRINCIPAL DE LA TAREA
// ========================================================================
// Funciones que controlan el flujo principal de la tarea: inicio, 
// presentación de estímulos, procesamiento de respuestas y reversiones.

    /**
     * Inicia la tarea principal tras completar la práctica.
     * Genera los estímulos reales según la configuración y muestra la primera cruz de fijación.
     */
    function startMainTask() {
      isPracticeMode = false;
      practiceTrialCount = 0;
      
      // Ocultar header de práctica
      document.getElementById('practice-header').style.display = 'none';
      
      // Generar estímulos reales (no de práctica)
      const stimulusType = document.getElementById('stimulusTypeSelect').value;
      if (stimulusType === 'genios') {
        stimuliDiv.innerHTML = `
          <div class="stimulus" id="A">
            ${createGeniusStimulus('A', true, 150)}
          </div>
          <div class="stimulus" id="B">
            ${createGeniusStimulus('B', true, 150)}
          </div>
        `;
      } else if (stimulusType === 'peces') {
        stimuliDiv.innerHTML = `
          <div class="lake-stimulus" id="lake-stimulus" data-stimulus-type="peces">
            ${createLakeStimulus(512, false, null)}
          </div>
        `;
      } else {
        stimuliDiv.innerHTML = `
          <div class="stimulus" id="A">
            ${createGeniusStimulus('A', true, 150)}
          </div>
          <div class="stimulus" id="B">
            ${createGeniusStimulus('B', true, 150)}
          </div>
        `;
      }
      
      // Iniciar la tarea real
      showFixationCross();
    }

    function setStimuliVisible(isVisible) {
      // Nota: esta función sólo controla el display del contenedor de estímulos.
      // IMPORTANTE: no llamar recursivamente (evita romper el flujo).
      if (!stimuliDiv) return;
      if (!isVisible) {
        stimuliDiv.style.display = 'none';
        return;
      }
      const isMobile = window.matchMedia && window.matchMedia('(max-width: 480px)').matches;
      stimuliDiv.style.display = isMobile ? 'flex' : 'block';
    }

    function showFixationCross() {
      setStimuliVisible(false);
      fixationCross.style.display = 'block';
      feedbackDiv.style.display = 'none'; // ⭐ OCULTAR FEEDBACK
      responseBlocked = true;
      
      const fixationDuration = FIXATION_MIN_MS + Math.random() * (FIXATION_MAX_MS - FIXATION_MIN_MS);
      
      setTimeout(() => {
        fixationCross.style.display = 'none';
        showStimuli();
      }, fixationDuration);
    }

    function showStimuli() {
      setStimuliVisible(true);
      feedbackDiv.style.display = 'none'; // ⭐ OCULTAR FEEDBACK
      responseBlocked = false;
      trialStartTime = Date.now();
      
      // ⏱️ Deadline configurable (puede ser sin límite)
      if (STIMULUS_TIMEOUT_MS === null) {
        stimulusTimeoutId = null;
      } else {
        stimulusTimeoutId = setTimeout(() => {
          handleOmission();
        }, STIMULUS_TIMEOUT_MS);
      }
    }

    function handleOmission() {
      if (responseBlocked) return;
      
      responseBlocked = true;
      clearTimeout(stimulusTimeoutId);
      omissions++;
      
      const currentTrialNumber = trialCount + 1;
      trials.push({
        trial: currentTrialNumber,
        choice: null,
        correctStimulus: correctStimulus,
        feedbackCorrect: null,
        misleading: 0,
        reactionTime: STIMULUS_TIMEOUT_MS,
        reversal: isReversalPhase ? 1 : 0,
        omission: 1,
        is_perseverative: 0,
        is_regressive: 0
      });
      
      feedbackDiv.className = 'omission';
      feedbackDiv.style.display = 'flex'; // ⭐ MOSTRAR FEEDBACK
      feedbackDiv.textContent = '⏰ ¡Muy lento!';
      
      setTimeout(() => {
        feedbackDiv.textContent = '';
        feedbackDiv.innerHTML = '';
        feedbackDiv.style.display = 'none'; // ⭐ OCULTAR FEEDBACK
        trialCount++;
        
        if (trialCount >= maxTrials) {
          feedbackDiv.style.display = 'flex'; // ⭐ MOSTRAR FEEDBACK
          feedbackDiv.textContent = 'Completado ✅';
          setStimuliVisible(false);
          showResults();
        } else {
          showFixationCross();
        }
      }, FEEDBACK_MS);
    }

    function triggerSelectionAnimation(choice) {
      const stimulusType = document.getElementById('stimulusTypeSelect').value;
      
      if (stimulusType === 'peces') {
        // Para peces, animar el lago con selección de lado
        const lakeStimulus = document.getElementById('lake-stimulus');
        if (!lakeStimulus) return;
        
        lakeStimulus.classList.remove('selected-left', 'selected-right');
        void lakeStimulus.offsetWidth;
        
        if (choice === 'A') {
          lakeStimulus.classList.add('selected-left');
        } else {
          lakeStimulus.classList.add('selected-right');
        }
        
        setTimeout(() => {
          lakeStimulus.classList.remove('selected-left', 'selected-right');
        }, SELECTION_ANIMATION_MS);
      } else {
        // Para genios y otros, animar el estímulo individual
        const stimulusDiv = document.getElementById(choice);
        if (!stimulusDiv) return;
        
        stimulusDiv.classList.remove('selected');
        void stimulusDiv.offsetWidth;
        stimulusDiv.classList.add('selected');
        
        setTimeout(() => {
          stimulusDiv.classList.remove('selected');
        }, SELECTION_ANIMATION_MS);
      }
    }

        // ⭐ FEEDBACK (mismo formato, sin círculo; con halo mínimo + moneda SVG tras "€")
    const COIN_SVG = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 64 64"
           style="margin-left:6px; vertical-align:-3px; flex:0 0 auto;" aria-hidden="true">
        <defs>
          <radialGradient id="coinGrad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#f5f5f5"/>
            <stop offset="55%" stop-color="#d1d5db"/>
            <stop offset="100%" stop-color="#9ca3af"/>
          </radialGradient>
          <linearGradient id="coinEdge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#e5e7eb"/>
            <stop offset="100%" stop-color="#6b7280"/>
          </linearGradient>
        </defs>
        <ellipse cx="32" cy="32" rx="22" ry="22" fill="url(#coinGrad)" stroke="url(#coinEdge)" stroke-width="3"/>
        <ellipse cx="32" cy="32" rx="16" ry="16" fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="2"/>
        <path d="M18 28c3-7 12-12 20-12s17 5 20 12" fill="none" stroke="#ffffff" stroke-opacity="0.25" stroke-width="3" stroke-linecap="round"/>
      </svg>
    `;

    function showFeedback(isCorrect) {
      const stimulusType = document.getElementById('stimulusTypeSelect').value;
      const sequenceMode = document.getElementById('sequenceSelect').value;
      
      // Hide stimuli if "feedback-without-stimuli" is selected
      if (sequenceMode === 'feedback-without-stimuli') {
        setStimuliVisible(false);
      }
      
      if (stimulusType === 'peces') {
        // Feedback para versión peces
        feedbackDiv.className = isCorrect ? 'correct fish-feedback' : 'incorrect fish-feedback';
        feedbackDiv.style.display = 'flex';
        
        // Aplicar glow solo al texto
        const haloColor = isCorrect ? 'var(--success)' : 'var(--error)';
        feedbackDiv.style.filter = `drop-shadow(0 0 12px ${haloColor})`;
        
        if (isCorrect) {
          feedbackDiv.innerHTML = `<span>Ganas 1 €</span><span class="emoji-large">🐟</span>`;
        } else {
          feedbackDiv.innerHTML = `<span>Pierdes 1 €</span><span class="emoji-large">❌</span>`;
        }
      } else {
        // Feedback para genios y otras versiones
        feedbackDiv.className = isCorrect ? 'correct' : 'incorrect';
        feedbackDiv.style.display = 'flex';
        
        // Halo solo en texto (NO en SVG de moneda)
        const textSpan = document.createElement('span');
        textSpan.style.filter = `drop-shadow(0 0 8px ${isCorrect ? 'var(--success)' : 'var(--error)'})`;
        textSpan.textContent = isCorrect ? '+5€' : '−5€';
        
        feedbackDiv.innerHTML = '';
        feedbackDiv.appendChild(textSpan);
      }

      setTimeout(() => {
        feedbackDiv.textContent = '';
        feedbackDiv.innerHTML = '';
        feedbackDiv.style.filter = '';
        feedbackDiv.className = '';
        feedbackDiv.style.display = 'none';
      }, FEEDBACK_MS);
    }
    // ========================================================================
    // LOG TRIAL - Registra el resultado de un trial
    // ========================================================================
    // NOMENCLATURA UNIFICADA (IMPORTANTE):
    // 
    // - feedbackCorrect (boolean): feedback MOSTRADO al participante
    //   → Puede ser engañoso (misleading) en trials probabilísticos
    //   → Se exporta como "reward" (0/1) en CSV
    //   → Se exporta como "outcome" (-1/+1) en hBayesDM
    //   → Usado por TODOS los modelos RL (Q-learning, VKF, CPD, HGF)
    //
    // - actual_is_correct (0/1): corrección OBJETIVA de la elección
    //   → Siempre refleja la verdad (choice === trueCorrectSide)
    //   → Se exporta como "actual_is_correct" en CSV
    //   → Usado para análisis conductual (accuracy, perseveración, regresión)
    //   → NUNCA debe ser usado por modelos RL
    //
    // - misleading (0/1): indica si el feedback fue engañoso
    //   → misleading=1 cuando feedbackCorrect ≠ actual_is_correct
    //
    // Esta separación es CRÍTICA para:
    // 1. Modelos RL aprenden del feedback recibido (aunque sea engañoso)
    // 2. Análisis conductual usa la corrección objetiva
    // ========================================================================
    function logTrial(choice, trueCorrectSide, feedbackCorrect, rt, isOmission = false) {
      if (isOmission) return;









      
      
     // --- BLOQUE REFACTORIZADO: Nueva lógica de registro de ensayo ---
    const currentTrialNumber = trials.length + 1;
    
    // Corrección objetiva de la elección
    const actual_is_correct = (choice === trueCorrectSide) ? 1 : 0;
    
    // Usar isReversalTrial que fue establecido en processChoice
    const _isReversalTrial = isReversalTrial ? 1 : 0;
    
    // Si es el ensayo de reversión, lo marcamos pero NO lo contamos como error
    // counted_is_correct se usa para performanceWindow / conteos
    const counted_is_correct = _isReversalTrial ? 1 : actual_is_correct;
    
    // ========================================================================
    // CÁLCULO DE ERRORES PERSEVERATIVOS Y REGRESIVOS (LÓGICA CORREGIDA)
    // ========================================================================
    let is_perseverative = 0, is_regressive = 0;
    
    // Error Perseverativo: elegir el lado anteriormente correcto tras reversión
    // (excluye el ensayo de reversión mismo)
    if (prevCorrectStimulus !== null && isReversalPhase && !_isReversalTrial && choice === prevCorrectStimulus) {
      is_perseverative = 1;
    }
    
    // Error Regresivo: un error (actual_is_correct === 0) después de haber
    // demostrado aprendizaje de la contingencia correcta actual
    // (haberla elegido correctamente al menos una vez en el reversalBlock actual)
    if (actual_is_correct === 0 && correctChoicesInBlock.size > 0) {
      is_regressive = 1;
    }
    
    // Si la elección fue correcta, registrarla en el set del bloque actual
    if (actual_is_correct === 1) {
      correctChoicesInBlock.add(currentTrialNumber);
    }

    // Calcular misleading respecto de la verdad empírica
    const misleading = ((feedbackCorrect ? 1 : 0) !== actual_is_correct) ? 1 : 0;
    
    // Push del trial incluyendo campos para auditoría
    // Incluir reversalBlock e isReversalTrial para las nuevas columnas CSV
    trials.push({
      trial: currentTrialNumber,
      is_perseverative,
      is_regressive,
      choice,
      correctStimulus: trueCorrectSide,
      feedbackCorrect,
      misleading,
      reactionTime: rt,
      reversal: isReversalPhase ? 1 : 0,
      omission: 0,
      // Campos añadidos para trazabilidad/CSV
      is_reversal_initiation: _isReversalTrial ? 1 : 0,
      actual_is_correct,
      counted_is_correct,
      // NUEVOS CAMPOS para sistema refactorizado
      reversalBlock: reversalBlock,           // Bloque de aprendizaje actual
      isReversalTrial: _isReversalTrial,      // TRUE solo en el ensayo de reversión
      reversalPhase: reversalPhase ? 1 : 0    // TRUE a partir de primera reversión (ambos modos)
    });
    
    // Actualizar hasMadeCorrectInThisPhase usando la verdad empírica
    if (actual_is_correct === 1) hasMadeCorrectInThisPhase = true;
    
    // ⭐ MODO CRITERIO: Actualizar contadores
    if (reversalMode === 'criterion' && isReversalPhase) {
      currentReversalTrials++;
      if (actual_is_correct === 0) {
        currentReversalErrors++;
      }
    }
    
    // Actualizar performanceWindow usando counted_is_correct (de modo que el ensayo de reversión
    // no penalice la ventana)
    if (!_isReversalTrial) {
      performanceWindow.push(counted_is_correct);
      if (performanceWindow.length > windowSize) performanceWindow.shift();
    } else {
      // neutral: no empujamos nada en la ventana en la iniciación de la reversión
    }
    
    // Recalcular correctCount y criterios de aprendizaje
    const correctCount = performanceWindow.filter(Boolean).length;
    
    if (performanceWindow.length === windowSize && correctCount >= accuracyThreshold) {
      if (firstLearningTrial === null) {
        firstLearningTrial = trialCount + 1;
      } else if (isReversalPhase && reversalLearningTrial === null) {
        reversalLearningTrial = trialCount + 1;
      }
      
      // ⭐ MODO CRITERIO: Marcar que se alcanzó el criterio
      if (reversalMode === 'criterion' && !criterionReached) {
        criterionReached = true;
        console.log(`✅ Criterio alcanzado en trial ${trialCount + 1}`);
      }
    }
    
    // ⭐ Resetear flag legacy de primer trial de reversión después de procesarlo
    if (_isReversalTrial) {
      isFirstReversalTrial = false;
    }
    // --- FIN BLOQUE ---
      trialCount++;
      if (trialCount >= maxTrials) {
        feedbackDiv.style.display = 'flex'; // ⭐ MOSTRAR FEEDBACK
        feedbackDiv.textContent = 'Completado ✅';
        setStimuliVisible(false);
        showResults();
      }
    }

    /**
     * Procesa la elección del participante en un ensayo.
     * Maneja la lógica de reversión, feedback y actualización de contadores.
     * @param {string} choice - La opción elegida ('A' o 'B')
     */
    function processChoice(choice) {
      if (responseBlocked) return;
      
      responseBlocked = true;
      clearTimeout(stimulusTimeoutId);

      triggerSelectionAnimation(choice);

      setTimeout(() => {
        if (trialCount === 0 && correctStimulus === null) correctStimulus = choice;

        const currentTrialNumber = trialCount + 1;
        
        // ========================================================================
        // NUEVA LÓGICA DE REVERSIÓN REFACTORIZADA
        // ========================================================================
        // Determinar si este ensayo es un ensayo de reversión (isReversalTrial)
        // y ejecutar la reversión incrementando reversalBlock
        
        let shouldReverse = false;
        isReversalTrial = false;  // Resetear al inicio de cada ensayo
        
        if (reversalMode === 'predetermined') {
          // Modo predeterminado: reversión en trial fijo
          if (currentTrialNumber === reversalTrial && !isReversalPhase) {
            shouldReverse = true;
            isReversalTrial = true;
          }
        } else if (reversalMode === 'criterion') {
          // Modo criterio: reversión cuando se alcanza el criterio
          // Solo revertir si se ha alcanzado el criterio de aprendizaje inicial o si ya estamos en fase de reversión
          if (criterionReached && (firstLearningTrial !== null || isReversalPhase)) {
            shouldReverse = true;
            isReversalTrial = true;
            
            // Guardar datos de la reversión anterior (si existe)
            if (reversalCount > 0) {
              reversalData.push({
                reversalNumber: reversalCount,
                errors: currentReversalErrors,
                trialsToReachCriterion: currentReversalTrials
              });
            }
            
            // Resetear variables para la nueva reversión
            reversalCount++;
            currentReversalErrors = 0;
            currentReversalTrials = 0;
            criterionReached = false;
            
            // La primera reversión marca el inicio de reversalPhase (en modo criterion)
            if (!reversalPhase) {
              reversalPhase = true;
            }
          }
        }
        
        // Ejecutar la reversión si corresponde
        if (shouldReverse) {
          // Incrementar el bloque de reversión
          reversalBlock++;
          
          // Guardar estímulo previo y cambiar al nuevo
          prevCorrectStimulus = correctStimulus;
          correctStimulus = correctStimulus === 'A' ? 'B' : 'A';
          
          // Resetear tracking de fase
          isFirstReversalTrial = true; // Legacy flag para compatibilidad
          hasMadeCorrectInThisPhase = false;
          performanceWindow = [];
          
          // Limpiar registro de elecciones correctas del bloque anterior
          correctChoicesInBlock.clear();
          
          // Marcar fase de reversión (ambos modos)
          if (!isReversalPhase) {
            isReversalPhase = true;
          }
          // En modo predeterminado, también marcar reversalPhase para consistencia
          if (reversalMode === 'predetermined' && !reversalPhase) {
            reversalPhase = true;
          }
          
          console.log(`🔄 Reversión en trial ${currentTrialNumber} | Bloque: ${reversalBlock} ${reversalMode === 'criterion' ? `| Rev#${reversalCount}` : ''}`);
        }
        // ========================================================================

        const rt = Date.now() - trialStartTime;
        const trueCorrect = (choice === correctStimulus);
        
        const feedbackCorrect = getFeedback(trueCorrect);

        coins += feedbackCorrect ? 5 : -5;

        logTrial(choice, correctStimulus, feedbackCorrect, rt);
        showFeedback(feedbackCorrect);
        
        setTimeout(() => {
          if (trialCount < maxTrials) {
            showFixationCross();
          }
        }, FEEDBACK_MS);
        
      }, SELECTION_ANIMATION_MS);
    }

    function checkKey(e) {
      // Manejo especial para tecla espacio al final de la práctica
      if (e.key === " " || e.key === "Spacebar") {
        if (practiceTrialCount >= MAX_PRACTICE_TRIALS && isPracticeMode) {
          e.preventDefault();
          startMainTask();
          return;
        }
      }
      
      if (responseBlocked) return;
      if (stimuliDiv.style.display === "none") return;
      
      if (e.key.toLowerCase() === "a" || e.key === "ArrowLeft") {
        if (isPracticeMode) {
          handlePracticeChoice('A');
        } else {
          processChoice('A');
        }
      } else if (e.key.toLowerCase() === "l" || e.key === "ArrowRight") {
        if (isPracticeMode) {
          handlePracticeChoice('B');
        } else {
          processChoice('B');
        }
      }
    }

    function computePhaseAndTrialInPhase(trialNumber) {
      let phase = 0, trial_in_phase = trialNumber;
      let is_reversal_first_trial = 0;
      
      // Buscar el trial actual en el array de trials
      const currentTrial = trials.find(t => t.trial === trialNumber);
      if (!currentTrial) {
        return { phase, trial_in_phase, is_reversal_first_trial };
      }
      
      // Usar el reversalBlock del trial para determinar la fase
      const currentBlock = currentTrial.reversalBlock || 0;
      phase = currentBlock > 0 ? 1 : 0;
      
      // Calcular trial_in_phase: contar trials en el mismo bloque antes de este
      const trialsInSameBlock = trials.filter(t => 
        t.reversalBlock === currentBlock && t.trial < trialNumber
      ).length;
      trial_in_phase = trialsInSameBlock + 1;
      
      // Marcar is_reversal_first_trial = 1 si es el primer trial del bloque actual
      // (excepto para el bloque 0 que es el aprendizaje inicial)
      if (currentBlock > 0 && trialsInSameBlock === 0) {
        is_reversal_first_trial = 1;
      }
      
      return { phase, trial_in_phase, is_reversal_first_trial };
    }


    // CONTAJE DE SECUENCIAS PSERSEVERAIVAS
    function markPerseverativeTrials(trials) {
      // Marca como perseverativos SOLO los trials que forman parte de rachas de length >= 2
      // Usa la propiedad que ya rellenas en logTrial: trial.is_perseverative (0/1)
      const n = trials.length;
      const isPer = new Array(n).fill(0);
      for (let i = 0; i < n; i++) {
        isPer[i] = trials[i] && trials[i].is_perseverative ? 1 : 0;
      }
    
      const isInPerSeq = new Array(n).fill(0);
      let i = 0;
      while (i < n) {
        // Solo consideramos la fase de reversión (reversal === 1) y errores marcados
        if (!trials[i] || trials[i].reversal !== 1 || isPer[i] === 0) { i++; continue; }
        // contar la longitud de la racha de errores consecutivos (en reversal)
        let j = i;
        while (j < n && trials[j].reversal === 1 && isPer[j] === 1) j++;
        const len = j - i;
        if (len >= 2) {
          for (let k = i; k < j; k++) isInPerSeq[k] = 1;
        }
        i = j;
      }
    
      // Añadir flag y contar
      let perseverativeTrialCount = 0;
      for (let idx = 0; idx < n; idx++) {
        trials[idx].is_perseverative_fromSeq = !!isInPerSeq[idx];
        if (isInPerSeq[idx]) perseverativeTrialCount++;
      }
    
      // Contar número de rachas distintas (sequences)
      let seqCount = 0;
      i = 0;
      while (i < n) {
        if (isInPerSeq[i] === 1) {
          seqCount++;
          while (i < n && isInPerSeq[i] === 1) i++;
        } else i++;
      }
    
      return {
        perseverativeTrialCount,           // total ensayos que pertenecen a rachas >=2
        perseverativeSequenceCount: seqCount, // número de rachas/episodios (cada episodio >=2)
        trials
      };
    }
    // --- FIN DEL BLOQUE ---
    
/// INICIO BLOQUE SHOWRESULTS

    
    function copyReportVariables() {
      const ta = document.getElementById('reportVariablesTextarea');
      const status = document.getElementById('copyReportVariablesStatus');
      if (!ta) return;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(ta.value).then(() => {
            if (status) status.textContent = 'Copiado ✅';
            setTimeout(() => { if (status) status.textContent = ''; }, 1200);
          }).catch(() => {
            // fallback
            ta.focus();
            ta.select();
            document.execCommand('copy');
            if (status) status.textContent = 'Copiado ✅';
            setTimeout(() => { if (status) status.textContent = ''; }, 1200);
          });
        } else {
          ta.focus();
          ta.select();
          document.execCommand('copy');
          if (status) status.textContent = 'Copiado ✅';
          setTimeout(() => { if (status) status.textContent = ''; }, 1200);
        }
      } catch (e) {
        ta.focus();
        ta.select();
        document.execCommand('copy');
        if (status) status.textContent = 'Copiado ✅';
        setTimeout(() => { if (status) status.textContent = ''; }, 1200);
      }
    }

// ========================================================================
// SECCIÓN 9: CÁLCULO DE RESULTADOS Y MÉTRICAS
// ========================================================================
// Funciones para analizar el desempeño del participante y calcular
// métricas de aprendizaje, incluyendo modelado computacional.

    /**
     * Muestra los resultados finales tras completar todos los ensayos.
     * Calcula métricas de accuracy, learning trials, errores perseverativos/regresivos,
     * y ajusta modelos computacionales (Q-learning, VKF, CPD, HGF).
     */
    function showResults() {
      resultsDiv.style.display = 'block'; // ⭐ AÑADE ESTA LÍNEA AL INICIO

      const nTrials = trials.length;




      // --- BLOQUE CORREGIDO (reemplaza el anterior “COPIAR/PEGAR…”) ---
      const validTrials = trials.filter(t => t.omission === 0);
      let learningTrials = validTrials.filter(t => t.reversal === 0);
      let reversalTrials = validTrials.filter(t => t.reversal === 1);

      // ⭐ FALLBACK: If no reversal trials detected but reversalTrial is defined (predetermined mode)
      if (reversalTrials.length === 0 && reversalTrial !== null && reversalMode === 'predetermined') {
        console.log(`⚠️ Fallback: Recalculating phases using reversalTrial=${reversalTrial}`);
        learningTrials = validTrials.filter(t => t.trial < reversalTrial);
        reversalTrials = validTrials.filter(t => t.trial >= reversalTrial);
        
        // Recalculate perseverative/regressive flags for fallback trials
        const prevCorrect = learningTrials.length > 0 ? learningTrials[learningTrials.length - 1].correctStimulus : null;
        let madeCorrectInReversal = false;
        reversalTrials.forEach((t, idx) => {
          if (idx === 0) {
            // First reversal trial: not perseverative, but can be first correct
            if (t.actual_is_correct === 1) madeCorrectInReversal = true;
            return;
          }
          if (prevCorrect && t.choice === prevCorrect && t.actual_is_correct === 0) {
            // ⭐ ALL errors choosing the previous correct stimulus are PERSEVERATIVE
            t.is_perseverative = 1;
            // ⭐ Additionally, if participant already made a correct response, it's also REGRESSIVE
            t.is_regressive = madeCorrectInReversal ? 1 : 0;
          }
          if (t.actual_is_correct === 1) madeCorrectInReversal = true;
        });
      }
      
      // Total de perseverativos en reversión (todos los ensayos que eligen el lado antes-correcto)
      const perseverativeTotal = reversalTrials.filter(t => t.is_perseverative === 1).length;
      
      // Conteo de ensayos perseverativos que forman parte de rachas consecutivas de longitud ≥ 2
      const revValidNonFirst = validTrials.filter(t => t.reversal===1 && t.omission===0 && t.is_reversal_initiation!==1);
      const perseverativeStreakTrials = (() => {
        let count=0, run=0;
        for (const t of revValidNonFirst){
          if (t.is_perseverative===1){ run++; if (run>=2) count++; }
          else { run=0; }
        }
        return count;

        
      })();

      // --- FIN BLOQUE CORREGIDO ---

      
      const nValidTrials = validTrials.length;
  
      
      const perseverativeErrorsReversal = reversalTrials.filter(t => t.is_perseverative === 1).length;
      const regressiveErrorsReversal = reversalTrials.filter(t => t.is_regressive === 1).length;

      const avgRT = (nValidTrials > 0 ? (validTrials.reduce((s, t) => s + t.reactionTime, 0) / nValidTrials) : 0);
      
      const avgRT_learning = (learningTrials.length > 0 ? (learningTrials.reduce((s, t) => s + t.reactionTime, 0) / learningTrials.length) : 0);
      const avgRT_reversal = (reversalTrials.length > 0 ? (reversalTrials.reduce((s, t) => s + t.reactionTime, 0) / reversalTrials.length) : 0);
      
      const posRTs = reversalTrials.filter(t => t.feedbackCorrect).map(t => t.reactionTime);
      const negRTs = reversalTrials.filter(t => !t.feedbackCorrect).map(t => t.reactionTime);
      const avgPosRT_reversal = posRTs.length > 0 ? posRTs.reduce((a, b) => a + b, 0) / posRTs.length : 0;
      const avgNegRT_reversal = negRTs.length > 0 ? negRTs.reduce((a, b) => a + b, 0) / negRTs.length : 0;

      //añadidos preparados par ala verificación
      const preReversalTrials = learningTrials;  // ⭐ AÑADE ESTA
      const postReversalTrials = reversalTrials; // ⭐ AÑADE ESTA

// ⭐ VERIFICACIÓN DE ALEATORIZACIÓN DEL FEEDBACK
      // ⭐ VERIFICACIÓN DE ALEATORIZACIÓN DEL FEEDBACK
      const preReversalRewarded = preReversalTrials.filter(t => t.feedbackCorrect === true).length;
      const preReversalNotRewarded = preReversalTrials.filter(t => t.feedbackCorrect === false).length;
      const preReversalRewardRate = preReversalTrials.length > 0 ? ((preReversalRewarded / preReversalTrials.length) * 100).toFixed(2) : 0;
      
      const postReversalRewarded = postReversalTrials.filter(t => t.feedbackCorrect === true).length;
      const postReversalNotRewarded = postReversalTrials.filter(t => t.feedbackCorrect === false).length;
      const postReversalRewardRate = postReversalTrials.length > 0 ? ((postReversalRewarded / postReversalTrials.length) * 100).toFixed(2) : 0;
      

      function icvOf(arr) {
        if (!arr.length) return 0;
        const mean = arr.reduce((a,b)=>a+b,0)/arr.length;
        if (mean <= 0) return 0;
        const sd = Math.sqrt(arr.map(x => (x-mean)**2).reduce((a,b)=>a+b,0)/arr.length);
        return sd/mean;
      }
      const icvGlobal   = icvOf(validTrials.map(t=>t.reactionTime));
      const icvLearn    = icvOf(learningTrials.map(t=>t.reactionTime));
      const icvRev      = icvOf(reversalTrials.map(t=>t.reactionTime));

      let winStay=0, winSwitch=0, winTotal=0, loseShift=0, loseTotal=0, invalidLossSwitch=0, invalidLossTotal=0, misleadSwitch=0, misleadTotal=0;
      for (let i = 1; i < validTrials.length; i++) {
        const prev = validTrials[i - 1];
        const curr = validTrials[i];
        if (prev.feedbackCorrect) {
          winTotal++;
          if (curr.choice === prev.choice) winStay++; else winSwitch++;
        } else {
          loseTotal++;
          if (curr.choice !== prev.choice) loseShift++;
        }
        if (!prev.feedbackCorrect && prev.misleading === 1) {
          invalidLossTotal++;
          if (curr.choice !== prev.choice) invalidLossSwitch++;
        }
        if (prev.misleading === 1) {
          misleadTotal++;
          if (curr.choice !== prev.choice) misleadSwitch++;
        }
      }
      const winStayPct   = winTotal   > 0 ? ((winStay / winTotal) * 100).toFixed(1) : 'N/A';
      const loseShiftPct = loseTotal  > 0 ? ((loseShift / loseTotal) * 100).toFixed(1) : 'N/A';
      const loseStay = loseTotal - loseShift;
      const loseStayPct  = loseTotal  > 0 ? ((loseStay / loseTotal) * 100).toFixed(1) : 'N/A';
      const winSwitchPct = winTotal   > 0 ? ((winSwitch / winTotal) * 100).toFixed(1) : 'N/A';
      const invalidLossSwitchPct = invalidLossTotal > 0 ? ((invalidLossSwitch / invalidLossTotal) * 100).toFixed(1) : 'N/A';
      const probabilisticSwitchRatePct = misleadTotal > 0 ? ((misleadSwitch / misleadTotal) * 100).toFixed(1) : 'N/A';

      const probGood = feedbackProbability;
      const probBad  = 1 - feedbackProbability;
      const probLabel = `${Math.round(probGood*100)}% / ${Math.round(probBad*100)}%`;

      const trialsToFirstCriterion = firstLearningTrial !== null ? firstLearningTrial : 'No alcanzado';
      const trialsToReversalCriterion = reversalLearningTrial !== null ? (reversalTrial !== null ? (reversalLearningTrial - reversalTrial + 1) : reversalLearningTrial) : 'No alcanzado';

      // ⭐ CÁLCULOS PARA MODO CRITERIO
      let criterionModeMetrics = '';
      if (reversalMode === 'criterion') {
        // Guardar la última reversión si hay datos pendientes
        if (currentReversalTrials > 0 && reversalCount > 0) {
          reversalData.push({
            reversalNumber: reversalCount,
            errors: currentReversalErrors,
            trialsToReachCriterion: currentReversalTrials
          });
        }
        
        if (reversalData.length > 0) {
          // Calcular métricas
          const totalErrors = reversalData.reduce((sum, r) => sum + r.errors, 0);
          const avgErrorsPerReversal = (totalErrors / reversalData.length).toFixed(2);
          const avgTrialsToCriterion = (reversalData.reduce((sum, r) => sum + r.trialsToReachCriterion, 0) / reversalData.length).toFixed(2);
          
          criterionModeMetrics = `
            <br>
            <h4>Métricas de Modo Criterio:</h4>
            <p><strong>Número de reversiones</strong>: ${reversalData.length}</p>
            <p><strong>Errores promedio por reversión</strong>: ${avgErrorsPerReversal}</p>
            <p><strong>Trials medios hasta criterio por reversión</strong>: ${avgTrialsToCriterion}</p>
          `;
        } else {
          criterionModeMetrics = `
            <br>
            <h4>Métricas de Modo Criterio:</h4>
            <p><strong>Número de reversiones</strong>: 0</p>
            <p style="color: var(--text-secondary); font-style: italic;">El criterio de aprendizaje no se alcanzó durante la prueba. No se realizaron reversiones.</p>
          `;
        }
      }

//INICIO BLOQUE DE RESULTADOS COMP

// === Análisis computacional (aprox. MLE) ===

     //INICIO BLOQUE DE RESULTADOS COMP


// === DIAGNÓSTICO: Imprimir primeros 10 trials ===
console.log("=== DIAGNÓSTICO HTML ===");
console.log("Total valid trials:", validTrials.length);
console.log("Primeros 10 trials:");
for (let i = 0; i < Math.min(10, validTrials.length); i++) {
  const t = validTrials[i];
  console.log(`Trial ${t.trial}: choice=${t.choice} (${t.choice==='A'?0:1}), feedbackCorrect=${t.feedbackCorrect} (${t.feedbackCorrect?1:0}), reversal=${t.reversal}`);
}

// Verificar qué recibe fitAllModels
const { choices, rewards_01, rewards_pm1 } = buildChoicesRewards(validTrials);
console.log("Choices (primeros 10):", choices.slice(0, 10));
console.log("Rewards_01 (primeros 10):", rewards_01.slice(0, 10));
console.log("Rewards_pm1 (primeros 10):", rewards_pm1.slice(0, 10));
console.log("======================");



      /// INICIO DEBUG MANUAL
      // === TEST MANUAL AB ===
function testNllAbManual(alpha, beta, choices, rewards, q0 = 0.5) {
  let QA = q0, QB = q0;
  let nll = 0.0;
  
  console.log(`\n=== TEST AB: alpha=${alpha}, beta=${beta}, q0=${q0} ===`);
  
  for (let t = 0; t < choices.length; t++) {
    const ch = choices[t];
    const r = rewards[t];
    
    // Softmax
    const logitA = beta * QA;
    const logitB = beta * QB;
    const maxLogit = Math.max(logitA, logitB);
    const expA = Math.exp(logitA - maxLogit);
    const expB = Math.exp(logitB - maxLogit);
    const pA = expA / (expA + expB);
    const pB = 1.0 - pA;
    
    // Probabilidad de la elección
    const p = (ch === 0) ? pA : pB;
    
    // NLL
    const nll_t = -Math.log(Math.max(p, 1e-12));
    nll += nll_t;
    
    console.log(`Trial ${t+1}: ch=${ch}, r=${r} | QA=${QA.toFixed(4)}, QB=${QB.toFixed(4)} | pA=${pA.toFixed(4)} | p_chosen=${p.toFixed(4)} | nll_t=${nll_t.toFixed(4)}`);
    
    // Actualizar Q
    if (ch === 0) {
      const QA_new = QA + alpha * (r - QA);
      console.log(`  → Update QA: ${QA.toFixed(4)} + ${alpha}*(${r}-${QA.toFixed(4)}) = ${QA_new.toFixed(4)}`);
      QA = QA_new;
    } else {
      const QB_new = QB + alpha * (r - QB);
      console.log(`  → Update QB: ${QB.toFixed(4)} + ${alpha}*(${r}-${QB.toFixed(4)}) = ${QB_new.toFixed(4)}`);
      QB = QB_new;
    }
  }
  
  console.log(`\nNLL TOTAL: ${nll.toFixed(6)}\n`);
  return nll;
}

// Ejecutar ANTES de fitAllModels
const choices_test = [1, 0, 0, 0, 1, 1, 1, 1, 1, 1];
const rewards_test = [1, 1, 0, 0, 0, 1, 1, 1, 0, 0];

console.log("\n" + "=".repeat(60));
console.log("PYTHON encontró alpha=0.092:");
testNllAbManual(0.092, 15.0, choices_test, rewards_test, 0.5);

console.log("\n" + "=".repeat(60));
console.log("HTML encontró alpha=0.214:");
testNllAbManual(0.214, 15.0, choices_test, rewards_test, 0.5);

      /// FIN DEL DEBUG

      // === Análisis computacional (aprox. MLE) ===
      const compRes = fitAllModels(validTrials);
      const compHtml = (compRes && typeof compRes === 'object') ? compRes.html : compRes;
      const compFits = (compRes && typeof compRes === 'object' && compRes.fits) ? compRes.fits : {};

      const fmt = (x, d=3) => {
        if (x === null || x === undefined) return 'NA';
        const n = Number(x);
        return Number.isFinite(n) ? n.toFixed(d) : String(x);
      };

      const reportText = [
        'CONDUCTUALES:',
        `Win switch rate: ${winSwitchPct}% (${winSwitch}/${winTotal})`,
        `Lose stay rate: ${loseStayPct}% (${loseStay}/${loseTotal})`,
        `Errores perseverativos (rachas ≥2): ${perseverativeStreakTrials}`,
        `Ensayos hasta criterio en aprendizaje: ${trialsToFirstCriterion}`,
        `Ensayos hasta criterio en reversión: ${trialsToReversalCriterion}`,
        '',
        'COMPUTACIONALES (hBayesDM; MLE individual):',
        `α (alpha; AB fictitious): ${fmt(compFits?.ql1Fict?.alpha)}`,
        `β (beta; AB fictitious): ${fmt(compFits?.ql1Fict?.beta)}`,
        `α+ (alpha feedback positivo; dual fictitious): ${fmt(compFits?.ql2Fict?.alphaR)}`,
        `α− (alpha feedback negativo; dual fictitious): ${fmt(compFits?.ql2Fict?.alphaP)}`,
        `EWA φ (phi): ${fmt(compFits?.ewa?.phi)}`,
        `EWA ρ (rho): ${fmt(compFits?.ewa?.rho)}`
      ].join('\n');
      

      // FINAL BLQOUE RESULTADOS COMP

      // Calculate total score display
      const total_score = coins;
      const scoreColor = total_score >= 0 ? '#10b981' : '#ef4444';
      const scoreSign = total_score >= 0 ? '+' : '';
      
      resultsDiv.innerHTML = `
        <!-- COMPLETION MESSAGE -->
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="font-size: 2rem; margin-bottom: 10px;">Has finalizado la tarea</h2>
          <div style="font-size: 2.5rem; font-weight: bold; color: ${scoreColor};">
            ${scoreSign}${total_score}€ 💰
          </div>
        </div>

        <!-- MAIN EXPORT SECTION -->
        <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 20px; margin-bottom: 20px; text-align: center;">
          <h3 style="margin: 0 0 15px 0;">💾 Exportar Datos</h3>
          <button id="downloadCsvBtn" style="padding: 12px 24px; border-radius: 10px; border: 1px solid var(--border); background: var(--primary); color: white; cursor: pointer; font-size: 16px; font-weight: 500;">⬇️ Descargar Resultados (CSV)</button>
          <p style="font-size: 12px; color: var(--text-muted); margin-top: 10px;">CSV completo con metadatos de trazabilidad, compatible con análisis en Python/R.</p>
        </div>

        <!-- COPY DATA FOR hBayesDM -->
        <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 16px; margin-bottom: 30px;">
          <h3 style="margin: 0 0 10px 0;">📋 Datos para hBayesDM (copia y pega)</h3>
          <pre id="reportVariablesTextarea" readonly style="width: 100%; min-height: 140px; padding: 10px; border-radius: 10px; border: 1px solid var(--border); background: #0b1220; color: #e5e7eb; font-size: 13px; line-height: 1.35; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word;">${reportText}</pre>
          <div style="display:flex; gap:10px; margin-top: 10px;">
            <button type="button" onclick="copyReportVariables()" style="padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border); background: var(--bg); color: var(--text); cursor: pointer;">Copiar</button>
            <span id="copyReportVariablesStatus" style="align-self:center; color: var(--text-muted); font-size: 0.9rem;"></span>
          </div>
        </div>

        <!-- BEHAVIORAL ANALYSIS SECTION -->
        <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
          <h3 style="margin-top: 0;">📊 Análisis Conductual</h3>
          <p>Total de ensayos: ${nTrials} (${nValidTrials} válidos, ${omissions} omisiones)</p>
          <p>Ganancia total: ${coins}€</p>
          <br>
          <p><strong>Errores perseverativos totales (fase reversión)</strong>: ${perseverativeTotal}</p>
          <p><strong>Errores perseverativos en rachas ≥2 (fase reversión)</strong>: ${perseverativeStreakTrials}</p>
          <p><strong>Errores regresivos (fase reversión)</strong>: ${regressiveErrorsReversal}</p>
          <p><strong>Cambios tras recompensa (desconfianza) %Win-Switch</strong>: ${winSwitchPct}</p>
          <br>
          <p>Trials hasta primer criterio: ${trialsToFirstCriterion}</p>
          <p>Trials hasta criterio en fase de reversión: ${trialsToReversalCriterion}</p>
          ${criterionModeMetrics}
          <br>
          <p>Sensibilidad a refuerzo positivo — %Win-Stay: ${winStayPct}</p>
          <p>Sensibilidad a refuerzo negativo — %Loss-Switch: ${loseShiftPct}</p>
          <p>"Probabilistic switch rate" (% tras feedback engañoso): ${probabilisticSwitchRatePct}</p>
          <br>
          <p>ICV: Coeficiente de variabilidad de TR intrasujeto</p>
          <p>Global: ${icvGlobal.toFixed(3)} — Fase de aprendizaje: ${icvLearn.toFixed(3)} — Fase de reversión: ${icvRev.toFixed(3)}</p>
          <p style="font-size:14px;color: var(--text-muted);">Referencia: adulto sano 0,2–0,3; TDAH/TMS 0,3–0,4</p>
        </div>

        <!-- COMPUTATIONAL ANALYSIS SECTION -->
        <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
          <h3 style="margin-top: 0;">🧮 Análisis Computacional</h3>
          <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 15px;">Aproximación basada en MLE (alt. cálculo jerárquico con Python/EMA y hBayesDM en R)</p>
          ${compHtml}
          <br>
          <p style="font-size:14px;color: var(--text-muted);">Referencias: Den Ouden 2013; Waltmann 2022.</p>
        </div>

        <!-- REFERENCIA NORMATIVA -->
        <div style="background:rgba(255,255,255,0.05);border:1px solid var(--border);border-radius:12px;padding:20px;margin-top:30px;font-family:monospace;font-size:12px;line-height:1.8;">
          <h3 style="font-family:'Inter',sans-serif;font-size:1.1rem;margin-top:0;color:var(--text-primary);">📖 Valores Normativos y Patrones Clínicos</h3>
          
          <p style="margin:15px 0 10px 0;color:var(--text-primary);font-weight:500;">SENSIBILIDAD RECOMPENSA vs CASTIGO (α⁺ / α⁻):</p>
          <p style="margin:5px 0;color:var(--text-secondary);">• Balance óptimo: α⁺/α⁻ = 0.8 - 1.2 (aprende similar de ambas)</p>
          <p style="margin:5px 0;color:var(--text-secondary);">• Sesgo POSITIVO: α⁺/α⁻ > 1.5 (aprende más de recompensas)</p>
          <p style="margin:5px 0 0 15px;color:var(--text-muted);">→ Manía, TDAH, impulsividad</p>
          <p style="margin:5px 0;color:var(--text-secondary);">• Sesgo NEGATIVO: α⁺/α⁻ < 0.6 (aprende más de castigos)</p>
          <p style="margin:5px 0 0 15px;color:var(--text-muted);">→ Depresión, ansiedad, anhedonia</p>
          
          <hr style="border:none;border-top:1px solid var(--border);margin:20px 0;">
          
          <p style="margin:15px 0 10px 0;color:#ef4444;font-weight:500;">⚠️ PATRÓN PSICOSIS:</p>
          <p style="margin:5px 0;color:var(--text-secondary);">• Conductual: %Win-Switch > 25%</p>
          <p style="margin:5px 0;color:var(--text-secondary);">• EWA: φ < 0.35 (recencia = alfa alto)</p>
          <p style="margin:5px 0;color:var(--text-secondary);">• EWA: ρ_decay > 0.65 (consolidación progresiva/inercia alta)</p>
          <p style="margin:5px 0;color:var(--text-secondary);">• Posible: Insensib rho o alfa a feedback negativo (insensible a evidencia no confirmatoria)</p>
          <p style="margin:5px 0;color:var(--text-secondary);">• Posible: AB: β < 3.0 (inconsistencia en decisiones)</p>
          <p style="margin:8px 0 0 15px;color:var(--text-muted);font-style:italic;">= JTC: En teoría, belief instability (dtd bajo, alfa alto, update de belief alto), beta baja (hyperswitching), recencia (phi baja). Rho variable. </p>
          
          <hr style="border:none;border-top:1px solid var(--border);margin:20px 0;">
          
          <p style="margin:15px 0 10px 0;color:#f59e0b;font-weight:500;">⚠️ PATRÓN DEPRESIÓN (Sesgo Negativo):</p>
          <p style="margin:5px 0;color:var(--text-secondary);">• ABdual: α⁺ < 0.35 (insensibilidad a recompensa)</p>
          <p style="margin:5px 0;color:var(--text-secondary);">• ABdual: α⁻ > 0.50 (hipersensibilidad a castigo)</p>
          <p style="margin:5px 0;color:var(--text-secondary);">• Beta baja (mala ejecución), posible perseverancia (stickiness). Algún estudio ve beta alta. </p>
          <p style="margin:5px 0;color:var(--text-secondary);">• EWA: Rho media-alta (rigidez de beliefs)</p>
          <p style="margin:8px 0 0 15px;color:var(--text-muted);font-style:italic;">= Aprende poco de recompensas, mucho de castigos. Menos hallazgos en estudios. </p>

          <hr style="border:none;border-top:1px solid var(--border);margin:20px 0;">
          
          <p style="margin:15px 0 10px 0;color:#f59e0b;font-weight:500;">⚠️ PATRÓN HIPERTÍMICO/ANASTROFISTA (Sesgo Positivo-Explorador):</p>
          <p style="margin:5px 0;color:var(--text-secondary);">• ABdual: α⁺ alto, p+ alto</p>
          <p style="margin:5px 0;color:var(--text-secondary);">• ABdual: α⁻ bajo, p- bajo</p>
          <p style="margin:5px 0;color:var(--text-secondary);">• EWA: Rho baja (volatilidad de beliefs)</p>
          <p style="margin:8px 0 0 15px;color:var(--text-muted);font-style:italic;">= Aprende poco de castigos, mucho de recompensas</p>
          
          <hr style="border:none;border-top:1px solid var(--border);margin:20px 0;">
          
          <p style="margin:15px 0 10px 0;color:#f59e0b;font-weight:500;">⚠️ PATRÓN OBSESIVO-COMPULSIVO (EN REVISIÓN):</p>
          <p style="margin:5px 0;color:var(--text-secondary);">• No es el esperado, hacen más switch, menos consistencia, menos perseveración. </p>
          <p style="margin:5px 0;color:var(--text-secondary);">• TOC (Marzuki 21, Apergis-Schoute 23, Tezcan 17): vs. controles, más a+, menos a-, menos beta (inconsistentes), menos reinforcement sensitivity (Tau de Kanen = Rho de Waltmann pero con tau en lugar de beta),  menos stickiness (cambian mucho). Conductual: Más shifting tanto lose como win. </p>
          <p style="margin:5px 0;color:var(--text-secondary);">• Acúmuladores: Más Trials to criterion en reversión (22 vs 15). </p>
          <p style="margin:8px 0 0 15px;color:var(--text-muted);font-style:italic;">= ???</p>
          
          <hr style="border:none;border-top:1px solid var(--border);margin:20px 0;">
          
                   <p style="margin:15px 0 10px 0;color:#f59e0b;font-weight:500;">⚠️ PATRÓN RÍGIDO-COMPULSIVO:</p>
          <p style="margin:5px 0;color:var(--text-secondary);">• Rigidez de la creencia base: Rho_decay alta + beta media-alta</p>
          <p style="margin:5px 0;color:var(--text-secondary);">• Compulsión independiente del feedbak: Stickiness tau alto + beta media-alta</p>
          
          <hr style="border:none;border-top:1px solid var(--border);margin:20px 0;">
          
          <p style="margin:15px 0 10px 0;color:#10b981;font-weight:500;">✅ PATRÓN SANO (Objetivo):</p>
          <p style="margin:5px 0;color:var(--text-secondary);">• AB: α = 0.35 - 0.55</p>
          <p style="margin:5px 0;color:var(--text-secondary);">• AB: β = 4.0 - 8.0</p>
          <p style="margin:5px 0;color:var(--text-secondary);">• EWA: φ = 0.45 - 0.65</p>
          <p style="margin:5px 0;color:var(--text-secondary);">• EWA: ρ_decay = 0.35 - 0.60</p>
          <p style="margin:5px 0;color:var(--text-secondary);">• ABdual: α⁺/α⁻ = 0.8 - 1.2</p>
          
          <hr style="border:none;border-top:1px solid var(--border);margin:20px 0;">
          
          <p style="margin:15px 0 5px 0;color:var(--text-primary);font-weight:500;">📚 Referencias:</p>
          <p style="margin:3px 0;color:var(--text-muted);font-size:11px;">• Waltmann et al. (2022) <em>Behav Res Methods</em>: Modelos RS y EWA en psicosis</p>
          <p style="margin:3px 0;color:var(--text-muted);font-size:11px;">• Baker et al. (2019) <em>Schizophr Bull</em>: Parámetros EWA en esquizofrenia</p>
          <p style="margin:3px 0;color:var(--text-muted);font-size:11px;">• Frank et al. (2007) <em>Science</em>: AB-dual en Parkinson (base del modelo)</p>
          <p style="margin:3px 0;color:var(--text-muted);font-size:11px;">• Collins & Frank (2014) <em>Psychol Rev</em>: Integración dopamina-RL</p>


         
          <hr style="border:none;border-top:1px solid var(--border);margin:20px 0;">
          
          <p style="margin:15px 0 5px 0;color:var(--text-primary);font-weight:500;">📚 SIGNIFICADO VARIABLES:</p>
          <p style="margin:3px 0;color:var(--text-muted);font-size:11px;">• AB: Alfa [0-1] Velocidad de actualización (0 no actualiza, rigidez, 1 reacciona al último feedback, impulsividad). lat-OFC </p>
          <p style="margin:3px 0;color:var(--text-muted);font-size:11px;">• AB: Beta [cont] Consistencia, m-OFC. Baja=exploración, mala implementación; Alta= rigidez?/explotación</p>
          <p style="margin:3px 0;color:var(--text-muted);font-size:11px;">• AB stickiness: Perseveración pura. Kane lo div en 2 modelos </p>
          <p style="margin:3px 0;color:var(--text-muted);font-size:11px;">• Sensib al refuerzo (rho, tau de Kane) [0-1], colinear con beta, conceptualmente interesante</p>
          <p style="margin:3px 0;color:var(--text-muted);font-size:11px;">• EWA (Modelo con componente temporal). Phi [0-1]: +phi, Actualización lenta/estable, integración de datos previos (inv. alfa), ; Rho/p [0-1]: Decay, inercia, conforme avanza reafirma el belief. </p>


          
        </div>
        <!-- FIN REFERENCIA NORMATIVA -->
      `;

  

      resultsDiv.dataset.icvGlobal = icvGlobal.toFixed(6);
      resultsDiv.dataset.icvLearn  = icvLearn.toFixed(6);
      resultsDiv.dataset.icvRev    = icvRev.toFixed(6);
      resultsDiv.dataset.probGood  = probGood.toFixed(3);
      resultsDiv.dataset.probBad   = probBad.toFixed(3);

      // Asignar eventos onclick a los botones dentro de showResults
      document.getElementById('downloadCsvBtn').addEventListener('click', downloadCsv);
    }


/// final bloqeu showresults

    // ========================================================================
    // EXPORT CSV GENERAL - Formato completo para análisis Python/R
    // ========================================================================
    // COLUMNAS CLAVE:
    // - choice_code (1/2): opción elegida (1=A, 2=B)
    // - reward (0/1): feedback MOSTRADO al participante (puede ser engañoso)
    //   → Usar para modelos RL (Q-learning, CPD, HGF)
    // - actual_is_correct (0/1): corrección OBJETIVA de la elección
    //   → Usar para análisis conductual (accuracy, learning curves)
    // - misleading (0/1): 1 si el feedback fue engañoso (reward ≠ actual_is_correct)
    // ========================================================================
    
    // Función auxiliar para escapar valores CSV que puedan contener comas o comillas
    function csvEscape(value) {
      if (value === null || value === undefined) {
        return '';
      }
      const str = String(value);
      // Si contiene comas, comillas dobles, o saltos de línea, encerrar entre comillas y escapar comillas internas
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return '"' + str.replace(/"/g, '""') + '"';
      }
      return str;
    }
    
    function downloadCsv() {
      const participantId = document.getElementById('participantIdInput').value.trim() || 'unknown';
      const probGood = parseFloat(resultsDiv.dataset.probGood);
      const probBad = parseFloat(resultsDiv.dataset.probBad);
      const icvGlobal = resultsDiv.dataset.icvGlobal;
      const icvLearn = resultsDiv.dataset.icvLearn;
      const icvRev = resultsDiv.dataset.icvRev;

      // ⭐ Obtener valores de configuración de la tarea
      const stimulusTypeSelect = document.getElementById('stimulusTypeSelect');
      const currentStimulusType = stimulusTypeSelect ? stimulusTypeSelect.value : 'unknown';
      
      const feedbackDurationSelect = document.getElementById('feedbackDurationSelect');
      const currentFeedbackDuration = feedbackDurationSelect ? parseInt(feedbackDurationSelect.value) : (typeof FEEDBACK_MS !== 'undefined' ? FEEDBACK_MS : 750);
      
      const responseDeadlineSelect = document.getElementById('responseDeadlineSelect');
      let currentResponseDeadline = null;
      if (responseDeadlineSelect) {
        const deadlineVal = responseDeadlineSelect.value;
        currentResponseDeadline = (deadlineVal === 'none') ? null : parseInt(deadlineVal);
      } else if (typeof STIMULUS_TIMEOUT_MS !== 'undefined') {
        currentResponseDeadline = STIMULUS_TIMEOUT_MS;
      }

      // ========================================================================
      // SECCIÓN 8: FUNCIONES DE EXPORTACIÓN DE DATOS
      // ========================================================================
      // Sistema de exportación CSV con metadatos completos de auditoría
      // y columnas refactorizadas según el nuevo sistema de reversión.
      
      // ⭐ CALCULAR PROBABILIDADES REALES PARA DEBUG
      // Calcular las probabilidades de recompensa que experimentó el participante
      // para cada estímulo en cada fase
      const debugProbs = {
        stimA_phase0_rewards: 0, stimA_phase0_total: 0,
        stimB_phase0_rewards: 0, stimB_phase0_total: 0,
        stimA_phase1_rewards: 0, stimA_phase1_total: 0,
        stimB_phase1_rewards: 0, stimB_phase1_total: 0
      };
      
      // Determinar cuál estímulo era el correcto inicialmente
      let initialCorrectStimulus = null;
      for (const t of trials) {
        if (t.correctStimulus && t.reversal === 0) {
          initialCorrectStimulus = t.correctStimulus;
          break;
        }
      }
      
      // Calcular probabilidades observadas
      trials.forEach(t => {
        if (t.omission === 1) return;
        
        const isPhase0 = t.reversal === 0;
        const choice = t.choice;
        const gotReward = t.feedbackCorrect ? 1 : 0;
        
        if (isPhase0) {
          if (choice === 'A') {
            debugProbs.stimA_phase0_total++;
            debugProbs.stimA_phase0_rewards += gotReward;
          } else if (choice === 'B') {
            debugProbs.stimB_phase0_total++;
            debugProbs.stimB_phase0_rewards += gotReward;
          }
        } else {
          if (choice === 'A') {
            debugProbs.stimA_phase1_total++;
            debugProbs.stimA_phase1_rewards += gotReward;
          } else if (choice === 'B') {
            debugProbs.stimB_phase1_total++;
            debugProbs.stimB_phase1_rewards += gotReward;
          }
        }
      });
      
      // Calcular porcentajes
      const prob_A_phase0 = debugProbs.stimA_phase0_total > 0 
        ? (debugProbs.stimA_phase0_rewards / debugProbs.stimA_phase0_total).toFixed(3)
        : 'NA';
      const prob_B_phase0 = debugProbs.stimB_phase0_total > 0
        ? (debugProbs.stimB_phase0_rewards / debugProbs.stimB_phase0_total).toFixed(3)
        : 'NA';
      const prob_A_phase1 = debugProbs.stimA_phase1_total > 0
        ? (debugProbs.stimA_phase1_rewards / debugProbs.stimA_phase1_total).toFixed(3)
        : 'NA';
      const prob_B_phase1 = debugProbs.stimB_phase1_total > 0
        ? (debugProbs.stimB_phase1_rewards / debugProbs.stimB_phase1_total).toFixed(3)
        : 'NA';
      
      // ⭐ Definir metadatos de trazabilidad (AMPLIADOS)
      const meta = {
        meta_task_version: "PRLT_Flexible_6.0_Refactored",
        meta_export_datetime_iso: new Date().toISOString(),
        meta_timezone_offset_min: new Date().getTimezoneOffset(),
        meta_user_agent: navigator.userAgent,
        meta_screen_w: screen.width,
        meta_screen_h: screen.height,
        meta_viewport_w: window.innerWidth,
        meta_viewport_h: window.innerHeight,
        meta_device_pixel_ratio: window.devicePixelRatio,
        meta_stimulus_type: currentStimulusType,
        meta_reversal_mode: reversalMode,
        meta_prob_good: probGood,
        meta_prob_bad: probBad,
        meta_feedback_duration_ms: currentFeedbackDuration,
        meta_response_deadline_ms: currentResponseDeadline !== null ? currentResponseDeadline : 'NA',
        meta_n_trials_planned: trials.length,
        // ⭐ NUEVOS METADATOS PARA AUDITORÍA
        meta_participant_id: participantId,
        meta_reversal_schedule: reversalMode === 'predetermined' ? reversalTrial : 'criterion-based',
        meta_window_focus_changes: windowFocusChanges,
        // ⭐ DEBUG: Probabilidades reales experimentadas por el participante
        meta_debug_initial_correct_stimulus: initialCorrectStimulus || 'NA',
        meta_debug_prob_reward_stim_A_phase_0: prob_A_phase0,
        meta_debug_prob_reward_stim_B_phase_0: prob_B_phase0,
        meta_debug_prob_reward_stim_A_phase_1: prob_A_phase1,
        meta_debug_prob_reward_stim_B_phase_1: prob_B_phase1,
        meta_debug_n_trials_stim_A_phase_0: debugProbs.stimA_phase0_total,
        meta_debug_n_trials_stim_B_phase_0: debugProbs.stimB_phase0_total,
        meta_debug_n_trials_stim_A_phase_1: debugProbs.stimA_phase1_total,
        meta_debug_n_trials_stim_B_phase_1: debugProbs.stimB_phase1_total
      };

      // ⭐ Construir cabecera del CSV combinando metadatos y columnas de datos
      // COLUMNAS REFACTORIZADAS: phase→reversal_block, reversal→is_reversal_trial, +is_reversal_phase
      const metaKeys = Object.keys(meta);
      const dataKeys = [
        'participant_id', 
        'trial', 
        'choice_code', 
        'reward', 
        'outcome',                   // NUEVO: -1 (pérdida) o 1 (ganancia)
        'actual_is_correct', 
        'correct_option_in_block',   // NUEVO: opción correcta (A o B) para el bloque actual
        'misleading', 
        'is_reversal_trial',        // RENOMBRADO desde 'reversal'
        'reversal_block',            // RENOMBRADO desde 'phase'
        'is_reversal_phase',         // NUEVO: TRUE a partir de primera reversión (ambos modos)
        'trial_in_phase',            // LEGACY: mantener por compatibilidad
        'is_reversal_first_trial',   // LEGACY: mantener por compatibilidad
        'is_perseverative', 
        'is_regressive_error',       // RENOMBRADO desde 'is_regressive' para claridad
        'rt', 
        'omission', 
        'prob_good', 
        'prob_bad', 
        'icv_global', 
        'icv_learn', 
        'icv_rev'
      ];
      
      // Añadir columnas de modo criterio si corresponde
      if (reversalMode === 'criterion') {
        dataKeys.push('reversal_number');
      }
      
      const csvHeader = [...metaKeys, ...dataKeys].map(csvEscape).join(',') + '\n';
      let csvContent = csvHeader;
      
      // ⭐ Determinar el número de reversión para cada trial en modo criterio
      let reversalNumberByTrial = {};
      if (reversalMode === 'criterion') {
        // Reconstruir el número de reversión para cada trial basado en reversalData
        let currentRevNum = 0;
        let trialsSinceLastReversal = 0;
        
        for (let i = 0; i < trials.length; i++) {
          const t = trials[i];
          if (t.is_reversal_initiation === 1 && t.reversal === 1) {
            currentRevNum++;
            trialsSinceLastReversal = 0;
          }
          reversalNumberByTrial[t.trial] = currentRevNum;
          if (t.reversal === 1) {
            trialsSinceLastReversal++;
          }
        }
      }

      // ⭐ Generar filas del CSV con metadatos al principio de cada línea
      trials.forEach(t => {
        // Usar helper legacy para calcular trial_in_phase (mantener compatibilidad)
        const { phase: legacyPhase, trial_in_phase, is_reversal_first_trial } = computePhaseAndTrialInPhase(t.trial);
        const choiceNum = t.choice === 'A' ? 1 : (t.choice === 'B' ? 2 : 'NA');
        
        // reward (0/1) = feedback MOSTRADO al participante
        // → Puede ser engañoso (misleading=1)
        // → Usar para modelos RL que aprenden del feedback recibido
        const reward = t.omission === 1 ? 'NA' : (t.feedbackCorrect ? 1 : 0);
        
        // outcome (-1/1) = feedback como ganancia o pérdida
        const outcome = t.omission === 1 ? 'NA' : (t.feedbackCorrect ? 1 : -1);
        
        // actual_is_correct (0/1) = corrección OBJETIVA
        // → Usar para análisis conductual (accuracy real)
        const actual_is_correct = t.omission === 1 ? 'NA' : (t.actual_is_correct !== undefined ? t.actual_is_correct : 'NA');
        
        // correct_option_in_block: determinar cuál es la opción correcta en este bloque
        // En el bloque 0 (aprendizaje inicial), la opción correcta es la que se eligió correctamente
        // En bloques de reversión (1, 2, ...), es la opción opuesta a la del bloque anterior
        let correct_option_in_block = 'NA';
        if (t.correctStimulus) {
          correct_option_in_block = t.correctStimulus;
        }
        
        // Obtener valores del trial object (sistema refactorizado)
        const reversalBlockValue = t.reversalBlock !== undefined ? t.reversalBlock : 0;
        const isReversalTrialValue = t.isReversalTrial !== undefined ? t.isReversalTrial : 0;
        const isReversalPhaseValue = t.reversalPhase !== undefined ? t.reversalPhase : 0;
        const isRegressiveErrorValue = t.is_regressive !== undefined ? t.is_regressive : 0;
        
        // Construir línea con valores de metadatos + datos del trial
        const metaValues = metaKeys.map(key => meta[key]);
        const dataValues = [
          participantId,
          t.trial,
          choiceNum,
          reward,
          outcome,                    // NUEVO: outcome (-1 o 1)
          actual_is_correct,
          correct_option_in_block,    // NUEVO: correct_option_in_block (A o B)
          t.misleading,
          isReversalTrialValue,      // NUEVA COLUMNA: is_reversal_trial
          reversalBlockValue,         // NUEVA COLUMNA: reversal_block (antes 'phase')
          isReversalPhaseValue,       // NUEVA COLUMNA: is_reversal_phase
          trial_in_phase,             // LEGACY: mantener
          is_reversal_first_trial,    // LEGACY: mantener
          t.is_perseverative,
          isRegressiveErrorValue,     // RENOMBRADA: is_regressive_error
          t.reactionTime,
          t.omission,
          probGood,
          probBad,
          icvGlobal,
          icvLearn,
          icvRev
        ];
        
        if (reversalMode === 'criterion') {
          dataValues.push(reversalNumberByTrial[t.trial] || 0);
        }
        
        // ⭐ Aplicar csvEscape a todos los valores para garantizar formato CSV correcto
        csvContent += [...metaValues, ...dataValues].map(csvEscape).join(',') + '\n';
      });

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `PRLT_${participantId}_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }


    //INICIO CÁLCULOS COMPUTACIONALES

      //=============================================================================
      // CÁLCULOS COMPUTACIONALES - MODELOS DE REINFORCEMENT LEARNING
      // Versión mejorada con fórmulas exactas según Waltmann et al. (2022)
      //=============================================================================
      
      // ======== UTILIDADES PARA MODELADO (MLE individual) ========
      
      function logSumExp(a, b) {
        const m = Math.max(a, b);
        return m + Math.log(Math.exp(a - m) + Math.exp(b - m));
      }
      
      function clamp(x, l, u) {
        return Math.min(u, Math.max(l, x));
      }
    
      // ========================================================================
      // BUILD CHOICES AND REWARDS - Prepara datos para modelos RL
      // ========================================================================
      // rewards_01: feedback mostrado (0/1) - para modelos en espacio [0,1]
      // rewards_pm1: feedback mostrado (-1/+1) - para modelos en espacio [-1,+1]
      // IMPORTANTE: Ambos usan feedbackCorrect (el feedback MOSTRADO), NO actual_is_correct
      // Los modelos RL aprenden del feedback que recibió el participante, aunque sea engañoso
      // ========================================================================
      function buildChoicesRewards(validTrials) {
        const choices = validTrials.map(t => t.choice === 'A' ? 0 : 1);
        const rewards_01 = validTrials.map(t => t.feedbackCorrect ? 1 : 0);
        const rewards_pm1 = rewards_01.map(r => r === 1 ? +1 : -1);
        return { choices, rewards_01, rewards_pm1 };
      }

      //=============================================================================
      // DEFINICIÓN DE GRIDS (rejillas de búsqueda)
      //=============================================================================

         //=============================================================================
      // DEFINICIÓN DE GRIDS (IDÉNTICOS AL PYTHON)
      //=============================================================================
      
      // Función auxiliar linspace (como NumPy)
      function linspace(start, end, num) {
        const step = (end - start) / (num - 1);
        return Array.from({length: num}, (_, i) => parseFloat((start + step * i).toFixed(6)));
      }
      
      // Generar grids EXACTOS del Python
      const alphas_python = linspace(0.01, 0.99, 25);
      
      // betas = np.r_[np.linspace(0.3,4,16), np.linspace(5,15,6)]
      const betas_part1 = linspace(0.3, 4, 16);
      const betas_part2 = linspace(5, 15, 6);
      const betas_python = [...betas_part1, ...betas_part2];
      
      const phis_python = linspace(0.05, 0.95, 15);
      const rhos_exp_python = linspace(0.10, 0.95, 12);
      const rhos_sensib_python = linspace(0.01, 0.99, 25);
      const rhos_sensib_du_python = linspace(0.01, 0.99, 21);
      
      // Tau/kappa for stickiness model (perseveration parameter)
      const taus_python = linspace(0.0, 5.0, 21);
      
      const GRIDS = {
        AB: {
          alphas: alphas_python,  // 25 valores
          betas: betas_python     // 22 valores
        },
        
        ABdual: {
          alphas_pos: alphas_python,
          alphas_neg: alphas_python,
          betas: betas_python
        },
        
        ABStickiness: {
          alphas: alphas_python,
          betas: betas_python,
          taus: taus_python         // 21 valores
        },
        
        RS: {
          alphas: alphas_python,
          rhos: rhos_sensib_python  // 25 valores
        },
        
        DU2RHOa: {
          alphas: alphas_python,
          rho_wins: rhos_sensib_du_python,   // 21 valores
          rho_losses: rhos_sensib_du_python
        },
        
        EWA: {
          phis: phis_python,        // 15 valores
          rhos: rhos_exp_python,    // 12 valores
          betas: betas_python       // 22 valores
        }
      };
      
      console.log("📊 GRIDS cargados:");
      console.log("AB alphas:", GRIDS.AB.alphas.length, "valores");
      console.log("AB betas:", GRIDS.AB.betas.length, "valores");
      console.log("EWA phis:", GRIDS.EWA.phis.length, "valores");
      console.log("EWA rhos:", GRIDS.EWA.rhos.length, "valores");
      
      //=============================================================================
      // UMBRALES PARA INTERPRETACIÓN CUALITATIVA
      //=============================================================================
      
      const THR = {
        // Q-learning (AB)
        alpha_low: 0.30,
        alpha_high: 0.90,
        beta_low: 2.60,
        beta_high: 7.35,
      
        // Stickiness (τ/κ)
        tau_low: 0.5,
        tau_high: 2.0,
      
        // EWA
        phi_low: 0.10,
        phi_high: 0.60,
        rho_ewa_low: 0.28,
        rho_ewa_high: 0.88,
      
        // Reinforcement Sensitivity (Waltmann)
        rho_sensib_low: 0.30,
        rho_sensib_high: 0.85,
      
        // Learning sensitivity compuesta (α * ρ)
        learning_sens_low: 0.20,
        learning_sens_high: 0.75
      };
      
      //=============================================================================
      // MODELO 1: Q-LEARNING (α, β) - RESCORLA-WAGNER
      // Fórmula: Q(t+1) = Q(t) + α * (r - Q(t))
      // Recompensas: r ∈ {-1, +1} (simetría en softmax) por error paso a 0,1 que parece más lógico
      //=============================================================================
      function nll_rw_softmax(choices, rewards, alpha, beta) {
        alpha = clamp(alpha, 0, 1);
        beta = clamp(beta, 1e-6, 20);
        let QA = 0.5, QB = 0.5, nll = 0; // ⚠️ CAMBIO: Q₀ = 0.5 (antes era 0)
        const eps = 1e-9;
      
        for (let t = 0; t < choices.length; t++) {
          const la = beta * QA, lb = beta * QB;
          const logZ = logSumExp(la, lb);
          const pA = Math.exp(la - logZ);
          const p = (choices[t] === 0) ? pA : (1 - pA);
          nll -= Math.log(Math.max(p, eps));
      
          const r = rewards[t]; // r ∈ {0, 1}
          if (choices[t] === 0) {
            QA += alpha * (r - QA);
          } else {
            QB += alpha * (r - QB);
          }
        }
        return nll;
      }
      
      
      function fitRL_singleAlpha(choices, rewards) {
        let best = { alpha: 0.5, beta: 1, nll: Infinity };
        for (const alpha of GRIDS.AB.alphas) {
          for (const beta of GRIDS.AB.betas) {
            const nll = nll_rw_softmax(choices, rewards, alpha, beta);
            if (nll < best.nll) {
              best = { alpha: alpha.toFixed(3), beta: beta.toFixed(3), nll };
            }
          }
        }
        return best;
      }

      //=============================================================================
      // MODELO 1b: Q-LEARNING "FICTITIOUS" (α, β) - Input -1/+1 según hbayesDM
      // Fórmula: Q(t+1) = Q(t) + α * (r - Q(t))
      // Recompensas: r ∈ {-1, +1} (simetría como en hbayesDM)
      // Q₀ = 0 (neutral para -1/+1)
      //=============================================================================
      function nll_rw_softmax_fictitious(choices, rewards, alpha, beta) {
        alpha = clamp(alpha, 0, 1);
        beta = clamp(beta, 1e-6, 20);
        let QA = 0, QB = 0, nll = 0; // Q₀ = 0 (neutral para -1/+1)
        const eps = 1e-9;
      
        for (let t = 0; t < choices.length; t++) {
          const la = beta * QA, lb = beta * QB;
          const logZ = logSumExp(la, lb);
          const pA = Math.exp(la - logZ);
          const p = (choices[t] === 0) ? pA : (1 - pA);
          nll -= Math.log(Math.max(p, eps));
      
          const r = rewards[t]; // r ∈ {-1, +1}
          if (choices[t] === 0) {
            QA += alpha * (r - QA);
          } else {
            QB += alpha * (r - QB);
          }
        }
        return nll;
      }
      
      function fitRL_singleAlpha_fictitious(choices, rewards) {
        let best = { alpha: 0.5, beta: 1, nll: Infinity };
        for (const alpha of GRIDS.AB.alphas) {
          for (const beta of GRIDS.AB.betas) {
            const nll = nll_rw_softmax_fictitious(choices, rewards, alpha, beta);
            if (nll < best.nll) {
              best = { alpha: alpha.toFixed(3), beta: beta.toFixed(3), nll };
            }
          }
        }
        return best;
      }


      

    
      //=============================================================================
      // MODELO 2: Q-LEARNING DUAL (α⁺, α⁻, β)
      // Diferentes tasas de aprendizaje para recompensas positivas y negativas
      // Recompensas: r ∈ {-1, +1}. TAMBIÉN PASAMOS A 0,1 
      //=============================================================================
      
      function nll_rw_dual(choices, rewards, alphaP, alphaN, beta) {
        alphaP = clamp(alphaP, 0, 1);
        alphaN = clamp(alphaN, 0, 1);
        beta = clamp(beta, 1e-6, 20);
        let QA = 0.5, QB = 0.5, nll = 0; // ⚠️ CAMBIO: Q₀ = 0.5 (antes era 0)
        const eps = 1e-9;
      
        for (let t = 0; t < choices.length; t++) {
          const la = beta * QA, lb = beta * QB;
          const logZ = logSumExp(la, lb);
          const pA = Math.exp(la - logZ);
          const p = (choices[t] === 0) ? pA : (1 - pA);
          nll -= Math.log(Math.max(p, eps));
      
          const r = rewards[t]; // r ∈ {0, 1} (no {-1,+1})
          const alpha_used = (r === 1) ? alphaP : alphaN; // ⚠️ CAMBIO: ahora r===1 (antes r===+1)
      
          if (choices[t] === 0) {
            QA += alpha_used * (r - QA);
          } else {
            QB += alpha_used * (r - QB);
          }
        }
        return nll;
      }
      
      function fitRL_dualAlpha(choices, rewards) {
        let best = { alphaR: 0.5, alphaP: 0.5, beta: 1, nll: Infinity };
        for (const alphaP of GRIDS.ABdual.alphas_pos) {
          for (const alphaN of GRIDS.ABdual.alphas_neg) {
            for (const beta of GRIDS.ABdual.betas) {
              const nll = nll_rw_dual(choices, rewards, alphaP, alphaN, beta);
              if (nll < best.nll) {
                best = {
                  alphaR: alphaP.toFixed(3), // α⁺ (recompensa)
                  alphaP: alphaN.toFixed(3), // α⁻ (castigo)
                  beta: beta.toFixed(3),
                  nll
                };
              }
            }
          }
        }
        return best;
      }

      //=============================================================================
      // MODELO 2c: Q-LEARNING DUAL "FICTITIOUS" (α⁺, α⁻, β) - Input -1/+1
      // Diferentes tasas de aprendizaje para recompensas positivas y negativas
      // Recompensas: r ∈ {-1, +1} (simetría como en hbayesDM)
      // Q₀ = 0 (neutral para -1/+1)
      //=============================================================================
      
      function nll_rw_dual_fictitious(choices, rewards, alphaP, alphaN, beta) {
        alphaP = clamp(alphaP, 0, 1);
        alphaN = clamp(alphaN, 0, 1);
        beta = clamp(beta, 1e-6, 20);
        let QA = 0, QB = 0, nll = 0; // Q₀ = 0 (neutral para -1/+1)
        const eps = 1e-9;
      
        for (let t = 0; t < choices.length; t++) {
          const la = beta * QA, lb = beta * QB;
          const logZ = logSumExp(la, lb);
          const pA = Math.exp(la - logZ);
          const p = (choices[t] === 0) ? pA : (1 - pA);
          nll -= Math.log(Math.max(p, eps));
      
          const r = rewards[t]; // r ∈ {-1, +1}
          const alpha_used = (r === 1) ? alphaP : alphaN; // r===1 para recompensa
      
          if (choices[t] === 0) {
            QA += alpha_used * (r - QA);
          } else {
            QB += alpha_used * (r - QB);
          }
        }
        return nll;
      }
      
      function fitRL_dualAlpha_fictitious(choices, rewards) {
        let best = { alphaR: 0.5, alphaP: 0.5, beta: 1, nll: Infinity };
        for (const alphaP of GRIDS.ABdual.alphas_pos) {
          for (const alphaN of GRIDS.ABdual.alphas_neg) {
            for (const beta of GRIDS.ABdual.betas) {
              const nll = nll_rw_dual_fictitious(choices, rewards, alphaP, alphaN, beta);
              if (nll < best.nll) {
                best = {
                  alphaR: alphaP.toFixed(3), // α⁺ (recompensa)
                  alphaP: alphaN.toFixed(3), // α⁻ (castigo)
                  beta: beta.toFixed(3),
                  nll
                };
              }
            }
          }
        }
        return best;
      }


      //=============================================================================
      // MODELO 2b: AB + STICKINESS (α, β, τ) - Waltmann et al. 2022
      // Fórmula: P(choice) = exp(β*Q + τ*I_prev) / Σ(exp(β*Q + τ*I_prev))
      // Donde I_prev es indicador de elección previa (1 si fue elegida, 0 si no)
      // τ (tau/kappa) captura la perseveración independiente del feedback
      // Recompensas: r ∈ {0, 1}
      //=============================================================================
      
      function nll_rw_stickiness(choices, rewards, alpha, beta, tau) {
        alpha = clamp(alpha, 0, 1);
        beta = clamp(beta, 1e-6, 20);
        tau = clamp(tau, 0, 10);
        let QA = 0.5, QB = 0.5, nll = 0;
        const eps = 1e-9;
        let prevChoice = null; // Sin elección previa en primer trial
      
        for (let t = 0; t < choices.length; t++) {
          // Bonus de stickiness: +τ si fue elegida en trial anterior
          const stickyA = (prevChoice === 0) ? tau : 0;
          const stickyB = (prevChoice === 1) ? tau : 0;
          
          // Softmax con Q-values y stickiness
          const la = beta * QA + stickyA;
          const lb = beta * QB + stickyB;
          const logZ = logSumExp(la, lb);
          const pA = Math.exp(la - logZ);
          const p = (choices[t] === 0) ? pA : (1 - pA);
          nll -= Math.log(Math.max(p, eps));
      
          // Actualizar Q-values (como en Q-learning estándar)
          const r = rewards[t]; // r ∈ {0, 1}
          if (choices[t] === 0) {
            QA += alpha * (r - QA);
          } else {
            QB += alpha * (r - QB);
          }
          
          // Guardar elección actual para próximo trial
          prevChoice = choices[t];
        }
        return nll;
      }
      
      function fitRL_stickiness(choices, rewards) {
        let best = { alpha: 0.5, beta: 1, tau: 0, nll: Infinity };
        for (const alpha of GRIDS.ABStickiness.alphas) {
          for (const beta of GRIDS.ABStickiness.betas) {
            for (const tau of GRIDS.ABStickiness.taus) {
              const nll = nll_rw_stickiness(choices, rewards, alpha, beta, tau);
              if (nll < best.nll) {
                best = {
                  alpha: alpha.toFixed(3),
                  beta: beta.toFixed(3),
                  tau: tau.toFixed(3),
                  nll
                };
              }
            }
          }
        }
        return best;
      }



      


    
      
      //=============================================================================
      // MODELO 3: REINFORCEMENT SENSITIVITY (α, ρ) - Waltmann et al. 2022
      // Fórmula: Q(t+1) = Q(t) + α * ρ * (r - Q(t))
      // Recompensas: r ∈ {0, 1} (según Waltmann original)
      // NOTA: Softmax con β ≡ 1 (fijo, no estimado)
      //=============================================================================
      
      function nll_rs_singleRho(choices, rewards, alpha, rho) {
        alpha = clamp(alpha, 0, 1);
        rho = clamp(rho, 0, 1);
        const beta = 1.0; // β fijo (característica del modelo RS)
        let QA = 0.5, QB = 0.5, nll = 0; // Q₀ = 0.5 (neutral para r ∈ {0,1})
        const eps = 1e-9;
      
        for (let t = 0; t < choices.length; t++) {
          // Softmax con β = 1
          const la = beta * QA, lb = beta * QB;
          const logZ = logSumExp(la, lb);
          const pA = Math.exp(la - logZ);
          const p = (choices[t] === 0) ? pA : (1 - pA);
          nll -= Math.log(Math.max(p, eps));
      
          // Actualización con sensibilidad ρ
          const r = rewards[t]; // r ∈ {0, 1}
          const learning_sens = alpha * rho; // Parámetro compuesto
      
          if (choices[t] === 0) {
            QA += learning_sens * (r - QA);
          } else {
            QB += learning_sens * (r - QB);
          }
        }
        return nll;
      }
      
      function fitRS_singleRho(choices, rewards) {
        let best = { alpha: 0.5, rho: 0.5, q0: 0.5, nll: Infinity };
        for (const alpha of GRIDS.RS.alphas) {
          for (const rho of GRIDS.RS.rhos) {
            const nll = nll_rs_singleRho(choices, rewards, alpha, rho);
            if (nll < best.nll) {
              best = {
                alpha: alpha.toFixed(3),
                rho: rho.toFixed(3),
                q0: '0.5', // Q₀ fijo
                nll
              };
            }
          }
        }
        return best;
      }
      
      //=============================================================================
      // MODELO 4: REINFORCEMENT SENSITIVITY DUAL (α, ρ_win, ρ_loss) - DU-2RHO-a
      // Diferentes sensibilidades para recompensas positivas y negativas
      // Recompensas: r ∈ {-1, +1} (para simetría en dual update)
      // NOTA: Softmax con β ≡ 1 (fijo)
      //=============================================================================
      
      function nll_du2rhoa(choices, rewards, alpha, rhoWin, rhoLoss) {
        alpha = clamp(alpha, 0, 1);
        rhoWin = clamp(rhoWin, 0, 1);
        rhoLoss = clamp(rhoLoss, 0, 1);
        const beta = 1.0; // β fijo
        let QA = 0, QB = 0, nll = 0;
        const eps = 1e-9;
      
        for (let t = 0; t < choices.length; t++) {
          const la = beta * QA, lb = beta * QB;
          const logZ = logSumExp(la, lb);
          const pA = Math.exp(la - logZ);
          const p = (choices[t] === 0) ? pA : (1 - pA);
          nll -= Math.log(Math.max(p, eps));
      
          const r = rewards[t]; // r ∈ {-1, +1}
          const rho_used = (r === +1) ? rhoWin : rhoLoss; // Sensibilidad según signo
          const learning_sens = alpha * rho_used;
      
          if (choices[t] === 0) {
            QA += learning_sens * (r - QA);
          } else {
            QB += learning_sens * (r - QB);
          }
        }
        return nll;
      }
      
      function fitDU2RHOa(choices, rewards) {
        let best = { alpha: 0.5, rhoWin: 0.5, rhoLoss: 0.5, nll: Infinity };
        for (const alpha of GRIDS.DU2RHOa.alphas) {
          for (const rhoWin of GRIDS.DU2RHOa.rho_wins) {
            for (const rhoLoss of GRIDS.DU2RHOa.rho_losses) {
              const nll = nll_du2rhoa(choices, rewards, alpha, rhoWin, rhoLoss);
              if (nll < best.nll) {
                best = {
                  alpha: alpha.toFixed(3),
                  rhoWin: rhoWin.toFixed(3),
                  rhoLoss: rhoLoss.toFixed(3),
                  nll
                };
              }
            }
          }
        }
        return best;
      }
      
      //=============================================================================
      // MODELO 5: EWA (Experience-Weighted Attraction) - Camerer & Ho
      // Fórmula: Q_chosen(t+1) = (φ*N(t)*Q_chosen(t) + r) / N(t+1)
      //          N(t+1) = ρ*N(t) + 1
      // Recompensas: r ∈ {-1, +1} (según hbayesDM)
      //=============================================================================
      
      function nll_ewa(choices, rewards, phi, rho, beta) {
        phi = clamp(phi, 0, 1);
        rho = clamp(rho, 0, 1);
        beta = clamp(beta, 1e-6, 20);
        let NA = 0, NB = 0, N = 1, nll = 0; // N inicial = 1
        const eps = 1e-9;
      
        for (let t = 0; t < choices.length; t++) {
          // Softmax
          const la = beta * NA, lb = beta * NB;
          const logZ = logSumExp(la, lb);
          const pA = Math.exp(la - logZ);
          const p = (choices[t] === 0) ? pA : (1 - pA);
          nll -= Math.log(Math.max(p, eps));
      
          // Actualización EWA
          const r = rewards[t]; // r ∈ {-1, +1}
          const Nprev = N;
          const Nnext = rho * Nprev + 1;
      
          if (choices[t] === 0) {
            NA = (phi * Nprev * NA + r) / Nnext;
            NB = (phi * Nprev * NB) / Nnext;
          } else {
            NB = (phi * Nprev * NB + r) / Nnext;
            NA = (phi * Nprev * NA) / Nnext;
          }
          N = Nnext;
        }
        return nll;
      }
      
      function fitEWA_binary(choices, rewards) {
        let best = { phi: 0.5, rho: 0.5, beta: 1, nll: Infinity };
        for (const phi of GRIDS.EWA.phis) {
          for (const rho of GRIDS.EWA.rhos) {
            for (const beta of GRIDS.EWA.betas) {
              const nll = nll_ewa(choices, rewards, phi, rho, beta);
              if (nll < best.nll) {
                best = {
                  phi: phi.toFixed(3),
                  rho: rho.toFixed(3),
                  beta: beta.toFixed(3),
                  nll
                };
              }
            }
          }
        }
        return best;
      }
      
      //=============================================================================
      // FUNCIONES DE INTERPRETACIÓN CUALITATIVA
      //=============================================================================
      
      function interpretAlpha(a) {
        if (a < THR.alpha_low) return 'baja';
        if (a < THR.alpha_high) return 'media';
        return 'alta';
      }
      
      function interpretBeta(b) {
        if (b < THR.beta_low) return 'baja';
        if (b < THR.beta_high) return 'media';
        return 'alta';
      }
      
      function interpretRho(r) {
        if (r < THR.rho_sensib_low) return 'baja';
        if (r < THR.rho_sensib_high) return 'media';
        return 'alta';
      }
      
      function interpretPhi(p) {
        if (p < THR.phi_low) return 'baja';
        if (p < THR.phi_high) return 'media';
        return 'alta';
      }
      
      function interpretRhoEWA(r) {
        if (r < THR.rho_ewa_low) return 'baja';
        if (r < THR.rho_ewa_high) return 'media';
        return 'alta';
      }
      
      function interpretLearningSens(ls) {
        if (ls < THR.learning_sens_low) return 'baja';
        if (ls < THR.learning_sens_high) return 'media';
        return 'alta';
      }
      
      function interpretTau(t) {
        if (t < THR.tau_low) return 'baja';
        if (t < THR.tau_high) return 'media';
        return 'alta';
      }
      
      //=============================================================================
      // CLASIFICACIÓN DE PERFILES EWA (8 perfiles según φ × ρ × β)
      //=============================================================================
      
      function classifyEWAProfile(phi, rho, beta) {
        const phiCat = phi < THR.phi_high ? 'bajo' : 'alto';
        const rhoCat = rho < THR.rho_ewa_high ? 'bajo' : 'alto';
        const betaCat = beta < THR.beta_high ? 'baja' : 'alta';
      
        const profiles = {
          'bajo_bajo_baja': 'Volátil-Exploratorio (memoria corta, exploración alta)',
          'bajo_bajo_alta': 'Volátil-Explotador (memoria corta, explotación alta)',
          'bajo_alto_baja': 'Reciente-Exploratorio (peso reciente, exploración)',
          'bajo_alto_alta': 'Reciente-Explotador (peso reciente, explotación)',
          'alto_bajo_baja': 'Histórico-Exploratorio (integra historia, explora)',
          'alto_bajo_alta': 'Histórico-Explotador (integra historia, explota)',
          'alto_alto_baja': 'Estable-Exploratorio (memoria larga, exploración)',
          'alto_alto_alta': 'Estable-Explotador (memoria larga, explotación)'
        };
      
        const key = `${phiCat}_${rhoCat}_${betaCat}`;
        return profiles[key] || 'Perfil intermedio';
      }

      //=============================================================================
      // CLASIFICACIÓN DE PERFILES AB (9 perfiles según α × β)
      //=============================================================================
      
      function classifyABProfile(alpha, beta) {
        const alphaLevel = (alpha < THR.alpha_low) ? 'bajo' : 
                           (alpha < THR.alpha_high) ? 'medio' : 'alto';
        const betaLevel = (beta < THR.beta_low) ? 'bajo' : 
                          (beta < THR.beta_high) ? 'medio' : 'alto';
        
        const profiles = {
          'alto_alto': 'FLEXIBLE-ADAPTATIVO: Aprendizaje rápido con decisiones consistentes. Perfil óptimo para entornos volátiles.',
          'alto_medio': 'REACTIVO-BALANCEADO: Aprendizaje rápido con decisiones equilibradas. Adapta bien pero puede sobreactuar.',
          'alto_bajo': 'VOLÁTIL/EXPLORATORIO: Aprendizaje rápido pero decisiones ruidosas. Switching excesivo, dificultad para mantener estrategia.',
          
          'medio_alto': 'EQUILIBRADO-DETERMINISTA: Aprendizaje moderado con alta convicción. Estable pero puede tender a rigidez.',
          'medio_medio': 'INTERMEDIO-TÍPICO: Aprendizaje y consistencia moderados. Perfil neurotípico sin extremos marcados.',
          'medio_bajo': 'EQUILIBRADO-EXPLORATORIO: Aprendizaje moderado con exploración. Flexible pero puede perder foco.',
          
          'bajo_alto': 'PERSEVERANTE/RÍGIDO: Aprendizaje lento con alta convicción. Tendencia a atascos (set-shifting deficiente).',
          'bajo_medio': 'CONSERVADOR-BALANCEADO: Aprendizaje lento con decisiones equilibradas. Prudente pero puede perder oportunidades.',
          'bajo_bajo': 'DESORGANIZADO/CAÓTICO: Aprendizaje lento y decisiones inconsistentes. Patrón disfuncional (posible desconexión tarea-refuerzo).'
        };
        
        const key = `${alphaLevel}_${betaLevel}`;
        return profiles[key] || `α ${alphaLevel}, β ${betaLevel}`;
      }


      // === TEST: ¿HTML puede calcular NLL correctamente para α=0.173? ===
      console.log("\n🧪 TEST: Calculando NLL con α=0.173, β=15.0");
      const choices_test = [1, 0, 0, 0, 1, 1, 1, 1, 1, 1];
      const rewards_test = [1, 1, 0, 0, 1, 1, 1, 1, 0, 1];
      const nll_test = nll_rw_softmax(choices_test, rewards_test, 0.173, 15.0);      
      console.log(`NLL calculado por HTML: ${nll_test.toFixed(6)}`);
      console.log(`NLL calculado por Python: 4.759389`);
      console.log(`¿Coinciden? ${Math.abs(nll_test - 4.759389) < 0.001 ? '✅ SÍ' : '❌ NO'}`);

    
      //=============================================================================
      // FUNCIÓN DE ANÁLISIS CUALITATIVO
      //=============================================================================
      
      function generateQualitativeAnalysis(fitQL1, fitQL2, fitABSticky, fitRS1, fitRS2, fitEWA) {
        let html = '';
        
        // 1. Comparación entre modelos (basado en NLL)
        html += '<div style="background:rgba(59,130,246,0.05);padding:15px;border-radius:8px;border-left:3px solid #3b82f6;margin-bottom:15px;">';
        html += '<p><strong style="color:#3b82f6;">📊 Comparación entre Modelos</strong></p>';
        
        const nllDiff_QL_EWA = fitQL1.nll - fitEWA.nll;
        const nllDiff_AB_ABdual = fitQL1.nll - fitQL2.nll;
        const nllDiff_AB_Sticky = fitQL1.nll - fitABSticky.nll;
        const nllDiff_RS_AB = fitRS1.nll - fitQL1.nll;
        const nllDiff_DU2RHO_ABdual = fitRS2.nll - fitQL2.nll;
        
        // Q-learning vs EWA
        if (Math.abs(nllDiff_QL_EWA) > 5) {
          if (fitQL1.nll < fitEWA.nll) {
            html += '<p style="margin-left:15px;font-size:13px;">• <strong>Q-learning &gt; EWA:</strong> Aprendizaje ensayo a ensayo con mayor consistencia. El participante ajusta sus expectativas rápidamente tras cada feedback.</p>';
          } else {
            html += '<p style="margin-left:15px;font-size:13px;">• <strong>EWA &gt; Q-learning:</strong> Aprendizaje por experiencia acumulada. El participante integra historia extensa e interpreta la estabilidad/volatilidad del entorno.</p>';
          }
        } else {
          html += '<p style="margin-left:15px;font-size:13px;">• <strong>Q-learning ≈ EWA:</strong> Ambos modelos explican igual el comportamiento (diferencia marginal).</p>';
        }
        
        // AB vs ABdual
        if (Math.abs(nllDiff_AB_ABdual) > 5) {
          if (fitQL1.nll < fitQL2.nll) {
            html += '<p style="margin-left:15px;font-size:13px;">• <strong>AB &gt; ABdual:</strong> Aprendizaje independiente de valencia. El participante procesa recompensas y castigos de forma simétrica.</p>';
          } else {
            html += '<p style="margin-left:15px;font-size:13px;">• <strong>ABdual &gt; AB:</strong> Aprendizaje diferenciado por valencia. Sensibilidad distinta a premios vs castigos (α⁺=' + fitQL2.alphaR + ' vs α⁻=' + fitQL2.alphaP + ').</p>';
          }
        } else {
          html += '<p style="margin-left:15px;font-size:13px;">• <strong>AB ≈ ABdual:</strong> No hay evidencia clara de aprendizaje asimétrico por valencia.</p>';
        }
        
        // AB vs AB+Stickiness
        if (Math.abs(nllDiff_AB_Sticky) > 5) {
          if (fitABSticky.nll < fitQL1.nll) {
            html += '<p style="margin-left:15px;font-size:13px;">• <strong>AB+Stickiness &gt; AB:</strong> Perseveración/repetición independiente del feedback (τ=' + fitABSticky.tau + '). Las elecciones muestran tendencia a repetir la opción anterior más allá del aprendizaje.</p>';
          } else {
            html += '<p style="margin-left:15px;font-size:13px;">• <strong>AB &gt; AB+Stickiness:</strong> El comportamiento se explica mejor sin perseveración. Las elecciones están bien guiadas por el feedback recibido.</p>';
          }
        } else {
          html += '<p style="margin-left:15px;font-size:13px;">• <strong>AB ≈ AB+Stickiness:</strong> Perseveración marginal o ausente (τ=' + fitABSticky.tau + ').</p>';
        }
        
        // Rho-Sensib vs AB
        if (Math.abs(nllDiff_RS_AB) > 5) {
          if (fitRS1.nll < fitQL1.nll) {
            html += '<p style="margin-left:15px;font-size:13px;">• <strong>Rho-Sensib &gt; AB:</strong> Mejor explicado por sensibilidad reducida al refuerzo (ρ=' + fitRS1.rho + '). Mayor insensibilidad general que fallo en ejecución.</p>';
          } else {
            html += '<p style="margin-left:15px;font-size:13px;">• <strong>AB &gt; Rho-Sensib:</strong> Sensibilidad al refuerzo normal. El modelo simple explica mejor.</p>';
          }
        }
        
        // DU-2RHO-a vs ABdual
        if (Math.abs(nllDiff_DU2RHO_ABdual) > 5) {
          if (fitRS2.nll < fitQL2.nll) {
            html += '<p style="margin-left:15px;font-size:13px;">• <strong>DU-2RHO-a &gt; ABdual:</strong> Procesamiento asimétrico de valencia por sensibilidad diferencial (ρ<sub>win</sub>=' + fitRS2.rhoWin + ', ρ<sub>loss</sub>=' + fitRS2.rhoLoss + ') mejor que aprendizaje selectivo.</p>';
          }
        }
        
        html += '</div>';
        
        // 2. Análisis de variables específicas
        html += '<div style="background:rgba(16,185,129,0.05);padding:15px;border-radius:8px;border-left:3px solid #10b981;margin-bottom:15px;">';
        html += '<p><strong style="color:#10b981;">🎯 Variables de Decisión</strong></p>';
        
        // Beta (exploración vs explotación)
        const beta = parseFloat(fitQL1.beta);
        if (beta < THR.beta_low) {
          html += '<p style="margin-left:15px;font-size:13px;">• <strong>Patrón Exploratorio</strong> (β=' + fitQL1.beta + ' &lt; ' + THR.beta_low + '): Decisiones ruidosas/inconsistentes. Exploración activa con dificultad para mantener estrategia estable. Posible switching excesivo.</p>';
        } else if (beta < THR.beta_high) {
          html += '<p style="margin-left:15px;font-size:13px;">• <strong>Patrón Balanceado</strong> (β=' + fitQL1.beta + '): Equilibrio entre exploración y explotación. Flexibilidad adaptativa moderada.</p>';
        } else {
          html += '<p style="margin-left:15px;font-size:13px;">• <strong>Patrón Explotador</strong> (β=' + fitQL1.beta + ' &gt; ' + THR.beta_high + '): Decisiones consistentes y deterministas. Alta convicción en opciones preferidas. Posible rigidez en contextos volátiles.</p>';
        }
        
        html += '</div>';
        
        // 3. Learning rate analysis
        html += '<div style="background:rgba(245,158,11,0.05);padding:15px;border-radius:8px;border-left:3px solid #f59e0b;margin-bottom:15px;">';
        html += '<p><strong style="color:#f59e0b;">📈 Sensibilidad al Aprendizaje</strong></p>';
        
        const alpha = parseFloat(fitQL1.alpha);
        if (alpha < THR.alpha_low) {
          html += '<p style="margin-left:15px;font-size:13px;">• <strong>Aprendizaje Lento</strong> (α=' + fitQL1.alpha + ' &lt; ' + THR.alpha_low + '): Integración gradual de feedback. Conservador, puede perder oportunidades de adaptación rápida. Si β alta: riesgo de perseveración/rigidez.</p>';
        } else if (alpha < THR.alpha_high) {
          html += '<p style="margin-left:15px;font-size:13px;">• <strong>Aprendizaje Moderado</strong> (α=' + fitQL1.alpha + '): Tasa de actualización equilibrada. Perfil neurotípico.</p>';
        } else {
          html += '<p style="margin-left:15px;font-size:13px;">• <strong>Aprendizaje Rápido</strong> (α=' + fitQL1.alpha + ' &gt; ' + THR.alpha_high + '): Alta reactividad al feedback. Adaptación flexible pero posible sobreajuste a ruido. Si β baja: volatilidad/switching excesivo.</p>';
        }
        
        // Si hay asimetría en ABdual
        if (Math.abs(nllDiff_AB_ABdual) > 5 && fitQL2.nll < fitQL1.nll) {
          const alphaR = parseFloat(fitQL2.alphaR);
          const alphaP = parseFloat(fitQL2.alphaP);
          if (alphaR > alphaP + 0.2) {
            html += '<p style="margin-left:15px;font-size:13px;">• <strong>Asimetría Positiva</strong> (α⁺ &gt; α⁻): Mayor sensibilidad a recompensas que a castigos. Perfil "optimista".</p>';
          } else if (alphaP > alphaR + 0.2) {
            html += '<p style="margin-left:15px;font-size:13px;">• <strong>Asimetría Negativa</strong> (α⁻ &gt; α⁺): Mayor sensibilidad a castigos que a recompensas. Perfil "defensivo".</p>';
          }
        }
        
        html += '</div>';
        
        // 4. Reinforcement sensitivity
        const rho = parseFloat(fitRS1.rho);
        if (rho < THR.rho_sensib_low) {
          html += '<div style="background:rgba(239,68,68,0.05);padding:15px;border-radius:8px;border-left:3px solid #ef4444;margin-bottom:15px;">';
          html += '<p><strong style="color:#ef4444;">⚠️ Sensibilidad al Refuerzo Reducida</strong></p>';
          html += '<p style="margin-left:15px;font-size:13px;">ρ = ' + fitRS1.rho + ' &lt; ' + THR.rho_sensib_low + ': Insensibilidad general al feedback. El refuerzo tiene impacto atenuado sobre el aprendizaje. Posible desconexión entre feedback y actualización de expectativas.</p>';
          html += '</div>';
        }
        
        // 5. Perseveration analysis
        const tau = parseFloat(fitABSticky.tau);
        if (tau > THR.tau_high) {
          html += '<div style="background:rgba(168,85,247,0.05);padding:15px;border-radius:8px;border-left:3px solid #a855f7;margin-bottom:15px;">';
          html += '<p><strong style="color:#a855f7;">🔄 Perseveración Elevada</strong></p>';
          html += '<p style="margin-left:15px;font-size:13px;">τ = ' + fitABSticky.tau + ' &gt; ' + THR.tau_high + ': Fuerte tendencia a repetir elección previa independiente del feedback. Posible inercia conductual o déficit en set-shifting.</p>';
          html += '</div>';
        }
        
        return html;
      }
      
      //=============================================================================
      // FUNCIÓN PRINCIPAL: AJUSTAR TODOS LOS MODELOS
      //=============================================================================
      
      function fitAllModels(validTrials) {
        // Preparar datos
        const { choices, rewards_01, rewards_pm1 } = buildChoicesRewards(validTrials);
      
        console.log("🔍 DENTRO de fitAllModels:");
        console.log("choices:", JSON.stringify(choices.slice(0, 10)));
        console.log("rewards_01:", JSON.stringify(rewards_01.slice(0, 10)));
        console.log("rewards_pm1:", JSON.stringify(rewards_pm1.slice(0, 10)));
      
        // Ajustar modelos
        console.log("⏳ Ajustando AB...");
        const fitQL1 = fitRL_singleAlpha(choices, rewards_01);
        console.log("✅ AB ajustado:", JSON.stringify(fitQL1));
      
        console.log("⏳ Ajustando AB Fictitious...");
        const fitQL1Fict = fitRL_singleAlpha_fictitious(choices, rewards_pm1);
        console.log("✅ AB Fictitious ajustado:", JSON.stringify(fitQL1Fict));
      
        console.log("⏳ Ajustando ABdual...");
        const fitQL2 = fitRL_dualAlpha(choices, rewards_01);
        console.log("✅ ABdual ajustado:", JSON.stringify(fitQL2));
      
        console.log("⏳ Ajustando ABdual Fictitious...");
        const fitQL2Fict = fitRL_dualAlpha_fictitious(choices, rewards_pm1);
        console.log("✅ ABdual Fictitious ajustado:", JSON.stringify(fitQL2Fict));
      
        console.log("⏳ Ajustando AB+Stickiness...");
        const fitABSticky = fitRL_stickiness(choices, rewards_01);
        console.log("✅ AB+Stickiness ajustado:", JSON.stringify(fitABSticky));
      
        console.log("⏳ Ajustando RS...");
        const fitRS1 = fitRS_singleRho(choices, rewards_01);
        console.log("✅ RS ajustado:", JSON.stringify(fitRS1));
      
        console.log("⏳ Ajustando DU-2RHO-a...");
        const fitRS2 = fitDU2RHOa(choices, rewards_pm1);
        console.log("✅ DU-2RHO-a ajustado:", JSON.stringify(fitRS2));
      
        console.log("⏳ Ajustando EWA...");
        const fitEWA = fitEWA_binary(choices, rewards_pm1);
        console.log("✅ EWA ajustado:", JSON.stringify(fitEWA));


        
        // === DEBUG: Verificar NLL con parámetros de Python ===
        console.log("\n🧪 VERIFICACIÓN: ¿Puede HTML reproducir el NLL de Python?");
        console.log("Usando todos los trials reales...");
        
        // Parámetros que Python encontró
        const nll_python_params = nll_rw_softmax(choices, rewards_01, 0.092, 15.0);
        console.log(`NLL con α=0.092, β=15 (Python): ${nll_python_params.toFixed(6)}`);
        
        // Parámetros que HTML encontró
        const nll_html_params = nll_rw_softmax(choices, rewards_01, parseFloat(fitQL1.alpha), parseFloat(fitQL1.beta));
        console.log(`NLL con α=${fitQL1.alpha}, β=${fitQL1.beta} (HTML): ${nll_html_params.toFixed(6)}`);
        
        console.log(`Diferencia: ${Math.abs(nll_python_params - nll_html_params).toFixed(6)}`);
        
        if (nll_python_params < nll_html_params) {
          console.log("⚠️ Python encontró un MEJOR mínimo que HTML");
        } else {
          console.log("✅ HTML encontró un mejor mínimo (raro pero posible)");
        }
        

      
        // Calcular parámetros compuestos
        const learning_sens_rs = (parseFloat(fitRS1.alpha) * parseFloat(fitRS1.rho)).toFixed(3);
        const learning_sens_win = (parseFloat(fitRS2.alpha) * parseFloat(fitRS2.rhoWin)).toFixed(3);
        const learning_sens_loss = (parseFloat(fitRS2.alpha) * parseFloat(fitRS2.rhoLoss)).toFixed(3);
      
        // Perfil EWA
        const ewaProfile = classifyEWAProfile(
          parseFloat(fitEWA.phi),
          parseFloat(fitEWA.rho),
          parseFloat(fitEWA.beta)
        );

        // ✅ AÑADE ESTO AQUÍ:
        const profileAB = classifyABProfile(
          parseFloat(fitQL1.alpha),
          parseFloat(fitQL1.beta)
        );
      
        // Generar HTML con resultados
        const compHtml = `
        <h3>Análisis Computacional (MLE individual)</h3>
        <p style="font-size:13px;color:var(--text-muted);margin-bottom:15px;">
          <strong>Nota metodológica:</strong> Modelos AB, ABdual y RS usan <code>r ∈ {0, 1}</code> con <code>Q₀=0.5</code> según literatura estándar (Waltmann 2022). 
          Modelos AB Fictitious y ABdual Fictitious usan <code>r ∈ {-1, +1}</code> con <code>Q₀=0</code> según convención hbayesDM para comparación directa.
          Modelos DU-2RHO-a y EWA usan <code>r ∈ {-1, +1}</code> para simetría en actualizaciones duales.
          Grid search MLE individual sin priors jerárquicos.
        </p>
        
        <div style="background:rgba(255,255,255,0.03);padding:15px;border-radius:8px;margin-bottom:15px;">
          <p><strong>Q-learning (α, β)</strong> — Input 0/1, Q₀=0.5</p>
          <p style="margin-left:15px;">
            α = ${fitQL1.alpha} <em>(${interpretAlpha(parseFloat(fitQL1.alpha))})</em>, 
            β = ${fitQL1.beta} <em>(${interpretBeta(parseFloat(fitQL1.beta))})</em>
          </p>
          <p style="margin-left:15px;font-size:11px;color:var(--text-muted);">
            <strong>NLL = ${fitQL1.nll.toFixed(3)}</strong>
          </p>
          <p style="margin-left:15px;font-size:13px;color:#8ab4f8;margin-top:8px;">
            <strong>Perfil AB: ${profileAB}</strong>
          </p>
          <p style="font-size:12px;color:var(--text-muted);margin-left:15px;">
            Modelo base Rescorla-Wagner con temperatura inversa β
          </p>
        </div>

        <div style="background:rgba(255,255,255,0.03);padding:15px;border-radius:8px;margin-bottom:15px;">
          <p><strong>Q-learning Fictitious (α, β)</strong> — Input -1/+1, Q₀=0 (hbayesDM)</p>
          <p style="margin-left:15px;">
            α = ${fitQL1Fict.alpha} <em>(${interpretAlpha(parseFloat(fitQL1Fict.alpha))})</em>, 
            β = ${fitQL1Fict.beta} <em>(${interpretBeta(parseFloat(fitQL1Fict.beta))})</em>
          </p>
          <p style="margin-left:15px;font-size:11px;color:var(--text-muted);">
            <strong>NLL = ${fitQL1Fict.nll.toFixed(3)}</strong>
          </p>
          <p style="font-size:12px;color:var(--text-muted);margin-left:15px;">
            Mismo modelo AB pero con input -1/+1 según convención hbayesDM para comparación
          </p>
        </div>
      
        <div style="background:rgba(255,255,255,0.03);padding:15px;border-radius:8px;margin-bottom:15px;">
          <p><strong>Q-learning dual (α⁺, α⁻, β)</strong> — Input 0/1, Q₀=0.5</p>
          <p style="margin-left:15px;">
            α⁺ = ${fitQL2.alphaR} <em>(${interpretAlpha(parseFloat(fitQL2.alphaR))})</em>, 
            α⁻ = ${fitQL2.alphaP} <em>(${interpretAlpha(parseFloat(fitQL2.alphaP))})</em>, 
            β = ${fitQL2.beta} <em>(${interpretBeta(parseFloat(fitQL2.beta))})</em>
          </p>
          <p style="margin-left:15px;font-size:11px;color:var(--text-muted);">
            <strong>NLL = ${fitQL2.nll.toFixed(3)}</strong>
          </p>
          <p style="font-size:12px;color:var(--text-muted);margin-left:15px;">
            Diferente tasa de aprendizaje para recompensas positivas (α⁺) vs negativas (α⁻)
          </p>
        </div>

        <div style="background:rgba(255,255,255,0.03);padding:15px;border-radius:8px;margin-bottom:15px;">
          <p><strong>Q-learning dual Fictitious (α⁺, α⁻, β)</strong> — Input -1/+1, Q₀=0 (hbayesDM)</p>
          <p style="margin-left:15px;">
            α⁺ = ${fitQL2Fict.alphaR} <em>(${interpretAlpha(parseFloat(fitQL2Fict.alphaR))})</em>, 
            α⁻ = ${fitQL2Fict.alphaP} <em>(${interpretAlpha(parseFloat(fitQL2Fict.alphaP))})</em>, 
            β = ${fitQL2Fict.beta} <em>(${interpretBeta(parseFloat(fitQL2Fict.beta))})</em>
          </p>
          <p style="margin-left:15px;font-size:11px;color:var(--text-muted);">
            <strong>NLL = ${fitQL2Fict.nll.toFixed(3)}</strong>
          </p>
          <p style="font-size:12px;color:var(--text-muted);margin-left:15px;">
            Mismo modelo AB Dual pero con input -1/+1 según convención hbayesDM para comparación
          </p>
        </div>
      
        <div style="background:rgba(255,255,255,0.03);padding:15px;border-radius:8px;margin-bottom:15px;">
          <p><strong>AB + Stickiness (α, β, τ)</strong> — Waltmann et al. 2022</p>
          <p style="margin-left:15px;">
            α = ${fitABSticky.alpha} <em>(${interpretAlpha(parseFloat(fitABSticky.alpha))})</em>, 
            β = ${fitABSticky.beta} <em>(${interpretBeta(parseFloat(fitABSticky.beta))})</em>, 
            τ = ${fitABSticky.tau} <em>(${interpretTau(parseFloat(fitABSticky.tau))})</em>
          </p>
          <p style="margin-left:15px;font-size:11px;color:var(--text-muted);">
            <strong>NLL = ${fitABSticky.nll.toFixed(3)}</strong>
          </p>
          <p style="font-size:12px;color:var(--text-muted);margin-left:15px;">
            τ/κ (tau/kappa) = tendencia a repetir elección previa independiente del feedback (perseveración)
          </p>
        </div>
      
        <div style="background:rgba(255,255,255,0.03);padding:15px;border-radius:8px;margin-bottom:15px;">
          <p><strong>Reinforcement Sensitivity (α, ρ)</strong> — Waltmann et al. 2022</p>
          <p style="margin-left:15px;">
            α = ${fitRS1.alpha} <em>(${interpretAlpha(parseFloat(fitRS1.alpha))})</em>, 
            ρ = ${fitRS1.rho} <em>(${interpretRho(parseFloat(fitRS1.rho))})</em>, 
            Q₀ = ${fitRS1.q0}
          </p>
          <p style="margin-left:15px;font-size:12px;">
            <em>Learning sensitivity (α×ρ) = ${learning_sens_rs} 
            (${interpretLearningSens(parseFloat(learning_sens_rs))})</em>
          </p>
          <p style="margin-left:15px;font-size:11px;color:var(--text-muted);">
            <strong>NLL = ${fitRS1.nll.toFixed(3)}</strong>
          </p>
          <p style="font-size:12px;color:var(--text-muted);margin-left:15px;">
            β fijo = 1. Sensibilidad al refuerzo modulada por ρ
          </p>
        </div>
      
        <div style="background:rgba(255,255,255,0.03);padding:15px;border-radius:8px;margin-bottom:15px;">
          <p><strong>Reinforcement Sensitivity Dual (α, ρ<sub>win</sub>, ρ<sub>loss</sub>)</strong> — DU-2RHO-a</p>
          <p style="margin-left:15px;">
            α = ${fitRS2.alpha} <em>(${interpretAlpha(parseFloat(fitRS2.alpha))})</em>, 
            ρ<sub>win</sub> = ${fitRS2.rhoWin} <em>(${interpretRho(parseFloat(fitRS2.rhoWin))})</em>, 
            ρ<sub>loss</sub> = ${fitRS2.rhoLoss} <em>(${interpretRho(parseFloat(fitRS2.rhoLoss))})</em>
          </p>
          <p style="margin-left:15px;font-size:12px;">
            <em>Learning sens. win (α×ρ<sub>win</sub>) = ${learning_sens_win}, 
            loss (α×ρ<sub>loss</sub>) = ${learning_sens_loss}</em>
          </p>
          <p style="margin-left:15px;font-size:11px;color:var(--text-muted);">
            <strong>NLL = ${fitRS2.nll.toFixed(3)}</strong>
          </p>
          <p style="font-size:12px;color:var(--text-muted);margin-left:15px;">
            β fijo = 1. Sensibilidad diferencial a recompensas vs castigos
          </p>
        </div>
      
        <div style="background:rgba(255,255,255,0.03);padding:15px;border-radius:8px;margin-bottom:15px;">
          <p><strong>EWA (φ, ρ, β)</strong> — Experience-Weighted Attraction</p>
          <p style="margin-left:15px;">
            φ = ${fitEWA.phi} <em>(${interpretPhi(parseFloat(fitEWA.phi))})</em>, 
            ρ = ${fitEWA.rho} <em>(${interpretRhoEWA(parseFloat(fitEWA.rho))})</em>, 
            β = ${fitEWA.beta} <em>(${interpretBeta(parseFloat(fitEWA.beta))})</em>
          </p>
          <p style="margin-left:15px;font-size:12px;color:#8ab4f8;">
            <strong>Perfil: ${ewaProfile}</strong>
          </p>
          <p style="margin-left:15px;font-size:11px;color:var(--text-muted);">
            <strong>NLL = ${fitEWA.nll.toFixed(3)}</strong>
          </p>
          <p style="font-size:12px;color:var(--text-muted);margin-left:15px;">
            φ = peso experiencia previa, ρ = decay memoria, β = temperatura decisión
          </p>
        </div>
      
        <p style="font-size:11px;color:var(--text-muted);margin-top:20px;">
          <strong>Interpretación NLL:</strong> Negative Log-Likelihood (menor = mejor ajuste). 
          Diferencias &lt;5 puntos son marginales; &gt;10 puntos sugieren diferencias sustanciales.
        </p>
        
        <p style="font-size:11px;color:var(--text-muted);margin-top:20px;">
          Referencias: Waltmann et al. (2022) <em>Behav Res Methods</em>; 
          Camerer & Ho (1999); hbayesDM package (Ahn et al., 2017)
        </p>
        
        <hr style="border:none;border-top:1px solid var(--border);margin:30px 0;">
        
        <h3>Patrón de Aprendizaje por Refuerzo</h3>
        <p style="font-size:13px;color:var(--text-muted);margin-bottom:20px;">
          Análisis cualitativo basado en comparación de modelos computacionales (NLL) y valores de parámetros
        </p>
        
        ${generateQualitativeAnalysis(fitQL1, fitQL2, fitABSticky, fitRS1, fitRS2, fitEWA)}
      `;
      
        return {
          html: compHtml,
          fits: {
            ql1: fitQL1,
            ql1Fict: fitQL1Fict,
            ql2: fitQL2,
            ql2Fict: fitQL2Fict,
            ewa: fitEWA
          }
        };
      }


    /// FINAL CÁLCULOS COMPUTACIONAES


    // Event listeners
    document.addEventListener('keydown', checkKey);
    
    // Pointer/touch handler para seleccionar en móvil (genios y peces)
    let __lastStimulusPointerAt = 0;

    stimuliDiv.addEventListener('pointerdown', (e) => {
      if (responseBlocked) return;
      if (stimuliDiv.style.display === 'none') return;

      // Peces: decidir por mitad izquierda/derecha
      const lakeStimulus = e.target.closest('#lake-stimulus');
      if (lakeStimulus) {
        const stimulusType = document.getElementById('stimulusTypeSelect').value;
        if (stimulusType !== 'peces') return;
        const rect = lakeStimulus.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const choice = x < rect.width / 2 ? 'A' : 'B';
        __lastStimulusPointerAt = Date.now();
        e.preventDefault();
        if (isPracticeMode) handlePracticeChoice(choice);
        else processChoice(choice);
        return;
      }

      // Genios/emoji: tocar el estímulo A o B
      const stim = e.target.closest('#A, #B');
      if (!stim) return;
      const choice = stim.id;
      __lastStimulusPointerAt = Date.now();
      e.preventDefault();
      if (isPracticeMode) handlePracticeChoice(choice);
      else processChoice(choice);
    }, { passive: false });

    // Click fallback (evita doble disparo tras touch)
    stimuliDiv.addEventListener('click', (e) => {
      if (Date.now() - __lastStimulusPointerAt < 350) return;
      if (responseBlocked) return;
      if (stimuliDiv.style.display === 'none') return;

      const lakeStimulus = e.target.closest('#lake-stimulus');
      if (lakeStimulus) {
        const stimulusType = document.getElementById('stimulusTypeSelect').value;
        if (stimulusType !== 'peces') return;
        const rect = lakeStimulus.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const choice = x < rect.width / 2 ? 'A' : 'B';
        if (isPracticeMode) handlePracticeChoice(choice);
        else processChoice(choice);
        return;
      }

      const stim = e.target.closest('#A, #B');
      if (!stim) return;
      const choice = stim.id;
      if (isPracticeMode) handlePracticeChoice(choice);
      else processChoice(choice);
    });
    
    startBtn.addEventListener('click', () => {
      if (typeof window.__previewStop__ === 'function') window.__previewStop__();

      maxTrials = parseInt(document.getElementById('maxTrialsInput').value) || 60;
      reversalMode = document.getElementById('reversalModeSelect').value || 'predetermined';
      
      // En modo predeterminado, la reversión ocurre a mitad de la prueba
      // En modo criterio, reversalTrial se establecerá dinámicamente cuando se alcance el criterio
      reversalTrial = reversalMode === 'predetermined' ? Math.floor(maxTrials / 2) + 1 : null;

      
      // ⭐ CREAR URNAS DE FEEDBACK SEPARADAS PARA CORRECTO E INCORRECTO
      // Estimamos el tamaño máximo para cada urna
      // En el peor caso, todos los trials van a una sola urna
      const learningTrialsCount = reversalMode === 'predetermined' ? (reversalTrial - 1) : maxTrials;
      const reversalTrialsCount = maxTrials - learningTrialsCount;
      
      // Para la fase de aprendizaje:
      // - Urna "correcta": 70% coherente (positivo), 30% engañoso (negativo)
      // - Urna "incorrecta": también 70% coherente (negativo), 30% engañoso (positivo)
      // Nota: "coherente" significa feedback veraz; para elecciones incorrectas, veraz = negativo
      feedbackUrnLearningCorrect = createFeedbackUrn(learningTrialsCount, feedbackProbability, false);
      feedbackUrnLearningIncorrect = createFeedbackUrn(learningTrialsCount, feedbackProbability, false);
      
      // Para la fase de reversión: igual pero forzamos primer feedback coherente en urna correcta
      feedbackUrnReversalCorrect = createFeedbackUrn(reversalTrialsCount, feedbackProbability, true);
      feedbackUrnReversalIncorrect = createFeedbackUrn(reversalTrialsCount, feedbackProbability, false);
      
      console.log(`📊 Configuración: ${(feedbackProbability*100).toFixed(0)}% feedback coherente (veraz)`);
      console.log(`🎲 Fase aprendizaje (${learningTrialsCount} trials):`);
      console.log(`   - Urna CORRECTA: ${feedbackUrnLearningCorrect.length} elementos, ${feedbackUrnLearningCorrect.filter(x=>x).length} coherentes (${(100*feedbackUrnLearningCorrect.filter(x=>x).length/feedbackUrnLearningCorrect.length).toFixed(1)}%) → 70% positivo`);
      console.log(`   - Urna INCORRECTA: ${feedbackUrnLearningIncorrect.length} elementos, ${feedbackUrnLearningIncorrect.filter(x=>x).length} coherentes (${(100*feedbackUrnLearningIncorrect.filter(x=>x).length/feedbackUrnLearningIncorrect.length).toFixed(1)}%) → 70% negativo`);
      console.log(`🎲 Fase reversión (${reversalTrialsCount} trials):`);
      console.log(`   - Urna CORRECTA: ${feedbackUrnReversalCorrect.length} elementos, ${feedbackUrnReversalCorrect.filter(x=>x).length} coherentes (${(100*feedbackUrnReversalCorrect.filter(x=>x).length/feedbackUrnReversalCorrect.length).toFixed(1)}%) → 70% positivo, 1º forzado`);
      console.log(`   - Urna INCORRECTA: ${feedbackUrnReversalIncorrect.length} elementos, ${feedbackUrnReversalIncorrect.filter(x=>x).length} coherentes (${(100*feedbackUrnReversalIncorrect.filter(x=>x).length/feedbackUrnReversalIncorrect.length).toFixed(1)}%) → 70% negativo`);
      // ⭐ FIN CREAR URNAS DE FEEDBACK SEPARADAS
      
      // ⭐ INICIALIZAR BARAJAS DEN OUDEN SI ESE MÉTODO ESTÁ SELECCIONADO
      if (randomizationMethod === 'denouden') {
        initializeDenOudenDecks(learningTrialsCount, reversalTrialsCount, feedbackProbability);
      }

      
      windowSize = parseInt(document.getElementById('windowSizeInput').value) || 10;
      accuracyThreshold = parseInt(document.getElementById('accuracyThresholdInput').value) || 8;
      feedbackProbability = parseFloat(probScheduleSelect.value) || 0.7;
      
      // Obtener método de aleatorización seleccionado
      const randomizationMethodSelect = document.getElementById('randomizationMethodSelect');
      randomizationMethod = randomizationMethodSelect ? randomizationMethodSelect.value : 'urn';
      console.log("[PRLT] Método de aleatorización:", randomizationMethod);
      FEEDBACK_MS = parseInt(feedbackDurationSelect.value) || 750;

      // ⏱️ Aplicar deadline seleccionado
      const deadlineSel = document.getElementById('responseDeadlineSelect');
      const deadlineVal = deadlineSel ? deadlineSel.value : '6000';
      STIMULUS_TIMEOUT_MS = (deadlineVal === 'none') ? null : (parseInt(deadlineVal, 10) || 6000);

//comprobación de qu se ha selecionado la correcta)
      console.log("[PRLT] feedbackProbability =", feedbackProbability);




      // Reset variables
      coins = 0;
      correctStimulus = null;
      trials = [];
      omissions = 0;
      trialCount = 0;
      isReversalPhase = false;
      prevCorrectStimulus = null;
      hasMadeCorrectInThisPhase = false;
      performanceWindow = [];
      firstLearningTrial = null;
      reversalLearningTrial = null;
      responseBlocked = true;
      
      // Reset criterion mode variables
      reversalCount = 0;
      reversalData = [];
      currentReversalErrors = 0;
      currentReversalTrials = 0;
      criterionReached = false;
      
      // ⭐ RESET NUEVAS VARIABLES DEL SISTEMA REFACTORIZADO
      reversalBlock = 0;              // Inicializar en bloque 0 (pre-reversión)
      isReversalTrial = false;        // No es un ensayo de reversión al inicio
      reversalPhase = false;          // No estamos en fase de reversión al inicio
      correctChoicesInBlock = new Set();  // Limpiar registro de elecciones correctas
      isFirstReversalTrial = false;   // Legacy flag

      // Comprobar si se debe ejecutar el bloque de práctica
      const shouldDoPractice = document.getElementById('practiceBlockSelect').value === 'yes';
      
      // Inicializar práctica si está habilitada
      if (shouldDoPractice) {
        isPracticeMode = true;
        practiceTrialCount = 0;
        initializePracticeSequence();

        // ⭐ GENERAR ESTÍMULOS DE PRÁCTICA SIMPLIFICADOS
        const stimulusType = document.getElementById('stimulusTypeSelect').value;
        if (stimulusType === 'genios') {
          // Para genios, usar emojis estándar en práctica
          stimuliDiv.innerHTML = `
            <div class="stimulus" id="A">
              ${createPracticeMachine('A', 150)}
            </div>
            <div class="stimulus" id="B">
              ${createPracticeMachine('B', 150)}
            </div>
          `;
        } else if (stimulusType === 'peces') {
          // Para peces, usar el mismo lago en práctica y tarea principal
          stimuliDiv.innerHTML = `
            <div class="lake-stimulus" id="lake-stimulus" data-stimulus-type="peces">
              ${createLakeStimulus(512, false, null)}
            </div>
          `;
        } else {
          // Fallback a emojis
          stimuliDiv.innerHTML = `
            <div class="stimulus" id="A">
              ${createPracticeMachine('A', 150)}
            </div>
            <div class="stimulus" id="B">
              ${createPracticeMachine('B', 150)}
            </div>
          `;
        }
      } else {
        // Saltar práctica y generar estímulos de prueba directamente
        isPracticeMode = false;
        practiceTrialCount = 0;
        
        const stimulusType = document.getElementById('stimulusTypeSelect').value;
        if (stimulusType === 'genios') {
          stimuliDiv.innerHTML = `
            <div class="stimulus" id="A">
              ${createGeniusStimulus('A', true, 150)}
            </div>
            <div class="stimulus" id="B">
              ${createGeniusStimulus('B', true, 150)}
            </div>
          `;
        } else if (stimulusType === 'peces') {
          stimuliDiv.innerHTML = `
            <div class="lake-stimulus" id="lake-stimulus" data-stimulus-type="peces">
              ${createLakeStimulus(512, false, null)}
            </div>
          `;
        } else {
          stimuliDiv.innerHTML = `
            <div class="stimulus" id="A">
              ${createGeniusStimulus('A', true, 150)}
            </div>
            <div class="stimulus" id="B">
              ${createGeniusStimulus('B', true, 150)}
            </div>
          `;
        }
      }

      // Mostrar interfaz de tarea y ocultar título
      instructions.style.display = 'none';
      startBtn.style.display = 'none';
      document.getElementById('main-title').classList.add('hidden-during-task');

      // Mostrar header de práctica y primera instrucción solo si está en modo práctica
      if (shouldDoPractice) {
        document.getElementById('practice-header').style.display = 'block';
        updatePracticeInstruction();
      } else {
        document.getElementById('practice-header').style.display = 'none';
      }

      showFixationCross();
    });
(function(){
  function __getTrials__(){
    try { return (typeof trials !== 'undefined' && trials) ? trials : []; }
    catch(e){ return []; }
  }
  function __preSetFeedbackProbability__(){
    try {
      var sel = document.getElementById('probScheduleSelect');
      if (!sel) return;
      var v = parseFloat(sel.value);
      if (!isNaN(v)) {
        feedbackProbability = v; // asignación directa a la binding global
      }
    } catch(e){ /* no-op */ }
  }
  try {
    var sb = document.getElementById('start-btn');
    if (sb) { sb.addEventListener('click', __preSetFeedbackProbability__, true); }
  } catch(e){ /* no-op */ }

  var __hooked = false;
  function __hookShowResults__(){
    if (__hooked) return;
    if (typeof window.showResults !== 'function') { setTimeout(__hookShowResults__, 100); return; }
    var __origShowResults = window.showResults;
    window.showResults = function(){
      var ret = __origShowResults.apply(this, arguments);
      try { __injectButtons__(); __injectDebug2x2__(); } catch(e){ console.error(e); }
      return ret;
    };
    __hooked = true;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', __hookShowResults__);
  else __hookShowResults__();

  function __injectButtons__(){
    var mainBtn = document.getElementById('downloadCsv');
    if (!mainBtn) return;
    if (!document.getElementById('downloadCsv_hbdm')) {
      var b1 = document.createElement('button');
      b1.id = 'downloadCsv_hbdm';
      b1.textContent = 'Descargar hBayesDM (.txt)';
      b1.style.marginLeft = '8px';
      mainBtn.insertAdjacentElement('afterend', b1);
      b1.addEventListener('click', __downloadTxtHBayesDM__);
    }
    if (!document.getElementById('downloadCsv_rlddm')) {
      var b2 = document.createElement('button');
      b2.id = 'downloadCsv_rlddm';
      b2.textContent = 'Descargar RT/DDM (.csv)';
      b2.style.marginLeft = '8px';
      mainBtn.insertAdjacentElement('afterend', b2);
      b2.addEventListener('click', __downloadCsvRT__);
    }
  }

  function __injectDebug2x2__(){
    var results = document.getElementById('results');
    if (!results) return;
    var id = 'debug_correct_incorrect_v2';
    var block = document.getElementById(id);
    var inner = __buildDebug2x2__();
    if (block) block.innerHTML = inner;
    else {
      var wrap = document.createElement('div');
      wrap.id = id;
      wrap.style.marginTop = '12px';
      wrap.style.fontFamily = 'monospace';
      wrap.style.whiteSpace = 'pre-wrap';
      wrap.innerHTML = '🔬 DEBUG (correcta/incorrecta por fase)\n' + inner;
      results.appendChild(wrap);
    }
  }

  function __buildDebug2x2__(){
    var arr = __getTrials__().filter(function(t){ return t && t.omission === 0; });
    var phases = {0:{cP:0,cC:0,iP:0,iC:0}, 1:{cP:0,cC:0,iP:0,iC:0}};
    for (var i=0;i<arr.length;i++){
      var t = arr[i];
      var phase = (typeof window.computePhaseAndTrialInPhase === 'function')
                  ? window.computePhaseAndTrialInPhase(t.trial).phase
                  : (t.reversal ? 1 : 0);
      var isCorrect = (typeof t.actual_is_correct === 'number')
                      ? (t.actual_is_correct === 1)
                      : ((t.choice === 'A' && t.correctStimulus === 'A') || (t.choice === 'B' && t.correctStimulus === 'B'));
      var isReward = !!t.feedbackCorrect;
      var acc = phases[phase] || phases[0];
      if (isCorrect) { if (isReward) acc.cP++; else acc.cC++; }
      else { if (isReward) acc.iP++; else acc.iC++; }
    }
    function fmt(ph, label){
      var totalC = ph.cP + ph.cC;
      var totalI = ph.iP + ph.iC;
      function pct(x,den){ return den>0 ? ' (' + (100*x/den).toFixed(1) + '%)' : ''; }
      return label + ': Correcta → Premio ' + ph.cP + pct(ph.cP,totalC) + ' | Castigo ' + ph.cC + pct(ph.cC,totalC) +
             '  ·  Incorrecta → Premio ' + ph.iP + pct(ph.iP,totalI) + ' | Castigo ' + ph.iC + pct(ph.iC,totalI);
    }
    return fmt(phases[0],'Fase aprendizaje') + '\n' + fmt(phases[1],'Fase reversión');
  }

  function __downloadText__(text, filename){
    var blob = new Blob([text], {type:'text/plain;charset=utf-8;'});
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // ========================================================================
  // AUGMENT TRIALS - Añade campos de exportación con nomenclatura clara
  // ========================================================================
  // NOMENCLATURA UNIFICADA:
  // - reward (0/1): feedback mostrado al participante (puede ser engañoso)
  //   → Usado por modelos RL (Q-learning, VKF, CPD, HGF) - aprenden del feedback recibido
  // - outcome (-1/+1): mismo feedback en formato hBayesDM
  //   → Usado solo para exportación hBayesDM
  // - actual_is_correct (0/1): corrección objetiva de la elección
  //   → Usado para análisis conductual (accuracy, perseveración, regresión)
  // ========================================================================
  function __augmentTrials__(list){
    var trialsRef = list || __getTrials__();
    var pid = (document.getElementById('participantIdInput')?.value || '').trim() || 'unknown';
    for (var i=0;i<trialsRef.length;i++){
      var t = trialsRef[i]; if (!t || t._augmented) continue;
      t.subjID_export = pid;
      if (typeof t.choice_code === 'number') t.choice_hbdm = (t.choice_code===1||t.choice_code===2) ? t.choice_code : null;
      else t.choice_hbdm = (t.choice==='A') ? 1 : (t.choice==='B' ? 2 : null);
      if (t.omission === 0){
        // reward (0/1): feedback mostrado - para modelos RL
        t.reward = t.feedbackCorrect ? 1 : 0;
        // outcome (-1/+1): feedback mostrado en formato hBayesDM
        t.outcome_hbdm = t.feedbackCorrect ? 1 : -1;
        // Mantener feedback_export por compatibilidad
        t.feedback_export = t.reward;
      } else {
        t.reward = null;
        t.outcome_hbdm = null;
        t.feedback_export = null;
      }
      var rtms = (typeof t.rt_ms === 'number') ? t.rt_ms : (typeof t.reactionTime === 'number' ? t.reactionTime : null);
      t.rt_s = (typeof rtms === 'number') ? +(rtms/1000).toFixed(4) : null;
      var info = (typeof window.computePhaseAndTrialInPhase === 'function') ? window.computePhaseAndTrialInPhase(t.trial) : {phase:(t.reversal?1:0), trial_in_phase:''};
      t.condition_phase = 'phase_' + info.phase;
      t.condition_reversal = (t.reversal === 1) ? 'rev' : 'no_rev';
      t.trial_in_phase_export = info.trial_in_phase;
      t._augmented = true;
    }
    return trialsRef;
  }

  // ========================================================================
  // EXPORT HBAYESDM - Formato: subjID, choice (1/2), outcome (-1/+1)
  // ========================================================================
  // outcome = feedback mostrado al participante en formato -1/+1
  // Los modelos hBayesDM esperan outcome como -1 (castigo) o +1 (premio)
  // ========================================================================
  function __downloadTxtHBayesDM__(){
    var pid = (document.getElementById('participantIdInput')?.value || '').trim() || 'unknown';
    var data = __augmentTrials__(__getTrials__());
    var lines = ['subjID\tchoice\toutcome'];
    for (var i=0;i<data.length;i++){
      var t = data[i];
      if (!t || t.omission === 1) continue;
      if ((t.choice_hbdm===1||t.choice_hbdm===2) && (t.outcome_hbdm===1||t.outcome_hbdm===-1)){
        lines.push([t.subjID_export, t.choice_hbdm, t.outcome_hbdm].join('\t'));
      }
    }
    __downloadText__(lines.join('\n') + '\n', 'PRLT_hBayesDM_' + pid + '.txt');
  }

  function __downloadCsvRT__(){
    var pid = (document.getElementById('participantIdInput')?.value || '').trim() || 'unknown';
    var data = __augmentTrials__(__getTrials__());
    var header = 'subjID,rt,response,feedback,phase,reversal,trial_in_phase\n';
    var rows = [];
    for (var i=0;i<data.length;i++){
      var t = data[i];
      if (!t || t.omission === 1) continue;
      if (!(typeof t.rt_s === 'number') || !(t.rt_s > 0)) continue;
      var response = (t.choice_hbdm===1) ? 0 : (t.choice_hbdm===2 ? 1 : null); // 0=opción1 (A), 1=opción2 (B)
      if (response === null) continue;
      var info = (typeof window.computePhaseAndTrialInPhase === 'function') ? window.computePhaseAndTrialInPhase(t.trial) : {phase:(t.reversal?1:0), trial_in_phase:''};
      rows.push([t.subjID_export, t.rt_s.toFixed(4), response, (t.feedback_export==null?'':t.feedback_export), info.phase, (t.reversal||0), info.trial_in_phase].join(','));
    }
    __downloadText__(header + rows.join('\n') + '\n', 'PRLT_RT_' + pid + '.csv');
  }

  window.__downloadTxtHBayesDM__ = __downloadTxtHBayesDM__;
  window.__downloadCsvRT__ = __downloadCsvRT__;
})();
			    // Esperar a que toda la página cargue
			    document.addEventListener('DOMContentLoaded', () => {
			        const resultsDiv = document.getElementById('results');
			        
			        // Verifica que el elemento con id="results" existe antes de modificarlo
			        if (resultsDiv) {
			            const variablesBox = `
			                <div style="
			                    background: var(--bg-elevated);
			                    border: 1px solid var(--border);
			                    border-radius: 12px;
			                    padding: 20px;
			                    margin-bottom: 15px;
			                    font-size: 0.95rem;
			                    font-family: 'Inter', sans-serif;
			                    color: var(--text-primary);">
			                    <p style="margin: 0; font-weight: 500;">Copiar y pegar esta plantilla de variables:</p>
			                    <pre style="
			                        background: var(--bg-dark);
			                        padding: 10px;
			                        border-radius: 8px;
			                        font-size: 0.9rem;
			                        overflow-x: auto;
			                        color: var(--text-secondary);
			                        border: 1px dashed var(--border);
			                        margin-top: 8px;">
			                        1. CONDUCTUALES:
			                           - Win switch rate
			                           - Lose stay rate
			                           - Errores perseverativos (rachas >=2)
			                           - Ensayos hasta criterio en aprendizaje y en reversión (o no alcanzado).
			                        2. COMPUTACIONALES (hBayesDM):
			                           - Alfa
			                           - Beta
			                           - Alfa Feedback Positivo
			                           - Alfa Feedback Negativo
			                           - EWA Phi
			                           - EWA Rho
			                    </pre>
			                </div>
			            `;
			            // Insertar el recuadro antes del contenido dinámico
			            resultsDiv.innerHTML = variablesBox + resultsDiv.innerHTML;
			        } else {
			            console.error('No se encontró el elemento con id="results".');
			        }
			    });
