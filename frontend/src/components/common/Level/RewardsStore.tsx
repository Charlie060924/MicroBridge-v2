"use client";

import React, { useState } from "react";
import { useLevel } from "@/hooks/useLevel";
import { Coins, ShoppingCart, Gift, Star, Zap, Shield, Bot, Users, Lock, X } from "lucide-react";
import CareerCoinsDisplay from "./CareerCoinsDisplay";

interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  category: 'boost' | 'cosmetic' | 'utility' | 'premium';
  levelRequired: number;
  stock?: number; // undefined means unlimited
}

const STORE_ITEMS: StoreItem[] = [
  // Boosts
  {
    id: "xp_boost_1h",
    name: "XP Boost (1 Hour)",
    description: "Double XP gain for 1 hour",
    price: 50,
    icon: "⚡",
    category: "boost",
    levelRequired: 1
  },
  {
    id: "xp_boost_24h",
    name: "XP Boost (24 Hours)",
    description: "Double XP gain for 24 hours",
    price: 500,
    icon: "⚡",
    category: "boost",
    levelRequired: 5
  },
  {
    id: "application_boost",
    name: "Application Boost",
    description: "Increase your application visibility",
    price: 200,
    icon: "📈",
    category: "boost",
    levelRequired: 3
  },
  
  // Utility
  {
    id: "streak_freeze",
    name: "Streak Freeze",
    description: "Protect your streak for 1 day",
    price: 100,
    icon: "🛡️",
    category: "utility",
    levelRequired: 2
  },
  {
    id: "resume_review",
    name: "AI Resume Review",
    description: "Get AI-powered resume feedback",
    price: 300,
    icon: "🤖",
    category: "utility",
    levelRequired: 8
  },
  {
    id: "skill_certification",
    name: "Skill Certification",
    description: "Get certified in a skill",
    price: 1000,
    icon: "🏆",
    category: "utility",
    levelRequired: 15
  },
  
  // Cosmetic
  {
    id: "profile_flair",
    name: "Exclusive Profile Flair",
    description: "Show off your achievements",
    price: 250,
    icon: "✨",
    category: "cosmetic",
    levelRequired: 10
  },
  {
    id: "guild_banner",
    name: "Guild Banner",
    description: "Custom guild banner design",
    price: 500,
    icon: "🎨",
    category: "cosmetic",
    levelRequired: 18
  },
  
  // Premium
  {
    id: "resume_spotlight",
    name: "Resume Spotlight",
    description: "Featured placement for 1 week",
    price: 1500,
    icon: "🌟",
    category: "premium",
    levelRequired: 20
  },
  {
    id: "premium_support",
    name: "Premium Support",
    description: "Priority customer support",
    price: 800,
    icon: "💎",
    category: "premium",
    levelRequired: 12
  }
];

interface RewardsStoreProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RewardsStore({ isOpen, onClose }: RewardsStoreProps) {
  const { levelData, spendCC, canAccessRewardsStore } = useLevel();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [purchaseHistory, setPurchaseHistory] = useState<string[]>([]);

  if (!isOpen) return null;

  if (!canAccessRewardsStore()) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl text-center">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Rewards Store Locked
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Reach Level 2 to unlock the Rewards Store and start spending your Career Coins!
          </p>
          <button
            onClick={onClose}
            className="w-full bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  const categories = [
    { id: 'all', name: 'All Items', icon: '🛍️' },
    { id: 'boost', name: 'Boosts', icon: '⚡' },
    { id: 'utility', name: 'Utility', icon: '🛠️' },
    { id: 'cosmetic', name: 'Cosmetic', icon: '✨' },
    { id: 'premium', name: 'Premium', icon: '💎' }
  ];

  const filteredItems = STORE_ITEMS.filter(item => 
    selectedCategory === 'all' || item.category === selectedCategory
  );

  const handlePurchase = (item: StoreItem) => {
    if (levelData.level < item.levelRequired) {
      alert(`You need to be Level ${item.levelRequired} to purchase this item.`);
      return;
    }

    if (levelData.careerCoins < item.price) {
      alert('Not enough Career Coins!');
      return;
    }

    const success = spendCC(item.price);
    if (success) {
      setPurchaseHistory(prev => [...prev, item.id]);
      alert(`Successfully purchased ${item.name}!`);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'boost': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'utility': return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'cosmetic': return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200';
      case 'premium': return 'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200';
      default: return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-4xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Rewards Store</h2>
              <p className="text-gray-600 dark:text-gray-400">Spend your Career Coins</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <CareerCoinsDisplay amount={levelData.careerCoins} variant="detailed" />
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <span>{category.icon}</span>
              <span className="font-medium">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Store Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-[60vh] pr-2">
          {filteredItems.map(item => {
            const canAfford = levelData.careerCoins >= item.price;
            const canPurchase = levelData.level >= item.levelRequired;
            const isPurchased = purchaseHistory.includes(item.id);
            
            return (
              <div
                key={item.id}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  isPurchased
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : canPurchase && canAfford
                    ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md'
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 opacity-75'
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-3xl">{item.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Level {item.levelRequired}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-yellow-500" />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {item.price}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handlePurchase(item)}
                    disabled={!canPurchase || !canAfford || isPurchased}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      isPurchased
                        ? 'bg-green-500 text-white cursor-default'
                        : canPurchase && canAfford
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isPurchased ? 'Purchased' : 'Buy'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Gift className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No items available in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
