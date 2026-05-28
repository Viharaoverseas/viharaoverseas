/* ==========================================================================
   VIHARA OVERSEAS - PREMIUM LUXURY INTERACTIONS LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Ambient Cursor Spotlight & Magnetic Elements
    initCursorSpotlight();
    initMagneticElements();
    init3DTiltCompass();
    init3DTiltCards();
    
    // 2. Global UI Layout Mechanics
    initHeaderScroll();
    initMobileNavigation();
    
    // 3. GSAP & ScrollTrigger Animations
    initScrollAnimations();
    
    // 4. Interactive CRS Points Eligibility Calculator (Assessment Page)
    if (document.getElementById('crs-calculator')) {
        initCRSCalculator();
    }
    
    // 5. Travel Ticket Booking Integrated with Akbar Travel API
    if (document.getElementById('travel-form')) {
        initTravelConcierge();
    }
});

/* ==========================================================================
   CURSOR & INTERACTIVE LIGHT SPOTLIGHT
   ========================================================================== */

function initCursorSpotlight() {
    const ambientGlow = document.querySelector('.ambient-glow');
    if (!ambientGlow) return;
    
    window.addEventListener('mousemove', (e) => {
        // Update CSS custom properties for radial spotlight coordinates
        ambientGlow.style.setProperty('--mouse-x', `${e.clientX}px`);
        ambientGlow.style.setProperty('--mouse-y', `${e.clientY}px`);
    });
}

/* ==========================================================================
   MAGNETIC HOVER ACTION ON PREMIUM CTAs
   ========================================================================== */

function initMagneticElements() {
    const magneticItems = document.querySelectorAll('.magnetic');
    
    magneticItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            // Calculate hover delta distance
            const x = e.clientX - rect.left - (rect.width / 2);
            const y = e.clientY - rect.top - (rect.height / 2);
            
            // Subtly translate button position towards cursor
            item.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        item.addEventListener('mouseleave', () => {
            // Smooth snap back to standard position
            item.style.transform = 'translate(0px, 0px)';
        });
    });
}

/* ==========================================================================
   3D MOUSE-REACTIVE COMPASS TILT EFFECT
   ========================================================================== */

