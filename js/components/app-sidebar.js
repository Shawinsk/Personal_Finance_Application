class AppSidebar extends HTMLElement {
    connectedCallback() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'dashboard.html';
        
        const isDashboard = page === 'dashboard.html';
        const isAccounts = page === 'accounts.html';
        const isTransactions = page === 'transactions.html';
        const isBudgets = page === 'budgets.html';
        const isGoals = page === 'goals.html';

        this.innerHTML = `
            <aside class="w-64 bg-white border-r border-gray-100 flex-shrink-0 min-h-screen py-8 px-6 hidden md:block">
                <div class="mb-10 pl-2">
                    <a href="dashboard.html" class="text-2xl font-extrabold tracking-tighter text-black">FundFlow.</a>
                </div>
                
                <nav class="flex flex-col gap-2">
                    <a href="dashboard.html" class="flex items-center gap-3 px-3 py-2.5 ${isDashboard ? 'bg-gray-50 text-black font-semibold' : 'text-gray-500 hover:bg-gray-50 hover:text-black font-medium'} rounded-lg transition-colors">
                        <svg class="w-5 h-5 ${isDashboard ? 'text-black' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                        Dashboard
                    </a>
                    <a href="accounts.html" class="flex items-center gap-3 px-3 py-2.5 ${isAccounts ? 'bg-gray-50 text-black font-semibold' : 'text-gray-500 hover:bg-gray-50 hover:text-black font-medium'} rounded-lg transition-colors">
                        <svg class="w-5 h-5 ${isAccounts ? 'text-black' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                        Accounts & Wallets
                    </a>
                    <a href="transactions.html" class="flex items-center gap-3 px-3 py-2.5 ${isTransactions ? 'bg-gray-50 text-black font-semibold' : 'text-gray-500 hover:bg-gray-50 hover:text-black font-medium'} rounded-lg transition-colors">
                        <svg class="w-5 h-5 ${isTransactions ? 'text-black' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                        Transactions
                    </a>
                    <a href="budgets.html" class="flex items-center gap-3 px-3 py-2.5 ${isBudgets ? 'bg-gray-50 text-black font-semibold' : 'text-gray-500 hover:bg-gray-50 hover:text-black font-medium'} rounded-lg transition-colors">
                        <svg class="w-5 h-5 ${isBudgets ? 'text-black' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Budgets
                    </a>
                    <a href="goals.html" class="flex items-center gap-3 px-3 py-2.5 ${isGoals ? 'bg-gray-50 text-black font-semibold' : 'text-gray-500 hover:bg-gray-50 hover:text-black font-medium'} rounded-lg transition-colors">
                        <svg class="w-5 h-5 ${isGoals ? 'text-black' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                        Financial Goals
                    </a>
                </nav>
            </aside>
        `;
    }
}
customElements.define('app-sidebar', AppSidebar);
