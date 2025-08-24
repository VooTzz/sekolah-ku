// SMA Negeri 1 Unggulan - Main JavaScript File
// =============================================

// Configuration
const CONFIG = {
    SCHOOL_EMAIL: 'info@smanegeri1.sch.id',
    WHATSAPP_NUMBER: '628123456789',
    FORMSUBMIT_URL: 'https://formsubmit.co/ajax/',
    GOOGLE_MAPS_LINK: 'https://maps.google.com/?q=SMA+Negeri+1+Unggulan+Jakarta'
};

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('SMA Negeri 1 Website Initialized');
    
    initializeMobileMenu();
    initializeContactForm();
    initializeRegistrationForm();
    initializeSmoothScrolling();
    initializeGoogleMaps();
    initializeWhatsAppButtons();
});

// Mobile Menu Functionality
function initializeMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const closeMenuButton = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.add('open');
            document.body.style.overflow = 'hidden';
        });

        if (closeMenuButton) {
            closeMenuButton.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                document.body.style.overflow = 'auto';
            });
        }

        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                document.body.style.overflow = 'auto';
            });
        });
    }
}

// Contact Form Handling
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactFormSubmission(this);
        });
    }
}

// Registration Form Handling
function initializeRegistrationForm() {
    const registrationForm = document.getElementById('registration-form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegistrationFormSubmission(this);
        });
    }
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Google Maps Integration
function initializeGoogleMaps() {
    const mapLinks = document.querySelectorAll('[data-map-link]');
    mapLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            window.open(CONFIG.GOOGLE_MAPS_LINK, '_blank');
        });
    });
}

// WhatsApp Buttons
function initializeWhatsAppButtons() {
    const whatsappButtons = document.querySelectorAll('[data-whatsapp]');
    whatsappButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const message = this.getAttribute('data-message') || 'Halo SMA Negeri 1, saya ingin bertanya tentang informasi sekolah.';
            const encodedMessage = encodeURIComponent(message);
            window.open(`https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
        });
    });
}

// Handle Contact Form Submission
function handleContactFormSubmission(form) {
    const name = form.querySelector('input[name="name"]')?.value || '';
    const email = form.querySelector('input[name="email"]')?.value || '';
    const phone = form.querySelector('input[name="phone"]')?.value || '';
    const subject = form.querySelector('select[name="subject"]')?.value || '';
    const message = form.querySelector('textarea[name="message"]')?.value || '';

    if (!validateContactForm(name, email, phone, subject, message)) {
        return;
    }

    const whatsappMessage = `Halo SMA Negeri 1,\n\nSaya ${name} ingin bertanya tentang:\n\nSubjek: ${getSubjectText(subject)}\nPesan: ${message}\n\nEmail: ${email}\nTelepon: ${phone}`;
    const encodedMessage = encodeURIComponent(whatsappMessage);
    
    sendEmailNotification(
        'Kontak dari Website - ' + getSubjectText(subject),
        createContactEmailBody(name, email, phone, subject, message),
        email
    );

    window.open(`https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
    
    showNotification('Pesan berhasil dikirim! Kami akan menghubungi Anda segera.', 'success');
    
    form.reset();
}

// Handle Registration Form Submission
function handleRegistrationFormSubmission(form) {
    const formData = new FormData(form);
    const studentData = {
        nama_lengkap: formData.get('nama_lengkap'),
        nama_panggilan: formData.get('nama_panggilan'),
        tempat_lahir: formData.get('tempat_lahir'),
        tanggal_lahir: formData.get('tanggal_lahir'),
        jenis_kelamin: formData.get('jenis_kelamin'),
        agama: formData.get('agama'),
        alamat: formData.get('alamat'),
        telepon: formData.get('telepon'),
        email: formData.get('email'),
        asal_sekolah: formData.get('asal_sekolah'),
        nama_orangtua: formData.get('nama_orangtua'),
        pekerjaan_orangtua: formData.get('pekerjaan_orangtua'),
        telepon_orangtua: formData.get('telepon_orangtua'),
        jurusan_pilihan: formData.get('jurusan_pilihan')
    };

    if (!validateRegistrationForm(studentData)) {
        return;
    }

    sendEmailNotification(
        'Pendaftaran Siswa Baru - ' + studentData.nama_lengkap,
        createRegistrationEmailBody(studentData),
        studentData.email
    );

    showNotification('Pendaftaran berhasil dikirim! Kami akan menghubungi Anda untuk proses selanjutnya.', 'success');
    
    form.reset();
    
    setTimeout(() => {
        window.location.href = 'terimakasih.html';
    }, 3000);
}

// Form Validations
function validateContactForm(name, email, phone, subject, message) {
    if (!name || !email || !phone || !subject || !message) {
        showNotification('Harap lengkapi semua field yang wajib diisi.', 'error');
        return false;
    }

    if (!isValidEmail(email)) {
        showNotification('Format email tidak valid.', 'error');
        return false;
    }

    if (!isValidPhone(phone)) {
        showNotification('Format nomor telepon tidak valid.', 'error');
        return false;
    }

    return true;
}

function validateRegistrationForm(data) {
    const requiredFields = [
        'nama_lengkap', 'tempat_lahir', 'tanggal_lahir', 
        'jenis_kelamin', 'alamat', 'telepon', 'email',
        'asal_sekolah', 'nama_orangtua', 'telepon_orangtua',
        'jurusan_pilihan'
    ];

    for (const field of requiredFields) {
        if (!data[field]) {
            showNotification(`Field ${field.replace(/_/g, ' ')} harus diisi.`, 'error');
            return false;
        }
    }

    if (!isValidEmail(data.email)) {
        showNotification('Format email tidak valid.', 'error');
        return false;
    }

    if (!isValidPhone(data.telepon)) {
        showNotification('Format nomor telepon siswa tidak valid.', 'error');
        return false;
    }

    if (!isValidPhone(data.telepon_orangtua)) {
        showNotification('Format nomor telepon orang tua tidak valid.', 'error');
        return false;
    }

    return true;
}

// Utility Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[0-9]{10,13}$/;
    return phoneRegex.test(phone.replace(/[^0-9]/g, ''));
}

