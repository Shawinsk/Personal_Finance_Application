import { fetchUser } from './db.js';
import { supabase } from './supabase.js';

// === BUDGETS ===
export async function getBudgets() {
    const user = await fetchUser();
    if (!user) return [];
    
    const { data, error } = await supabase
        .from('budgets')
        .select(`
            *,
            categories (name, icon, color)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
    if (error) throw error;
    
    // Quick calculate spent amount per budget using transactions
    const { data: txs } = await supabase
        .from('transactions')
        .select('category_id, amount')
        .eq('user_id', user.id)
        .eq('type', 'expense');
        
    const enrichedBudgets = data.map(budget => {
        let spent = 0;
        if (txs) {
            txs.forEach(t => {
                if (t.category_id === budget.category_id) {
                    spent += parseFloat(t.amount);
                }
            });
        }
        return { ...budget, spent };
    });
    
    return enrichedBudgets;
}

export async function createBudget(category_id, amount, period) {
    const user = await fetchUser();
    if (!user) throw new Error('Not logged in');
    
    // Remove if there is an existing one for current category & period to avoid unique constraint 
    // Usually you'd update instead or have a unique index properly handled, but dropping and replacing is easiest for now
    await supabase.from('budgets')
                  .delete()
                  .eq('user_id', user.id)
                  .eq('category_id', category_id)
                  .eq('period', period);
    
    const { data, error } = await supabase
        .from('budgets')
        .insert([{ 
            user_id: user.id, 
            category_id, 
            amount: parseFloat(amount),
            period
        }])
        .select();
        
    if (error) throw error;
    return data[0];
}

// === GOALS ===
export async function getGoals() {
    const user = await fetchUser();
    if (!user) return [];
    
    const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
    if (error) throw error;
    return data;
}

export async function createGoal(name, target_amount, deadline) {
    const user = await fetchUser();
    if (!user) throw new Error('Not logged in');
    
    const { data, error } = await supabase
        .from('goals')
        .insert([{ 
            user_id: user.id, 
            name, 
            target_amount: parseFloat(target_amount),
            current_amount: 0,
            deadline,
            color: 'blue',
            icon: 'fa-bullseye'
        }])
        .select();
        
    if (error) throw error;
    return data[0];
}
