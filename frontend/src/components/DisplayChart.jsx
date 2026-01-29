"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "An area chart with a legend"

// Sample WPM data structure (replace this with actual test results)
const chartData = [
  { time: 0, rawWPM: 0, netWPM: 0 },
  { time: 5, rawWPM: 45, netWPM: 42 },
  { time: 10, rawWPM: 52, netWPM: 48 },
  { time: 15, rawWPM: 58, netWPM: 54 },
  { time: 20, rawWPM: 55, netWPM: 51 },
  { time: 25, rawWPM: 60, netWPM: 56 },
  { time: 30, rawWPM: 62, netWPM: 58 },
]

const chartConfig = {
  rawWPM: {
    label: "Raw WPM",
    color: "var(--chart-1)",
  },
  netWPM: {
    label: "WPM",
    color: "var(--chart-2)",
  },
}

export function ChartAreaLegend() {
  return (
    <Card className={'max-sm:w-full w-[calc(100vw-30rem)]'}>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            height={80}
            margin={{
              left: 25,
              right: 12,
              top: 5,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}s`}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              domain={[0, 'auto']}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="netWPM"
              type="monotone"
              fill="var(--color-desktop)"
              fillOpacity={0.2}
              stroke="var(--color-desktop)"
              strokeWidth={2}
            />
            <Area
              dataKey="rawWPM"
              type="monotone"
              fill="var(--color-mobile)"
              fillOpacity={0.2}
              stroke="var(--color-mobile)"
              strokeWidth={2}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
