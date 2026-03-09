import { supabase } from './supabase.js';

export async function fetchUser() {
    const { data: { session } } = await supabase.auth.getSession();
    return session ? session.user : null;
}

// === ACCOUNTS ===
export async function getAccounts() {
    const user = await fetchUser();
    if (!user) return [];
    
    const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
    if (error) throw error;
    return data;
}

export async function createAccount(name, type, balance, currency = 'LKR') {
    const user = await fetchUser();
    if (!user) throw new Error('Not logged in');
    
    const { data, error } = await supabase
        .from('accounts')
        .insert([{ 
            user_id: user.id, 
            name, 
            type, 
            balance: parseFloat(balance), 
            currency 
        }])
        .select();
        
    if (error) throw error;
    return data[0];
}

// === CATEGORIES === 
// Ensure initial categories exist if empty
export async function getCategories(type = null) {
    const user = await fetchUser();
    if (!user) return [];
    
    let query = supabase
        .from('categories')
        .select('*')
        .or(`user_id.eq.${user.id},user_id.is.null`);
        
    if (type) {
        query = query.eq('type', type);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
}

export async function ensureDefaultCategories() {
    // A simple function to create defaults if a user has no categories
    const user = await fetchUser();
    if (!user) return;
    
    const existing = await getCategories();
    if (existing && existing.length > 0) return;
    
    // Add defaults
    const defaults = [
        { user_id: user.id, name: 'Salary', type: 'income', color: 'green', icon: 'fa-money-bill' },
        { user_id: user.id, name: 'Food', type: 'expense', color: 'red', icon: 'fa-utensils' },
        { user_id: user.id, name: 'Transport', type: 'expense', color: 'blue', icon: 'fa-car' },
        { user_id: user.id, name: 'Entertainment', type: 'expense', color: 'purple', icon: 'fa-film' }
    ];
    
    await supabase.from('categories').insert(defaults);
}

// === TRANSACTIONS ===
export async function getTransactions(limit = null) {
    const user = await fetchUser();
    if (!user) return [];
    
    let query = supabase
        .from('transactions')
        .select(`
            *,
            categories (name, icon, color),
            accounts (name)
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });
        
    if (limit) {
        query = query.limit(limit);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
}

export async function createTransaction(amount, type, description, date, category_id, account_id) {
    const user = await fetchUser();
    if (!user) throw new Error('Not logged in');
    
    const { data, error } = await supabase
        .from('transactions')
        .insert([{ 
            user_id: user.id, 
            amount: parseFloat(amount), 
            type, 
            description, 
            date, 
            category_id, 
            account_id 
        }])
        .select();
        
    if (error) throw error;
    
    // Update account balance
    if (account_id) {
        // Fetch current balance
        const { data: accData } = await supabase.from('accounts').select('balance').eq('id', account_id).single();
        if (accData) {
            let numBalance = parseFloat(accData.balance);
            numBalance = type === 'income' ? numBalance + parseFloat(amount) : numBalance - parseFloat(amount);
            
            await supabase.from('accounts').update({ balance: numBalance }).eq('id', account_id);
        }
    }
    
    return data[0];
}

// Format Currency Utility
export function formatCurrency(amount, currency = 'LKR') {
    return new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency: currency,
    }).format(amount);
}
