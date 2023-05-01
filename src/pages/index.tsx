import Head from "next/head";
import { GraphQLClient, gql } from "graphql-request";
import { LRUCache } from "lru-cache";

import BlogCard from "@/components/BlogCard";
import Layout from "@/components/Layout";

const options = {
  max: 5, // número máximo de itens no cache
  maxAge: 1000 * 60 * 60 * 24 * 15,
};

const cache = new LRUCache(options);

export const graphcms = new GraphQLClient(process.env.GRAPHQL_CLIENT || "", {
  headers: {
    Authorization: `Bearer ${process.env.GRAPHQL_KEY}`,
  },
});

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
    if (cache.has("posts")) {
      console.log("resposta do cache...");
      return cache.get("posts");
    }

    const { posts }: any = await graphcms.request(QUERY);

    cache.set("posts", posts);

    return {
      props: {
        posts,
      },
    };
  } catch (error) {
    console.log(error);
  }

  return {
    props: {},
    revalidate: 86400,
  };
}

export default function Home({ posts }: any) {
  return (
    <>
      <Head>
        <title>
          Chalet Blog - Minha progressão de carreira como desenvolvedor
        </title>
        <meta
          name="description"
          content="Blog para compartilhar meus estudos e progressão dentro do desenvolvimento de software."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicn.ico" />
      </Head>
      <Layout>
        <main className="container max-w-6xl m-auto py-14 flex flex-col sm:flex-row items-center justify-center flex-wrap min-h-screen">
          {posts
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
