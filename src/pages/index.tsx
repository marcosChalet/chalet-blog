import Head from "next/head";
import { GraphQLClient, request, gql } from "graphql-request";
import useSWR from "swr";

import BlogCard from "@/components/BlogCard";
import Layout from "@/components/Layout";

export const graphcms = new GraphQLClient(
  process.env.NEXT_PUBLIC_GRAPHQL_CLIENT ||
    "https://sa-east-1.cdn.hygraph.com/content/clfy1g0pr69s601uo6i2mboil/master",
  {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_GRAPHQL_KEY}`,
    },
  }
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
  const { data: postsSWR, error } = useSWR("posts", fetcher);

  if (!postsSWR)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin w-10 h-10 border-cyan-600 border-t-transparent border-4 rounded-full"></div>
      </div>
    );

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
