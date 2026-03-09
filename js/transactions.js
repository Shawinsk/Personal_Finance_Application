import { getTransactions, createTransaction, getCategories, getAccounts, formatCurrency } from './db.js';

document.addEventListener('DOMContentLoaded', async () => {
    
    const listContainer = document.getElementById('transactions-list-container');
    const noAccountsWarning = document.getElementById('no-accounts-warning');
    const submitBtn = document.getElementById('tx-submit-btn');

    // State
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('tx-date');
    if (dateInput) dateInput.value = today;

    async function loadTransactions() {
        try {
            const transactions = await getTransactions();
            
            if (transactions.length === 0) {
                listContainer.innerHTML = `
                    <div class="text-center py-10">
                        <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <i class="fa-solid fa-receipt text-2xl"></i>
                        </div>
                        <h3 class="text-lg font-bold text-black mb-1">No Transactions Yet</h3>
                        <p class="text-gray-500 text-sm mb-6">Record your first income or expense to get started.</p>
                        <button onclick="document.getElementById('open-tx-modal').click()" class="bg-white border border-gray-200 text-black px-6 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition shadow-sm">
                            Add First Transaction
                        </button>
                    </div>
                `;
                return;
            }
            
            let html = '<div class="divide-y divide-gray-100">';
            transactions.forEach(t => {
                const isIncome = t.type === 'income';
                const amountStr = isIncome ? `+${formatCurrency(t.amount)}` : `-${formatCurrency(t.amount)}`;
                const colorClass = isIncome ? 'text-green-600' : 'text-gray-900';
                const amountBg = isIncome ? 'bg-green-50' : 'bg-gray-100/50';
                
                // Setup friendly date
                const dateObj = new Date(t.date);
                const displayDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                
                const catName = t.categories ? t.categories.name : 'Uncategorized';
                let catIcon = t.categories && t.categories.icon ? t.categories.icon : 'fa-tag';
                const accName = t.accounts ? t.accounts.name : 'Unknown Account';
                
                // Simple color logic based on category mappings in db
                let iconColor = 'text-gray-500';
                if(t.categories && t.categories.color) {
                    if (t.categories.color === 'green') iconColor = 'text-green-500';
                    if (t.categories.color === 'red') iconColor = 'text-red-500';
                    if (t.categories.color === 'blue') iconColor = 'text-blue-500';
                    if (t.categories.color === 'purple') iconColor = 'text-purple-500';
                }
                
                html += `
                    <div class="py-5 px-4 hover:bg-gray-50/50 transition-colors flex justify-between items-center group">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-full border border-gray-100 bg-white shadow-sm flex items-center justify-center text-gray-500 transition-transform group-hover:scale-110">
                                <i class="fa-solid ${catIcon} ${iconColor}"></i>
                            </div>
                            <div>
                                <p class="font-bold text-black text-sm mb-0.5">${t.description || catName}</p>
                                <div class="flex items-center gap-2 text-xs font-medium text-gray-400">
                                    <span class="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">${catName}</span>
                                    <span>•</span>
                                    <span>${accName}</span>
                                </div>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="font-extrabold ${colorClass} text-base px-2 py-0.5 rounded-lg ${amountBg} inline-block">${amountStr}</p>
                            <p class="text-xs text-gray-400 font-medium block mt-1">${displayDate}</p>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
            listContainer.innerHTML = html;
            
        } catch (err) {
            console.error(err);
        }
    }

    // Modal Handling
    const modal = document.getElementById('tx-modal');
    const modalContent = document.getElementById('tx-modal-content');
    const openBtn = document.getElementById('open-tx-modal');
    const closeBtn = document.getElementById('close-tx-modal');

    // Load dropdowns
    async function populateFormDropdowns() {
        const [categories, accounts] = await Promise.all([
            getCategories(),
            getAccounts()
        ]);
        
        // Handle Accounts
        const accSelect = document.getElementById('tx-account');
        if (accounts.length === 0) {
            if (noAccountsWarning) noAccountsWarning.classList.remove('hidden');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
            }
        } else {
            if (noAccountsWarning) noAccountsWarning.classList.add('hidden');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
            
            accSelect.innerHTML = '<option value="" disabled selected>Select account</option>';
            accounts.forEach(acc => {
                accSelect.innerHTML += `<option value="${acc.id}">${acc.name} (${formatCurrency(acc.balance)})</option>`;
            });
            // auto-select first
            if(accounts.length > 0) accSelect.value = accounts[0].id;
        }

        // Store categories globally for easy type filtering
        window._categories = categories;
        updateCategoryDropdown();
    }
    
    function updateCategoryDropdown() {
        const type = document.querySelector('input[name="tx-type"]:checked').value;
        const catSelect = document.getElementById('tx-category');
        catSelect.innerHTML = '<option value="" disabled selected>Select category</option>';
        
        if (window._categories) {
            const filtered = window._categories.filter(c => c.type === type);
            filtered.forEach(c => {
                catSelect.innerHTML += `<option value="${c.id}">${c.name}</option>`;
            });
            if(filtered.length > 0) catSelect.value = filtered[0].id;
        }
    }

    // Listen to radio toggles to change the category dropdown
    const typeRadios = document.querySelectorAll('input[name="tx-type"]');
    typeRadios.forEach(r => r.addEventListener('change', updateCategoryDropdown));

    const openModal = async () => {
        await populateFormDropdowns();
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
            document.getElementById('add-tx-form').reset();
            // reset toggle visual
            document.getElementById('tx-type-slider').style.transform = 'translateX(0%)';
            document.getElementById('tx-date').value = today;
        }, 300);
    };

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Auto open if query params specified (from dashboard)
    if (window.location.search.includes('add=true')) {
        setTimeout(openModal, 200);
    }

    // Initial Load
    await loadTransactions();

    // Submission Logic
    const submitForm = document.getElementById('add-tx-form');
    if (submitForm) {
        submitForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const type = document.querySelector('input[name="tx-type"]:checked').value;
            const amount = document.getElementById('tx-amount').value;
            const desc = document.getElementById('tx-desc').value;
            const date = document.getElementById('tx-date').value;
            const categoryId = document.getElementById('tx-category').value;
            const accountId = document.getElementById('tx-account').value;

            const btn = document.getElementById('tx-submit-btn');
            const text = document.getElementById('tx-submit-text');
            const spinner = document.getElementById('tx-submit-spinner');
            
            btn.disabled = true;
            btn.classList.add('opacity-80');
            text.classList.add('hidden');
            spinner.classList.remove('hidden');

            try {
                await createTransaction(amount, type, desc, date, categoryId, accountId);
                await loadTransactions();
                closeModal();
            } catch (err) {
                console.error(err);
                alert("Error creating transaction");
            } finally {
                btn.disabled = false;
                btn.classList.remove('opacity-80');
                text.classList.remove('hidden');
                spinner.classList.add('hidden');
            }
        });
    }
});
