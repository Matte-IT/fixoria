import { Table } from "lucide-react";

export default function GraphView({ setView }) {
  return (
    <div>
      Graph View
      <div title="Table View">
        <Table onClick={() => setView("table")} className="cursor-pointer" />
      </div>
    </div>
  );
}
