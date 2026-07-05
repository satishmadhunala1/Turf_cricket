import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User, Phone, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '../../api/endpoints';
import { useAuth } from '../../context/AuthContext';
import { PageTransition } from '../../components/motion/Motion';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import GoogleLoginButton from '../../components/auth/GoogleLoginButton';

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, getValues, formState: { errors } } = useForm();

  const sendOtp = async () => {
    const email = getValues('email');
    if (!email) return toast.error('Enter email first');
    setLoading(true);
    try {
      await authApi.sendOtp(email);
      setStep(2);
      toast.success('OTP sent to your email');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser(data);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12 bg-slate-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mt-6 text-slate-900">Create your account</h1>
          <p className="text-slate-500 mt-2">Join thousands of sports enthusiasts</p>
        </div>

        <div className="glass-card rounded-2xl p-8 space-y-5">
          <GoogleLoginButton onSuccess={() => navigate('/dashboard')} />

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
            <div className="relative flex justify-center text-sm"><span className="px-3 bg-white text-slate-400">or register with email</span></div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {step === 1 ? (
              <>
                <Input label="Full Name" icon={User} placeholder="John Doe" error={errors.name?.message}
                  {...register('name', { required: 'Name is required' })} />
                <Input label="Email" type="email" icon={Mail} placeholder="you@example.com" error={errors.email?.message}
                  {...register('email', { required: 'Email is required' })} />
                <Input label="Phone (optional)" icon={Phone} placeholder="+91 9876543210"
                  {...register('phone')} />
                <Input label="Password" type="password" icon={Lock} placeholder="Min 6 characters" error={errors.password?.message}
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} />
                <Button type="button" className="w-full" onClick={sendOtp} loading={loading}>Send OTP</Button>
              </>
            ) : (
              <>
                <Input label="Enter 6-digit OTP" icon={KeyRound} placeholder="123456" error={errors.otp?.message}
                  {...register('otp', { required: 'OTP is required', minLength: 6, maxLength: 6 })} />
                <Button type="submit" className="w-full" loading={loading}>Verify & Create Account</Button>
                <button type="button" className="text-sm text-brand-600 w-full text-center" onClick={() => setStep(1)}>← Back</button>
              </>
            )}

            <p className="text-center text-sm text-slate-500">
              Already have an account? <Link to="/login" className="text-brand-600 hover:underline font-medium">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </PageTransition>
  );
}
