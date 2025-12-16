export type NavItem = {
  label: string;
  href: string;
  showInHeader?: boolean;
  showInFooter?: boolean;
};

export const mainNav: NavItem[] = [
  { label: "Home", href: "/", showInHeader: true, showInFooter: true },
  { label: "Locations", href: "/locations", showInHeader: true, showInFooter: true },
  { label: "Fleet", href: "/fleet", showInHeader: true, showInFooter: true },
  { label: "Events & Services", href: "/events", showInHeader: true, showInFooter: false },
  { label: "Polls & Tools", href: "/polls", showInHeader: true, showInFooter: true },
  { label: "Reviews", href: "/reviews", showInHeader: true, showInFooter: true },
  { label: "FAQ", href: "/faq", showInHeader: false, showInFooter: true },
  { label: "Contact", href: "/contact", showInHeader: false, showInFooter: true },
  { label: "Get Instant Quote", href: "/quote", showInHeader: true, showInFooter: false },
];
