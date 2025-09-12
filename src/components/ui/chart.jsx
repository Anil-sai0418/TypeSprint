import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ReferenceLine } from "recharts"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = {
  light: "",
  dark: ".dark"
}

const ChartContext = React.createContext(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}) {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          // Monkeytype-style: minimal grid, thin lines, dark theme optimized
          "[&_.recharts-text]:font-mono [&_.recharts-text]:text-xs [&_.recharts-text]:fill-current [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border/10 [&_.recharts-curve]:stroke-[2px] [&_.recharts-line]:stroke-current [&_.recharts-tooltip]:bg-background/98 [&_.recharts-tooltip]:border [&_.recharts-tooltip]:border-border/30 [&_.recharts-tooltip]:backdrop-blur-md [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex w-full h-full justify-center text-xs [&_.recharts-dot]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden [&_.recharts-line]:fill-none",
          className
        )}
        {...props}>
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer width="100%" height="100%">
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

const ChartStyle = ({
  id,
  config
}) => {
  const colorConfig = Object.entries(config).filter(([, config]) => config.theme || config.color)

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
.map(([key, itemConfig]) => {
const color =
  itemConfig.theme?.[theme] ||
  itemConfig.color
return color ? `  --color-${key}: ${color};` : null
})
.join("\n")}
}
`)
          .join("\n"),
      }} />
  );
}

const ChartTooltip = RechartsPrimitive.Tooltip

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey
}) {
  const { config } = useChart()

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null
    }

    const [item] = payload
    const key = `${labelKey || item?.dataKey || item?.name || "value"}`
    const itemConfig = getPayloadConfigFromPayload(config, item, key)
    const value =
      !labelKey && typeof label === "string"
        ? config[label]?.label || label
        : itemConfig?.label

    if (labelFormatter) {
      return (
        <div className={cn("font-mono text-xs text-muted-foreground mb-1", labelClassName)}>
          {labelFormatter(value, payload)}
        </div>
      );
    }

    if (!value) {
      return null
    }

    return <div className={cn("font-mono text-xs text-muted-foreground mb-1", labelClassName)}>{value}</div>;
  }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClassName,
    config,
    labelKey,
  ])

  if (!active || !payload?.length) {
    return null
  }

  const nestLabel = payload.length === 1 && indicator !== "dot"

  // Monkeytype-style tooltip: clean, minimal, monospace font
  return (
    <div
      className={cn(
        "bg-background/98 border-border/20 grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-3 py-2 text-xs shadow-xl backdrop-blur-md",
        className
      )}>
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-0.5">
        {payload.map((item, index) => {
          const key = `${nameKey || item.name || item.dataKey || "value"}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)
          const indicatorColor = color || item.payload?.fill || item.color || item.stroke

          let formattedValue = item.value
          if (formatter) {
            formattedValue = formatter(item.value, item.name, item, index, item.payload)
          } else if (typeof item.value === 'number') {
            formattedValue = `${Math.round(item.value)}`
          }

          return (
            <div
              key={item.dataKey}
              className={cn(
                "flex items-center justify-between gap-3",
                indicator === "dot" ? "items-center" : "items-start"
              )}>
              <div className="flex items-center gap-2">
                {!hideIndicator && (
                  <div
                    className="h-1.5 w-1.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: indicatorColor,
                    }}
                  />
                )}
                <span className="text-foreground/60 text-xs font-medium font-mono">
                  {itemConfig?.label || item.name || key}
                </span>
              </div>
              <span className="text-foreground font-mono font-bold text-sm">
                {formattedValue}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config,
  payload,
  key
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey = key

  if (
    key in payload &&
    typeof payload[key] === "string"
  ) {
    configLabelKey = payload[key]
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key] === "string"
  ) {
    configLabelKey = payloadPayload[key]
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key];
}

