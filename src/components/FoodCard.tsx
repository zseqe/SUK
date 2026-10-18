import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Heart, Plus, Flame, Store } from 'lucide-react';
import { FoodItem } from '../types';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/price';

export const FoodCard: React.FC<{ food: FoodItem }> = ({ food }) => {
  const { addToCart, favorites, toggleFavorite, canteens } = useApp();
  const isFav = favorites.includes(food.id);
  const canteen = canteens.find((c) => c.id === food.canteenId);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-2xl overflow-hidden shadow-warm-sm hover:shadow-warm-md transition-all duration-200 flex flex-col"
    >
      <div className="relative h-48 overflow-hidden bg-[#F2E3D5] dark:bg-[#281D15]">
        <Link to={`/food/${food.id}`} className="block w-full h-full">
          <img
            src={food.image}
            alt={food.name}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
            }}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          />
        </Link>
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-md flex items-center gap-1.5 shadow-sm ${
              food.isVeg
                ? 'bg-emerald-50/95 text-emerald-800 border border-emerald-300'
                : 'bg-amber-50/95 text-amber-900 border border-amber-300'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${food.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
            {food.isVeg ? 'VEG' : 'NON-VEG'}
          </span>
          {food.popular && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#D9A94D] text-[#2D1F14] flex items-center gap-1 shadow-sm">
              <Flame className="w-3 h-3 fill-current" /> Bestseller
            </span>
          )}
        </div>
        <button
          onClick={() => toggleFavorite(food.id)}
          aria-label="Toggle Favourite"
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-[#1E1510]/80 text-[#6D4C2E] dark:text-[#D9A94D] hover:text-rose-500 shadow-sm transition-colors"
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
        {!food.available && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-3 text-center">
            <span className="px-3.5 py-1.5 bg-[#A66E2E] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
              Sold Out for Next Slot
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-[#7E6857] dark:text-[#B8A696] mb-1.5">
            <span className="flex items-center gap-1 truncate max-w-[70%] font-semibold">
              <Store className="w-3.5 h-3.5 text-[#A66E2E] shrink-0" />
              {canteen?.name || 'Campus Dining'}
            </span>
            <span className="flex items-center gap-1 font-bold text-[#A66E2E] dark:text-[#D9A94D]">
              <Clock className="w-3.5 h-3.5" /> ~{food.prepTimeMins}m
            </span>
          </div>
          <Link
            to={`/food/${food.id}`}
            className="font-display font-bold text-base text-[#2B1D12] dark:text-[#F8F3ED] hover:text-[#A66E2E] dark:hover:text-[#D9A94D] line-clamp-1 transition-colors"
          >
            {food.name}
          </Link>
          <p className="text-xs text-[#7E6857] dark:text-[#B8A696] mt-1 line-clamp-2 leading-relaxed">
            {food.description}
          </p>
        </div>

        <div className="pt-4 mt-3 border-t border-[#E6CFBC]/60 dark:border-[#3D2D1F] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#7E6857] dark:text-[#B8A696] block leading-none">Price</span>
            <span className="text-lg font-display font-black text-[#2B1D12] dark:text-[#F8F3ED]">
              {formatINR(food.price)}
            </span>
          </div>
          <button
            disabled={!food.available}
            onClick={() => addToCart(food, 1, [])}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              food.available
                ? 'bg-[#6D4C2E] hover:bg-[#A66E2E] text-[#F2E3D5] shadow-warm-sm active:scale-95'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Plus className="w-4 h-4 text-[#D9A94D]" /> Add
          </button>
        </div>
      </div>
    </motion.div>
  );
};