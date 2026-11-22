import type { QueryData, SupabaseClient } from '@supabase/supabase-js'
import type { Database, Tables, TablesUpdate } from '../types/database'
import type {
  Comment,
  Post,
  PostDetail,
  Profile,
  Subpingg,
  VoteValue,
} from '../types'
import { supabaseClient } from './supabase'

type FeedSort = 'terbaru' | 'teratas'
type ProfileRow = Tables<'profiles'>

const feedSelect = `
  id, subpingg_id, author_id, title, body, image_url, video_url, status, score, created_at,
  author:profiles!posts_author_id_fkey(id, username, display_name, bio, avatar_url, post_karma, comment_karma, created_at),
  subpingg:subpinggs!posts_subpingg_id_fkey(id, name, description, created_by, created_at),
  comments(count)
`

const detailSelect = `
  id, subpingg_id, author_id, title, body, image_url, video_url, status, score, created_at,
  author:profiles!posts_author_id_fkey(id, username, display_name, bio, avatar_url, post_karma, comment_karma, created_at),
  subpingg:subpinggs!posts_subpingg_id_fkey(id, name, description, created_by, created_at),
  comments:comments!comments_post_id_fkey(
    id, post_id, author_id, parent_id, body, score, created_at,
    author:profiles!comments_author_id_fkey(id, username, display_name, bio, avatar_url, post_karma, comment_karma, created_at)
  )
`

function getClient(): SupabaseClient<Database> {
  if (!supabaseClient) {
    throw new Error(
      'Supabase belum dikonfigurasi. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.',
    )
  }
  return supabaseClient
}

function feedQuery() {
  return getClient().from('posts').select(feedSelect)
}

function detailQuery() {
  return getClient().from('posts').select(detailSelect)
}

function profileQuery() {
  return getClient().from('profiles').select(
    'id, username, display_name, bio, avatar_url, post_karma, comment_karma, created_at',
  )
}

function authorPostsQuery() {
  return getClient().from('posts').select(feedSelect)
}

type FeedRow = QueryData<ReturnType<typeof feedQuery>>[number]
type AuthorPostsRow = QueryData<ReturnType<typeof authorPostsQuery>>[number]

function mapProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name ?? row.username,
    bio: row.bio ?? '',
    avatarUrl: row.avatar_url,
    postKarma: row.post_karma,
    commentKarma: row.comment_karma,
    createdAt: row.created_at,
  }
}

function mapSubpingg(row: Tables<'subpinggs'>): Subpingg {
  return {
    id: row.id,
    name: row.name,
    slug: row.name,
    description: row.description,
    createdBy: row.created_by,
    createdAt: row.created_at,
  }
}

function mapPost(row: FeedRow | AuthorPostsRow, viewerVote: VoteValue = 0): Post {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    author: mapProfile(row.author),
    subpinggId: row.subpingg_id,
    community: mapSubpingg(row.subpingg),
    score: row.score,
    commentCount: row.comments[0]?.count ?? 0,
    createdAt: row.created_at,
    status: row.status,
    imageUrl: row.image_url,
    youtubeUrl: row.video_url,
    viewerVote,
  }
}

async function getViewerId(): Promise<string | null> {
  const { data, error } = await getClient().auth.getSession()
  if (error) {
    throw error
  }
  return data.session?.user.id ?? null
}

async function getPostViewerVotes(
  userId: string | null,
  postIds: string[],
): Promise<Map<string, VoteValue>> {
  const votes = new Map<string, VoteValue>()
  if (!userId || postIds.length === 0) {
    return votes
  }

  const { data, error } = await getClient()
    .from('post_votes')
    .select('post_id, value')
    .eq('user_id', userId)
    .in('post_id', postIds)

  if (error) {
    throw error
  }
  for (const vote of data) {
    if (vote.value === 1 || vote.value === -1) {
      votes.set(vote.post_id, vote.value)
    }
  }
  return votes
}

