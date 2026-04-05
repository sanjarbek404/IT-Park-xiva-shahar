// Modern real-time clock for hero section
document.addEventListener('DOMContentLoaded', function() {
    const clockEl = document.getElementById('hero-clock');
    if (!clockEl) return;
    function pad(n) { return n < 10 ? '0' + n : n; }
    function updateClock() {
        const now = new Date();
        const time = `<span class="clock-time">${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}</span>`;
        const date = `<span class="clock-date">${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} (${['Yak','Dush','Sesh','Chor','Pay','Jum','Shan'][now.getDay()]})</span>`;
        clockEl.innerHTML = time + date;
    }
    updateClock();
    setInterval(updateClock, 1000);
});
// Promo section typing effect
document.addEventListener('DOMContentLoaded', function() {
    const promoTypedText = document.getElementById('promo-typed-text');
    const promoTypedCursor = document.getElementById('promo-typed-cursor');
    const promoTypedStatic = document.getElementById('promo-typed-static');
    if (promoTypedText && promoTypedCursor && promoTypedStatic) {
        const promoPhrases = [
            'Biz bilan zamonaviy texnologiyalar, innovatsion loyihalar va real amaliyotga asoslangan o‘quv dasturlarini kashf eting.',
            'Har bir o‘quvchi uchun shaxsiy rivojlanish yo‘li va zamonaviy kasbga yo‘llanma!'
        ];
        let promoPhraseIndex = 0;
        let promoCharIndex = 0;
        let promoIsDeleting = false;
        let promoTypingSpeed = 32;
        let promoPause = 1200;
        function typePromo() {
            const currentPhrase = promoPhrases[promoPhraseIndex];
            if (!promoIsDeleting) {
                promoTypedText.textContent = currentPhrase.substring(0, promoCharIndex + 1);
                promoCharIndex++;
                if (promoCharIndex === currentPhrase.length) {
                    promoIsDeleting = true;
                    setTimeout(typePromo, promoPause);
                } else {
                    setTimeout(typePromo, promoTypingSpeed);
                }
            } else {
                promoTypedText.textContent = currentPhrase.substring(0, promoCharIndex - 1);
                promoCharIndex--;
                if (promoCharIndex === 0) {
                    promoIsDeleting = false;
                    promoPhraseIndex = (promoPhraseIndex + 1) % promoPhrases.length;
                    setTimeout(typePromo, 600);
                } else {
                    setTimeout(typePromo, 18);
                }
            }
        }
        // Optionally, you can set a static intro text:
        promoTypedStatic.textContent = '';
        typePromo();
        setInterval(() => {
            promoTypedCursor.style.opacity = promoTypedCursor.style.opacity === '0' ? '1' : '0';
        }, 480);
    }
});
// README: Xiva  Xiva IT-PARK Test System
// 
// This script implements a comprehensive test system with the following features:
// - IndexedDB storage for 150 questions per subject (HTML, CSS, JavaScript)
// - Tab/section-swit
// DOM Elements
const subjectButtons = document.querySelectorAll('.subject-btn');
const startTestBtn = document.getElementById('startTestBtn');
const testInterface = document.getElementById('testInterface');
const testResults = document.getElementById('testResults');
const subjectName = document.getElementById('subjectName');
const timeRemaining = document.getElementById('timeRemaining');
const questionProgress = document.getElementById('questionProgress');
const progressFill = document.getElementById('progressFill');
const questionText = document.getElementById('questionText');
const answerOptions = document.getElementById('answerOptions');
const prevQuestionBtn = document.getElementById('prevQuestionBtn');
const nextQuestionBtn = document.getElementById('nextQuestionBtn');
const submitTestBtn = document.getElementById('submitTestBtn');
const exitTestBtn = document.getElementById('exitTestBtn');
const resultsSummary = document.getElementById('resultsSummary');
const resultsDetail = document.getElementById('resultsDetail');
const downloadResultsBtn = document.getElementById('downloadResultsBtn');
const retakeTestBtn = document.getElementById('retakeTestBtn');
const scrollTopBtn = document.getElementById('scrollTop');
const testSection = document.getElementById('test');
const navbar = document.querySelector('header');

