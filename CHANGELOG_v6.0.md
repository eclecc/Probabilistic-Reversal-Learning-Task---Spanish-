# PRLT Flexible 6.0 - Registro de Cambios

## Versión 6.0 - Refinamiento de Auditoría y Lógica de Reversión

### 1. Mejoras en la Comprensibilidad del Código

Se han añadido comentarios detallados en español a lo largo del bloque `<script>` para mejorar la mantenibilidad y claridad del código. Los comentarios estructuran el código en las siguientes secciones:

- **SECCIÓN 1**: Variables Globales y Constantes
- **SECCIÓN 2**: Manejadores de Eventos de Ventana (Auditoría)
- **SECCIÓN 3**: Funciones de Generación de Urnas de Feedback
- **SECCIÓN 4**: Selectores de Elementos del DOM
- **SECCIÓN 5**: Sistema de Práctica Interactivo (Preview)
- **SECCIÓN 6**: Lógica Principal de la Tarea
- **SECCIÓN 7**: Registro de Ensayos (logTrial)
- **SECCIÓN 8**: Funciones de Exportación de Datos
- **SECCIÓN 9**: Cálculo de Resultados y Métricas

### 2. Enriquecimiento de Metadatos CSV para Auditoría

Se han añadido tres nuevos campos de metadatos al objeto `meta` en la función `downloadCsv`:

#### Nuevos Metadatos:
- **`meta_participant_id`**: ID del participante introducido por el usuario
- **`meta_reversal_schedule`**: En modo predeterminado contiene el número de ensayo de reversión; en modo criterio indica "criterion-based"
- **`meta_window_focus_changes`**: Contador que rastrea cuántas veces el usuario ha perdido el foco de la ventana durante la tarea

#### Implementación de Rastreo de Foco:
Se han implementado manejadores de eventos `window.addEventListener('blur')` y `window.addEventListener('focus')` que incrementan automáticamente el contador `windowFocusChanges` cada vez que el participante sale de la ventana de la tarea.

### 3. Refactorización de la Lógica de Reversión

#### Nuevas Variables de Estado:

1. **`reversalBlock`** (entero, inicializado en 0):
   - Representa el "bloque de aprendizaje" actual
   - Se incrementa en 1 cada vez que ocurre una reversión
   - Permite rastrear el número de reversiones que han ocurrido
   - Valor 0 = fase inicial de aprendizaje, 1 = tras primera reversión, etc.

2. **`isReversalTrial`** (booleano):
   - Es `true` únicamente en el ensayo exacto donde se dispara una reversión
   - Se resetea a `false` en todos los demás ensayos
   - Permite identificar con precisión el ensayo de cambio de contingencias

3. **`reversalPhase`** (booleano):
   - Se vuelve `true` a partir de la primera reversión **en ambos modos** (predetermined y criterion)
   - Permanece `true` durante el resto de la tarea
   - Diferente de `isReversalPhase` (legacy) que se usa internamente

4. **`correctChoicesInBlock`** (Set):
   - Set que almacena los números de ensayo donde el participante eligió correctamente
   - Se limpia (`clear()`) cada vez que cambia el `reversalBlock`
   - Usado para calcular errores regresivos correctamente

#### Cambios en la Función `processChoice`:

- Al inicio de cada ensayo, se determina si debe ocurrir una reversión
- Si es un ensayo de reversión (`isReversalTrial = true`):
  - Se incrementa `reversalBlock`
  - Se actualiza `currentCorrectOption` (se intercambia A ↔ B)
  - Se limpia el registro `correctChoicesInBlock`
  - Se resetean contadores de aprendizaje

#### Cálculo Corregido de Error Regresivo:

**Definición mejorada**: Un error es regresivo si el participante elige la opción incorrecta (`actual_is_correct === 0`), pero previamente ya había aprendido la opción correcta actual (la había elegido correctamente al menos una vez dentro del `reversalBlock` actual).

**Implementación**:
```javascript
// Error regresivo: error después de haber acertado en el bloque actual
if (actual_is_correct === 0 && correctChoicesInBlock.size > 0) {
  is_regressive = 1;
}
```

Esta lógica asegura que:
- Solo se marcan como regresivos los errores que ocurren **después** de haber demostrado aprendizaje
- El aprendizaje se rastrea **por bloque**, no por fase completa
- Se resetea correctamente tras cada reversión

### 4. Modificaciones en las Columnas del CSV

#### Columnas Renombradas:
- **`phase`** → **`reversal_block`**: Refleja el nuevo contador `reversalBlock`
- **`reversal`** → **`is_reversal_trial`**: Refleja la nueva variable `isReversalTrial`
- **`is_regressive`** → **`is_regressive_error`**: Clarifica que es un tipo de error

#### Nueva Columna Añadida:
- **`is_reversal_phase`**: Indica si el ensayo ocurre en fase de reversión (ambos modos: predetermined y criterion)

#### Estructura de Datos en trials[]:
Cada objeto de ensayo ahora incluye:
```javascript
{
  trial: número de ensayo,
  reversalBlock: bloque actual (0, 1, 2...),
  isReversalTrial: 0/1 (si es el ensayo de reversión),
  reversalPhase: 0/1 (si ya ocurrió la primera reversión - modo criterion),
  is_regressive: 0/1 (error regresivo corregido),
  // ... otros campos existentes
}
```

### 5. Garantías de Integridad

#### Cálculo de `is_correct`:
- Siempre usa el `currentCorrectOption` actualizado para el `reversalBlock` en curso
- El ensayo de reversión mismo no penaliza métricas de aprendizaje

#### Forzar Feedback No Engañoso:
- La lógica existente de urnas de feedback se mantiene
- El primer ensayo de reversión sigue forzando feedback veraz desde la urna correcta

### 6. Versión y Compatibilidad

- **Versión anterior**: PRLT_flexible_5.2_study
- **Versión actual**: PRLT_flexible_6.0_refactored
- **Compatibilidad hacia atrás**: Se mantienen columnas legacy (`trial_in_phase`, `is_reversal_first_trial`) para scripts de análisis existentes

### Resumen de Cambios Técnicos

| Aspecto | Antes | Ahora |
|---------|-------|-------|
| Identificación de reversión | Solo `isReversalPhase` (impreciso) | `isReversalTrial` (preciso) + `reversalBlock` (contador) |
| Error regresivo | Basado en `hasMadeCorrectInThisPhase` (global por fase) | Basado en `correctChoicesInBlock` (por bloque) |
| Metadatos CSV | 16 campos | 19 campos (+3 para auditoría) |
| Nombres de columnas | `phase`, `reversal`, `is_regressive` | `reversal_block`, `is_reversal_trial`, `is_regressive_error` |
| Rastreo de atención | No | Sí (`windowFocusChanges`) |
| Versión | PRLT_flexible_5.2_study | PRLT_Flexible_6.0_Refactored |

### Impacto en Análisis

Los análisis científicos se benefician de:
1. **Mayor precisión**: `reversalBlock` permite análisis separado de cada periodo de aprendizaje
2. **Mejor auditoría**: Los metadatos adicionales permiten verificar calidad de datos
3. **Errores regresivos precisos**: El cálculo corregido identifica correctamente recaídas tras aprendizaje
4. **Trazabilidad completa**: El `meta_reversal_schedule` permite reproducir exactamente la secuencia de reversiones
