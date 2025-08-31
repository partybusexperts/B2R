declare module '../../data/toolsRegistry.json' {
  const value: ToolData[];
  export default value;
}

interface ToolData {
  id: string;
  title: string;
  desc: string;
  category: string;
  href?: string;
  keywords?: string[];
}
