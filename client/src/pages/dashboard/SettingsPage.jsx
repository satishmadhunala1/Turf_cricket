import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authApi } from '../../api/endpoints';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function SettingsPage() {
  const { logout } = useAuth();
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);

  const changePassword = async (data) => {
    setLoading(true);
    try {
      await authApi.changePassword(data);
      toast.success('Password changed');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-lg">
      <div>
        <h1 className="font-display text-2xl font-bold mb-6">Settings</h1>
        <form onSubmit={handleSubmit(changePassword)} className="glass-card rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold">Change Password</h2>
          <Input label="Current Password" type="password" {...register('currentPassword', { required: true })} />
          <Input label="New Password" type="password" {...register('newPassword', { required: true, minLength: 6 })} />
          <Button type="submit" loading={loading}>Update Password</Button>
        </form>
      </div>
      <div className="glass-card rounded-2xl p-6">
        <h2 className="font-semibold text-red-400 mb-2">Danger Zone</h2>
        <p className="text-sm text-slate-400 mb-4">Sign out from your account on this device</p>
        <Button variant="danger" onClick={logout}>Sign Out</Button>
      </div>
    </div>
  );
}
