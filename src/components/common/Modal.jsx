import { useEffect } from 'react'

const Modal = ({ open, onClose, title, children, footer, maxWidth = 'max-w-md' }) => {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-xl w-full ${maxWidth} max-h-[90vh] flex flex-col`}>
        {title && (
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <p className="text-sm font-bold text-[#0e5f4f]">{title}</p>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">Ã—</button>
          </div>
        )}
        <div className="px-5 py-4 overflow-y-auto flex-1">
          {children}
        </div>
        {footer && (
          <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal
