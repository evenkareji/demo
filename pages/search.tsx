import React, { ReactNode, useEffect, useState } from 'react';
import algoliasearch from 'algoliasearch/lite';
import {
  Configure,
  Hits,
  HitsProps,
  InstantSearch,
  Pagination,
  SearchBox,
  SearchBoxProps,
  useInstantSearch,
} from 'react-instantsearch-hooks-web';
import { debounce } from 'debounce';
import { Post } from '../types/post';
// var2->var1に変更
import { SearchIcon } from '@heroicons/react/outline';
import { format } from 'date-fns';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/client';
import { User } from '../types/user';
import useSWR from 'swr/immutable';
import Link from 'next/link';
const searchClient = algoliasearch(
  'NFBPGPQUY8',
  '57870227630d627e13b9ea9e495f2f84',
);

const Hit: HitsProps<Post>['hitComponent'] = ({ hit }) => {
  const { data: user } = useSWR<User>(
    hit.authorId && `users/${hit.authorId}`,
    async () => {
      console.log('データ取得');
      // documentを確定させ
      const ref = doc(db, `users/${hit.authorId}`);
      // 取得し
      const snap = await getDoc(ref);
      return snap.data() as User;
    },
  );

  return (
    <div className="rounded-md shadow p-4">
      <h2 className="line-clamp-2">
        <Link href={`/posts/${hit.id}`}>
          <a> {hit.title}</a>
        </Link>
      </h2>
      <p className="text-slate-500">{format(hit.createdAt, 'yyyy/MM/dd')}</p>
      {user && <p className="truncate">{user.name}</p>}
    </div>
  );
};

const NoResultsBoundary = ({ children }: { children: ReactNode }) => {
  const { results } = useInstantSearch();
  if (!results.__isArtificial && results.nbHits === 0) {
    return <p>「{results.query}」の検索結果はありませんでした</p>;
  }
  return (
    <div>
      {results.query && (
        <p className="text-sm text-slate-500 my-4">
          「{results.query}」の検索結果は{results.nbHits}件見つかりました。
        </p>
      )}
      {children}
    </div>
  );
};

const Search = () => {
  const search: SearchBoxProps['queryHook'] = (query, hook) => {
    console.log('検索実行');

    hook(query);
  };
  return (
    <div className="container">
      <h1>検索</h1>
      <InstantSearch indexName="posts" searchClient={searchClient}>
        <SearchBox
          classNames={{
            root: 'relative inline-block',
            input: 'rounded-full border-slate-300 pr-10',
            submitIcon: 'hidden',
            resetIcon: 'hidden',
          }}
          submitIconComponent={() => (
            <span className="absolute right-0  p-2 w-10 top-1/2 -translate-y-1/2">
              <SearchIcon className="w-5 h-5 text-slate-500" />
            </span>
          )}
          queryHook={debounce(search, 500)}
        />
        <Configure hitsPerPage={4} />
        <NoResultsBoundary>
          <Hits<Post>
            classNames={{ list: 'space-y-4 my-6' }}
            hitComponent={Hit}
          />
          <Pagination
            classNames={{
              list: 'flex space-x-1',
              link: 'py-1 px-3 block',
              disabledItem: 'opacity-40',
              selectedItem: 'text-blue-500',
            }}
          />
        </NoResultsBoundary>
      </InstantSearch>
    </div>
  );
};

export default Search;
