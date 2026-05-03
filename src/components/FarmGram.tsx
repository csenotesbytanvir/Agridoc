import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Plus, Filter, Image as ImageIcon, Send, MoreHorizontal, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useAgriDoc } from '../App';

interface Post {
  id: number;
  user: string;
  avatar: string;
  content: string;
  image: string;
  likes: number;
  comments: number;
  tag: string;
  time: string;
  isLiked?: boolean;
}

const DUMMY_POSTS: Post[] = [
  {
    id: 1,
    user: 'Karima Ahmed',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop',
    content: 'Finally harvested my first batch of organic tomatoes! The flavor is incredible. Used only neem oil for pests.',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=1974&auto=format&fit=crop',
    likes: 124,
    comments: 18,
    tag: 'Vegetables',
    time: '2h ago'
  },
  {
    id: 2,
    user: 'Sompong Thai',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop',
    content: 'Notice this yellowing on rice leaves? It might be early blast. Check your irrigation levels and apply fungicide soon.',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=2070&auto=format&fit=crop',
    likes: 89,
    comments: 42,
    tag: 'Problem Solver',
    time: '5h ago'
  },
  {
    id: 3,
    user: 'Suborna Akter',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop',
    content: 'Smart farming is the future! My new automated irrigation setup in Rajshahi is saving 30% water.',
    image: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?q=80&w=2071&auto=format&fit=crop',
    likes: 256,
    comments: 31,
    tag: 'Innovation',
    time: '1d ago'
  }
];

