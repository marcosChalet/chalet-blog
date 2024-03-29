import { GraphQLClient, gql } from "graphql-request";
import { LRUCache } from "lru-cache";
import Image from "next/image";

import Layout from "@/components/Layout";
import Head from "next/head";

const options = {
  max: 5, // número máximo de itens no cache
  maxAge: 1000 * 60 * 60 * 24 * 15,
};

const cache = new LRUCache(options);

const graphcms = new GraphQLClient(process.env.GRAPHQL_CLIENT || "", {
  headers: {
    Authorization: `Bearer ${process.env.GRAPHQL_KEY}`,
  },
});

const QUERY = gql`
  query Post($slug: String!) {
    post(where: { slug: $slug }) {
      id
      title
      slug
      datePublished
      author {
        id
        name
        avatar {
          url
        }
      }
      content {
        html
      }
      coverPhoto {
        id
        url
      }
    }
  }
`;

const SLUGLIST = gql`
  {
    posts {
      slug
    }
  }
`;

export async function getStaticPaths() {
  const { posts }: any = await graphcms.request(SLUGLIST);
  return {
    paths: posts.map((post: any) => ({ params: { slug: post.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }: any) {
  try {
    const slug = params.slug;

    if (cache.has(slug)) {
      console.log("resposta do cache...");
      return cache.get(slug);
    }
    const data: any = await graphcms.request(QUERY, { slug });
    const post: any = data.post;

    cache.set(slug, post);

    return {
      props: {
        post,
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

export default function BlogPost({ post }: any) {
  return (
    <>
      <Head>
        <title>{post.title} • Chalet Blog</title>
        <meta
          name="description"
          content={`${post.title} by ${post.author.name}`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicn.ico" />
      </Head>
      <Layout>
        <main className="text-slate-300 sm:text-lg px-3 md:px-5 md:max-w-5xl container m-auto py-3 pb-14">
          <Image
            width={1200}
            height={600}
            quality={100}
            priority
            src={post.coverPhoto.url}
            alt=""
            className="w-full sm:h-[25rem] object-contain sm:object-cover"
          />
          <h2 className="text-2xl font-bold sm:text-4xl pt-5 text-slate-300">
            {post.title}
          </h2>
          <div className="flex justify-start items-center mt-3 mb-14">
            <Image
              width={300}
              height={300}
              quality={100}
              priority
              src={post.author.avatar.url}
              alt=""
              className="w-7 h-7 rounded-full border-2 border-sky-500 mr-2"
            />
            <div className="flex justify-start items-center italic text-base">
              <h6 className="mr-2">
                By <b>{post.author.name}</b>
              </h6>
              <h6>{post.datePublished}</h6>
            </div>
          </div>
          <div dangerouslySetInnerHTML={{ __html: post.content.html }}></div>
        </main>
      </Layout>
    </>
  );
}
