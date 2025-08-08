import BlogData from "@/components/marketing/Blog/blogData";
import BlogItem from "@/components/marketing/Blog/BlogItem";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Page - Solid SaaS Boilerplate",

  // other metadata
  description: "This is Blog page for Solid Pro"
};

const BlogPage = async () => {
  return (
    <>
      {/* <!-- ===== Blog Grid Start ===== --> */}
      <section className="py-20 lg:py-25 xl:py-30">
        <div className="mx-auto mt-15 max-w-c-1280 px-4 md:px-8 xl:mt-20 xl:px-0">
          <div className="grid grid-cols-1 gap-7.5 md:grid-cols-2 lg:grid-cols-3 xl:gap-10">
            {BlogData.map((post, key) => (
              <div key={key}>
                <BlogItem blog={post} />
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* <!-- ===== Blog Grid End ===== --> */}
    </>
  );
};

export default BlogPage;
