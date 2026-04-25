import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getInitials } from "@/lib/utils";

const sizes = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-12 text-base",
};

export function UserAvatar({
  firstName,
  lastName,
  imageUrl,
  size = "md",
  className,
}: {
  firstName: string;
  lastName: string;
  imageUrl?: string;
  size?: keyof typeof sizes;
  className?: string;
}) {
  return (
    <Avatar className={cn(sizes[size], className)}>
      {imageUrl ? <AvatarImage src={imageUrl} alt={`${firstName} ${lastName}`} /> : null}
      <AvatarFallback>{getInitials(firstName, lastName)}</AvatarFallback>
    </Avatar>
  );
}