function init3DTiltCompass() {
    const heroBox = document.querySelector('#hero-block');
    const compassCard = document.querySelector('#animated-3d-compass');
    const needle = document.getElementById('compass-needle');
    if (!heroBox || !compassCard || !needle) return;
    
    let isSpinning = false;
    let currentRotation = 35; // initial state
    
    // Helper function to get angle relative to center of compass
    function getAngle(clientX, clientY) {
        const rect = compassCard.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = clientX - centerX;
        const dy = clientY - centerY;
        let angle = Math.atan2(dy, dx) * (180 / Math.PI);
        return angle + 90; // offset North alignment
    }
    
    // Mouse tracking on hero block
    heroBox.addEventListener('mousemove', (e) => {
        const rect = heroBox.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const rotateY = ((x - (rect.width / 2)) / (rect.width / 2)) * 10;
        const rotateX = -((y - (rect.height / 2)) / (rect.height / 2)) * 10;
        
        compassCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        
        if (!isSpinning) {
            const targetAngle = getAngle(e.clientX, e.clientY);
            needle.style.transform = `rotate(${targetAngle}deg)`;
            currentRotation = targetAngle;
        }
    });
    
    // Touch tracking for mobile parity
    heroBox.addEventListener('touchmove', (e) => {
        if (e.touches.length === 0) return;
        const touch = e.touches[0];
        const rect = heroBox.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        const rotateY = ((x - (rect.width / 2)) / (rect.width / 2)) * 10;
        const rotateX = -((y - (rect.height / 2)) / (rect.height / 2)) * 10;
        
        compassCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        
        if (!isSpinning) {
            const targetAngle = getAngle(touch.clientX, touch.clientY);
            needle.style.transform = `rotate(${targetAngle}deg)`;
            currentRotation = targetAngle;
        }
    }, { passive: true });
    
    // Reset positions on exit
    heroBox.addEventListener('mouseleave', () => {
        compassCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        if (!isSpinning) {
            needle.style.transform = 'rotate(0deg)';
            currentRotation = 0;
        }
    });
    
    // Physical elastic spin simulation
    const triggerSpin = (clientX, clientY) => {
        if (isSpinning) return;
        isSpinning = true;
        
        const spinRevolutions = 3 + Math.floor(Math.random() * 2);
        const finalTarget = currentRotation + (spinRevolutions * 360) + (Math.random() * 40 - 20);
        
        const startTime = performance.now();
        const startRotation = currentRotation;
        const duration = 1800; // milliseconds
        
        function animateNeedleSpin(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Custom elastic ease out
            let ease;
            if (progress === 1) {
                ease = 1;
            } else {
                ease = 1 - Math.pow(2, -10 * progress) * Math.sin((progress * 10 - 0.75) * ((2 * Math.PI) / 3));
            }
            
            const frameRotation = startRotation + (finalTarget - startRotation) * ease;
            needle.style.transform = `rotate(${frameRotation}deg)`;
            
            if (progress < 1) {
                requestAnimationFrame(animateNeedleSpin);
            } else {
                isSpinning = false;
                currentRotation = finalTarget % 360;
                const currentMouseAngle = getAngle(clientX, clientY);
                needle.style.transform = `rotate(${currentMouseAngle}deg)`;
                currentRotation = currentMouseAngle;
            }
        }
        
        requestAnimationFrame(animateNeedleSpin);
    };
    
    compassCard.addEventListener('click', (e) => {
        triggerSpin(e.clientX, e.clientY);
    });
    
    compassCard.addEventListener('touchstart', (e) => {
        if (e.touches.length === 0) return;
        const touch = e.touches[0];
        triggerSpin(touch.clientX, touch.clientY);
    }, { passive: true });
}

/* ==========================================================================
   3D MOUSE-REACTIVE TILT EFFECT FOR ALL PREMIUM CARDS & SUITES
   ========================================================================== */

function init3DTiltCards() {
    const cardSelectors = [
        '.luxury-card',
        '#aura-features-card',
        '#prestige-features-card',
        '#empress-features-card',
        '#value-box-transparency',
        '#value-box-integrity',
        '#score-box'
    ];
    
    const cards = document.querySelectorAll(cardSelectors.join(','));
    
    cards.forEach(card => {
        card.style.transition = 'transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.15s ease-out';
        card.style.transformStyle = 'preserve-3d';
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const rotateY = ((x - (rect.width / 2)) / (rect.width / 2)) * 6; // max 6 degrees
            const rotateX = -((y - (rect.height / 2)) / (rect.height / 2)) * 6;
            
            if (card.id === 'score-box') {
                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            } else {
                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            }
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
        
        card.addEventListener('touchmove', (e) => {
            if (e.touches.length === 0) return;
            const touch = e.touches[0];
            const rect = card.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            
            const rotateY = ((x - (rect.width / 2)) / (rect.width / 2)) * 4;
            const rotateX = -((y - (rect.height / 2)) / (rect.height / 2)) * 4;
            
            if (card.id === 'score-box') {
                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            } else {
                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
            }
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        }, { passive: true });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
        
        card.addEventListener('touchend', () => {
            card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });
}

/* ==========================================================================
   LAYOUT MECHANICS: SCROLL TONES & MOBILE DRAWERS
   ========================================================================== */

function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    const handleScroll = () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run immediately in case of loaded scroll offset
}

function initMobileNavigation() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');
    
    if (!toggle || !menu) return;
    
    toggle.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('open');
        toggle.classList.toggle('open', isOpen);
    });
    
    // Close mobile drawer on navigation click
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('open');
            toggle.classList.remove('open');
        });
    });
}

/* ==========================================================================
   GSAP INTERACTIVE TIMELINES & SCROLL REVEALS
   ========================================================================== */