// Gallery Elements
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.querySelector('.lightbox-caption');
const closeBtn = document.getElementById('closeLightbox');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Test state variables
let currentSubject = '';
let selectedQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let timeLeft = 1800; // 30 minutes in seconds
let timerInterval = null;
let testActive = false;
let clickCount = 0;
let clickTimer = null;
let lastScrollY = 0;

// Gallery state variables
let currentImageIndex = 0;

// Parallax elements
const parallaxElements = document.querySelectorAll('.parallax-element');

// IndexedDB constants
const DB_NAME = 'Xiva  Xiva IT-PARKDB';
const DB_VERSION = 1;
let db;

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Initialize database
        await initDB();
        
        // Populate questions for all subjects
        const subjects = ['html', 'css', 'javascript'];
        for (const subject of subjects) {
            await populateQuestions(subject);
        }
        
        console.log('Application initialized successfully');
        
        // Check for saved test session
        checkForSavedSession();
        
        // Set up event listeners
        setupEventListeners();
        
        // Set up scroll animations
        setupScrollAnimations();
        
        // Set up parallax effects
        setupParallax();

    // Initialize theme (dark/light) and course card interactions
    initTheme();
    setupCourseCards();
        
    } catch (error) {
        console.error('Error initializing application:', error);
    }
});

// Set up event listeners
function setupEventListeners() {
    // Scroll to top
    window.addEventListener('scroll', () => {
        // Floating navigation bar effect
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
            navbar.classList.add('floating');
        } else {
            navbar.classList.remove('scrolled');
            navbar.classList.remove('floating');
        }
        
        // Hide/show navbar on scroll direction
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }
        lastScrollY = window.scrollY;
        
        // Scroll to top button
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Test section double-click
    testSection.addEventListener('click', handleTestSectionClick);
    
    // Subject selection
    subjectButtons.forEach(button => {
        button.addEventListener('click', () => {
            selectSubject(button);
        });
        
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectSubject(button);
            }
        });
    });
    
    // Start test
    startTestBtn.addEventListener('click', startTest);
    
    // Test navigation
    prevQuestionBtn.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            showQuestion(currentQuestionIndex - 1);
        }
    });
    
    nextQuestionBtn.addEventListener('click', () => {
        if (currentQuestionIndex < selectedQuestions.length - 1) {
            showQuestion(currentQuestionIndex + 1);
        }
    });
    
    // Submit test
    submitTestBtn.addEventListener('click', endTest);
    
    // Exit test
    exitTestBtn.addEventListener('click', () => {
        if (confirm('Testdan chiqishni xohlaysizmi?')) {
            exitTest();
        }
    });
    
    // Download results
    downloadResultsBtn.addEventListener('click', downloadResults);
    
    // Retake test
    retakeTestBtn.addEventListener('click', retakeTest);
    
    // Hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
        hamburger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMobileMenu();
            }
        });
    }
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    }));
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (hamburger && navMenu && 
            !hamburger.contains(e.target) && 
            !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Xabaringiz uchun rahmat! Tez orada sizga javob beramiz.');
            contactForm.reset();
        });
    }
    
    // Gallery functionality
    setupGallery();
    
    // Statistics counter animation
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stat-number');
                counters.forEach(counter => {
                    const target = parseInt(counter.dataset.target);
                    animateCounter(counter, target);
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe the statistics section
    const statsSection = document.getElementById('statistics');
    if (statsSection) {
        observer.observe(statsSection);
    }
    
    // Keyboard navigation improvements
    document.addEventListener('keydown', (e) => {
        // Escape key to close modals or menus
        if (e.key === 'Escape') {
            // Close mobile menu if open
            if (hamburger && hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
            
            // Close lightbox if open
            if (lightbox.classList.contains('active')) {
                closeLightbox();
            }
        }
        
        // Arrow keys for lightbox navigation
        if (lightbox.classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                showPrevImage();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            }
        }
    });
    
    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isActive = question.classList.contains('active');
            
            // Close all FAQ items
            faqQuestions.forEach(q => {
                q.classList.remove('active');
                q.setAttribute('aria-expanded', 'false');
                q.nextElementSibling.classList.remove('open');
            });
            
            // Open clicked item if it wasn't already open
            if (!isActive) {
                question.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
                answer.classList.add('open');
            }
        });
    });
}

