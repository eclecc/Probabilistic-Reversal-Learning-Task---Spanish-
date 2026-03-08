# CODEBOOK: PRLT (Probabilistic Reversal Learning Task)

**Versión:** 1.0
**Última actualización:** 2026-03-08
**Propósito:** Documentación completa de variables, codificaciones y reglas de exportación para análisis reproducible en hBayesDM (R), Python y MATLAB.

---

## 1. CODIFICACIÓN DE ELECCIONES (CHOICES)

El participante elige entre **Opción A** y **Opción B** en cada trial. Existen **3 formatos distintos** dependiendo del contexto analítico:

### 1.1 Formato Interno (Durante la prueba)
```
choice ∈ {'A', 'B'}
```
- Usado internamente en el código HTML/JavaScript
- Legible para el desarrollador
- **No se exporta** al CSV

### 1.2 Formato CSV (Columna: `choice_code`)
```
choice_code ∈ {1, 2}
  donde: 1 = Opción A
         2 = Opción B
```
- **Se exporta al CSV**
- Convención: 1 = primera opción (A), 2 = segunda opción (B)
- Utilidad: auditoría y trazabilidad

**Conversión:**
```
choice_code = 1  si  choice === 'A'
choice_code = 2  si  choice === 'B'
```

### 1.3 Formato para Modelos RL (Columna: derivada en modelos)
```
choice_numeric ∈ {0, 1}
  donde: 0 = Opción A (primera/mejor)
         1 = Opción B (segunda/peor)
```
- **No se exporta al CSV**, se calcula en el análisis posterior
- Estándar en Rescorla-Wagner, Q-learning, hBayesDM
- Convención: 0 = referencia, 1 = alternativa

**Conversión (en R/Python):**
```R
# En R
choice_numeric <- ifelse(choice_code == 1, 0, 1)

# En Python
choice_numeric = [0 if c == 1 else 1 for c in choice_code]
```

### 1.4 Tabla de Conversión Rápida
| Contexto | Formato | Valores | Ubicación |
|----------|---------|---------|-----------|
| Código interno | String | 'A', 'B' | HTML/JS |
| CSV exportado | Numérico | 1, 2 | `choice_code` |
| Modelos RL | Numérico | 0, 1 | Calculado post-hoc |

⚠️ **CRÍTICO PARA EL REVISOR:** Asegúrate de que tus modelos RL usan la conversión correcta. Un error aquí invertirá todos los parámetros aprendidos.

---

## 2. FEEDBACK Y RECOMPENSA

La lógica principal distingue entre **3 tipos de feedback** basado en si el participante recibe información engañosa.

### 2.1 Variables Internas (Código)

#### `feedbackCorrect` (boolean)
- **Feedback MOSTRADO al participante**
- Puede ser **engañoso** (misleading) en trials probabilísticos
- `true` = feedback positivo (verde, +1)
- `false` = feedback negativo (rojo, -1)

#### `actual_is_correct` (0/1)
- **Corrección OBJETIVA basada en la verdad empírica**
- `actual_is_correct = 1` si `choice === trueCorrectStimulus`
- `actual_is_correct = 0` si `choice ≠ trueCorrectStimulus`
- NUNCA es engañoso, siempre refleja la opción correcta real
- Se calcula con la variable interna `trueCorrectSide`

#### `misleading` (0/1)
- Indicador de engaño
- `misleading = 1` si `feedbackCorrect ≠ actual_is_correct`
- `misleading = 0` si `feedbackCorrect === actual_is_correct` (feedback acertado)

### 2.2 Formatos Exportados al CSV

#### Columna: `reward` [0/1]
```
reward = 1  si  feedbackCorrect === true
reward = 0  si  feedbackCorrect === false
reward = 'NA'  si  omission === 1
```
- **Feedback que el participante recibió y aprendió**
- Puede ser engañoso
- **Formato idóneo para:** Q-learning clásico, Rescorla-Wagner en espacio [0,1]
- Validación: `mean(reward) ≈ proporción de trials con feedback positivo`

