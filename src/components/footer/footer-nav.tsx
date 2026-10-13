import LinkRotate from "../link-rotate";

interface Props {
  title: string;
  links: {
    title: string;
    href: string;
  }[];
}

const FooterNav = ({ title, links }: Props) => {
  return (
    <div className="flex flex-col gap-3 sm:gap-4 items-start">
      <h3 className="text-xs tracking-wider uppercase font-medium opacity-50">{title}</h3>
      <ul className="flex flex-col items-start gap-2.5 sm:gap-3 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <LinkRotate
              link={link.href}
              label={link.title}
              className="text-primary-foreground opacity-85 hover:opacity-100 transition-opacity"
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterNav;