// Handle test section double-click
function handleTestSectionClick() {
    clickCount++;
    
    if (clickCount === 1) {
        clickTimer = setTimeout(() => {
            clickCount = 0;
        }, 300);
    } else if (clickCount === 2) {
        clearTimeout(clickTimer);
        clickCount = 0;
        alert('Testlar tez orada qo\'shiladi!');
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Update aria-expanded attribute
        const isExpanded = hamburger.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isExpanded.toString());
    }
}

// Setup scroll animations with Intersection Observer
function setupScrollAnimations() {
    const animateOnScroll = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    };
    
    const observer = new IntersectionObserver(animateOnScroll, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    // Observe elements that should animate on scroll
    document.querySelectorAll('.about-card, .course-card, .teacher-card, .testimonial-card, .stat-card, .blog-card, .gallery-item, .section-title, .gallery-description, .faq-item, .feature-card, .service-card').forEach(el => {
        observer.observe(el);
    });
}

// Setup parallax effects
function setupParallax() {
    // Check if user prefers rXivaced motion
    const prefersRXivacedMotion = window.matchMedia('(prefers-rXivaced-motion: rXivace)').matches;
    
    if (prefersRXivacedMotion) {
        // Disable parallax for users who prefer rXivaced motion
        document.body.classList.add('rXivace-motion');
        return;
    }
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrollPosition * speed);
            const xPos = (scrollPosition * speed * 0.5);
            element.style.transform = `translate(${xPos}px, ${yPos}px) rotate(${scrollPosition * speed * 0.05}deg)`;
        });
    });
}

// Setup gallery functionality
function setupGallery() {
    // Add click event to each gallery item
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            openLightbox(index);
        });
    });
    
    // Lightbox controls
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);
    
    // Close lightbox when clicking on the background
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

// Open lightbox with specific image
function openLightbox(index) {
    currentImageIndex = index;
    const img = galleryItems[index].querySelector('img');
    const caption = galleryItems[index].querySelector('figcaption').textContent;
    
    lightboxImg.src = img.src;
    lightboxCaption.textContent = caption;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
}

// Close lightbox
function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Re-enable scrolling
}

// Show previous image in lightbox
function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
    updateLightbox();
}

// Show next image in lightbox
function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
    updateLightbox();
}

// Update lightbox with current image
function updateLightbox() {
    const img = galleryItems[currentImageIndex].querySelector('img');
    const caption = galleryItems[currentImageIndex].querySelector('figcaption').textContent;
    
    lightboxImg.src = img.src;
    lightboxCaption.textContent = caption;
}

// Observe and animate helper function
function observeAndAnimate(selector, animationClass) {
    const elements = document.querySelectorAll(selector);
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add(animationClass);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(el => observer.observe(el));
}

// IndexedDB setup
function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => {
            console.error('Database failed to open');
            reject('Database failed to open');
        };
        
        request.onsuccess = () => {
            db = request.result;
            console.log('Database opened successfully');
            resolve();
        };
        
        request.onupgradeneeded = (e) => {
            db = e.target.result;
            
            // Create object store for each subject if they don't exist
            const subjects = ['html', 'css', 'javascript'];
            subjects.forEach(subject => {
                if (!db.objectStoreNames.contains(subject)) {
                    const objectStore = db.createObjectStore(subject, { keyPath: 'id' });
                    objectStore.createIndex('question', 'question', { unique: false });
                }
            });
            
            console.log('Database setup completed');
        };
    });
}

// Populate database with sample questions if empty
async function populateQuestions(subject) {
    const transaction = db.transaction([subject], 'readonly');
    const objectStore = transaction.objectStore(subject);
    const countRequest = objectStore.count();
    
    return new Promise((resolve) => {
        countRequest.onsuccess = async () => {
            if (countRequest.result < 150) {
                // Need to populate with sample questions
                await addSampleQuestions(subject);
            }
            resolve();
        };
    });
}

// Generate sample questions for a subject
function generateSampleQuestions(subject, count) {
    const questions = [];
    
    for (let i = 1; i <= count; i++) {
        const questionId = `${subject}_${i}`;
        const questionText = `${subject.toUpperCase()} fanidan ${i}-savol. Bu savolning to'g'ri javobi qaysi?`;
        const options = [
            `Variant A ${i}`,
            `Variant B ${i}`,
            `Variant C ${i}`,
            `Variant D ${i}`
        ];
        const correctAnswer = Math.floor(Math.random() * 4); // Random correct answer index
        
        questions.push({
            id: questionId,
            question: questionText,
            options: options,
            correctAnswer: correctAnswer
        });
    }
    
    return questions;
}

