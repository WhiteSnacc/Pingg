import { BrowserRouter, Route, Routes } from 'react-router-dom'
import InboxPage from './pages/InboxPage'
import CommunitiesPage from './pages/CommunitiesPage'
import CreateCommunityPage from './pages/CreateCommunityPage'
import CreatePostPage from './pages/CreatePostPage'
import FeedPage from './pages/FeedPage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import PostPage from './pages/PostPage'
import ProfilePage from './pages/ProfilePage'
import RegisterPage from './pages/RegisterPage'
import SearchPage from './pages/SearchPage'
import SettingsPage from './pages/SettingsPage'
import SubpinggPage from './pages/SubpinggPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FeedPage />} />
        <Route path="/communities" element={<CommunitiesPage />} />
        <Route path="/communities/create" element={<CreateCommunityPage />} />
        <Route path="/p/:subpingg" element={<SubpinggPage />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/submit" element={<CreatePostPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/inbox" element={<InboxPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
