'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { RankedItem } from '@/types';
import Image from 'next/image';

interface RankingTableProps {
  rankings: RankedItem[];
}

type SortKey = 'rank' | 'avgScore' | 'buyIntent';

export function RankingTable({ rankings }: RankingTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('rank');
  const [sortAsc, setSortAsc] = useState(true);

  const sorted = [...rankings].sort((a, b) => {
    const diff = a[sortKey] - b[sortKey];
    return sortAsc ? diff : -diff;
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(key === 'rank');
    }
  };

  const getRiskBadge = (score: number, buyIntent: number) => {
    if (score >= 7 && buyIntent >= 60) {
      return <Badge className="bg-green-500/10 text-green-600">Low Risk</Badge>;
    } else if (score >= 5 && buyIntent >= 40) {
      return <Badge className="bg-yellow-500/10 text-yellow-600">Medium Risk</Badge>;
    }
    return <Badge className="bg-red-500/10 text-red-600">High Risk</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Item Rankings</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="w-16 cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('rank')}
              >
                Rank {sortKey === 'rank' && (sortAsc ? '↑' : '↓')}
              </TableHead>
              <TableHead>Item</TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('avgScore')}
              >
                Score {sortKey === 'avgScore' && (sortAsc ? '↑' : '↓')}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('buyIntent')}
              >
                Buy Intent {sortKey === 'buyIntent' && (sortAsc ? '↑' : '↓')}
              </TableHead>
              <TableHead>Risk</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((r) => (
              <TableRow key={r.item.id}>
                <TableCell className="font-bold">#{r.rank}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 relative rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={r.item.url}
                        alt={r.item.analysis?.category || 'Item'}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">
                        {r.item.analysis?.category || 'Unknown'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {r.item.analysis?.style?.slice(0, 2).join(', ')}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-bold">{r.avgScore}</span>
                  <span className="text-muted-foreground">/10</span>
                </TableCell>
                <TableCell>
                  <span className="font-bold">{r.buyIntent}%</span>
                </TableCell>
                <TableCell>{getRiskBadge(r.avgScore, r.buyIntent)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