#### Columna: `outcome` [-1/+1]
```
outcome = +1  si  feedbackCorrect === true
outcome = -1  si  feedbackCorrect === false
outcome = 'NA'  si  omission === 1
```
- **Feedback como ganancia (+1) o pérdida (-1)**
- Mismo feedback que `reward`, distinto formato
- **Formato idóneo para:** hBayesDM, modelos en espacio [-1, +1], fictitious learning
- Relación: `outcome = 2*reward - 1`

#### Columna: `actual_is_correct` [0/1]
```
actual_is_correct = 1  si  choice === correctStimulus (verdad empírica)
actual_is_correct = 0  si  choice ≠ correctStimulus
actual_is_correct = 'NA'  si  omission === 1
```
- **Verdad empírica, NO el feedback mostrado**
- Nunca es engañoso
- **Formato idóneo para:** análisis conductual (accuracy real, perseveración, errores regresivos)
- **NUNCA debe usarse en modelos RL** que aprenden del feedback
- Validación: `mean(actual_is_correct) ≈ porcentaje real de aciertos sin engaño`

### 2.3 Tabla de Relaciones
| Evento | feedbackCorrect | reward | outcome | actual_is_correct | misleading |
|--------|---|---|---|---|---|
| Acierto sin engaño | true | 1 | +1 | 1 | 0 |
| Error sin engaño | false | 0 | -1 | 0 | 0 |
| Acierto engañoso* | true | 1 | +1 | 0 | 1 |
| Error engañoso* | false | 0 | -1 | 1 | 1 |
| Omisión | - | NA | NA | NA | - |

*Acierto engañoso: participante escolheu mal pero recibió feedback positivo.
Error engañoso: participante escolheu bien pero recibió feedback negativo.

### 2.4 Diseño Experimental: Cuándo Ocurre el Engaño

La prueba genera feedback engañoso para inducir **aprendizaje incorrecto** en trials probabilísticos:
- **Probabilidad de engaño por trial:** Configurable (ej. 10%, 20%)
- **Propósito:** Estudiar cómo el participante corrige su aprendizaje cuando el feedback es inconsistente
- **Ubicación en el código:** Ver sección 4.2 (Fases y Probabilidades)

---

## 3. FASES Y REVERSIONES

### 3.1 Estructura de Bloques (Reversal Blocks)

La prueba consta de múltiples **bloques de aprendizaje** (reversal blocks) separados por **reversiones** (cambios en la opción correcta).

#### Fase 0: Aprendizaje Inicial
- **reversal_block = 0**
- Participante aprende cuál es la opción correcta (ej. A = 70%, B = 30%)
- Termina cuando se alcanza criterio o se completan N trials (modo según configuración)

#### Fase 1+: Aprendizaje Pos-Reversión
- **reversal_block = 1, 2, 3, ...**
- Las probabilidades se invierten (ej. A = 30%, B = 70%)
- Participante debe **desaprender** la opción anterior y aprender la nueva

### 3.2 Variables de Control de Fases

#### `reversalBlock` [0, 1, 2, ...]
- **Número del bloque actual (0-indexado)**
- Identifica en qué fase de aprendizaje está el participante
- `reversal_block = 0` = aprendizaje inicial
- `reversal_block = N` = N-ésima reversión completada

#### `is_reversal_trial` [0/1]
- **¿Es este el ensayo donde ocurre la reversión?**
- `is_reversal_trial = 1` en el trial donde se invierte la probabilidad
- Normalmente **excluido de ciertos análisis** (ej. performance window)
- En modo criterio, marca el trial donde se alcanzó el criterio y ocurre la reversión

#### `is_reversal_phase` [0/1]
- **¿Estamos en fase de reversión o antes?**
- `is_reversal_phase = 0` durante el aprendizaje inicial (reversal_block = 0)
- `is_reversal_phase = 1` a partir de la primera reversión en adelante
- Permanece en 1 para todos los trials posteriores
- Útil para análisis que contrastan "aprendizaje inicial" vs "aprendizaje post-reversión"