async function getCommentViewerVotes(
  userId: string | null,
  commentIds: string[],
): Promise<Map<string, VoteValue>> {
  const votes = new Map<string, VoteValue>()
  if (!userId || commentIds.length === 0) {
    return votes
  }

  const { data, error } = await getClient()
    .from('comment_votes')
    .select('comment_id, value')
    .eq('user_id', userId)
    .in('comment_id', commentIds)

  if (error) {
    throw error
  }
  for (const vote of data) {
    if (vote.value === 1 || vote.value === -1) {
      votes.set(vote.comment_id, vote.value)
    }
  }
  return votes
}

export async function getFeed(sort: FeedSort): Promise<Post[]> {
  const query = feedQuery().eq('status', 'aktif')
  const { data, error } =
    sort === 'terbaru'
      ? await query.order('created_at', { ascending: false })
      : await query.order('score', { ascending: false })
  if (error) {
    throw error
  }

  const viewerId = await getViewerId()
  const votes = await getPostViewerVotes(
    viewerId,
    data.map((post) => post.id),
  )
  return data.map((post) => mapPost(post, votes.get(post.id) ?? 0))
}

export async function getSubpinggs(): Promise<Subpingg[]> {
  const { data, error } = await getClient()
    .from('subpinggs')
    .select('id, name, description, created_by, created_at')
    .order('name', { ascending: true })
  if (error) {
    throw error
  }
  return data.map(mapSubpingg)
}

export async function createSubpingg(input: {
  name: string
  description: string
  createdBy: string
}): Promise<Subpingg> {
  const client = getClient()
  const { data, error } = await client
    .from('subpinggs')
    .insert({
      name: input.name,
      description: input.description || null,
      created_by: input.createdBy,
    })
    .select('id, name, description, created_by, created_at')
    .single()
  if (error) {
    throw error
  }

  const { error: moderatorError } = await client
    .from('subpingg_moderators')
    .upsert(
      { subpingg_id: data.id, user_id: input.createdBy },
      { onConflict: 'subpingg_id,user_id', ignoreDuplicates: true },
    )
  if (moderatorError) {
    throw new Error(
      `Komunitas berhasil dibuat, tetapi moderator tidak berhasil ditetapkan: ${moderatorError.message}`,
    )
  }

  return mapSubpingg(data)
}

export async function getPostsBySubpingg(name: string): Promise<Post[]> {
  const client = getClient()
  const { data: subpingg, error: subpinggError } = await client
    .from('subpinggs')
    .select('id')
    .eq('name', name)
    .maybeSingle()
  if (subpinggError) {
    throw subpinggError
  }
  if (!subpingg) {
    return []
  }

  const { data, error } = await feedQuery()
    .eq('subpingg_id', subpingg.id)
    .eq('status', 'aktif')
    .order('created_at', { ascending: false })
  if (error) {
    throw error
  }

  const viewerId = await getViewerId()
  const votes = await getPostViewerVotes(
    viewerId,
    data.map((post) => post.id),
  )
  return data.map((post) => mapPost(post, votes.get(post.id) ?? 0))
}

export async function getPostDetail(id: string): Promise<PostDetail | null> {
  const { data, error } = await detailQuery()
    .eq('id', id)
    .maybeSingle()
  if (error) {
    throw error
  }
  if (!data) {
    return null
  }

  const viewerId = await getViewerId()
  const [postVotes, commentVotes] = await Promise.all([
    getPostViewerVotes(viewerId, [data.id]),
    getCommentViewerVotes(
      viewerId,
      data.comments.map((comment) => comment.id),
    ),
  ])
  const comments: Comment[] = data.comments
    .toSorted(
      (first, second) =>
        Date.parse(second.created_at) - Date.parse(first.created_at),
    )
    .map((comment) => ({
      id: comment.id,
      postId: comment.post_id,
      author: mapProfile(comment.author),
      body: comment.body,
      score: comment.score,
      createdAt: comment.created_at,
      parentId: comment.parent_id ?? undefined,
      viewerVote: commentVotes.get(comment.id) ?? 0,
    }))

  return {
    ...mapPost(
      {
        ...data,
        comments: [{ count: comments.length }],
      },
      postVotes.get(data.id) ?? 0,
    ),
    comments,
  }
}

