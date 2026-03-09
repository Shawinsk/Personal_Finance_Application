import { ensureDefaultCategories, getTransactions, getAccounts, formatCurrency } from './db.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await ensureDefaultCategories();
        
        // Fetch transactions & accounts for dashboard stats
        const [transactions, accounts] = await Promise.all([
            getTransactions(),
            getAccounts()
        ]);
        
        // Calculate totals
        const totalBalance = accounts.reduce((sum, acc) => sum + parseFloat(acc.balance), 0);
        
        // Income & Expense for current month
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        let totalIncome = 0;
        let totalExpense = 0;
        
        transactions.forEach(t => {
            const tDate = new Date(t.date);
            if (tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear) {
                if (t.type === 'income') totalIncome += parseFloat(t.amount);
                else if (t.type === 'expense') totalExpense += parseFloat(t.amount);
            }
        });
        
        // Update UI DOM
        const totalBalanceEl = document.getElementById('dash-total-balance');
        const incomeEl = document.getElementById('dash-income');
        const expenseEl = document.getElementById('dash-expense');
        
        if (totalBalanceEl) totalBalanceEl.textContent = formatCurrency(totalBalance);
        if (incomeEl) incomeEl.textContent = formatCurrency(totalIncome);
        if (expenseEl) expenseEl.textContent = formatCurrency(totalExpense);
        
        // Render Recent Transactions (Limit 5)
        const recentListEl = document.getElementById('dash-recent-transactions');
        if (recentListEl) {
            if (transactions.length === 0) {
                recentListEl.innerHTML = `<div class="text-gray-500 text-sm py-8 text-center border-t border-gray-50">No transactions found. You are all set to start tracing!</div>`;
            } else {
                let html = '<div class="divide-y divide-gray-100">';
                transactions.slice(0, 5).forEach(t => {
                    const isIncome = t.type === 'income';
                    const amountStr = isIncome ? `+${formatCurrency(t.amount)}` : `-${formatCurrency(t.amount)}`;
                    const colorClass = isIncome ? 'text-green-600' : 'text-red-600';
                    const dateStr = new Date(t.date).toLocaleDateString();
                    
                    const catName = t.categories ? t.categories.name : 'Uncategorized';
                    const catIcon = t.categories && t.categories.icon ? t.categories.icon : 'fa-tag';
                    const accName = t.accounts ? t.accounts.name : 'Unknown Account';
                    
                    html += `
                        <div class="py-4 flex justify-between items-center group">
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-black group-hover:text-white transition-colors">
                                    <i class="fa-solid ${catIcon} text-sm"></i>
                                </div>
                                <div>
                                    <p class="font-bold text-black text-sm">${t.description || catName}</p>
                                    <p class="text-xs text-gray-400 font-medium">${catName} • ${accName}</p>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="font-bold ${colorClass} text-sm">${amountStr}</p>
                                <p class="text-xs text-gray-400 font-medium">${dateStr}</p>
                            </div>
                        </div>
                    `;
                });
                html += '</div>';
                recentListEl.innerHTML = html;
            }
        }
        
    } catch (err) {
        console.error("Dashboard error:", err);
    }
});
