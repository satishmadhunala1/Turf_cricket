import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, KeyRound, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '../../api/endpoints';
import { PageTransition } from '../../components/motion/Motion';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, getValues, formState: { errors } } = useForm();

  const sendOtp = async () => {
    const email = getValues('email');
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setStep(2);
      toast.success('OTP sent if email exists');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (data) => {
    setLoading(true);
    try {
      await authApi.resetPassword(data);
      toast.success('Password reset successfully');
      navigate('/login');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-slate-400 mt-2">{step === 1 ? 'Enter your email to receive OTP' : 'Enter OTP and new password'}</p>
        </div>

        <form onSubmit={handleSubmit(step === 1 ? sendOtp : resetPassword)} className="glass-card rounded-2xl p-8 space-y-5">
          <Input label="Email" type="email" icon={Mail} error={errors.email?.message}
            {...register('email', { required: 'Email is required' })} />

          {step === 2 && (
            <>
              <Input label="OTP" icon={KeyRound} error={errors.otp?.message}
                {...register('otp', { required: 'OTP is required' })} />
              <Input label="New Password" type="password" icon={Lock} error={errors.password?.message}
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} />
            </>
          )}

          <Button type="submit" className="w-full" loading={loading}>
            {step === 1 ? 'Send OTP' : 'Reset Password'}
          </Button>

          <Link to="/login" className="block text-center text-sm text-brand-400">← Back to login</Link>
        </form>
      </div>
    </PageTransition>
  );
}
