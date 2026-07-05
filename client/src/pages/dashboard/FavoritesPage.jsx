import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { userApi } from '../../api/endpoints';
import TurfCard from '../../components/turf/TurfCard';
import { TurfGridSkeleton } from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userApi.getProfile().then(({ data }) => setFavorites(data.data?.favorites || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <TurfGridSkeleton count={3} />;

  if (favorites.length === 0) {
    return (
      <div className="text-center py-16">
        <Heart className="w-12 h-12 text-slate-600 mx-auto" />
        <p className="text-slate-400 mt-4">No favourite turfs yet</p>
        <Link to="/turfs"><Button className="mt-4">Explore Turfs</Button></Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Favourite Turfs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((t) => <TurfCard key={t._id} turf={t} />)}
      </div>
    </div>
  );
}
