export { cn } from "cn"

export const formatTimeToDMY = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB"); 
}