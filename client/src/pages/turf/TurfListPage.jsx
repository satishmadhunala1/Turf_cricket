import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, MapPin, X, Grid3X3 } from 'lucide-react';
import { turfApi } from '../../api/endpoints';
import TurfCard from '../../components/turf/TurfCard';
import { TurfGridSkeleton } from '../../components/ui/Skeleton';
import { PageTransition, FadeUp } from '../../components/motion/Motion';
import Button from '../../components/ui/Button';

const SORT_OPTIONS = [
  { value: 'rating', label: 'Top Rated' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'newest', label: 'Newest' },
];

const QUICK_CITIES = ['Hyderabad', 'Mumbai', 'Bangalore', 'Chennai', 'Pune'];

export default function TurfListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [turfs, setTurfs] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    search: searchParams.get('search') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minRating: searchParams.get('minRating') || '',
    sort: searchParams.get('sort') || 'rating',
    page: parseInt(searchParams.get('page')) || 1,
  });
  const [showFilters, setShowFilters] = useState(false);

  const activeCity = filters.city;

  const fetchTurfs = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
      const { data } = await turfApi.getAll(params);
      setTurfs(data.data || []);
      setPagination(data.pagination || {});
    } catch {
      setTurfs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTurfs(); }, [filters]);

  const applyFilters = () => {
    const params = {};
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    setSearchParams(params);
    setFilters((f) => ({ ...f, page: 1 }));
  };

  const selectCity = (city) => {
    const next = { ...filters, city: city === filters.city ? '' : city, page: 1 };
    setFilters(next);
    const params = {};
    Object.entries(next).forEach(([k, v]) => { if (v) params[k] = v; });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({ city: '', search: '', minPrice: '', maxPrice: '', minRating: '', sort: 'rating', page: 1 });
    setSearchParams({});
  };

  const hasActiveFilters = filters.city || filters.search || filters.minPrice || filters.maxPrice || filters.minRating;

  return (
    <PageTransition className="min-h-screen bg-slate-50">
      {/* Page header banner */}
      <div className="bg-gradient-to-br from-brand-600 via-brand-700 to-emerald-800 text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <div className="flex items-center gap-2 text-brand-200 text-sm mb-3">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-white">Find Turfs</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold">
              {activeCity ? `Turfs in ${activeCity}` : 'Find Your Perfect Turf'}
            </h1>
            <p className="text-brand-100 mt-3 text-lg max-w-xl">
              {activeCity
                ? `Browse premium cricket venues in ${activeCity}`
                : 'Discover and book premium cricket venues across India'}
            </p>
          </FadeUp>

          {/* Search bar in hero */}
          <FadeUp delay={1}>
            <div className="mt-8 bg-white rounded-2xl shadow-xl p-2 max-w-3xl flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center gap-3 px-4 py-3">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  placeholder="Search by name or area..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                  className="w-full text-slate-900 placeholder:text-slate-400 focus:outline-none text-sm"
                />
              </div>
              <div className="flex items-center gap-3 px-4 py-3 sm:border-l border-slate-100">
                <MapPin className="w-5 h-5 text-brand-600 shrink-0" />
                <input
                  placeholder="City"
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                  className="w-full min-w-[100px] text-slate-900 placeholder:text-slate-400 focus:outline-none text-sm"
                />
              </div>
              <Button onClick={applyFilters} className="shrink-0 min-h-[44px]">
                <Search className="w-4 h-4" /> Search
              </Button>
            </div>
          </FadeUp>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* City chips + filter bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {QUICK_CITIES.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => selectCity(city)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filters.city === city
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-300 hover:text-brand-700'
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                showFilters ? 'bg-brand-50 border-brand-300 text-brand-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
            <select
              value={filters.sort}
              onChange={(e) => {
                const sort = e.target.value;
                setFilters((f) => ({ ...f, sort, page: 1 }));
              }}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm text-slate-700 focus:outline-none focus:border-brand-400"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Expandable filters panel */}
        {showFilters && (
          <FadeUp>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Min Price (₹)</label>
                <input type="number" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400" placeholder="0" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Max Price (₹)</label>
                <input type="number" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400" placeholder="5000" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Min Rating</label>
                <input type="number" step="0.1" min="0" max="5" value={filters.minRating} onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400" placeholder="4.0" />
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={applyFilters} className="flex-1">Apply</Button>
                {hasActiveFilters && (
                  <button type="button" onClick={clearFilters} className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-200">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </FadeUp>
        )}

        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-slate-600">
            <Grid3X3 className="w-4 h-4" />
            <span className="text-sm font-medium">
              {loading ? 'Loading...' : `${pagination.total || turfs.length} turf${(pagination.total || turfs.length) !== 1 ? 's' : ''} found`}
            </span>
          </div>
          {hasActiveFilters && (
            <button type="button" onClick={clearFilters} className="text-sm text-brand-600 hover:underline font-medium">
              Clear all filters
            </button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <TurfGridSkeleton />
        ) : turfs.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-100">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto">
              <MapPin className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-xl font-semibold text-slate-800 mt-6">No turfs found</p>
            <p className="text-slate-500 mt-2 text-sm">Try a different city or adjust your filters</p>
            <Button className="mt-6" onClick={clearFilters}>Reset Filters</Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {turfs.map((turf, i) => <TurfCard key={turf._id} turf={turf} index={i} />)}
            </div>

            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                {Array.from({ length: pagination.pages }, (_, i) => (
                  <Button
                    key={i}
                    variant={filters.page === i + 1 ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setFilters({ ...filters, page: i + 1 })}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </PageTransition>
  );
}
