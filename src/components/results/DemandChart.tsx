'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RankedItem } from '@/types';
import Image from 'next/image';

interface DemandChartProps {
  rankings: RankedItem[];
}

export function DemandChart({ rankings }: DemandChartProps) {
  const maxScore = 100;

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Demand Forecast</CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-zinc-900" />
            Score
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-emerald-500" />
            Buy Intent %
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {rankings.map((r) => (
          <div key={r.item.id} className="flex items-center gap-4">
            {/* Thumbnail */}
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-zinc-100 shrink-0 ring-1 ring-zinc-200">
              <Image
                src={r.item.url}
                alt=""
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-zinc-900/80 text-white text-[10px] font-medium text-center py-0.5">
                #{r.rank}
              </div>
            </div>

            {/* Bars */}
            <div className="flex-1 space-y-1.5">
              {/* Score bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-5 bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-zinc-900 rounded-full transition-all duration-500"
                    style={{ width: `${(r.avgScore * 10 / maxScore) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium w-8 text-right">{Math.round(r.avgScore * 10)}</span>
              </div>

              {/* Buy intent bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-5 bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${(r.buyIntent / maxScore) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium w-8 text-right text-emerald-600">{r.buyIntent}%</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
