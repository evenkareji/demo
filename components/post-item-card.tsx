import { format } from 'date-fns';
import Link from 'next/link';
import { Post } from '../types/post';
import { useUser } from '../lib/user';

const PostItemCard = ({ post }: { post: Post }) => {
  const user = useUser(post.authorId);
  return (
    <div className="rounded-md shadow p-4">
      <h2 className="line-clamp-2">
        <Link href={`/posts/${post.id}`}>
          <a> {post.title}</a>
        </Link>
      </h2>
      {user && (
        <div className="flex items-center">
          <img
            src={user.avatarURL}
            alt=""
            className="w-8 h-8 rounded-full block"
          />
          <div>
            <p className="truncate">{user.name}</p>
            <p className="text-slate-500 text-sm">
              {format(post.createdAt, 'yyyy/MM/dd')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostItemCard;
