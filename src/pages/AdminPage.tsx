import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TaskItem, UserProfile } from '../types';
import { 
  ShieldAlert, 
  Users, 
  Wallet, 
  Settings, 
  CheckSquare, 
  Search, 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Plus, 
  Edit3, 
  Save, 
  AlertTriangle,
  ExternalLink,
  Bell,
  Send,
  Radio,
  Trash2
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { 
    user, 
    tasks, 
    settings, 
    allUsersList, 
    allWithdrawalsList, 
    allTransactionsList,
    adminUpdateUserBalance, 
    adminToggleUserStatus, 
    adminUpdateWithdrawalStatus,
    adminUpdateTask,
    adminAddTask,
    adminDeleteTask,
    adminUpdateSettings,
    adminBroadcastNotification,
    setActiveTab,
    showToast 
  } = useApp();

  const [activeTab, setActiveTabState] = useState<'overview' | 'users' | 'withdrawals' | 'tasks' | 'settings' | 'broadcast'>('overview');
  
  // User search & balance modal
  const [userSearch, setUserSearch] = useState('');
  const [selectedUserForBalance, setSelectedUserForBalance] = useState<UserProfile | null>(null);
  const [balanceAmount, setBalanceAmount] = useState<string>('');
  const [balanceType, setBalanceType] = useState<'add' | 'deduct'>('add');
  const [balanceReason, setBalanceReason] = useState<string>('');

  // Task editing & adding
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskForm, setNewTaskForm] = useState<Omit<TaskItem, 'id'>>({
    nameId: 'smartlink_' + Date.now().toString().slice(-4),
    title: 'Smartlink Task',
    banglaTitle: 'নতুন স্মার্টলিংক ভিজিট',
    reward: 5,
    dailyLimit: 3,
    cooldownSeconds: 15,
    smartLink: 'https://othentigo.com/4/8919696',
    networkId: 'custom_' + Date.now().toString().slice(-4),
    category: 'smartlink',
    active: true
  });

  // Settings form
  const [tempSettings, setTempSettings] = useState(settings);

  // Broadcast push notification form
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastType, setBroadcastType] = useState<'info' | 'success' | 'warning'>('info');
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) {
      showToast('শিরোনাম এবং বার্তার বিবরণ পূরণ করুন', 'error');
      return;
    }
    setIsBroadcasting(true);
    await adminBroadcastNotification(broadcastTitle.trim(), broadcastMessage.trim(), broadcastType);
    setBroadcastTitle('');
    setBroadcastMessage('');
    setIsBroadcasting(false);
  };

  // If user is not admin
  if (user?.role !== 'admin' && user?.email !== 'jonnyghosh3@gmail.com') {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-red-200 my-10">
        <ShieldAlert className="w-16 h-16 text-red-600 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-gray-900">অননুমোদিত এক্সেস!</h3>
        <p className="text-sm text-gray-600 mt-1 mb-4">
          এই পৃষ্ঠাটি শুধুমাত্র প্ল্যাটফর্ম অ্যাডমিনিস্ট্রেটরদের জন্য সংরক্ষিত।
        </p>
        <button
          onClick={() => setActiveTab('home')}
          className="px-6 py-2.5 rounded-2xl bg-emerald-600 text-white font-bold text-sm shadow-md"
        >
          হোমে ফিরে যান
        </button>
      </div>
    );
  }

  // Analytics
  const totalUsers = Math.max(1, allUsersList.length);
  const totalWithdrawnAmount = allWithdrawalsList
    .filter(w => w.status === 'paid' || w.status === 'approved')
    .reduce((sum, w) => sum + w.amount, 0);
  const pendingWithdrawals = allWithdrawalsList.filter(w => w.status === 'pending');

  const filteredUsers = allUsersList.filter(u => {
    if (!userSearch) return true;
    const q = userSearch.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.includes(q) ||
      u.referralCode.toLowerCase().includes(q) ||
      u.uid.toLowerCase().includes(q)
    );
  });

  const handleAdjustBalance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForBalance) return;
    const amt = Number(balanceAmount);
    if (isNaN(amt) || amt <= 0) {
      showToast('সঠিক টাকার পরিমাণ লিখুন', 'error');
      return;
    }
    if (!balanceReason.trim()) {
      showToast('ব্যালেন্স পরিবর্তনের কারণ উল্লেখ করুন', 'error');
      return;
    }

    const delta = balanceType === 'add' ? amt : -amt;
    adminUpdateUserBalance(selectedUserForBalance.uid, delta, balanceReason.trim());
    setSelectedUserForBalance(null);
    setBalanceAmount('');
    setBalanceReason('');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    adminUpdateSettings(tempSettings);
  };

  return (
    <div className="space-y-4 pb-28">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('home')}
            className="p-2 rounded-2xl bg-white border border-emerald-100 text-emerald-800 hover:bg-emerald-50 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-extrabold text-lg text-emerald-950 flex items-center gap-1.5">
              <span>এডমিন কন্ট্রোল প্যানেল</span>
              <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
                Admin Mode
              </span>
            </h2>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1 rounded-2xl border border-emerald-100 shadow-2xs text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTabState('overview')}
          className={`flex-1 min-w-[70px] py-2 rounded-xl transition-all ${
            activeTab === 'overview' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-gray-600'
          }`}
        >
          ওভারভিউ
        </button>
        <button
          onClick={() => setActiveTabState('withdrawals')}
          className={`flex-1 min-w-[80px] py-2 rounded-xl transition-all relative ${
            activeTab === 'withdrawals' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-gray-600'
          }`}
        >
          উত্তোলন
          {pendingWithdrawals.length > 0 && (
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[9px]">
              {pendingWithdrawals.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTabState('users')}
          className={`flex-1 min-w-[70px] py-2 rounded-xl transition-all ${
            activeTab === 'users' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-gray-600'
          }`}
        >
          ইউজারগণ
        </button>
        <button
          onClick={() => setActiveTabState('tasks')}
          className={`flex-1 min-w-[70px] py-2 rounded-xl transition-all ${
            activeTab === 'tasks' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-gray-600'
          }`}
        >
          টাস্ক ও লিংক
        </button>
        <button
          onClick={() => setActiveTabState('settings')}
          className={`flex-1 min-w-[70px] py-2 rounded-xl transition-all ${
            activeTab === 'settings' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-gray-600'
          }`}
        >
          সেটিংস
        </button>
        <button
          onClick={() => setActiveTabState('broadcast')}
          className={`flex-1 min-w-[95px] py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'broadcast' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-gray-600'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>নোটিফিকেশন</span>
        </button>
      </div>

      {/* 1. Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-4 rounded-3xl bg-white border border-emerald-100 shadow-2xs">
              <span className="text-xs text-gray-500 font-medium block">মোট নিবন্ধিত ইউজার</span>
              <span className="text-2xl font-black font-english text-emerald-950">{totalUsers}</span>
            </div>
            <div className="p-4 rounded-3xl bg-white border border-emerald-100 shadow-2xs">
              <span className="text-xs text-gray-500 font-medium block">পেন্ডিং উত্তোলন</span>
              <span className="text-2xl font-black font-english text-amber-600">{pendingWithdrawals.length}টি</span>
            </div>
            <div className="p-4 rounded-3xl bg-white border border-emerald-100 shadow-2xs">
              <span className="text-xs text-gray-500 font-medium block">মোট পেইড উত্তোলন</span>
              <span className="text-2xl font-black font-english text-emerald-700">৳{totalWithdrawnAmount.toFixed(0)}</span>
            </div>
            <div className="p-4 rounded-3xl bg-white border border-emerald-100 shadow-2xs">
              <span className="text-xs text-gray-500 font-medium block">মোট বিজ্ঞাপন লিংক</span>
              <span className="text-2xl font-black font-english text-emerald-950">{tasks.length}টি</span>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950">
            <h4 className="font-bold mb-1">অ্যাডমিন নির্দেশিকা:</h4>
            <p className="leading-relaxed text-emerald-900">
              সমস্ত বিজ্ঞাপন লিংক ও রিওয়ার্ড মান এই প্যানেল থেকে তাৎক্ষণিকভাবে পরিবর্তন করা সম্ভব। উত্তোলন আবেদন বাতিল করলে ইউজারের টাকা স্বয়ংক্রিয়ভাবে রিফান্ড হয়ে যাবে।
            </p>
          </div>
        </div>
      )}

      {/* 2. Withdrawals Management */}
      {activeTab === 'withdrawals' && (
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-gray-900">উত্তোলন অনুরোধসমূহ</h3>

          {allWithdrawalsList.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-gray-100 text-xs text-gray-400">
              কোনো উত্তোলন আবেদন পাওয়া যায়নি।
            </div>
          ) : (
            allWithdrawalsList.map((w) => (
              <div
                key={w.id}
                className="p-4 rounded-3xl bg-white border border-emerald-100 shadow-xs space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold font-english text-emerald-950 text-sm">#{w.id}</span>
                    <p className="text-[10px] text-gray-400 font-english">
                      {new Date(w.createdAt).toLocaleString('bn-BD')}
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    w.status === 'paid' ? 'bg-green-100 text-green-800' :
                    w.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                    w.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {w.status}
                  </span>
                </div>

                <div className="bg-gray-50 p-2.5 rounded-2xl space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">ইউজার / নম্বর:</span>
                    <span className="font-bold text-gray-800 font-english">{w.method} - {w.accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">পরিমাণ:</span>
                    <span className="font-extrabold text-emerald-700 font-english">৳{w.amount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Actions if pending */}
                {w.status === 'pending' && (
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => adminUpdateWithdrawalStatus(w.id, 'paid')}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold active:scale-95 shadow-xs"
                    >
                      পেইড করুন
                    </button>
                    <button
                      onClick={() => adminUpdateWithdrawalStatus(w.id, 'rejected', 'তথ্য সঠিক নয়')}
                      className="flex-1 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 font-bold active:scale-95"
                    >
                      বাতিল ও রিফান্ড
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* 3. Users Management */}
      {activeTab === 'users' && (
        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder="নাম, ফোন, ইমেইল বা কোড দিয়ে খুঁজুন..."
              value={userSearch}
              onChange={e => setUserSearch(e.target.value)}
              className="w-full px-4 py-2.5 pl-9 rounded-2xl bg-white border border-emerald-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          </div>

          <div className="space-y-2">
            {filteredUsers.map((u) => (
              <div
                key={u.uid}
                className="p-4 rounded-3xl bg-white border border-emerald-100 shadow-2xs space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{u.name}</h4>
                    <p className="text-[10px] text-gray-400 font-english">{u.email} | {u.phone}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    u.accountStatus === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {u.accountStatus}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-emerald-50/50 p-2.5 rounded-2xl">
                  <div>
                    <span className="text-[10px] text-gray-500">ব্যালেন্স:</span>
                    <span className="font-bold text-emerald-800 font-english ml-1">৳{u.balance.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500">রেফার কোড:</span>
                    <span className="font-bold font-english text-gray-700 ml-1">{u.referralCode}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setSelectedUserForBalance(u)}
                    className="flex-1 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold hover:bg-emerald-100 active:scale-95"
                  >
                    ব্যালেন্স সমন্বয় (+/-)
                  </button>
                  <button
                    onClick={() => adminToggleUserStatus(u.uid, u.accountStatus === 'active' ? 'suspended' : 'active')}
                    className={`px-3 py-2 rounded-xl font-bold active:scale-95 ${
                      u.accountStatus === 'active'
                        ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                        : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                    }`}
                  >
                    {u.accountStatus === 'active' ? 'স্থগিত করুন' : 'সক্রিয় করুন'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Tasks & Smartlinks Manager */}
      {activeTab === 'tasks' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-gray-900">বিজ্ঞাপন ও স্মার্টলিংক তালিকা ({tasks.length})</h3>
            <button
              onClick={() => setIsAddingTask(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন স্মার্টলিংক</span>
            </button>
          </div>

          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-3.5 rounded-2xl bg-white border border-emerald-100 shadow-2xs space-y-2 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900">{task.banglaTitle}</h4>
                    <p className="text-[10px] text-gray-400 font-english">{task.nameId} • ID: {task.networkId}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingTask(task)}
                      className="p-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      title="এডিট করুন"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`আপনি কি "${task.banglaTitle}" মুছে ফেলতে চান?`)) {
                          adminDeleteTask(task.id);
                        }
                      }}
                      className="p-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-gray-50 text-[11px] text-gray-600 truncate font-english">
                  {task.smartLink}
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span>রিওয়ার্ড: <strong className="text-emerald-700 font-english">৳{task.reward}</strong></span>
                  <span>দৈনিক সীমা: <strong className="font-english">{task.dailyLimit} বার</strong></span>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                    task.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {task.active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. System Settings */}
      {activeTab === 'settings' && (
        <div className="rounded-3xl bg-white border border-emerald-100 p-5 shadow-xs">
          <h3 className="font-bold text-sm text-gray-900 mb-4">প্ল্যাটফর্ম গ্লোবাল সেটিংস</h3>

          <form onSubmit={handleSaveSettings} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">প্ল্যাটফর্মের নাম</label>
              <input
                type="text"
                value={tempSettings.appName}
                onChange={e => setTempSettings({ ...tempSettings, appName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">প্রতি রেফারেল রিওয়ার্ড (৳)</label>
                <input
                  type="number"
                  value={tempSettings.referralReward}
                  onChange={e => setTempSettings({ ...tempSettings, referralReward: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 font-english"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">প্রতি বিজ্ঞাপন রিওয়ার্ড (৳)</label>
                <input
                  type="number"
                  value={tempSettings.adReward}
                  onChange={e => setTempSettings({ ...tempSettings, adReward: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 font-english"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">সর্বনিম্ন উত্তোলন (৳)</label>
                <input
                  type="number"
                  value={tempSettings.minWithdrawal}
                  onChange={e => setTempSettings({ ...tempSettings, minWithdrawal: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 font-english"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">উত্তোলনে ন্যূনতম রেফারেল (জন)</label>
                <input
                  type="number"
                  value={tempSettings.minReferralsRequiredForWithdrawal ?? 20}
                  onChange={e => setTempSettings({ ...tempSettings, minReferralsRequiredForWithdrawal: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 font-english font-bold text-emerald-800"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">টেলিগ্রাম চ্যানেল লিংক (ঐচ্ছিক)</label>
              <input
                type="text"
                placeholder="https://t.me/..."
                value={tempSettings.telegramUrl}
                onChange={e => setTempSettings({ ...tempSettings, telegramUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 font-english"
              />
            </div>

            {/* YouTube Tutorial Video 1 */}
            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
              <span className="font-bold text-xs text-gray-800 block">ইউটিউব ভিডিও ১ (Tutorial Video 1)</span>
              <div>
                <label className="block font-medium text-gray-600 mb-0.5">ভিডিও ১ টাইটেল</label>
                <input
                  type="text"
                  placeholder="যেমন: টিউটোরিয়াল ১: কীভাবে কাজ করবেন?"
                  value={tempSettings.youtubeVideo1Title || ''}
                  onChange={e => setTempSettings({ ...tempSettings, youtubeVideo1Title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-600 mb-0.5">ভিডিও ১ URL</label>
                <input
                  type="text"
                  placeholder="https://youtube.com/..."
                  value={tempSettings.youtubeVideo1Url || ''}
                  onChange={e => setTempSettings({ ...tempSettings, youtubeVideo1Url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 font-english"
                />
              </div>
            </div>

            {/* YouTube Tutorial Video 2 */}
            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
              <span className="font-bold text-xs text-gray-800 block">ইউটিউব ভিডিও ২ (Tutorial Video 2)</span>
              <div>
                <label className="block font-medium text-gray-600 mb-0.5">ভিডিও ২ টাইটেল</label>
                <input
                  type="text"
                  placeholder="যেমন: টিউটোরিয়াল ২: কীভাবে টাকা তুলবেন?"
                  value={tempSettings.youtubeVideo2Title || ''}
                  onChange={e => setTempSettings({ ...tempSettings, youtubeVideo2Title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-600 mb-0.5">ভিডিও ২ URL</label>
                <input
                  type="text"
                  placeholder="https://youtube.com/..."
                  value={tempSettings.youtubeVideo2Url || ''}
                  onChange={e => setTempSettings({ ...tempSettings, youtubeVideo2Url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 font-english"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
            >
              সেটিংস সংরক্ষণ করুন
            </button>
          </form>
        </div>
      )}

      {/* 6. Push Notification Broadcast (Mobile Browser & App) */}
      {activeTab === 'broadcast' && (
        <div className="rounded-3xl bg-white border border-emerald-100 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-emerald-800 to-green-700 text-white shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Radio className="w-5 h-5 text-emerald-200 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm">ব্রাউজার পুশ নোটিফিকেশন ব্রডকাস্ট</h3>
              <p className="text-[11px] text-emerald-100">
                সকল অনলাইন ইউজারদের মোবাইল স্ক্রিন ও ওয়েবসাইটে তাৎক্ষণিক অ্যালার্ট পাঠান
              </p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              ইউজাররা অ্যাপে প্রবেশের পর ব্রাউজার নোটিফিকেশন পারমিশন দিলে এই নোটিফিকেশনগুলো তাদের মোবাইলের লক স্ক্রিন ও নোটিফিকেশন বারে ভেসে উঠবে।
            </p>
          </div>

          <form onSubmit={handleBroadcast} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                নোটিফিকেশনের শিরোনাম (Title)
              </label>
              <input
                type="text"
                required
                placeholder="যেমন: 🔥 আজকের ধামাকা অফার! দ্বিগুণ আয় করুন"
                value={broadcastTitle}
                onChange={e => setBroadcastTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                বার্তার বিবরণ (Message Description)
              </label>
              <textarea
                required
                rows={3}
                placeholder="যেমন: সকল কাজ এখন সক্রিয় আছে। এখনই টাস্ক সম্পন্ন করে আপনার বিকাশ বা নগদে টাকা তুলে নিন।"
                value={broadcastMessage}
                onChange={e => setBroadcastMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                নোটিফিকেশনের ধরন
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setBroadcastType('info')}
                  className={`py-2 px-3 rounded-xl border font-bold text-center transition-all ${
                    broadcastType === 'info' 
                      ? 'bg-blue-50 border-blue-400 text-blue-800 ring-2 ring-blue-400/20' 
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  📢 তথ্যমূলক
                </button>
                <button
                  type="button"
                  onClick={() => setBroadcastType('success')}
                  className={`py-2 px-3 rounded-xl border font-bold text-center transition-all ${
                    broadcastType === 'success' 
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-800 ring-2 ring-emerald-400/20' 
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  🎉 সুখবর/বোনাস
                </button>
                <button
                  type="button"
                  onClick={() => setBroadcastType('warning')}
                  className={`py-2 px-3 rounded-xl border font-bold text-center transition-all ${
                    broadcastType === 'warning' 
                      ? 'bg-amber-50 border-amber-400 text-amber-800 ring-2 ring-amber-400/20' 
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  ⚠️ জরুরি সতর্কতা
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isBroadcasting}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <Send className="w-4 h-4" />
              <span>{isBroadcasting ? 'নোটিফিকেশন পাঠানো হচ্ছে...' : 'সকল ইউজারের ডিভাইসে ব্রডকাস্ট পাঠান'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Adjust Balance Modal */}
      {selectedUserForBalance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-emerald-100">
            <h3 className="font-bold text-base text-gray-900 mb-2">
              ব্যালেন্স সমন্বয়: {selectedUserForBalance.name}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              বর্তমান ব্যালেন্স: ৳{selectedUserForBalance.balance.toFixed(2)}
            </p>

            <form onSubmit={handleAdjustBalance} className="space-y-3 text-xs">
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setBalanceType('add')}
                  className={`flex-1 py-2 rounded-lg font-bold ${balanceType === 'add' ? 'bg-emerald-600 text-white' : 'text-gray-600'}`}
                >
                  যোগ করুন (+)
                </button>
                <button
                  type="button"
                  onClick={() => setBalanceType('deduct')}
                  className={`flex-1 py-2 rounded-lg font-bold ${balanceType === 'deduct' ? 'bg-red-600 text-white' : 'text-gray-600'}`}
                >
                  কর্তন করুন (-)
                </button>
              </div>

              <div>
                <label className="block font-semibold mb-1">পরিমাণ (টাকা)</label>
                <input
                  type="number"
                  required
                  placeholder="যেমন: 500"
                  value={balanceAmount}
                  onChange={e => setBalanceAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 font-english"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">কারণ (Audit Reason)</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: বোনাস প্রদান বা ভুল সংশোধন"
                  value={balanceReason}
                  onChange={e => setBalanceReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedUserForBalance(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  নিশ্চিত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-emerald-100 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-base text-gray-900 mb-3">টাস্ক সম্পাদনা</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">বাংলা শিরোনাম</label>
                <input
                  type="text"
                  value={editingTask.banglaTitle}
                  onChange={e => setEditingTask({ ...editingTask, banglaTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">স্মার্টলিংক URL</label>
                <input
                  type="text"
                  value={editingTask.smartLink}
                  onChange={e => setEditingTask({ ...editingTask, smartLink: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 font-english"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">পুরস্কার (৳)</label>
                  <input
                    type="number"
                    value={editingTask.reward}
                    onChange={e => setEditingTask({ ...editingTask, reward: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 font-english"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">দৈনিক সীমা (বার)</label>
                  <input
                    type="number"
                    value={editingTask.dailyLimit}
                    onChange={e => setEditingTask({ ...editingTask, dailyLimit: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 font-english"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="taskActive"
                  checked={editingTask.active}
                  onChange={e => setEditingTask({ ...editingTask, active: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600"
                />
                <label htmlFor="taskActive" className="font-semibold text-gray-700">সক্রিয় থাকবে</label>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  onClick={() => {
                    adminUpdateTask(editingTask);
                    setEditingTask(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Smartlink / Task Modal */}
      {isAddingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-emerald-100 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-base text-gray-900 mb-3">নতুন স্মার্টলিংক / বিজ্ঞাপন যুক্ত করুন</h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                adminAddTask(newTaskForm);
                setIsAddingTask(false);
                setNewTaskForm({
                  nameId: 'smartlink_' + Date.now().toString().slice(-4),
                  title: 'Smartlink Task',
                  banglaTitle: 'নতুন স্মার্টলিংক ভিজিট',
                  reward: 5,
                  dailyLimit: 3,
                  cooldownSeconds: 15,
                  smartLink: 'https://othentigo.com/4/8919696',
                  networkId: 'custom_' + Date.now().toString().slice(-4),
                  category: 'smartlink',
                  active: true
                });
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold text-gray-700 mb-1">বাংলা শিরোনাম</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: প্রিমিয়াম অ্যাড ১"
                  value={newTaskForm.banglaTitle}
                  onChange={e => setNewTaskForm({ ...newTaskForm, banglaTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">স্মার্টলিংক URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={newTaskForm.smartLink}
                  onChange={e => setNewTaskForm({ ...newTaskForm, smartLink: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 font-english"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">পুরস্কার (৳)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newTaskForm.reward}
                    onChange={e => setNewTaskForm({ ...newTaskForm, reward: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 font-english"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">দৈনিক সীমা (বার)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newTaskForm.dailyLimit}
                    onChange={e => setNewTaskForm({ ...newTaskForm, dailyLimit: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 font-english"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="newTaskActive"
                  checked={newTaskForm.active}
                  onChange={e => setNewTaskForm({ ...newTaskForm, active: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600"
                />
                <label htmlFor="newTaskActive" className="font-semibold text-gray-700">সক্রিয় থাকবে</label>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddingTask(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  যোগ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