export const FarmGram: React.FC = () => {
  const { t } = useAgriDoc();
  const [posts, setPosts] = useState<Post[]>(() => {
    const local = localStorage.getItem('agri_posts_v2'); // Versioining to force refresh to Karima/Suborna
    return local ? JSON.parse(local) : DUMMY_POSTS;
  });
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState('All');
  const [newPost, setNewPost] = useState({ content: '', image: '', tag: 'Innovation' });

  const handleCreatePost = () => {
    if (!newPost.content) return;
    const post: Post = {
      id: Date.now(),
      user: localStorage.getItem('agri_profile_name') || 'Guest Farmer',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
      content: newPost.content,
      image: newPost.image || 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2070&auto=format&fit=crop',
      likes: 0,
      comments: 0,
      tag: newPost.tag,
      time: 'Just now'
    };
    const updated = [post, ...posts];
    setPosts(updated);
    localStorage.setItem('agri_posts_v2', JSON.stringify(updated));
    setShowCreate(false);
    setNewPost({ content: '', image: '', tag: 'Innovation' });
  };

  const toggleLike = (id: number) => {
    const updated = posts.map(p => {
      if (p.id === id) {
        return { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 };
      }
      return p;
    });
    setPosts(updated);
    localStorage.setItem('agri_posts_v2', JSON.stringify(updated));
  };

  const handleDeletePost = (id: number) => {
    const updated = posts.filter(p => p.id !== id);
    setPosts(updated);
    localStorage.setItem('agri_posts_v2', JSON.stringify(updated));
  };

  const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Pests', 'Innovation'];

  const currentUser = localStorage.getItem('agri_profile_name') || 'Guest Farmer';

  return (
    <div className="space-y-10 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-2 sm:space-y-4">
          <h2 className="text-3xl sm:text-5xl font-display font-black text-emerald-950 tracking-tighter uppercase">FarmGram</h2>
          <p className="text-[9px] sm:text-[10px] font-black uppercase text-emerald-600 tracking-[0.3em] sm:tracking-[0.4em]">Cultivar Community Feed</p>
        </div>
        <button 
          onClick={() => setShowCreate(true)}
          className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-[32px] bg-emerald-500 text-white flex items-center justify-center shadow-xl transition-all active:scale-95 hover:rotate-12 border-4 border-white shrink-0"
        >
          <Plus className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      </div>

      <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "px-6 sm:px-10 py-3 sm:py-5 rounded-[18px] sm:rounded-[24px] text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all border-2 whitespace-nowrap",
              filter === cat 
                ? "bg-emerald-600 text-white border-emerald-600 shadow-xl" 
                : "bg-white text-emerald-400 border-emerald-50 hover:bg-emerald-50 hover:text-emerald-700"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-12 max-w-4xl mx-auto">
        {posts.filter(p => filter === 'All' || p.tag === filter).map(post => (
          <motion.div 
            layout
            key={post.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[40px] sm:rounded-[64px] overflow-hidden border border-emerald-100 shadow-2xl relative group hover:-translate-y-1 transition-all"
          >
            {/* Header */}
            <div className="p-6 sm:p-10 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="p-1 sm:p-1.5 rounded-full bg-emerald-50 border-2 border-emerald-500 shrink-0">
                  <img 
                    src={post.avatar} 
                    alt={post.user} 
                    className="w-10 h-10 sm:w-14 sm:h-14 rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h4 className="font-display font-black text-emerald-950 text-xl sm:text-2xl tracking-tighter uppercase">{post.user}</h4>
                  <p className="text-[9px] sm:text-[10px] font-black text-emerald-300 uppercase tracking-[0.2em]">{post.time}</p>
                </div>
              </div>
              <div className="hidden sm:block bg-emerald-50 px-6 py-2.5 rounded-full border border-emerald-100 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                #{post.tag}
              </div>
            </div>

            {/* Content */}
            <div className="px-6 sm:px-10 pb-6 sm:pb-8 relative z-10">
              <p className="text-emerald-900 border-l-4 border-emerald-500 pl-4 sm:pl-6 text-base sm:text-lg font-medium leading-relaxed italic">
                {post.content}
              </p>
            </div>

            {/* Image */}
            <div className="aspect-[4/3] bg-slate-50 overflow-hidden relative mx-4 sm:mx-8 rounded-[32px] sm:rounded-[48px] border-2 sm:border-4 border-white shadow-xl">
              <img 
                src={post.image} 
                alt="Post content" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Actions */}
            <div className="p-6 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-8 sm:gap-12">
                <button 
                  onClick={() => toggleLike(post.id)}
                  className={cn("flex items-center gap-3 sm:gap-4 transition-all hover:scale-110", post.isLiked ? "text-red-500" : "text-slate-300 hover:text-red-400")}
                >
                  <Heart className="w-6 h-6 sm:w-8 sm:h-8" fill={post.isLiked ? "currentColor" : "none"} strokeWidth={2.5} />
                  <span className="text-xl sm:text-2xl font-black font-display leading-none tracking-tighter">{post.likes}</span>
                </button>
                <button className="flex items-center gap-3 sm:gap-4 text-emerald-300 hover:text-emerald-600 transition-all hover:scale-110">
                  <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={2.5} />
                  <span className="text-xl sm:text-2xl font-black font-display leading-none tracking-tighter">{post.comments}</span>
                </button>
                <button className="text-emerald-300 hover:text-emerald-600 transition-all hover:scale-110">
                  <Share2 className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={2.5} />
                </button>
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto justify-end sm:justify-start pt-4 sm:pt-0 border-t sm:border-0 border-emerald-50">
                {post.user === currentUser && (
                  <button 
                    onClick={() => handleDeletePost(post.id)}
                    className="p-3 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all shadow-sm border border-red-100 shrink-0"
                    title="Incinerate Post"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
                <button className="text-emerald-100 hover:text-emerald-300 shrink-0">
                  <MoreHorizontal className="w-6 h-6 sm:w-8 sm:h-8" />
                </button>
              </div>
            </div>
            <div className="absolute right-0 top-0 w-64 h-64 bg-brand-green/5 rounded-full blur-[100px] pointer-events-none"></div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showCreate && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreate(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-8 sm:p-16 rounded-[48px] sm:rounded-[80px] w-full max-w-2xl relative z-10 space-y-8 sm:space-y-10 shadow-2xl border border-emerald-100"
            >
              <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl sm:text-4xl font-display font-black text-emerald-950 uppercase leading-none">Share Update</h3>
                    <p className="text-[9px] sm:text-[10px] font-black uppercase text-emerald-600 tracking-widest mt-1">Impact the Global Matrix</p>
                </div>
                <button onClick={() => setShowCreate(false)} className="w-10 h-10 sm:w-14 sm:h-14 bg-emerald-50 rounded-xl sm:rounded-[20px] flex items-center justify-center text-emerald-300 hover:text-emerald-600 transition-all border border-emerald-100">
                  <X className="w-5 h-5 sm:w-7 sm:h-7" />
                </button>
              </div>
              <div className="space-y-6 sm:space-y-8">
                <textarea 
                  placeholder="Share your cultivar yield strategy or anomaly report..."
                  rows={4}
                   className="w-full bg-emerald-50 border border-emerald-100 h-32 sm:h-48 px-6 sm:px-10 py-6 sm:py-8 rounded-3xl sm:rounded-[48px] font-bold text-emerald-950 outline-none focus:ring-4 focus:ring-emerald-500/10 resize-none text-base sm:text-xl"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  <select 
                    className="p-6 sm:p-10 bg-emerald-50 rounded-2xl sm:rounded-[40px] border-2 border-dashed border-emerald-200 text-emerald-400 font-black uppercase tracking-widest text-center text-xs sm:text-base"
                    value={newPost.tag}
                    onChange={(e) => setNewPost({ ...newPost, tag: e.target.value })}
                  >
                    {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <button className="p-6 sm:p-10 bg-emerald-50 rounded-2xl sm:rounded-[40px] flex flex-col items-center justify-center gap-2 sm:gap-4 border-2 border-dashed border-emerald-200 text-emerald-400 transition-all hover:bg-emerald-100 hover:text-emerald-700 hover:border-emerald-300 group">
                    <ImageIcon className="w-8 h-8 sm:w-12 sm:h-12 group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-widest">Attach Media</span>
                  </button>
                </div>
              </div>
              <button 
                onClick={handleCreatePost}
                className="btn-primary w-full py-6 sm:py-10 text-xl sm:text-2xl tracking-tighter shadow-xl"
              >
                Broadcast to Network
                <Send className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