// Main Monkeytype-style typing test chart
function MonkeytypeChart({ 
  data, 
  className, 
  showRaw = true, 
  showAccuracy = false, 
  targetWpm = null,
  isLive = false 
}) {
  const config = {
    wpm: {
      label: "wpm",
      color: "#e2b714", // Monkeytype's signature yellow
      theme: {
        dark: "#e2b714",
        light: "#d4ac0d"
      }
    },
    raw: {
      label: "raw",
      color: "#646669", // Muted gray for raw WPM
      theme: {
        dark: "#646669",
        light: "#7f8387"
      }
    },
    accuracy: {
      label: "acc",
      color: "#7dd3fc", // Light blue for accuracy
      theme: {
        dark: "#7dd3fc",
        light: "#0ea5e9"
      }
    }
  };

  // Custom label formatter for time
  const timeFormatter = (value) => `${value}s`;

  // Custom tooltip formatter
  const customFormatter = (value, name) => {
    if (name === 'accuracy') {
      return `${Math.round(value)}%`;
    }
    return `${Math.round(value)}`;
  };

  return (
    <ChartContainer config={config} className={cn("w-full h-[280px] bg-transparent", className)}>
      <LineChart 
        data={data} 
        margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
        syncId="monkeytype"
      >
        <CartesianGrid 
          strokeDasharray="1 3" 
          stroke="rgba(128,128,128,0.08)" 
          vertical={false}
          horizontal={true}
        />
        
        <XAxis 
          dataKey="time" 
          stroke="#666"
          tick={{ fill: '#666', fontSize: 11, fontFamily: 'monospace' }}
          tickLine={{ stroke: '#666', strokeWidth: 0.5 }}
          axisLine={{ stroke: '#333', strokeWidth: 0.5 }}
          tickFormatter={timeFormatter}
          minTickGap={25}
          type="number"
          scale="linear"
          domain={['dataMin', 'dataMax']}
        />
        
        <YAxis 
          stroke="#666"
          tick={{ fill: '#666', fontSize: 11, fontFamily: 'monospace' }}
          tickLine={{ stroke: '#666', strokeWidth: 0.5 }}
          axisLine={{ stroke: '#333', strokeWidth: 0.5 }}
          domain={[0, dataMax => Math.max(Math.ceil(dataMax * 1.1 / 10) * 10, 50)]}
          width={35}
          tickCount={6}
        />

        {/* Target WPM reference line */}
        {targetWpm && (
          <ReferenceLine 
            y={targetWpm} 
            stroke="#555" 
            strokeDasharray="2 2" 
            strokeWidth={1}
          />
        )}
        
        <ChartTooltip 
          content={
            <ChartTooltipContent 
              indicator="line"
              formatter={customFormatter}
              labelFormatter={(value) => `${value}s`}
            />
          }
          cursor={{ 
            stroke: '#444', 
            strokeWidth: 1, 
            strokeDasharray: '2 2' 
          }}
        />

        {/* Raw WPM line (dashed, behind net WPM) */}
        {showRaw && (
          <Line 
            type="monotone"
            dataKey="raw"
            name="raw"
            stroke="#646669"
            strokeWidth={1.5}
            dot={false}
            activeDot={false}
            strokeDasharray="3 3"
            isAnimationActive={false}
            connectNulls={false}
          />
        )}

        {/* Accuracy line (if enabled) */}
        {showAccuracy && (
          <Line 
            type="monotone"
            dataKey="accuracy"
            name="acc"
            stroke="#7dd3fc"
            strokeWidth={1.5}
            dot={false}
            activeDot={false}
            isAnimationActive={false}
            connectNulls={false}
          />
        )}
        
        {/* Net WPM line (main line, bright yellow) */}
        <Line 
          type="monotone"
          dataKey="wpm"
          name="wpm"
          stroke="#e2b714"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ 
            r: 3, 
            fill: '#e2b714', 
            strokeWidth: 0 
          }}
          isAnimationActive={isLive}
          animationDuration={100}
          connectNulls={false}
        />
      </LineChart>
    </ChartContainer>
  );
}

