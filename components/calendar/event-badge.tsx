import { cn } from "@/lib/utils"

interface EventBadgeProps {
  color: string
}

export default function EventBadge({ color }: EventBadgeProps) {
  return (
    <div
      className={cn(
        "w-3 h-3 rounded-full flex-shrink-0 shadow-inner",
        color === "red" && "bg-red-500",
        color === "blue" && "bg-blue-500",
        color === "green" && "bg-green-500",
        color === "yellow" && "bg-yellow-500",
        color === "purple" && "bg-purple-500",
        color === "orange" && "bg-orange-500",
        color === "gray" && "bg-gray-500",
      )}
    />
  )
}