// Add sample questions to database
function addSampleQuestions(subject) {
    return new Promise((resolve) => {
        const questions = generateSampleQuestions(subject, 150);
        const transaction = db.transaction([subject], 'readwrite');
        const objectStore = transaction.objectStore(subject);
        
        questions.forEach(question => {
            objectStore.add(question);
        });
        
        transaction.oncomplete = () => {
            console.log(`Added ${questions.length} sample questions for ${subject}`);
            resolve();
        };
        
        transaction.onerror = () => {
            console.error(`Error adding sample questions for ${subject}`);
            resolve();
        };
    });
}

// Get random questions from database
function getRandomQuestions(subject, count) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([subject], 'readonly');
        const objectStore = transaction.objectStore(subject);
        const allQuestions = [];
        
        objectStore.openCursor().onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                allQuestions.push(cursor.value);
                cursor.continue();
            } else {
                // Shuffle array and select random questions
                const shuffled = allQuestions.sort(() => 0.5 - Math.random());
                const selected = shuffled.slice(0, count);
                resolve(selected);
            }
        };
        
        transaction.onerror = () => {
            reject('Error retrieving questions');
        };
    });
}

// Subject selection with keyboard accessibility
function selectSubject(button) {
    // Remove active class from all buttons
    subjectButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
    });
    
    // Add active class to clicked button
    button.classList.add('active');
    button.setAttribute('aria-pressed', 'true');
    
    // Set current subject
    currentSubject = button.dataset.subject;
    
    // Enable start test button
    startTestBtn.disabled = false;
    startTestBtn.setAttribute('aria-disabled', 'false');
}

// Start test
async function startTest() {
    if (!currentSubject) return;
    
    try {
        // Show test interface
        testInterface.classList.remove('hidden');
        document.querySelector('.test-menu').classList.add('hidden');
        
        // Set subject name
        subjectName.textContent = currentSubject.toUpperCase();
        
        // Get random questions
        selectedQuestions = await getRandomQuestions(currentSubject, 30);
        
        // Initialize user answers array
        userAnswers = new Array(30).fill(null);
        
        // Reset test state
        currentQuestionIndex = 0;
        timeLeft = 1800; // 30 minutes
        testActive = true;
        
        // Start timer
        startTimer();
        
        // Show first question
        showQuestion(currentQuestionIndex);
        
        // Add event listeners for tab visibility detection
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);
        window.addEventListener('beforeunload', handleBeforeUnload);
        
        // Update ARIA attributes
        updateAccessibilityAttributes();
        
    } catch (error) {
        console.error('Error starting test:', error);
        alert('Testni boshlashda xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.');
    }
}

// Timer functions
function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    updateTimer(); // Initial display
}

function updateTimer() {
    if (!testActive) return;
    
    timeLeft--;
    
    // Update display
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeRemaining.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Save time to localStorage
    localStorage.setItem('Xiva  Xiva IT-PARK_timeLeft', timeLeft.toString());
    
    // Check if time is up
    if (timeLeft <= 0) {
        endTest();
    }
}

// Show question
function showQuestion(index) {
    if (index < 0 || index >= selectedQuestions.length) return;
    
    const question = selectedQuestions[index];
    
    // Update question text
    questionText.textContent = question.question;
    
    // Clear previous options
    answerOptions.innerHTML = '';
    
    // Add answer options
    question.options.forEach((option, i) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'answer-option';
        optionElement.setAttribute('role', 'radio');
        optionElement.setAttribute('tabindex', '0');
        optionElement.setAttribute('aria-checked', userAnswers[index] === i ? 'true' : 'false');
        
        if (userAnswers[index] === i) {
            optionElement.classList.add('selected');
            optionElement.setAttribute('aria-checked', 'true');
        }
        
        optionElement.textContent = option;
        
        // Add click event
        optionElement.addEventListener('click', () => selectAnswer(i));
        
        // Add keyboard event
        optionElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectAnswer(i);
            }
        });
        
        answerOptions.appendChild(optionElement);
    });
    
    // Update progress
    currentQuestionIndex = index;
    questionProgress.textContent = `${index + 1}-savol 30 tadan`;
    progressFill.style.width = `${((index + 1) / selectedQuestions.length) * 100}%`;
    progressFill.setAttribute('aria-valuenow', ((index + 1) / selectedQuestions.length) * 100);
    
    // Update navigation buttons
    prevQuestionBtn.disabled = index === 0;
    nextQuestionBtn.disabled = index === selectedQuestions.length - 1;
    
    prevQuestionBtn.setAttribute('aria-disabled', index === 0 ? 'true' : 'false');
    nextQuestionBtn.setAttribute('aria-disabled', index === selectedQuestions.length - 1 ? 'true' : 'false');
    
    // Update accessibility attributes
    updateAccessibilityAttributes();
}