### 3.3 Modo de Reversión: Predetermined vs Criterion

#### Modo `predetermined` (Fijo)
- **Reversión ocurre en trial predefinido:** `reversal_trial = floor(maxTrials / 2) + 1`
- Ej. si maxTrials = 80, reversión en trial 41
- Ventaja: predecible, fácil de manejar
- Desventaja: no adapta al desempeño del participante

Campos CSV relevantes:
- `reversal_block`: Se incrementa en trial 41
- `is_reversal_trial`: 1 en trial 41
- `is_reversal_phase`: 0 en trials 1-40, 1 en trials 41-80

#### Modo `criterion` (Basado en Criterio)
- **Reversión ocurre cuando:** `correct_in_last_N_trials ≥ criterion_threshold`
- Parámetro: `criterion = 8/10` (ej. 8 aciertos en últimos 10 trials)
- Ventaja: adapta al ritmo del participante
- Desventaja: número de trials variable por participante

Campos CSV relevantes:
- `reversal_block`: Se incrementa cuando se alcanza criterio
- `reversal_number`: Ordinal de reversiones alcanzadas (1, 2, 3...)
- Nota: `reversal_number` **solo existe en modo criterion**

### 3.4 Tabla de Variables de Fase
| Variable | Rango | Significado | Uso Analítico |
|----------|-------|-------------|---------------|
| `reversal_block` | 0, 1, 2... | Número del bloque | Agrupar trials por fase |
| `is_reversal_trial` | 0/1 | ¿Es el trial de reversión? | Excluir/marcar transición |
| `is_reversal_phase` | 0/1 | ¿Post-reversión? | Contrastar fases grandes |
| `reversal_number` | 0, 1, 2...* | Ordinal de reversiones | Modo criterion solo |
| `trial_in_phase` | 1, 2, 3...* | Trial dentro del bloque | LEGACY (deprecated) |

*Campos LEGACY marcados en el código: pueden generar confusión si se usan sin entender su contexto.

---

## 4. ERRORES CONDUCTUALES ESPECÍFICOS

### 4.1 Error Perseverativo (`is_perseverative` [0/1])

**Definición:** Elegir la opción que ERA correcta DESPUÉS de que se produjo una reversión.

**Condiciones para is_perseverative = 1:**
1. `is_reversal_trial = 0` (NO en el ensayo de reversión mismo)
2. `isReversalPhase = 1` (Ya ha ocurrido al menos una reversión)
3. `choice === prevCorrectStimulus` (Elige la opción anteriormente correcta)

**Ejemplo:**
```
Trial 39: A es correcta (70%), elige A → acierto
Trial 40: ← REVERSIÓN (ahora B es correcta)
Trial 41: Elige A (la opción que ERA correcta) → error perseverativo
```

**Uso analítico:**
- Mide **persistencia de la regla aprendida** (inflexibilidad)
- Relacionado con: DLPFC, orbitofrontal cortex, déficit de reversión
- En deterioro cognitivo/ADHD: ↑ errores perseverativos

### 4.2 Error Regresivo (`is_regressive_error` [0/1])

**Definición:** Error en la opción correcta ACTUAL, después de haber demostrado aprendizaje de esa opción.

**Condiciones para is_regressive = 1:**
1. `actual_is_correct = 0` (El trial fue un error según la verdad)
2. `correctChoicesInBlock.size > 0` (Ya ha elegido correctamente al menos 1 vez en este bloque)

**Ejemplo:**
```
Trial 41: (Fase post-reversión, B es correcta)
Trial 41: Elige B → acierto, added to correctChoicesInBlock
Trial 42: Elige A → error (y B ya fue elegida correctamente)
          → is_regressive = 1 (conocía la respuesta, la olvidó)
Trial 43: Elige A → error (y B ya fue elegida correctamente)
          → is_regressive = 1
```

