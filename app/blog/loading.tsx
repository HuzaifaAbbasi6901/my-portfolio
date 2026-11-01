export default function Loading() {
  return (
    <div className="container pb-28 pt-36 sm:pt-44">
      <div className="skeleton h-6 w-28" />
      <div className="skeleton mt-6 h-12 w-96 max-w-full" />
      <div className="skeleton mt-4 h-5 w-[28rem] max-w-full" />
      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="skeleton h-64 rounded-3xl"
          />
        ))}
      </div>
    </div>
  );
}
