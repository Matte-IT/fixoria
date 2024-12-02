import PageName from "@/components/custom/PageName";
import PageTitle from "@/components/custom/PageTitle";
import AddItem from "@/components/custom/shared/AddItem";

const SalePage = () => {
  return (
    <div>
      <PageTitle title="Sale Invoice" />

      <div className="flex gap-3 flex-wrap items-center justify-between mb-6">
        <PageName pageName="Sale Invoice" />

        <div className="flex flex-wrap items-center gap-3">
          <AddItem itemName={"Add Sale"} link={"/add-sale"} />
        </div>
      </div>
    </div>
  );
};

export default SalePage;