function initScrollAnimations() {
    // Check if GSAP is available in DOM context before execution
    if (typeof gsap === 'undefined') return;
    
    // Register scroll plug-ins
    gsap.registerPlugin(ScrollTrigger);
    
    // 1. Hero Reveal Staggers
    gsap.from('.hero-content h1', {
        duration: 1.2,
        y: 40,
        opacity: 0,
        ease: 'power4.out',
        delay: 0.2
    });
    
    gsap.from('.hero-content p', {
        duration: 1.2,
        y: 20,
        opacity: 0,
        ease: 'power4.out',
        delay: 0.4
    });
    
    gsap.from('.hero-content .hero-ctas', {
        duration: 1.2,
        y: 20,
        opacity: 0,
        ease: 'power4.out',
        delay: 0.6
    });
    
    gsap.from('.tilting-compass', {
        duration: 1.5,
        scale: 0.9,
        opacity: 0,
        ease: 'power4.out',
        delay: 0.4
    });
    
    // 2. Section Scroll Reveals
    gsap.utils.toArray('.reveal-up').forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            y: 40,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });
    
    // 3. Stagger Cards reveal
    gsap.utils.toArray('.stagger-cards').forEach(container => {
        gsap.from(container.children, {
            scrollTrigger: {
                trigger: container,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out'
        });
    });
}

/* ==========================================================================
   CRS ELIGIBILITY POINTS CALCULATOR (REAL-TIME ENGINE)
   ========================================================================== */

