import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

const API_URL = 'http://localhost:3002/api';

export const FinanceProvider = ({ children }) => {
  // Persona: 'personal' | 'solyze'
  const [persona, setPersona] = useState(() => {
    return localStorage.getItem('finance_persona') || 'personal';
  });

  // Auth
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('finance_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('finance_token') || null;
  });

  // Configure axios token
  useEffect(() => {
    if (token) {
      localStorage.setItem('finance_token', token);
    } else {
      localStorage.removeItem('finance_token');
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Erro ao fazer login.');

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('finance_user', JSON.stringify(data.user));
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Erro ao cadastrar.');

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('finance_user', JSON.stringify(data.user));
      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('finance_user');
    localStorage.removeItem('finance_token');
  };

  // Theme: 'dark' | 'light'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('finance_theme') || 'dark';
  });

  const setThemeValue = (newTheme) => {
    setTheme(newTheme);
  };

  useEffect(() => {
    localStorage.setItem('finance_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const switchPersona = (newPersona) => {
    setPersona(newPersona);
  };

  useEffect(() => {
    localStorage.setItem('finance_persona', persona);
  }, [persona]);

  // Data
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_URL}/transactions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      } else {
        console.error('Error fetching transactions:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTransactions();
    } else {
      setTransactions([]);
    }
  }, [token]);

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('finance_categories');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Salário', type: 'income', isDefault: true },
      { id: '2', name: 'Cliente', type: 'income', isDefault: true },
      { id: '3', name: 'Moradia', type: 'expense', isDefault: true },
      { id: '4', name: 'Alimentação', type: 'expense', isDefault: true },
      { id: '5', name: 'Transporte', type: 'expense', isDefault: true },
      { id: '6', name: 'Lazer', type: 'expense', isDefault: true },
      { id: '7', name: 'Ferramentas', type: 'expense', isDefault: true },
      { id: '8', name: 'Investimentos', type: 'expense', isDefault: true },
    ];
  });

  useEffect(() => {
    // localStorage.setItem('finance_transactions', JSON.stringify(transactions));
    // No longer syncing transactions to localStorage
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finance_categories', JSON.stringify(categories));
  }, [categories]);

  // Phase 2 Data
  const [debts, setDebts] = useState(() => {
    const saved = localStorage.getItem('finance_debts');
    return saved ? JSON.parse(saved) : [];
  });

  const [subscriptions, setSubscriptions] = useState(() => {
    const saved = localStorage.getItem('finance_subscriptions');
    return saved ? JSON.parse(saved) : [];
  });

  const [accounts, setAccounts] = useState(() => {
    const saved = localStorage.getItem('finance_accounts');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Nubank', type: 'checking', balance: 0, isDefault: true },
      { id: '2', name: 'Itaú', type: 'checking', balance: 0, isDefault: true },
      { id: '3', name: 'Dinheiro', type: 'cash', balance: 0, isDefault: true },
    ];
  });

  // Persist Phase 2 Data
  useEffect(() => {
    localStorage.setItem('finance_debts', JSON.stringify(debts));
  }, [debts]);

  useEffect(() => {
    localStorage.setItem('finance_subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem('finance_accounts', JSON.stringify(accounts));
  }, [accounts]);


  // Actions
  const addTransaction = async (transaction) => {
    const { installments, ...rest } = transaction;

    try {
      if (installments && installments.total > 1) {
        const installmentGroupId = uuidv4();
        const baseDate = new Date(transaction.createdAt || new Date());
        const baseValue = Number(transaction.value) / Number(installments.total);

        const promises = [];

        for (let i = 0; i < installments.total; i++) {
          const date = new Date(baseDate);
          date.setMonth(date.getMonth() + i);

          const newTransaction = {
            createdAt: date.toISOString(),
            persona,
            ...rest,
            value: baseValue.toFixed(2),
            installments: {
              current: i + 1,
              total: installments.total,
              groupId: installmentGroupId
            },
            status: i === 0 ? (transaction.status || 'paid') : 'pending',
            date: date.toISOString() // Ensure date field is present for backend
          };

          promises.push(fetch(`${API_URL}/transactions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newTransaction)
          }));
        }

        await Promise.all(promises);
      } else {
        await fetch(`${API_URL}/transactions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ...transaction,
            persona,
            date: transaction.date || new Date().toISOString()
          })
        });
      }

      // Refresh list
      fetchTransactions();
      return { success: true };
    } catch (error) {
      console.error('Error adding transaction:', error);
      return { success: false, message: 'Erro ao salvar transação.' };
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await fetch(`${API_URL}/transactions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const updateTransaction = async (id, updatedData) => {
    try {
      const response = await fetch(`${API_URL}/transactions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        const data = await response.json();
        setTransactions((prev) => prev.map((t) => t.id === id ? data : t));
        return { success: true };
      } else {
        return { success: false, message: 'Erro ao atualizar transação.' };
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
      return { success: false, message: 'Erro de conexão.' };
    }
  };

  const addCategory = (category) => {
    const newCategory = {
      id: uuidv4(),
      ...category,
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const deleteCategory = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };
  // Actions Phase 2
  const addDebt = (debt) => {
    const newDebt = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      persona,
      status: 'pending',
      ...debt,
    };
    setDebts((prev) => [newDebt, ...prev]);
  };

  const updateDebt = (id, updates) => {
    setDebts((prev) => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const deleteDebt = (id) => {
    setDebts((prev) => prev.filter(d => d.id !== id));
  };

  const addSubscription = (sub) => {
    const newSub = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      persona,
      active: true,
      ...sub,
    };
    setSubscriptions((prev) => [newSub, ...prev]);
  };

  const deleteSubscription = (id) => {
    setSubscriptions((prev) => prev.filter(s => s.id !== id));
  };

  const addAccount = (account) => {
    const newAccount = {
      id: uuidv4(),
      isDefault: false,
      ...account,
    };
    setAccounts((prev) => [...prev, newAccount]);
  };

  const deleteAccount = (id) => {
    setAccounts((prev) => prev.filter(a => a.id !== id));
  };

  // Phase 3 Data
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('finance_goals');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist Phase 3 Data
  useEffect(() => {
    localStorage.setItem('finance_goals', JSON.stringify(goals));
  }, [goals]);

  // Actions Phase 3
  const addGoal = (goal) => {
    const newGoal = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      persona,
      currentAmount: 0,
      ...goal,
    };
    setGoals((prev) => [newGoal, ...prev]);
  };

  const updateGoal = (id, updates) => {
    setGoals((prev) => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  };

  const deleteGoal = (id) => {
    setGoals((prev) => prev.filter(g => g.id !== id));
  };

  // Derived State
  const filteredTransactions = persona === 'all' ? transactions : transactions.filter(t => t.persona === persona);
  const filteredDebts = persona === 'all' ? debts : debts.filter(d => d.persona === persona);
  const filteredSubscriptions = persona === 'all' ? subscriptions : subscriptions.filter(s => s.persona === persona);
  const filteredGoals = persona === 'all' ? goals : goals.filter(g => g.persona === persona);

  // Helper Functions
  const getBalance = () => {
    return filteredTransactions.reduce((acc, t) => {
      return t.type === 'income' ? acc + Number(t.value) : acc - Number(t.value);
    }, 0);
  };

  const getIncome = () => {
    return filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + Number(t.value), 0);
  };

  const getExpense = () => {
    return filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + Number(t.value), 0);
  };

  // Logic: Projections
  const getProjections = () => {
    const currentBalance = getBalance();

    // Calculate monthly recurring income/expense
    const monthlyIncome = subscriptions
      .filter(s => s.persona === persona && s.type === 'income' && s.active) // Assuming subs can be income too, or we use a different logic. For now, let's assume subs are expenses.
      // Actually, let's use average of last 3 months income for projection if no recurring income module exists yet.
      // For MVP simplicity as per plan: "Recurring Income" is not explicitly tracked in Subscriptions (which are usually expenses).
      // Let's assume "Salário" category entries are recurring for now, or just use fixed expenses from Subscriptions.

      // Simplified: Recurring Expenses = Sum of active monthly subscriptions
      .reduce((acc, s) => acc + Number(s.value), 0);

    // For income, let's take the average of "income" transactions from the last 30 days as a rough estimate of monthly income
    const last30DaysIncome = transactions
      .filter(t => t.persona === persona && t.type === 'income' && new Date(t.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      .reduce((acc, t) => acc + Number(t.value), 0);

    const estimatedMonthlyNet = last30DaysIncome - monthlyIncome;

    return {
      days30: currentBalance + estimatedMonthlyNet,
      days60: currentBalance + (estimatedMonthlyNet * 2),
      days90: currentBalance + (estimatedMonthlyNet * 3),
    };
  };

  // Logic: Alerts
  const getAlerts = () => {
    const alerts = [];
    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);

    // Debt Alerts
    debts.filter(d => d.persona === persona && d.status === 'pending').forEach(debt => {
      const dueDate = new Date(debt.dueDate);
      if (dueDate < today) {
        alerts.push({ id: `debt-overdue-${debt.id}`, type: 'danger', message: `Dívida vencida: ${debt.name}` });
      } else if (dueDate <= threeDaysFromNow) {
        alerts.push({ id: `debt-soon-${debt.id}`, type: 'warning', message: `Dívida vence em breve: ${debt.name}` });
      }
    });

    // Subscription Alerts
    subscriptions.filter(s => s.persona === persona && s.active).forEach(sub => {
      const billingDate = new Date(sub.nextBillingDate);
      if (billingDate <= threeDaysFromNow && billingDate >= today) {
        alerts.push({ id: `sub-soon-${sub.id}`, type: 'info', message: `Assinatura renova em breve: ${sub.name}` });
      }
    });

    return alerts;
  };



  return (
    <FinanceContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        persona,
        switchPersona,
        theme,
        setTheme: setThemeValue,
        transactions: filteredTransactions,
        allTransactions: transactions,
        categories,
        debts: filteredDebts,
        subscriptions: filteredSubscriptions,
        accounts,
        goals: filteredGoals,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addCategory,
        deleteCategory,
        addDebt,
        updateDebt,
        deleteDebt,
        addSubscription,
        deleteSubscription,
        addAccount,
        deleteAccount,
        addGoal,
        updateGoal,
        deleteGoal,
        getBalance,
        getIncome,
        getExpense,
        getProjections,
        getAlerts,
        createApiKey: async (name) => {
          try {
            const response = await fetch(`${API_URL}/keys`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ name })
            });
            if (response.ok) return await response.json();
            throw new Error('Erro ao criar chave.');
          } catch (error) {
            console.error(error);
            return null;
          }
        },
        getApiKeys: async () => {
          try {
            const response = await fetch(`${API_URL}/keys`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) return await response.json();
            return [];
          } catch (error) {
            console.error(error);
            return [];
          }
        },
        deleteApiKey: async (id) => {
          try {
            await fetch(`${API_URL}/keys/${id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
            });
            return true;
          } catch (error) {
            console.error(error);
            return false;
          }
        }
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
