import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_BASE } from '../utils/api.js';
import {
  calculateGrossProfit,
  calculateNetProfit,
  calculateCustomerOutstanding,
  calculateInventoryValuation,
  calculateInventoryRetailValue
} from '../utils/calculations.js';

const StoreContext = createContext(null);

const AUTH_TOKEN_KEY = 'vyaparmitra_token_v2';
const ACTIVE_USER_KEY = 'vyaparmitra_active_user_v2';

// Pre-seeded Super Admin, User A & User B identifiers for demonstration & testing
export const DEMO_ACCOUNTS = [
  {
    email: 'admin@vyaparmitra.ai',
    name: 'Platform Administrator',
    shop_name: 'VyaparMitra AI Control Plane',
    location: 'Headquarters, Bengaluru',
    role: 'super_admin',
    is_superadmin: true,
    tag: 'SUPER ADMIN',
    hint: 'Platform Super Admin'
  },
  {
    email: 'ramesh@lakshmikirana.in',
    name: 'Ramesh Kumar (User A)',
    shop_name: 'Lakshmi Kirana & General Store',
    location: 'Bengaluru, Karnataka',
    role: 'Owner',
    is_superadmin: false,
    tag: 'KIRANA STORE',
    hint: 'Retail Shop Owner'
  },
  {
    email: 'anita@anitaretail.in',
    name: 'Anita Deshmukh (User B)',
    shop_name: 'Anita Supermart & Provisions',
    location: 'Hyderabad, Telangana',
    role: 'Owner',
    is_superadmin: false,
    tag: 'SUPERMART',
    hint: 'Supermart Owner'
  }
];