function initCRSCalculator() {
    const calculator = document.getElementById('crs-calculator');
    const ageSlider = document.getElementById('age-slider');
    const ageVal = document.getElementById('age-val');
    
    const expSlider = document.getElementById('exp-slider');
    const expVal = document.getElementById('exp-val');
    
    const scoreNum = document.getElementById('score-num');
    const scoreStatus = document.getElementById('score-status');
    const scoreBox = document.getElementById('score-box');
    const consultForm = document.getElementById('consult-form');
    
    if (!calculator || !ageSlider || !expSlider || !scoreNum) return;
    
    // Real-time slider indicators
    ageSlider.addEventListener('input', () => {
        ageVal.textContent = ageSlider.value;
        calculateScore();
    });
    
    expSlider.addEventListener('input', () => {
        expVal.textContent = expSlider.value >= 6 ? '6+' : expSlider.value;
        calculateScore();
    });
    
    // Handle form radios
    const inputs = calculator.querySelectorAll('input[type="radio"]');
    inputs.forEach(input => {
        input.addEventListener('change', calculateScore);
    });
    
    // Initial Calculation
    calculateScore();
    
    function calculateScore() {
        let total = 0;
        
        // 1. AGE POINT MATRIX
        const age = parseInt(ageSlider.value);
        let agePts = 0;
        if (age >= 18 && age <= 29) agePts = 110;
        else if (age === 30) agePts = 95;
        else if (age === 31) agePts = 90;
        else if (age === 32) agePts = 85;
        else if (age === 33) agePts = 80;
        else if (age === 34) agePts = 75;
        else if (age === 35) agePts = 70;
        else if (age === 36) agePts = 65;
        else if (age === 37) agePts = 60;
        else if (age === 38) agePts = 55;
        else if (age === 39) agePts = 50;
        else if (age === 40) agePts = 45;
        else if (age === 41) agePts = 35;
        else if (age === 42) agePts = 25;
        else if (age === 43) agePts = 15;
        else if (age === 44) agePts = 5;
        else agePts = 0; // 45+
        total += agePts;
        
        // 2. EDUCATION POINT MATRIX
        const eduSelected = calculator.querySelector('input[name="education"]:checked');
        let eduPts = 0;
        if (eduSelected) {
            const edu = eduSelected.value;
            if (edu === 'phd') eduPts = 150;
            else if (edu === 'masters') eduPts = 135;
            else if (edu === 'dual') eduPts = 128;
            else if (edu === 'bachelors') eduPts = 120;
            else if (edu === 'diploma') eduPts = 98;
            else if (edu === 'highschool') eduPts = 30;
        }
        total += eduPts;
        
        // 3. WORK EXPERIENCE MATRIX
        const exp = parseInt(expSlider.value);
        let expPts = 0;
        if (exp === 1) expPts = 40;
        else if (exp === 2) expPts = 53;
        else if (exp === 3) expPts = 64;
        else if (exp === 4) expPts = 72;
        else if (exp === 5) expPts = 78;
        else if (exp >= 6) expPts = 80;
        total += expPts;
        
        // 4. LANGUAGE (IELTS/PTE) MATRIX
        const langSelected = calculator.querySelector('input[name="language"]:checked');
        let langPts = 0;
        if (langSelected) {
            const lang = langSelected.value;
            if (lang === 'clb10') langPts = 136;
            else if (lang === 'clb9') langPts = 124;
            else if (lang === 'clb8') langPts = 88;
            else if (lang === 'clb7') langPts = 68;
            else if (lang === 'clb6') langPts = 0;
        }
        total += langPts;
        
        // Scale/Normalize score to feel premium (typical out of 600 or 1200 base scale)
        // Let's add standard provincial nomination booster points to reflect realistic parameters
        const hasNomination = document.getElementById('nomination') ? document.getElementById('nomination').checked : false;
        if (hasNomination) {
            total += 600; // standard CRS booster
        }
        
        // Smooth score display count-up animation
        animateScore(total);
        
        // Update Premium Status Copy & Suite Recommendations
        let status = '';
        let desc = '';
        const scoreDetailsDesc = document.getElementById('score-details-desc');
        
        if (total >= 460) {
            status = 'Elite Standing - Exceptional Direct Pathway Potential';
            scoreStatus.style.color = '#D4AF37'; // Luxury gold highlight
            desc = 'Based on your exceptional credentials and language scores, you qualify for the **Aura Pathway Suite** (skilled permanent residency). You represent a high-probability profile for direct federal selection.';
        } else if (total >= 380) {
            status = 'Premium Pathway - High State Nomination Probability';
            scoreStatus.style.color = 'var(--color-text)';
            desc = 'Your credentials show strong alignment with the **Prestige Executive Suite**. We recommend targeting state sponsorship or executive pathways (like Germany Opportunity Card) to boost your profile values.';
        } else {
            status = 'Standard Pathway - Strategic Consultation Advised';
            scoreStatus.style.color = 'var(--color-text-muted)';
            desc = 'Your point scale suggests a strategic evaluation. We recommend matching your profile with the **Empress Consulate Suite** to explore specialized scholar admissions or international business investment pathways.';
        }
        scoreStatus.textContent = status;
        if (scoreDetailsDesc) {
            scoreDetailsDesc.innerHTML = desc.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gold">$1</strong>');
        }
    }
    
    function animateScore(target) {
        const start = parseInt(scoreNum.textContent) || 0;
        const duration = 800; // milliseconds
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out quad animation
            const easeProgress = progress * (2 - progress);
            const currentScore = Math.floor(start + (target - start) * easeProgress);
            
            scoreNum.textContent = currentScore;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }
}

/* ==========================================================================
   TRAVEL CONCIERGE & AKBAR TRAVEL API TICKETING WIDGET LOGIC
   ========================================================================== */

