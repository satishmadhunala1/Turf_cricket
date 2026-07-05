import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { PageTransition } from '../../components/motion/Motion';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import GoogleLoginButton from '../../components/auth/GoogleLoginButton';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const redirect = (user) => {
    navigate(user.role === 'admin' ? '/admin' : user.role === 'owner' ? '/owner' : '/dashboard');
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await login(data);
      redirect(user);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <PageTransition>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="text-slate-500 mt-2">Sign in to manage your bookings</p>
        </div>

        <div className="glass-card rounded-2xl p-8 space-y-5">
          <GoogleLoginButton onSuccess={redirect} />

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
            <div className="relative flex justify-center text-sm"><span className="px-3 bg-white text-slate-400">or sign in with email</span></div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email"
              type="email"
              icon={Mail}
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email', { required: 'Email is required' })}
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPass ? 'text' : 'password'}
                icon={Lock}
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password', { required: 'Password is required' })}
              />
              <button type="button" className="absolute right-3 top-[38px] text-slate-400" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-brand-600 hover:underline">Forgot password?</Link>
            </div>

            <Button type="submit" className="w-full" loading={loading}>Sign In</Button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Don't have an account? <Link to="/register" className="text-brand-600 hover:underline font-medium">Sign up</Link>
          </p>
        </div>
      </PageTransition>
    </AuthLayout>
  );
}