export async function getProfile(username: string): Promise<Profile | null> {
  const { data, error } = await profileQuery()
    .eq('username', username)
    .maybeSingle()
  if (error) {
    throw error
  }
  return data ? mapProfile(data) : null
}

export async function getProfileById(id: string): Promise<Profile | null> {
  const { data, error } = await profileQuery().eq('id', id).maybeSingle()
  if (error) {
    throw error
  }
  return data ? mapProfile(data) : null
}

export async function getPostsByAuthorId(authorId: string): Promise<Post[]> {
  const { data, error } = await authorPostsQuery()
    .eq('author_id', authorId)
    .eq('status', 'aktif')
    .order('created_at', { ascending: false })
  if (error) {
    throw error
  }
  const viewerId = await getViewerId()
  const votes = await getPostViewerVotes(
    viewerId,
    data.map((post) => post.id),
  )
  return data.map((post) => mapPost(post, votes.get(post.id) ?? 0))
}

export async function createComment(
  postId: string,
  authorId: string,
  body: string,
  parentId?: string,
): Promise<Comment> {
  const { data, error } = await getClient()
    .from('comments')
    .insert({
      post_id: postId,
      author_id: authorId,
      body,
      parent_id: parentId ?? null,
    })
    .select(
      'id, post_id, author_id, parent_id, body, score, created_at, author:profiles!comments_author_id_fkey(id, username, display_name, bio, avatar_url, post_karma, comment_karma, created_at)',
    )
    .single()
  if (error) {
    throw error
  }
  return {
    id: data.id,
    postId: data.post_id,
    author: mapProfile(data.author),
    body: data.body,
    score: data.score,
    createdAt: data.created_at,
    parentId: data.parent_id ?? undefined,
    viewerVote: 0,
  }
}

export async function createPost(input: {
  subpinggId: string
  authorId: string
  title: string
  body: string
  imageUrl: string | null
  videoUrl: string | null
}): Promise<string> {
  const { data, error } = await getClient()
    .from('posts')
    .insert({
      subpingg_id: input.subpinggId,
      author_id: input.authorId,
      title: input.title,
      body: input.body,
      image_url: input.imageUrl,
      video_url: input.videoUrl,
      status: 'aktif',
    })
    .select('id')
    .single()
  if (error) {
    throw error
  }
  return data.id
}

export async function setPostVote(
  postId: string,
  userId: string,
  value: 1 | -1 | null,
): Promise<number> {
  const client = getClient()
  const voteQuery =
    value === null
      ? client
          .from('post_votes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId)
      : client.from('post_votes').upsert(
          { post_id: postId, user_id: userId, value },
          { onConflict: 'post_id,user_id' },
        )
  const { error: voteError } = await voteQuery
  if (voteError) {
    throw voteError
  }

  const { data, error } = await client
    .from('posts')
    .select('score')
    .eq('id', postId)
    .single()
  if (error) {
    throw error
  }
  return data.score
}

export async function setCommentVote(
  commentId: string,
  userId: string,
  value: 1 | -1 | null,
): Promise<number> {
  const client = getClient()
  const voteQuery =
    value === null
      ? client
          .from('comment_votes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', userId)
      : client.from('comment_votes').upsert(
          { comment_id: commentId, user_id: userId, value },
          { onConflict: 'comment_id,user_id' },
        )
  const { error: voteError } = await voteQuery
  if (voteError) {
    throw voteError
  }

  const { data, error } = await client
    .from('comments')
    .select('score')
    .eq('id', commentId)
    .single()
  if (error) {
    throw error
  }
  return data.score
}

export async function updateProfile(
  userId: string,
  updates: Pick<TablesUpdate<'profiles'>, 'display_name' | 'bio'>,
): Promise<Profile> {
  const { data, error } = await getClient()
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select(
      'id, username, display_name, bio, avatar_url, post_karma, comment_karma, created_at',
    )
    .single()
  if (error) {
    throw error
  }
  return mapProfile(data)
}
