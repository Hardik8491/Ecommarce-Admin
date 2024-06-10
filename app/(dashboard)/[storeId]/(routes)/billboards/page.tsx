import { format } from "date-fns";
import BillboardClient from "./client";
import prismadb from "@/lib/prismadb";
import { BillboardColumn } from "./components/columns";

const BillboardPage = async ({ params }: { params: { storeId: string } }) => {
  const billboard = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedBillboards: BillboardColumn[] = billboard.map((item) => ({
    id: item.id,
    label: item.label,
    createAt: format(item.createdAt, "MMMM do, yyyy "),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-x-4 p-8 pt-6">
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  );
};

export default BillboardPage;
