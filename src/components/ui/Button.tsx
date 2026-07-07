import Link from "next/link";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline";
};

export default function Button({ href, children, variant = "primary" }: ButtonProps) {
  return (
    <Link href={href} className={`button ${variant === "primary" ? "button-primary" : "button-outline"}`}>
      {children}
    </Link>
  );
}