// Select answer
function selectAnswer(optionIndex) {
    // Save answer
    userAnswers[currentQuestionIndex] = optionIndex;
    
    // Save to localStorage
    localStorage.setItem('Xiva  Xiva IT-PARK_userAnswers', JSON.stringify(userAnswers));
    
    // Update UI
    showQuestion(currentQuestionIndex);
}

// Handle visibility change (tab switching)
function handleVisibilityChange() {
    if (testActive && document.hidden) {
        exitTest();
    }
}

// Handle window blur (losing focus)
function handleBlur() {
    if (testActive) {
        exitTest();
    }
}

// Handle window focus (gaining focus)
function handleFocus() {
    // Could be used for additional checks if needed
}

// Handle before unload (closing tab/window)
function handleBeforeUnload(event) {
    if (testActive) {
        event.preventDefault();
        event.returnValue = '';
        exitTest();
        return 'Test chiqish sifatida belgilanadi agar siz tark etsangiz.';
    }
}

// Exit test
function exitTest() {
    testActive = false;
    clearInterval(timerInterval);
    
    // Remove event listeners
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('blur', handleBlur);
    window.removeEventListener('focus', handleFocus);
    window.removeEventListener('beforeunload', handleBeforeUnload);
    
    // Clear localStorage
    localStorage.removeItem('Xiva  Xiva IT-PARK_timeLeft');
    localStorage.removeItem('Xiva  Xiva IT-PARK_userAnswers');
    localStorage.removeItem('Xiva  Xiva IT-PARK_currentSubject');
    localStorage.removeItem('Xiva  Xiva IT-PARK_selectedQuestions');
    localStorage.removeItem('Xiva  Xiva IT-PARK_currentQuestionIndex');
    
    // Hide test interface and show menu
    testInterface.classList.add('hidden');
    testResults.classList.add('hidden');
    document.querySelector('.test-menu').classList.remove('hidden');
    
    // Reset buttons
    subjectButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
    });
    
    startTestBtn.disabled = true;
    startTestBtn.setAttribute('aria-disabled', 'true');
    currentSubject = '';
    
    alert('Testdan chiqildi. Sizning test natijangiz yakunlanmadi.');
}

// End test (time up or submitted)
function endTest() {
    testActive = false;
    clearInterval(timerInterval);
    
    // Remove event listeners
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('blur', handleBlur);
    window.removeEventListener('focus', handleFocus);
    window.removeEventListener('beforeunload', handleBeforeUnload);
    
    // Calculate results
    const results = calculateResults();
    
    // Display results
    displayResults(results);
    
    // Clear localStorage
    localStorage.removeItem('Xiva  Xiva IT-PARK_timeLeft');
    localStorage.removeItem('Xiva  Xiva IT-PARK_userAnswers');
    localStorage.removeItem('Xiva  Xiva IT-PARK_currentSubject');
    localStorage.removeItem('Xiva  Xiva IT-PARK_selectedQuestions');
    localStorage.removeItem('Xiva  Xiva IT-PARK_currentQuestionIndex');
}

// Calculate test results
function calculateResults() {
    let correctCount = 0;
    const detailedResults = [];
    
    selectedQuestions.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        const isCorrect = userAnswer === question.correctAnswer;
        
        if (isCorrect) {
            correctCount++;
        }
        
        detailedResults.push({
            question: question.question,
            userAnswer: userAnswer !== null ? question.options[userAnswer] : 'Javob berilmagan',
            correctAnswer: question.options[question.correctAnswer],
            isCorrect: isCorrect
        });
    });
    
    return {
        score: correctCount,
        total: selectedQuestions.length,
        percentage: Math.round((correctCount / selectedQuestions.length) * 100),
        details: detailedResults
    };
}

