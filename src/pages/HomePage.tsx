import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DownloadAppModal } from '../components/DownloadAppModal';
import { ReviewsSection } from '../components/ReviewsSection';
import { 
  Wallet, 
  ArrowRight, 
  Sparkles, 
  Play, 
  Users, 
  Trophy, 
  CheckCircle2, 
  AlertCircle, 
  Gift, 
  Video, 
  Headphones, 
  Share2,
  Copy,
  ChevronRight,
  Flame,
  Award,
  Send,
  Download,
  Smartphone,
  CheckSquare,
  TrendingUp,
  X
} from 'lucide-react';

export const HomePage: React.FC<{ onOpenSupport: () => void }> = ({ onOpenSupport }) => {
  const { user, tasks, settings, setActiveTab, startTask, showToast } = useApp();
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showTopDownloadBanner, setShowTopDownloadBanner] = useState(true);

  const websiteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://jmeads.com';

  const handleDirectDownload = () => {
    const content = `[InternetShortcut]\nURL=${websiteUrl}\nIconIndex=0`;
    const blob = new Blob([content], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'JME-Ads-App.url';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('JME Ads অ্যাপ ডাউনলোড শুরু হয়েছে!', 'success');
  };

  const handleCopyReferral = () => {
    if (!user) return;
    const url = `${window.location.origin}/?ref=${user.referralCode}`;
    navigator.clipboard.writeText(url);
    showToast('রেফারেল লিংক কপি হয়েছে!', 'success');
  };

  const handleOpenTelegram = () => {
    if (settings.telegramUrl && settings.telegramUrl.trim() !== '') {
      window.open(settings.telegramUrl, '_blank');
    } else {
      window.open('https://t.me/JMEAds_Official', '_blank');
    }
  };

  const handleOpenVideo1 = () => {
    const url = settings.youtubeVideo1Url || settings.youtubeTutorialUrl;
    if (url && url.trim() !== '') {
      window.open(url, '_blank');
    } else {
      window.open('https://www.youtube.com', '_blank');
    }
  };

  const handleOpenVideo2 = () => {
    const url = settings.youtubeVideo2Url;
    if (url && url.trim() !== '') {
      window.open(url, '_blank');
    } else {
      window.open('https://www.youtube.com', '_blank');
    }
  };

  // Top 4 smartlink tasks for the Premium Income section
  const premiumTasks = tasks.slice(0, 4);

  // Daily task completed count calculation
  const todayTasksCompleted = user?.todayTaskCompletions 
    ? Object.values(user.todayTaskCompletions).reduce((sum: number, c: number) => sum + c, 0)
    : 0;

  return (
    <div className="space-y-4 pb-28">
      {/* Top Direct Download Banner with Cross button */}
      {showTopDownloadBanner && (
        <div className="rounded-2xl bg-gradient-to-r from-emerald-800 to-green-700 text-white p-3 shadow-md flex items-center justify-between gap-2 border border-emerald-500/40">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Smartphone className="w-4 h-4 text-white" />
            </div>
            <div className="truncate">
              <span className="font-bold text-xs truncate block">JME Ads অফিসিয়াল অ্যাপ</span>
              <span className="text-[10px] text-emerald-200">সহজে এক ক্লিকে ইনস্টল করুন</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleDirectDownload}
              className="px-3 py-1.5 rounded-xl bg-white text-emerald-900 font-extrabold text-xs shadow-xs hover:bg-emerald-50 active:scale-95 transition-all flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ডাউনলোড</span>
            </button>
            <button
              onClick={() => setShowTopDownloadBanner(false)}
              className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
              title="বন্ধ করুন"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 1. Greeting & User Info */}
      <div className="px-1">
        <h2 className="text-xl font-extrabold text-emerald-950">
          {user ? user.name : 'স্বাগতম'}
        </h2>
        <p className="text-xs text-emerald-700 font-medium">
          Welcome to <span className="font-bold font-english">JME Ads BD</span>
        </p>
      </div>

      {/* 2. Main Total Balance Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-green-600 text-white p-5 shadow-xl shadow-emerald-700/20 border border-emerald-500/30">
        
        {/* Background decorative glow */}
        <div className="absolute -right-8 -top-8 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-emerald-400/10 rounded-full blur-lg pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-white/15 backdrop-blur-xs">
                <Wallet className="w-4 h-4 text-emerald-100" />
              </div>
              <span className="text-xs text-emerald-100 font-medium tracking-wide">
                Total Balance (Taka)
              </span>
            </div>
            <span className="text-[10px] bg-emerald-900/50 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-400/20 font-english">
              BDT ৳
            </span>
          </div>

          {/* Big Balance */}
          <div className="my-2">
            <h1 className="text-4xl font-black tracking-tight text-white flex items-baseline gap-1 font-english">
              <span className="text-2xl font-bold text-emerald-200">৳</span>
              <span>{user ? user.balance.toFixed(2) : '0.00'}</span>
            </h1>
          </div>

          {/* 4 Stats Grid */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-emerald-600/50 text-xs">
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-2.5">
              <span className="text-[11px] text-emerald-100 block">আজকের আয়</span>
              <span className="font-bold text-sm text-white font-english">
                ৳{user ? user.todayEarned.toFixed(2) : '0.00'}
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-2.5">
              <span className="text-[11px] text-emerald-100 block">রেফার থেকে আয়</span>
              <span className="font-bold text-sm text-white font-english">
                ৳{user ? user.referralEarned.toFixed(2) : '0.00'}
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-2.5">
              <span className="text-[11px] text-emerald-100 block">মোট ইনকাম</span>
              <span className="font-bold text-sm text-white font-english">
                ৳{user ? user.totalEarned.toFixed(2) : '0.00'}
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-2.5">
              <span className="text-[11px] text-emerald-100 block">মোট উত্তোলন</span>
              <span className="font-bold text-sm text-white font-english">
                ৳{user ? user.totalWithdrawn.toFixed(2) : '0.00'}
              </span>
            </div>
          </div>

          {/* Withdraw Quick Action */}
          <button
            onClick={() => setActiveTab('withdraw')}
            className="w-full mt-4 py-3 rounded-2xl bg-white text-emerald-900 font-extrabold text-sm hover:bg-emerald-50 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-md group"
          >
            <Wallet className="w-4 h-4 text-emerald-600" />
            <span>Withdraw Money</span>
            <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* NEW: Daily Earnings & Performance Summary Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 border border-emerald-200/80 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wide flex items-center gap-1">
              <span>দৈনিক পারফর্মেন্স ট্র্যাকার</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-gray-700 font-medium">আজকের সম্পন্ন টাস্ক:</span>
              <span className="text-sm font-black text-emerald-900 font-english bg-white px-2 py-0.5 rounded-lg border border-emerald-200 shadow-2xs">
                {todayTasksCompleted} টি
              </span>
            </div>
            <span className="text-[10px] text-gray-500 block mt-0.5">
              বর্তমান মোট অবশিষ্ট ব্যালেন্স: <strong className="text-emerald-700 font-english font-bold">৳{user ? user.balance.toFixed(2) : '0.00'}</strong>
            </span>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('tasks')}
          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 shadow-sm active:scale-95 transition-all flex items-center gap-1"
        >
          <span>টাস্ক করুন</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3. Important Notice Banner */}
      <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 shadow-xs flex items-start gap-3">
        <div className="p-1.5 bg-amber-100 text-amber-700 rounded-xl shrink-0 mt-0.5">
          <AlertCircle className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-amber-950 flex items-center gap-1">
            <span>গুরুত্বপূর্ণ নোটিশ</span>
            <span className="px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 text-[10px]">জরুরি</span>
          </h4>
          <p className="text-[11px] text-amber-900/90 leading-snug mt-0.5">
            লিংকে ক্লিক করে কাজ সম্পূর্ণ না করে (১৫ সেকেন্ডের আগে) ফিরে আসলেই আপনার টাকা একাউন্টে যোগ হবে না! প্রতিটি লিংকে দিনে সর্বোচ্চ ৩ বার কাজ করা যাবে।
          </p>
        </div>
      </div>

      {/* TUTORIAL VIDEO SECTION - Placed immediately after the Important Notice Banner as requested */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-extrabold text-sm text-emerald-950 flex items-center gap-1.5">
            <span>টিউটোরিয়াল ভিডিও গাইড</span>
            <Video className="w-4 h-4 text-red-600" />
          </h3>
          <span className="text-[11px] text-emerald-700 font-medium">শিখে কাজ করুন</span>
        </div>

        {/* Video Tutorial Slot 1 */}
        <button
          onClick={handleOpenVideo1}
          className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/20 hover:from-red-700 hover:to-rose-700 active:scale-98 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <Video className="w-5 h-5" />
            </div>
            <div className="text-left min-w-0 truncate">
              <span className="text-[10px] font-bold text-red-100 uppercase tracking-wide block">
                টিউটোরিয়াল ১
              </span>
              <h4 className="font-black text-xs sm:text-sm text-white truncate">
                {settings.youtubeVideo1Title || 'টিউটোরিয়াল ভিডিও ১: কীভাবে কাজ করবেন?'}
              </h4>
              <p className="text-[10px] text-red-100 truncate">
                বিজ্ঞাপন দেখে প্রতিদিন নিয়ম অনুযায়ী ইনকাম শিখুন
              </p>
            </div>
          </div>
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform shrink-0 ml-2">
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </div>
        </button>

        {/* Video Tutorial Slot 2 */}
        <button
          onClick={handleOpenVideo2}
          className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-700 text-white shadow-md shadow-rose-600/20 hover:from-rose-700 hover:to-red-800 active:scale-98 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <Video className="w-5 h-5" />
            </div>
            <div className="text-left min-w-0 truncate">
              <span className="text-[10px] font-bold text-rose-100 uppercase tracking-wide block">
                টিউটোরিয়াল ২
              </span>
              <h4 className="font-black text-xs sm:text-sm text-white truncate">
                {settings.youtubeVideo2Title || 'টিউটোরিয়াল ভিডিও ২: কীভাবে টাকা তুলবেন?'}
              </h4>
              <p className="text-[10px] text-rose-100 truncate">
                রেফার শর্ত ও বিকাশ/নগদে টাকা তোলার নিয়ম
              </p>
            </div>
          </div>
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform shrink-0 ml-2">
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </div>
        </button>
      </div>

      {/* 4. Quick Action Grid (8 Cards matching Reference) */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="font-extrabold text-sm text-emerald-950 flex items-center gap-1.5">
            <span>অ্যাকাউন্ট সার্ভিসেস</span>
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          </h3>
          <span className="text-[11px] text-emerald-700 font-medium">সহজ এক্সেস</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {/* Tasks */}
          <button
            onClick={() => setActiveTab('tasks')}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white border border-emerald-100 shadow-xs hover:border-emerald-300 active:scale-95 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-gray-800">টাস্ক</span>
            <span className="text-[9px] text-emerald-600 font-semibold">২৪টি লাইভ</span>
          </button>

          {/* Withdraw */}
          <button
            onClick={() => setActiveTab('withdraw')}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white border border-emerald-100 shadow-xs hover:border-emerald-300 active:scale-95 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-1">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-gray-800">উত্তোলন</span>
            <span className="text-[9px] text-amber-600 font-semibold">বিকাশ/নগদ</span>
          </button>

          {/* My Team */}
          <button
            onClick={() => setActiveTab('team')}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white border border-emerald-100 shadow-xs hover:border-emerald-300 active:scale-95 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-gray-800">টিম</span>
            <span className="text-[9px] text-blue-600 font-semibold">রেফারেল</span>
          </button>

          {/* Lucky Spin */}
          <button
            onClick={() => setActiveTab('spin')}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white border border-emerald-100 shadow-xs hover:border-emerald-300 active:scale-95 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-1">
              <Gift className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-gray-800">লাকি স্পিন</span>
            <span className="text-[9px] text-rose-600 font-semibold">ফ্রি ক্যাশ</span>
          </button>

          {/* Leaderboard */}
          <button
            onClick={() => setActiveTab('leaderboard')}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white border border-emerald-100 shadow-xs hover:border-emerald-300 active:scale-95 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-1">
              <Trophy className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-gray-800">সেরা তালিকা</span>
            <span className="text-[9px] text-purple-600 font-semibold">টপ ইউজার</span>
          </button>

          {/* Video Zone */}
          <button
            onClick={() => setActiveTab('video-ads')}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white border border-emerald-100 shadow-xs hover:border-emerald-300 active:scale-95 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-1">
              <Video className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-gray-800">ভিডিও জোন</span>
            <span className="text-[9px] text-red-600 font-semibold">রিওয়ার্ড</span>
          </button>

          {/* Support */}
          <button
            onClick={onOpenSupport}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white border border-emerald-100 shadow-xs hover:border-emerald-300 active:scale-95 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-1">
              <Headphones className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-gray-800">সাপোর্ট</span>
            <span className="text-[9px] text-teal-600 font-semibold">২৪/৭ সাহায্য</span>
          </button>

          {/* Guide / Home */}
          <button
            onClick={() => setActiveTab('history')}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white border border-emerald-100 shadow-xs hover:border-emerald-300 active:scale-95 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center mb-1">
              <CheckSquare className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-gray-800">হিস্ট্রি</span>
            <span className="text-[9px] text-gray-500 font-semibold">আয় বিবরণ</span>
          </button>
        </div>
      </div>

      {/* 5. Refer & Earn Banner (৳৫০ Bonus Highlight) */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-700 to-green-600 text-white p-4 shadow-lg flex items-center justify-between gap-3 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-white/5 skew-x-12 pointer-events-none" />
        
        <div className="relative z-10 min-w-0">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-amber-950 mb-1">
            প্রতি রেফারে ৳৫০ নিশ্চিত
          </span>
          <h3 className="font-extrabold text-sm sm:text-base">বন্ধুদের আমন্ত্রণ জানান</h3>
          <p className="text-[11px] text-emerald-100 mt-0.5">
            আপনার রেফারেল কোড দিয়ে জয়েন করলেই আপনি পাবেন ৳৫০ বোনাস!
          </p>
        </div>

        <button
          onClick={handleCopyReferral}
          className="shrink-0 px-3.5 py-2.5 rounded-2xl bg-white text-emerald-900 font-bold text-xs shadow-md hover:bg-emerald-50 active:scale-95 transition-all flex items-center gap-1.5"
        >
          <Copy className="w-3.5 h-3.5 text-emerald-700" />
          <span>কপি লিংক</span>
        </button>
      </div>

      {/* 6. Premium Smartlink Tasks (Top 4) */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-sm text-emerald-950 flex items-center gap-1">
              <span>প্রিমিয়াম ইনকাম জোন</span>
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            </h3>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              প্রতি কাজে ৳৫.০০
            </span>
          </div>
          <button
            onClick={() => setActiveTab('tasks')}
            className="text-xs text-emerald-700 font-bold flex items-center gap-0.5 hover:text-emerald-800"
          >
            <span>সবগুলো দেখুন</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5">
          {premiumTasks.map((task) => (
            <div
              key={task.id}
              className="p-3.5 rounded-2xl bg-white border border-emerald-100 shadow-xs flex items-center justify-between hover:border-emerald-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-100">
                  <Play className="w-4 h-4 fill-emerald-600 text-emerald-600 ml-0.5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-gray-900 line-clamp-1">{task.title}</h4>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-500">
                    <span className="text-emerald-700 font-semibold">১৫ সেকেন্ড</span>
                    <span>•</span>
                    <span className="font-bold text-emerald-600 font-english">+৳৫.০০</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => startTask(task)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center gap-1"
              >
                <span>শুরু করুন</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Community Links (Telegram Official Group) */}
      <div className="rounded-3xl bg-white border border-emerald-100 p-4 shadow-xs space-y-2">
        <h3 className="font-extrabold text-xs text-gray-500 uppercase tracking-wider">
          কমিউনিটি ও আপডেট
        </h3>
        
        <button
          onClick={handleOpenTelegram}
          className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/20 hover:from-sky-600 hover:to-blue-700 active:scale-98 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Send className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="text-[10px] font-bold text-sky-100 uppercase tracking-wide block">
                অফিসিয়াল চ্যানেল
              </span>
              <h4 className="font-black text-xs sm:text-sm text-white">
                আমাদের টেলিগ্রাম চ্যানেলে যুক্ত হন
              </h4>
              <p className="text-[10px] text-sky-100">
                সকল পেমেন্ট প্রুফ ও নিয়মিত আপডেট জানতে
              </p>
            </div>
          </div>
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </div>
        </button>
      </div>

      {/* 8. User Reviews Section */}
      <ReviewsSection />

      {/* Download App Modal */}
      <DownloadAppModal 
        isOpen={showDownloadModal} 
        onClose={() => setShowDownloadModal(false)} 
      />

    </div>
  );
};
