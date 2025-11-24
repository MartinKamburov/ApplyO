import Link from "next/link";
import Image from "next/image";
import logo from "@/app/applyoicon.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Navigation Links Data
  const mainLinks = [
    { name: "Support", href: "mailto:martin.kamburov23@gmail.com", target: "_blank" },
  ];

  const legalLinks = [
    { name: "Terms of Service", href: "/tos" },
    { name: "Privacy Policy", href: "/privacy-policy" },
  ];

  return (
    <footer className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        
        {/* Main Content Container (Centered Column) */}
        <div className="flex flex-col items-center justify-center w-full space-y-8">
          
          {/* 1. Logo & Brand Name */}
          {/* <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <Image
              src={logo}
              alt="Applyo logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Applyo
            </span>
          </Link> */}

          {/* 2. Navigation Links (Horizontal Row) */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            {mainLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target={link.target}
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors"
              >
                {link.name}
              </a>
            ))}
            <span className="hidden sm:inline-block text-gray-300">|</span>
            {legalLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-semibold leading-6 text-gray-500 hover:text-blue-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* 3. Description (Max Width for readability) */}
          <p className="text-center text-sm leading-6 text-gray-500 max-w-md mx-auto">
            Applyo is a lightweight browser extension and web dashboard that helps you stay organized throughout your job hunt. Capture job listings instantly with an all-in-one clean, modern interface.
          </p>

          {/* 4. Copyright */}
          <p className="text-center text-xs leading-5 text-gray-400">
            &copy; {currentYear} Applyo. All rights reserved.
          </p>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;