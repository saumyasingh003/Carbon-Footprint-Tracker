"use client";

import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import {
  SendHorizonal,
  Paperclip,
  Smile,
  X,
  Trash2,
  FileText,
  User2,
  Image,
} from "lucide-react";

const Community = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [reactionMenuMessageId, setReactionMenuMessageId] =
    useState(null);
  const [deleteConfirmMsgId, setDeleteConfirmMsgId] = useState(null);

  const chatContainerRef = useRef(null);

  const emojis = [
    "🌱",
    "🌿",
    "🌳",
    "⚡",
    "🌍",
    "🚴",
    "🥗",
    "👍",
    "❤️",
    "😊",
    "🔥",
    "🎉",
    "✨",
    "👏",
    "💚",
    "💧",
    "💪",
    "🚲",
    "☀️",
    "♻️",
  ];

  // Authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      toast.error(
        t("pleaseLoginToAccess")
      );
      window.location.href = "/login";
      return;
    }

    setCurrentUser(JSON.parse(userStr));
  }, []);

  // Mark community notifications as read on mount
  useEffect(() => {
    const markCommunityRead = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        await axios.put(
          "https://carbon-footprint-tracker-4dxj.onrender.com/notification/mark-read-type/community",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Dispatch auth-change event to update Navbar notification count
        window.dispatchEvent(new Event("auth-change"));
      } catch (error) {
        console.log("Error marking community notifications as read:", error.message);
      }
    };

    markCommunityRead();
  }, []);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const res = await axios.get(
          "https://carbon-footprint-tracker-4dxj.onrender.com/message/all?room=global",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success) {
          setMessages(res.data.messages);
        }
      } catch (error) {
        console.log(error);
        toast.error(t("couldNotLoadMessages"));
      }
    };

    fetchMessages();
  }, []);

  // Socket Setup
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    const newSocket = io("https://carbon-footprint-tracker-4dxj.onrender.com");

    setSocket(newSocket);

    newSocket.emit("join_room", "global");

    newSocket.on("receive_message", (newMsg) => {
      setMessages((prev) => [...prev, newMsg]);
    });

    newSocket.on(
      "message_reacted",
      ({ messageId, reactions }) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === messageId
              ? { ...msg, reactions }
              : msg
          )
        );
      }
    );

    newSocket.on("message_deleted", ({ messageId }) => {
      setMessages((prev) =>
        prev.filter((msg) => msg._id !== messageId)
      );
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Auto Scroll
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Send Message
  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    if (!socket || !currentUser) {
      toast.error(t("socketNotConnected"));
      return;
    }

    socket.emit("send_message", {
      userId: currentUser._id,
      message,
      room: "global",
    });

    setMessage("");
  };

  // Upload File
  const handleFileUpload = async (e, fileType) => {
    const file = e.target.files[0];

    if (!file) return;

    const token = localStorage.getItem("token");

    const formData = new FormData();

    formData.append("file", file);
    formData.append("fileType", fileType);
    formData.append("room", "global");

    if (fileType === "docx") {
      formData.append("message", file.name);
    }

    const toastId = toast.loading(
      t("uploading", { type: fileType })
    );

    try {
      await axios.post(
        "https://carbon-footprint-tracker-4dxj.onrender.com/message/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(t("uploadedSuccess"), {
        id: toastId,
      });
    } catch (error) {
      toast.error(t("uploadFailed"), {
        id: toastId,
      });
    } finally {
      e.target.value = "";
    }
  };

  // Delete Message
  const handleDeleteMessage = (messageId) => {
    setDeleteConfirmMsgId(messageId);
  };

  const confirmDeleteMessage = () => {
    if (deleteConfirmMsgId && socket && currentUser) {
      socket.emit("delete_message", {
        messageId: deleteConfirmMsgId,
        userId: currentUser._id,
      });
    }
    setDeleteConfirmMsgId(null);
  };

  return (
    <div className="h-screen bg-[#f5f7f2] pt-24 sm:pt-28 px-3 sm:px-4 md:px-8 lg:px-14 pb-4 sm:pb-6 flex flex-col overflow-hidden">
      {/* Heading */}
      <div className="mb-4 shrink-0">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1e2a03] mt-1 leading-tight">
          {t("communityDiscussion")}
        </h1>

        <p className="hidden sm:block text-gray-500 text-xs md:text-sm mt-1.5 max-w-2xl leading-relaxed">
          {t("communityDiscussionDesc")}
        </p>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-4 md:gap-6 flex-1 min-h-0 overflow-hidden mb-2">
        {/* LEFT */}
        <div className="hidden xl:flex bg-white rounded-3xl border border-[#95A472]/10 shadow-sm p-5 h-full flex-col justify-between shrink-0 overflow-y-auto">
          <div>
            <h2 className="text-lg font-bold text-[#1e2a03]">
              {t("shareContent")}
            </h2>

            <p className="text-gray-500 text-xs mt-1 leading-6">
              {t("shareContentDesc")}
            </p>
          </div>

          <div className="space-y-3 mt-5">
            <div className="w-full flex items-center gap-3 p-3 rounded-2xl border border-[#95A472]/10 bg-[#f5f7f2]/50">
              <div className="w-10 h-10 rounded-xl bg-[#eef6e8] flex items-center justify-center shrink-0">
                <User2
                  size={18}
                  className="text-[#1e2a03]"
                />
              </div>

              <div className="text-left">
                <h3 className="font-semibold text-sm text-[#1e2a03]">
                  {t("chatWithCommunity")}
                </h3>

                <p className="text-[11px] text-gray-500 mt-0.5">
                  {t("shareThoughtsIdeas")}
                </p>
              </div>

            </div>
          </div>


          <div className="space-y-3 mt-5">
            <div className="w-full flex items-center gap-3 p-3 rounded-2xl border border-[#95A472]/10 bg-[#f5f7f2]/50">
              <div className="w-10 h-10 rounded-xl bg-[#eef6e8] flex items-center justify-center shrink-0">
                <Image
                  size={18}
                  className="text-[#1e2a03]"
                />
              </div>

              <div className="text-left">
                <h3 className="font-semibold text-sm text-[#1e2a03]">
                  {t("shareImages")}
                </h3>

                <p className="text-[11px] text-gray-500 mt-0.5">
                  {t("shareJourneyPhotos")}
                </p>
              </div>

            </div>
          </div>

          <div className="mt-5 bg-[#f5f7f2] rounded-2xl p-4 border border-[#95A472]/10">
            <p className="uppercase tracking-[0.22em] text-[9px] text-[#95A472] font-semibold">
              {t("communityInsights")}
            </p>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div>
                <h1 className="text-xl font-bold text-[#1e2a03]">
                  1.2K
                </h1>

                <p className="text-[11px] text-gray-500 mt-0.5">
                  {t("membersLabel")}
                </p>
              </div>

              <div>
                <h1 className="text-xl font-bold text-[#1e2a03]">
                  8.4K
                </h1>

                <p className="text-[11px] text-gray-500 mt-0.5">
                  {t("postsLabel")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border h-full border-[#95A472]/10 shadow-lg flex flex-col overflow-hidden">
          {/* TOP */}
          <div className="border-b border-[#95A472]/10 px-4 sm:px-5 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1e2a03]">
                {t("communityFeed")}
              </h2>

              <p className="text-[11px] sm:text-xs text-gray-500 mt-1">
                {t("liveSustainabilityDiscussions")}
              </p>
            </div>

            <div className="flex items-center gap-2 bg-[#eef6e8] px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>

              <p className="text-[10px] sm:text-[11px] font-medium text-[#1e2a03]">
                {t("liveStatus")}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto px-3 sm:px-5 py-4 sm:py-6 space-y-4 sm:space-y-6 bg-gradient-to-b from-[#fafbf9] to-[#f3f5f0]"
          >
            {messages.map((msg) => {
              const isMine =
                msg.user?._id === currentUser?._id;

              const displayName = isMine
                ? t("youDisplayName")
                : msg.user?.username || t("anonymousDisplayName");

              const timeStr = new Date(
                msg.createdAt
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              const initials = displayName
                .slice(0, 2)
                .toUpperCase();

              return (
                <div
                  key={msg._id}
                  className={`flex items-end gap-2 sm:gap-3 ${isMine
                    ? "justify-end ml-auto"
                    : "justify-start"
                    } max-w-[95%] sm:max-w-[80%] md:max-w-[75%] group relative`}
                >
                  {!isMine && (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#95A472]/20 to-[#41521F]/10 text-[#41521F] border border-[#95A472]/30 flex items-center justify-center text-xs font-bold tracking-wider shrink-0 mb-1 shadow-sm">
                      {initials}
                    </div>
                  )}

                  <div
                    className={`flex flex-col gap-1 max-w-full relative ${isMine
                      ? "items-end"
                      : "items-start"
                      }`}
                  >
                    {/* Reaction Menu */}
                    {reactionMenuMessageId ===
                      msg._id && (
                        <div className="absolute bottom-full mb-2 bg-white border shadow-xl rounded-full px-2 py-1 flex items-center gap-1 z-40">
                          {[
                            "👍",
                            "❤️",
                            "😂",
                            "😮",
                            "🙏",
                          ].map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => {
                                socket?.emit(
                                  "react_message",
                                  {
                                    messageId: msg._id,
                                    userId:
                                      currentUser?._id,
                                    emoji,
                                  }
                                );

                                setReactionMenuMessageId(
                                  null
                                );
                              }}
                              className="hover:scale-125 transition-all"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}

                    {/* Actions */}
                    <div
                      className={`absolute ${isMine
                        ? "right-0 -top-10 sm:right-full sm:mr-3 sm:top-1/2 sm:-translate-y-1/2"
                        : "left-0 -top-10 sm:left-full sm:ml-3 sm:top-1/2 sm:-translate-y-1/2"
                        } opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 z-20 flex items-center bg-white border border-[#95A472]/15 shadow-md rounded-full p-1 gap-1`}
                    >
                      <button
                        onClick={() =>
                          setReactionMenuMessageId(
                            reactionMenuMessageId ===
                              msg._id
                              ? null
                              : msg._id
                          )
                        }
                        className="w-6 h-6 flex items-center justify-center rounded-full"
                      >
                        <Smile size={14} />
                      </button>

                      {isMine && (
                        <button
                          onClick={() =>
                            handleDeleteMessage(
                              msg._id
                            )
                          }
                          className="w-6 h-6 flex items-center justify-center rounded-full text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    {!isMine && (
                      <span className="text-[11px] font-semibold text-[#41521F] px-2">
                        {displayName}
                      </span>
                    )}

                    {/* Bubble */}
                    <div
                      className={`px-4 py-3 max-w-full shadow-sm transition-all duration-200 ${isMine
                        ? "rounded-2xl rounded-br-none bg-gradient-to-br from-[#41521F] to-[#2e3b15] text-white hover:shadow-md hover:shadow-[#41521F]/15"
                        : "rounded-2xl rounded-bl-none bg-[#f5f7f2] border border-[#95A472]/20 text-[#1e2a03] hover:shadow-md"
                        }`}
                    >
                      {/* TEXT */}
                      {msg.fileType === "text" && (
                        <p className="text-xs sm:text-[13px] leading-6 break-words whitespace-pre-wrap">
                          {msg.message}
                        </p>
                      )}

                      {/* IMAGE */}
                      {msg.fileType === "image" && (
                        <div className="space-y-2">
                          <img
                            onClick={() =>
                              setActiveImage(
                                msg.fileUrl
                              )
                            }
                            src={`https://carbon-footprint-tracker-4dxj.onrender.com${msg.fileUrl}`}
                            alt=""
                            className="max-h-52 sm:max-h-64 w-full object-cover rounded-2xl cursor-pointer min-h-[120px] bg-[#95A472]/5"
                            onLoad={() => {
                              if (chatContainerRef.current) {
                                chatContainerRef.current.scrollTop =
                                  chatContainerRef.current.scrollHeight;
                              }
                            }}
                          />

                          {msg.message && (
                            <p className="text-xs sm:text-[13px] leading-6">
                              {msg.message}
                            </p>
                          )}
                        </div>
                      )}

                      {/* VIDEO */}
                      {msg.fileType === "video" && (
                        <video
                          src={`https://carbon-footprint-tracker-4dxj.onrender.com${msg.fileUrl}`}
                          controls
                          className="max-h-56 sm:max-h-72 w-full object-cover rounded-2xl"
                          onLoadedData={() => {
                            if (chatContainerRef.current) {
                              chatContainerRef.current.scrollTop =
                                chatContainerRef.current.scrollHeight;
                            }
                          }}
                        />
                      )}

                      {/* AUDIO */}
                      {msg.fileType === "audio" && (
                        <audio
                          controls
                          src={`https://carbon-footprint-tracker-4dxj.onrender.com${msg.fileUrl}`}
                          className="w-full"
                        />
                      )}

                      {/* DOC */}
                      {msg.fileType === "docx" && (
                        <a
                          href={`https://carbon-footprint-tracker-4dxj.onrender.com${msg.fileUrl}`}
                          target="_blank"
                          className={`flex items-center gap-3 p-3 rounded-2xl border ${isMine
                            ? "bg-white/10 border-white/10"
                            : "bg-white border-[#95A472]/15"
                            }`}
                        >
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#eef6e8]">
                            <FileText size={20} />
                          </div>

                          <div>
                            <p className="text-xs font-semibold truncate">
                              {msg.message}
                            </p>

                            <p className="text-[9px] uppercase tracking-wider">
                              {t("docxDocument")}
                            </p>
                          </div>
                        </a>
                      )}

                      {/* TIME */}
                      <div className="flex justify-end mt-1">
                        <span className="text-[9px] opacity-60">
                          {timeStr}
                        </span>
                      </div>
                    </div>
                  </div>

                  {isMine && (
                    <div className="w-9 h-9 rounded-full bg-[#eef6e8] text-[#1e2a03] border border-[#95A472]/30 flex items-center justify-center text-xs font-bold tracking-wider shrink-0 mb-1 shadow-sm">
                      {initials}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom */}
          <div className="border-t border-[#95A472]/10 px-3 sm:px-4 py-3 bg-[#fafbf9]">
            <form
              onSubmit={handleSendMessage}
              className="bg-white border border-[#95A472]/15 shadow-[0_2px_12px_rgba(149,164,114,0.06)] rounded-2xl px-3 sm:px-4 py-2.5 flex items-center gap-2 sm:gap-3"
            >
              {/* Upload */}
              <label
                htmlFor="chat-file-upload"
                className="cursor-pointer"
              >
                <Paperclip
                  size={18}
                  className="text-gray-400"
                />
              </label>

              <input
                type="file"
                id="chat-file-upload"
                className="hidden"
                accept="image/*,video/*,audio/*,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files[0];

                  if (!file) return;

                  const ext = file.name
                    .split(".")
                    .pop()
                    .toLowerCase();

                  let fileType = "image";

                  if (
                    [
                      "mp4",
                      "mov",
                      "webm",
                    ].includes(ext)
                  ) {
                    fileType = "video";
                  } else if (
                    [
                      "mp3",
                      "wav",
                      "ogg",
                    ].includes(ext)
                  ) {
                    fileType = "audio";
                  } else if (
                    ["doc", "docx"].includes(ext)
                  ) {
                    fileType = "docx";
                  }

                  handleFileUpload(e, fileType);
                }}
              />

              {/* Input */}
              <input
                type="text"
                placeholder={t("shareThoughtsPlaceholder")}
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                className="flex-1 bg-transparent outline-none text-xs sm:text-[13px] text-[#1e2a03] placeholder:text-gray-400 min-w-0"
              />

              {/* Emoji */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setShowEmojiPicker(
                      !showEmojiPicker
                    )
                  }
                >
                  <Smile
                    size={18}
                    className="text-gray-400"
                  />
                </button>

                {showEmojiPicker && (
                  <div className="absolute bottom-12 right-0 bg-white border shadow-2xl rounded-2xl p-3 grid grid-cols-5 gap-2 z-50 w-52">
                    {emojis.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          setMessage(
                            (prev) =>
                              prev + emoji
                          );

                          setShowEmojiPicker(
                            false
                          );
                        }}
                        className="w-8 h-8 flex items-center justify-center hover:bg-[#eef6e8] rounded-lg"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Send */}
              <button
                type="submit"
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2d3f11] to-[#1e2a03] flex items-center justify-center"
              >
                <SendHorizonal
                  size={16}
                  className="text-white"
                />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
          onClick={() => setActiveImage(null)}
        >
          <button
            onClick={() => setActiveImage(null)}
            className="absolute top-5 right-5 text-white"
          >
            <X size={24} />
          </button>

          <img
            src={`https://carbon-footprint-tracker-4dxj.onrender.com${activeImage}`}
            alt=""
            className="max-w-full max-h-[85vh] object-contain rounded-2xl"
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmMsgId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all duration-300">
          <div className="bg-white rounded-3xl border border-[#95A472]/20 shadow-2xl p-6 w-full max-w-sm transform scale-100 transition-all duration-300 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4">
              <Trash2 size={22} />
            </div>

            <h3 className="text-lg font-bold text-[#1e2a03]">
              {t("deleteMessageHeading")}
            </h3>

            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              {t("deleteMessageDesc")}
            </p>

            <div className="grid grid-cols-2 gap-3 w-full mt-6">
              <button
                type="button"
                onClick={() => setDeleteConfirmMsgId(null)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-xs sm:text-sm hover:bg-gray-50 transition"
              >
                {t("cancel")}
              </button>

              <button
                type="button"
                onClick={confirmDeleteMessage}
                className="px-4 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-xs sm:text-sm hover:bg-red-600 shadow-md shadow-red-500/10 transition"
              >
                {t("yesDelete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;