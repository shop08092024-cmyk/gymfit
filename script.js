// ===== Mobile nav toggle =====
const burger = document.getElementById('burger');
const navMobile = document.getElementById('navMobile');
if (burger && navMobile) {
  burger.addEventListener('click', () => {
    navMobile.classList.toggle('is-open');
  });
  navMobile.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navMobile.classList.remove('is-open'));
  });
}

// ===== Membership plan toggle (single / duo / group) =====
const toggleBtns = document.querySelectorAll('.plan-toggle__btn');
const priceEls = document.querySelectorAll('.price-value');

toggleBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    toggleBtns.forEach(b => { b.classList.remove('is-active'); b.setAttribute('aria-selected', 'false'); });
    btn.classList.add('is-active');
    btn.setAttribute('aria-selected', 'true');
    const group = btn.dataset.group;

    priceEls.forEach(el => {
      let value;
      if (group === 'single' && el.dataset.single) value = el.dataset.single;
      else if (group === 'duo' && el.dataset.duo) value = el.dataset.duo;
      else if (group === 'group' && el.dataset.group) value = el.dataset.group;

      if (value) {
        el.textContent = '₹' + Number(value).toLocaleString('en-IN');
      }
    });

    // update note text for offer cards
    document.querySelectorAll('.plan-card__note--offer').forEach(note => {
      if (group === 'single') note.textContent = '10% off applied';
      if (group === 'duo') note.textContent = '15% off applied';
      if (group === 'group') note.textContent = '20% off applied';
    });
  });
});

// ===== Animated stat counters (hero) =====
const statNums = document.querySelectorAll('.stat__num');

function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const isDecimal = el.dataset.decimal;
  const prefix = el.dataset.prefix || '';
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;
    el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.round(current).toLocaleString('en-IN'));
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => statObserver.observe(el));

// ===== Footer year =====
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== Plan selection redirection & autofill =====
const planBtns = document.querySelectorAll('.plan-select-btn');
if (planBtns.length > 0) {
  planBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const duration = btn.dataset.plan;
      
      // Determine the active membership type
      let planType = 'Individual';
      const activeToggle = document.querySelector('.plan-toggle__btn.is-active');
      if (activeToggle) {
        const group = activeToggle.dataset.group;
        if (group === 'duo') planType = 'Duo';
        if (group === 'group') planType = 'Group (4+)';
      }

      // Redirect to contact.html with parameters
      window.location.href = `contact.html?plan=${encodeURIComponent(duration)}&type=${encodeURIComponent(planType)}`;
    });
  });
}

// ===== Parse URL params & auto-populate form (on contact page) =====
const enquiryMessage = document.getElementById('enquiryMessage');
const enquiryName = document.getElementById('enquiryName');
if (enquiryMessage && enquiryName) {
  const params = new URLSearchParams(window.location.search);
  const plan = params.get('plan');
  const type = params.get('type');
  
  if (plan && type) {
    enquiryMessage.value = `Hi Gym Fit! I would like to sign up for the ${plan} ${type} Plan. Please share the joining details.`;
    
    // Focus the name field with a small delay for smooth user experience
    setTimeout(() => {
      enquiryName.focus();
    }, 500);
  }
}

// ===== Enquiry Form Submission =====
const enquiryForm = document.getElementById('enquiryForm');
const enquirySuccess = document.getElementById('enquirySuccess');

if (enquiryForm && enquirySuccess) {
  enquiryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('enquiryName').value;
    const phone = document.getElementById('enquiryPhone').value;
    const message = document.getElementById('enquiryMessage').value;
    
    // Format the WhatsApp message text with basic formatting
    const formattedText = `*Gym Fit Enquiry*\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Message:* ${message}`;
    const whatsappUrl = `https://wa.me/919861661717?text=${encodeURIComponent(formattedText)}`;
    
    // Show success state on form card
    enquiryForm.style.display = 'none';
    enquirySuccess.style.display = 'block';
    
    // Redirect to WhatsApp after a brief delay
    setTimeout(() => {
      window.location.href = whatsappUrl;
    }, 800);
  });
}