**Uso analítico:**
- Mide **inestabilidad del conocimiento** (lapsos de memoria/atención)
- Diferente de perseveración: no es "pegarse a lo viejo", es "perder lo nuevo"
- Relacionado con: working memory, atención sostenida

### 4.3 Resumen de Errores
| Tipo | Fórmula | Significa | Fase |
|------|---------|-----------|------|
| Perseverativo | `choice === old_correct` | Pegarse a lo viejo | Post-reversión |
| Regresivo | `error_but_learned_it` | Olvidar lo aprendido | Cualquiera |
| Normal | `choice ≠ new_correct` | Error de aprendizaje | Cualquiera |

---

## 5. CSV: ESTRUCTURA COMPLETA Y ORDEN DE COLUMNAS

### 5.1 Columnas de Metadatos (Meta)
Se repiten al principio de **cada fila** para trazabilidad:

```csv
participant_id,
age_group,
session_number,
max_trials,
learning_rate_initial_A,
learning_rate_initial_B,
reversal_mode,
reversal_schedule,
prob_good,
prob_bad,
criterion_threshold,
criterion_window,
criterion_consecutive,
starting_stimulus,
misleading_probability,
meta_debug_prob_reward_stim_A_phase_0,
meta_debug_prob_reward_stim_B_phase_0,
meta_debug_prob_reward_stim_A_phase_1,
meta_debug_prob_reward_stim_B_phase_1,
meta_debug_n_trials_stim_A_phase_0,
meta_debug_n_trials_stim_B_phase_0,
meta_debug_n_trials_stim_A_phase_1,
meta_debug_n_trials_stim_B_phase_1,
```

### 5.2 Columnas de Datos (Trial-Level)
Varían por trial:

#### Identidad y Elección
```csv
trial,              # Trial número (1, 2, 3, ...)
choice_code,        # 1=A, 2=B (conversión desde 'A'/'B')
```

#### Feedback y Recompensa
```csv
reward,             # 0/1 (feedback MOSTRADO, puede ser engañoso)
outcome,            # -1/+1 (mismo feedback, formato alternativo)
actual_is_correct,  # 0/1 (verdad empírica, SIN engaño)
misleading,         # 0/1 (¿fue engañoso este trial?)
```

#### Estructura de Fase
```csv
correct_option_in_block,  # A o B (opción correcta en este bloque)
is_reversal_trial,        # 0/1 (¿es el ensayo de reversión?)
reversal_block,           # 0, 1, 2... (número de bloque)
is_reversal_phase,        # 0/1 (¿post-reversión?)
reversal_number,          # 0, 1, 2... (SOLO EN MODO CRITERION)
```

#### Errores Conductuales
```csv
is_perseverative,         # 0/1 (¿error pegarse a lo viejo?)
is_regressive_error,      # 0/1 (¿error olvidar lo aprendido?)
```

#### Temporal
```csv
rt,                       # Reaction time (segundos)
omission,                 # 0/1 (¿no respondió a tiempo?)
```

#### Probabilidades (Debug)
```csv
prob_good,                # P(reward | correcta) en este trial
prob_bad,                 # P(reward | incorrecta) en este trial
icv_global,               # Índice de inversión de preferencia global
icv_learn,                # Índice de inversión en fase learning
icv_rev,                  # Índice de inversión en fase reversión
```

#### LEGACY (Mantener compatibilidad, deprecated)
```csv
trial_in_phase,           # Número de trial dentro de la fase (DEPRECATED)
is_reversal_first_trial,  # Alias para is_reversal_trial (DEPRECATED)
```

### 5.3 Orden de Exportación (Estricto)
```
[META KEYS]
participant_id, ..., meta_debug_n_trials_stim_B_phase_1,
[DATA KEYS]
trial, choice_code, reward, outcome, actual_is_correct, correct_option_in_block,
misleading, is_reversal_trial, reversal_block, is_reversal_phase,
trial_in_phase, is_reversal_first_trial, is_perseverative, is_regressive_error,
rt, omission, prob_good, prob_bad, icv_global, icv_learn, icv_rev
[SI MODO CRITERION]
reversal_number
```

