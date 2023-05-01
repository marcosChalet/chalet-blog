import Image from "next/image";
import Link from "next/link";

export default function BlogCard({
  title,
  slug,
  author,
  coverPhoto,
  datePublished,
}: any) {
  return (
    <div className="my-3 sm:mx-3 h-72 min-w-[20rem] max-w-xs flex-shrink-0 flex-col bg-slate-200 rounded-lg shadow-xl overflow-hidden text-slate-800">
      <Link href={"/posts/" + slug}>
        <div className="h-42">
          <Image
            loading="lazy"
            width={500}
            height={300}
            className="w-full h-full bg-cover"
            src={coverPhoto.url}
            alt=""
          />
        </div>
      </Link>
      <div className="px-2 py-4 font-semibold flex flex-col h-32 justify-between">
        <h2 className="pb-3">{title}</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Image
              loading="lazy"
              width={100}
              height={100}
              className="rounded-full w-8 h-8 mr-2"
              src={author.avatar.url}
              alt=""
            />
            <h3 className="text-xs">@{author.name}</h3>
          </div>
          <div>
            <h3 className="text-xs">{datePublished}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
