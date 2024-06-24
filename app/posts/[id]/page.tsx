import db from '@/lib/db';
import getSession from '@/lib/session';
import { formatToTimeAgo } from '@/lib/utils';
import { EyeIcon, HandThumbUpIcon } from '@heroicons/react/24/solid';
import {
  EyeIcon as OutlineEyeIcon,
  HandThumbUpIcon as OutlineHandThumbUpIcon,
} from '@heroicons/react/24/outline';
import { revalidatePath } from 'next/cache';
import Image from 'next/image';
import { notFound } from 'next/navigation';

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
            likes: true,
          },
        },
      },
    });
    return post;
  } catch (err) {
    return null;
  }
}

async function getIsLiked(id: number) {
  const session = await getSession();
  const isLiked = await db.like.findUnique({
    where: {
      id: {
        postId: id,
        userId: session.id!,
      },
    },
  });
  console.log({ isLiked });
  return Boolean(isLiked);
}

interface PostDetailProps {
  params: {
    id: string;
  };
}

export default async function PostDetail(props: PostDetailProps) {
  const { params } = props;
  const { id } = params;
  const postId = Number(id);
  if (isNaN(postId)) {
    return notFound();
  }

  const post = await getPost(postId);

  if (!post) return notFound();
  console.log(post);

  const dislikePost = async () => {
    'use server';
    const session = await getSession();
    try {
      /** 두번 연속으로 클릭되는걸 방지하는 작업 필요. */
      await db.like.delete({
        where: {
          id: {
            postId,
            userId: session.id!,
          },
        },
      });
      // revalidatePath(`/post/${id}`);
    } catch (err) {}
  };

  const likePost = async () => {
    'use server';
    const session = await getSession();
    try {
      await db.like.create({
        data: {
          postId,
          userId: session.id!,
        },
      });
      // revalidatePath(`/post/${id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const isLiked = await getIsLiked(postId);

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
        <form action={isLiked ? dislikePost : likePost}>
          <button
            className={`flex items-center gap-2 text-neutral-400 text-sm border border-neutral-400 rounded-full p-2  transition-colors
              ${isLiked ? 'bg-orange-500 text-white border-orange-500' : 'hover:bg-neutral-800'}
              `}
          >
            {isLiked ? (
              <HandThumbUpIcon className='size-5' />
            ) : (
              <OutlineHandThumbUpIcon className='size-5' />
            )}
            {isLiked ? (
              <span>{post._count.likes}</span>
            ) : (
              <span>공감하기 ({post._count.likes})</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
