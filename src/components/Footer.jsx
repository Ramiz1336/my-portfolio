import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";

const socialLinks = [
  { href: "https://github.com", icon: <FaGithub /> },
  { href: "https://linkedin.com", icon: <FaLinkedin /> },
  { href: "https://twitter.com", icon: <FaTwitter /> },
  { href: "mailto:starkramizsk@gmail.com", icon: <FaEnvelope /> },
];

const Footer = () => {
  return (
    <footer className="w-screen bg-[#5542ff] py-4 text-black">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <p className="text-center text-sm font-light md:text-left">
          © Sk Ramiz Raja 2024. All rights reserved
        </p>

        <div className="flex justify-center gap-4 md:justify-start">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black transition-colors duration-500 ease-in-out hover:text-white"
            >
              {link.icon}
            </a>
          ))}
        </div>

        <a
          href="mailto:starkramizsk@gmail.com"
          className="text-center text-sm font-light hover:underline md:text-right"
        >
          starkramizsk@gmail.com
        </a>
      </div>
    </footer>
  );
};

export default Footer;
