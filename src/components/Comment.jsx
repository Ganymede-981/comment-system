import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Comment({ comment, onReply, onUpvote }) {
  const [showReplies, setShowReplies] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (replyText.trim()) {
      onReply(comment.id, replyText);
      setReplyText("");
      setShowForm(false);
    }
  };

  // Avatar from user_id (initial)
  const avatarLetter = comment.user_id
    ? comment.user_id.charAt(0).toUpperCase()
    : "A";

  return (
    <motion.div
  layout
  initial={{ opacity: 0, y: 5 }}
  animate={{ opacity: 1, y: 0 }}
  className="relative pl-6 border-l border-gray-300 mb-6"
>
  <div className="flex items-start space-x-3">
    {/* Avatar */}
    <div
      className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-white`}
      style={{ backgroundColor: stringToColor(comment.user?.name || "Guest") }}
    >
      {comment.user?.name?.charAt(0).toUpperCase() || "U"}
    </div>

    {/* Text content */}
    <div className="flex-1">
      <div className="flex items-center gap-3">
        <p className="font-semibold text-gray-800">
          {comment.user?.name || "Guest"}
        </p>
        <span className="text-xs text-gray-500">{timeAgo(comment.created_at)}</span>
      </div>
      <p className="text-gray-700 mt-1 leading-relaxed">{comment.text}</p>

      <div className="flex items-center text-gray-500 mt-2 space-x-4 text-sm">
        <button
          onClick={() => onUpvote(comment.id)}
          className="flex items-center space-x-1 hover:text-blue-600 transition"
        >
          <span>👍</span>
          <span>{comment.upvotes}</span>
        </button>
        <button
          onClick={() => setShowForm(!showForm)}
          className="hover:text-blue-600"
        >
          Reply
        </button>
        <button
          onClick={() => setShowReplies(!showReplies)}
          className="hover:text-blue-600"
        >
          {showReplies ? "Hide replies" : "Show replies"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-3">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <button
            type="submit"
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded-md"
          >
            Reply
          </button>
        </form>
      )}
    </div>
  </div>

  {/* Replies */}
  <AnimatePresence>
    {showReplies && comment.replies?.length > 0 && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-4"
      >
        {comment.replies.map((reply) => (
          <Comment
            key={reply.id}
            comment={reply}
            onReply={onReply}
            onUpvote={onUpvote}
          />
        ))}
      </motion.div>
    )}
  </AnimatePresence>
</motion.div>

  );
}

/* --- Helper functions --- */

// Convert timestamp to “1h ago”, “10m ago”, etc.
function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 60000);
  if (diff < 1) return "just now";
  if (diff < 60) return `${diff}m ago`;
  const hours = Math.floor(diff / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

// Generate consistent avatar color
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = Math.floor(
    Math.abs((Math.sin(hash) * 16777215) % 16777215)
  ).toString(16);
  return "#" + "0".repeat(6 - color.length) + color;
}