// Progress tracking component for historical data
function MonkeytypeProgressGraph({ data, className }) {
  // Sample data structure: { date: '2025-01-01', pb: 80, avg10: 75, avg100: 70 }
  const sampleData = data || [
    { date: '2025-01-01', pb: 60, avg10: 55, avg100: 50 },
    { date: '2025-01-15', pb: 65, avg10: 60, avg100: 55 },
    { date: '2025-02-01', pb: 70, avg10: 65, avg100: 60 },
    { date: '2025-02-15', pb: 75, avg10: 70, avg100: 65 },
    { date: '2025-03-01', pb: 80, avg10: 75, avg100: 70 },
  ];

  const config = {
    pb: {
      label: "PB",
      color: "#e2b714",
      theme: {
        dark: "#e2b714",
        light: "#d4ac0d"
      }
    },
    avg10: {
      label: "avg 10",
      color: "#7dd3fc",
      theme: {
        dark: "#7dd3fc",
        light: "#0ea5e9"
      }
    },
    avg100: {
      label: "avg 100",
      color: "#646669",
      theme: {
        dark: "#646669",
        light: "#7f8387"
      }
    }
  };

  const dateFormatter = (value) => new Date(value).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <ChartContainer config={config} className={cn("w-full h-[320px] bg-transparent", className)}>
      <LineChart data={sampleData} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
        <CartesianGrid 
          vertical={false} 
          strokeDasharray="1 3" 
          stroke="rgba(128,128,128,0.08)" 
        />
        
        <XAxis 
          dataKey="date" 
          tickFormatter={dateFormatter}
          tick={{ fill: '#666', fontSize: 10, fontFamily: 'monospace' }}
          tickLine={{ stroke: '#666', strokeWidth: 0.5 }}
          axisLine={{ stroke: '#333', strokeWidth: 0.5 }}
          tickMargin={8}
          minTickGap={40}
        />
        
        <YAxis 
          tick={{ fill: '#666', fontSize: 11, fontFamily: 'monospace' }}
          tickLine={{ stroke: '#666', strokeWidth: 0.5 }}
          axisLine={{ stroke: '#333', strokeWidth: 0.5 }}
          tickMargin={8}
          domain={[0, 'dataMax + 10']}
          width={35}
        />
        
        <ChartTooltip 
          content={
            <ChartTooltipContent 
              indicator="line" 
              labelFormatter={dateFormatter}
              formatter={(value) => `${Math.round(value)}`}
            />
          }
          cursor={{ 
            stroke: '#444', 
            strokeWidth: 1, 
            strokeDasharray: '2 2' 
          }}
        />

        {/* Personal Best - stepped line like Monkeytype */}
        <Line 
          type="stepAfter"
          dataKey="pb" 
          name="PB"
          stroke="#e2b714"
          strokeWidth={2.5}
          dot={{ fill: '#e2b714', strokeWidth: 0, r: 2 }}
          activeDot={{ r: 4, fill: '#e2b714', strokeWidth: 0 }}
          isAnimationActive={false}
          connectNulls={false}
        />
        
        {/* Average 10 tests */}
        <Line 
          type="monotone" 
          dataKey="avg10" 
          name="avg 10"
          stroke="#7dd3fc"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 3, fill: '#7dd3fc', strokeWidth: 0 }}
          isAnimationActive={false}
          connectNulls={false}
        />
        
        {/* Average 100 tests */}
        <Line 
          type="monotone" 
          dataKey="avg100" 
          name="avg 100"
          stroke="#646669"
          strokeWidth={1.5}
          dot={false}
          activeDot={{ r: 3, fill: '#646669', strokeWidth: 0 }}
          isAnimationActive={false}
          connectNulls={false}
        />
      </LineChart>
    </ChartContainer>
  );
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartStyle,
  MonkeytypeChart,
  MonkeytypeProgressGraph
}