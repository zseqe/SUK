import React, { useState, useMemo } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  X,
  Clock,
  Store,
  ArrowLeft,
  Plus,
  Minus,
  Heart,
  ShieldAlert,
  Check,
  Star,
  MapPin,
  Flame,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/seed';
import { FoodCard } from '../components/FoodCard';
import { AddOn, CategoryId } from '../types';
import { formatINR } from '../utils/price';

export const MenuPage: React.FC<{ forcedCategory?: CategoryId; forcedSearch?: boolean }> = ({
  forcedCategory,
  forcedSearch
}) => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [searchParams] = useSearchParams();
  const initialQ = searchParams.get('q') || '';

  const { foods, canteens } = useApp();
  const [query, setQuery] = useState(initialQ);
  const [selectedCategory, setSelectedCategory] = useState<string>(forcedCategory || categoryId || 'all');
  const [selectedCanteen, setSelectedCanteen] = useState<string>('all');
  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'nonveg'>('all');
  const [maxPrice, setMaxPrice] = useState<number>(250);
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [onlyPopular, setOnlyPopular] = useState<boolean>(false);
  const [maxPrep, setMaxPrep] = useState<number>(20);
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'prep' | 'alpha'>('popular');

  React.useEffect(() => {
    if (categoryId) setSelectedCategory(categoryId);
  }, [categoryId]);

  React.useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) setQuery(q);
  }, [searchParams]);

  const filteredFoods = useMemo(() => {
    return foods
      .filter((item) => {
        if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
        if (selectedCanteen !== 'all' && item.canteenId !== selectedCanteen) return false;
        if (dietFilter === 'veg' && !item.isVeg) return false;
        if (dietFilter === 'nonveg' && item.isVeg) return false;
        if (item.price > maxPrice) return false;
        if (onlyAvailable && !item.available) return false;
        if (onlyPopular && !item.popular) return false;
        if (item.prepTimeMins > maxPrep) return false;
        if (query.trim()) {
          const q = query.toLowerCase();
          const canteenName = canteens.find((c) => c.id === item.canteenId)?.name.toLowerCase() || '';
          const match =
            item.name.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q) ||
            canteenName.includes(q);
          if (!match) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return Number(b.popular) - Number(a.popular);
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'prep') return a.prepTimeMins - b.prepTimeMins;
        return a.name.localeCompare(b.name);
      });
  }, [foods, canteens, selectedCategory, selectedCanteen, dietFilter, maxPrice, onlyAvailable, onlyPopular, maxPrep, query, sortBy]);

  const clearFilters = () => {
    setQuery('');
    setSelectedCategory('all');
    setSelectedCanteen('all');
    setDietFilter('all');
    setMaxPrice(250);
    setOnlyAvailable(false);
    setOnlyPopular(false);
    setMaxPrep(20);
    setSortBy('popular');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#A66E2E] dark:text-[#D9A94D]">
            {forcedSearch ? 'Instant Campus Search' : 'Campus Dining Catalog'}
          </span>
          <h1 className="font-display text-3xl font-black text-[#2B1D12] dark:text-white mt-1">
            {selectedCategory !== 'all'
              ? CATEGORIES.find((c) => c.id === selectedCategory)?.name || 'Explore Menu'
              : 'Explore Campus Menu'}
          </h1>
          <p className="text-xs sm:text-sm text-[#7E6857] dark:text-[#B8A696] mt-1">
            Showing {filteredFoods.length} of {foods.length} freshly prepared dishes across all 4 dining hubs.
          </p>
        </div>

        {/* Search Input with Instant Clear */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#A66E2E] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dish, ingredient, or canteen..."
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] text-xs sm:text-sm text-[#2B1D12] dark:text-white outline-none focus:border-[#A66E2E] shadow-warm-sm"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7E6857] hover:text-[#2B1D12]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
            selectedCategory === 'all'
              ? 'bg-[#6D4C2E] text-[#F2E3D5] shadow-sm'
              : 'bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] text-[#7E6857] dark:text-[#B8A696] hover:bg-[#F2E3D5]/40'
          }`}
        >
          All Categories
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
              selectedCategory === cat.id
                ? 'bg-[#6D4C2E] text-[#F2E3D5] shadow-sm'
                : 'bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] text-[#7E6857] dark:text-[#B8A696] hover:bg-[#F2E3D5]/40'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Multi-Filter Bar */}
      <div className="bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-center shadow-warm-sm">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#7E6857] dark:text-[#B8A696] block mb-1">
            Canteen Hub
          </label>
          <select
            value={selectedCanteen}
            onChange={(e) => setSelectedCanteen(e.target.value)}
            className="w-full text-xs font-semibold rounded-xl bg-[#FAF6F0] dark:bg-[#140E0A] border border-[#E6CFBC] dark:border-[#3D2D1F] p-2 text-[#2B1D12] dark:text-white outline-none"
          >
            <option value="all">All Canteens</option>
            {canteens.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#7E6857] dark:text-[#B8A696] block mb-1">
            Dietary Filter
          </label>
          <select
            value={dietFilter}
            onChange={(e) => setDietFilter(e.target.value as any)}
            className="w-full text-xs font-semibold rounded-xl bg-[#FAF6F0] dark:bg-[#140E0A] border border-[#E6CFBC] dark:border-[#3D2D1F] p-2 text-[#2B1D12] dark:text-white outline-none"
          >
            <option value="all">All Diets (Veg + Non-Veg)</option>
            <option value="veg">100% Pure Vegetarian</option>
            <option value="nonveg">Non-Vegetarian Only</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#7E6857] dark:text-[#B8A696] block mb-1">
            Max Price: {formatINR(maxPrice)}
          </label>
          <input
            type="range"
            min={30}
            max={250}
            step={10}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-[#6D4C2E]"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#7E6857] dark:text-[#B8A696] block mb-1">
            Max Prep Time: {maxPrep}m
          </label>
          <input
            type="range"
            min={4}
            max={20}
            step={2}
            value={maxPrep}
            onChange={(e) => setMaxPrep(Number(e.target.value))}
            className="w-full accent-[#6D4C2E]"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#7E6857] dark:text-[#B8A696] block mb-1">
            Sort Order
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full text-xs font-semibold rounded-xl bg-[#FAF6F0] dark:bg-[#140E0A] border border-[#E6CFBC] dark:border-[#3D2D1F] p-2 text-[#2B1D12] dark:text-white outline-none"
          >
            <option value="popular">Bestsellers First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="prep">Fastest Prep Time</option>
            <option value="alpha">Alphabetical (A–Z)</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={clearFilters}
            className="w-full py-2.5 text-xs font-bold text-[#A66E2E] dark:text-[#D9A94D] bg-[#F2E3D5] dark:bg-[#281D15] rounded-xl hover:bg-[#E6CFBC] transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Grid of Food Items */}
      {filteredFoods.length > 0 ? (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFoods.map((f) => (
            <FoodCard key={f.id} food={f} />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl p-8">
          <p className="font-display font-bold text-lg text-[#2B1D12] dark:text-white">
            No dishes match your active criteria
          </p>
          <p className="text-xs text-[#7E6857] dark:text-[#B8A696] mt-1 mb-4">
            Try adjusting your search query, price limit, or preparation time.
          </p>
          <button
            onClick={clearFilters}
            className="px-5 py-2.5 rounded-xl bg-[#6D4C2E] text-[#F2E3D5] text-xs font-bold"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export const FoodDetailPage: React.FC = () => {
  const { foodId } = useParams<{ foodId: string }>();
  const navigate = useNavigate();
  const { foods, canteens, addToCart, favorites, toggleFavorite } = useApp();

  const food = foods.find((f) => f.id === foodId);
  const [qty, setQty] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);

  if (!food) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-2xl font-bold">Food item not found</h2>
        <p className="text-sm text-[#7E6857] mt-2">This dish is currently unavailable in the campus dining catalog.</p>
        <Link to="/menu" className="inline-block mt-6 px-6 py-2.5 rounded-xl bg-[#6D4C2E] text-[#F2E3D5] text-xs font-bold">
          Back to Menu
        </Link>
      </div>
    );
  }

  const canteen = canteens.find((c) => c.id === food.canteenId);
  const isFav = favorites.includes(food.id);
  const related = foods.filter((f) => f.category === food.category && f.id !== food.id).slice(0, 4);

  const toggleAddOn = (ao: AddOn) => {
    setSelectedAddOns((prev) =>
      prev.some((x) => x.id === ao.id) ? prev.filter((x) => x.id !== ao.id) : [...prev, ao]
    );
  };

  const addOnTotal = selectedAddOns.reduce((s, a) => s + a.price, 0);
  const unitTotal = food.price + addOnTotal;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-14">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#7E6857] dark:text-[#B8A696] hover:text-[#2B1D12] dark:hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Menu
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-6">
          <div className="rounded-3xl overflow-hidden border border-[#E6CFBC] dark:border-[#3D2D1F] bg-white dark:bg-[#1E1510] shadow-warm-md">
            <img src={food.image} alt={food.name} className="w-full h-[400px] object-cover" />
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  food.isVeg ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                {food.isVeg ? '100% Vegetarian' : 'Non-Vegetarian'}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F2E3D5] dark:bg-[#281D15] text-[#6D4C2E] dark:text-[#D9A94D]">
                {food.calories} kcal
              </span>
            </div>
            <button
              onClick={() => toggleFavorite(food.id)}
              className="px-3.5 py-1.5 rounded-xl border border-[#E6CFBC] dark:border-[#3D2D1F] text-xs font-bold flex items-center gap-1.5 text-[#6D4C2E] dark:text-[#D9A94D] hover:bg-[#F2E3D5]"
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
              {isFav ? 'Saved to Favourites' : 'Save Favourite'}
            </button>
          </div>

          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-[#2B1D12] dark:text-white">{food.name}</h1>
            <Link
              to={`/canteen/${food.canteenId}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A66E2E] dark:text-[#D9A94D] mt-2 hover:underline"
            >
              <Store className="w-4 h-4" /> Prepared at {canteen?.name} ({canteen?.pickupCounter}) • Est. ~{food.prepTimeMins} mins
            </Link>
            <p className="text-sm text-[#7E6857] dark:text-[#B8A696] mt-3 leading-relaxed">{food.description}</p>
          </div>

          {food.allergens.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-amber-900 dark:text-amber-200 bg-[#F2E3D5]/60 dark:bg-[#281D15] border border-[#D9A94D]/40 px-4 py-3 rounded-2xl">
              <ShieldAlert className="w-4 h-4 shrink-0 text-[#A66E2E]" />
              <span>
                <strong>Allergen Notice:</strong> Contains {food.allergens.join(', ')}.
              </span>
            </div>
          )}

          {/* Add-Ons */}
          {food.addOns.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#7E6857] dark:text-[#B8A696]">
                Optional Customizations & Add-Ons
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {food.addOns.map((ao) => {
                  const active = selectedAddOns.some((x) => x.id === ao.id);
                  return (
                    <button
                      key={ao.id}
                      type="button"
                      onClick={() => toggleAddOn(ao)}
                      className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        active
                          ? 'border-[#A66E2E] bg-[#F2E3D5] dark:bg-[#281D15] ring-2 ring-[#D9A94D]/30'
                          : 'border-[#E6CFBC] dark:border-[#3D2D1F] bg-white dark:bg-[#1E1510]'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-[#2B1D12] dark:text-white">{ao.name}</p>
                        <p className="text-[11px] text-[#A66E2E] dark:text-[#D9A94D] font-semibold">
                          +{formatINR(ao.price)}
                        </p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center ${
                          active ? 'bg-[#6D4C2E] text-white' : 'border border-[#E6CFBC]'
                        }`}
                      >
                        {active && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="pt-4 border-t border-[#E6CFBC] dark:border-[#3D2D1F] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-2xl px-3 py-2 shadow-sm">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4 text-[#A66E2E]" />
              </button>
              <span className="font-bold text-sm w-6 text-center text-[#2B1D12] dark:text-white">{qty}</span>
              <button
                onClick={() => setQty(Math.min(15, qty + 1))}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4 text-[#A66E2E]" />
              </button>
            </div>

            <button
              disabled={!food.available}
              onClick={() => addToCart(food, qty, selectedAddOns)}
              className="flex-1 py-4 px-6 rounded-2xl bg-[#6D4C2E] hover:bg-[#A66E2E] disabled:bg-gray-400 text-[#F2E3D5] font-bold text-sm flex items-center justify-center gap-2 shadow-warm-md hover:scale-102 transition-all"
            >
              {food.available ? `Add to Pickup Bag • ${formatINR(unitTotal * qty)}` : 'Currently Sold Out'}
            </button>
          </div>
        </div>
      </div>

      {/* Related Dishes */}
      {related.length > 0 && (
        <div className="pt-8 border-t border-[#E6CFBC] dark:border-[#3D2D1F]">
          <h2 className="font-display text-2xl font-extrabold text-[#2B1D12] dark:text-white mb-6">
            Similar Campus Favourites
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((item) => (
              <FoodCard key={item.id} food={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const CanteensListPage: React.FC = () => {
  const { canteens, foods } = useApp();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#A66E2E] dark:text-[#D9A94D]">
          University Dining Network
        </span>
        <h1 className="font-display text-3xl font-black text-[#2B1D12] dark:text-white mt-1">
          Campus Canteens & Kitchens
        </h1>
        <p className="text-xs sm:text-sm text-[#7E6857] dark:text-[#B8A696] mt-1">
          Select your dining venue for localized express break-time ordering.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {canteens.map((c) => {
          const canteenDishes = foods.filter((f) => f.canteenId === c.id);
          return (
            <div
              key={c.id}
              className="bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl overflow-hidden shadow-warm-sm hover:shadow-warm-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-56 overflow-hidden relative">
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-bold text-xs">
                      ★ {c.rating} Rating
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 rounded-full bg-[#D9A94D] text-[#2D1F14] font-black text-xs">
                      {c.isOpen ? 'Open for Orders' : 'Closed'}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h2 className="font-display font-black text-xl text-[#2B1D12] dark:text-white">{c.name}</h2>
                  <p className="text-xs text-[#7E6857] dark:text-[#B8A696] leading-relaxed">{c.description}</p>
                  <div className="pt-2 flex flex-wrap gap-2 text-xs">
                    <span className="font-semibold text-[#A66E2E] dark:text-[#D9A94D] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Prep ~{c.prepEstimate}
                    </span>
                    <span className="text-[#7E6857]">•</span>
                    <span className="font-semibold text-[#7E6857] dark:text-[#B8A696] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {c.location}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-[#E6CFBC]/60 dark:border-[#3D2D1F] flex items-center justify-between mt-4">
                <span className="text-xs text-[#7E6857] dark:text-[#B8A696] font-bold">
                  {canteenDishes.length} items on menu
                </span>
                <Link
                  to={`/canteen/${c.id}`}
                  className="px-5 py-2.5 rounded-2xl bg-[#6D4C2E] hover:bg-[#A66E2E] text-[#F2E3D5] text-xs font-bold shadow-sm transition-all"
                >
                  View Full Menu →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const CanteenDetailPage: React.FC = () => {
  const { canteenId } = useParams<{ canteenId: string }>();
  const { canteens, foods } = useApp();
  const canteen = canteens.find((c) => c.id === canteenId);

  if (!canteen) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-2xl font-bold">Canteen not found</h2>
        <Link to="/canteens" className="inline-block mt-4 px-6 py-2 rounded-xl bg-[#6D4C2E] text-white text-xs font-bold">
          View All Canteens
        </Link>
      </div>
    );
  }

  const canteenFoods = foods.filter((f) => f.canteenId === canteen.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <div className="relative rounded-3xl overflow-hidden h-72 sm:h-96 shadow-warm-md">
        <img src={canteen.image} alt={canteen.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-6 sm:p-10 text-white">
          <span className="px-3 py-1 rounded-full bg-[#D9A94D] text-[#2D1F14] font-black text-xs w-fit mb-3">
            Express Pickup Counter: {canteen.pickupCounter}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-black">{canteen.name}</h1>
          <p className="text-xs sm:text-sm text-[#E6CFBC] max-w-2xl mt-2 leading-relaxed">
            {canteen.description}
          </p>
        </div>
      </div>

      <div>
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#A66E2E] dark:text-[#D9A94D]">
              Direct From This Kitchen
            </span>
            <h2 className="font-display text-2xl font-black text-[#2B1D12] dark:text-white mt-1">
              Available Dishes ({canteenFoods.length})
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {canteenFoods.map((f) => (
            <FoodCard key={f.id} food={f} />
          ))}
        </div>
      </div>
    </div>
  );
};