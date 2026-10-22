import { useOrders } from "../hooks/useOrders"

const OrdersTable = () => {
    const {data, isPending, isError, error} = useOrders();

    if(isPending){
        return <div>Loading</div>
    }
    if(isError){
        return <div>{error.message}</div>
    }
    if(data.length > 0){
        return <div>No orders available.</div>
    }

    return (
        <>
            {data.map((o) => {
                <div>Order: {o.id}</div>
            })}
        </>
    )
}

export default OrdersTable