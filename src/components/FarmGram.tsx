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
    user: 'Korim Ahmed',
    avatar: 'https://i.pravatar.cc/150?u=korim',
    content: 'Finally harvested my first batch of organic tomatoes! The flavor is incredible. Used only neem oil for pests.',
    image: 'https://picsum.photos/seed/farm1/600/400',
    likes: 124,
    comments: 18,
    tag: 'Vegetables',
    time: '2h ago'
  },
  {
    id: 2,
    user: 'Sompong Thai',
    avatar: 'https://i.pravatar.cc/150?u=sompong',
    content: 'Notice this yellowing on rice leaves? It might be early blast. Check your irrigation levels and apply fungicide soon.',
    image: 'https://picsum.photos/seed/farm2/600/400',
    likes: 89,
    comments: 42,
    tag: 'Problem Solver',
    time: '5h ago'
  },
  {
    id: 3,
    user: 'M. Tanvir',
    avatar: 'https://i.pravatar.cc/150?u=tanvir',
    content: 'Smart farming is the future! My new automated irrigation setup in Rajshahi is saving 30% water.',
    image: 'https://picsum.photos/seed/farm3/600/400',
    likes: 256,
    comments: 31,
    tag: 'Innovation',
    time: '1d ago'
  }
];

export const FarmGram: React.FC = () => {
  const { t } = useAgriDoc();
  const [posts, setPosts] = useState<Post[]>(() => {
    const local = localStorage.getItem('agri_posts');
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
    localStorage.setItem('agri_posts', JSON.stringify(updated));
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
    localStorage.setItem('agri_posts', JSON.stringify(updated));
  };

  const handleDeletePost = (id: number) => {
    const updated = posts.filter(p => p.id !== id);
    setPosts(updated);
    localStorage.setItem('agri_posts', JSON.stringify(updated));
  };

  const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Pests', 'Innovation'];

  const currentUser = localStorage.getItem('agri_profile_name') || 'Guest Farmer';

  return (
    <div className="space-y-10 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <h2 className="text-5xl font-display font-black text-emerald-950 tracking-tighter uppercase">FarmGram</h2>
          <p className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.4em] mt-2">Cultivar Community Feed</p>
        </div>
        <button 
          onClick={() => setShowCreate(true)}
          className="w-20 h-20 rounded-[32px] bg-emerald-500 text-white flex items-center justify-center shadow-xl transition-all active:scale-95 hover:rotate-12 border-4 border-white"
        >
          <Plus size={36} />
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "px-10 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all border-2 whitespace-nowrap",
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
            className="bg-white rounded-[64px] overflow-hidden border border-emerald-100 shadow-2xl relative group hover:-translate-y-1 transition-all"
          >
            {/* Header */}
            <div className="p-10 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-6">
                <div className="p-1.5 rounded-full bg-emerald-50 border-2 border-emerald-500">
                  <img 
                    src={post.avatar} 
                    alt={post.user} 
                    className="w-14 h-14 rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h4 className="font-display font-black text-emerald-950 text-2xl tracking-tighter uppercase">{post.user}</h4>
                  <p className="text-[10px] font-black text-emerald-300 uppercase tracking-[0.2em]">{post.time}</p>
                </div>
              </div>
              <div className="bg-emerald-50 px-6 py-2.5 rounded-full border border-emerald-100 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                #{post.tag}
              </div>
            </div>

            {/* Content */}
            <div className="px-10 pb-8 relative z-10">
              <p className="text-emerald-900 border-l-4 border-emerald-500 pl-6 text-lg font-medium leading-relaxed italic">
                {post.content}
              </p>
            </div>

            {/* Image */}
            <div className="aspect-[4/3] bg-slate-50 overflow-hidden relative mx-8 rounded-[48px] border-4 border-white shadow-xl">
              <img 
                src={post.image} 
                alt="Post content" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Actions */}
            <div className="p-10 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-12">
                <button 
                  onClick={() => toggleLike(post.id)}
                  className={cn("flex items-center gap-4 transition-all hover:scale-110", post.isLiked ? "text-red-500" : "text-slate-300 hover:text-red-400")}
                >
                  <Heart size={32} fill={post.isLiked ? "currentColor" : "none"} strokeWidth={2.5} />
                  <span className="text-2xl font-black font-display leading-none tracking-tighter">{post.likes}</span>
                </button>
                <button className="flex items-center gap-4 text-emerald-300 hover:text-emerald-600 transition-all hover:scale-110">
                  <MessageCircle size={32} strokeWidth={2.5} />
                  <span className="text-2xl font-black font-display leading-none tracking-tighter">{post.comments}</span>
                </button>
                <button className="text-emerald-300 hover:text-emerald-600 transition-all hover:scale-110 ml-auto">
                  <Share2 size={32} strokeWidth={2.5} />
                </button>
              </div>
              <div className="flex items-center gap-4">
                {post.user === currentUser && (
                  <button 
                    onClick={() => handleDeletePost(post.id)}
                    className="p-3 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all shadow-sm border border-red-100"
                    title="Incinerate Post"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
                <button className="text-emerald-100 hover:text-emerald-300">
                  <MoreHorizontal size={32} />
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
              className="bg-white p-12 sm:p-16 rounded-[80px] w-full max-w-2xl relative z-10 space-y-10 shadow-2xl border border-emerald-100"
            >
              <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-4xl font-display font-black text-emerald-950 uppercase">Share Update</h3>
                    <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mt-1">Impact the Global Matrix</p>
                </div>
                <button onClick={() => setShowCreate(false)} className="w-14 h-14 bg-emerald-50 rounded-[20px] flex items-center justify-center text-emerald-300 hover:text-emerald-600 transition-all border border-emerald-100">
                  <X size={28} />
                </button>
              </div>
              <div className="space-y-8">
                <textarea 
                  placeholder="Share your cultivar yield strategy or anomaly report..."
                  rows={4}
                   className="w-full bg-emerald-50 border border-emerald-100 h-48 px-10 py-8 rounded-[48px] font-bold text-emerald-950 outline-none focus:ring-4 focus:ring-emerald-500/10 resize-none text-xl"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-6">
                  <select 
                    className="p-10 bg-emerald-50 rounded-[40px] border-2 border-dashed border-emerald-200 text-emerald-400 font-black uppercase tracking-widest text-center"
                    value={newPost.tag}
                    onChange={(e) => setNewPost({ ...newPost, tag: e.target.value })}
                  >
                    {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <button className="p-10 bg-emerald-50 rounded-[40px] flex flex-col items-center justify-center gap-4 border-2 border-dashed border-emerald-200 text-emerald-400 transition-all hover:bg-emerald-100 hover:text-emerald-700 hover:border-emerald-300 group">
                    <ImageIcon size={48} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-black uppercase tracking-widest">Attach Media</span>
                  </button>
                </div>
              </div>
              <button 
                onClick={handleCreatePost}
                className="btn-primary w-full py-10 text-2xl tracking-tighter shadow-xl"
              >
                Broadcast to Network
                <Send size={32} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
