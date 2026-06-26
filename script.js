// Pricing matrix: base monthly rate per tier, per currency
const pricingMatrix = {
  starter: {
    INR: 999,
    USD: 12,
    EUR: 11
  },
  pro: {
    INR: 2999,
    USD: 36,
    EUR: 33
  },
  enterprise: {
    INR: 7999,
    USD: 96,
    EUR: 89
  }
};

const currencySymbols = {
  INR: '₹',
  USD: '$',
  EUR: '€'
};

const ANNUAL_DISCOUNT = 0.20; // flat 20% discount multiplier

// current selected state
let currentCurrency = 'INR';
let currentCycle = 'monthly'; // or 'annual'

function calculatePrice(tier, currency, cycle) {
  const base = pricingMatrix[tier][currency];
  if (cycle === 'annual') {
    const annualTotal = base * 12 * (1 - ANNUAL_DISCOUNT);
    return Math.round(annualTotal / 12); // show as per-month equivalent
  }
  return base;
}
function updatePrices() {
  const priceElements = document.querySelectorAll('.price-value');
  const symbolElements = document.querySelectorAll('.currency-symbol');

  // Update ONLY the text nodes - no parent re-render
  priceElements.forEach(el => {
    const tier = el.getAttribute('data-tier');
    const newPrice = calculatePrice(tier, currentCurrency, currentCycle);
    el.textContent = newPrice;
  });

  symbolElements.forEach(el => {
    el.textContent = currencySymbols[currentCurrency];
  });
}

// Billing toggle buttons
const monthlyBtn = document.getElementById('monthly-btn');
const annualBtn = document.getElementById('annual-btn');

monthlyBtn.addEventListener('click', () => {
  currentCycle = 'monthly';
  monthlyBtn.classList.add('bg-nocturnal', 'text-arctic');
  monthlyBtn.classList.remove('text-noir');
  annualBtn.classList.remove('bg-nocturnal', 'text-arctic');
  annualBtn.classList.add('text-noir');
  updatePrices();
});

annualBtn.addEventListener('click', () => {
  currentCycle = 'annual';
  annualBtn.classList.add('bg-nocturnal', 'text-arctic');
  annualBtn.classList.remove('text-noir');
  monthlyBtn.classList.remove('bg-nocturnal', 'text-arctic');
  monthlyBtn.classList.add('text-noir');
  updatePrices();
});

// Currency switcher
const currencySelect = document.getElementById('currency-select');
currencySelect.addEventListener('change', (e) => {
  currentCurrency = e.target.value;
  updatePrices();
});

// Run once on page load to sync initial state
updatePrices();
// Track the currently active bento/accordion card
let activeIndex = null;

const bentoItems = document.querySelectorAll('.bento-item');

bentoItems.forEach(item => {
  item.addEventListener('click', () => {
    // Only toggle accordion behavior on mobile widths
    if (window.innerWidth < 768) {
      const index = item.getAttribute('data-index');

      if (activeIndex === index) {
        // Clicking the same one again closes it
        item.classList.remove('active');
        activeIndex = null;
      } else {
        // Close any previously open card
        bentoItems.forEach(i => i.classList.remove('active'));
        // Open the clicked one
        item.classList.add('active');
        activeIndex = index;
      }
    }
  });

  // Track hover on desktop for Context Lock
  item.addEventListener('mouseenter', () => {
    if (window.innerWidth >= 768) {
      activeIndex = item.getAttribute('data-index');
    }
  });
});

// Context Lock: when resizing past the mobile breakpoint,
// transfer the active desktop hover index to the mobile accordion
window.addEventListener('resize', () => {
  if (window.innerWidth < 768 && activeIndex !== null) {
    bentoItems.forEach(item => {
      if (item.getAttribute('data-index') === activeIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }
});
const demoModal = document.getElementById('demo-modal');
const openDemoBtn = document.getElementById('open-demo');
const closeDemoBtn = document.getElementById('close-demo');

openDemoBtn.addEventListener('click', () => {
  demoModal.classList.remove('hidden');
  demoModal.classList.add('flex');
});

closeDemoBtn.addEventListener('click', () => {
  demoModal.classList.add('hidden');
  demoModal.classList.remove('flex');
});
const trialModal = document.getElementById('trial-modal');
const openTrialBtn = document.getElementById('open-trial');
const closeTrialBtn = document.getElementById('close-trial');

openTrialBtn.addEventListener('click', () => {
  trialModal.classList.remove('hidden');
  trialModal.classList.add('flex');
});

closeTrialBtn.addEventListener('click', () => {
  trialModal.classList.add('hidden');
  trialModal.classList.remove('flex');
});
const submitTrialBtn = document.getElementById('submit-trial');
const trialEmailInput = document.getElementById('trial-email');

submitTrialBtn.addEventListener('click', () => {
  const email = trialEmailInput.value.trim();
  if (email === '' || !email.includes('@')) {
    alert('Please enter a valid email address.');
    return;
  }
  trialModal.querySelector('.relative').innerHTML = `
    <button id="close-trial-2" class="absolute top-4 right-4 text-noir/60 hover:text-noir text-2xl">&times;</button>
    <h3 class="font-mono font-bold text-2xl text-nocturnal mb-2">You're In! 🎉</h3>
    <p class="text-noir/70 text-sm">We've sent a confirmation to <strong>${email}</strong>. Check your inbox to activate your 14-day free trial.</p>
  `;
  document.getElementById('close-trial-2').addEventListener('click', () => {
    trialModal.classList.add('hidden');
    trialModal.classList.remove('flex');
  });
});