function initTravelConcierge() {
    const travelForm = document.getElementById('travel-form');
    if (!travelForm) return;

    const departureSelect = document.getElementById('travel-departure');
    const destinationSelect = document.getElementById('travel-destination');
    const classRadios = document.querySelectorAll('input[name="travel-class"]');
    const passengersSelect = document.getElementById('travel-passengers');
    
    const loungeOption = document.getElementById('opt-lounge');
    const baggageOption = document.getElementById('opt-baggage');
    const transferOption = document.getElementById('opt-transfer');
    const visaBundleOption = document.getElementById('opt-visabundle');

    const baseVal = document.getElementById('calc-base-val');
    const conciergeVal = document.getElementById('calc-concierge-val');
    const discountRow = document.getElementById('calc-discount-row');
    const discountVal = document.getElementById('calc-discount-val');
    const totalVal = document.getElementById('calc-total-val');
    
    const apiLoader = document.getElementById('travel-api-loader');
    const apiLoaderText = document.getElementById('api-loader-text');
    const bookingReceipt = document.getElementById('travel-receipt');

    const recName = document.getElementById('rec-passenger-name');
    const recRoute = document.getElementById('rec-route');
    const recClass = document.getElementById('rec-class');
    const recDate = document.getElementById('rec-date');
    const recRef = document.getElementById('rec-reference');
    const recBase = document.getElementById('rec-base-fare');
    const recConcierge = document.getElementById('rec-concierge-levy');
    const recDiscount = document.getElementById('rec-discount');
    const recDiscountRow = document.getElementById('rec-discount-row');
    const recTotal = document.getElementById('rec-total');

    function calculateLivePrice() {
        if (!departureSelect || !destinationSelect) return;
        
        const dest = destinationSelect.value;
        let baseFare = 50000;
        
        if (dest === 'toronto') baseFare = 95000;
        else if (dest === 'frankfurt') baseFare = 65000;
        else if (dest === 'sydney' || dest === 'melbourne') baseFare = 85000;
        else if (dest === 'london') baseFare = 72000;
        
        let multiplier = 1.0;
        const selectedClass = document.querySelector('input[name="travel-class"]:checked');
        if (selectedClass) {
            const cls = selectedClass.value;
            if (cls === 'first') multiplier = 4.5;
            else if (cls === 'business') multiplier = 2.5;
            else if (cls === 'premium') multiplier = 1.3;
        }
        
        const passengerCount = parseInt(passengersSelect.value) || 1;
        let calculatedBase = baseFare * multiplier * passengerCount;
        
        let conciergeLevies = 0;
        if (loungeOption && loungeOption.checked) conciergeLevies += 4500 * passengerCount;
        if (baggageOption && baggageOption.checked) conciergeLevies += 2500 * passengerCount;
        if (transferOption && transferOption.checked) conciergeLevies += 6000 * passengerCount;
        
        let discount = 0;
        if (visaBundleOption && visaBundleOption.checked) {
            discount = calculatedBase * 0.15;
        }
        
        let grandTotal = calculatedBase + conciergeLevies - discount;
        
        if (baseVal) baseVal.textContent = '₹' + calculatedBase.toLocaleString('en-IN');
        if (conciergeVal) conciergeVal.textContent = '₹' + conciergeLevies.toLocaleString('en-IN');
        
        if (discountVal && discountRow) {
            if (discount > 0) {
                discountVal.textContent = '-₹' + discount.toLocaleString('en-IN');
                discountRow.style.display = 'flex';
            } else {
                discountRow.style.display = 'none';
            }
        }
        
        if (totalVal) totalVal.textContent = '₹' + grandTotal.toLocaleString('en-IN');
        
        return {
            calculatedBase,
            conciergeLevies,
            discount,
            grandTotal
        };
    }

    [departureSelect, destinationSelect, passengersSelect, loungeOption, baggageOption, transferOption, visaBundleOption].forEach(el => {
        if (el) el.addEventListener('change', calculateLivePrice);
    });
    
    classRadios.forEach(radio => {
        radio.addEventListener('change', calculateLivePrice);
    });

    calculateLivePrice();

    travelForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const passengerName = document.getElementById('travel-name').value.trim();
        const departureCity = departureSelect.options[departureSelect.selectedIndex].text;
        const destinationCity = destinationSelect.options[destinationSelect.selectedIndex].text;
        const travelDate = document.getElementById('travel-date').value || '2026-06-15';
        
        const selectedClassEl = document.querySelector('input[name="travel-class"]:checked');
        const className = selectedClassEl ? selectedClassEl.nextElementSibling.querySelector('.flight-class-name').textContent : 'Premium Cabin';
        
        if (bookingReceipt) bookingReceipt.style.display = 'none';
        
        if (apiLoader) {
            apiLoader.style.display = 'block';
            apiLoader.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        const loadingSteps = [
            "Initiating Handshake with Akbar Travels API Gateway...",
            "Checking real-time seating matrices and inventory blocks...",
            "Syncing visa eligibility parameters with Vihara Database...",
            "Applying exclusive partner discounts...",
            "Securing high-altitude ticketing reservation lock..."
        ];
        
        let step = 0;
        if (apiLoaderText) apiLoaderText.textContent = loadingSteps[0];
        
        const interval = setInterval(() => {
            step++;
            if (step < loadingSteps.length) {
                if (apiLoaderText) apiLoaderText.textContent = loadingSteps[step];
            } else {
                clearInterval(interval);
                completeBooking();
            }
        }, 350);

        function completeBooking() {
            if (apiLoader) apiLoader.style.display = 'none';
            const prices = calculateLivePrice();
            const randomCode = 'AKB-' + Math.floor(Math.random() * 90000 + 10000) + '-' + String.fromCharCode(65 + Math.floor(Math.random() * 26)) + String.fromCharCode(65 + Math.floor(Math.random() * 26));
            
            if (recName) recName.textContent = passengerName || 'Valued Advisory Client';
            if (recRoute) recRoute.textContent = `${departureCity} to ${destinationCity}`;
            if (recClass) recClass.textContent = className;
            if (recDate) recDate.textContent = new Date(travelDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            if (recRef) recRef.textContent = randomCode;
            
            if (recBase) recBase.textContent = '₹' + prices.calculatedBase.toLocaleString('en-IN');
            if (recConcierge) recConcierge.textContent = '₹' + prices.conciergeLevies.toLocaleString('en-IN');
            
            if (recDiscount && recDiscountRow) {
                if (prices.discount > 0) {
                    recDiscount.textContent = '-₹' + prices.discount.toLocaleString('en-IN');
                    recDiscountRow.style.display = 'flex';
                } else {
                    recDiscountRow.style.display = 'none';
                }
            }
            if (recTotal) recTotal.textContent = '₹' + prices.grandTotal.toLocaleString('en-IN');
            
            if (bookingReceipt) {
                bookingReceipt.style.display = 'block';
                bookingReceipt.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                if (window.gsap) {
                    window.gsap.fromTo(bookingReceipt, 
                        { opacity: 0, y: 30 }, 
                        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
                    );
                }
            }
        }
    });
}

