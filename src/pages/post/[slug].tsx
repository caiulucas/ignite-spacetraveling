import Prismic from '@prismicio/client';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import Header from '../../components/Header';
import { getPrismicClient } from '../../services/prismic';
import commonStyles from '../../styles/common.module.scss';
import { dateFormat } from '../../utils/dateFormat';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const { isFallback } = useRouter();

  const words = post.data.content.reduce((acc, content) => {
    // eslint-disable-next-line no-param-reassign
    acc += `${content.heading} ${RichText.asText(content.body)} `;
    return acc;
  }, '');

  const readingTime = Math.ceil(words.split(' ').length / 200);

  return (
    <>
      <Head>
        <title>Spacetraveling | {post.data?.title}</title>
      </Head>

      <Header />
      <img className={styles.banner} src={post.data.banner.url} alt="Banner" />
      {isFallback ? (
        <p>Carregando...</p>
      ) : (
        <main>
          <div className={`${commonStyles.container} ${styles.container}`}>
            <h1>{post.data.title}</h1>
            <div className={commonStyles.postInfo}>
              <p>
                <FiCalendar />
                {dateFormat(new Date(post.first_publication_date))}
              </p>
              <p>
                <FiUser /> {post.data.author}
              </p>
              <p>
                <FiClock />
                {`${readingTime} min`}
              </p>
            </div>
            <div className={styles.content}>
              {post.data.content.map(content => (
                <div>
                  <h2>{content.heading}</h2>
                  {content.body.map(({ text }) => (
                    <p key={text}>{text}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const { results } = await prismic.query(
    Prismic.predicates.at('document.type', 'post')
  );

  const paths = results.map(({ uid }) => ({ params: { slug: uid } }));

  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response: Post = await prismic.getByUID('post', String(slug), {});

  return { props: { post: response } };
};
export default Post;
