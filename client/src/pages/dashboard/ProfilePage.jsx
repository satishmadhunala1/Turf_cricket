import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authApi } from '../../api/endpoints';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { register, handleSubmit } = useForm({ defaultValues: { name: user?.name, phone: user?.phone } });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { data: res } = await authApi.updateProfile(data);
      updateUser(res.data.user);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="glass-card rounded-2xl p-6 max-w-lg space-y-4">
        <Input label="Name" {...register('name')} />
        <Input label="Email" value={user?.email} disabled />
        <Input label="Phone" {...register('phone')} />
        <Button type="submit" loading={loading}>Save Changes</Button>
      </form>
    </div>
  );
}
