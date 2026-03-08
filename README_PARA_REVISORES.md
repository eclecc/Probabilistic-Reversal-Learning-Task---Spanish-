# Guía Rápida para Revisores: Validación de Datos PRLT

**Dirigido a:** Editores, revisores pares, analistas independientes

**Objetivo:** Validar que los datos exportados desde PRLT son correctos, consistentes y listos para análisis publicable.

---

## 1. CHECKLIST INICIAL (5 minutos)

Antes de cualquier análisis, verificar esto:

### Estructura del CSV
```bash
# En bash/terminal:
head -1 <archivo>.csv | tr ',' '\n' | nl
```

Debería mostrar ~26 columnas. **Orden crítico:**
1. `participant_id` (metadatos)
2. ... (otros metadatos)
3. `trial`
4. `choice_code` ← Debe ser {1, 2}
5. `reward` ← Debe ser {0, 1, 'NA'}
6. `outcome` ← Debe ser {-1, +1, 'NA'}
7. `actual_is_correct` ← Debe ser {0, 1, 'NA'}
8. ... (resto de columnas)

### Filas
```R
# En R:
nrow(df)  # Debería ser n_participants × n_trials
# Ej: 20 participantes × 80 trials = 1600 filas
```

### Valores Válidos (Primeras 10 Filas)
```R
# En R:
df_sample <- df[1:10, c('choice_code', 'reward', 'outcome', 'actual_is_correct', 'misleading')]
print(df_sample)
```

Ejemplo esperado:
```
  choice_code reward outcome actual_is_correct misleading
1           1      1      +1                 1          0
2           1      1      +1                 1          0
3           2      0      -1                 0          0
4           1      1      +1                 1          0
5           2      0      -1                 0          0
...
```

**Red flags:**
- ❌ `choice_code` ∉ {1, 2}
- ❌ `reward` ∉ {0, 1, 'NA'}
- ❌ `outcome` ∉ {-1, +1, 'NA'}
- ❌ Valores intermedios (ej. 0.5)
- ❌ Columnas en orden diferente

---

## 2. VALIDACIONES CRUZADAS (10 minutos)

### Relación: `reward` ↔ `outcome`
```R
# Deben ser equivalentes (mismo feedback, distinto código)
df$outcome_check <- ifelse(df$reward == 1, 1, -1)
df$outcome_match <- (df$outcome == df$outcome_check) | (df$reward == 'NA')
all(df$outcome_match)  # Debe ser TRUE
```

✅ Si pasa: Feedback consistente.

### Relación: `reward` ↔ `actual_is_correct` (Engaño)
```R
# No deben coincidir siempre (si no, no hay engaño)
df$misleading_calc <- (df$reward != df$actual_is_correct) & (df$reward != 'NA')
df$misleading_match <- (df$misleading == 1 & df$misleading_calc) |
                        (df$misleading == 0 & !df$misleading_calc)
all(df$misleading_match)  # Debe ser TRUE
```

✅ Si pasa: Engaño marcado correctamente.

Datos esperados:
```R
table(df$misleading)
#     0     1
# 1350   250  (ej. 17.6% engaño)
```

### Relación: `choice_code` ↔ `actual_is_correct`
```R
# actual_is_correct debe estar determinado por choice_code y
# correct_option_in_block
df$actual_is_correct_calc <-
  ifelse(df$choice_code == 1 & df$correct_option_in_block == 'A', 1,
  ifelse(df$choice_code == 2 & df$correct_option_in_block == 'B', 1, 0))

df$correct_match <- (df$actual_is_correct == df$actual_is_correct_calc) |
                    (df$actual_is_correct == 'NA')
all(df$correct_match)  # Debe ser TRUE
```

✅ Si pasa: Coherencia lógica correcta.

---

## 3. ESTRUCTURA DE FASES (10 minutos)

Validar que `reversal_block` cambia en los momentos correctos.

