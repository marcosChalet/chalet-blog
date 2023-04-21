import Layout from "@/components/Layout";
import { GraphQLClient, gql } from "graphql-request";
import Image from "next/image";

const graphcms = new GraphQLClient(process.env.GRAPHQL_CLIENT || "");

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
    const data: any = await graphcms.request(QUERY, { slug });
    const post: any = data.post;

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
    <Layout>
      <main className="text-slate-300 text-lg max-w-5xl m-auto py-3 pb-14">
        <Image
          width={1200}
          height={600}
          quality={100}
          priority
          src={post.coverPhoto.url}
          alt=""
          className="w-full h-[25rem] object-cover"
        />
        <h2 className="text-4xl pt-5 text-slate-300">{post.title}</h2>
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
  );
}
