export default function RecipeCard({ content }: { content: string }) {
  return (
    <div className="mt-6 p-4 border rounded-lg whitespace-pre-wrap bg-white">
      {content}
    </div>
  );
}
