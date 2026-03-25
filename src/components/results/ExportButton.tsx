'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SimulationResult } from '@/types';

interface ExportButtonProps {
  result: SimulationResult;
}

export function ExportButton({ result }: ExportButtonProps) {
  const downloadJSON = () => {
    const data = JSON.stringify(result, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stylesim-results-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateReportText = () => {
    const lines: string[] = [
      '# StyleSim Demand Simulation Report',
      `Generated: ${new Date().toLocaleString()}`,
      '',
      '## Summary',
      `- Items Analyzed: ${result.items.length}`,
      `- Personas Used: ${result.personas.length}`,
      `- Total Opinions: ${result.opinions.length}`,
      '',
      '## Rankings',
      '',
    ];

    result.rankings.forEach((r) => {
      lines.push(
        `${r.rank}. ${r.item.analysis?.category || 'Unknown'} - Score: ${r.avgScore}/10, Buy Intent: ${r.buyIntent}%`
      );
    });

    lines.push('', '## Recommendations', '');
    result.recommendations.forEach((rec) => {
      lines.push(`### ${rec.title}`);
      lines.push(rec.description);
      lines.push('');
    });

    lines.push('## Detailed Opinions', '');
    result.items.forEach((item) => {
      lines.push(`### ${item.analysis?.category || item.filename}`);
      const itemOpinions = result.opinions.filter((o) => o.itemId === item.id);
      itemOpinions.forEach((op) => {
        const persona = result.personas.find((p) => p.id === op.personaId);
        lines.push(`- ${persona?.name}: ${op.score}/10 - "${op.opinion}"`);
      });
      lines.push('');
    });

    return lines.join('\n');
  };

  const downloadReport = () => {
    const text = generateReportText();
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stylesim-report-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        Export Results
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Simulation Results</DialogTitle>
          <DialogDescription>
            Choose your preferred format to download the results.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Button onClick={downloadJSON} variant="outline" className="h-auto py-4">
            <div className="text-center">
              <p className="text-2xl mb-1">📊</p>
              <p className="font-semibold">JSON Data</p>
              <p className="text-xs text-muted-foreground">
                Full structured data
              </p>
            </div>
          </Button>
          <Button onClick={downloadReport} variant="outline" className="h-auto py-4">
            <div className="text-center">
              <p className="text-2xl mb-1">📝</p>
              <p className="font-semibold">Report</p>
              <p className="text-xs text-muted-foreground">
                Markdown summary
              </p>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
