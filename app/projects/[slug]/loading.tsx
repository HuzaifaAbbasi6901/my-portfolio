export default function Loading() {
  return (
    <div className="container pb-28 pt-36 sm:pt-44">
      <div className="skeleton h-6 w-24" />
      <div className="skeleton mt-6 h-14 w-[30rem] max-w-full" />
      <div className="skeleton mt-4 h-5 w-[34rem] max-w-full" />
      <div className="skeleton mt-12 aspect-[16/8] w-full rounded-[2rem]" />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="skeleton h-40 rounded-3xl" />
        ))}
      </div>
    </div>
  );
}
