import { ToolData } from "@/types/tools.types";
import { PricingCalculator } from "../tools/pricing-calculator";
import { PlanningChecklist } from "../tools/planning-checklist";
import { DynamicIcon, IconName } from "lucide-react/dynamic";

// A fallback component for tools that don't have a custom implementation yet
function DefaultToolView({ tool }: { tool: ToolData }) {
  return (
    <div
      className="max-w-2xl mx-auto text-center space-y-6 p-12 bg-muted/30
        rounded-3xl border border-dashed"
    >
      <div
        className="mx-auto w-16 h-16 bg-primary/10 text-primary rounded-full
          flex items-center justify-center"
      >
        <DynamicIcon
          name={(tool.icon_name || "wrench") as IconName}
          className="w-8 h-8"
        />
      </div>
      <h3 className="text-xl font-bold">Coming Soon</h3>
      <p className="text-muted-foreground">
        The interactive {tool.title} is currently being built.
        <br />
        {tool.modal_content}
      </p>
    </div>
  );
}

// THE REGISTRY MAP
// components may accept different props; use a loose component type here
const TOOL_COMPONENTS: Record<
  string,
  React.ComponentType<Record<string, unknown>>
> = {
  "party-bus-pricing-calculator": PricingCalculator,
  "event-planning-checklist": PlanningChecklist,
  // Add others as you build them:
  // "event-budgeting": BudgetTool,
};

export function renderToolComponent(slug: string, toolData: ToolData) {
  // Cast to a permissive component so we can safely pass the `tool` prop
  const Component = (TOOL_COMPONENTS[slug] ||
    DefaultToolView) as React.ComponentType<Record<string, unknown>>;

  return <Component tool={toolData} />;
}
