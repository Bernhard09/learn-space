
import Image from 'next/image';
import {
  Card as ShadCard,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen } from 'lucide-react';

interface CardProps {
  title: string;
  description?: string | null;
  thumbnailUrl?: string | null;
}

export function Card({ title, description, thumbnailUrl }: CardProps) {
  return (
    <ShadCard className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="relative w-full h-40 bg-muted">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={`Thumbnail for ${title}`}
            fill
            style={{ objectFit: 'cover' }}
            onError={(e) => {
              // Fallback in case of image error
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <BookOpen className="w-12 h-12 text-gray-400" />
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle className="truncate">{title}</CardTitle>
        {description && (
          <CardDescription className="line-clamp-2 h-[40px]">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardFooter className="mt-auto">
        <p className="text-sm text-primary">Open Course &rarr;</p>
      </CardFooter>
    </ShadCard>
  );
}