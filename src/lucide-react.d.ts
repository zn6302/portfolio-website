declare module "lucide-react" {
  import type { FC, SVGProps } from "react";

  export type LucideProps = SVGProps<SVGSVGElement> & {
    size?: number | string;
    strokeWidth?: number | string;
  };

  export const ArrowUpRight: FC<LucideProps>;
  export const ChevronUp: FC<LucideProps>;
  export const Hand: FC<LucideProps>;
  export const Menu: FC<LucideProps>;
  export const Star: FC<LucideProps>;
  export const X: FC<LucideProps>;
}
