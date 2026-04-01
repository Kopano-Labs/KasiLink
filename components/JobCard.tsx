// components/JobCard.tsx
interface JobCardProps {
  title: string;
  description: string;
  category: string;
  location: string;
  postedAt: Date;
  pay: string;
}

export default function JobCard({
  title,
  description,
  category,
  location,
  postedAt,
  pay,
}: JobCardProps) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-gray-600">{description}</p>
      <div className="mt-2 text-sm text-gray-500">
        <span>{category}</span> • <span>{location}</span>
      </div>
      <div className="mt-2 text-sm text-gray-400">
        Posted: {new Date(postedAt).toLocaleDateString()}
      </div>
      <div className="mt-2 font-bold text-green-600">{pay}</div>
    </div>
  );
}
