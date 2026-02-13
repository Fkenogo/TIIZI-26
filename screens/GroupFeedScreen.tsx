
import React, { useEffect, useMemo, useState } from 'react';
import { AppView, Comment } from '../types';
import BottomNav from '../components/BottomNav';
import { useTiizi } from '../context/AppContext';
import { useFirestoreCollection } from '../utils/useFirestore';
import { useSearchParams } from 'react-router-dom';

interface Props {
  onNavigate: (view: AppView) => void;
}

const GroupFeedScreen: React.FC<Props> = ({ onNavigate }) => {
  const [params] = useSearchParams();
  const { state, createPost, addToast, updatePost, deletePost, addComment, fetchComments, addReply, likeComment, likeReply, reactToPost, sharePost, bookmarkPost } = useTiizi();
  const { posts, user } = state;
  const [activeTab, setActiveTab] = useState('All Activities');
  const [newPost, setNewPost] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [commentsByPost, setCommentsByPost] = useState<Record<string, Comment[]>>({});
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [sharePostId, setSharePostId] = useState<string | null>(null);

  useEffect(() => {
    const shareBadge = params.get('shareBadge');
    const shareType = params.get('shareType');
    const streak = params.get('streak');
    const challenge = params.get('challenge');
    if (shareBadge && !newPost) {
      setNewPost(`🎉 I just earned the "${shareBadge}" badge!`);
      return;
    }
    if (shareType === 'streak' && streak && !newPost) {
      const challengeName = challenge || 'our group challenge';
      setNewPost(`🔥 ${streak}-day streak complete in ${challengeName}!`);
    }
  }, [params, newPost]);

  const { items: stories } = useFirestoreCollection<{ id: string; label?: string; img?: string; icon?: string; color?: string }>(
    state.activeGroupId ? ['groups', state.activeGroupId, 'stories'] : []
  );

  const filteredPosts = useMemo(() => {
    const ownPosts = posts.filter((p) => p.userId === user.authUid);
    if (activeTab === 'Workouts Only') {
      return ownPosts.filter((p) => p.type === 'workout');
    }
    if (activeTab === 'Achievements') {
      return ownPosts.filter((p) => p.type === 'streak');
    }
    return ownPosts;
  }, [activeTab, posts, user.authUid]);

  const canSubmit = newPost.trim().length > 0 || !!imageFile;

  const compressImage = async (file: File) => {
    const bitmap = await createImageBitmap(file);
    const maxWidth = 1280;
    const scale = Math.min(1, maxWidth / bitmap.width);
    const targetWidth = Math.round(bitmap.width * scale);
    const targetHeight = Math.round(bitmap.height * scale);
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.82);
    });
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' });
  };

  const buildShareUrl = (postId: string) => `${window.location.origin}/group_feed?post=${postId}`;

  const openShare = (postId: string) => {
    setSharePostId(postId);
  };

  const shareTo = (channel: 'copy' | 'whatsapp' | 'facebook' | 'instagram' | 'native', postId: string) => {
    const url = buildShareUrl(postId);
    const text = 'Check this out on Tiizi';
    if (channel === 'native' && navigator.share) {
      navigator.share({ title: 'Tiizi', text, url }).catch(() => undefined);
      return;
    }
    if (channel === 'copy') {
      navigator.clipboard.writeText(url).then(() => addToast('Link copied!', 'success')).catch(() => addToast('Unable to copy link.', 'error'));
      return;
    }
    if (channel === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, '_blank');
      return;
    }
    if (channel === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
      return;
    }
    if (channel === 'instagram') {
      navigator.clipboard.writeText(url).then(() => addToast('Link copied. Share on Instagram.', 'success')).catch(() => addToast('Unable to copy link.', 'error'));
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased relative overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md px-6 py-4 pt-12 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Group Feed</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => setActiveTab('All Activities')} className="p-1 text-slate-800 dark:text-white">
            <span className="material-icons-round text-2xl">search</span>
          </button>
          <button onClick={() => onNavigate(AppView.NOTIFICATIONS)} className="p-1 text-slate-800 dark:text-white relative">
            <span className="material-icons-round text-2xl">notifications_none</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
          </button>
        </div>
      </header>

      {/* Stories/Circle Highlights */}
      <div className="flex gap-5 overflow-x-auto px-6 py-4 no-scrollbar">
        {stories.length === 0 && (
          <div className="text-xs text-slate-400">No highlights yet.</div>
        )}
        {stories.map((story, i) => (
          <div key={i} className="flex flex-col items-center gap-2 shrink-0">
            <div className="w-[72px] h-[72px] rounded-full p-1 border-2 border-primary/60 flex items-center justify-center bg-white dark:bg-slate-800 shadow-sm">
              {story.img ? (
                <img src={story.img} className="size-full rounded-full object-cover" alt={story.label} />
              ) : (
                <div className={`size-full rounded-full ${story.color} flex items-center justify-center text-3xl`}>
                  {story.icon}
                </div>
              )}
            </div>
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 max-w-[72px] text-center leading-tight">{story.label}</span>
          </div>
        ))}
      </div>

      {/* Create Post Composer */}
      <div className="px-6 pt-4">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-50 dark:border-slate-700 p-4 flex items-center gap-3">
          <div className="size-10 rounded-full overflow-hidden border border-slate-100 dark:border-slate-700">
            <img src={user.avatar} alt="Profile" className="w-full h-full object-cover grayscale" />
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <input
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm font-semibold placeholder:text-slate-400 dark:text-white"
              placeholder="Share an update with your group..."
            />
            {imagePreview && (
              <div className="relative">
                <img src={imagePreview} alt="Preview" className="rounded-2xl w-full max-h-40 object-cover border border-slate-100 dark:border-slate-700" />
                <button
                  onClick={() => {
                    if (imagePreview) URL.revokeObjectURL(imagePreview);
                    setImagePreview(null);
                    setImageFile(null);
                  }}
                  className="absolute top-2 right-2 size-8 rounded-full bg-black/60 text-white flex items-center justify-center"
                >
                  <span className="material-icons-round text-sm">close</span>
                </button>
              </div>
            )}
          </div>
          <label className="size-11 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-200 flex items-center justify-center cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0] || null;
                if (file) {
                  try {
                    const compressed = await compressImage(file);
                    const previewUrl = URL.createObjectURL(compressed);
                    setImageFile(compressed);
                    setImagePreview(previewUrl);
                  } catch (error) {
                    const previewUrl = URL.createObjectURL(file);
                    setImageFile(file);
                    setImagePreview(previewUrl);
                  }
                }
              }}
            />
            <span className="material-icons-round text-xl">image</span>
          </label>
          <button
            onClick={async () => {
              try {
                setIsSubmitting(true);
                await createPost(newPost, imageFile);
                setNewPost('');
                if (imagePreview) URL.revokeObjectURL(imagePreview);
                setImagePreview(null);
                setImageFile(null);
                addToast('Post shared!', 'success');
              } catch (error) {
                addToast('Unable to post. Try again.', 'error');
              } finally {
                setIsSubmitting(false);
              }
            }}
            disabled={isSubmitting || !canSubmit}
            className="size-11 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 active:scale-95 transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span className="material-icons-round text-xl">send</span>
          </button>
        </div>
      </div>

      {/* Pill Tabs */}
      <div className="flex gap-2.5 px-6 py-4 overflow-x-auto no-scrollbar">
        {['All Activities', 'Workouts Only', 'Achievements'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === tab 
                ? 'bg-primary/10 text-primary border border-primary/20' 
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {activeTab === tab && <span className="material-icons-round text-sm">check</span>}
            {tab}
          </button>
        ))}
      </div>

      <main className="flex-1 flex flex-col gap-6 px-4 pb-40 overflow-y-auto">
        {filteredPosts.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 p-6 text-center text-sm text-slate-500 dark:text-slate-400">
            No activity yet. Your posts will appear here once you share an update.
          </div>
        )}
        {filteredPosts.map((post) => {
          const reactions = post.reactions || { like: 0, clap: 0, celebrate: 0, kudos: 0 };
          return (
          <article key={post.id} className="bg-white dark:bg-slate-800 rounded-[24px] shadow-sm border border-slate-100 dark:border-slate-700 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img alt={post.userName} className="size-12 rounded-full object-cover border border-slate-200 dark:border-slate-700" src={post.avatar} />
                <div>
                  <h3 className="font-bold text-[15px] text-slate-800 dark:text-white">{post.userName}</h3>
                  <p className="text-xs font-medium text-slate-400">{post.time}</p>
                </div>
              </div>
              {post.userId === user.authUid ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (editingPostId === post.id) {
                        setEditingPostId(null);
                        setEditContent('');
                      } else {
                        setEditingPostId(post.id);
                        setEditContent(post.content);
                      }
                    }}
                    className="text-slate-400 hover:text-primary"
                  >
                    <span className="material-icons-round text-lg">edit</span>
                  </button>
                  <button
                    onClick={() => deletePost(post.id).catch(() => addToast('Unable to delete post.', 'error'))}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <span className="material-icons-round text-lg">delete</span>
                  </button>
                </div>
              ) : null}
            </div>

            {editingPostId === post.id ? (
              <div className="space-y-3 mb-5">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-sm font-medium text-slate-700 dark:text-slate-200"
                  rows={3}
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => {
                      setEditingPostId(null);
                      setEditContent('');
                    }}
                    className="px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      updatePost(post.id, editContent);
                      setEditingPostId(null);
                      setEditContent('');
                    }}
                    className="px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-primary"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-slate-700 dark:text-slate-300 mb-4 text-[14px] font-medium leading-relaxed">
                {post.content}
              </p>
            )}

            {post.image && (
              <div className="mb-5">
                <img src={post.image} alt="Post" className="w-full rounded-2xl border border-slate-100 dark:border-slate-700 object-cover max-h-80" />
              </div>
            )}

            {post.exercise && (
              <div className="bg-orange-50 dark:bg-primary/5 border border-orange-100 dark:border-primary/10 rounded-2xl p-4 mb-4 flex items-center gap-4">
                <div className="size-10 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-primary shadow-sm">
                  <span className="material-icons-round text-xl">fitness_center</span>
                </div>
                <div>
                  <h4 className="font-bold text-primary text-sm">{post.exercise}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{post.details}</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-700">
              <div className="flex gap-4 items-center text-slate-500 dark:text-slate-400">
                <button
                  onClick={() => reactToPost(post.id, 'like')}
                  className="flex items-center gap-1.5 text-sm"
                >
                  <span className="material-icons-round text-lg">favorite_border</span>
                  <span className="text-xs font-bold">{reactions.like}</span>
                </button>
                <button
                  onClick={async () => {
                    const nextExpanded = expandedPostId === post.id ? null : post.id;
                    setExpandedPostId(nextExpanded);
                    if (nextExpanded && !commentsByPost[post.id]) {
                      const comments = await fetchComments(post.id);
                      setCommentsByPost((prev) => ({ ...prev, [post.id]: comments }));
                    }
                  }}
                  className="flex items-center gap-1.5 text-sm"
                >
                  <span className="material-icons-round text-lg">chat_bubble_outline</span>
                  <span className="text-xs font-bold">{post.comments}</span>
                </button>
                <button
                  onClick={() => {
                    sharePost(post.id).catch(() => undefined);
                    openShare(post.id);
                  }}
                  className="flex items-center gap-1.5 text-sm"
                >
                  <span className="material-icons-round text-lg">share</span>
                  <span className="text-xs font-bold">{post.shareCount}</span>
                </button>
                <button
                  onClick={() => bookmarkPost(post.id).catch(() => undefined)}
                  className="flex items-center gap-1.5 text-sm"
                >
                  <span className="material-icons-round text-lg">bookmark_border</span>
                  <span className="text-xs font-bold">{post.bookmarkCount}</span>
                </button>
              </div>
              
              <div className="flex gap-1.5">
                {[
                  { type: 'kudos', icon: '🏅', count: reactions.kudos },
                  { type: 'clap', icon: '💪', count: reactions.clap },
                  { type: 'celebrate', icon: '👏', count: reactions.celebrate }
                ].map((r) => (
                  <button
                    key={r.type}
                    onClick={() => reactToPost(post.id, r.type as any)}
                    className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full text-xs font-medium"
                  >
                    <span className="text-sm">{r.icon}</span>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-300">{r.count}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {expandedPostId === post.id && (
              <div className="mt-5 pt-4 border-t border-slate-50 dark:border-slate-700 space-y-4">
                <div className="space-y-3">
                  {(commentsByPost[post.id] || []).filter((comment) => comment.userId === user.authUid).map((comment) => (
                    <div key={comment.id} className="flex items-start gap-2">
                      <img src={comment.avatar} alt={comment.userName} className="size-7 rounded-full object-cover" />
                      <div className="flex-1 space-y-2">
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                            <span className="font-bold text-slate-800 dark:text-white">{comment.userName}</span> {comment.content}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-[9px] text-slate-400">
                            <span>{comment.time}</span>
                            <button
                              onClick={() => likeComment(post.id, comment.id)}
                              className="flex items-center gap-1"
                            >
                              <span className="material-icons-round text-[12px]">favorite_border</span>
                              <span>{comment.likes}</span>
                            </button>
                            <button
                              onClick={() => setReplyDrafts((prev) => ({ ...prev, [comment.id]: prev[comment.id] ?? '' }))}
                              className="text-primary font-bold"
                            >
                              Reply
                            </button>
                          </div>
                        </div>

                        {comment.replies.filter((reply) => reply.userId === user.authUid).map((reply) => (
                          <div key={reply.id} className="flex items-start gap-2 ml-8">
                            <img src={reply.avatar} alt={reply.userName} className="size-6 rounded-full object-cover" />
                            <div className="flex-1">
                              <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                                <span className="font-bold text-slate-800 dark:text-white">{reply.userName}</span> {reply.content}
                              </p>
                              <div className="flex items-center gap-3 mt-1 text-[9px] text-slate-400">
                                <span>{reply.time}</span>
                                <button
                                  onClick={() => likeReply(post.id, comment.id, reply.id)}
                                  className="flex items-center gap-1"
                                >
                                  <span className="material-icons-round text-[12px]">favorite_border</span>
                                  <span>{reply.likes}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}

                        {replyDrafts[comment.id] !== undefined && (
                          <div className="flex items-center gap-2 ml-8">
                            <input
                              value={replyDrafts[comment.id] || ''}
                              onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [comment.id]: e.target.value }))}
                              className="flex-1 bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-2xl px-4 py-2 text-xs font-semibold"
                              placeholder="Write a reply..."
                            />
                            <button
                              onClick={async () => {
                                const content = replyDrafts[comment.id] || '';
                                await addReply(post.id, comment.id, content);
                                setReplyDrafts((prev) => ({ ...prev, [comment.id]: '' }));
                                const comments = await fetchComments(post.id);
                                setCommentsByPost((prev) => ({ ...prev, [post.id]: comments }));
                              }}
                              className="size-10 rounded-2xl bg-primary text-white flex items-center justify-center"
                            >
                              <span className="material-icons-round text-sm">send</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {commentsByPost[post.id]?.length === 0 && (
                    <p className="text-xs text-slate-400">No comments yet.</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    value={commentDrafts[post.id] || ''}
                    onChange={(e) => setCommentDrafts((prev) => ({ ...prev, [post.id]: e.target.value }))}
                    className="flex-1 bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-2xl px-4 py-2 text-xs font-semibold"
                    placeholder="Write a comment..."
                  />
                  <button
                    onClick={async () => {
                      const content = commentDrafts[post.id] || '';
                      await addComment(post.id, content);
                      setCommentDrafts((prev) => ({ ...prev, [post.id]: '' }));
                      const comments = await fetchComments(post.id);
                      setCommentsByPost((prev) => ({ ...prev, [post.id]: comments }));
                    }}
                    className="size-10 rounded-2xl bg-primary text-white flex items-center justify-center"
                  >
                    <span className="material-icons-round text-sm">send</span>
                  </button>
                </div>
              </div>
            )}
          </article>
        )})}
      </main>

      <BottomNav activeTab="feed" onNavigate={onNavigate} />

      {sharePostId && (
        <div className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm flex items-end">
          <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-900 rounded-t-[32px] p-6 pb-10">
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6"></div>
            <h3 className="text-lg font-black mb-4">Share Post</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => shareTo('native', sharePostId)}
                className="bg-primary/10 text-primary rounded-2xl py-4 font-bold"
              >
                Native Share
              </button>
              <button
                onClick={() => shareTo('copy', sharePostId)}
                className="bg-slate-100 dark:bg-slate-800 rounded-2xl py-4 font-bold"
              >
                Copy Link
              </button>
              <button
                onClick={() => shareTo('whatsapp', sharePostId)}
                className="bg-green-500/10 text-green-600 rounded-2xl py-4 font-bold"
              >
                WhatsApp
              </button>
              <button
                onClick={() => shareTo('facebook', sharePostId)}
                className="bg-blue-500/10 text-blue-600 rounded-2xl py-4 font-bold"
              >
                Facebook
              </button>
              <button
                onClick={() => shareTo('instagram', sharePostId)}
                className="bg-pink-500/10 text-pink-600 rounded-2xl py-4 font-bold"
              >
                Instagram
              </button>
            </div>
            <button
              onClick={() => setSharePostId(null)}
              className="mt-6 w-full py-3 text-sm font-bold text-slate-400"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupFeedScreen;
