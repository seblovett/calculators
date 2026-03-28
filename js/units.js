/**
 * Engineering Tools — Shared Unit Input Component
 *
 * Defines unit sets, auto-populates selects inside .unit-input[data-type],
 * attaches auto-scale on blur, and exposes helpers for calculator JS.
 *
 * Unit ranges:
 *   resistance:  mΩ · Ω · kΩ · MΩ
 *   capacitance: pF · nF · µF · mF · F
 *   frequency:   mHz · Hz · kHz · MHz · GHz
 *   distance:    µm · mm
 *   current:     µA · mA · A
 *   voltage:     mV · V
 *   power:       µW · mW · W
 *   inductance:  nH · µH · mH  (future use)
 */

const UNIT_SETS = {
  resistance:  [
    { label: 'mΩ', value: 1e-3 },
    { label: 'Ω',  value: 1    },
    { label: 'kΩ', value: 1e3  },
    { label: 'MΩ', value: 1e6  },
  ],
  capacitance: [
    { label: 'pF', value: 1e-12 },
    { label: 'nF', value: 1e-9  },
    { label: 'µF', value: 1e-6  },
    { label: 'mF', value: 1e-3  },
    { label: 'F',  value: 1     },
  ],
  frequency: [
    { label: 'mHz', value: 1e-3 },
    { label: 'Hz',  value: 1    },
    { label: 'kHz', value: 1e3  },
    { label: 'MHz', value: 1e6  },
    { label: 'GHz', value: 1e9  },
  ],
  distance: [
    { label: 'µm', value: 1e-6 },
    { label: 'mm', value: 1e-3 },
  ],
  current: [
    { label: 'µA', value: 1e-6 },
    { label: 'mA', value: 1e-3 },
    { label: 'A',  value: 1    },
  ],
  voltage: [
    { label: 'mV', value: 1e-3 },
    { label: 'V',  value: 1    },
  ],
  power: [
    { label: 'µW', value: 1e-6 },
    { label: 'mW', value: 1e-3 },
    { label: 'W',  value: 1    },
  ],
  inductance: [
    { label: 'nH', value: 1e-9 },
    { label: 'µH', value: 1e-6 },
    { label: 'mH', value: 1e-3 },
  ],
};

/** Find the best unit for a given absolute base value */
function _bestUnit(type, absBase) {
  const units = UNIT_SETS[type];
  if (!units || absBase === 0) return units ? units[0] : null;
  // Pick the largest unit whose value is <= absBase (so displayed number >= 1)
  for (let i = units.length - 1; i >= 0; i--) {
    if (absBase >= units[i].value) return units[i];
  }
  return units[0]; // smaller than smallest unit — just use smallest
}

/** Get base SI value from a .unit-input by its input element's id */
function unitVal(inputId) {
  const inp = document.getElementById(inputId);
  if (!inp) return NaN;
  const wrap = inp.closest('.unit-input');
  const sel  = wrap ? wrap.querySelector('select') : null;
  const mul  = sel  ? parseFloat(sel.value) : 1;
  const v    = parseFloat(inp.value);
  return isNaN(v) ? NaN : v * mul;
}

/** Set a unit-input to a base SI value, choosing the best prefix */
function setUnitVal(inputId, baseValue) {
  const inp = document.getElementById(inputId);
  if (!inp) return;
  const wrap = inp.closest('.unit-input');
  const sel  = wrap ? wrap.querySelector('select') : null;
  const type = wrap ? wrap.dataset.type : null;
  if (!sel || !type) { inp.value = baseValue; return; }
  const best = _bestUnit(type, Math.abs(baseValue));
  if (!best) { inp.value = baseValue; return; }
  inp.value = parseFloat((baseValue / best.value).toPrecision(6));
  for (const opt of sel.options) {
    if (Math.abs(parseFloat(opt.value) - best.value) / best.value < 1e-9) {
      sel.value = opt.value; break;
    }
  }
}

/** Auto-scale displayed value to best prefix (called on blur) */
function _autoScale(inp, sel, type) {
  const raw = parseFloat(inp.value);
  if (isNaN(raw) || raw === 0) return;
  const base = raw * parseFloat(sel.value);
  const best = _bestUnit(type, Math.abs(base));
  if (!best) return;
  inp.value = parseFloat((base / best.value).toPrecision(6));
  for (const opt of sel.options) {
    if (Math.abs(parseFloat(opt.value) - best.value) / best.value < 1e-9) {
      sel.value = opt.value; break;
    }
  }
}

/** Initialise all .unit-input[data-type] elements on the page */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.unit-input[data-type]').forEach(wrap => {
    const type       = wrap.dataset.type;
    const defaultMul = wrap.dataset.default != null ? parseFloat(wrap.dataset.default) : null;
    const units      = UNIT_SETS[type];
    if (!units) return;
    const sel = wrap.querySelector('select');
    const inp = wrap.querySelector('input[type=number]');
    if (!sel || !inp) return;

    // Populate <select> options
    units.forEach(u => {
      const opt = document.createElement('option');
      opt.value       = u.value;
      opt.textContent = u.label;
      if (defaultMul !== null &&
          Math.abs(u.value - defaultMul) / (Math.abs(defaultMul) || 1) < 1e-9) {
        opt.selected = true;
      }
      sel.appendChild(opt);
    });

    // Auto-scale on blur
    inp.addEventListener('blur', () => _autoScale(inp, sel, type));
  });
});
