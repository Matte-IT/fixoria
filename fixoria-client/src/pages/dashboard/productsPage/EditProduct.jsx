import { useParams } from "react-router-dom";
import ProductForm from "./ProductForm";

export default function EditProduct() {
  const { id } = useParams();
  return (
    <div>
      <ProductForm type="update" productId={id} />
    </div>
  );
}
