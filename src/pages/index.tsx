import Head from "next/head";
import { GraphQLClient, gql } from "graphql-request";
import useSWR from "swr";

import BlogCard from "@/components/BlogCard";
import Layout from "@/components/Layout";

const graphcms = new GraphQLClient(
  process.env.NEXT_PUBLIC_GRAPHQL_CLIENT || ""
);

const QUERY = gql`
  {
    posts {
      id
      title
      datePublished
      slug
      content {
        html
      }
      author {
        name
        avatar {
          url
        }
      }
      coverPhoto {
        url
      }
    }
  }
`;

export async function getStaticProps() {
  try {
    const { posts }: any = await graphcms.request(QUERY);

    return {
      props: {
        posts,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.log(error);
  }

  return {
    props: {},
  };
}

async function fetcher() {
  const { posts }: any = await graphcms.request(QUERY);
  return posts;
}

export default function Home({ posts }: any) {
  const { data: postsSWR } = useSWR("posts", fetcher);

  if (!postsSWR)
    return <div className="text-white p-5 text-xl">carregando...</div>;

  return (
    <>
      <Head>
        <title>Chalet Blog</title>
        <meta
          name="description"
          content="Blog para compartilhar meus estudos e progressão dentro do desenvolvimento de software."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicn.ico" />
      </Head>
      <Layout>
        <main className="container max-w-6xl m-auto py-14 flex flex-col sm:flex-row items-center justify-center flex-wrap min-h-screen">
          {postsSWR
            .map((post: any) => (
              <BlogCard
                key={post.id}
                slug={post.slug}
                title={post.title}
                author={post.author}
                coverPhoto={post.coverPhoto}
                datePublished={post.datePublished}
              />
            ))
            .reverse()}
        </main>
      </Layout>
    </>
  );
}
