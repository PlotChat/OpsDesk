import { useProducts } from "../hooks/useProducts"

export const ProductsTable = () => {
    const { data, isPending, isError, error } = useProducts();

    if(isPending){
        return <div>Loading...</div>
    }
    if(isError){
        return <div>Error: {error.message}</div>
    }
  return (
    <>
        {data.map((d) => 
            <div key={d.id}>{d.name}</div>
        )}
    </>
  )
}
export default ProductsTable