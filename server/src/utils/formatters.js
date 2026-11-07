export { 
  formatINR, 
  calculateGrossProfit, 
  calculateNetProfit, 
  calculateCustomerOutstanding, 
  calculateReorderPoint, 
  calculateInventoryValuation, 
  calculateInventoryRetailValue 
} from './calculations.js';

export function formatDate(dateString) {
  if (!dateString) return '—';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function formatDateTime(dateString) {
  if (!dateString) return '—';
  const d = new Date(dateString);
  return d.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
