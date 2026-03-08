# Checklist: Antes de Publicar el Manuscrito con Datos PRLT

**Propósito:** Asegurar que todo está documentado, consistente y reproducible antes de envío a revista.

---

## A. DOCUMENTACIÓN (Revisar que los 3 archivos existan)

- [ ] **CODEBOOK.md** (sección de Variables)
  - [ ] Sección 1: Codificación de elecciones (choice_code 1/2 vs 0/1 vs A/B)
  - [ ] Sección 2: Feedback vs reward vs outcome vs actual_is_correct
  - [ ] Sección 3: Fases y reversiones (reversal_block, is_reversal_trial, is_reversal_phase)
  - [ ] Sección 4: Errores perseverativos y regresivos
  - [ ] Sección 5: Estructura completa CSV
  - [ ] Sección 6: Validaciones

- [ ] **README_PARA_REVISORES.md** (Guía de validación)
  - Listo para compartir con revisores pares
  - Incluye checklist de validación cruzada

- [ ] **PRLT_trabajo.html** (Código con comentarios mejorados)
  - [ ] Línea ~2240: Comentario sobre feedbackCorrect, actual_is_correct, misleading
  - [ ] Línea ~2292: Comentario sobre error perseverativo y regresivo
  - [ ] Línea ~3278: Comentario sobre estructura de columnas CSV

---

## B. DATOS EXPORTADOS (Antes de enviar datos al reviewer)

### Estructura del CSV
```bash
# Terminal: Validar que el CSV es válido
file datos.csv
# Debería mostrar: "datos.csv: ASCII text, with very long lines"

# Contar filas y columnas
wc -l datos.csv  # n_participants × n_trials + 1 (header)
head -1 datos.csv | tr ',' '\n' | wc -l  # ≈26 columnas
```

- [ ] **Archivo CSV válido** (sin corrupción, abre en Excel/R)
- [ ] **Filas:** n_participants × n_trials + 1 (header)
  - Ej. 20 participantes × 80 trials = 1601 filas
- [ ] **Columnas:** ≥26 (meta + data + legacy)

### Valores Críticos (Primeras 10 filas)
```R
# En R:
df <- read.csv('datos.csv')
head(df, 10)

# Validar choice_code
unique(df$choice_code[!is.na(df$choice_code)])  # Debe ser: 1, 2
# ✅ Esperado: [1] 1 2
# ❌ BAD: [1] 0 1 (o A B)

# Validar reward
unique(df$reward[!is.na(df$reward)])  # Debe ser: 0, 1
# ✅ Esperado: [1] 0 1
# ❌ BAD: -1 +1 (eso es outcome)

# Validar outcome
unique(df$outcome[!is.na(df$outcome)])  # Debe ser: -1, 1
# ✅ Esperado: [1] -1 1
# ❌ BAD: 0 1 (eso es reward)

# Validar actual_is_correct
unique(df$actual_is_correct[!is.na(df$actual_is_correct)])  # Debe ser: 0, 1
# ✅ Esperado: [1] 0 1
```

- [ ] **choice_code ∈ {1, 2}** (NO 0/1, NO A/B)
- [ ] **reward ∈ {0, 1}** (NO -1/+1)
- [ ] **outcome ∈ {-1, +1}** (NO 0/1)
- [ ] **actual_is_correct ∈ {0, 1}**
- [ ] **Relación correcta:** reward=1 ⟺ outcome=+1

### Lógica de Fase
```R
# Validar reversal_block es monótono
df %>%
  group_by(participant_id) %>%
  summarise(is_monotonic = all(diff(reversal_block) >= 0)) %>%
  pull(is_monotonic) %>%
  all()
# ✅ Esperado: TRUE
```

- [ ] **reversal_block monótono** (no disminuye)
- [ ] **is_reversal_trial ∈ {0, 1}**
- [ ] **is_reversal_phase ∈ {0, 1}**
- [ ] **is_reversal_phase solo transición 0→1** (nunca vuelve a 0)

### Lógica de Errores
```R
# Validar is_perseverative solo en reversal_phase=1
df %>%
  filter(is_perseverative == 1) %>%
  summarise(all_reversal_phase = all(is_reversal_phase == 1))
# ✅ Esperado: TRUE

# Validar is_regressive solo si actual_is_correct=0
df %>%
  filter(is_regressive_error == 1) %>%
  summarise(all_errors = all(actual_is_correct == 0))
# ✅ Esperado: TRUE
```

- [ ] **is_perseverative = 0 en learning phase**
- [ ] **is_perseverative = 0 en trial de reversión**
- [ ] **is_regressive = 0 si actual_is_correct = 1**

### Estadísticas Sumarias
```R
df %>%
  group_by(participant_id) %>%
  summarise(
    accuracy = mean(actual_is_correct[omission==0], na.rm=T),
    omission_pct = 100 * mean(omission),
    reward_mean = mean(reward[omission==0], na.rm=T),
    n_trials = n()
  ) %>%
  summary()
```

- [ ] **Accuracy 0.60–0.90** (significativamente mejor que 0.5)
- [ ] **Omission rate < 5%** (idealmente ~0%)
- [ ] **Reward rate 0.50–0.75** (depende del parámetro de engaño)
- [ ] **Todos participantes: n_trials ≈ esperado**

---

## C. MANUSCRITO (Sección Methods/Results)

### Subsección: Data Collection & Coding

- [ ] Se menciona que se exportaron 3 codificaciones de feedback
  - [ ] `reward` (0/1) para Q-learning clásico
  - [ ] `outcome` (-1/+1) para hBayesDM
  - [ ] `actual_is_correct` (0/1) para análisis conductual

