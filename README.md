# Probabilistic-Reversal-Learning-Task---Spanish-
Draft for a Probabilistic Reversal Learning Task - Spanish - SNOP study 

SNOP: Estudio exploratorio de las alteraciones olfativas en la psicosis: valor pronóstico y  relación con cognición social, síntomas negativos, y autocuidado (Olfaction in Psychosis: Prognostic value and associations with Social cognition, Negative symptoms and self-care). 
Santiago Latorre Martínez
Parc Sanitari Sant Joan de Déu



Referencias Principales

den Ouden, H. E., et al. (2013). "Dissociable Effects of Dopamine and Serotonin on Reversal Learning". Neuron, 80(4), 1090–1100. Este estudio es fundamental para comprender las bases neurobiológicas del aprendizaje de inversión, disociando el papel de la dopamina y la serotonina en la adaptación del comportamiento ante cambios en las contingencias de recompensa.

Waltmann, M., et al. (2021). "Altered probabilistic reversal learning in borderline personality disorder: A systematic review and meta-analysis". Neuroscience & Biobehavioral Reviews, 127, 85–97. Este metaanálisis destaca la utilidad clínica de la tarea de aprendizaje de inversión probabilística para identificar patrones de aprendizaje alterados en poblaciones psiquiátricas, validando su sensibilidad para capturar dificultades en la flexibilidad cognitiva y la adaptación al feedback incierto.



# Documento Técnico: Tarea de Aprendizaje Inverso Probabilístico (PRLT)

**Versión de la Tarea:** 6.0 (Flexible)
**Estudio Asociado:** SNOP

## 1. Bienvenida y Descripción General

Este documento detalla la implementación técnica de la Tarea de Aprendizaje Inverso Probabilístico (Probabilistic Reversal-Learning Task, PRLT), configurada específicamente para el estudio SNOP.

El texto de bienvenida que se muestra al participante es:
> "Bienvenido/a a la prueba de aprendizaje probabilístico reverso para el estudio SNOP."

La prueba consiste en una tarea de discriminación visual donde el participante debe aprender qué estímulo, de entre dos presentados, tiene mayor probabilidad de otorgar una recompensa. Esta asociación cambia a lo largo de la tarea (inversión de contingencias) una vez que el participante demuestra haber aprendido la regla actual.

---

## 2. Reglas y Configuración de la Prueba

La lógica y configuración de la tarea están definidas en el objeto `taskConfig` dentro del código fuente. Para el estudio, se aplican los siguientes parámetros:

- **Refuerzo Probabilístico (`probabilisticReinforcement`):** Activado (`true`).
  - **Probabilidad Alta (`highProbability`):** El estímulo correcto tiene un **80%** de probabilidad de dar recompensa.
  - **Probabilidad Baja (`lowProbability`):** El estímulo incorrecto tiene un **20%** de probabilidad de dar recompensa.

- **Número Total de Ensayos (`totalTrials`):** La prueba finaliza tras **160 ensayos**.

- **Posición de Estímulos (`randomizeStimulusPositions`):** Activada (`true`). La posición (izquierda/derecha) de los dos estímulos se aleatoriza en cada ensayo para evitar sesgos de respuesta motora.

- **Estilo de Feedback (`feedbackStyle`):** Configurado como `coins` (monedas). El participante recibe feedback visual (monedas ganadas o un mensaje de no ganancia) tras cada elección.

- **Criterio de Inversión (`reversalCriterion`):** La regla para cambiar la contingencia (qué estímulo es el "bueno") se basa en el rendimiento del participante. El modo predeterminado es `percent` (porcentaje).

---

## 3. Definición de Variables Principales

A continuación, se definen las variables clave para el seguimiento y auditoría de la prueba, contenidas en el objeto `taskState` y en los datos de resultados.

### Variables de Estado (`taskState`)

- `currentTrial`: (Número) Contador del ensayo actual, de 1 a 160.
- `score`: (Número) Puntuación acumulada del participante.
- `reversals`: (Número) Contador de cuántas veces se ha invertido la contingencia.
- `correctStimulusId`: (String) Identificador del estímulo que es actualmente el correcto (ej: 'stimulusA').
- `incorrectStimulusId`: (String) Identificador del estímulo incorrecto.
- `lastResponses`: (Array) Almacena los resultados de los últimos 10 ensayos para calcular el criterio de inversión por porcentaje.

### Variables en el Fichero de Resultados (.csv)

El archivo `.csv` generado al final de la prueba contiene las siguientes columnas por cada ensayo:

- `trial`: Número del ensayo.
- `stimulus_presented_left` / `stimulus_presented_right`: Qué estímulo se mostró en cada posición.
- `chosen_stimulus_id`: El ID del estímulo que el participante eligió.
- `is_correct`: Si la elección fue el estímulo "correcto" en ese ensayo (1 para sí, 0 para no).
- `was_rewarded`: Si el participante recibió recompensa en ese ensayo (1 para sí, 0 para no).
- `response_time`: Tiempo de reacción en milisegundos.
- `score`: Puntuación total hasta ese momento.
- `reversal_occurred`: Indica si se produjo una inversión de regla *después* de ese ensayo (1 para sí, 0 para no).

---

## 4. Sistema de Aleatorización y Criterios de Inversión

### Aleatorización

La aleatorización ocurre en dos niveles en cada ensayo:
1.  **Posición de los Estímulos:** La ubicación en pantalla (izquierda o derecha) de los estímulos correcto e incorrecto se asigna de forma aleatoria en cada ensayo (`randomizeStimulusPositions: true`).
2.  **Obtención de Recompensa:** La recompensa es probabilística. Incluso una elección "correcta" puede no ser recompensada (20% de las veces), y una "incorrecta" puede serlo (20% de las veces). Esto se gestiona con `Math.random()` comparado con `highProbability` y `lowProbability`.

### Inversión de Contingencias

La inversión (el estímulo que era correcto pasa a ser incorrecto y viceversa) se activa automáticamente cuando el sistema detecta que el participante ha aprendido la regla actual.

**A. Condición Predeterminada (Por Porcentaje - `percent`)**
- **Mecanismo:** El sistema evalúa el rendimiento en los últimos **10 ensayos** (`trialsForReversalCalculation`).
- **Criterio:** Si el participante ha elegido el estímulo correcto en un **80% o más** de esos 10 ensayos (`reversalThreshold: 0.8`), se activa la inversión.

**B. Condición Alternativa (Por Ensayos Consecutivos - `consecutive`)**
- **Mecanismo:** El sistema cuenta el número de elecciones correctas seguidas.
- **Criterio:** Si el participante elige el estímulo correcto **8 veces seguidas** (`consecutiveCorrectsForReversal: 8`), se activa la inversión.

Este diseño dual permite flexibilidad para adaptar la dificultad o los requisitos de la tarea en función de los objetivos del estudio.
