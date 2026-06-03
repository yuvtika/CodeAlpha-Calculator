/**
 * CalcPro — Calculator Logic
 * Supports chained arithmetic, keyboard input, real-time preview, and error handling.
 */

(() => {
  'use strict';

  // ── State ──────────────────────────────────────────────────────
  let currentInput   = '0';   // what user is actively typing
  let previousInput  = '';    // left-hand operand as string
  let operator       = '';    // pending operator symbol (÷ × − +)
  let resetNext      = false; // if true, next digit replaces currentInput
  let justEvaluated  = false; // if equals was just pressed

  // ── DOM refs ───────────────────────────────────────────────────
  const displayResult     = document.getElementById('display-result');
  const displayExpression = document.getElementById('display-expression');
  const displayBox        = document.getElementById('display');
  const btnGrid           = document.getElementById('btn-grid');

  // ── Helpers ────────────────────────────────────────────────────

  /** Format a number for display (commas, max 12 sig digits) */
  function formatNumber(n) {
    if (!isFinite(n)) return 'Error';
    // Avoid floating-point noise: round to 12 significant digits
    const rounded = parseFloat(n.toPrecision(12));
    const str = rounded.toString();
    // Add thousand separators to the integer part
    const [intPart, decPart] = str.split('.');
    const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return decPart !== undefined ? `${formatted}.${decPart}` : formatted;
  }

  /** Shrink font if display text is long */
  function autoSizeDisplay() {
    const raw = displayResult.textContent;
    displayResult.classList.toggle('shrink', raw.length > 12);
  }

  /** Update the UI */
  function updateDisplay() {
    displayResult.textContent = formatNumber(parseFloat(currentInput));
    autoSizeDisplay();
  }

  /** Update the expression line */
  function updateExpression() {
    if (previousInput && operator) {
      displayExpression.textContent = `${formatNumber(parseFloat(previousInput))} ${operator}`;
    } else {
      displayExpression.textContent = '';
    }
  }

  /** Show error state momentarily */
  function flashError() {
    displayBox.classList.add('error');
    setTimeout(() => displayBox.classList.remove('error'), 500);
  }

  /** Perform the arithmetic */
  function calculate(a, op, b) {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    switch (op) {
      case '+': return numA + numB;
      case '−': return numA - numB;
      case '×': return numA * numB;
      case '÷':
        if (numB === 0) return NaN; // division by zero
        return numA / numB;
      default: return numB;
    }
  }

  /** Clear all active-operator highlights */
  function clearOperatorHighlights() {
    document.querySelectorAll('.btn-operator').forEach(b => b.classList.remove('active'));
  }

  /** Highlight the active operator button */
  function highlightOperator(symbol) {
    clearOperatorHighlights();
    const btn = document.querySelector(`.btn-operator[data-value="${symbol}"]`);
    if (btn) btn.classList.add('active');
  }

  // ── Ripple effect ──────────────────────────────────────────────
  function createRipple(button, x, y) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    const rect = button.getBoundingClientRect();
    ripple.style.left = `${x - rect.left - 10}px`;
    ripple.style.top  = `${y - rect.top - 10}px`;
    button.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  }

  // ── Core actions ───────────────────────────────────────────────

  function inputNumber(digit) {
    if (justEvaluated) {
      // Start fresh after pressing equals then a number
      currentInput  = digit;
      previousInput = '';
      operator      = '';
      justEvaluated = false;
      resetNext     = false;
      clearOperatorHighlights();
      updateExpression();
      updateDisplay();
      return;
    }

    if (resetNext) {
      currentInput = digit;
      resetNext = false;
    } else {
      if (currentInput === '0' && digit !== '0') {
        currentInput = digit;
      } else if (currentInput !== '0') {
        if (currentInput.replace(/[^0-9]/g, '').length >= 15) return; // max digits
        currentInput += digit;
      }
    }
    updateDisplay();
  }

  function inputDecimal() {
    if (justEvaluated) {
      currentInput  = '0.';
      previousInput = '';
      operator      = '';
      justEvaluated = false;
      resetNext     = false;
      clearOperatorHighlights();
      updateExpression();
      displayResult.textContent = '0.';
      return;
    }
    if (resetNext) {
      currentInput = '0.';
      resetNext = false;
    } else if (!currentInput.includes('.')) {
      currentInput += '.';
    }
    // Show the raw input so trailing dot is visible
    displayResult.textContent = currentInput;
    autoSizeDisplay();
  }

  function inputOperator(op) {
    justEvaluated = false;

    if (previousInput && operator && !resetNext) {
      // Chain: evaluate pending operation first
      const result = calculate(previousInput, operator, currentInput);
      if (isNaN(result) || !isFinite(result)) {
        flashError();
        clearAll();
        displayResult.textContent = 'Error';
        return;
      }
      currentInput  = result.toString();
      previousInput = currentInput;
    } else {
      previousInput = currentInput;
    }

    operator  = op;
    resetNext = true;
    highlightOperator(op);
    updateExpression();
    updateDisplay();
  }

  function evaluate() {
    if (!operator || !previousInput) return;
    const result = calculate(previousInput, operator, currentInput);
    if (isNaN(result) || !isFinite(result)) {
      flashError();
      displayExpression.textContent = `${formatNumber(parseFloat(previousInput))} ${operator} ${formatNumber(parseFloat(currentInput))} =`;
      displayResult.textContent = 'Error';
      previousInput = '';
      operator = '';
      currentInput = '0';
      justEvaluated = true;
      clearOperatorHighlights();
      return;
    }

    displayExpression.textContent = `${formatNumber(parseFloat(previousInput))} ${operator} ${formatNumber(parseFloat(currentInput))} =`;
    currentInput  = result.toString();
    previousInput = '';
    operator      = '';
    resetNext     = true;
    justEvaluated = true;
    clearOperatorHighlights();
    updateDisplay();
  }

  function clearAll() {
    currentInput   = '0';
    previousInput  = '';
    operator       = '';
    resetNext      = false;
    justEvaluated  = false;
    clearOperatorHighlights();
    updateDisplay();
    updateExpression();
  }

  function backspace() {
    if (justEvaluated || resetNext) {
      clearAll();
      return;
    }
    if (currentInput.length > 1) {
      currentInput = currentInput.slice(0, -1);
    } else {
      currentInput = '0';
    }
    updateDisplay();
  }

  function percent() {
    const val = parseFloat(currentInput);
    if (isNaN(val)) return;
    currentInput = (val / 100).toString();
    justEvaluated = false;
    updateDisplay();
  }

  // ── Button click handler ───────────────────────────────────────
  btnGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;

    createRipple(btn, e.clientX, e.clientY);

    const action = btn.dataset.action;
    const value  = btn.dataset.value;

    switch (action) {
      case 'number':    inputNumber(value);   break;
      case 'decimal':   inputDecimal();       break;
      case 'operator':  inputOperator(value); break;
      case 'equals':    evaluate();           break;
      case 'clear':     clearAll();           break;
      case 'backspace': backspace();          break;
      case 'percent':   percent();            break;
    }
  });

  // ── Keyboard support ───────────────────────────────────────────
  const keyMap = {
    '0': () => inputNumber('0'),
    '1': () => inputNumber('1'),
    '2': () => inputNumber('2'),
    '3': () => inputNumber('3'),
    '4': () => inputNumber('4'),
    '5': () => inputNumber('5'),
    '6': () => inputNumber('6'),
    '7': () => inputNumber('7'),
    '8': () => inputNumber('8'),
    '9': () => inputNumber('9'),
    '.': () => inputDecimal(),
    '+': () => inputOperator('+'),
    '-': () => inputOperator('−'),
    '*': () => inputOperator('×'),
    '/': () => inputOperator('÷'),
    '%': () => percent(),
    'Enter':     () => evaluate(),
    '=':         () => evaluate(),
    'Backspace': () => backspace(),
    'Delete':    () => clearAll(),
    'Escape':    () => clearAll(),
  };

  /** Find the visual button that matches a keyboard shortcut and add press feedback */
  function simulateKeyPress(key) {
    let selector = '';
    switch (key) {
      case '+':         selector = '#btn-add'; break;
      case '-':         selector = '#btn-subtract'; break;
      case '*':         selector = '#btn-multiply'; break;
      case '/':         selector = '#btn-divide'; break;
      case '%':         selector = '#btn-percent'; break;
      case 'Enter':
      case '=':         selector = '#btn-equals'; break;
      case 'Backspace': selector = '#btn-backspace'; break;
      case 'Delete':
      case 'Escape':    selector = '#btn-clear'; break;
      case '.':         selector = '#btn-decimal'; break;
      default:
        if (/^[0-9]$/.test(key)) selector = `#btn-${key}`;
    }
    if (selector) {
      const btn = document.querySelector(selector);
      if (btn) {
        btn.classList.add('pressed');
        const rect = btn.getBoundingClientRect();
        createRipple(btn, rect.left + rect.width / 2, rect.top + rect.height / 2);
        setTimeout(() => btn.classList.remove('pressed'), 150);
      }
    }
  }

  document.addEventListener('keydown', (e) => {
    const handler = keyMap[e.key];
    if (handler) {
      e.preventDefault();
      handler();
      simulateKeyPress(e.key);
    }
  });

  // ── Initial render ─────────────────────────────────────────────
  updateDisplay();
})();
