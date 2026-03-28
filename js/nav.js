/**
 * Engineering Tools — Shared Navigation
 *
 * Renders the sidebar and marks the current page active.
 * To add or remove a calculator, edit the NAV array below — that's it.
 */

const NAV = [
  {
    label: '⚡ Electrical',
    items: [
      { href: 'ohms-law.html',       title: 'Ohm\'s Law' },
      { href: 'voltage-divider.html', title: 'Voltage Divider' },
      { href: 'potential-divider.html', title: 'Potential Divider (loaded)' },
      { href: 'rc-time-constant.html', title: 'RC Time Constant' },
      { href: 'led-resistor.html',   title: 'LED Resistor' },
      { href: 'pcb-trace-width.html', title: 'PCB Trace Width' },
      { href: 'pcb-impedance.html',  title: 'PCB Impedance' },
      { href: 'op-amp.html',         title: 'Op-Amp Configurations' },
      { href: 'filter-designer.html', title: 'Filter Designer' },
      { href: 'battery-life.html',   title: 'Battery Life Estimator' },
    ],
  },
  {
    label: '📐 General',
    items: [
      { href: 'unit-converter.html', title: 'Unit Converter' },
      { href: 'wire-gauge.html',     title: 'AWG Wire Gauge' },
      { href: 'e-series.html',       title: 'E Series (Preferred Numbers)' },
      { href: 'dbm-converter.html',  title: 'dBm / Watts / Volts' },
    ],
  },
];

(function () {
  const placeholder = document.getElementById('sidebar');
  if (!placeholder) return;

  // Detect current page filename
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';

  const sectionsHTML = NAV.map(section => {
    const linksHTML = section.items.map(item => {
      const isActive = item.href === currentFile ? ' class="active"' : '';
      return `<a href="${item.href}"${isActive}>${item.title}</a>`;
    }).join('\n      ');

    return `<div class="sidebar-section">
      <div class="sidebar-label">${section.label}</div>
      ${linksHTML}
    </div>`;
  }).join('\n    ');

  placeholder.innerHTML = sectionsHTML;
})();
