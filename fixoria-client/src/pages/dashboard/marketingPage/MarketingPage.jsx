import PageName from "@/components/custom/PageName";
import PageTitle from "@/components/custom/PageTitle";
import { Button } from "@/components/ui/button";
import { FileChartColumnIncreasing, Plus } from "lucide-react";

const MarketingPage = () => {
  return (
    <div>
      <PageTitle title="Marketing" />

      <div className="flex gap-3 flex-wrap items-center justify-between mb-6">
        <PageName pageName="Marketing" />

        <div className="flex flex-wrap items-center gap-3">
          <Button className="flex items-center gap-x-2 bg-white hover:bg-white text-headingTextColor border border-gray-200 font-semibold">
            <FileChartColumnIncreasing />
            <span>Export</span>
          </Button>

          <Button className="flex items-center gap-x-2 bg-defaultBlue hover:bg-defaultBlue">
            <Plus />
            Add Customers
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MarketingPage;