// Display results
function displayResults(results) {
    // Hide test interface
    testInterface.classList.add('hidden');
    
    // Show results
    testResults.classList.remove('hidden');
    
    // Update summary
    resultsSummary.innerHTML = `
        <h3>Test yakunlandi</h3>
        <div class="score">${results.score}/${results.total}</div>
        <p>Foiz: ${results.percentage}%</p>
        <p>${results.percentage >= 70 ? 'Tabriklaymiz! Siz testdan o\'tdingiz!' : 'Afsuski, siz testdan o\'tmadingiz. Qayta urinib ko\'ring!'}</p>
    `;
    
    // Update details
    resultsDetail.innerHTML = '';
    results.details.forEach((result, index) => {
        const resultItem = document.createElement('div');
        resultItem.className = `result-item ${result.isCorrect ? 'correct' : 'incorrect'}`;
        resultItem.innerHTML = `
            <div class="result-question">${index + 1}-savol: ${result.question}</div>
            <div class="result-answer">Sizning javobingiz: <span class="${result.isCorrect ? 'correct-answer' : 'incorrect-answer'}">${result.userAnswer}</span></div>
            ${!result.isCorrect ? `<div class="result-answer">To'g'ri javob: <span class="correct-answer">${result.correctAnswer}</span></div>` : ''}
        `;
        resultsDetail.appendChild(resultItem);
    });
    
    // Update accessibility attributes
    updateAccessibilityAttributes();
}

// Download results as PDF
function downloadResults() {
    // Using jsPDF and html2canvas (loaded from CDN in HTML)
    if (typeof html2canvas === 'undefined' || typeof jspdf === 'undefined') {
        alert('PDF kutubxonasi yuklanmagan. Iltimos, qayta urinib ko\'ring.');
        return;
    }
    
    const { jsPDF } = jspdf;
    
    html2canvas(testResults).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
        
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        pdf.save(`Xiva  Xiva IT-PARK_${currentSubject}_test_natijalari.pdf`);
    });
}

// Retake test
function retakeTest() {
    // Hide results and show menu
    testResults.classList.add('hidden');
    document.querySelector('.test-menu').classList.remove('hidden');
    
    // Reset buttons
    subjectButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
    });
    
    startTestBtn.disabled = true;
    startTestBtn.setAttribute('aria-disabled', 'true');
    currentSubject = '';
}

// Update accessibility attributes
function updateAccessibilityAttributes() {
    // Update ARIA attributes for test interface
    if (!testInterface.classList.contains('hidden')) {
        testInterface.setAttribute('aria-hidden', 'false');
        
        // Set focus to first question
        const firstOption = answerOptions.querySelector('.answer-option');
        if (firstOption) {
            firstOption.focus();
        }
    } else {
        testInterface.setAttribute('aria-hidden', 'true');
    }
    
    // Update ARIA attributes for test results
    if (!testResults.classList.contains('hidden')) {
        testResults.setAttribute('aria-hidden', 'false');
    } else {
        testResults.setAttribute('aria-hidden', 'true');
    }
}

// Check for saved test session (in case of accidental refresh)
function checkForSavedSession() {
    const savedTimeLeft = localStorage.getItem('Xiva  Xiva IT-PARK_timeLeft');
    const savXivaserAnswers = localStorage.getItem('Xiva  Xiva IT-PARK_userAnswers');
    const savedSubject = localStorage.getItem('Xiva  Xiva IT-PARK_currentSubject');
    const savedQuestions = localStorage.getItem('Xiva  Xiva IT-PARK_selectedQuestions');
    const savedQuestionIndex = localStorage.getItem('Xiva  Xiva IT-PARK_currentQuestionIndex');
    
    if (savedTimeLeft && savXivaserAnswers && savedSubject) {
        if (confirm('Oldingi test sessiyasini davom ettirishni xohlaysizmi?')) {
            // Restore session
            timeLeft = parseInt(savedTimeLeft);
            userAnswers = JSON.parse(savXivaserAnswers);
            currentSubject = savedSubject;
            
            if (savedQuestions) {
                selectedQuestions = JSON.parse(savedQuestions);
            }
            
            if (savedQuestionIndex) {
                currentQuestionIndex = parseInt(savedQuestionIndex);
            }
            
            // Show test interface
            testInterface.classList.remove('hidden');
            document.querySelector('.test-menu').classList.add('hidden');
            
            // Set subject name
            subjectName.textContent = currentSubject.toUpperCase();
            
            // Start timer
            startTimer();
            
            // Show current question
            showQuestion(currentQuestionIndex);
            
            // Add event listeners
            document.addEventListener('visibilitychange', handleVisibilityChange);
            window.addEventListener('blur', handleBlur);
            window.addEventListener('focus', handleFocus);
            window.addEventListener('beforeunload', handleBeforeUnload);
            
            testActive = true;
            
            // Update accessibility attributes
            updateAccessibilityAttributes();
        } else {
            // Clear saved session
            localStorage.removeItem('Xiva  Xiva IT-PARK_timeLeft');
            localStorage.removeItem('Xiva  Xiva IT-PARK_userAnswers');
            localStorage.removeItem('Xiva  Xiva IT-PARK_currentSubject');
            localStorage.removeItem('Xiva  Xiva IT-PARK_selectedQuestions');
            localStorage.removeItem('Xiva  Xiva IT-PARK_currentQuestionIndex');
        }
    }
}

