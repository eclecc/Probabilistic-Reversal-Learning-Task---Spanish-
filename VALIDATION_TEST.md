# PRLT 6.0 - Verificación de Lógica de Reversión

## Caso de Prueba: Modo Predeterminado (60 ensayos, reversión en ensayo 31)

### Estado Inicial
- `reversalBlock = 0`
- `isReversalTrial = false`
- `reversalPhase = false`
- `correctChoicesInBlock = Set()`
- `correctStimulus = 'A'` (establecido en primer ensayo)

### Ensayos 1-30 (Fase de Aprendizaje)
Cada ensayo:
- `isReversalTrial` permanece `false`
- `reversalBlock` permanece `0`
- `reversalPhase` permanece `false`
- Si el participante acierta, se añade a `correctChoicesInBlock`

Ejemplo ensayo 15 (participante elige A, es correcto):
```
trial: 15
choice: 'A'
actual_is_correct: 1
reversalBlock: 0
isReversalTrial: 0
is_regressive: 0
correctChoicesInBlock: {3, 5, 7, 9, 11, 13, 15, ...}
```

### Ensayo 31 (Ensayo de Reversión)
En `processChoice`:
1. Se detecta: `currentTrialNumber === reversalTrial` (31 === 31)
2. `shouldReverse = true`
3. `isReversalTrial = true`
4. `reversalBlock++` → ahora es `1`
5. `correctStimulus` cambia de 'A' a 'B'
6. `correctChoicesInBlock.clear()` → ahora es `Set()`
7. `isReversalPhase = true` (legacy)

En `logTrial`:
```
trial: 31
isReversalTrial: 1  (TRUE en este ensayo)
reversalBlock: 1    (incrementado)
reversalPhase: 0    (no aplicable en modo predeterminado)
is_regressive: 0    (no puede ser regresivo en el ensayo de reversión)
```

### Ensayos 32-40 (Tras Reversión, Aprendiendo B)
Ejemplo ensayo 35 (participante elige A, es incorrecto):
```
trial: 35
choice: 'A' (incorrecto, debería elegir B)
actual_is_correct: 0
reversalBlock: 1
isReversalTrial: 0
is_perseverative: 1  (eligió el anteriormente correcto)
is_regressive: 0     (aún no ha aprendido B en este bloque)
correctChoicesInBlock: {}  (vacío, no ha acertado aún en bloque 1)
```

### Ensayo 38 (Primera vez que acierta B tras reversión)
```
trial: 38
choice: 'B' (correcto)
actual_is_correct: 1
reversalBlock: 1
isReversalTrial: 0
is_regressive: 0
correctChoicesInBlock: {38}  (primer acierto en bloque 1)
```

### Ensayo 42 (Regresa a elegir A, error regresivo)
```
trial: 42
choice: 'A' (incorrecto)
actual_is_correct: 0
reversalBlock: 1
isReversalTrial: 0
is_perseverative: 1
is_regressive: 1  (ERROR: ya había acertado B en ensayo 38, ahora regresa a A)
correctChoicesInBlock: {38, 40}  (había acertado en 38 y 40)
```

### Resumen de Mejora

**Problema Anterior**: El error regresivo se calculaba basándose en `hasMadeCorrectInThisPhase`, que era global para toda la fase de reversión. Esto podía marcar incorrectamente errores como regresivos.

**Solución Nueva**: El error regresivo se calcula verificando si `correctChoicesInBlock.size > 0`, lo cual rastrea específicamente si el participante ya demostró conocimiento de la contingencia correcta **en el bloque actual**.

## Caso de Prueba: Modo Criterio

En modo criterio, `reversalPhase` se vuelve `true` tras la primera reversión:

### Primera Reversión (alcanzado criterio en ensayo 28)
```
trial: 28 (ensayo de reversión)
isReversalTrial: 1
reversalBlock: 1 (incrementado de 0)
reversalPhase: 1 (TRUE a partir de ahora en modo criterion)
```

### Segunda Reversión (alcanzado criterio en ensayo 45)
```
trial: 45 (ensayo de segunda reversión)
isReversalTrial: 1
reversalBlock: 2 (incrementado de 1)
reversalPhase: 1 (permanece TRUE)
```

## Exportación CSV

### Metadatos Nuevos (ejemplo):
```
meta_participant_id: "P001"
meta_reversal_schedule: 31  (modo predetermined) o "criterion-based"
meta_window_focus_changes: 3  (participante perdió foco 3 veces)
```

### Columnas Nuevas/Renombradas:
```
is_reversal_trial: 0 | 1      (antes: reversal)
reversal_block: 0, 1, 2...    (antes: phase)
is_reversal_phase: 0 | 1      (nueva)
is_regressive_error: 0 | 1    (antes: is_regressive)
```

## Validación Manual

Para validar manualmente:
1. Abrir PRLT Flexible 6.0.html en navegador
2. Configurar modo predeterminado, 60 ensayos
3. Completar tarea
4. Descargar CSV
5. Verificar:
   - Columna `reversalBlock`: debe ser 0 en ensayos 1-30, 1 en ensayos 31-60
   - Columna `is_reversal_trial`: debe ser 1 solo en ensayo 31
   - Columna `is_regressive_error`: debe ser 1 solo en ensayos donde:
     - `actual_is_correct = 0` Y
     - Ya había acertado al menos una vez en el `reversalBlock` actual
6. Verificar metadatos:
   - `meta_participant_id` debe coincidir con ID ingresado
   - `meta_reversal_schedule` debe ser 31
   - `meta_window_focus_changes` debe reflejar cambios de ventana

## Checklist de Validación

- [ ] Variables nuevas declaradas sin errores de sintaxis
- [ ] `reversalBlock` incrementa correctamente en reversiones
- [ ] `isReversalTrial` es `true` solo en ensayo de reversión
- [ ] `correctChoicesInBlock` se limpia tras cada reversión
- [ ] Error regresivo calculado correctamente
- [ ] CSV tiene nuevas columnas con datos correctos
- [ ] Metadatos incluyen participant_id, reversal_schedule, window_focus_changes
- [ ] Contador windowFocusChanges funciona con blur/focus
