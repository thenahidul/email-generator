
import React, { useState, useEffect, useCallback } from 'react';
import { mailService } from '../services/mailService';
import { Account, Message, MessageDetail } from '../types';

interface InboxProps {
  account: Account;
}

const Inbox: React.FC<InboxProps> = ({ account }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMsg, setSelectedMsg] = useState<MessageDetail | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(false);

  const fetchMessages = useCallback(async () => {
    if (!account.token) return;
    setIsRefreshing(true);
    try {
      const res = await mailService.getMessages(account.token);
      setMessages(res);
    } catch (err) {
      console.error('Failed to fetch messages');
    } finally {
      setIsRefreshing(false);
    }
  }, [account.token]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000); // Polling every 10s
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const handleOpenMessage = async (id: string) => {
    if (!account.token) return;
    setLoadingMsg(true);
    try {
      const detail = await mailService.getMessageDetail(id, account.token);
      setSelectedMsg(detail);
      // Mark as seen locally
      setMessages(prev => prev.map(m => m.id === id ? { ...m, seen: true } : m));
    } catch (err) {
      console.error('Failed to load message body');
    } finally {
      setLoadingMsg(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(account.address);
    alert('Address copied to clipboard!');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Panel: Info and Message List */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">Your Address</h3>
            <button
              onClick={copyToClipboard}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
            >
              <i className="fas fa-copy"></i> Copy
            </button>
          </div>
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg break-all text-sm font-mono text-blue-700">
            {account.address}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col h-[500px]">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <i className="fas fa-inbox text-blue-500"></i>
              Inbox
            </h3>
            <button
              onClick={fetchMessages}
              disabled={isRefreshing}
              className={`p-2 rounded-full hover:bg-white transition-all ${isRefreshing ? 'animate-spin' : ''}`}
            >
              <i className="fas fa-sync-alt text-gray-400"></i>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center">
                <i className="fas fa-envelope-open text-4xl mb-4 opacity-20"></i>
                <p>Waiting for incoming messages...</p>
                <p className="text-xs mt-2">Refresh automatically every 10s</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {messages.map((msg) => (
                  <li
                    key={msg.id}
                    onClick={() => handleOpenMessage(msg.id)}
                    className={`p-4 cursor-pointer hover:bg-blue-50 transition-colors ${!msg.seen ? 'bg-blue-50/30' : ''} ${selectedMsg?.id === msg.id ? 'bg-blue-100/50 border-r-4 border-blue-500' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-sm font-bold truncate ${!msg.seen ? 'text-blue-900' : 'text-gray-700'}`}>
                        {msg.from.name || msg.from.address}
                      </span>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className={`text-xs truncate ${!msg.seen ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>
                      {msg.subject || '(No Subject)'}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel: Message View */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 h-full min-h-[500px] flex flex-col">
          {loadingMsg ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <i className="fas fa-circle-notch animate-spin text-3xl text-blue-500 mb-4"></i>
              <p className="text-gray-500">Loading message content...</p>
            </div>
          ) : selectedMsg ? (
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedMsg.subject}</h2>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium text-gray-700 mr-2">From:</span>
                  {selectedMsg.from.name} ({selectedMsg.from.address})
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Received: {new Date(selectedMsg.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="flex-1 p-6 overflow-y-auto">
                {selectedMsg.html && selectedMsg.html.length > 0 ? (
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: selectedMsg.html[0] }} />
                ) : (
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                    {selectedMsg.text}
                  </pre>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-eye text-4xl opacity-10"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">Message Preview</h3>
              <p className="max-w-xs text-sm">Select an email from the left to read its full content here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inbox;
