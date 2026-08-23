/**
 * Calculator Module - Geomembrane Pool Calculator
 * Calculates sheet area and volume for agricultural pools
 */

(function(){
  'use strict';

  // DOM Elements
  const poolType = document.getElementById('poolType');
  const lengthInput = document.getElementById('length');
  const widthInput = document.getElementById('width');
  const heightInput = document.getElementById('height');
  const radiusInput = document.getElementById('radius');
  const marginInput = document.getElementById('margin');
  const radiusGroup = document.getElementById('radiusGroup');
  const calcBtn = document.getElementById('calcBtn');
  
  // Result elements
  const resultSheet = document.getElementById('resultSheet');
  const resultVolume = document.getElementById('resultVolume');
  const sheetArea = document.getElementById('sheetArea');
  const volume = document.getElementById('volume');
  const resultCta = document.getElementById('resultCta');
  const whatsappCta = document.getElementById('whatsappCta');
  const phoneCta = document.getElementById('phoneCta');

  // State
  let lastResult = null;

  // Constants
  const S_VALUES = {
    sloped45: 1,
    sloped60: 1 / Math.sqrt(3), // 0.57735... more accurate than 0.5
  };
  const PI = Math.PI;

  // Format number with Persian digits and 2 decimals
  function formatNumber(num) {
    if (!isFinite(num)) return '—';
    return num.toLocaleString('fa-IR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // Format for WhatsApp message (plain numbers)
  function formatPlain(num) {
    if (!isFinite(num)) return '0';
    return num.toFixed(2);
  }

  // Validate inputs
  function getInputs() {
    const type = poolType.value;
    const L = parseFloat(lengthInput.value) || 0;
    const W = parseFloat(widthInput.value) || 0;
    const H = parseFloat(heightInput.value) || 0;
    const r = parseFloat(radiusInput.value) || 0;
    const M = parseFloat(marginInput.value) || 0;

    return { type, L, W, H, r, M };
  }

  // Show/hide radius field based on pool type
  function toggleRadiusField() {
    const type = poolType.value;
    radiusGroup.style.display = type === 'cylindrical' ? 'block' : 'none';
    
    // Toggle required attribute
    radiusInput.required = type === 'cylindrical';
    lengthInput.required = type !== 'cylindrical';
    widthInput.required = type !== 'cylindrical';
  }

  // Calculate for sloped walls (45° or 60°)
  function calculateSloped(L, W, H, M, S) {
    const d = H * S;
    const L_floor = Math.max(0, L - 2 * d);
    const W_floor = Math.max(0, W - 2 * d);
    const s = Math.sqrt(H * H + d * d);
    
    const V = (H / 3) * (L * W + L_floor * W_floor + Math.sqrt(L * W * L_floor * W_floor));
    
    const A_floor = L_floor * W_floor;
    const A_walls = s * (L + L_floor + W + W_floor);
    const A_inner = A_floor + A_walls;
    
    const P = 2 * L + 2 * W;
    const A_margin = P * M;
    const A_sheet = A_inner + A_margin;

    return {
      V, A_sheet, A_floor, A_walls, A_margin, A_inner,
      L_floor, W_floor, d, s
    };
  }

  // Calculate for vertical walls
  function calculateVertical(L, W, H, M) {
    const V = L * W * H;
    const A_floor = L * W;
    const A_walls = 2 * L * H + 2 * W * H;
    const A_inner = A_floor + A_walls;
    const P = 2 * L + 2 * W;
    const A_margin = P * M;
    const A_sheet = A_inner + A_margin;

    return { V, A_sheet, A_floor, A_walls, A_margin, A_inner };
  }

  // Calculate for cylindrical
  function calculateCylindrical(r, H, M) {
    const V = PI * r * r * H;
    const A_floor = PI * r * r;
    const A_walls = 2 * PI * r * H;
    const A_inner = A_floor + A_walls;
    const P = 2 * PI * r;
    const A_margin = P * M;
    const A_sheet = A_inner + A_margin;

    return { V, A_sheet, A_floor, A_walls, A_margin, A_inner };
  }

  // Main calculation
  function calculate() {
    const { type, L, W, H, r, M } = getInputs();

    // Validation
    if (type === 'cylindrical') {
      if (r <= 0 || H <= 0) {
        showToast('لطفاً شعاع و ارتفاع را وارد کنید');
        return null;
      }
    } else {
      if (L <= 0 || W <= 0 || H <= 0) {
        showToast('لطفاً طول، عرض و ارتفاع را وارد کنید');
        return null;
      }
    }

    let result;

    switch (type) {
      case 'sloped45':
        result = calculateSloped(L, W, H, M, S_VALUES.sloped45);
        break;
      case 'sloped60':
        result = calculateSloped(L, W, H, M, S_VALUES.sloped60);
        break;
      case 'vertical':
        result = calculateVertical(L, W, H, M);
        break;
      case 'cylindrical':
        result = calculateCylindrical(r, H, M);
        break;
      default:
        return null;
    }

    lastResult = { ...result, type, L, W, H, r, M };
    return result;
  }

  // Update UI with results
  function updateUI(result) {
    if (!result) return;

    sheetArea.textContent = formatNumber(result.A_sheet);
    volume.textContent = formatNumber(result.V);

    resultSheet.style.display = 'flex';
    resultVolume.style.display = 'flex';
    resultCta.style.display = 'block';

    // Update WhatsApp link with pre-filled message
    updateWhatsAppLink(result);
  }

  // Generate WhatsApp message with results
  function updateWhatsAppLink(result) {
    const typeLabels = {
      sloped45: 'مستطیلی - دیواره شیب‌دار ۴۵°',
      sloped60: 'مستطیلی - دیواره شیب‌دار ۶۰°',
      vertical: 'مستطیلی - دیواره عمودی',
      cylindrical: 'استوانه‌ای'
    };

    const typeLabel = typeLabels[lastResult.type] || '';
    const dims = lastResult.type === 'cylindrical' 
      ? `شعاع: ${formatPlain(lastResult.r)}م، ارتفاع: ${formatPlain(lastResult.H)}م`
      : `طول: ${formatPlain(lastResult.L)}م، عرض: ${formatPlain(lastResult.W)}م، ارتفاع: ${formatPlain(lastResult.H)}م`;

    const message = `محاسبه ورق ژئوممبران - پلیمر کاوه
نوع: ${typeLabel}
${dims}
مهار: ${formatPlain(lastResult.M)}م

📊 نتایج:
▫️ مساحت کل ورق: ${formatPlain(result.A_sheet)} m²
▫️ حجم استخر: ${formatPlain(result.V)} m³

جزئیات:
• مساحت کف: ${formatPlain(result.A_floor)} m²
• مساحت دیواره‌ها: ${formatPlain(result.A_walls)} m²
• مساحت مهار: ${formatPlain(result.A_margin)} m²

جهت استعلام قیمت و سفارش تماس بگیرید.`;

    const encoded = encodeURIComponent(message);
    whatsappCta.href = `https://wa.me/989133282241?text=${encoded}`;
  }

  // Show toast notification
  function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('visible'));

    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  // Reset form
  
  // Event listeners
  poolType.addEventListener('change', toggleRadiusField);
  
  calcBtn.addEventListener('click', () => {
    const result = calculate();
    if (result) updateUI(result);
  });

  

  // Real-time calculation on input (debounced)
  let calcTimeout;
  const inputs = [lengthInput, widthInput, heightInput, radiusInput, marginInput];
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      clearTimeout(calcTimeout);
      calcTimeout = setTimeout(() => {
        const result = calculate();
        if (result && lastResult) updateUI(result);
      }, 300);
    });
  });

  // Initialize
  toggleRadiusField();

  // Expose for debugging
  window.PoolCalculator = { calculate, getInputs, formatNumber };
})();