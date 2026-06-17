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

  let currentShape = null;

  // ── Event Listeners ────────────────────────────────────────────────
  selectEl.addEventListener('change', onShapeChange);
  btnCalculate.addEventListener('click', onCalculate);

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
})();
