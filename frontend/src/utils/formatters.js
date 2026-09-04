export const formatDateTime = (dateVal) => {
  if (!dateVal) return '';
  let d;
  if (typeof dateVal === 'string') {
    let s = dateVal.trim();
    // If SQL timestamp like "2026-09-04 06:33:00" or ISO without timezone offset, treat as UTC
    if (/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}(\.\d+)?$/.test(s)) {
      s = s.replace(' ', 'T') + 'Z';
    }
    d = new Date(s);
  } else {
    d = new Date(dateVal);
  }
  if (isNaN(d.getTime())) return '';
  return d.toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export const formatDate = (dateVal) => {
  if (!dateVal) return '';
  if (typeof dateVal === 'string') {
    const parts = dateVal.split('T')[0].split('-');
    if (parts.length === 3) {
      const [y, m, d] = parts;
      if (y.length === 4) {
        return `${m.padStart(2, '0')}/${d.padStart(2, '0')}/${y}`;
      }
    }
  }
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });
};