- [ ] Se explica que `actual_is_correct ≠ feedback` cuando hay engaño
  - [ ] Se menta `misleading` (0/1)
  - [ ] Se justifica por qué se necesitan ambas

- [ ] Se describe nomenclatura de fases:
  - [ ] `reversal_block` (número del bloque)
  - [ ] `is_reversal_trial` (marca de transición)
  - [ ] `is_reversal_phase` (0=learning, 1=post-reversal)

- [ ] Se describe errores conductuales:
  - [ ] Error perseverativo (pegarse a lo viejo)
  - [ ] Error regresivo (olvidar lo nuevo)

- [ ] **Reference a CODEBOOK.md:** Mencionar "See Supplementary Material CODEBOOK.md for detailed variable definitions"

### Subsección: Statistical Analysis

- [ ] Se menciona qué archivo CSV se subió
- [ ] Se menciona software (R, Python, MATLAB)
- [ ] Se menciona que análisis usó `reward` y `outcome`, NO `actual_is_correct` para RL models
- [ ] Se menciona que análisis conductual usó `actual_is_correct`, NO feedback

---

## D. MATERIALES SUPLEMENTARIOS

### Qué Incluir en Supplementary Materials

- [ ] **CODEBOOK.md** (versión final)
- [ ] **README_PARA_REVISORES.md** (si la revista permite)
- [ ] **Ejemplo CSV de 3 participantes** (primeros 10 trials cada uno)
- [ ] **Script R/Python de validación** (reproducible)
  ```R
  # validate_prlt_data.R
  source('validate_prlt.R')
  df <- read.csv('datos.csv')
  validate_choice_code(df)
  validate_reward_outcome(df)
  validate_phase_structure(df)
  validate_behavioral_errors(df)
  ```

- [ ] **Figuras de validación:**
  - [ ] Fig S1: Evolución de accuracy por fase (learning vs reversal)
  - [ ] Fig S2: Tasa de errores perseverativos por position en reversal
  - [ ] Fig S3: Distribución de reaction times

---

## E. PREPARACIÓN PARA ENVÍO

### Antes de Enviar a la Revista

- [ ] **Anonimizar datos** si es requerido
  - [ ] Cambiar participant_id a sujeto_001, sujeto_002, etc.
  - [ ] Quitar timestamps, IPs, info personal

- [ ] **Validar encoding UTF-8** (si tienes caracteres españoles)
  ```bash
  file -b --mime-encoding datos.csv
  # Debería mostrar: utf-8
  ```

- [ ] **Comprimir archivos:**
  ```bash
  tar -czf PRLT_Data_Supplementary.tar.gz CODEBOOK.md README_PARA_REVISORES.md datos.csv
  # o .zip para Windows
  zip PRLT_Data_Supplementary.zip CODEBOOK.md README_PARA_REVISORES.md datos.csv
  ```

- [ ] **Crear README en Open Science Framework (OSF)** o repositorio similar:
  ```markdown
  # PRLT Data Release

  Files:
  - CODEBOOK.md: Complete variable definitions
  - README_PARA_REVISORES.md: Data validation guide
  - datos.csv: Full dataset (N participants × trials)
  - validate_prlt.R: R script for reproducible validation

  License: CC-BY 4.0 (or your choice)
  ```

### Envío Revista

- [ ] Mencionar en "Data Availability Statement":
  > "Data and codebook are available at [OSF/GitHub/Zenodo URL].
  > All variables are documented in CODEBOOK.md with examples of expected values."

- [ ] Mencionar en "Author Contributions":
  > "PRLT implementation: [author]. Data validation and documentation: [author]."

---

## F. POST-PUBLICACIÓN (Transparencia)

- [ ] **Versionar datos en GitHub/OSF** con fecha
  - [ ] v1.0: Publicación inicial
  - [ ] v1.1: Correcciones menores (si procede)

- [ ] **Mantener CODEBOOK.md** actualizado si hay replicaciones o erratas

- [ ] **Respondé a preguntas de revisores** sobre codificación de manera clara

---

## G. CHECKLIST FINAL (Antes de Click "Submit")

- [ ] ✅ CODEBOOK.md existe y es completo
- [ ] ✅ README_PARA_REVISORES.md existe y es claro
- [ ] ✅ HTML tiene comentarios mejorados
- [ ] ✅ CSV pasa todas las validaciones
- [ ] ✅ choice_code en {1, 2}
- [ ] ✅ reward en {0, 1}
- [ ] ✅ outcome en {-1, +1}
- [ ] ✅ actual_is_correct en {0, 1}
- [ ] ✅ reversal_block monótono
- [ ] ✅ is_reversal_phase solo transición 0→1
- [ ] ✅ Errores conductuales lógicamente válidos
- [ ] ✅ Estadísticas sumarias razonables
- [ ] ✅ Manuscrito referencia CODEBOOK
- [ ] ✅ Materialsuple incluye archivos relevantes
- [ ] ✅ Data availability statement es claro
- [ ] ✅ Archivos comprimidos y listos

---

## Contacto y Soporte

Si durante el proceso de revisión detectas inconsistencias:

1. **Reproducir error con CODEBOOK.md abierto**
2. **Validar en R con script**
3. **Documentar línea exacta en CSV**
4. **Contactar al autor con:**
   - Participant ID
   - Trial number(s)
   - Variable(s) afectadas
   - Validación R que muestra el error

---

**Última actualización:** 2026-03-08
**Versión:** 1.0

Buena suerte con la publicación! 🚀
