// Tiny helpers for downloading CSV or printing the current page as PDF.
export function downloadCSV(rows, headers, filename = `export-${Date.now()}.csv`) {
  const head = headers.map(h => `"${h.replace(/"/g, '""')}"`).join(',')
  const body = rows
    .map(r => headers.map(h => {
      const v = r[h]
      return `"${(v == null ? '' : String(v)).replace(/"/g, '""')}"`
    }).join(','))
    .join('\n')
  const blob = new Blob([head + '\n' + body], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = filename
  a.click()
  URL.revokeObjectURL(a.href)
}

export function printAsPDF() { window.print() }

export function parseCSV(text) {
  // simple CSV parser: handles quoted commas + escaped quotes
  const rows = []
  let cur = [], cell = '', inQuote = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuote) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++ }
      else if (c === '"') inQuote = false
      else cell += c
    } else {
      if (c === '"') inQuote = true
      else if (c === ',') { cur.push(cell); cell = '' }
      else if (c === '\n') { cur.push(cell); rows.push(cur); cur = []; cell = '' }
      else if (c === '\r') { /* skip */ }
      else cell += c
    }
  }
  if (cell.length || cur.length) { cur.push(cell); rows.push(cur) }
  if (!rows.length) return { headers: [], records: [] }
  const headers = rows[0].map(h => h.trim())
  const records = rows.slice(1).filter(r => r.some(c => c !== '')).map(r => {
    const o = {}
    headers.forEach((h, i) => { o[h] = (r[i] || '').trim() })
    return o
  })
  return { headers, records }
}
