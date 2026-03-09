import { getAccounts, createAccount, formatCurrency } from './db.js';

document.addEventListener('DOMContentLoaded', async () => {
    
    const accountsListContainer = document.getElementById('accounts-list-container');
    
    // Load existing accounts
    async function loadAccounts() {
        try {
            const accounts = await getAccounts();
            
            if (accounts.length === 0) {
                accountsListContainer.innerHTML = `
                    <div class="col-span-1 md:col-span-2 lg:col-span-3 bg-white border border-gray-100 rounded-2xl p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center">
                        <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <i class="fa-solid fa-wallet text-2xl"></i>
                        </div>
                        <h3 class="text-lg font-bold text-black mb-1">No Accounts Yet</h3>
                        <p class="text-gray-500 text-sm mb-6">Create an account to start tracking your finances.</p>
                        <button onclick="document.getElementById('open-acc-modal').click()" class="bg-white border border-gray-200 text-black px-6 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition shadow-sm">
                            Add First Account
                        </button>
                    </div>
                `;
                return;
            }
            
            let html = '';
            accounts.forEach(acc => {
                let icon = 'fa-building-columns';
                let iconColor = 'text-blue-600';
                let iconBg = 'bg-blue-50';
                
                if (acc.type === 'Cash') {
                    icon = 'fa-money-bill-wave';
                    iconColor = 'text-green-600';
                    iconBg = 'bg-green-50';
                } else if (acc.type === 'Credit Card') {
                    icon = 'fa-credit-card';
                    iconColor = 'text-purple-600';
                    iconBg = 'bg-purple-50';
                }
                
                html += `
                    <div class="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition hover:-translate-y-1 group relative">
                        <div class="flex justify-between items-start mb-6">
                            <div class="w-10 h-10 rounded-full ${iconBg} flex items-center justify-center">
                                <i class="fa-solid ${icon} ${iconColor} text-sm"></i>
                            </div>
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                                ${acc.type}
                            </span>
                        </div>
                        <h3 class="text-gray-500 text-sm font-medium mb-1">${acc.name}</h3>
                        <div class="text-2xl font-extrabold text-black mb-1">${formatCurrency(acc.balance, acc.currency)}</div>
                    </div>
                `;
            });
            
            accountsListContainer.innerHTML = html;
        } catch (err) {
            console.error(err);
        }
    }
    
    // Initial Load
    await loadAccounts();

    // Modal Handling
    const modal = document.getElementById('acc-modal');
    const modalContent = document.getElementById('acc-modal-content');
    const openBtn = document.getElementById('open-acc-modal');
    const closeBtn = document.getElementById('close-acc-modal');

    const openModal = () => {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            modalContent.classList.remove('scale-95');
        }, 10);
    };

    const closeModal = () => {
        modal.classList.add('opacity-0');
        modalContent.classList.add('scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            document.getElementById('add-acc-form').reset();
        }, 300);
    };

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Submission Logic
    const submitForm = document.getElementById('add-acc-form');
    if (submitForm) {
        submitForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('acc-name').value;
            const type = document.getElementById('acc-type').value;
            const balance = document.getElementById('acc-balance').value;

            // Simple loading state
            const btn = document.getElementById('acc-submit-btn');
            const text = document.getElementById('acc-submit-text');
            const spinner = document.getElementById('acc-submit-spinner');
            
            btn.disabled = true;
            btn.classList.add('opacity-80');
            text.classList.add('hidden');
            spinner.classList.remove('hidden');

            try {
                await createAccount(name, type, balance);
                
                // Show toast via custom event or global variable?
                // For simplicity, we can reload accounts instead of full page refresh
                await loadAccounts();
                closeModal();
                
                // Try grabbing global showToast if we expose it, but for now just rely on the UI update
            } catch (err) {
                console.error(err);
                alert("Error creating account");
            } finally {
                btn.disabled = false;
                btn.classList.remove('opacity-80');
                text.classList.remove('hidden');
                spinner.classList.add('hidden');
            }
        });
    }
});
