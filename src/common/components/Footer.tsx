import NavToggle from "./NavToggle";

const Footer = () => {
  return (
    <footer className="flex flex-col items-center justify-between gap-4 py-4">
      <h3 className="font-bold text-md">Hacker News</h3>
      <NavToggle />
    </footer>
  );
};

export default Footer;
