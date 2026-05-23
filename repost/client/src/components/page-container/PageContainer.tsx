import type { ReactNode } from "react";
import "./page-container.css";

type PageContainerProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "main";
};

export function PageContainer({
  children,
  className,
  as: Tag = "div",
}: PageContainerProps) {
  const rootClass = className
    ? `page-container ${className}`
    : "page-container";

  return <Tag className={rootClass}>{children}</Tag>;
}
