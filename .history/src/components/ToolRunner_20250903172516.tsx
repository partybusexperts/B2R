import React, { useMemo, useState } from "react";
import calculators, { ToolSchema, ToolCalculator } from "@/lib/tools/calculators";

type Props = { toolId: string };

function renderField(name: string, field: any, value: any, onChange: (v: any) => void) {
  const common = { value: value ?? "", onChange: (e: any) => onChange(e.target.value) };
  switch (field.type) {
    case "number":
      return (
        <input
          type="number"
          step={field.step ?? "any"}
          {...common}
          className="border rounded px-2 py-1 w-full"
        />
      );
    case "select":
      return (
        <select {...common} className="border rounded px-2 py-1 w-full">
          {(field.options || []).map((o: string) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      );
    case "text":
    default:
      return <input type="text" {...common} className="border rounded px-2 py-1 w-full" />;
  }
}

export default function ToolRunner({ toolId }: Props) {
  const tool = calculators[toolId];
  if (!tool) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded">
        <h2 className="text-xl font-bold">Tool "{toolId}" not implemented</h2>
        <p className="mt-2 text-sm text-slate-600">This tool is planned. The runner will show it when a schema exists.</p>
      </div>
    );
  }

  const { schema, calc } = tool as { schema: ToolSchema; calc: ToolCalculator };

  const initialInputs = useMemo(() => {
    const i: Record<string, any> = {};
    for (const f of schema.fields) i[f.name] = f.default ?? "";
    return i;
  }, [schema]);

  const [inputs, setInputs] = useState<Record<string, any>>(initialInputs);
  const [result, setResult] = useState<any>(null);

  function onChangeField(name: string, v: any) {
    setInputs((s) => ({ ...s, [name]: v }));
  }

  function run() {
    try {
      const out = calc(inputs);
      setResult(out);
    } catch (err) {
      setResult({ error: String(err) });
    }
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">{schema.title}</h1>
        {schema.desc && <p className="text-sm text-slate-600">{schema.desc}</p>}
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          run();
        }}
        className="grid gap-4"
      >
        {schema.fields.map((f) => (
          <label key={f.name} className="space-y-1">
            <div className="text-sm font-medium">{f.label}</div>
            {renderField(f.name, f, inputs[f.name], (v: any) => onChangeField(f.name, v))}
            {f.help && <div className="text-xs text-slate-500">{f.help}</div>}
          </label>
        ))}

        <div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Run
          </button>
        </div>
      </form>

      <div>
        <h2 className="text-lg font-semibold">Result</h2>
        <pre className="bg-slate-100 p-4 rounded text-sm">{JSON.stringify(result, null, 2)}</pre>
      </div>
    </section>
  );
}
