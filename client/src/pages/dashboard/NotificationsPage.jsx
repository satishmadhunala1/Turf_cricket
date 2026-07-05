import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { userApi } from '../../api/endpoints';
import Badge from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userApi.getNotifications().then(({ data }) => setNotifications(data.data || [])).finally(() => setLoading(false));
  }, []);

  const markRead = async (ids) => {
    await userApi.markNotificationsRead(ids);
    setNotifications((n) => n.map((item) => ids.includes(item._id) ? { ...item, isRead: true } : item));
  };

  if (loading) return <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Notifications</h1>
      {notifications.length === 0 ? (
        <div className="text-center py-16 text-slate-400"><Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />No notifications</div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`glass-card rounded-xl p-4 cursor-pointer ${!n.isRead ? 'border-brand-500/30' : ''}`}
              onClick={() => !n.isRead && markRead([n._id])}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{n.title}</p>
                  <p className="text-sm text-slate-400 mt-1">{n.message}</p>
                  <p className="text-xs text-slate-600 mt-2">{new Date(n.createdAt).toLocaleString('en-IN')}</p>
                </div>
                {!n.isRead && <Badge variant="brand">New</Badge>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
