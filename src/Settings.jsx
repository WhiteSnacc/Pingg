import React, { useState } from 'react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('account');
  const [formData, setFormData] = useState({
    username: 'RioGandaPahala',
    email: 'rio.sianipar@students.usu.ac.id',
    bio: 'Anak Ilmu Komputer USU | Frontend Dev wannabe',
    displayName: 'Rio Sianipar',
    nsfw: false,
    blurNsfw: true,
    emailNotifications: true,
    pushNotifications: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Pengaturan berhasil disimpan!');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-6 text-gray-200 bg-neutral-900 min-h-screen">
      
      {/* SIDEBAR TAB MENU */}
      <div className="w-full md:w-1/4 space-y-2">
        <h2 className="text-xl font-bold mb-4 text-white px-2">User Settings</h2>
        
        <button
          onClick={() => setActiveTab('account')}
          className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition ${
            activeTab === 'account' ? 'bg-orange-600 text-white' : 'hover:bg-neutral-800 text-gray-400'
          }`}
        >
          Account
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition ${
            activeTab === 'profile' ? 'bg-orange-600 text-white' : 'hover:bg-neutral-800 text-gray-400'
          }`}
        >
          Profile
        </button>

        <button
          onClick={() => setActiveTab('preferences')}
          className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition ${
            activeTab === 'preferences' ? 'bg-orange-600 text-white' : 'hover:bg-neutral-800 text-gray-400'
          }`}
        >
          Feed Preferences
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition ${
            activeTab === 'notifications' ? 'bg-orange-600 text-white' : 'hover:bg-neutral-800 text-gray-400'
          }`}
        >
          Notifications
        </button>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 bg-neutral-800 p-6 md:p-8 rounded-xl border border-neutral-700 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 1. TAB ACCOUNT */}
          {activeTab === 'account' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white border-b border-neutral-700 pb-3">Account Settings</h3>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          )}

          {/* 2. TAB PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white border-b border-neutral-700 pb-3">Profile Information</h3>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Display Name</label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">About / Bio</label>
                <textarea
                  name="bio"
                  rows="3"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          )}

          {/* 3. TAB PREFERENCES */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white border-b border-neutral-700 pb-3">Feed Preferences</h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">NSFW Content (18+)</h4>
                  <p className="text-sm text-gray-400">Display adult content in your home feed</p>
                </div>
                <input
                  type="checkbox"
                  name="nsfw"
                  checked={formData.nsfw}
                  onChange={handleChange}
                  className="w-5 h-5 accent-orange-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">Blur NSFW Images</h4>
                  <p className="text-sm text-gray-400">Automatically blur 18+ images and media</p>
                </div>
                <input
                  type="checkbox"
                  name="blurNsfw"
                  checked={formData.blurNsfw}
                  onChange={handleChange}
                  className="w-5 h-5 accent-orange-600 rounded cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* 4. TAB NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white border-b border-neutral-700 pb-3">Notification Settings</h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">Email Notifications</h4>
                  <p className="text-sm text-gray-400">Receive daily digest and replies via email</p>
                </div>
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={formData.emailNotifications}
                  onChange={handleChange}
                  className="w-5 h-5 accent-orange-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">Push Notifications</h4>
                  <p className="text-sm text-gray-400">Get instant alerts when someone comments on your post</p>
                </div>
                <input
                  type="checkbox"
                  name="pushNotifications"
                  checked={formData.pushNotifications}
                  onChange={handleChange}
                  className="w-5 h-5 accent-orange-600 rounded cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* SAVE BUTTON */}
          <div className="pt-4 border-t border-neutral-700 flex justify-end">
            <button
              type="submit"
              className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2.5 rounded-lg font-medium transition shadow-md"
            >
              Save Changes
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}