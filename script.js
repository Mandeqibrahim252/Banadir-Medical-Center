/* ============================================
   Banadir Medical Center - JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // Loading Screen
  const loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen) {
    window.addEventListener('load', () => {
      setTimeout(() => loadingScreen.classList.add('hidden'), 1500);
    });
    setTimeout(() => loadingScreen.classList.add('hidden'), 4000);
  }

  // Sticky Navbar
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const handleScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
  }

  // Mobile Menu
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const mobileOverlay = document.querySelector('.mobile-overlay');

  if (navToggle && navMenu) {
    function toggleMobile() {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
      if (mobileOverlay) mobileOverlay.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    }
    navToggle.addEventListener('click', toggleMobile);
    if (mobileOverlay) mobileOverlay.addEventListener('click', toggleMobile);
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) toggleMobile();
      });
    });
  }

  // Dark Mode Toggle
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateThemeIcon(next);
    });
  }

  function updateThemeIcon(theme) {
    const icon = document.querySelector('#themeToggle i');
    if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }

  // Language Toggle
  const langSwitch = document.getElementById('langSwitch');
  if (langSwitch) {
    const savedLang = localStorage.getItem('lang') || 'en';
    document.body.setAttribute('data-lang', savedLang);
    updateLangText(savedLang);

    langSwitch.addEventListener('click', () => {
      const current = document.body.getAttribute('data-lang');
      const next = current === 'en' ? 'so' : 'en';
      document.body.setAttribute('data-lang', next);
      localStorage.setItem('lang', next);
      updateLangText(next);
    });
  }

  function updateLangText(lang) {
    const span = document.querySelector('#langSwitch span');
    if (span) span.textContent = lang === 'en' ? 'EN' : 'SO';
  }

  // Scroll Reveal
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    revealElements.forEach(el => revealObserver.observe(el));
  }

  // Counter Animation
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (statNumbers.length) {
    function animateCounter(el) {
      const target = parseInt(el.getAttribute('data-target'));
      const duration = 2000;
      const startTime = performance.now();
      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target.toLocaleString();
      }
      requestAnimationFrame(update);
    }
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statNumbers.forEach(el => counterObserver.observe(el));
  }

  // Appointment Form
  const appointmentForm = document.getElementById('appointmentForm');
  if (appointmentForm) {
    const deptSelect = document.getElementById('department');
    const docSelect = document.getElementById('doctor');

    const doctorsByDept = {
      cardiology: ['Dr. Ahmed Hassan', 'Dr. Abdi Warsame'],
      neurology: ['Dr. Omar Mohamed', 'Dr. Sara Ali'],
      orthopedics: ['Dr. Hassan Abdi', 'Dr. Yusuf Omar'],
      ophthalmology: ['Dr. Amina Yusuf', 'Dr. Khalid Ahmed'],
      pediatrics: ['Dr. Fatima Ali', 'Dr. Maryam Hassan'],
      general: ['Dr. Ali Mohamed', 'Dr. Zahra Abdi'],
      surgery: ['Dr. Yusuf Omar', 'Dr. Ahmed Hassan'],
      laboratory: ['Dr. Hassan Abdi', 'Dr. Nadia Farah'],
      radiology: ['Dr. Mohamed Bashir', 'Dr. Sara Ali']
    };

    if (deptSelect && docSelect) {
      deptSelect.addEventListener('change', () => {
        const dept = deptSelect.value;
        const doctors = doctorsByDept[dept] || [];
        docSelect.innerHTML = '<option value="">Select Doctor</option>';
        doctors.forEach(doc => {
          const opt = document.createElement('option');
          opt.value = doc; opt.textContent = doc;
          docSelect.appendChild(opt);
        });
      });
    }

    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(appointmentForm);
      const name = data.get('name');
      const email = data.get('email');
      const phone = data.get('phone');
      const dept = data.get('department');
      const date = data.get('date');

      if (!name || !email || !phone || !dept || !date) {
        showNotification('Please fill in all required fields.', 'error');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
      }
      showNotification('Appointment booked successfully! We will contact you soon.', 'success');
      appointmentForm.reset();
      if (docSelect) docSelect.innerHTML = '<option value="">Select Doctor</option>';
    });
  }

  function showNotification(message, type) {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    const n = document.createElement('div');
    n.className = 'notification';
    n.innerHTML = `
      <div class="notification-icon"><i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i></div>
      <div class="notification-text"><h4>${type === 'success' ? 'Success!' : 'Warning'}</h4><p>${message}</p></div>`;
    document.body.appendChild(n);
    requestAnimationFrame(() => n.classList.add('show'));
    setTimeout(() => { n.classList.remove('show'); setTimeout(() => n.remove(), 500); }, 4000);
  }

  // Scroll To Top
  const scrollTop = document.getElementById('scrollTop');
  if (scrollTop) {
    window.addEventListener('scroll', () => {
      scrollTop.classList.toggle('visible', window.scrollY > 400);
    });
    scrollTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Set min date for appointment
  const dateInput = document.getElementById('appointmentDate');
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.setAttribute('min', `${yyyy}-${mm}-${dd}`);
  }

  // Newsletter
  const nlForm = document.querySelector('.newsletter-form');
  if (nlForm) {
    nlForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = nlForm.querySelector('input');
      if (input.value) {
        showNotification('Thank you for subscribing!', 'success');
        input.value = '';
      }
    });
  }
});
