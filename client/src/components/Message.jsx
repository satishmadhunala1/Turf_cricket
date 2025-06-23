const Message = ({ variant = 'info', children }) => {
  const variants = {
    info: 'bg-blue-100 text-blue-800',
    danger: 'bg-red-100 text-red-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className={`${variants[variant]} px-4 py-3 rounded mb-4`}>
      {children}
    </div>
  );
};

export default Message;