**⚠️ IMPORTANTE:** El orden es **estricto** para que revisores externos puedan validar manualmente los primeros trials.

### 5.4 Ejemplo de 3 Trials
```csv
participant_id,trial,choice_code,reward,outcome,actual_is_correct,correct_option_in_block,misleading,is_reversal_trial,reversal_block,is_reversal_phase,...
sub_001,1,1,1,+1,1,A,0,0,0,0,...
sub_001,2,1,1,+1,1,A,0,0,0,0,...
sub_001,3,2,0,-1,0,A,0,0,0,0,...
```

---

## 6. VALIDACIONES ANTES DE ANALIZAR

### 6.1 Checklist de Integridad CSV
- [ ] **Filas:** n_trials × n_participants (ej. 80 × 20 = 1600 filas)
- [ ] **Columnas:** ≥ 20 columnas (≥ 21 si modo criterion)
- [ ] **choice_code:** TODOS en {1, 2}, sin NA
- [ ] **reward:** TODOS en {0, 1, 'NA'}, sin valores intermedios
- [ ] **actual_is_correct:** Coincide con choice_code y correct_option (validación cruzada)
- [ ] **misleading:** Solo 1 cuando `reward ≠ actual_is_correct`
- [ ] **is_reversal_trial:** Max 1 por reversal_block (o 0 si modo libre)
- [ ] **reversal_block:** Secuencia monotónica creciente (0,0,...,0,1,1,...,1,2,...)

### 6.2 Validaciones Estadísticas
```R
# En R, post-importación CSV:
mean(df$actual_is_correct[df$omission==0], na.rm=T)  # Accuracy real ~60-90%
mean(df$reward[df$omission==0], na.rm=T)              # Reward ~50-70% (puede != accuracy si hay engaño)
table(df$choice_code)                                 # Aproximadamente balanceado (sin sesgo extremo)
```

### 6.3 Qué Significa Si...
| Patrón | Interpretación |
|--------|----------------|
| `reward ≈ actual_is_correct` | Poco/nada de engaño; feedback fiable |
| `reward > actual_is_correct` | Mucho engaño positivo; modelo aprende mal |
| `is_regressive >> 0` | Aprendizaje inestable; problema cognitivo |
| `is_perseverative >> 0` (post-rev) | Rigidez mental; problema de flexible switching |

---

## 7. RECOMENDACIONES PARA hBayesDM (R)

### 7.1 Estructura de Datos para Entrada
```R
# Requiere 3 columnas mínimas:
data <- data.frame(
  subjID = rep(1, 80),          # ID del participante
  choice = choice_code - 1,      # Conversión: 1→0, 2→1
  feedback = outcome             # -1 o +1
)
```

### 7.2 Modelo Recomendado
- **Función:** `rw_stan()` (Rescorla-Wagner con Softmax)
- **Parámetros:** α (learning rate), β (inverse temperature)
- **Priors:** Estándar de hBayesDM (informados)
- **Feedback:** Usa `outcome` (-1/+1), NO `reward` (0/1)

### 7.3 Preparación de Datos Pre-Reversal
```R
# Si quieres un modelo per-phase:
data_learning <- subset(data, is_reversal_phase == 0)
data_reversal <- subset(data, is_reversal_phase == 1)
```

---

## 8. CONVENCIONES CÓDIGO Y NOTAS PARA REVISORES

### 8.1 Dónde Encontrar Cada Lógica
| Concepto | Ubicación (approx. línea) | Función |
|----------|----------|-----------|
| Cálculo feedback | L2264+ | `logTrial()` |
| Detección reversión | L2400+ | `checkReversalCriterion()` |
| Construcción CSV | L3270+ | `downloadDataAsCSV()` |
| Conversión choice | L3439 | `buildChoicesRewards()` |

