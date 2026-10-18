import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  RotateCcw,
  Users,
  Store,
  Settings,
  User,
  Heart,
  ClipboardList,
  LogOut,
  Plus,
  Trash2,
  Wallet,
  CheckCircle2,
  BellRing,
  Download
} from 'lucide-react';
import { FoodCard } from '../components/FoodCard';
import { formatINR } from '../utils/price';
import { useApp } from '../context/AppContext';
import { Canteen, StaffUser, FoodItem } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const {
    orders,
    canteens,
    staffUsers,
    settings,
    upsertCanteen,
    upsertStaffUser,
    removeStaffUser,
    updateSettings,
    resetToDefaultData
  } = useApp();

  const [confirmReset, setConfirmReset] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<'Student' | 'Canteen Operator' | 'Campus Admin'>('Student');
  const [newUserDept, setNewUserDept] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;
    upsertStaffUser({
      id: `u-${Date.now()}`,
      name: newUserName,
      role: newUserRole,
      departmentOrCanteen: newUserDept || 'General Campus',
      email: newUserEmail,
      status: 'Active'
    });
    setNewUserName('');
    setNewUserDept('');
    setNewUserEmail('');
  };

  const exportAuditReport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ orders, canteens, staffUsers, settings }, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `campusbite_audit_${new Date().toISOString().split('T')[0]}.json`);
    dlAnchorElem.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* SaaS Admin Banner */}
      <div className="bg-gradient-to-r from-[#2D1F14] via-[#3D291C] to-[#2D1F14] text-[#F2E3D5] rounded-3xl p-8 sm:p-10 shadow-warm-lg border border-[#4D331D] flex flex-wrap items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 rounded-full bg-[#1F150D] text-[#D9A94D] text-xs font-black uppercase tracking-wider border border-[#4D331D]">
            Enterprise Administration Suite
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-black mt-2 text-white">
            Campus Dining Operations Console
          </h1>
          <p className="text-xs sm:text-sm text-[#E6CFBC]/80 mt-1">
            Centrally manage university canteen venues, authorized operators, student directories, and fee parameters.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportAuditReport}
            className="px-4 py-2.5 rounded-2xl bg-[#D9A94D] hover:bg-[#C78F3B] text-[#2D1F14] text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <Download className="w-4 h-4" /> Export Operations Audit
          </button>

          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-[#F2E3D5] text-xs font-bold flex items-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4 text-[#D9A94D]" /> Restore Baseline
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-[#1F150D] p-2 rounded-2xl border border-[#4D331D]">
              <span className="text-xs font-bold px-2 text-[#E6CFBC]">Reset catalog?</span>
              <button
                onClick={() => {
                  resetToDefaultData();
                  setConfirmReset(false);
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-extrabold"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="px-3 py-1.5 rounded-xl bg-white/10 text-xs"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl p-6 shadow-warm-sm">
          <span className="text-xs text-[#7E6857] dark:text-[#B8A696] font-semibold">Total Campus Orders</span>
          <p className="font-display text-3xl font-black text-[#2B1D12] dark:text-white mt-1">{orders.length}</p>
        </div>
        <div className="bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl p-6 shadow-warm-sm">
          <span className="text-xs text-[#7E6857] dark:text-[#B8A696] font-semibold">Active Canteen Hubs</span>
          <p className="font-display text-3xl font-black text-[#A66E2E] dark:text-[#D9A94D] mt-1">
            {canteens.filter((c: Canteen) => c.isOpen).length} / {canteens.length}
          </p>
        </div>
        <div className="bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl p-6 shadow-warm-sm">
          <span className="text-xs text-[#7E6857] dark:text-[#B8A696] font-semibold">Directory Members</span>
          <p className="font-display text-3xl font-black text-[#2B1D12] dark:text-white mt-1">{staffUsers.length}</p>
        </div>
        <div className="bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl p-6 shadow-warm-sm">
          <span className="text-xs text-[#7E6857] dark:text-[#B8A696] font-semibold">Platform Fee Rate</span>
          <p className="font-display text-3xl font-black text-[#6D4C2E] dark:text-[#D9A94D] mt-1">₹{settings.platformFeeRs}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Canteen Vendor Management */}
        <div className="lg:col-span-6 bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl p-6 space-y-4 shadow-warm-sm">
          <h2 className="font-display font-extrabold text-base text-[#2B1D12] dark:text-white flex items-center gap-2">
            <Store className="w-4 h-4 text-[#A66E2E]" /> Canteen Operating Status
          </h2>
          <div className="space-y-3">
            {canteens.map((c: Canteen) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl border border-[#E6CFBC] dark:border-[#3D2D1F] flex items-center justify-between gap-3"
              >
                <div>
                  <p className="font-display font-bold text-sm text-[#2B1D12] dark:text-white">{c.name}</p>
                  <p className="text-xs text-[#7E6857] dark:text-[#B8A696]">{c.location} • Prep: {c.prepEstimate}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => upsertCanteen({ ...c, isOpen: !c.isOpen })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      c.isOpen
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                    }`}
                  >
                    {c.isOpen ? 'Active' : 'Offline'}
                  </button>
                  <Link
                    to={`/canteen/${c.id}`}
                    className="px-3 py-1.5 rounded-xl border border-[#E6CFBC] text-xs font-semibold hover:bg-[#FAF6F0]"
                  >
                    Menu
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Platform Settings */}
        <div className="lg:col-span-6 bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl p-6 space-y-4 shadow-warm-sm">
          <h2 className="font-display font-extrabold text-base text-[#2B1D12] dark:text-white flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#A66E2E]" /> University Dining Parameters
          </h2>
          <div className="space-y-3.5 text-xs">
            <div>
              <label className="font-bold block mb-1 text-[#2B1D12] dark:text-white">Platform Brand Name</label>
              <input
                type="text"
                value={settings.brandName}
                onChange={(e) => updateSettings({ brandName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E6CFBC] bg-[#FAF6F0] dark:bg-[#140E0A] text-[#2B1D12] dark:text-white"
              />
            </div>
            <div>
              <label className="font-bold block mb-1 text-[#2B1D12] dark:text-white">Operating Window Schedule</label>
              <input
                type="text"
                value={settings.operatingHours}
                onChange={(e) => updateSettings({ operatingHours: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E6CFBC] bg-[#FAF6F0] dark:bg-[#140E0A] text-[#2B1D12] dark:text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold block mb-1 text-[#2B1D12] dark:text-white">Campus Fee (₹)</label>
                <input
                  type="number"
                  value={settings.platformFeeRs}
                  onChange={(e) => updateSettings({ platformFeeRs: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E6CFBC] bg-[#FAF6F0] dark:bg-[#140E0A] text-[#2B1D12] dark:text-white"
                />
              </div>
              <div>
                <label className="font-bold block mb-1 text-[#2B1D12] dark:text-white">Default Lead Time (mins)</label>
                <input
                  type="number"
                  value={settings.defaultPickupLeadMins}
                  onChange={(e) => updateSettings({ defaultPickupLeadMins: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E6CFBC] bg-[#FAF6F0] dark:bg-[#140E0A] text-[#2B1D12] dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="font-bold block mb-1 text-[#2B1D12] dark:text-white">Campus Dining Broadcast Notice</label>
              <input
                type="text"
                value={settings.systemNotice}
                onChange={(e) => updateSettings({ systemNotice: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E6CFBC] bg-[#FAF6F0] dark:bg-[#140E0A] text-[#2B1D12] dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Directory Users Management */}
      <div className="bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl p-6 space-y-6 shadow-warm-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-extrabold text-base text-[#2B1D12] dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-[#A66E2E]" /> Authorized Staff & Members Directory
            </h2>
            <p className="text-xs text-[#7E6857] dark:text-[#B8A696]">Role assignments across students, canteen kitchen operators, and campus admins.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E6CFBC] dark:border-[#3D2D1F] text-[#7E6857] dark:text-[#B8A696]">
                <th className="py-2.5 px-3">Name</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Department / Canteen</th>
                <th className="py-2.5 px-3">Email</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6CFBC]/60 dark:divide-[#3D2D1F]">
              {staffUsers.map((u: StaffUser) => (
                <tr key={u.id} className="hover:bg-[#FAF6F0] dark:hover:bg-[#281D15]">
                  <td className="py-3 px-3 font-bold text-[#2B1D12] dark:text-white">{u.name}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md bg-[#F2E3D5] text-[#6D4C2E] font-bold text-[10px]">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#7E6857] dark:text-[#B8A696]">{u.departmentOrCanteen}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-[#A66E2E]">{u.email}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => removeStaffUser(u.id)}
                      className="p-1 text-rose-500 hover:text-rose-700"
                      title="Remove member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add User Form */}
        <form onSubmit={handleAddUser} className="pt-4 border-t border-[#E6CFBC] dark:border-[#3D2D1F] space-y-3">
          <h3 className="font-display font-bold text-sm text-[#2B1D12] dark:text-white">Register Directory Member</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="text"
              required
              placeholder="Full Name"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-[#E6CFBC] text-xs bg-[#FAF6F0] dark:bg-[#140E0A]"
            />
            <input
              type="email"
              required
              placeholder="Campus Email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-[#E6CFBC] text-xs bg-[#FAF6F0] dark:bg-[#140E0A]"
            />
            <input
              type="text"
              placeholder="Department or Assigned Canteen"
              value={newUserDept}
              onChange={(e) => setNewUserDept(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-[#E6CFBC] text-xs bg-[#FAF6F0] dark:bg-[#140E0A]"
            />
            <select
              value={newUserRole}
              onChange={(e) => setNewUserRole(e.target.value as any)}
              className="px-3.5 py-2 rounded-xl border border-[#E6CFBC] text-xs bg-[#FAF6F0] dark:bg-[#140E0A]"
            >
              <option value="Student">Student</option>
              <option value="Canteen Operator">Canteen Operator</option>
              <option value="Campus Admin">Campus Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#6D4C2E] text-[#F2E3D5] text-xs font-bold hover:bg-[#A66E2E]"
          >
            Add Member
          </button>
        </form>
      </div>
    </div>
  );
};

export const ProfilePage: React.FC = () => {
  const { profile, updateProfile, orders, favorites, foods } = useApp();
  const [name, setName] = useState(profile.name);
  const [studentId, setStudentId] = useState(profile.studentId);
  const [department, setDepartment] = useState(profile.department);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [dietary, setDietary] = useState(profile.dietaryPreference);
  const [notifications, setNotifications] = useState(profile.notificationsEnabled);
  const [topUpAmount, setTopUpAmount] = useState(500);

  const favFoods = foods.filter((f: FoodItem) => favorites.includes(f.id));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      studentId,
      department,
      email,
      phone,
      dietaryPreference: dietary,
      notificationsEnabled: notifications
    });
  };

  const handleTopUpMealCard = () => {
    updateProfile({ mealCardBalance: profile.mealCardBalance + topUpAmount });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#A66E2E] dark:text-[#D9A94D]">
          Student Account & Preferences
        </span>
        <h1 className="font-display text-3xl font-black text-[#2B1D12] dark:text-white mt-1">
          Campus Dining Account
        </h1>
        <p className="text-xs text-[#7E6857] dark:text-[#B8A696] mt-0.5">
          Manage your student pass, meal card balance, and break pickup preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Meal Card & Quick Stats */}
        <div className="lg:col-span-5 space-y-6">
          {/* Virtual Campus Meal Card */}
          <div className="bg-gradient-to-br from-[#6D4C2E] via-[#523820] to-[#2D1F14] text-white rounded-3xl p-6 shadow-warm-lg space-y-6 relative overflow-hidden border border-[#D9A94D]/30">
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#D9A94D]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#D9A94D] block">University Card</span>
                <span className="font-display font-extrabold text-base">CampusBite Meal Pass</span>
              </div>
              <Wallet className="w-6 h-6 text-[#D9A94D]" />
            </div>

            <div className="pt-4">
              <span className="text-[10px] uppercase font-semibold text-[#E6CFBC] block">Available Meal Balance</span>
              <span className="font-display font-black text-3xl text-white">{formatINR(profile.mealCardBalance)}</span>
            </div>

            <div className="flex justify-between items-end text-xs pt-2 border-t border-white/10">
              <div>
                <span className="text-[9px] uppercase text-[#E6CFBC] block">Student Name</span>
                <span className="font-bold">{profile.name}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] uppercase text-[#E6CFBC] block">Roll ID</span>
                <span className="font-mono font-bold">{profile.studentId}</span>
              </div>
            </div>
          </div>

          {/* Quick Top-Up Widget */}
          <div className="bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl p-6 shadow-warm-sm space-y-3">
            <h3 className="font-display font-bold text-sm text-[#2B1D12] dark:text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#A66E2E]" /> Recharge Meal Balance
            </h3>
            <p className="text-xs text-[#7E6857] dark:text-[#B8A696]">Instant digital recharge via UPI or NetBanking.</p>
            <div className="flex items-center gap-2">
              {[200, 500, 1000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setTopUpAmount(amt)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    topUpAmount === amt
                      ? 'bg-[#6D4C2E] text-white shadow-sm'
                      : 'border border-[#E6CFBC] text-[#7E6857]'
                  }`}
                >
                  +{formatINR(amt)}
                </button>
              ))}
            </div>
            <button
              onClick={handleTopUpMealCard}
              className="w-full py-2.5 rounded-xl bg-[#6D4C2E] hover:bg-[#A66E2E] text-[#F2E3D5] text-xs font-bold transition-colors"
            >
              Add {formatINR(topUpAmount)} to Meal Card
            </button>
          </div>
        </div>

        {/* Right Column: Profile Preferences Form */}
        <div className="lg:col-span-7 bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl p-6 sm:p-8 shadow-warm-sm space-y-6">
          <h2 className="font-display font-extrabold text-base text-[#2B1D12] dark:text-white">
            Student Profile Details
          </h2>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold block mb-1 text-[#2B1D12] dark:text-white">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6CFBC] bg-[#FAF6F0] dark:bg-[#140E0A] text-[#2B1D12] dark:text-white"
                />
              </div>
              <div>
                <label className="font-bold block mb-1 text-[#2B1D12] dark:text-white">Student Roll ID</label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6CFBC] bg-[#FAF6F0] dark:bg-[#140E0A] text-[#2B1D12] dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold block mb-1 text-[#2B1D12] dark:text-white">Campus Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6CFBC] bg-[#FAF6F0] dark:bg-[#140E0A] text-[#2B1D12] dark:text-white"
                />
              </div>
              <div>
                <label className="font-bold block mb-1 text-[#2B1D12] dark:text-white">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6CFBC] bg-[#FAF6F0] dark:bg-[#140E0A] text-[#2B1D12] dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="font-bold block mb-1 text-[#2B1D12] dark:text-white">Academic Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6CFBC] bg-[#FAF6F0] dark:bg-[#140E0A] text-[#2B1D12] dark:text-white"
              />
            </div>

            <div className="pt-2 border-t border-[#E6CFBC] dark:border-[#3D2D1F] space-y-3">
              <h3 className="font-display font-bold text-sm text-[#2B1D12] dark:text-white">Dining Preferences</h3>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="dietary"
                    checked={dietary === 'All'}
                    onChange={() => setDietary('All')}
                    className="accent-[#6D4C2E]"
                  />
                  <span className="font-semibold">All Menu Items (Veg & Non-Veg)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="dietary"
                    checked={dietary === 'Veg Only'}
                    onChange={() => setDietary('Veg Only')}
                    className="accent-[#6D4C2E]"
                  />
                  <span className="font-semibold">100% Pure Vegetarian Only</span>
                </label>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                    className="accent-[#6D4C2E] w-4 h-4 rounded"
                  />
                  <span className="font-semibold">Receive push notifications when order status updates to "Ready for Pickup"</span>
                </label>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-[#6D4C2E] hover:bg-[#A66E2E] text-[#F2E3D5] text-xs font-bold transition-colors shadow-warm-sm"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Saved Favourites */}
      {favFoods.length > 0 && (
        <div className="pt-8 border-t border-[#E6CFBC] dark:border-[#3D2D1F]">
          <h2 className="font-display text-2xl font-black text-[#2B1D12] dark:text-white mb-6">
            Your Favourite Campus Meals ({favFoods.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favFoods.map((f: FoodItem) => (
              <FoodCard key={f.id} food={f} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};