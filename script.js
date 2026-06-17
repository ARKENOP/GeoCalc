/**
 * GeoCalc — Geometric Calculator
 * Handles shape selection, dynamic inputs, and calculations.
 */

(() => {
  'use strict';

  // ── Shape Definitions ──────────────────────────────────────────────
  // Each shape defines its display name, input fields, and formulas.
  const SHAPES = {
    carre: {
      name: 'Carré',
      inputs: [
        { id: 'side', label: 'Côté', placeholder: 'Longueur du côté' },
      ],
      calculate(values) {
        const s = values.side;
        return {
          perimetre: 4 * s,
          aire: s * s,
        };
      },
    },

    rectangle: {
      name: 'Rectangle',
      inputs: [
        { id: 'length', label: 'Longueur', placeholder: 'Longueur' },
        { id: 'width', label: 'Largeur', placeholder: 'Largeur' },
      ],
      calculate(values) {
        const { length, width } = values;
        return {
          perimetre: 2 * (length + width),
          aire: length * width,
        };
      },
    },

    cercle: {
      name: 'Cercle',
      inputs: [
        { id: 'radius', label: 'Rayon', placeholder: 'Rayon du cercle' },
      ],
      calculate(values) {
        const r = values.radius;
        return {
          perimetre: 2 * Math.PI * r,
          aire: Math.PI * r * r,
        };
      },
    },

    triangle: {
      name: 'Triangle',
      inputs: [
        { id: 'sideA', label: 'Côté A', placeholder: 'Côté A' },
        { id: 'sideB', label: 'Côté B', placeholder: 'Côté B' },
        { id: 'sideC', label: 'Côté C', placeholder: 'Côté C' },
      ],
      calculate(values) {
        const { sideA, sideB, sideC } = values;
        const perimetre = sideA + sideB + sideC;
        // Heron's formula
        const s = perimetre / 2;
        const aireSquared = s * (s - sideA) * (s - sideB) * (s - sideC);
        const aire = aireSquared > 0 ? Math.sqrt(aireSquared) : 0;
        return { perimetre, aire };
      },
    },
  };

  // ── DOM References ─────────────────────────────────────────────────
  const selectEl = document.getElementById('shape-select');
  const inputsContainer = document.getElementById('inputs-container');
  const btnCalculate = document.getElementById('btn-calculate');
  const resultsCard = document.getElementById('results-card');
  const resultsBadge = document.getElementById('results-badge');
  const resultsGrid = document.getElementById('results-grid');
  const historyCard = document.getElementById('history-card');
  const btnClearHistory = document.getElementById('btn-clear-history');
  const historyList = document.getElementById('history-list');

  let currentShape = null;
  let history = [];

  // ── Event Listeners ────────────────────────────────────────────────
  selectEl.addEventListener('change', onShapeChange);
  btnCalculate.addEventListener('click', onCalculate);
  btnClearHistory.addEventListener('click', clearHistory);

  // Initialisation de l'historique
  initHistory();

  /**
   * Handles shape selection: renders the appropriate input fields.
   */
  function onShapeChange() {
    const key = selectEl.value;
    currentShape = SHAPES[key] || null;

    // Hide results when changing shape
    resultsCard.classList.add('hidden');

    // Clear previous inputs
    inputsContainer.innerHTML = '';

    if (!currentShape) {
      btnCalculate.disabled = true;
      return;
    }

    // Build input fields
    currentShape.inputs.forEach((field) => {
      const group = document.createElement('div');
      group.className = 'input-group';

      const label = document.createElement('label');
      label.className = 'form-label';
      label.setAttribute('for', `input-${field.id}`);
      label.textContent = field.label;

      const input = document.createElement('input');
      input.type = 'number';
      input.id = `input-${field.id}`;
      input.className = 'input';
      input.placeholder = field.placeholder;
      input.min = '0';
      input.step = 'any';
      input.setAttribute('autocomplete', 'off');

      // Enable/disable button based on filled inputs and handle error styling dynamically
      input.addEventListener('input', () => {
        const val = parseFloat(input.value);
        if (input.value !== '' && (isNaN(val) || val <= 0)) {
          input.classList.add('input--error');
        } else {
          input.classList.remove('input--error');
        }
        updateButtonState();
      });

      // Allow Enter key to trigger calculation
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          onCalculate();
        }
      });

      group.appendChild(label);
      group.appendChild(input);
      inputsContainer.appendChild(group);
    });

    // Focus first input
    const firstInput = inputsContainer.querySelector('.input');
    if (firstInput) firstInput.focus();

    updateButtonState();
  }

  /**
   * Enables the calculate button only if all inputs have valid positive values.
   */
  function updateButtonState() {
    if (!currentShape) {
      btnCalculate.disabled = true;
      return;
    }
    const inputs = inputsContainer.querySelectorAll('.input');
    const allFilled = Array.from(inputs).every(
      (inp) => inp.value !== '' && parseFloat(inp.value) > 0
    );
    btnCalculate.disabled = !allFilled;
  }

  /**
   * Reads input values, runs the calculation, and displays results.
   */
  function onCalculate() {
    if (!currentShape || btnCalculate.disabled) return;

    // Collect values
    const values = {};
    let valid = true;

    currentShape.inputs.forEach((field) => {
      const input = document.getElementById(`input-${field.id}`);
      const val = parseFloat(input.value);

      if (isNaN(val) || val <= 0) {
        input.classList.add('input--error');
        valid = false;
      } else {
        input.classList.remove('input--error');
        values[field.id] = val;
      }
    });

    if (!valid) return;

    // Calculate
    const result = currentShape.calculate(values);

    // Save to history
    saveCalculation(selectEl.value, values, result);

    // Display results
    showResults(currentShape.name, result);
  }

  /**
   * Renders the results card with animated items.
   * @param {string} shapeName - Display name of the shape
   * @param {{ perimetre: number, aire: number }} result - Calculated values
   */
  function showResults(shapeName, result) {
    // Badge
    resultsBadge.textContent = shapeName;

    // Build result items
    resultsGrid.innerHTML = '';

    const items = [
      {
        label: 'Périmètre',
        value: formatNumber(result.perimetre),
        unit: 'unités',
      },
      {
        label: 'Aire',
        value: formatNumber(result.aire),
        unit: 'unités²',
      },
    ];

    items.forEach((item) => {
      const div = document.createElement('div');
      div.className = 'result-item';
      div.innerHTML = `
        <div class="result-item__label">${item.label}</div>
        <div class="result-item__value">
          ${item.value}<span class="result-item__unit"> ${item.unit}</span>
        </div>
      `;
      resultsGrid.appendChild(div);
    });

    // Show card with animation
    resultsCard.classList.remove('hidden');

    // Scroll into view smoothly
    resultsCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /**
   * Formats a number to a reasonable precision.
   * @param {number} n
   * @returns {string}
   */
  function formatNumber(n) {
    if (Number.isInteger(n)) return n.toLocaleString('fr-FR');
    // Up to 4 decimal places, trimming trailing zeros
    return parseFloat(n.toFixed(4)).toLocaleString('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 4,
    });
  }

  /**
   * Initializes history from localStorage
   */
  function initHistory() {
    const saved = localStorage.getItem('geocalc_history');
    if (saved) {
      try {
        history = JSON.parse(saved);
        renderHistory();
      } catch (e) {
        history = [];
      }
    }
  }

  /**
   * Saves a calculation run to history and localStorage
   * @param {string} shapeKey - The shape key
   * @param {object} inputs - The input values
   * @param {object} result - Calculated perimeter and area
   */
  function saveCalculation(shapeKey, inputs, result) {
    const item = {
      id: Date.now(),
      shapeKey,
      inputs,
      result
    };
    
    // Add to top of list, keep max 5 items
    history.unshift(item);
    if (history.length > 5) {
      history.pop();
    }
    
    localStorage.setItem('geocalc_history', JSON.stringify(history));
    renderHistory();
  }

  /**
   * Clears all history items
   */
  function clearHistory() {
    history = [];
    localStorage.removeItem('geocalc_history');
    renderHistory();
  }

  /**
   * Renders the history list in the DOM
   */
  function renderHistory() {
    if (history.length === 0) {
      historyCard.classList.add('hidden');
      return;
    }

    historyList.innerHTML = '';
    historyCard.classList.remove('hidden');

    history.forEach((item) => {
      const shape = SHAPES[item.shapeKey];
      if (!shape) return;

      // Create readable description of inputs
      const inputDesc = Object.entries(item.inputs)
        .map(([id, val]) => {
          const inputDef = shape.inputs.find((inp) => inp.id === id);
          const label = inputDef ? inputDef.label : id;
          return `${label}: ${val}`;
        })
        .join(', ');

      const div = document.createElement('button');
      div.className = 'history-item';
      div.type = 'button';
      div.setAttribute('aria-label', `Recharger le calcul pour ${shape.name}`);
      
      div.innerHTML = `
        <div class="history-item__left">
          <span class="history-item__shape">${shape.name}</span>
          <span class="history-item__inputs">${inputDesc}</span>
        </div>
        <div class="history-item__right">
          <span class="history-item__result">P: ${formatNumber(item.result.perimetre)}</span>
          <span class="history-item__result">A: ${formatNumber(item.result.aire)}</span>
        </div>
      `;

      div.addEventListener('click', () => loadCalculation(item));
      historyList.appendChild(div);
    });
  }

  /**
   * Loads a historic calculation back into the inputs and shows the results card.
   * @param {object} item - The history item
   */
  function loadCalculation(item) {
    selectEl.value = item.shapeKey;
    onShapeChange();

    // Fill the dynamically generated inputs
    Object.entries(item.inputs).forEach(([id, val]) => {
      const input = document.getElementById(`input-${id}`);
      if (input) {
        input.value = val;
      }
    });

    updateButtonState();
    showResults(SHAPES[item.shapeKey].name, item.result);
  }
})();