function getSubjectText(subjectValue) {
    const subjects = {
        'pendaftaran': 'Informasi Pendaftaran',
        'akademik': 'Informasi Akademik',
        'prestasi': 'Informasi Prestasi',
        'organisasi': 'Informasi Organisasi',
        'fasilitas': 'Informasi Fasilitas',
        'lainnya': 'Lainnya'
    };
    return subjects[subjectValue] || subjectValue;
}

// Email Content Creators
function createContactEmailBody(name, email, phone, subject, message) {
    return `
        KONTAK DARI WEBSITE SMA NEGERI 1 UNGGULAN
        ========================================
        
        Informasi Pengirim:
        ------------------
        Nama: ${name}
        Email: ${email}
        Telepon: ${phone}
        Subjek: ${getSubjectText(subject)}
        
        Pesan:
        ------
        ${message}
        
        Timestamp: ${new Date().toLocaleString('id-ID')}
        IP Address: ${getClientIP()}
    `;
}

function createRegistrationEmailBody(data) {
    return `
        PENDAFTARAN SISWA BARU - SMA NEGERI 1 UNGGULAN
        ==============================================
        
        DATA CALON SISWA:
        -----------------
        Nama Lengkap: ${data.nama_lengkap}
        Nama Panggilan: ${data.nama_panggilan || '-'}
        Tempat/Tanggal Lahir: ${data.tempat_lahir}, ${data.tanggal_lahir}
        Jenis Kelamin: ${data.jenis_kelamin}
        Agama: ${data.agama}
        Alamat: ${data.alamat}
        Telepon: ${data.telepon}
        Email: ${data.email}
        
        DATA SEKOLAH ASAL:
        ------------------
        Asal Sekolah: ${data.asal_sekolah}
        
        DATA ORANG TUA:
        ---------------
        Nama Orang Tua: ${data.nama_orangtua}
        Pekerjaan Orang Tua: ${data.pekerjaan_orangtua || '-'}
        Telepon Orang Tua: ${data.telepon_orangtua}
        
        PILIHAN JURUSAN:
        ----------------
        Jurusan: ${data.jurusan_pilihan}
        
        INFORMASI TEKNIS:
        -----------------
        Timestamp: ${new Date().toLocaleString('id-ID')}
        IP Address: ${getClientIP()}
        User Agent: ${navigator.userAgent}
    `;
}

// Get Client IP (simplified)
function getClientIP() {
    return 'Cannot determine IP (client-side)';
}

// Notification System
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.custom-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `custom-notification fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full ${
        type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
        type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
        'bg-blue-100 text-blue-800 border border-blue-200'
    }`;
    
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${
                type === 'success' ? 'fa-check-circle' :
                type === 'error' ? 'fa-exclamation-circle' :
                'fa-info-circle'
            } mr-3"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-gray-400 hover:text-gray-600">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// Email Notification using FormSubmit.co
function sendEmailNotification(subject, body, replyTo = CONFIG.SCHOOL_EMAIL) {
    fetch(CONFIG.FORMSUBMIT_URL + CONFIG.SCHOOL_EMAIL, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: 'Website SMA Negeri 1',
            subject: subject,
            message: body,
            _replyto: replyTo,
            _template: 'table',
            _captcha: 'false',
            _next: window.location.href // Optional: redirect after submit
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Email sent successfully:', data);
    })
    .catch(error => {
        console.error('Email error:', error);
        console.log('Email would have been sent:', { subject, body, replyTo });
    });
}

// Export functions for global access
window.validateContactForm = validateContactForm;
window.validateRegistrationForm = validateRegistrationForm;
window.showNotification = showNotification;
window.openGoogleMaps = function() {
    window.open(CONFIG.GOOGLE_MAPS_LINK, '_blank');
};
