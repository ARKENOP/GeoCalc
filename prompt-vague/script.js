// ========================================================================
// GéoCalc — Geometry Calculator
// ========================================================================

(function () {
  'use strict';

  // ── Shape Definitions ──────────────────────────────────────────────

  const SHAPES_2D = [
    {
      id: 'circle',
      name: 'Cercle',
      icon: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="32" cy="32" r="26"/><line x1="32" y1="32" x2="52" y2="32" stroke-dasharray="3 3" opacity="0.5"/><text x="40" y="29" font-size="8" fill="currentColor" stroke="none" font-family="Inter">r</text></svg>`,
      inputs: [{ id: 'radius', label: 'Rayon (r)', placeholder: 'ex: 5', unit: '' }],
      calculate(v) {
        const r = v.radius;
        return [
          { label: 'Aire', value: Math.PI * r * r, icon: 'area', unit: 'u²' },
          { label: 'Périmètre', value: 2 * Math.PI * r, icon: 'perimeter', unit: 'u' },
          { label: 'Diamètre', value: 2 * r, icon: 'length', unit: 'u' },
        ];
      },
      formulas: ['A = π × r²', 'P = 2 × π × r', 'D = 2 × r'],
      preview(ctx, w, h) {
        const r = Math.min(w, h) * 0.35;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
        ctx.stroke();
        // radius line
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(w / 2, h / 2);
        ctx.lineTo(w / 2 + r, h / 2);
        ctx.stroke();
        ctx.setLineDash([]);
      },
    },
    {
      id: 'rectangle',
      name: 'Rectangle',
      icon: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="8" y="16" width="48" height="32" rx="1"/><text x="30" y="53" font-size="7" fill="currentColor" stroke="none" font-family="Inter">L</text><text x="1" y="35" font-size="7" fill="currentColor" stroke="none" font-family="Inter">l</text></svg>`,
      inputs: [
        { id: 'length', label: 'Longueur (L)', placeholder: 'ex: 8' },
        { id: 'width', label: 'Largeur (l)', placeholder: 'ex: 5' },
      ],
      calculate(v) {
        const L = v.length, l = v.width;
        return [
          { label: 'Aire', value: L * l, icon: 'area', unit: 'u²' },
          { label: 'Périmètre', value: 2 * (L + l), icon: 'perimeter', unit: 'u' },
          { label: 'Diagonale', value: Math.sqrt(L * L + l * l), icon: 'length', unit: 'u' },
        ];
      },
      formulas: ['A = L × l', 'P = 2 × (L + l)', 'D = √(L² + l²)'],
      preview(ctx, w, h) {
        const rw = w * 0.65, rh = h * 0.45;
        ctx.strokeRect((w - rw) / 2, (h - rh) / 2, rw, rh);
      },
    },
    {
      id: 'square',
      name: 'Carré',
      icon: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="12" y="12" width="40" height="40" rx="1"/><text x="29" y="57" font-size="7" fill="currentColor" stroke="none" font-family="Inter">a</text></svg>`,
      inputs: [{ id: 'side', label: 'Côté (a)', placeholder: 'ex: 6' }],
      calculate(v) {
        const a = v.side;
        return [
          { label: 'Aire', value: a * a, icon: 'area', unit: 'u²' },
          { label: 'Périmètre', value: 4 * a, icon: 'perimeter', unit: 'u' },
          { label: 'Diagonale', value: a * Math.SQRT2, icon: 'length', unit: 'u' },
        ];
      },
      formulas: ['A = a²', 'P = 4 × a', 'D = a × √2'],
      preview(ctx, w, h) {
        const s = Math.min(w, h) * 0.55;
        ctx.strokeRect((w - s) / 2, (h - s) / 2, s, s);
      },
    },
    {
      id: 'triangle',
      name: 'Triangle',
      icon: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="32,8 6,56 58,56"/></svg>`,
      inputs: [
        { id: 'a', label: 'Côté a', placeholder: 'ex: 5' },
        { id: 'b', label: 'Côté b', placeholder: 'ex: 6' },
        { id: 'c', label: 'Côté c', placeholder: 'ex: 7' },
      ],
      calculate(v) {
        const a = v.a, b = v.b, c = v.c;
        const s = (a + b + c) / 2;
        const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
        return [
          { label: 'Aire', value: area, icon: 'area', unit: 'u²' },
          { label: 'Périmètre', value: a + b + c, icon: 'perimeter', unit: 'u' },
          { label: 'Demi-périmètre', value: s, icon: 'length', unit: 'u' },
        ];
      },
      formulas: ['s = (a + b + c) / 2', 'A = √(s(s−a)(s−b)(s−c))', 'P = a + b + c'],
      preview(ctx, w, h) {
        ctx.beginPath();
        ctx.moveTo(w / 2, h * 0.15);
        ctx.lineTo(w * 0.15, h * 0.8);
        ctx.lineTo(w * 0.85, h * 0.8);
        ctx.closePath();
        ctx.stroke();
      },
    },
    {
      id: 'trapezoid',
      name: 'Trapèze',
      icon: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="16,16 48,16 58,48 6,48"/></svg>`,
      inputs: [
        { id: 'a', label: 'Grande base (B)', placeholder: 'ex: 10' },
        { id: 'b', label: 'Petite base (b)', placeholder: 'ex: 6' },
        { id: 'h', label: 'Hauteur (h)', placeholder: 'ex: 4' },
        { id: 'c1', label: 'Côté 1', placeholder: 'ex: 5' },
        { id: 'c2', label: 'Côté 2', placeholder: 'ex: 5' },
      ],
      calculate(v) {
        const B = v.a, b = v.b, h = v.h, c1 = v.c1, c2 = v.c2;
        return [
          { label: 'Aire', value: ((B + b) / 2) * h, icon: 'area', unit: 'u²' },
          { label: 'Périmètre', value: B + b + c1 + c2, icon: 'perimeter', unit: 'u' },
        ];
      },
      formulas: ['A = (B + b) × h / 2', 'P = B + b + c₁ + c₂'],
      preview(ctx, w, h) {
        ctx.beginPath();
        ctx.moveTo(w * 0.25, h * 0.25);
        ctx.lineTo(w * 0.75, h * 0.25);
        ctx.lineTo(w * 0.88, h * 0.75);
        ctx.lineTo(w * 0.12, h * 0.75);
        ctx.closePath();
        ctx.stroke();
      },
    },
    {
      id: 'parallelogram',
      name: 'Parallélogramme',
      icon: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="18,14 58,14 46,50 6,50"/></svg>`,
      inputs: [
        { id: 'base', label: 'Base (b)', placeholder: 'ex: 8' },
        { id: 'height', label: 'Hauteur (h)', placeholder: 'ex: 5' },
        { id: 'side', label: 'Côté (a)', placeholder: 'ex: 6' },
      ],
      calculate(v) {
        const b = v.base, h = v.height, a = v.side;
        return [
          { label: 'Aire', value: b * h, icon: 'area', unit: 'u²' },
          { label: 'Périmètre', value: 2 * (b + a), icon: 'perimeter', unit: 'u' },
        ];
      },
      formulas: ['A = b × h', 'P = 2 × (b + a)'],
      preview(ctx, w, h) {
        const offset = w * 0.15;
        ctx.beginPath();
        ctx.moveTo(offset + w * 0.1, h * 0.25);
        ctx.lineTo(w * 0.9, h * 0.25);
        ctx.lineTo(w * 0.9 - offset, h * 0.75);
        ctx.lineTo(w * 0.1, h * 0.75);
        ctx.closePath();
        ctx.stroke();
      },
    },
    {
      id: 'rhombus',
      name: 'Losange',
      icon: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="32,6 58,32 32,58 6,32"/></svg>`,
      inputs: [
        { id: 'd1', label: 'Diagonale d₁', placeholder: 'ex: 10' },
        { id: 'd2', label: 'Diagonale d₂', placeholder: 'ex: 8' },
      ],
      calculate(v) {
        const d1 = v.d1, d2 = v.d2;
        const side = Math.sqrt((d1 / 2) ** 2 + (d2 / 2) ** 2);
        return [
          { label: 'Aire', value: (d1 * d2) / 2, icon: 'area', unit: 'u²' },
          { label: 'Périmètre', value: 4 * side, icon: 'perimeter', unit: 'u' },
          { label: 'Côté', value: side, icon: 'length', unit: 'u' },
        ];
      },
      formulas: ['A = (d₁ × d₂) / 2', 'P = 4 × √((d₁/2)² + (d₂/2)²)', 'côté = √((d₁/2)² + (d₂/2)²)'],
      preview(ctx, w, h) {
        ctx.beginPath();
        ctx.moveTo(w / 2, h * 0.1);
        ctx.lineTo(w * 0.85, h / 2);
        ctx.lineTo(w / 2, h * 0.9);
        ctx.lineTo(w * 0.15, h / 2);
        ctx.closePath();
        ctx.stroke();
      },
    },
    {
      id: 'ellipse',
      name: 'Ellipse',
      icon: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5"><ellipse cx="32" cy="32" rx="28" ry="18"/></svg>`,
      inputs: [
        { id: 'a', label: 'Demi-grand axe (a)', placeholder: 'ex: 7' },
        { id: 'b', label: 'Demi-petit axe (b)', placeholder: 'ex: 4' },
      ],
      calculate(v) {
        const a = v.a, b = v.b;
        // Ramanujan approximation for perimeter
        const h = ((a - b) ** 2) / ((a + b) ** 2);
        const perimeter = Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
        return [
          { label: 'Aire', value: Math.PI * a * b, icon: 'area', unit: 'u²' },
          { label: 'Périmètre ≈', value: perimeter, icon: 'perimeter', unit: 'u' },
          { label: 'Excentricité', value: Math.sqrt(1 - (b * b) / (a * a)), icon: 'length', unit: '' },
        ];
      },
      formulas: ['A = π × a × b', 'P ≈ π(a+b)(1 + 3h/(10+√(4−3h)))', 'e = √(1 − b²/a²)'],
      preview(ctx, w, h) {
        ctx.beginPath();
        ctx.ellipse(w / 2, h / 2, w * 0.4, h * 0.28, 0, 0, Math.PI * 2);
        ctx.stroke();
      },
    },
    {
      id: 'regular-polygon',
      name: 'Polygone régulier',
      icon: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="32,4 58,20 58,44 32,60 6,44 6,20"/></svg>`,
      inputs: [
        { id: 'n', label: 'Nombre de côtés (n)', placeholder: 'ex: 6' },
        { id: 'side', label: 'Longueur du côté (a)', placeholder: 'ex: 5' },
      ],
      calculate(v) {
        const n = v.n, a = v.side;
        const area = (n * a * a) / (4 * Math.tan(Math.PI / n));
        const perimeter = n * a;
        const apothem = a / (2 * Math.tan(Math.PI / n));
        return [
          { label: 'Aire', value: area, icon: 'area', unit: 'u²' },
          { label: 'Périmètre', value: perimeter, icon: 'perimeter', unit: 'u' },
          { label: 'Apothème', value: apothem, icon: 'length', unit: 'u' },
        ];
      },
      formulas: ['A = (n × a²) / (4 × tan(π/n))', 'P = n × a', 'Apothème = a / (2 × tan(π/n))'],
      preview(ctx, w, h, v) {
        const n = (v && v.n >= 3) ? Math.floor(v.n) : 6;
        const r = Math.min(w, h) * 0.38;
        ctx.beginPath();
        for (let i = 0; i < n; i++) {
          const angle = (2 * Math.PI * i) / n - Math.PI / 2;
          const x = w / 2 + r * Math.cos(angle);
          const y = h / 2 + r * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      },
    },
  ];

  const SHAPES_3D = [
    {
      id: 'sphere',
      name: 'Sphère',
      icon: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><circle cx="32" cy="32" r="26"/><ellipse cx="32" cy="32" rx="26" ry="10" stroke-dasharray="3 3" opacity="0.5"/><ellipse cx="32" cy="32" rx="10" ry="26" stroke-dasharray="3 3" opacity="0.3"/></svg>`,
      inputs: [{ id: 'radius', label: 'Rayon (r)', placeholder: 'ex: 5' }],
      calculate(v) {
        const r = v.radius;
        return [
          { label: 'Volume', value: (4 / 3) * Math.PI * r ** 3, icon: 'volume', unit: 'u³' },
          { label: 'Surface', value: 4 * Math.PI * r * r, icon: 'area', unit: 'u²' },
          { label: 'Diamètre', value: 2 * r, icon: 'length', unit: 'u' },
        ];
      },
      formulas: ['V = (4/3) × π × r³', 'S = 4 × π × r²', 'D = 2 × r'],
      preview(ctx, w, h) {
        const r = Math.min(w, h) * 0.35;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([3, 3]);
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.ellipse(w / 2, h / 2, r, r * 0.35, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.setLineDash([]);
      },
    },
    {
      id: 'cube',
      name: 'Cube',
      icon: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><rect x="14" y="20" width="30" height="30"/><polygon points="14,20 28,8 58,8 44,20" /><polygon points="44,20 58,8 58,38 44,50"/></svg>`,
      inputs: [{ id: 'side', label: 'Arête (a)', placeholder: 'ex: 5' }],
      calculate(v) {
        const a = v.side;
        return [
          { label: 'Volume', value: a ** 3, icon: 'volume', unit: 'u³' },
          { label: 'Surface totale', value: 6 * a * a, icon: 'area', unit: 'u²' },
          { label: 'Diag. espace', value: a * Math.sqrt(3), icon: 'length', unit: 'u' },
        ];
      },
      formulas: ['V = a³', 'S = 6 × a²', 'D = a × √3'],
      preview(ctx, w, h) {
        const s = Math.min(w, h) * 0.35;
        const ox = w * 0.22, oy = h * 0.35;
        const dx = s * 0.5, dy = -s * 0.35;
        // front face
        ctx.strokeRect(ox, oy, s, s);
        // top face
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(ox + dx, oy + dy);
        ctx.lineTo(ox + dx + s, oy + dy);
        ctx.lineTo(ox + s, oy);
        ctx.closePath();
        ctx.stroke();
        // right face
        ctx.beginPath();
        ctx.moveTo(ox + s, oy);
        ctx.lineTo(ox + s + dx, oy + dy);
        ctx.lineTo(ox + s + dx, oy + dy + s);
        ctx.lineTo(ox + s, oy + s);
        ctx.closePath();
        ctx.stroke();
      },
    },
    {
      id: 'cylinder',
      name: 'Cylindre',
      icon: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="32" cy="14" rx="22" ry="8"/><line x1="10" y1="14" x2="10" y2="50"/><line x1="54" y1="14" x2="54" y2="50"/><path d="M10 50 Q32 66 54 50" /><path d="M10 50 Q32 42 54 50" stroke-dasharray="3 3" opacity="0.4"/></svg>`,
      inputs: [
        { id: 'radius', label: 'Rayon (r)', placeholder: 'ex: 4' },
        { id: 'height', label: 'Hauteur (h)', placeholder: 'ex: 10' },
      ],
      calculate(v) {
        const r = v.radius, h = v.height;
        return [
          { label: 'Volume', value: Math.PI * r * r * h, icon: 'volume', unit: 'u³' },
          { label: 'Surface latérale', value: 2 * Math.PI * r * h, icon: 'area', unit: 'u²' },
          { label: 'Surface totale', value: 2 * Math.PI * r * (r + h), icon: 'area', unit: 'u²' },
        ];
      },
      formulas: ['V = π × r² × h', 'S_lat = 2 × π × r × h', 'S_tot = 2 × π × r × (r + h)'],
      preview(ctx, w, h) {
        const rx = w * 0.3, ry = h * 0.1;
        const top = h * 0.2, bot = h * 0.75;
        // top ellipse
        ctx.beginPath();
        ctx.ellipse(w / 2, top, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
        // sides
        ctx.beginPath();
        ctx.moveTo(w / 2 - rx, top);
        ctx.lineTo(w / 2 - rx, bot);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(w / 2 + rx, top);
        ctx.lineTo(w / 2 + rx, bot);
        ctx.stroke();
        // bottom ellipse
        ctx.beginPath();
        ctx.ellipse(w / 2, bot, rx, ry, 0, Math.PI, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([3, 3]);
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.ellipse(w / 2, bot, rx, ry, 0, 0, Math.PI);
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.setLineDash([]);
      },
    },
    {
      id: 'cone',
      name: 'Cône',
      icon: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><line x1="32" y1="6" x2="8" y2="52"/><line x1="32" y1="6" x2="56" y2="52"/><ellipse cx="32" cy="52" rx="24" ry="8"/></svg>`,
      inputs: [
        { id: 'radius', label: 'Rayon (r)', placeholder: 'ex: 4' },
        { id: 'height', label: 'Hauteur (h)', placeholder: 'ex: 10' },
      ],
      calculate(v) {
        const r = v.radius, h = v.height;
        const slant = Math.sqrt(r * r + h * h);
        return [
          { label: 'Volume', value: (1 / 3) * Math.PI * r * r * h, icon: 'volume', unit: 'u³' },
          { label: 'Surface latérale', value: Math.PI * r * slant, icon: 'area', unit: 'u²' },
          { label: 'Surface totale', value: Math.PI * r * (r + slant), icon: 'area', unit: 'u²' },
          { label: 'Apothème', value: slant, icon: 'length', unit: 'u' },
        ];
      },
      formulas: ['V = (1/3) × π × r² × h', 'S_lat = π × r × g', 'g = √(r² + h²)'],
      preview(ctx, w, h) {
        const apex = { x: w / 2, y: h * 0.12 };
        const ry = h * 0.08;
        const bot = h * 0.82;
        const rx = w * 0.32;
        // sides
        ctx.beginPath();
        ctx.moveTo(apex.x, apex.y);
        ctx.lineTo(w / 2 - rx, bot);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(apex.x, apex.y);
        ctx.lineTo(w / 2 + rx, bot);
        ctx.stroke();
        // base ellipse
        ctx.beginPath();
        ctx.ellipse(w / 2, bot, rx, ry, 0, 0, Math.PI);
        ctx.stroke();
        ctx.setLineDash([3, 3]);
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.ellipse(w / 2, bot, rx, ry, 0, Math.PI, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.setLineDash([]);
      },
    },
    {
      id: 'pyramid',
      name: 'Pyramide',
      icon: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><polygon points="32,6 8,48 24,56 56,48"/><line x1="32" y1="6" x2="24" y2="56"/><line x1="32" y1="6" x2="56" y2="48"/><line x1="8" y1="48" x2="56" y2="48" stroke-dasharray="3 3" opacity="0.4"/><line x1="24" y1="56" x2="56" y2="48" /></svg>`,
      inputs: [
        { id: 'base', label: 'Côté base (a)', placeholder: 'ex: 6' },
        { id: 'height', label: 'Hauteur (h)', placeholder: 'ex: 8' },
      ],
      calculate(v) {
        const a = v.base, h = v.height;
        const baseArea = a * a;
        const slantH = Math.sqrt(h * h + (a / 2) ** 2);
        return [
          { label: 'Volume', value: (1 / 3) * baseArea * h, icon: 'volume', unit: 'u³' },
          { label: 'Surface base', value: baseArea, icon: 'area', unit: 'u²' },
          { label: 'Surface latérale', value: 2 * a * slantH, icon: 'area', unit: 'u²' },
          { label: 'Surface totale', value: baseArea + 2 * a * slantH, icon: 'area', unit: 'u²' },
        ];
      },
      formulas: ['V = (1/3) × a² × h', 'S_base = a²', 'S_lat = 2 × a × √(h² + (a/2)²)'],
      preview(ctx, w, h) {
        const apex = { x: w / 2, y: h * 0.1 };
        // base rectangle in perspective
        const bl = { x: w * 0.15, y: h * 0.7 };
        const br = { x: w * 0.75, y: h * 0.7 };
        const fr = { x: w * 0.85, y: h * 0.85 };
        const fl = { x: w * 0.25, y: h * 0.85 };
        // base
        ctx.beginPath();
        ctx.moveTo(fl.x, fl.y);
        ctx.lineTo(fr.x, fr.y);
        ctx.lineTo(br.x, br.y);
        ctx.stroke();
        ctx.setLineDash([3, 3]);
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.moveTo(br.x, br.y);
        ctx.lineTo(bl.x, bl.y);
        ctx.lineTo(fl.x, fl.y);
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.setLineDash([]);
        // edges to apex
        ctx.beginPath();
        ctx.moveTo(apex.x, apex.y); ctx.lineTo(fl.x, fl.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(apex.x, apex.y); ctx.lineTo(fr.x, fr.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(apex.x, apex.y); ctx.lineTo(br.x, br.y);
        ctx.stroke();
        ctx.setLineDash([3, 3]);
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.moveTo(apex.x, apex.y); ctx.lineTo(bl.x, bl.y);
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.setLineDash([]);
      },
    },
    {
      id: 'torus',
      name: 'Tore',
      icon: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="32" cy="32" rx="28" ry="14"/><ellipse cx="32" cy="32" rx="12" ry="6"/></svg>`,
      inputs: [
        { id: 'R', label: 'Grand rayon (R)', placeholder: 'ex: 8' },
        { id: 'r', label: 'Petit rayon (r)', placeholder: 'ex: 3' },
      ],
      calculate(v) {
        const R = v.R, r = v.r;
        return [
          { label: 'Volume', value: 2 * Math.PI * Math.PI * R * r * r, icon: 'volume', unit: 'u³' },
          { label: 'Surface', value: 4 * Math.PI * Math.PI * R * r, icon: 'area', unit: 'u²' },
        ];
      },
      formulas: ['V = 2π² × R × r²', 'S = 4π² × R × r'],
      preview(ctx, w, h) {
        // outer ellipse
        ctx.beginPath();
        ctx.ellipse(w / 2, h / 2, w * 0.42, h * 0.22, 0, 0, Math.PI * 2);
        ctx.stroke();
        // inner hole
        ctx.beginPath();
        ctx.ellipse(w / 2, h / 2, w * 0.15, h * 0.08, 0, 0, Math.PI * 2);
        ctx.stroke();
      },
    },
  ];

  // ── Result Icon SVGs ───────────────────────────────────────────────

  const RESULT_ICONS = {
    area: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" opacity="0.3" fill="currentColor"/><rect x="3" y="3" width="18" height="18" rx="2"/></svg>`,
    perimeter: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="3 2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>`,
    volume: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z" opacity="0.3" fill="currentColor"/><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
    length: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12h20M6 8l-4 4 4 4M18 8l4 4-4 4"/></svg>`,
  };

  // ── State ──────────────────────────────────────────────────────────

  let currentCategory = '2d';
  let currentShape = null;
  let animationFrame = null;

  // ── DOM refs ───────────────────────────────────────────────────────

  const shapesGrid = document.getElementById('shapesGrid');
  const calcPanel = document.getElementById('calculatorPanel');
  const calcTitle = document.getElementById('calcTitle');
  const calcDesc = document.getElementById('calcDescription');
  const inputsGroup = document.getElementById('inputsGroup');
  const resultsGrid = document.getElementById('resultsGrid');
  const formulaSection = document.getElementById('formulaSection');
  const calcButton = document.getElementById('calcButton');
  const shapePreview = document.getElementById('shapePreview');
  const toggle2d = document.getElementById('toggle2d');
  const toggle3d = document.getElementById('toggle3d');

  // ── Category Toggle ────────────────────────────────────────────────

  toggle2d.addEventListener('click', () => switchCategory('2d'));
  toggle3d.addEventListener('click', () => switchCategory('3d'));

  function switchCategory(cat) {
    currentCategory = cat;
    currentShape = null;
    toggle2d.classList.toggle('active', cat === '2d');
    toggle3d.classList.toggle('active', cat === '3d');
    renderShapeCards();
    resetCalculator();
  }

  // ── Render Shape Cards ─────────────────────────────────────────────

  function renderShapeCards() {
    const shapes = currentCategory === '2d' ? SHAPES_2D : SHAPES_3D;
    shapesGrid.innerHTML = '';
    shapes.forEach((shape, idx) => {
      const card = document.createElement('div');
      card.className = 'shape-card fade-in-up';
      card.style.animationDelay = `${idx * 60}ms`;
      card.dataset.id = shape.id;
      card.innerHTML = `
        <div class="shape-icon">${shape.icon}</div>
        <span class="shape-name">${shape.name}</span>
      `;
      card.addEventListener('click', () => selectShape(shape, card));
      shapesGrid.appendChild(card);
    });
  }

  // ── Select Shape ───────────────────────────────────────────────────

  function selectShape(shape, card) {
    currentShape = shape;

    // Update active card
    document.querySelectorAll('.shape-card').forEach((c) => c.classList.remove('active'));
    card.classList.add('active');

    // Show calculator panel
    calcPanel.classList.add('visible');

    // Title & description
    calcTitle.textContent = shape.name;
    calcDesc.textContent = currentCategory === '2d' ? 'Forme 2D' : 'Forme 3D';

    // Preview
    renderPreview(shape);

    // Inputs
    renderInputs(shape);

    // Clear results
    resultsGrid.innerHTML = '';
    resultsGrid.classList.remove('visible');

    // Formulas
    renderFormulas(shape);

    // Enable button
    calcButton.disabled = false;

    // Scroll to panel
    calcPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ── Render Canvas Preview ──────────────────────────────────────────

  function renderPreview(shape, values) {
    shapePreview.innerHTML = '';
    const canvas = document.createElement('canvas');
    const dpr = window.devicePixelRatio || 1;
    const size = 200;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    shapePreview.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // Styling
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Animate appearance
    if (animationFrame) cancelAnimationFrame(animationFrame);
    let progress = 0;
    function animate() {
      progress += 0.04;
      if (progress > 1) progress = 1;
      ctx.clearRect(0, 0, size, size);
      ctx.save();
      ctx.globalAlpha = progress;
      shape.preview(ctx, size, size, values);
      ctx.restore();
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    }
    animate();
  }

  // ── Render Inputs ──────────────────────────────────────────────────

  function renderInputs(shape) {
    inputsGroup.innerHTML = '';
    shape.inputs.forEach((input, idx) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'input-wrapper fade-in-up';
      wrapper.style.animationDelay = `${idx * 80}ms`;
      wrapper.innerHTML = `
        <label for="input-${input.id}">${input.label}</label>
        <input type="number" id="input-${input.id}" placeholder="${input.placeholder}" min="0" step="any" autocomplete="off">
      `;
      inputsGroup.appendChild(wrapper);
    });

    // Live preview update on input
    inputsGroup.querySelectorAll('input').forEach((inp) => {
      inp.addEventListener('input', () => {
        const vals = getInputValues(shape);
        if (vals && shape.preview) renderPreview(shape, vals);
      });
      // Enter key to calculate
      inp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') doCalculate();
      });
    });
  }

  // ── Render Formulas ────────────────────────────────────────────────

  function renderFormulas(shape) {
    formulaSection.innerHTML = `
      <h3 class="formula-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
        Formules
      </h3>
      <div class="formula-list">
        ${shape.formulas.map((f) => `<div class="formula-card"><code>${f}</code></div>`).join('')}
      </div>
    `;
    formulaSection.classList.add('visible');
  }

  // ── Get Input Values ───────────────────────────────────────────────

  function getInputValues(shape) {
    const values = {};
    let allFilled = true;
    shape.inputs.forEach((input) => {
      const el = document.getElementById(`input-${input.id}`);
      const val = parseFloat(el.value);
      if (isNaN(val) || val <= 0) {
        allFilled = false;
      } else {
        values[input.id] = val;
      }
    });
    return allFilled ? values : null;
  }

  // ── Calculate ──────────────────────────────────────────────────────

  calcButton.addEventListener('click', doCalculate);

  function doCalculate() {
    if (!currentShape) return;
    const values = getInputValues(currentShape);
    if (!values) {
      shakeButton();
      highlightEmptyInputs();
      return;
    }

    const results = currentShape.calculate(values);
    renderResults(results);
  }

  function shakeButton() {
    calcButton.classList.add('shake');
    setTimeout(() => calcButton.classList.remove('shake'), 500);
  }

  function highlightEmptyInputs() {
    currentShape.inputs.forEach((input) => {
      const el = document.getElementById(`input-${input.id}`);
      if (!el.value || parseFloat(el.value) <= 0) {
        el.classList.add('error');
        setTimeout(() => el.classList.remove('error'), 1500);
      }
    });
  }

  // ── Render Results ─────────────────────────────────────────────────

  function renderResults(results) {
    resultsGrid.innerHTML = '';
    results.forEach((r, idx) => {
      const card = document.createElement('div');
      card.className = 'result-card fade-in-up';
      card.style.animationDelay = `${idx * 100}ms`;

      const formattedValue = formatNumber(r.value);

      card.innerHTML = `
        <div class="result-icon">${RESULT_ICONS[r.icon] || RESULT_ICONS.length}</div>
        <div class="result-label">${r.label}</div>
        <div class="result-value">${formattedValue} <span class="result-unit">${r.unit}</span></div>
      `;
      resultsGrid.appendChild(card);
    });
    resultsGrid.classList.add('visible');

    // Smooth scroll to results
    resultsGrid.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // ── Format Number ──────────────────────────────────────────────────

  function formatNumber(n) {
    if (Number.isInteger(n)) return n.toLocaleString('fr-FR');
    // Up to 4 decimal places
    const fixed = parseFloat(n.toFixed(4));
    return fixed.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 4 });
  }

  // ── Reset Calculator ───────────────────────────────────────────────

  function resetCalculator() {
    calcPanel.classList.remove('visible');
    calcTitle.textContent = 'Sélectionnez une forme';
    calcDesc.textContent = '';
    inputsGroup.innerHTML = '';
    resultsGrid.innerHTML = '';
    resultsGrid.classList.remove('visible');
    formulaSection.innerHTML = '';
    formulaSection.classList.remove('visible');
    shapePreview.innerHTML = '';
    calcButton.disabled = true;
  }

  // ── Init ───────────────────────────────────────────────────────────

  renderShapeCards();
})();
