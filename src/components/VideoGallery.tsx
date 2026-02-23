import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Youtube, Plus, MessageSquare, User, LogOut, LogIn, Send, Trash2, Filter } from 'lucide-react';
import { auth, db, googleProvider, signInWithPopup, signOut, onAuthStateChanged, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, updateDoc, arrayUnion, User as FirebaseUser } from '../services/firebase';
import { VideoPost, Comment } from '../types';
import { TEAMS } from '../constants';

export default function VideoGallery() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [posts, setPosts] = useState<VideoPost[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [newVideo, setNewVideo] = useState({ title: '', url: '', teamId: 'lg' });
  const [commentTexts, setCommentTexts] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribePosts = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as VideoPost[];
      setPosts(postsData);
    });

    return () => {
      unsubscribeAuth();
      unsubscribePosts();
    };
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleLogout = () => signOut(auth);

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleSubmitVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const videoId = getYoutubeId(newVideo.url);
    if (!videoId) {
      alert("유효한 유튜브 URL을 입력해주세요.");
      return;
    }

    try {
      await addDoc(collection(db, "posts"), {
        title: newVideo.title,
        youtubeUrl: newVideo.url,
        videoId: videoId,
        teamId: newVideo.teamId,
        userId: user.uid,
        userName: user.displayName || "익명",
        userPhoto: user.photoURL || "",
        createdAt: serverTimestamp(),
        comments: []
      });
      setNewVideo({ title: '', url: '', teamId: 'lg' });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!user || !commentTexts[postId]?.trim()) return;

    const postRef = doc(db, "posts", postId);
    const newComment = {
      id: Date.now().toString(),
      userId: user.uid,
      userName: user.displayName || "익명",
      userPhoto: user.photoURL || "",
      text: commentTexts[postId],
      createdAt: new Date().toISOString()
    };

    try {
      await updateDoc(postRef, {
        comments: arrayUnion(newComment)
      });
      setCommentTexts({ ...commentTexts, [postId]: '' });
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const filteredPosts = selectedTeam === 'all' 
    ? posts 
    : posts.filter(post => post.teamId === selectedTeam);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-display font-black tracking-tight mb-2">KBO 갤러리</h2>
          <p className="text-slate-500 font-medium">하이라이트와 구단 영상을 공유해보세요.</p>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
                <img src={user.photoURL || ""} alt={user.displayName || ""} className="w-6 h-6 rounded-full" />
                <span className="text-sm font-bold text-slate-700">{user.displayName}</span>
              </div>
              <button onClick={() => setShowForm(!showForm)} className="p-3 bg-kbo-blue text-white rounded-full shadow-lg hover:scale-105 transition-transform">
                <Plus size={24} />
              </button>
              <button onClick={handleLogout} className="p-3 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition-colors">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button onClick={handleLogin} className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 font-bold rounded-full shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors">
              <LogIn size={20} /> 구글로 로그인하여 참여하기
            </button>
          )}
        </div>
      </header>

      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSelectedTeam('all')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
            selectedTeam === 'all' ? 'bg-kbo-blue text-white' : 'bg-white text-slate-500 border border-slate-200'
          }`}
        >
          전체
        </button>
        {TEAMS.map(team => (
          <button
            key={team.id}
            onClick={() => setSelectedTeam(team.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              selectedTeam === team.id ? 'bg-kbo-blue text-white' : 'bg-white text-slate-500 border border-slate-200'
            }`}
          >
            {team.name.split(' ')[0]}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmitVideo} className="glass-card rounded-3xl p-8 space-y-6 mb-8">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Youtube className="text-red-600" /> 영상 공유하기
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">영상 제목</label>
                  <input
                    required
                    type="text"
                    value={newVideo.title}
                    onChange={e => setNewVideo({ ...newVideo, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-kbo-blue/20 outline-none"
                    placeholder="영상의 제목을 입력하세요"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">유튜브 URL</label>
                  <input
                    required
                    type="url"
                    value={newVideo.url}
                    onChange={e => setNewVideo({ ...newVideo, url: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-kbo-blue/20 outline-none"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">구단 카테고리</label>
                  <select
                    value={newVideo.teamId}
                    onChange={e => setNewVideo({ ...newVideo, teamId: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-kbo-blue/20 outline-none bg-white"
                  >
                    {TEAMS.map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 text-slate-500 font-bold">취소</button>
                <button type="submit" className="px-8 py-3 bg-kbo-blue text-white rounded-xl font-bold shadow-lg shadow-kbo-blue/20">게시하기</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map(post => (
          <motion.div
            key={post.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-3xl overflow-hidden flex flex-col"
          >
            <div className="aspect-video relative group">
              <iframe
                src={`https://www.youtube.com/embed/${post.videoId}`}
                title={post.title}
                className="w-full h-full"
                allowFullScreen
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-full uppercase tracking-widest">
                  {TEAMS.find(t => t.id === post.teamId)?.name.split(' ')[0]}
                </span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <img src={post.userPhoto} alt={post.userName} className="w-8 h-8 rounded-full border border-slate-100" />
                <div>
                  <p className="text-xs font-bold text-slate-900">{post.userName}</p>
                  <p className="text-[10px] text-slate-400">
                    {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : "방금 전"}
                  </p>
                </div>
              </div>
              
              <h4 className="text-lg font-bold text-slate-900 mb-6 line-clamp-2">{post.title}</h4>

              <div className="mt-auto space-y-4 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase mb-2">
                  <MessageSquare size={14} /> 댓글 {post.comments?.length || 0}
                </div>
                
                <div className="max-h-40 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                  {post.comments?.map(comment => (
                    <div key={comment.id} className="flex gap-3">
                      <img src={comment.userPhoto} alt={comment.userName} className="w-6 h-6 rounded-full shrink-0" />
                      <div className="bg-slate-50 p-3 rounded-2xl flex-1">
                        <p className="text-[10px] font-bold text-slate-900 mb-1">{comment.userName}</p>
                        <p className="text-xs text-slate-600 leading-relaxed">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                  {(!post.comments || post.comments.length === 0) && (
                    <p className="text-center text-xs text-slate-400 py-4 italic">첫 번째 댓글을 남겨보세요.</p>
                  )}
                </div>

                {user && (
                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={commentTexts[post.id] || ''}
                      onChange={e => setCommentTexts({ ...commentTexts, [post.id]: e.target.value })}
                      placeholder="댓글을 입력하세요..."
                      className="flex-1 px-4 py-2 bg-slate-50 rounded-xl text-xs border border-transparent focus:border-kbo-blue/20 focus:bg-white outline-none transition-all"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="p-2 bg-kbo-blue text-white rounded-xl hover:scale-105 transition-transform"
                    >
                      <Send size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {filteredPosts.length === 0 && (
        <div className="text-center py-20 glass-card rounded-3xl">
          <Youtube size={48} className="mx-auto text-slate-200 mb-4" />
          <p className="text-slate-400 font-medium">아직 게시된 영상이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
