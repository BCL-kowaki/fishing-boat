import BlogForm from "@/components/admin/BlogForm";

export default function NewBlogPost() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-black tracking-[0.05em] mb-8">
        新規記事作成
      </h1>
      <BlogForm />
    </div>
  );
}
