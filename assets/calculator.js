/**
 * Calculator Module - Geomembrane Pool Calculator
 * Calculates sheet area and volume for agricultural pools
 */

(function initCalculator(){
  'use strict';

  // DOM Elements
  const form = document.getElementById('calc-form');
  const poolType = document.getElementById('pool-type');
  const rectInputs = document.getElementById('rect-inputs');
  const cylInputs = document.getElementById('cyl-inputs');
  const resultsCard = document.getElementById('results-card');
  const calcBtn = document.getElementById('calc-btn');
  const whatsappCta = document.getElementById('whatsapp-cta');
  const formulaDisplay = document.getElementById('formula-display');

  // Result elements
  const resArea = document.getElementById('res-area');
  const resVolume = document.getElementById('res-volume');
  const resFloor = document.getElementById('res-floor');
  const resWalls = document.getElementById('res-walls');
  const resMargin = document.getElementById('res-margin');

  let lastCalculation = null;

  // Input visibility toggle
  poolType.addEventListener('change', () => {
    const type = poolType.value;
    rectInputs.style.display = (type === 'sloped-45' || type === 'sloped-60' || type === 'vertical') ? 'grid' : 'none';
    cylInputs.style.display = (type === 'cylindrical') ? 'block' : 'none';
    resultsCard.style.display = 'none';
  });

  // Format number with Persian digits and separators
  function formatNumber(num, decimals = 2){
    if (num === null || num === undefined || isNaN(num)) return '—';
    return num.toLocaleString('fa-IR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  // Show formula for selected type
  function showFormula(type){
    const formulas = {
      'sloped-45': `
        <h4>مستطیلی - دیواره شیب‌دار ۴۵°</h4>
        <ul>
          <li>S = 1 (tan 45°)</li>
          <li>d = H × S</li>
          <li>L<sub>کف</sub> = L − 2d</li>
          <li>W<sub>کف</sub> = W − 2d</li>
          <li>s = √(H² + d²)</li>
          <li>V = H/3 × [LW + L<sub>کف</sub>W<sub>کف</sub> + √(LW × L<sub>کف</sub>W<sub>کف</sub>)]</li>
          <li>A<sub>کف</sub> = L<sub>کف</sub> × W<sub>کف</sub></li>
          <li>A<sub>دیواره</sub> = s × (L + L<sub>کف</sub> + W + W<sub>کف</sub>)</li>
          <li>A<sub>داخل</sub> = A<sub>کف</sub> + A<sub>دیواره</sub></li>
          <li>P = 2L + 2W</li>
          <li>A<sub>مهار</sub> = P × M</li>
          <li><strong>A<sub>ورق</sub> = A<sub>داخل</sub> + A<sub>مهار</sub></strong></li>
        </ul>
      `,
      'sloped-60': `
        <h4>مستطیلی - دیواره شیب‌دار ۶۰°</h4>
        <ul>
          <li>S = 0.5 (tan 30° ≈ 0.577)</li>
          <li>d = H × S</li>
          <li>L<sub>کف</sub> = L − 2d</li>
          <li>W<sub>کف</sub> = W − 2d</li>
          <li>s = √(H² + d²)</li>
          <li>V = H/3 × [LW + L<sub>کف</sub>W<sub>کف</sub> + √(LW × L<sub>کف</sub>W<sub>کف</sub>)]</li>
          <li>A<sub>کف</sub> = L<sub>کف</sub> × W<sub>کف</sub></li>
          <li>A<sub>دیواره</sub> = s × (L + L<sub>کف</sub> + W + W<sub>کف</sub>)</li>
          <li>A<sub>داخل</sub> = A<sub>کف</sub> + A<sub>دیواره</sub></li>
          <li>P = 2L + 2W</li>
          <li>A<sub>مهار</sub> = P × M</li>
          <li><strong>A<sub>ورق</sub> = A<sub>داخل</sub> + A<sub>مهار</sub></strong></li>
        </ul>
      `,
      'vertical': `
        <h4>مستطیلی - دیواره عمودی</h4>
        <ul>
          <li>V = L × W × H</li>
          <li>A<sub>کف</sub> = L × W</li>
          <li>A<sub>دیواره</sub> = 2LH + 2WH</li>
          <li>A<sub>داخل</sub> = LW + 2LH + 2WH</li>
          <li>P = 2L + 2W</li>
          <li>A<sub>مهار</sub> = P × M</li>
          <li><strong>A<sub>ورق</sub> = A<sub>داخل</sub> + A<sub>مهار</sub></strong></li>
        </ul>
      `,
      'cylindrical': `
        <h4>استوانه‌ای</h4>
        <ul>
          <li>V = π × r² × H</li>
          <li>A<sub>کف</sub> = π × r²</li>
          <li>A<sub>دیواره</sub> = 2π × r × H</li>
          <li>A<sub>داخل</sub> = πr² + 2πrH</li>
          <li>P = 2π × r</li>
          <li>A<sub>مهار</sub> = P × M</li>
          <li><strong>A<sub>ورق</sub> = A<sub>داخل</sub> + A<sub>مهار</sub></strong></li>
          <li><small>π ≈ 3.14159</small></li>
        </ul>
      `
    };
    formulaDisplay.innerHTML = formulas[type] || '';
  }

  // Main calculation function
  function calculate(){
    const type = poolType.value;
    const height = parseFloat(document.getElementById('height').value);
    const margin = parseFloat(document.getElementById('margin').value);

    if (!type || isNaN(height) || isNaN(margin) || height <= 0 || margin < 0){
      showToast('لطفاً تمام فیلدها را به‌درستی پر کنید');
      return null;
    }

    let result = {};

    if (type === 'sloped-45' || type === 'sloped-60'){
      const length = parseFloat(document.getElementById('length').value);
      const width = parseFloat(document.getElementById('width').value);

      if (isNaN(length) || isNaN(width) || length <= 0 || width <= 0){
        showToast('طول و عرض را وارد کنید');
        return null;
      }

      const S = type === 'sloped-45' ? 1 : 0.5;
      const d = height * S;
      const L_floor = length - 2 * d;
      const W_floor = width - 2 * d;

      if (L_floor <= 0 || W_floor <= 0){
        showToast('ارتفاع بسیار زیاد است برای ابعاد داده‌شده (کف منفی می‌شود)');
        return null;
      }

      const s = Math.sqrt(height * height + d * d);
      const floorArea = L_floor * W_floor;
      const topArea = length * width;
      const volume = (height / 3) * (topArea + floorArea + Math.sqrt(topArea * floorArea));
      const wallArea = s * (length + L_floor + width + W_floor);
      const innerArea = floorArea + wallArea;
      const perimeter = 2 * (length + width);
      const marginArea = perimeter * margin;
      const sheetArea = innerArea + marginArea;

      result = {
        type,
        S, d, L_floor, W_floor, s,
        volume,
        floorArea,
        wallArea,
        innerArea,
        marginArea,
        sheetArea,
        length, width, height, margin
      };

    } else if (type === 'vertical'){
      const length = parseFloat(document.getElementById('length').value);
      const width = parseFloat(document.getElementById('width').value);

      if (isNaN(length) || isNaN(width) || length <= 0 || width <= 0){
        showToast('طول و عرض را وارد کنید');
        return null;
      }

      const volume = length * width * height;
      const floorArea = length * width;
      const wallArea = 2 * length * height + 2 * width * height;
      const innerArea = floorArea + wallArea;
      const perimeter = 2 * (length + width);
      const marginArea = perimeter * margin;
      const sheetArea = innerArea + marginArea;

      result = {
        type,
        volume,
        floorArea,
        wallArea,
        innerArea,
        marginArea,
        sheetArea,
        length, width, height, margin
      };

    } else if (type === 'cylindrical'){
      const radius = parseFloat(document.getElementById('radius').value);

      if (isNaN(radius) || radius <= 0){
        showToast('شعاع را وارد کنید');
        return null;
      }

      const PI = Math.PI;
      const volume = PI * radius * radius * height;
      const floorArea = PI * radius * radius;
      const wallArea = 2 * PI * radius * height;
      const innerArea = floorArea + wallArea;
      const perimeter = 2 * PI * radius;
      const marginArea = perimeter * margin;
      const sheetArea = innerArea + marginArea;

      result = {
        type,
        volume,
        floorArea,
        wallArea,
        innerArea,
        marginArea,
        sheetArea,
        radius, height, margin
      };
    }

    lastCalculation = result;
    return result;
  }

  // Update UI with results
  function updateResults(result){
    if (!result) return;

    resArea.textContent = formatNumber(result.sheetArea);
    resVolume.textContent = formatNumber(result.volume);
    resFloor.textContent = formatNumber(result.floorArea);
    resWalls.textContent = formatNumber(result.wallArea);
    resMargin.textContent = formatNumber(result.marginArea);

    // Update WhatsApp CTA with pre-filled message
    const msg = encodeURIComponent(
      `سلام، محاسبه ورق ژئوممبران استخر کشاورزی:\n\n` +
      `نوع: ${getTypeLabel(result.type)}\n` +
      `مساحت ورق: ${formatNumber(result.sheetArea)} متر مربع\n` +
      `حجم استخر: ${formatNumber(result.volume)} متر مکعب\n\n` +
      `لطفاً قیمت و مشاوره دهید.`
    );
    whatsappCta.href = `https://wa.me/989133282241?text=${msg}`;

    showFormula(result.type);
    resultsCard.style.display = 'block';
    resultsCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function getTypeLabel(type){
    const labels = {
      'sloped-45': 'مستطیلی - دیواره شیب‌دار ۴۵°',
      'sloped-60': 'مستطیلی - دیواره شیب‌دار ۶۰°',
      'vertical': 'مستطیلی - دیواره عمودی',
      'cylindrical': 'استوانه‌ای'
    };
    return labels[type] || type;
  }

  // Toast notification (reuse from app.js or define local)
  function showToast(message){
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
    }, 3000);
  }

  // Event listeners
  calcBtn.addEventListener('click', () => {
    const result = calculate();
    if (result) updateResults(result);
  });

  // Real-time calculation on input change (debounced)
  let calcTimeout = null;
  const inputs = form.querySelectorAll('input, select');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      clearTimeout(calcTimeout);
      calcTimeout = setTimeout(() => {
        if (poolType.value && form.checkValidity()){
          const result = calculate();
          if (result) updateResults(result);
        }
      }, 300);
    });
  });

  // Enter key submits
  form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter'){
      e.preventDefault();
      calcBtn.click();
    }
  });

  // Share API support for mobile
  if (navigator.share && resultsCard){
    const shareBtn = document.createElement('button');
    shareBtn.type = 'button';
    shareBtn.className = 'btn btn-outline';
    shareBtn.style.marginTop = '8px';
    shareBtn.textContent = 'اشتراک‌گذاری نتیجه';
    shareBtn.addEventListener('click', async () => {
      if (!lastCalculation) return;
      try {
        await navigator.share({
          title: 'محاسبه ورق ژئوممبران استخر',
          text: `مساحت ورق: ${formatNumber(lastCalculation.sheetArea)} m²\nحجم: ${formatNumber(lastCalculation.volume)} m³`,
          url: window.location.href
        });
      } catch (e) {
        // User cancelled or error
      }
    });
    document.querySelector('.result-actions').appendChild(shareBtn);
  }

})();