'use client';

import { ClothingItem } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface ImageGridProps {
  items: ClothingItem[];
  onRemove: (id: string) => void;
  isAnalyzing?: boolean;
}

export function ImageGrid({ items, onRemove, isAnalyzing }: ImageGridProps) {
  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {items.map((item) => (
        <Card key={item.id} className="relative group overflow-hidden">
          <div className="aspect-square relative">
            <Image
              src={item.url}
              alt={item.filename}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            />

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onRemove(item.id)}
                disabled={isAnalyzing}
              >
                Remove
              </Button>
            </div>

            {/* Analysis status badge */}
            <div className="absolute top-2 right-2">
              {item.analysis ? (
                <Badge variant="secondary" className="text-xs">
                  Analyzed
                </Badge>
              ) : isAnalyzing ? (
                <Badge variant="outline" className="text-xs bg-background/80">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse mr-1" />
                  Analyzing
                </Badge>
              ) : null}
            </div>
          </div>

          {/* Item info */}
          <div className="p-2">
            <p className="text-xs truncate text-muted-foreground">{item.filename}</p>
            {item.analysis && (
              <p className="text-xs font-medium truncate mt-1">
                {item.analysis.category}
              </p>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
