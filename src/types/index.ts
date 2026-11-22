export interface Profile {
  id: string
  username: string
  displayName: string
  bio: string
  avatarUrl: string | null
  postKarma: number
  commentKarma: number
  createdAt: string
}

export interface Subpingg {
  id: string
  name: string
  slug: string
  description: string | null
  createdBy: string
  createdAt: string
}

export interface Post {
  id: string
  title: string
  body: string | null
  author: Profile
  subpinggId: string
  community: Subpingg
  score: number
  commentCount: number
  createdAt: string
  status: string
  imageUrl: string | null
  youtubeUrl: string | null
  viewerVote: VoteValue
}

export interface Comment {
  id: string
  postId: string
  author: Profile
  body: string
  score: number
  createdAt: string
  parentId?: string
  viewerVote: VoteValue
}

export type VoteValue = -1 | 0 | 1

export interface Vote {
  userId: string
  targetId: string
  targetType: 'post' | 'comment'
  value: -1 | 1
}

export interface PostDetail extends Post {
  comments: Comment[]
}

export interface ProfileWithPosts extends Profile {
  posts: Post[]
}
