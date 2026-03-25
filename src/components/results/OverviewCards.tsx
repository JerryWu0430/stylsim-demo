'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SimulationResult } from '@/types';
import { calculateOverviewStats } from '@/lib/analysis';
import Image from 'next/image';

interface OverviewCardsProps {
  result: SimulationResult;
}

export function OverviewCards({ result }: OverviewCardsProps) {
  const stats = calculateOverviewStats(result);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Top Item */}
      <Card className="col-span-2 md:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Top Performer
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.topItem && (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 relative rounded overflow-hidden flex-shrink-0">
                <Image
                  src={stats.topItem.item.url}
                  alt="Top item"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-lg">{stats.topItem.avgScore}/10</p>
                <p className="text-xs text-muted-foreground truncate">
                  {stats.topItem.item.analysis?.category || 'Item'}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Avg Score */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Avg Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.avgScore}</p>
          <p className="text-xs text-muted-foreground">out of 10</p>
        </CardContent>
      </Card>

      {/* Buy Intent */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Buy Intent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.avgBuyIntent}%</p>
          <p className="text-xs text-muted-foreground">would purchase</p>
        </CardContent>
      </Card>

      {/* Coverage */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Coverage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.totalOpinions}</p>
          <p className="text-xs text-muted-foreground">
            {stats.totalItems} items × {stats.totalPersonas} personas
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
