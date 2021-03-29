import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import { FiCalendar, FiUser } from 'react-icons/fi';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { dateFormat } from '../utils/dateFormat';
import Header from '../components/Header';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

const Home: React.FC<HomeProps> = ({ postsPagination }) => {
  const [posts, setPosts] = useState(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page || null);

  const handleLoadPosts = useCallback(async (): Promise<void> => {
    if (nextPage) {
      const response = await fetch(nextPage);
      const data = await response.json();

      setNextPage(data.next_page);
      setPosts(values => [...values, ...data.results]);
    }
  }, [nextPage]);

  return (
    <>
      <Header />
      <main className={`${commonStyles.container}`}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link href={`/post/${post.uid}`}>
              <a key={post.uid}>
                <h1>{post.data.title}</h1>
                <p>{post.data.subtitle}</p>
                <div className={commonStyles.postInfo}>
                  <p>
                    <FiCalendar />
                    {dateFormat(new Date(post.first_publication_date))}
                  </p>
                  <p>
                    <FiUser /> {post.data.author}
                  </p>
                </div>
              </a>
            </Link>
          ))}
          {nextPage && (
            <button type="button" onClick={handleLoadPosts}>
              Carregar mais posts
            </button>
          )}
        </div>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const { results, next_page } = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    { fetch: ['post.title', 'post.subtitle', 'post.author'], pageSize: 10 }
  );

  return {
    props: { postsPagination: { results, next_page } },
    revalidate: 60 * 60,
  }; // 1 hour
};

export default Home;