/* === PRODUCT PAGE LOGIC === */
document.addEventListener('DOMContentLoaded', () => {
    // Main Visa Type Tabs
    const typeTabs = document.querySelectorAll('.visa-type-tab');
    const typeContents = document.querySelectorAll('.visa-type-content');
    
    if(typeTabs.length > 0) {
        typeTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active from all
                typeTabs.forEach(t => t.classList.remove('active'));
                typeContents.forEach(c => c.style.display = 'none');
                
                // Add active to clicked
                tab.classList.add('active');
                const targetId = tab.getAttribute('data-target');
                const targetContent = document.getElementById(targetId);
                if(targetContent) {
                    targetContent.style.display = 'block';
                }
            });
        });
    }

    // Sub Tabs (Overview, Benefits, etc)
    const subTabs = document.querySelectorAll('.product-sub-tab');
    const subContents = document.querySelectorAll('.product-sub-content');
    
    if(subTabs.length > 0) {
        subTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Get parent container to isolate tab groups per visa type
                const parentContainer = tab.closest('.visa-type-content');
                if(!parentContainer) return;

                const siblingTabs = parentContainer.querySelectorAll('.product-sub-tab');
                const siblingContents = parentContainer.querySelectorAll('.product-sub-content');

                siblingTabs.forEach(t => t.classList.remove('active'));
                siblingContents.forEach(c => c.style.display = 'none');

                tab.classList.add('active');
                const targetId = tab.getAttribute('data-target');
                const targetContent = document.getElementById(targetId);
                if(targetContent) {
                    targetContent.style.display = 'block';
                }
            });
        });
    }
});