### 8.2 Variables Críticas a Auditar
1. **`trueCorrectSide`**: Debe alternar entre 'A' ↔ 'B' en reversiones
2. **`feedbackCorrect`**: Debe coincidir con `outcome` (con posible engaño)
3. **`misleading`**: Debe ser 1 sólo cuando hay inconsistencia
4. **`isReversalTrial`**: Debe estar en 1 exactamente en transiciones

### 8.3 Posibles Fuentes de Error (Checklist Revisor)
- [ ] **Off-by-one:** ¿`reversal_block` empieza en 0 o 1?
- [ ] **Engaño no marcado:** ¿Hay trials con `misleading=0` que deberían ser 1?
- [ ] **Conversión choice:** ¿Se usó {0,1} en lugar de {1,2}?
- [ ] **Columnas faltantes:** ¿Faltan `is_reversal_phase` o `outcome`?
- [ ] **Orden columnas:** ¿Se mantiene el orden documentado?

---

## 9. CONTACTO Y ACTUALIZACIONES

- **Documento:** CODEBOOK.md
- **Última revisión:** 2026-03-08
- **Compatibilidad:** PRLT_trabajo.html v1.0+
- Para preguntas: [Contacto del autor]

---

## Apéndice A: Glosario

| Término | Definición |
|---------|-----------|
| **Feedback** | Información mostrada al participante (puede ser engañosa) |
| **Outcome** | Feedback codificado como -1 (pérdida) o +1 (ganancia) |
| **Reward** | Feedback codificado como 0 (no) o 1 (sí) |
| **Reversal** | Inversión de la opción correcta (A↔B) |
| **Perseverancia** | Persistencia en elegir la opción vieja después de reversión |
| **Regresión** | Error en opción correcta tras haberla aprendido |
| **Omisión** | Trial donde el participante no respondió a tiempo |
| **Criterion** | Umbral de desempeño que dispara una reversión |
| **ICV** | Índice de cambio de variable (probabilidad implícita de aprender) |

---

## Apéndice B: Exemplos de Interpretación

### Escenario 1: Trial 35 (Fase Learning, Sin Engaño)
```
Verdad:  A correcta (70%), B incorrecta (30%)
Participante: Elige A
Feedback: Positivo
CSV:
  choice_code=1, reward=1, outcome=+1, actual_is_correct=1,
  correct_option_in_block=A, misleading=0, is_reversal_trial=0,
  reversal_block=0, is_reversal_phase=0
```
✅ **Interpretación:** Acierto legítimo, aprendizaje correcto.

### Escenario 2: Trial 36 (Fase Learning, CON Engaño)
```
Verdad:  A correcta (70%), B incorrecta (30%)
Participante: Elige B
Feedback: Positivo (engañoso)
CSV:
  choice_code=2, reward=1, outcome=+1, actual_is_correct=0,
  correct_option_in_block=A, misleading=1, is_reversal_trial=0,
  reversal_block=0, is_reversal_phase=0
```
⚠️ **Interpretación:** Participante cree que aprendió B, pero es incorrecto. El modelo RL aprenderá `reward=1` (engaño), pero análisis conductual ve `actual_is_correct=0` (fallo).

### Escenario 3: Trial 41 (Reversión, Modo Predetermined)
```
Verdad:  B ahora correcta (70%), A ahora incorrecta (30%)
Participante: Elige A (la opción vieja)
Feedback: Negativo
CSV:
  choice_code=1, reward=0, outcome=-1, actual_is_correct=0,
  correct_option_in_block=B, misleading=0, is_reversal_trial=1,
  reversal_block=1, is_reversal_phase=1, is_perseverative=0
```
ℹ️ **Interpretación:** Primer trial post-reversión. Es error pero NO perseverativo porque `is_reversal_trial=1`. En el siguiente trial (42), si elige A, sería perseverativo.
