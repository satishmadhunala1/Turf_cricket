import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, Heart, ChevronLeft, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { turfApi, userApi } from '../../api/endpoints';
import { useAuth } from '../../context/AuthContext';
import { PageTransition, FadeUp } from '../../components/motion/Motion';
import { Skeleton } from '../../components/ui/Skeleton';
import TurfImage from '../../components/ui/TurfImage';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

export default function TurfDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [turf, setTurf] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [nearby, setNearby] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      turfApi.getById(id),
      turfApi.getReviews(id, { limit: 5 }),
      turfApi.getNearby(id),
    ]).then(([t, r, n]) => {
      setTurf(t.data.data);
      setReviews(r.data.data || []);
      setNearby(n.data.data || []);
    }).catch(() => toast.error('Turf not found')).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id || !selectedDate) return;
    turfApi.getAvailability(id, selectedDate).then(({ data }) => {
      setSlots(data.data?.slots || []);
      setSelectedSlot(null);
    }).catch(() => setSlots([]));
  }, [id, selectedDate]);

  const handleFavorite = async () => {
    if (!isAuthenticated) return navigate('/login');
    try {
      await userApi.toggleFavorite(id);
      toast.success('Updated favorites');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleBook = () => {
    if (!isAuthenticated) return navigate('/login');
    if (!selectedSlot) return toast.error('Select a time slot');
    navigate(`/book/${id}`, {
      state: { date: selectedDate, slot: selectedSlot, turf },
    });
  };

  if (loading) return (
    <div className="pt-24 px-4 max-w-7xl mx-auto space-y-6">
      <Skeleton className="h-96 w-full" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-32 w-full" />
    </div>
  );

  if (!turf) return null;

  const images = turf.images?.length ? turf.images : [turf.coverImage];

  return (
    <PageTransition className="pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/turfs" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white mb-6">
          <ChevronLeft className="w-4 h-4" /> Back to turfs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <div className="glass-card rounded-2xl overflow-hidden">
              <TurfImage src={images[activeImage]} alt={turf.name} className="w-full h-72 lg:h-96 object-cover" />
              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImage(i)} className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 ${activeImage === i ? 'border-brand-500' : 'border-transparent'}`}>
                      <TurfImage src={img} alt="" index={i} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <FadeUp>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="font-display text-3xl font-bold">{turf.name}</h1>
                  <p className="flex items-center gap-1 text-slate-400 mt-2">
                    <MapPin className="w-4 h-4" /> {turf.location.address}, {turf.location.area}, {turf.location.city}
                  </p>
                </div>
                <button onClick={handleFavorite} className="p-3 glass rounded-xl hover:text-red-400 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span className="font-semibold">{turf.rating?.toFixed(1)}</span>
                  <span className="text-slate-500 text-sm">({turf.reviewCount} reviews)</span>
                </div>
                <Badge variant="brand">{turf.sport}</Badge>
                <Badge>{turf.size}</Badge>
              </div>
            </FadeUp>

            <FadeUp>
              <div className="glass-card rounded-2xl p-6">
                <h2 className="font-semibold text-lg mb-3">About</h2>
                <p className="text-slate-300 leading-relaxed">{turf.description}</p>
              </div>
            </FadeUp>

            <FadeUp>
              <div className="glass-card rounded-2xl p-6">
                <h2 className="font-semibold text-lg mb-4">Facilities & Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[...(turf.facilities || []), ...(turf.amenities || [])].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-slate-300">
                      <Check className="w-4 h-4 text-brand-500 shrink-0" /> {item}
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>

            {/* Reviews */}
            <FadeUp>
              <div className="glass-card rounded-2xl p-6">
                <h2 className="font-semibold text-lg mb-4">Reviews</h2>
                {reviews.length === 0 ? (
                  <p className="text-slate-500 text-sm">No reviews yet</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((r) => (
                      <div key={r._id} className="border-b border-white/5 pb-4 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-sm font-semibold">
                            {r.user?.name?.[0]}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{r.user?.name}</p>
                            <div className="flex gap-0.5">
                              {Array.from({ length: r.rating }).map((_, i) => (
                                <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                              ))}
                            </div>
                          </div>
                        </div>
                        {r.comment && <p className="text-sm text-slate-400 mt-2">{r.comment}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </FadeUp>

            {/* Nearby */}
            {nearby.length > 0 && (
              <FadeUp>
                <h2 className="font-semibold text-lg mb-4">Nearby Turfs</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {nearby.map((t) => (
                    <Link key={t._id} to={`/turfs/${t._id}`} className="glass-card rounded-xl p-4 flex gap-4 hover:border-brand-500/30 transition-colors">
                      <TurfImage src={t.coverImage} alt="" index={0} className="w-20 h-20 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium">{t.name}</p>
                        <p className="text-sm text-slate-500">{t.location?.area}</p>
                        <p className="text-brand-400 font-semibold mt-1">₹{t.pricePerHour}/hr</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </FadeUp>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl p-6 sticky top-24 space-y-5">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-bold text-brand-400">₹{turf.pricePerHour}</span>
                  <span className="text-slate-500 text-sm"> / hour</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-slate-400">
                  <Clock className="w-4 h-4" />
                  {turf.operatingHours?.open} – {turf.operatingHours?.close}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-brand-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Available Slots</label>
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                  {slots.length === 0 ? (
                    <p className="col-span-2 text-sm text-slate-500 py-4 text-center">No slots available</p>
                  ) : (
                    slots.map((slot) => (
                      <button
                        key={`${slot.startTime}-${slot.endTime}`}
                        disabled={!slot.isAvailable}
                        onClick={() => setSelectedSlot(slot)}
                        className={`px-3 py-2 rounded-lg text-sm transition-all ${
                          selectedSlot?.startTime === slot.startTime
                            ? 'bg-brand-500 text-white'
                            : slot.isAvailable
                            ? 'glass hover:border-brand-500/50 text-slate-300'
                            : 'opacity-30 cursor-not-allowed line-through'
                        }`}
                      >
                        {slot.startTime} – {slot.endTime}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {selectedSlot && (
                <div className="border-t border-white/5 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-slate-400">Slot</span><span>{selectedSlot.startTime} – {selectedSlot.endTime}</span></div>
                  <div className="flex justify-between font-semibold text-lg"><span>Total</span><span className="text-brand-400">₹{selectedSlot.price}</span></div>
                </div>
              )}

              <Button className="w-full" size="lg" onClick={handleBook} disabled={!selectedSlot}>
                Book Instantly
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
