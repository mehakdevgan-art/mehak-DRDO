/**
 * Utility functions for exporting data to various formats.
 */

export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || !data.length) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(fieldName => `"${row[fieldName] || ''}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, filename);
};

// A highly simplified excel export that just produces a TSV which excel can read, 
// since generating real .xlsx client-side usually requires a heavy library like xlsx.js
export const exportToExcel = (data, filename = 'export.xls') => {
  if (!data || !data.length) return;
  
  const headers = Object.keys(data[0]);
  const tsvContent = [
    headers.join('\t'),
    ...data.map(row => headers.map(fieldName => `${row[fieldName] || ''}`).join('\t'))
  ].join('\n');

  const blob = new Blob([tsvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  downloadBlob(blob, filename);
};

export const printToPDF = () => {
  // Using browser's native print to PDF functionality
  window.print();
};

const downloadBlob = (blob, filename) => {
  const link = document.createElement('a');
  if (link.download !== undefined) { 
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
