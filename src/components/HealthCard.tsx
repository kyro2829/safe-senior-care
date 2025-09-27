import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, Activity, Moon, Shield, Target } from "lucide-react";

interface HealthCardProps {
  title: string;
  value: string | number;
  unit?: string;
  status: 'normal' | 'warning' | 'critical';
  icon: 'heart' | 'steps' | 'sleep' | 'fall';
  goal?: number;
  current?: number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'stable';
}

const iconMap = {
  heart: Heart,
  steps: Activity,
  sleep: Moon,
  fall: Shield
};

const statusLabels = {
  normal: 'Good',
  warning: 'Attention',
  critical: 'Alert'
};

const getStatusStyles = (status: 'normal' | 'warning' | 'critical') => {
  switch (status) {
    case 'normal':
      return {
        bgClass: 'bg-success/10',
        textClass: 'text-success'
      };
    case 'warning':
      return {
        bgClass: 'bg-warning/10',
        textClass: 'text-warning'
      };
    case 'critical':
      return {
        bgClass: 'bg-destructive/10',
        textClass: 'text-destructive'
      };
    default:
      return {
        bgClass: 'bg-muted/10',
        textClass: 'text-muted-foreground'
      };
  }
};

export function HealthCard({
  title,
  value,
  unit,
  status,
  icon,
  goal,
  current,
  subtitle,
  trend
}: HealthCardProps) {
  const IconComponent = iconMap[icon];
  const statusStyles = getStatusStyles(status);
  const progressPercentage = goal && current ? (current / goal) * 100 : 0;

  return (
    <Card className="w-full bg-card/50 backdrop-blur-sm border border-border/50 shadow-card hover:shadow-health transition-all duration-300 hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${statusStyles.bgClass}`}>
              <IconComponent className={`h-5 w-5 ${statusStyles.textClass}`} />
            </div>
            <CardTitle className="text-elderly font-semibold text-foreground">
              {title}
            </CardTitle>
          </div>
          <Badge 
            variant={status === 'normal' ? 'default' : status === 'warning' ? 'secondary' : 'destructive'}
            className="text-sm font-medium"
          >
            {statusLabels[status]}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Main Value Display */}
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground tracking-tight">
              {value}
            </span>
            {unit && (
              <span className="text-elderly text-muted-foreground font-medium">
                {unit}
              </span>
            )}
          </div>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-elderly text-muted-foreground">
              {subtitle}
            </p>
          )}

          {/* Goal Progress */}
          {goal && current !== undefined && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  Goal: {goal} {unit}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <Progress 
                value={progressPercentage} 
                className="h-2"
                style={{
                  '--progress-background': progressPercentage >= 100 
                    ? 'hsl(var(--success))' 
                    : progressPercentage >= 70 
                    ? 'hsl(var(--warning))' 
                    : 'hsl(var(--primary))'
                } as React.CSSProperties}
              />
            </div>
          )}

          {/* Trend Indicator */}
          {trend && (
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1 text-sm ${
                trend === 'up' ? 'text-success' : 
                trend === 'down' ? 'text-destructive' : 
                'text-muted-foreground'
              }`}>
                <span className="font-medium">
                  {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} 
                  {trend === 'up' ? 'Improving' : 
                   trend === 'down' ? 'Declining' : 
                   'Stable'}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}