### Modo Predetermined
```R
# reversal_block debe ser:
# - 0 en trials 1 a 40
# - 1 en trials 41 a 80
table(df$reversal_block, df$trial)

# is_reversal_trial debe ser 1 SOLO en trials donde reversal_block cambia
df %>%
  group_by(participant_id) %>%
  summarise(
    reversal_trials = sum(is_reversal_trial),
    reversal_blocks = length(unique(reversal_block))
  )
# Si maxTrials=80, reversalTrial=41: reversal_trials ≈ 1 por participante
```

**Espera:**
```
participant_id reversal_trials reversal_blocks
1              1               2
2              1               2
...
```

### Modo Criterion
```R
# reversal_block puede cambiar en momentos distintos por participante
df %>%
  group_by(participant_id) %>%
  summarise(
    n_reversions = max(reversal_block),
    reversal_trials = sum(is_reversal_trial),
    max_trial = max(trial)
  )
# reversal_trials debería ≈ reversal_blocks
# max_trial puede variar (parada cuando se completó criterio)
```

**Espera:**
```
participant_id n_reversions reversal_trials max_trial
1              2            2               72
2              3            3               85
```

---

## 4. VARIABLE `is_reversal_phase` (Crítica)

Esta variable debe ser 0 o 1, **nunca mixta** por participant.

```R
df %>%
  group_by(participant_id) %>%
  summarise(
    phase_0_trials = sum(is_reversal_phase == 0),
    phase_1_trials = sum(is_reversal_phase == 1),
    transitions = sum(diff(is_reversal_phase) != 0)
  )
```

**Espera:**
- `phase_0_trials` > 0 (fase learning inicial)
- `phase_1_trials` > 0 (fase post-reversión)
- `transitions` ≤ 1 (cambio de 0→1 solo una vez, nunca vuelve a 0)

Ejemplo correcto:
```
participant_id phase_0_trials phase_1_trials transitions
1              40             40             1
2              35             45             1
```

❌ **Red flag:** `transitions > 1` (significaría reversal_phase osciló)

---

## 5. ERRORES CONDUCTUALES (10 minutos)

### Errores Perseverativos

Deben ocurrir **SOLO** en fase post-reversión y NUNCA en trial de reversión.

```R
# Validación 1: is_perseverative solo en is_reversal_phase=1
df %>%
  filter(is_perseverative == 1) %>%
  summarise(all_in_reversal_phase = all(is_reversal_phase == 1))
# Debe ser TRUE
```

✅ Si pasa: Perseveración solo en la fase correcta.

```R
# Validación 2: is_perseverative = 0 cuando is_reversal_trial=1
df %>%
  filter(is_reversal_trial == 1) %>%
  summarise(all_zero = all(is_perseverative == 0))
# Debe ser TRUE
```

✅ Si pasa: No se marca perseveración en el trial de reversión mismo.

### Errores Regresivos

```R
# is_regressive debe ser:
# - 0 si actual_is_correct=1 (acierto, no puede ser error)
# - 1 solo si actual_is_correct=0 (error) Y ya ha aprendido en el bloque
df %>%
  filter(is_regressive_error == 1) %>%
  summarise(all_errors = all(actual_is_correct == 0))
# Debe ser TRUE
```

✅ Si pasa: Regresión solo marca errores.

---

## 6. ESTADÍSTICAS SUMARIAS (5 minutos)

Deberían estar en rango razonable:

```R
df_summary <- df %>%
  group_by(participant_id) %>%
  summarise(
    accuracy = mean(actual_is_correct[omission==0], na.rm=T),
    reward_rate = mean(reward[omission==0], na.rm=T),
    perseverative_pct = 100 * sum(is_perseverative) / sum(is_reversal_phase==1),
    regressive_pct = 100 * sum(is_regressive_error) / sum(actual_is_correct==0 & is_reversal_phase==1),
    omission_rate = mean(omission),
    mean_rt = mean(rt, na.rm=T)
  )

summary(df_summary)
```

