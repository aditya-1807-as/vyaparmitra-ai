import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Eye, 
  AlertTriangle, 
  ArrowRightLeft, 
  Layers, 
  Download,
  Barcode,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingDown,
  Info
} from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { formatINR, formatDateTime, downloadCSV } from '../../utils/formatters.js';
import { useSearchParams } from 'react-router-dom';

export default function InventoryPage() {
  const { 
    products, 
    categories, 
    stockMovements, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    addCategory,
    lowStockProducts,
    totalInventoryValuation,
    totalInventoryRetailValue
  } = useStore();

  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'products';

  // State filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Form State
  const initialForm = {
    name: '',
    category_id: categories[0]?.id || '',
    sku: '',
    barcode: '',
    unit: 'packet',
    purchase_price: '',
    selling_price: '',
    stock_quantity: '',
    reorder_level: '15',
    tax_rate: '5',
    hsn_code: ''
  };
  const [formData, setFormData] = useState(initialForm);
  const [categoryFormData, setCategoryFormData] = useState({ name: '', description: '', icon: 'Package' });

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.barcode && p.barcode.includes(searchQuery));

      const matchCat = selectedCategory === 'ALL' || p.category_id === selectedCategory;

      let matchStatus = true;
      if (statusFilter === 'OUT_OF_STOCK') matchStatus = p.stock_quantity <= 0;
      else if (statusFilter === 'LOW_STOCK') matchStatus = p.stock_quantity > 0 && p.stock_quantity <= p.reorder_level;
      else if (statusFilter === 'IN_STOCK') matchStatus = p.stock_quantity > p.reorder_level;

      return matchSearch && matchCat && matchStatus;
    });
  }, [products, searchQuery, selectedCategory, statusFilter]);

  // Handlers
  const handleOpenAdd = () => {
    setFormData({
      ...initialForm,
      category_id: categories[0]?.id || '',
      sku: `SKU-${Date.now().toString().slice(-6)}`,
      barcode: `890${Date.now().toString().slice(-10)}`
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setSelectedProduct(prod);
    setFormData({
      name: prod.name,
      category_id: prod.category_id,
      sku: prod.sku,
      barcode: prod.barcode || '',
      unit: prod.unit,
      purchase_price: prod.purchase_price,
      selling_price: prod.selling_price,
      stock_quantity: prod.stock_quantity,
      reorder_level: prod.reorder_level,
      tax_rate: prod.tax_rate || 0,
      hsn_code: prod.hsn_code || ''
    });
    setIsEditModalOpen(true);
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.selling_price) return;
    addProduct(formData);
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!selectedProduct || !formData.name) return;
    updateProduct(selectedProduct.id, formData);
    setIsEditModalOpen(false);
  };

  const handleDelete = (prod) => {
    if (window.confirm(`Are you sure you want to delete "${prod.name}"?`)) {
      deleteProduct(prod.id);
    }
  };

  const handleSaveCategory = (e) => {
    e.preventDefault();
    if (!categoryFormData.name) return;
    addCategory(categoryFormData);
    setCategoryFormData({ name: '', description: '', icon: 'Package' });
    setIsAddCategoryModalOpen(false);
  };

  const handleExportCSV = () => {
    const rows = filteredProducts.map(p => ({
      ID: p.id,
      Name: p.name,
      SKU: p.sku,
      Barcode: p.barcode,
      Category: categories.find(c => c.id === p.category_id)?.name || 'N/A',
      PurchasePrice: p.purchase_price,
      SellingPrice: p.selling_price,
      StockQuantity: p.stock_quantity,
      Unit: p.unit,
      ReorderLevel: p.reorder_level,
      ValuationCost: p.stock_quantity * p.purchase_price
    }));
    downloadCSV('VyaparMitra_Inventory_Report', rows);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Overview Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-sand-100 tracking-tight">Smart Inventory Management</h2>
          <p className="text-xs text-sand-300/70">Real-time stock controls, automated reorder triggers & catalog updates</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-[#142319] border border-[#243D2D] text-sand-200 text-xs font-semibold hover:bg-[#1A2E21] transition-colors flex items-center space-x-1.5 shadow-card"
          >
            <Download className="w-3.5 h-3.5 text-sand-300" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-forest-700 hover:bg-forest-600 text-sand-100 text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-sm border border-forest-500/30"
          >
            <Plus className="w-4 h-4 text-sand-200" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* METRIC RIBBON */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#142319] p-4 rounded-2xl border border-[#243D2D] shadow-card">
          <p className="text-[11px] font-bold text-sand-300/60 uppercase tracking-wider">Total Inventory Value (Cost)</p>
          <p className="text-xl font-extrabold text-sand-100 mt-1 font-mono">{formatINR(totalInventoryValuation)}</p>
        </div>
        <div className="bg-[#142319] p-4 rounded-2xl border border-[#243D2D] shadow-card">
          <p className="text-[11px] font-bold text-sand-300/60 uppercase tracking-wider">Retail Sales Potential</p>
          <p className="text-xl font-extrabold text-sand-200 mt-1 font-mono">{formatINR(totalInventoryRetailValue)}</p>
        </div>
        <div className="bg-[#142319] p-4 rounded-2xl border border-[#243D2D] shadow-card">
          <p className="text-[11px] font-bold text-sand-300/60 uppercase tracking-wider">Active Items</p>
          <p className="text-xl font-extrabold text-sand-100 mt-1">{products.length} Products</p>
        </div>
        <div className="bg-[#142319] p-4 rounded-2xl border border-[#243D2D] shadow-card">
          <p className="text-[11px] font-bold text-sand-300/60 uppercase tracking-wider">Needs Reordering</p>
          <p className={`text-xl font-extrabold mt-1 ${lowStockProducts.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {lowStockProducts.length} Items Low
          </p>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex border-b border-[#243D2D] space-x-6 text-sm font-bold">
        <button
          onClick={() => setSearchParams({ tab: 'products' })}
          className={`pb-3 relative transition-colors ${currentTab === 'products' ? 'text-sand-100 border-b-2 border-electric-500' : 'text-sand-300/60 hover:text-sand-100'}`}
        >
          Product Catalog ({products.length})
        </button>
        <button
          onClick={() => setSearchParams({ tab: 'categories' })}
          className={`pb-3 relative transition-colors ${currentTab === 'categories' ? 'text-sand-100 border-b-2 border-electric-500' : 'text-sand-300/60 hover:text-sand-100'}`}
        >
          Categories ({categories.length})
        </button>
        <button
          onClick={() => setSearchParams({ tab: 'movements' })}
          className={`pb-3 relative transition-colors ${currentTab === 'movements' ? 'text-sand-100 border-b-2 border-electric-500' : 'text-sand-300/60 hover:text-sand-100'}`}
        >
          Stock Movement Log ({stockMovements.length})
        </button>
      </div>

      {/* TAB 1: PRODUCT CATALOG */}
      {currentTab === 'products' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-[#142319] p-4 rounded-2xl border border-[#243D2D] shadow-card flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-sand-300/50" />
              <input
                type="text"
                placeholder="Search by product name, SKU or barcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#18291E] border border-[#243D2D] rounded-xl text-xs text-sand-100 placeholder:text-sand-300/40 focus:outline-none focus:ring-2 focus:ring-forest-600/30"
              />
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-[#18291E] border border-[#243D2D] rounded-xl text-xs font-semibold text-sand-200 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Categories ({categories.length})</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-[#18291E] border border-[#243D2D] rounded-xl text-xs font-semibold text-sand-200 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Stock Levels</option>
                <option value="IN_STOCK">In Stock</option>
                <option value="LOW_STOCK">Low Stock Alert</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
              </select>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-[#142319] rounded-3xl border border-[#243D2D] shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#243D2D] bg-[#18291E] text-sand-300/60 uppercase font-semibold">
                    <th className="py-3 px-4">Product Info</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">SKU / Barcode</th>
                    <th className="py-3 px-4 text-right">Purchase Price</th>
                    <th className="py-3 px-4 text-right">Selling Price</th>
                    <th className="py-3 px-4 text-center">Stock Level</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#243D2D]">
                  {filteredProducts.map((p) => {
                    const cat = categories.find(c => c.id === p.category_id);
                    const isLow = p.stock_quantity > 0 && p.stock_quantity <= p.reorder_level;
                    const isOut = p.stock_quantity <= 0;

                    return (
                      <tr key={p.id} className="hover:bg-[#1A2E21] transition-colors">
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-sand-100">{p.name}</p>
                          <p className="text-[11px] text-sand-300/50">Unit: {p.unit}</p>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-sand-200">
                          {cat?.name || 'General FMCG'}
                        </td>
                        <td className="py-3.5 px-4 font-mono">
                          <p className="font-semibold text-sand-200">{p.sku}</p>
                          {p.barcode && <p className="text-[10px] text-sand-300/50 flex items-center"><Barcode className="w-3 h-3 mr-0.5 inline" /> {p.barcode}</p>}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-medium text-sand-300/70">
                          {formatINR(p.purchase_price)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-sand-100">
                          {formatINR(p.selling_price)}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-extrabold text-sand-100">
                          {p.stock_quantity} {p.unit}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {isOut ? (
                            <Badge variant="danger">Out of Stock</Badge>
                          ) : isLow ? (
                            <Badge variant="warning">Low Stock ({p.stock_quantity})</Badge>
                          ) : (
                            <Badge variant="success">In Stock</Badge>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => {
                                setSelectedProduct(p);
                                setIsDetailModalOpen(true);
                              }}
                              className="p-1.5 text-sand-300 hover:text-white hover:bg-[#1E3426] rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(p)}
                              className="p-1.5 text-sand-300 hover:text-white hover:bg-[#1E3426] rounded-lg transition-colors"
                              title="Edit Product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(p)}
                              className="p-1.5 text-rose-400/70 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan="8" className="py-12 text-center text-sand-300/50">
                        No products match your search or filter parameters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CATEGORY MANAGEMENT */}
      {currentTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-sand-300/70">Organize your shop's stock into distinct retail departments</p>
            <button
              onClick={() => setIsAddCategoryModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-forest-700 hover:bg-forest-600 text-sand-100 text-xs font-bold transition-colors flex items-center space-x-1.5 border border-forest-500/30"
            >
              <Plus className="w-4 h-4" />
              <span>Create Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const productCount = products.filter(p => p.category_id === cat.id).length;
              const catValuation = products
                .filter(p => p.category_id === cat.id)
                .reduce((sum, p) => sum + (p.stock_quantity * p.purchase_price), 0);

              return (
                <div key={cat.id} className="bg-[#142319] p-5 rounded-2xl border border-[#243D2D] shadow-card space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#18291E] border border-[#243D2D] text-sand-200 flex items-center justify-center font-bold">
                    <Layers className="w-5 h-5 text-electric-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-sand-100">{cat.name}</h4>
                    <p className="text-xs text-sand-300/60 mt-0.5 line-clamp-2">{cat.description}</p>
                  </div>
                  <div className="pt-2 border-t border-[#243D2D] flex justify-between text-xs text-sand-300/80">
                    <span className="font-semibold">{productCount} Products</span>
                    <span className="font-mono font-bold text-sand-100">{formatINR(catValuation)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: STOCK MOVEMENTS LOG */}
      {currentTab === 'movements' && (
        <div className="bg-[#142319] rounded-3xl border border-[#243D2D] shadow-card overflow-hidden">
          <div className="p-4 border-b border-[#243D2D] bg-[#18291E]">
            <h3 className="text-sm font-bold text-sand-100">Immutable Audit Log of Stock Adjustments</h3>
            <p className="text-xs text-sand-300/70">Complete historical record of incoming purchases, sales deductions, and returns</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#243D2D] bg-[#18291E] text-sand-300/60 uppercase font-semibold">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Event Type</th>
                  <th className="py-3 px-4 text-center">Quantity Delta</th>
                  <th className="py-3 px-4 text-center">Previous Stock</th>
                  <th className="py-3 px-4 text-center">Final Stock</th>
                  <th className="py-3 px-4">Reference Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#243D2D]">
                {stockMovements.map((sm) => {
                  const prod = products.find(p => p.id === sm.product_id);
                  const isIncoming = sm.movement_type === 'PURCHASE';

                  return (
                    <tr key={sm.id} className="hover:bg-[#1A2E21] transition-colors">
                      <td className="py-3 px-4 text-sand-300/60 font-mono whitespace-nowrap">{formatDateTime(sm.date)}</td>
                      <td className="py-3 px-4 font-bold text-sand-100">{prod?.name || sm.product_id}</td>
                      <td className="py-3 px-4">
                        <Badge variant={isIncoming ? 'success' : 'purple'}>
                          {sm.movement_type}
                        </Badge>
                      </td>
                      <td className={`py-3 px-4 text-center font-mono font-bold ${isIncoming ? 'text-emerald-400' : 'text-sand-100'}`}>
                        {isIncoming ? `+${sm.quantity}` : `-${sm.quantity}`}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-sand-300/60">{sm.previous_stock}</td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-sand-100">{sm.current_stock}</td>
                      <td className="py-3 px-4 text-sand-300/70">{sm.notes}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT PRODUCT */}
      <Modal 
        isOpen={isAddModalOpen || isEditModalOpen} 
        onClose={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
        title={isAddModalOpen ? "Add New Retail Product" : `Edit Product: ${selectedProduct?.name}`}
        subtitle="Ensure realistic Indian Kirana prices, unit measures, and reorder levels"
      >
        <form onSubmit={isAddModalOpen ? handleSaveAdd : handleSaveEdit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-sand-200 mb-1">Product Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Aashirvaad Sharbati Atta 10kg"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-sand-100 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-sand-200 mb-1">Category *</label>
              <select
                value={formData.category_id}
                onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-sand-100 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600/30 cursor-pointer"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-sand-200 mb-1">Unit Measure</label>
              <select
                value={formData.unit}
                onChange={e => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-sand-100 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600/30 cursor-pointer"
              >
                <option value="packet">Packet</option>
                <option value="kg">Kilogram (kg)</option>
                <option value="bag">Bag</option>
                <option value="bottle">Bottle</option>
                <option value="pouch">Pouch</option>
                <option value="box">Box</option>
                <option value="tin">Tin</option>
                <option value="bar">Bar</option>
                <option value="pcs">Pieces</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-sand-200 mb-1">SKU Code</label>
              <input
                type="text"
                value={formData.sku}
                onChange={e => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-sand-100 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-sand-200 mb-1">Barcode / EAN</label>
              <input
                type="text"
                value={formData.barcode}
                onChange={e => setFormData({ ...formData, barcode: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-sand-100 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-sand-200 mb-1">Purchase Price (₹ Cost) *</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.purchase_price}
                onChange={e => setFormData({ ...formData, purchase_price: e.target.value })}
                placeholder="₹ wholesale cost"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-sand-100 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-sand-200 mb-1">Selling Price (₹ MRP/Retail) *</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.selling_price}
                onChange={e => setFormData({ ...formData, selling_price: e.target.value })}
                placeholder="₹ retail price"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-sand-100 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-sand-200 mb-1">Stock Quantity *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock_quantity}
                onChange={e => setFormData({ ...formData, stock_quantity: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-sand-100 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-sand-200 mb-1">Reorder Level Alert Threshold</label>
              <input
                type="number"
                required
                min="1"
                value={formData.reorder_level}
                onChange={e => setFormData({ ...formData, reorder_level: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-sand-100 text-xs font-mono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#243D2D] flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
              className="px-4 py-2 text-xs font-bold text-sand-300 hover:text-white hover:bg-[#18291E] rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-forest-700 hover:bg-forest-600 text-sand-100 rounded-xl transition-colors shadow-sm border border-forest-500/30"
            >
              {isAddModalOpen ? "Create Product" : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: PRODUCT DETAIL VIEW */}
      {selectedProduct && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={selectedProduct.name}
          subtitle={`SKU: ${selectedProduct.sku} | Barcode: ${selectedProduct.barcode || 'N/A'}`}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#18291E] border border-[#243D2D]">
                <p className="text-sand-300/60 font-medium">Category</p>
                <p className="font-bold text-sand-100 mt-0.5">{categories.find(c => c.id === selectedProduct.category_id)?.name}</p>
              </div>
              <div className="p-3 rounded-xl bg-[#18291E] border border-[#243D2D]">
                <p className="text-sand-300/60 font-medium">Wholesale Cost</p>
                <p className="font-bold text-sand-100 mt-0.5 font-mono">{formatINR(selectedProduct.purchase_price)}</p>
              </div>
              <div className="p-3 rounded-xl bg-[#18291E] border border-[#243D2D]">
                <p className="text-sand-300/60 font-medium">Retail Selling Price</p>
                <p className="font-bold text-sand-100 mt-0.5 font-mono">{formatINR(selectedProduct.selling_price)}</p>
              </div>
              <div className="p-3 rounded-xl bg-[#18291E] border border-[#243D2D]">
                <p className="text-sand-300/60 font-medium">Current Stock</p>
                <p className="font-bold text-sand-100 mt-0.5 font-mono">{selectedProduct.stock_quantity} {selectedProduct.unit}</p>
              </div>
              <div className="p-3 rounded-xl bg-[#18291E] border border-[#243D2D]">
                <p className="text-sand-300/60 font-medium">Reorder Level</p>
                <p className="font-bold text-rose-400 mt-0.5 font-mono">{selectedProduct.reorder_level} {selectedProduct.unit}</p>
              </div>
              <div className="p-3 rounded-xl bg-[#18291E] border border-[#243D2D]">
                <p className="text-sand-300/60 font-medium">Unit Profit Margin</p>
                <p className="font-bold text-emerald-400 mt-0.5 font-mono">
                  {formatINR(selectedProduct.selling_price - selectedProduct.purchase_price)} ({Math.round(((selectedProduct.selling_price - selectedProduct.purchase_price)/selectedProduct.selling_price)*100)}%)
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#18291E] border border-[#243D2D] text-xs space-y-1">
              <p className="font-bold text-sand-200 flex items-center">
                <Info className="w-3.5 h-3.5 mr-1 text-electric-400" /> Reorder Point Formula Applied:
              </p>
              <p className="text-sand-300/80">
                (Avg Daily Sales × Supplier Lead Time of 2 days) + Safety Buffer = <span className="font-bold text-sand-100">{selectedProduct.reorder_level} {selectedProduct.unit}</span>
              </p>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL: CREATE CATEGORY */}
      <Modal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        title="Add New Category"
        subtitle="Group products into catalog shelves"
      >
        <form onSubmit={handleSaveCategory} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-sand-200 mb-1">Category Name *</label>
            <input
              type="text"
              required
              value={categoryFormData.name}
              onChange={e => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
              placeholder="e.g. Dry Fruits & Nuts"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-sand-100 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600/30"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-sand-200 mb-1">Description</label>
            <textarea
              rows="2"
              value={categoryFormData.description}
              onChange={e => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
              placeholder="Brief description of items in this category"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#18291E] border border-[#243D2D] text-sand-100 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600/30"
            />
          </div>
          <div className="pt-4 border-t border-[#243D2D] flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsAddCategoryModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-sand-300 hover:text-white hover:bg-[#18291E] rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-forest-700 hover:bg-forest-600 text-sand-100 rounded-xl border border-forest-500/30"
            >
              Save Category
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
