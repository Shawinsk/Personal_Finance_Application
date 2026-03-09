import { supabase } from './supabase.js';

// Setup Toast UI component
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.innerHTML = isError 
        ? `<svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> ${message}`
        : `<svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> ${message}`;
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// Redirect to dashboard if already logged in (for login and signup pages)
async function checkAuthSession() {
    const { data: { session } } = await supabase.auth.getSession();
    const currentPath = window.location.pathname;
    
    if (session && (currentPath.endsWith('login.html') || currentPath.endsWith('signup.html') || currentPath.endsWith('index.html') || currentPath === '/')) {
        window.location.href = 'dashboard.html';
    } else if (!session && currentPath.endsWith('dashboard.html')) {
        window.location.href = 'login.html';
    }
}

// Call checkAuthSession immediately
checkAuthSession();

// Setup UI state togglers
function setLoading(buttonId, textId, spinnerId, isLoading) {
    const btn = document.getElementById(buttonId);
    const text = document.getElementById(textId);
    const spinner = document.getElementById(spinnerId);

    if (!btn || !text || !spinner) return;

    if (isLoading) {
        btn.disabled = true;
        btn.classList.add('opacity-80', 'cursor-not-allowed');
        text.classList.add('hidden');
        spinner.classList.remove('hidden');
    } else {
        btn.disabled = false;
        btn.classList.remove('opacity-80', 'cursor-not-allowed');
        text.classList.remove('hidden');
        spinner.classList.add('hidden');
    }
}

// Global Auth Handlers
document.addEventListener('DOMContentLoaded', () => {

    // === SIGN UP LOGIC ===
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            setLoading('signup-btn', 'signup-text', 'signup-spinner', true);

            try {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { full_name: name }
                    }
                });

                if (error) throw error;
                
                showToast('Account created successfully! Please sign in.', false);
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);

            } catch (err) {
                showToast(err.message, true);
            } finally {
                setLoading('signup-btn', 'signup-text', 'signup-spinner', false);
            }
        });
    }

    // === LOGIN LOGIC ===
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            setLoading('login-btn', 'login-text', 'login-spinner', true);

            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) throw error;
                
                window.location.href = 'dashboard.html';

            } catch (err) {
                showToast(err.message, true);
            } finally {
                setLoading('login-btn', 'login-text', 'login-spinner', false);
            }
        });
    }

    // === LOGOUT LOGIC ===
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await supabase.auth.signOut();
            window.location.href = 'login.html';
        });
    }

    // === PROFILE DROPDOWN LOGIC ===
    const profileBtn = document.getElementById('profile-menu-btn');
    const profileDropdown = document.getElementById('profile-dropdown');
    const profileChevron = document.getElementById('profile-chevron');
    
    if (profileBtn && profileDropdown) {
        // Toggle dropdown
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = profileDropdown.classList.contains('hidden');
            
            if (isHidden) {
                profileDropdown.classList.remove('hidden');
                setTimeout(() => {
                    profileDropdown.classList.remove('opacity-0', 'scale-95');
                    profileDropdown.classList.add('opacity-100', 'scale-100');
                    if (profileChevron) profileChevron.classList.add('rotate-180');
                }, 10);
            } else {
                profileDropdown.classList.remove('opacity-100', 'scale-100');
                profileDropdown.classList.add('opacity-0', 'scale-95');
                if (profileChevron) profileChevron.classList.remove('rotate-180');
                setTimeout(() => {
                    profileDropdown.classList.add('hidden');
                }, 150); // wait for transition
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!profileBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
                if (!profileDropdown.classList.contains('hidden')) {
                    profileDropdown.classList.remove('opacity-100', 'scale-100');
                    profileDropdown.classList.add('opacity-0', 'scale-95');
                    if (profileChevron) profileChevron.classList.remove('rotate-180');
                    setTimeout(() => {
                        profileDropdown.classList.add('hidden');
                    }, 150);
                }
            }
        });
    }

    // === POPULATE USER INFO ===
    async function populateUserInfo() {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
            const user = session.user;
            const fullName = user.user_metadata?.full_name || 'User';
            const email = user.email;
            
            const nameEl = document.getElementById('user-display-name');
            const emailEl = document.getElementById('user-display-email');
            const avatarEl = document.getElementById('user-avatar-initial');
            
            if (nameEl) nameEl.textContent = fullName;
            if (emailEl) emailEl.textContent = email;
            if (avatarEl) {
                avatarEl.textContent = fullName.charAt(0).toUpperCase();
            }
        }
    }
    
    // Run the population logic if we're on a page with the profile elements
    if (document.getElementById('user-display-name')) {
        populateUserInfo();
    }
});