**Rangos esperados (si prueba típica de reversión):**
- `accuracy`: 0.60–0.90 (mejor que chance 0.5)
- `reward_rate`: 0.50–0.75 (depende del engaño)
- `perseverative_pct`: 10–40% (mayor en primeros trials post-reversión)
- `regressive_pct`: 5–20% (errores tras aprender)
- `omission_rate`: 0–5% (muy baja, idealmente ~0)
- `mean_rt`: 0.5–2.0 segundos

**Red flags:**
- ❌ `accuracy` < 0.55 (peor que chance)
- ❌ `omission_rate` > 20% (técnico = participante no respondía)
- ❌ `mean_rt` < 0.1s o > 5s (problema de tiempo)

---

## 7. COMPARACIÓN MODES (Si hay ambos)

Si la base de datos incluye participantes en modo `predetermined` y `criterion`:

```R
# Ver distribución
table(df$reversal_mode)

# Comparar duración (trials)
df %>%
  group_by(participant_id, reversal_mode) %>%
  summarise(max_trial = max(trial)) %>%
  ggplot(aes(x=reversal_mode, y=max_trial)) + geom_boxplot()
```

**Espera:**
- Modo `predetermined`: todos ~80 trials (fijo)
- Modo `criterion`: 60–100 trials (variable)

---

## 8. LISTA DE VERIFICACIÓN FINAL

- [ ] **Archivo abre sin errores** (formato CSV válido)
- [ ] **Columnas correctas** (≥20 columns, orden consistente)
- [ ] **choice_code ∈ {1,2}**, sin 'NA' excepto en omisiones
- [ ] **reward ∈ {0,1,'NA'}**
- [ ] **outcome ∈ {-1,+1,'NA'}**
- [ ] **actual_is_correct ∈ {0,1,'NA'}**
- [ ] **reward = outcome (lógicamente)**: relación 0↔-1, 1↔+1
- [ ] **misleading calculado correctamente**: misleading=1 ⟺ reward≠actual
- [ ] **reversal_block monótono creciente** por participant
- [ ] **is_reversal_phase transición única** (0→1 solo una vez)
- [ ] **is_perseverative solo en reversal_phase=1**
- [ ] **is_perseverative=0 cuando is_reversal_trial=1**
- [ ] **is_regressive solo cuando actual_is_correct=0**
- [ ] **Estadísticas sumarias en rango razonable** (accuracy, RT, omisiones)
- [ ] **Ningún valor nulo inesperado** en columnas principales
- [ ] **Modo reversión consistente** (predetermined o criterion, no mixto)

---

## 9. SI FALLA ALGUNA VALIDACIÓN

### Paso 1: Identificar patrón

```R
# ¿Es un participante o varios?
df %>%
  group_by(participant_id) %>%
  summarise(n_errors = sum(! (validación)))
```

### Paso 2: Inspeccionar trials específicos

```R
# Si participant_id=5 falla:
df_p5 <- df %>% filter(participant_id == 5)

# Ver primeros 20 trials
df_p5[1:20, c('trial', 'choice_code', 'reward', 'actual_is_correct',
              'reversal_block', 'is_reversal_trial')]

# Ver trials donde ocurra la anomalía
df_p5 %>%
  filter(! (validación)) %>%
  select(trial, choice_code, reward, actual_is_correct, reversal_block)
```

### Paso 3: Reportar al autor

Ej.:
```
"Participant ID 7: is_reversal_phase contiene transiciones múltiples
(0→1→0). Trials: 35 (fase 0), 36-65 (fase 1), 66-80 (fase 0 nuevamente).
Esto sugiere error en reinicio de reversal_phase o lógica de reversión."
```

---

## 10. CONTACTO Y PREGUNTAS

Para preguntas sobre codificación o validación, referirse a:
- **CODEBOOK.md** (secciones 1–5)
- **Comentarios en PRLT_trabajo.html** (líneas 2240+, 2292+, 3278+)

---

**Última actualización:** 2026-03-08
**Versión:** 1.0
