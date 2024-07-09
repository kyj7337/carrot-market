import db from '@/lib/db';
import getSession from '@/lib/session';
import { formatToTimeAgo } from '@/lib/utils';
import { EyeIcon, HandThumbUpIcon } from '@heroicons/react/24/solid';
import Comment from '@/components/comment';
import {
  EyeIcon as OutlineEyeIcon,
  HandThumbUpIcon as OutlineHandThumbUpIcon,
} from '@heroicons/react/24/outline';
import { revalidatePath, unstable_cache as nextCache } from 'next/cache';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import LikeButton from '@/components/like-button';
import Input from '@/components/input';
import { commentAction } from './action';
import CommentList from '@/components/comment-list';
import { getComments } from '@/app/(tabs)/products/actiions';

async function getPost(id: number) {
  try {
    const post = await db.post.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    return post;
  } catch (err) {
    return null;
  }
}

async function getLikeStatus(id: number, userId: number) {
  // const session = await getSession();

  const isLiked = await db.like.findUnique({
    where: {
      id: {
        postId: id,
        userId,
      },
    },
  });

  const likeCount = await db.like.count({
    where: {
      postId: id,
    },
  });
  // console.log('DB: ', isLiked, likeCount);
  return {
    likeCount,
    isLiked: Boolean(isLiked),
  };
}

interface PostDetailProps {
  params: {
    id: string;
  };
}

const cachedPost = nextCache(getPost, ['post-detail']);
const cachedLikeStatus = nextCache(getLikeStatus, ['like-status']);

export default async function PostDetail(props: PostDetailProps) {
  const { params } = props;
  const { id } = params;
  const postId = Number(id);
  if (isNaN(postId)) {
    return notFound();
  }
  const session = await getSession();

  const post = await cachedPost(postId);

  if (!post) return notFound();

  const { isLiked, likeCount } = await cachedLikeStatus(postId, session.id!);
  const comments = await getComments(post.id);
  return (
    <div className='p-5 text-white'>
      <div className='flex items-center gap-2 mb-2'>
        <Image
          width={28}
          height={28}
          className='size-7 rounded-full'
          src={post.user.avatar!}
          alt={post.user.username}
        />
        <div>
          <span className='text-sm font-semibold'>{post.user.username}</span>
          <div className='text-xs'>
            <span>{formatToTimeAgo(post.created_at)}</span>
          </div>
        </div>
      </div>
      <h2 className='text-lg font-semibold'>{post.title}</h2>
      <p className='mb-5'>{post.description}</p>
      <div className='flex flex-col gap-5 items-start'>
        <div className='flex items-center gap-2 text-neutral-400 text-sm'>
          <EyeIcon className='size-5' />
          <span>조회 {post.views}</span>
        </div>

        <LikeButton isLiked={isLiked} likeCount={likeCount} postId={post.id} />

        <Comment comments={comments} postId={postId} />
      </div>
    </div>
  );
}
