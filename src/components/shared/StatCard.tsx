import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
  description?: string;
  trend?: string; // e.g., "+5.2% from last month"
  trendColor?: 'green' | 'red';
};

export function StatCard({ title, value, icon: Icon, description, trend, trendColor }: StatCardProps) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-headline">{value}</div>
        {description && <p className="text-xs text-muted-foreground pt-1">{description}</p>}
        {trend && (
           <p className={`text-xs pt-1 ${trendColor === 'green' ? 'text-green-600' : trendColor === 'red' ? 'text-red-600' : 'text-muted-foreground'}`}>
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
