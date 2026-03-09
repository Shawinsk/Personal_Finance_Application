import { formatCurrency } from './db.js';
import { getGoals, createGoal } from './db_extras.js';

document.addEventListener('DOMContentLoaded', async () => {
    
    const listContainer = document.getElementById('goals-list-container');
    const submitBtn = document.getElementById('goal-submit-btn');

    async function loadGoals() {
        try {
            const goals = await getGoals();
            
            if (goals.length === 0) {
                listContainer.innerHTML = `
                    <div class="col-span-1 md:col-span-2 lg:col-span-3 bg-white border border-gray-100 rounded-2xl p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center">
                        <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <i class="fa-solid fa-bullseye text-2xl"></i>
                        </div>
                        <h3 class="text-lg font-bold text-black mb-1">No Goals Found</h3>
                        <p class="text-gray-500 text-sm mb-6">Set a financial goal to track your savings journey.</p>
                        <button onclick="document.getElementById('open-goal-modal').click()" class="bg-white border border-gray-200 text-black px-6 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition shadow-sm">
                            Add First Goal
                        </button>
                    </div>
                `;
                return;
            }
            
            let html = '';
            goals.forEach(g => {
                const total = parseFloat(g.target_amount);
                const current = parseFloat(g.current_amount || 0);
                let percentage = Math.min((current / total) * 100, 100).toFixed(0);
                
                let icon = g.icon || 'fa-star';
                let progressColor = 'bg-black';
                
                if (percentage >= 100) {
                    progressColor = 'bg-green-500';
                }

                const diffDate = g.deadline ? new Date(g.deadline) : null;
                let dateDisplay = 'No deadline set';
                if (diffDate) {
                    dateDisplay = `Target: ${diffDate.toLocaleDateString()}`;
                }

                html += `
                    <div class="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition hover:-translate-y-1 flex flex-col justify-between group overflow-hidden relative">
                        <!-- Abstract Design Graphic -->
                        <div class="absolute -right-10 -top-10 w-32 h-32 bg-gray-50 rounded-full mix-blend-multiply transition-transform duration-700 group-hover:scale-150 pointer-events-none"></div>
                        
                        <div class="relative z-10">
                            <div class="flex justify-between items-start mb-6">
                                <div class="w-12 h-12 rounded-2xl shadow-sm border border-gray-100 bg-white flex items-center justify-center text-gray-600 transition-transform group-hover:-translate-y-1 duration-300">
                                    <i class="fa-solid ${icon} text-lg"></i>
                                </div>
                                <div class="bg-gray-100 text-black px-2.5 py-1 rounded-lg text-xs font-bold">
                                    ${percentage}%
                                </div>
                            </div>
                            
                            <h3 class="text-black font-extrabold text-lg mb-1">${g.name}</h3>
                            <p class="text-gray-400 text-xs font-semibold mb-6 flex items-center gap-1">
                                <i class="fa-regular fa-calendar text-[10px]"></i> ${dateDisplay}
                            </p>
                        </div>
                        
                        <div class="relative z-10 w-full bg-gray-100 rounded-full h-1.5 mb-3 overflow-hidden">
                            <div class="${progressColor} h-1.5 rounded-full transition-all duration-1000" style="width: ${percentage}%"></div>
                        </div>
                        
                        <div class="relative z-10 flex justify-between items-center text-sm">
                            <div class="font-extrabold text-black">${formatCurrency(current)}</div>
                            <div class="text-gray-400 font-medium">Goal: ${formatCurrency(total)}</div>
                        </div>
                    </div>
                `;
            });
            
            listContainer.innerHTML = html;
        } catch (err) {
            console.error(err);
        }
    }

    // Modal Handling
    const modal = document.getElementById('goal-modal');
    const modalContent = document.getElementById('goal-modal-content');
    const openBtn = document.getElementById('open-goal-modal');
    const closeBtn = document.getElementById('close-goal-modal');

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
            document.getElementById('add-goal-form').reset();
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
    await loadGoals();

    // Submission Logic
    const submitForm = document.getElementById('add-goal-form');
    if (submitForm) {
        submitForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('goal-name').value;
            const target = document.getElementById('goal-target').value;
            let deadline = document.getElementById('goal-deadline').value;
            
            if (!deadline || deadline === "") deadline = null;

            const text = document.getElementById('goal-submit-text');
            const spinner = document.getElementById('goal-submit-spinner');
            
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-80');
            text.classList.add('hidden');
            spinner.classList.remove('hidden');

            try {
                await createGoal(name, target, deadline);
                await loadGoals();
                closeModal();
            } catch (err) {
                console.error(err);
                alert("Error setting goal");
            } finally {
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-80');
                text.classList.remove('hidden');
                spinner.classList.add('hidden');
            }
        });
    }
});