export const StoreProvider = ({ children }) => {
  // Current user state defaults strictly to NULL (no auto-login)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_USER_KEY);
      if (saved && saved !== 'null' && saved !== 'undefined') {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) return parsed;
      }
    } catch (e) {}
    return null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem(AUTH_TOKEN_KEY) || '';
  });

  const [authInitialized, setAuthInitialized] = useState(false);
  const [isSuperAdminMode, setIsSuperAdminMode] = useState(false);
  const [dateFilter, setDateFilter] = useState('month');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // User-isolated storage key
  const userStorageKey = `vyaparmitra_workspace_${currentUser?.id || 'default'}`;

  // Workspace Data State
  const [workspaceData, setWorkspaceData] = useState(() => {
    try {
      if (currentUser?.id) {
        const saved = localStorage.getItem(`vyaparmitra_workspace_${currentUser.id}`);
        if (saved) return JSON.parse(saved);
      }
    } catch (e) {}
    return null;
  });

  // Helper: Get API Auth Headers
  const getAuthHeaders = useCallback(() => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }, [token]);

  // Load / Sync data from backend for the authenticated user's workspace
  const loadWorkspace = useCallback(async (userToLoad = currentUser, authToken = token) => {
    if (!userToLoad || !authToken) {
      setWorkspaceData(null);
      return;
    }

    // Platform Super Admin does not use Kirana POS counter modules
    if (userToLoad.role === 'super_admin' || userToLoad.is_superadmin) {
      setWorkspaceData({
        shop: {
          id: 'shop-platform',
          name: 'VyaparMitra Platform Control Plane',
          business_type: 'Platform Administration HQ',
          currency_symbol: '₹'
        },
        products: [],
        categories: [],
        customers: [],
        suppliers: [],
        sales: [],
        purchases: [],
        expenses: [],
        employees: [],
        stockMovements: [],
        udhaarTransactions: [],
        platformShops: []
      });
      return;
    }

    try {
      const headers = { 'Authorization': `Bearer ${authToken}` };
      const [dashRes, prodRes, catRes, custRes, supRes, salesRes, poRes, expRes, empRes] = await Promise.all([
        fetch(`${API_BASE}/api/dashboard/stats`, { headers }),
        fetch(`${API_BASE}/api/inventory/products`, { headers }),
        fetch(`${API_BASE}/api/inventory/categories`, { headers }),
        fetch(`${API_BASE}/api/customers`, { headers }),
        fetch(`${API_BASE}/api/suppliers`, { headers }),
        fetch(`${API_BASE}/api/sales`, { headers }),
        fetch(`${API_BASE}/api/purchases`, { headers }),
        fetch(`${API_BASE}/api/expenses`, { headers }),
        fetch(`${API_BASE}/api/admin/employees`, { headers }),
      ]);

      if (dashRes.ok && prodRes.ok) {
        const dashData = await dashRes.json();
        const prods = await prodRes.json();
        const cats = catRes.ok ? await catRes.json() : [];
        const custs = custRes.ok ? await custRes.json() : [];
        const sups = supRes.ok ? await supRes.json() : [];
        const sales = salesRes.ok ? await salesRes.json() : [];
        const pos = poRes.ok ? await poRes.json() : [];
        const exps = expRes.ok ? await expRes.json() : [];
        const emps = empRes.ok ? await empRes.json() : [];

        const fresh = {
          shop: dashData.shop,
          products: prods,
          categories: cats,
          customers: custs,
          suppliers: sups,
          sales: sales,
          purchases: pos,
          expenses: exps,
          employees: emps,
          stockMovements: [],
          udhaarTransactions: [],
          platformShops: []
        };
        setWorkspaceData(fresh);
        localStorage.setItem(`vyaparmitra_workspace_${userToLoad.id}`, JSON.stringify(fresh));
        return;
      }
    } catch (e) {
      console.warn('Backend sync failed, falling back to cached user workspace data', e);
    }

    // Fallback: load from user-isolated cache
    try {
      const cached = localStorage.getItem(`vyaparmitra_workspace_${userToLoad.id}`);
      if (cached) {
        setWorkspaceData(JSON.parse(cached));
      }
    } catch (e) {}
  }, [currentUser, token]);

  // Clean, secure session validation on application mount
  useEffect(() => {
    let isMounted = true;

    const verifySessionOnBoot = async () => {
      const savedToken = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!savedToken) {
        if (isMounted) {
          setCurrentUser(null);
          setToken('');
          setAuthInitialized(true);
        }
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: { 'Authorization': `Bearer ${savedToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setToken(savedToken);
            setCurrentUser(data.user);
            localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(data.user));
            if (data.user.role !== 'super_admin' && !data.user.is_superadmin) {
              await loadWorkspace(data.user, savedToken);
            }
          }
        } else {
          // Token is invalid/expired - purge cleanly
          if (isMounted) {
            setToken('');
            setCurrentUser(null);
            setWorkspaceData(null);
            localStorage.removeItem(AUTH_TOKEN_KEY);
            localStorage.removeItem(ACTIVE_USER_KEY);
          }
        }
      } catch (err) {
        console.warn('Session verification error:', err);
      } finally {
        if (isMounted) {
          setAuthInitialized(true);
        }
      }
    };

    verifySessionOnBoot();

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync on user change (safe optional chaining)
  useEffect(() => {
    if (currentUser?.id && token) {
      loadWorkspace(currentUser, token);
    }
  }, [currentUser?.id, token]);

  // Persist current user & workspace data safely
  useEffect(() => {
    try {
      if (currentUser?.id) {
        localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(currentUser));
        if (workspaceData) {
          localStorage.setItem(`vyaparmitra_workspace_${currentUser.id}`, JSON.stringify(workspaceData));
        }
      } else {
        localStorage.removeItem(ACTIVE_USER_KEY);
      }
    } catch (e) {}
  }, [currentUser, workspaceData]);

  // --- USER AUTHENTICATION / SWITCHING ACTIONS ---

  const switchUser = async (targetEmail, targetPassword = 'password123') => {
    return await loginUser(targetEmail, targetPassword);
  };

  const registerNewUser = async (formData) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        setCurrentUser(data.user);
        localStorage.setItem(AUTH_TOKEN_KEY, data.token);
        localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(data.user));
        await loadWorkspace(data.user, data.token);
        return { success: true, user: data.user };
      } else {
        const err = await res.json();
        return { success: false, error: err.error || 'Registration failed' };
      }
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  const loginUser = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        const isSuper = Boolean(data.user?.role === 'super_admin' || data.user?.is_superadmin);

        // Store clean credentials
        setToken(data.token);
        setCurrentUser(data.user);
        localStorage.setItem(AUTH_TOKEN_KEY, data.token);
        localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(data.user));

        if (!isSuper) {
          await loadWorkspace(data.user, data.token);
        } else {
          setWorkspaceData(null);
        }

        return { success: true, user: data.user, isSuperAdmin: isSuper };
      } else {
        const err = await res.json();
        return { success: false, error: err.error || 'Invalid credentials' };
      }
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  const logout = async () => {
    try {
      const activeToken = token || localStorage.getItem(AUTH_TOKEN_KEY);
      if (activeToken) {
        await fetch(`${API_BASE}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${activeToken}`
          }
        }).catch(() => {});
      }
    } catch (e) {}

    // Complete cleanup of state
    setToken('');
    setCurrentUser(null);
    setWorkspaceData(null);

    // Thorough cleanup of all local storage entries
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(ACTIVE_USER_KEY);
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('vyaparmitra_workspace_') || key.startsWith('vyaparmitra_token') || key.startsWith('vyaparmitra_active_user'))) {
          localStorage.removeItem(key);
        }
      }
    } catch (e) {}
  };

  // --- SUPER ADMIN CONTROL PLANE APIS ---
  const fetchSuperAdminDashboard = async () => {
    const res = await fetch(`${API_BASE}/api/super-admin/dashboard`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch Super Admin dashboard');
    }
    return await res.json();
  };

  const fetchSuperAdminShops = async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/api/super-admin/shops?${query}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch shops');
    }
    return await res.json();
  };

  const fetchSuperAdminShopDetails = async (shopId) => {
    const res = await fetch(`${API_BASE}/api/super-admin/shops/${shopId}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch shop details');
    }
    return await res.json();
  };

  const updateShopStatus = async (shopId, status, reason = '') => {
    const res = await fetch(`${API_BASE}/api/super-admin/shops/${shopId}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, reason })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update shop status');
    }
    return await res.json();
  };

  const fetchSuperAdminUsers = async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/api/super-admin/users?${query}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch platform users');
    }
    return await res.json();
  };

  const updateUserStatus = async (userId, status) => {
    const res = await fetch(`${API_BASE}/api/super-admin/users/${userId}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update user status');
    }
    return await res.json();
  };

  const fetchSuperAdminSubscriptions = async () => {
    const res = await fetch(`${API_BASE}/api/super-admin/subscriptions`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch subscriptions');
    }
    return await res.json();
  };

  const fetchSuperAdminAnalytics = async () => {
    const res = await fetch(`${API_BASE}/api/super-admin/analytics`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch platform analytics');
    }
    return await res.json();
  };

  const fetchSuperAdminActivity = async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/api/super-admin/activity?${query}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch activity logs');
    }
    return await res.json();
  };

  const fetchPlatformSettings = async () => {
    const res = await fetch(`${API_BASE}/api/super-admin/settings`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch platform settings');
    }
    return await res.json();
  };

  const updatePlatformSettings = async (settings) => {
    const res = await fetch(`${API_BASE}/api/super-admin/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update platform settings');
    }
    return await res.json();
  };

  // Safe data getters
  const shop = workspaceData?.shop || (currentUser ? {
    id: currentUser.shop_id || 'shop-default',
    name: currentUser.name ? `${currentUser.name}'s Store` : 'My Retail Store',
    tagline: 'Smart Business. Simple Growth.',
    business_type: 'Kirana & Retail Store',
    currency_symbol: '₹',
    invoice_prefix: 'VM-',
    phone: currentUser.phone || '',
    receipt_footer_note: 'Thank you for shopping with us! Visit again.'
  } : {
    id: 'default',
    name: 'Retail Store',
    tagline: 'Smart Business. Simple Growth.',
    business_type: 'Kirana & Retail Store',
    currency_symbol: '₹',
    invoice_prefix: 'VM-',
    phone: '',
    receipt_footer_note: 'Thank you for shopping with us! Visit again.'
  });

  const products = workspaceData?.products || [];
  const categories = workspaceData?.categories || [];
  const customers = workspaceData?.customers || [];
  const suppliers = workspaceData?.suppliers || [];
  const sales = workspaceData?.sales || [];
  const purchases = workspaceData?.purchases || [];
  const expenses = workspaceData?.expenses || [];
  const employees = workspaceData?.employees || [];
  const stockMovements = workspaceData?.stockMovements || [];
  const udhaarTransactions = workspaceData?.udhaarTransactions || [];
  const platformShops = workspaceData?.platformShops || [];

  // --- CRUD ACTIONS STRICTLY SCOPED TO AUTHENTICATED USER ---

  const addProduct = async (productData) => {
    const payload = { ...productData };
    try {
      const res = await fetch(`${API_BASE}/api/inventory/products`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const created = await res.json();
        setWorkspaceData(prev => ({ ...prev, products: [created, ...(prev?.products || [])] }));
        return created;
      }
    } catch (e) {}

    // Local state fallback
    const localProd = {
      id: `prod-${Date.now()}`,
      shop_id: currentUser.shop_id,
      user_id: currentUser.id,
      ...payload,
      stock_quantity: Number(payload.stock_quantity || 0),
      purchase_price: Number(payload.purchase_price || 0),
      selling_price: Number(payload.selling_price || 0)
    };
    setWorkspaceData(prev => ({ ...prev, products: [localProd, ...(prev?.products || [])] }));
    return localProd;
  };

  const updateProduct = async (id, updateData) => {
    try {
      const res = await fetch(`${API_BASE}/api/inventory/products/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData)
      });
      if (res.ok) {
        const updated = await res.json();
        setWorkspaceData(prev => ({
          ...prev,
          products: (prev?.products || []).map(p => p.id === id ? updated : p)
        }));
        return updated;
      }
    } catch (e) {}

    // Local fallback
    setWorkspaceData(prev => ({
      ...prev,
      products: (prev?.products || []).map(p => p.id === id ? { ...p, ...updateData } : p)
    }));
  };

  const deleteProduct = async (id) => {
    try {
      await fetch(`${API_BASE}/api/inventory/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch (e) {}

    setWorkspaceData(prev => ({
      ...prev,
      products: (prev?.products || []).filter(p => p.id !== id)
    }));
  };

  const addCategory = async (catData) => {
    try {
      const res = await fetch(`${API_BASE}/api/inventory/categories`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(catData)
      });
      if (res.ok) {
        const created = await res.json();
        setWorkspaceData(prev => ({ ...prev, categories: [...(prev?.categories || []), created] }));
        return created;
      }
    } catch (e) {}

    const localCat = { id: `cat-${Date.now()}`, shop_id: currentUser.shop_id, ...catData };
    setWorkspaceData(prev => ({ ...prev, categories: [...(prev?.categories || []), localCat] }));
    return localCat;
  };

  const addCustomer = async (custData) => {
    try {
      const res = await fetch(`${API_BASE}/api/customers`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(custData)
      });
      if (res.ok) {
        const created = await res.json();
        setWorkspaceData(prev => ({ ...prev, customers: [...(prev?.customers || []), created] }));
        return created;
      }
    } catch (e) {}

    const localCust = {
      id: `cust-${Date.now()}`,
      shop_id: currentUser.shop_id,
      user_id: currentUser.id,
      total_purchases: 0,
      outstanding_balance: 0,
      created_at: new Date().toISOString().split('T')[0],
      ...custData
    };
    setWorkspaceData(prev => ({ ...prev, customers: [...(prev?.customers || []), localCust] }));
    return localCust;
  };

  const updateCustomer = async (id, updateData) => {
    try {
      const res = await fetch(`${API_BASE}/api/customers/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData)
      });
      if (res.ok) {
        const updated = await res.json();
        setWorkspaceData(prev => ({
          ...prev,
          customers: (prev?.customers || []).map(c => c.id === id ? updated : c)
        }));
        return updated;
      }
    } catch (e) {}

    setWorkspaceData(prev => ({
      ...prev,
      customers: (prev?.customers || []).map(c => c.id === id ? { ...c, ...updateData } : c)
    }));
  };

  const deleteCustomer = async (id) => {
    try {
      await fetch(`${API_BASE}/api/customers/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch (e) {}

    setWorkspaceData(prev => ({
      ...prev,
      customers: (prev?.customers || []).filter(c => c.id !== id)
    }));
  };

  const recordUdhaarPayment = async (customerId, amount, paymentMode = 'CASH', notes = '') => {
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) return false;

    try {
      const res = await fetch(`${API_BASE}/api/customers/record-payment`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ customer_id: customerId, amount: numAmount, payment_mode: paymentMode, notes })
      });
      if (res.ok) {
        const data = await res.json();
        setWorkspaceData(prev => ({
          ...prev,
          customers: (prev?.customers || []).map(c => c.id === customerId ? { ...c, outstanding_balance: data.new_balance } : c),
          udhaarTransactions: [data.transaction, ...(prev?.udhaarTransactions || [])]
        }));
        return true;
      }
    } catch (e) {}

    // Local fallback
    setWorkspaceData(prev => {
      const updatedCustomers = (prev?.customers || []).map(c => {
        if (c.id === customerId) {
          const newBal = Math.max(0, (c.outstanding_balance || 0) - numAmount);
          return { ...c, outstanding_balance: newBal };
        }
        return c;
      });
      return {
        ...prev,
        customers: updatedCustomers,
        udhaarTransactions: [
          { id: `udhaar-${Date.now()}`, customer_id: customerId, transaction_type: 'PAYMENT', amount: numAmount, date: new Date().toISOString(), notes },
          ...(prev?.udhaarTransactions || [])
        ]
      };
    });
    return true;
  };

  const addSupplier = async (supData) => {
    try {
      const res = await fetch(`${API_BASE}/api/suppliers`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(supData)
      });
      if (res.ok) {
        const created = await res.json();
        setWorkspaceData(prev => ({ ...prev, suppliers: [...(prev?.suppliers || []), created] }));
        return created;
      }
    } catch (e) {}

    const localSup = { id: `sup-${Date.now()}`, shop_id: currentUser.shop_id, user_id: currentUser.id, balance_due: 0, ...supData };
    setWorkspaceData(prev => ({ ...prev, suppliers: [...(prev?.suppliers || []), localSup] }));
    return localSup;
  };

  const updateSupplier = async (id, updateData) => {
    try {
      const res = await fetch(`${API_BASE}/api/suppliers/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData)
      });
      if (res.ok) {
        const updated = await res.json();
        setWorkspaceData(prev => ({
          ...prev,
          suppliers: (prev?.suppliers || []).map(s => s.id === id ? updated : s)
        }));
        return updated;
      }
    } catch (e) {}

    setWorkspaceData(prev => ({
      ...prev,
      suppliers: (prev?.suppliers || []).map(s => s.id === id ? { ...s, ...updateData } : s)
    }));
  };

  const deleteSupplier = async (id) => {
    try {
      await fetch(`${API_BASE}/api/suppliers/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch (e) {}

    setWorkspaceData(prev => ({
      ...prev,
      suppliers: (prev?.suppliers || []).filter(s => s.id !== id)
    }));
  };

  const completeSale = async (saleData) => {
    try {
      const res = await fetch(`${API_BASE}/api/sales`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(saleData)
      });
      if (res.ok) {
        const createdSale = await res.json();
        // Reload workspace to capture stock reductions and ledger updates
        await loadWorkspace(currentUser, token);
        return createdSale;
      }
    } catch (e) {}

    // Local fallback
    const saleId = `sale-${Date.now()}`;
    const invoiceNum = `${shop.invoice_prefix}${Date.now().toString().slice(-6)}`;
    const newSale = {
      id: saleId,
      shop_id: currentUser.shop_id,
      user_id: currentUser.id,
      invoice_number: invoiceNum,
      sale_date: new Date().toISOString(),
      cashier_name: currentUser.name,
      ...saleData
    };

    setWorkspaceData(prev => {
      const updatedProducts = (prev?.products || []).map(prod => {
        const sold = (saleData.items || []).find(i => i.product_id === prod.id);
        if (sold) {
          return { ...prod, stock_quantity: Math.max(0, prod.stock_quantity - sold.quantity) };
        }
        return prod;
      });

      let updatedCusts = (prev?.customers || []);
      if (saleData.customer_id) {
        updatedCusts = updatedCusts.map(c => {
          if (c.id === saleData.customer_id) {
            const addDue = saleData.payment_method === 'UDHAAR' ? saleData.total_amount : 0;
            return {
              ...c,
              total_purchases: (c.total_purchases || 0) + saleData.total_amount,
              outstanding_balance: (c.outstanding_balance || 0) + addDue
            };
          }
          return c;
        });
      }

      return {
        ...prev,
        sales: [newSale, ...(prev?.sales || [])],
        products: updatedProducts,
        customers: updatedCusts
      };
    });

    return newSale;
  };

  const completePurchase = async (purchaseData) => {
    try {
      const res = await fetch(`${API_BASE}/api/purchases`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(purchaseData)
      });
      if (res.ok) {
        const createdPo = await res.json();
        await loadWorkspace(currentUser, token);
        return createdPo;
      }
    } catch (e) {}

    const poId = `po-${Date.now()}`;
    const newPO = { id: poId, shop_id: currentUser.shop_id, user_id: currentUser.id, purchase_date: new Date().toISOString(), ...purchaseData };
    setWorkspaceData(prev => {
      const updatedProducts = (prev?.products || []).map(prod => {
        const item = (purchaseData.items || []).find(i => i.product_id === prod.id);
        if (item) {
          return { ...prod, stock_quantity: prod.stock_quantity + item.quantity, purchase_price: item.unit_cost };
        }
        return prod;
      });
      return {
        ...prev,
        purchases: [newPO, ...(prev?.purchases || [])],
        products: updatedProducts
      };
    });
    return newPO;
  };

  const addExpense = async (expenseData) => {
    try {
      const res = await fetch(`${API_BASE}/api/expenses`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(expenseData)
      });
      if (res.ok) {
        const created = await res.json();
        setWorkspaceData(prev => ({ ...prev, expenses: [created, ...(prev?.expenses || [])] }));
        return created;
      }
    } catch (e) {}

    const localExp = { id: `exp-${Date.now()}`, shop_id: currentUser.shop_id, user_id: currentUser.id, ...expenseData };
    setWorkspaceData(prev => ({ ...prev, expenses: [localExp, ...(prev?.expenses || [])] }));
    return localExp;
  };

  const deleteExpense = async (id) => {
    try {
      await fetch(`${API_BASE}/api/expenses/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch (e) {}

    setWorkspaceData(prev => ({
      ...prev,
      expenses: (prev?.expenses || []).filter(e => e.id !== id)
    }));
  };

  const updateShop = async (shopData) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/shop`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(shopData)
      });
      if (res.ok) {
        const updated = await res.json();
        setWorkspaceData(prev => ({ ...prev, shop: updated }));
        return updated;
      }
    } catch (e) {}

    setWorkspaceData(prev => ({
      ...prev,
      shop: { ...prev?.shop, ...shopData }
    }));
  };

  const addEmployee = async (empData) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/employees`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(empData)
      });
      if (res.ok) {
        const created = await res.json();
        setWorkspaceData(prev => ({ ...prev, employees: [...(prev?.employees || []), created] }));
        return created;
      }
    } catch (e) {}

    const localEmp = { id: `user-${Date.now()}`, shop_id: currentUser.shop_id, joined_at: new Date().toISOString().split('T')[0], ...empData };
    setWorkspaceData(prev => ({ ...prev, employees: [...(prev?.employees || []), localEmp] }));
    return localEmp;
  };

  const updateEmployee = async (id, updateData) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/employees/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData)
      });
      if (res.ok) {
        const updated = await res.json();
        setWorkspaceData(prev => ({
          ...prev,
          employees: (prev?.employees || []).map(e => e.id === id ? updated : e)
        }));
        return updated;
      }
    } catch (e) {}

    setWorkspaceData(prev => ({
      ...prev,
      employees: (prev?.employees || []).map(e => e.id === id ? { ...e, ...updateData } : e)
    }));
  };

  const deleteEmployee = async (id) => {
    try {
      await fetch(`${API_BASE}/api/admin/employees/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch (e) {}

    setWorkspaceData(prev => ({
      ...prev,
      employees: (prev?.employees || []).filter(e => e.id !== id)
    }));
  };

  // --- LIVE COMPUTED FINANCIAL METRICS STRICTLY FOR CURRENT USER ---
  const lowStockProducts = products.filter(p => p.stock_quantity <= p.reorder_level);
  const outOfStockProducts = products.filter(p => p.stock_quantity <= 0);

  const totalSalesRevenue = sales.reduce((sum, s) => sum + Number(s.total_amount || 0), 0);
  const totalCOGS = sales.reduce((sum, s) => {
    const saleCost = (s.items || []).reduce((iSum, i) => iSum + (Number(i.quantity || 0) * Number(i.unit_cost || 0)), 0);
    return sum + saleCost;
  }, 0);
  const { grossProfit, grossMarginPercent } = calculateGrossProfit(totalSalesRevenue, totalCOGS);

  const totalOperatingExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const netProfit = calculateNetProfit(grossProfit, totalOperatingExpenses);

  const totalInventoryValuation = calculateInventoryValuation(products);
  const totalInventoryRetailValue = calculateInventoryRetailValue(products);

  const totalCustomerUdhaarOutstanding = customers.reduce((sum, c) => sum + Number(c.outstanding_balance || 0), 0);
  const totalSupplierDue = suppliers.reduce((sum, s) => sum + Number(s.balance_due || 0), 0);

  const isSuperAdmin = Boolean(currentUser?.role === 'super_admin' || currentUser?.is_superadmin);
  const isAuthenticated = Boolean(currentUser && token);

  return (
    <StoreContext.Provider
      value={{
        // Authentication & User Identity
        currentUser,
        setCurrentUser,
        token,
        isAuthenticated,
        authInitialized,
        isSuperAdmin,
        switchUser,
        registerNewUser,
        loginUser,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        demoAccounts: DEMO_ACCOUNTS,

        // Super Admin Platform Control Plane Methods
        fetchSuperAdminDashboard,
        fetchSuperAdminShops,
        fetchSuperAdminShopDetails,
        updateShopStatus,
        fetchSuperAdminUsers,
        updateUserStatus,
        fetchSuperAdminSubscriptions,
        fetchSuperAdminAnalytics,
        fetchSuperAdminActivity,
        fetchPlatformSettings,
        updatePlatformSettings,

        // Strictly Isolated Workspace Data
        shop,
        products,
        categories,
        customers,
        suppliers,
        sales,
        purchases,
        expenses,
        employees,
        stockMovements,
        udhaarTransactions,
        platformShops,

        // Live Computed Metrics
        lowStockProducts,
        outOfStockProducts,
        totalSalesRevenue,
        totalCOGS,
        grossProfit,
        grossMarginPercent,
        totalOperatingExpenses,
        netProfit,
        totalInventoryValuation,
        totalInventoryRetailValue,
        totalCustomerUdhaarOutstanding,
        totalSupplierDue,

        // Viewport & Filters
        isSuperAdminMode,
        setIsSuperAdminMode,
        dateFilter,
        setDateFilter,

        // Isolated Mutation Actions
        updateShop,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        addCategory,
        addProduct,
        updateProduct,
        deleteProduct,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        recordUdhaarPayment,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        completeSale,
        completePurchase,
        addExpense,
        deleteExpense,
        reloadWorkspace: () => loadWorkspace(currentUser, token)
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