// Statistics counter animation
function animateCounter(element, target) {
    let count = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        count += increment;
        if (count >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.ceil(count);
        }
    }, 20);
}

/* ------------------ Theme & Course Interactions ------------------ */
function initTheme() {
    const toggle = document.getElementById('darkModeToggle');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const stored = localStorage.getItem('Xiva  Xiva IT-PARK-theme');
    const useDark = stored ? stored === 'dark' : prefersDark;

    applyTheme(useDark);

    if (toggle) {
        toggle.addEventListener('click', () => {
            const isDark = document.documentElement.classList.contains('dark-mode');
            applyTheme(!isDark, true);
        });
    }

    // Watch hero visibility so homepage (hero/header) can stay light while dark-mode applied elsewhere
    const hero = document.getElementById('hero');
    if (hero && 'IntersectionObserver' in window) {
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    document.documentElement.classList.add('on-hero');
                } else {
                    document.documentElement.classList.remove('on-hero');
                }
            });
        }, { threshold: 0.6 });
        heroObserver.observe(hero);
    }
}

function applyTheme(enableDark, save = false) {
    const toggle = document.getElementById('darkModeToggle');
    if (enableDark) {
        document.documentElement.classList.add('dark-mode');
        if (toggle) {
            toggle.classList.add('active');
            toggle.setAttribute('aria-pressed', 'true');
            toggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
        if (save) localStorage.setItem('Xiva  Xiva IT-PARK-theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark-mode');
        if (toggle) {
            toggle.classList.remove('active');
            toggle.setAttribute('aria-pressed', 'false');
            toggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
        if (save) localStorage.setItem('Xiva  Xiva IT-PARK-theme', 'light');
    }
}

function setupCourseCards() {
    const expandButtons = document.querySelectorAll('.expand-course');

    expandButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const expanded = btn.getAttribute('aria-expanded') === 'true';
            const detailsId = btn.getAttribute('aria-controls');
            const details = document.getElementById(detailsId);
            if (!details) return;

            if (expanded) {
                details.hidden = true;
                btn.setAttribute('aria-expanded', 'false');
                btn.querySelector('i').classList.remove('fa-chevron-up');
                btn.querySelector('i').classList.add('fa-chevron-down');
            } else {
                details.hidden = false;
                btn.setAttribute('aria-expanded', 'true');
                btn.querySelector('i').classList.remove('fa-chevron-down');
                btn.querySelector('i').classList.add('fa-chevron-up');
            }
        });
    });

    // Enroll and learn-more buttons
    document.querySelectorAll('.enroll-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.textContent = 'Ro\'yhatdan o\'tildi';
            btn.disabled = true;
            btn.style.opacity = 0.9;
            setTimeout(() => alert('Rahmat! Siz kursga muvaffaqiyatli yozildingiz. Biz siz bilan bog`lanamiz.'), 300);
        });
    });

    document.querySelectorAll('.learn-more').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.course-card');
            if (!card) return;
            const headerBtn = card.querySelector('.expand-course');
            if (headerBtn && headerBtn.getAttribute('aria-expanded') === 'false') {
                headerBtn.click();
            }
            // Could open a modal or navigate to course page
        });
    });
}

/* ----------------------------------------------------------------- */