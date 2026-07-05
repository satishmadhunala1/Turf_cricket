const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3 text-base',
};

const variants = {
  primary: 'bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-500/20',
  secondary: 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700',
  outline: 'border border-brand-500 text-brand-600 hover:bg-brand-50',
  ghost: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled,
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
