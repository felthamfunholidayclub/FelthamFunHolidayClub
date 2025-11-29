// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a nav link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Form Submission Handler
const inquiryForm = document.getElementById('inquiryForm');
const submitBtn = document.querySelector('.submit-btn');

if (inquiryForm && submitBtn) {
    inquiryForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Change button state to show loading
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
    
    // Collect form data
    const formData = new FormData(inquiryForm);
    const inquiryData = Object.fromEntries(formData);
    
    try {
        // For GitHub Pages deployment, we'll use a form service like Formspree
        // You'll need to replace this URL with your actual form endpoint
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(inquiryData)
        });
        
        if (response.ok) {
            showSuccessMessage();
            inquiryForm.reset();
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        // Fallback: Download inquiry as CSV file for manual processing
        downloadInquiryAsCSV(inquiryData);
        showFallbackMessage();
    }
    
    // Reset button state
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
});
}

// Success message display
function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div style="background: #d4edda; color: #155724; padding: 1rem; border-radius: 8px; margin: 1rem 0; border: 1px solid #c3e6cb;">
            <i class="fas fa-check-circle"></i> Thank you! Your inquiry has been submitted successfully. We'll get back to you soon!
        </div>
    `;
    
    inquiryForm.insertBefore(successDiv, inquiryForm.firstChild);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
    
    // Scroll to success message
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Fallback message for CSV download
function showFallbackMessage() {
    const fallbackDiv = document.createElement('div');
    fallbackDiv.className = 'fallback-message';
    fallbackDiv.innerHTML = `
        <div style="background: #fff3cd; color: #856404; padding: 1rem; border-radius: 8px; margin: 1rem 0; border: 1px solid #ffeaa7;">
            <i class="fas fa-download"></i> Your inquiry has been downloaded as a file. Please email it to info@felthamfunholidayclub.uk
        </div>
    `;
    
    inquiryForm.insertBefore(fallbackDiv, inquiryForm.firstChild);
    
    // Remove fallback message after 8 seconds
    setTimeout(() => {
        fallbackDiv.remove();
    }, 8000);
    
    // Scroll to fallback message
    fallbackDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Download inquiry as CSV file
function downloadInquiryAsCSV(data) {
    const csvContent = [
        'Field,Value',
        `Parent/Guardian Name,${data.parentName}`,
        `Email,${data.email}`,
        `Phone,${data.phone}`,
        `Child's Name,${data.childName}`,
        `Child's Age,${data.childAge}`,
        `Inquiry Type,${data.inquiryType}`,
        `Message,"${data.message.replace(/"/g, '""')}"`, // Escape quotes in CSV
        `Timestamp,${data.timestamp}`,
        `Source,${data.source}`
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inquiry_${data.parentName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = '#fff';
        navbar.style.backdropFilter = 'none';
    }
});

// Animation on scroll for elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.event-card, .contact-item, .vision, .mission');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Social media links - you can update these with your actual social media URLs
document.addEventListener('DOMContentLoaded', () => {
    const socialLinks = {
        facebook: '#', // Replace with your Facebook page URL
        instagram: '#', // Replace with your Instagram URL
        twitter: '#', // Replace with your Twitter URL
        youtube: '#', // Replace with your YouTube channel URL
        whatsapp: '#' // Replace with your WhatsApp business number
    };
    
    // Update social media links
    Object.keys(socialLinks).forEach(platform => {
        const link = document.querySelector(`.social-link.${platform}`);
        if (link && socialLinks[platform] !== '#') {
            link.href = socialLinks[platform];
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
        }
    });
});

// Form validation enhancement
function validateForm() {
    if (!inquiryForm) return true;
    
    const requiredFields = inquiryForm.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#dc3545';
            isValid = false;
        } else {
            field.style.borderColor = '#e9ecef';
        }
    });
    
    // Email validation
    const emailField = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailField.value && !emailRegex.test(emailField.value)) {
        emailField.style.borderColor = '#dc3545';
        isValid = false;
    }
    
    // Phone validation (basic UK format)
    const phoneField = document.getElementById('phone');
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (phoneField.value && !phoneRegex.test(phoneField.value)) {
        phoneField.style.borderColor = '#dc3545';
        isValid = false;
    }
    
    return isValid;
}

// Add real-time validation
if (inquiryForm) {
    inquiryForm.addEventListener('input', (e) => {
        const field = e.target;
        if (field.hasAttribute('required')) {
            if (field.value.trim()) {
                field.style.borderColor = '#28a745';
            } else {
                field.style.borderColor = '#e9ecef';
            }
        }
    });
}

// Gallery Carousel Functionality
let currentSlide = 0;
let totalSlides = 0;
let autoPlayInterval;
let isAutoPlaying = true;

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeCarousel();
});

function initializeCarousel() {
    const carouselTrack = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicatorsContainer = document.getElementById('carouselIndicators');
    const thumbnailItems = document.querySelectorAll('.thumbnail-item');
    
    if (!carouselTrack) return;
    
    const slides = carouselTrack.querySelectorAll('.carousel-slide');
    totalSlides = slides.length;
    
    // Create indicators
    createIndicators(indicatorsContainer, totalSlides);
    
    // Event listeners for navigation buttons
    if (prevBtn) prevBtn.addEventListener('click', () => {
        pauseAutoPlay();
        previousSlide();
        resumeAutoPlayAfterDelay();
    });
    
    if (nextBtn) nextBtn.addEventListener('click', () => {
        pauseAutoPlay();
        nextSlide();
        resumeAutoPlayAfterDelay();
    });
    
    // Event listeners for indicators
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            pauseAutoPlay();
            goToSlide(index);
            resumeAutoPlayAfterDelay();
        });
    });
    
    // Event listeners for thumbnail items
    thumbnailItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            pauseAutoPlay();
            goToSlide(index);
            resumeAutoPlayAfterDelay();
            updateThumbnails(index);
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            pauseAutoPlay();
            previousSlide();
            resumeAutoPlayAfterDelay();
        } else if (e.key === 'ArrowRight') {
            pauseAutoPlay();
            nextSlide();
            resumeAutoPlayAfterDelay();
        }
    });
    
    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    carouselTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    carouselTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            pauseAutoPlay();
            if (diff > 0) {
                nextSlide();
            } else {
                previousSlide();
            }
            resumeAutoPlayAfterDelay();
        }
    }
    
    // Pause auto-play when hovering over carousel
    const carousel = document.querySelector('.gallery-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', pauseAutoPlay);
        carousel.addEventListener('mouseleave', resumeAutoPlay);
    }
    
    // Start auto-play
    startAutoPlay();
    updateCarousel();
}

function createIndicators(container, count) {
    if (!container) return;
    
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const indicator = document.createElement('div');
        indicator.className = 'indicator';
        if (i === 0) indicator.classList.add('active');
        container.appendChild(indicator);
    }
}

function updateCarousel() {
    const carouselTrack = document.getElementById('carouselTrack');
    const indicators = document.querySelectorAll('.indicator');
    
    if (!carouselTrack) return;
    
    // Update slide position
    const translateX = -currentSlide * 100;
    carouselTrack.style.transform = `translateX(${translateX}%)`;
    
    // Update indicators
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
    
    // Update thumbnails
    updateThumbnails(currentSlide);
}

function updateThumbnails(activeIndex) {
    const thumbnailItems = document.querySelectorAll('.thumbnail-item');
    thumbnailItems.forEach((item, index) => {
        item.classList.toggle('active', index === activeIndex);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
}

function previousSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

function startAutoPlay() {
    if (isAutoPlaying && totalSlides > 1) {
        autoPlayInterval = setInterval(() => {
            nextSlide();
        }, 5000); // Change slide every 5 seconds
    }
}

function pauseAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
}

function resumeAutoPlay() {
    if (isAutoPlaying && !autoPlayInterval) {
        startAutoPlay();
    }
}

function resumeAutoPlayAfterDelay() {
    setTimeout(() => {
        resumeAutoPlay();
    }, 3000); // Resume after 3 seconds of inactivity
}

// Gallery image loading optimization
function optimizeGalleryImages() {
    const galleryImages = document.querySelectorAll('.gallery-image');
    
    galleryImages.forEach((img, index) => {
        // Lazy load images that are not in the first few slides
        if (index > 2) {
            img.loading = 'lazy';
        }
        
        // Add error handling
        img.addEventListener('error', () => {
            img.style.display = 'none';
            console.warn(`Failed to load gallery image: ${img.src}`);
        });
        
        // Add load success handling
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
        
        // Images are now visible by default - removed opacity: 0 setting
    });
}

// Initialize image optimization when DOM loads
document.addEventListener('DOMContentLoaded', optimizeGalleryImages);

// Premises Gallery Lightbox Functionality
document.addEventListener('DOMContentLoaded', () => {
    initializePremisesGallery();
});

function initializePremisesGallery() {
    const premisesItems = document.querySelectorAll('.premises-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    
    if (!lightbox) return;
    
    let currentImageIndex = 0;
    const images = Array.from(premisesItems).map(item => ({
        src: item.getAttribute('data-image'),
        caption: item.getAttribute('data-caption')
    }));
    
    // Open lightbox when clicking on premises item
    premisesItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentImageIndex = index;
            openLightbox();
        });
    });
    
    // Close lightbox
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Navigate lightbox
    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        showPreviousImage();
    });
    
    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        showNextImage();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            showPreviousImage();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        }
    });
    
    function openLightbox() {
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateLightboxImage();
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function showPreviousImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateLightboxImage();
    }
    
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateLightboxImage();
    }
    
    function updateLightboxImage() {
        const currentImage = images[currentImageIndex];
        lightboxImage.src = currentImage.src;
        lightboxCaption.textContent = currentImage.caption;
    }
}

// Add scroll reveal animation for premises items
document.addEventListener('DOMContentLoaded', () => {
    const premisesObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.premises-item').forEach(item => {
        item.style.animationPlayState = 'paused';
        premisesObserver.observe(item);
    });
});