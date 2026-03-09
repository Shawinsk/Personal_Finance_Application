import { formatCurrency, getCategories } from './db.js';
import { getBudgets, createBudget } from './db_extras.js';

document.addEventListener('DOMContentLoaded', async () => {
    
    const listContainer = document.getElementById('budgets-list-container');
    const submitBtn = document.getElementById('budget-submit-btn');
    const catWarning = document.getElementById('no-categories-warning');
    const catSelect = document.getElementById('budget-category');

    async function loadBudgets() {
        try {
            const budgets = await getBudgets();
            
            if (budgets.length === 0) {
                listContainer.innerHTML = `
                    <div class="col-span-1 md:col-span-2 lg:col-span-3 bg-white border border-gray-100 rounded-2xl p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center">
                        <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <i class="fa-solid fa-chart-pie text-2xl"></i>
                        </div>
                        <h3 class="text-lg font-bold text-black mb-1">No Budgets Set</h3>
                        <p class="text-gray-500 text-sm mb-6">Create limits for categories to track your spending effectively.</p>
                        <button onclick="document.getElementById('open-budget-modal').click()" class="bg-white border border-gray-200 text-black px-6 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition shadow-sm">
                            Set First Budget
                        </button>
                    </div>
                `;
                return;
            }
            
            let html = '';
            budgets.forEach(b => {
                const total = parseFloat(b.amount);
                const spent = parseFloat(b.spent || 0);
                let percentage = Math.min((spent / total) * 100, 100).toFixed(0);
                
                let progressColor = 'bg-black';
                let alertText = '';
                
                if (percentage >= 90) {
                    progressColor = 'bg-red-500';
                    alertText = '<span class="text-xs font-bold text-red-500 ml-2 bg-red-50 px-2 rounded-md">Nearly Exceeded</span>';
                } else if (percentage >= 70) {
                    progressColor = 'bg-yellow-500';
                    alertText = '<span class="text-xs font-bold text-yellow-600 ml-2 bg-yellow-50 px-2 rounded-md">Warning</span>';
                }

                const catName = b.categories ? b.categories.name : 'Unknown';
                const catIcon = b.categories && b.categories.icon ? b.categories.icon : 'fa-tags';
                
                html += `
                    <div class="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition hover:-translate-y-1">
                        <div class="flex justify-between items-center mb-4">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500">
                                    <i class="fa-solid ${catIcon} text-sm"></i>
                                </div>
                                <h3 class="text-black font-bold text-base">${catName}</h3>
                            </div>
                            ${alertText}
                        </div>
                        
                        <div class="w-full bg-gray-100 rounded-full h-2 mb-3 overflow-hidden">
                            <div class="${progressColor} h-2 rounded-full transition-all duration-1000" style="width: ${percentage}%"></div>
                        </div>
                        
                        <div class="flex justify-between items-center text-sm">
                            <div class="font-bold text-black">${formatCurrency(spent)}</div>
                            <div class="text-gray-400 font-medium">of ${formatCurrency(total)}</div>
                        </div>
                        <div class="text-[10px] text-gray-400 mt-3 font-semibold uppercase tracking-wider text-right border-t border-gray-50 pt-2">${b.period}</div>
                    </div>
                `;
            });
            
            listContainer.innerHTML = html;
        } catch (err) {
            console.error(err);
        }
    }

    // Modal Handling
    const modal = document.getElementById('budget-modal');
    const modalContent = document.getElementById('budget-modal-content');
    const openBtn = document.getElementById('open-budget-modal');
    const closeBtn = document.getElementById('close-budget-modal');

    async function populateForm() {
        // Load expense categories
        const categories = await getCategories('expense');
        if (categories.length === 0) {
            if (catWarning) catWarning.classList.remove('hidden');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
            }
        } else {
            if (catWarning) catWarning.classList.add('hidden');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
            catSelect.innerHTML = '<option value="" disabled selected>Select category</option>';
            categories.forEach(c => {
                catSelect.innerHTML += `<option value="${c.id}">${c.name}</option>`;
            });
            if(categories.length > 0) catSelect.value = categories[0].id;
        }
    }

    const openModal = async () => {
        await populateForm();
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
            document.getElementById('set-budget-form').reset();
        }, 300);
    };

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Initial Load
    await loadBudgets();

    // Submission Logic
    const submitForm = document.getElementById('set-budget-form');
    if (submitForm) {
        submitForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const categoryId = document.getElementById('budget-category').value;
            const amount = document.getElementById('budget-amount').value;
            const period = document.getElementById('budget-period').value;

            const text = document.getElementById('budget-submit-text');
            const spinner = document.getElementById('budget-submit-spinner');
            
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-80');
            text.classList.add('hidden');
            spinner.classList.remove('hidden');

            try {
                await createBudget(categoryId, amount, period);
                await loadBudgets();
                closeModal();
            } catch (err) {
                console.error(err);
                alert("Error setting budget");
            } finally {
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-80');
                text.classList.remove('hidden');
                spinner.classList.add('hidden');
            }
        });
    }
});
