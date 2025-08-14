import clsx from "clsx";
import gsap from "gsap";
import { useWindowScroll } from "react-use";
import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";

import Button from "./Button";

// IMPORTANT:
// 1) Put your resume at: public/assets/resume.pdf
// 2) Put your audio at:  public/audio/loop.mp3
// 3) Ensure Button forwards onClick: (<button onClick={onClick} ... />)

const RESUME_HREF = "/assets/resume.pdf";
const navItems = ["Projects", "Experience", "About", "Contact"];

const NavBar = () => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);

  const audioElementRef = useRef(null);
  const navContainerRef = useRef(null);

  const { y: currentScrollY } = useWindowScroll();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleAudioIndicator = async () => {
    const audio = audioElementRef.current;
    if (!audio) return;

    try {
      if (!isAudioPlaying) {
        await audio.play();
        setIsAudioPlaying(true);
        setIsIndicatorActive(true);
      } else {
        audio.pause();
        setIsAudioPlaying(false);
        setIsIndicatorActive(false);
      }
    } catch (err) {
      // If blocked, rely on first interaction
      attachFirstInteractionPlay();
    }
  };

  // Try to autoplay on load (muted first to comply with browser policies)
  useEffect(() => {
    const audio = audioElementRef.current;
    if (!audio) return;

    const tryAutoplay = async () => {
      try {
        audio.muted = true; // muted autoplay is usually allowed
        audio.autoplay = true;
        // Safari/iOS quirks: keep preload so it buffers
        await audio.play();
        // Unmute shortly after successful start
        setTimeout(() => {
          audio.muted = false;
          audio.volume = 1;
          setIsAudioPlaying(true);
          setIsIndicatorActive(true);
        }, 300);
      } catch (err) {
        // If autoplay is blocked, wait for first interaction
        attachFirstInteractionPlay();
      }
    };

    const attachFirstInteractionPlay = () => {
      const resume = () => {
        audio.muted = false;
        audio.volume = 1;
        audio.play().catch(() => {});
        setIsAudioPlaying(true);
        setIsIndicatorActive(true);
        window.removeEventListener("pointerdown", resume);
        window.removeEventListener("keydown", resume);
        window.removeEventListener("touchstart", resume);
        window.removeEventListener("scroll", resume);
      };
      window.addEventListener("pointerdown", resume, { once: true });
      window.addEventListener("keydown", resume, { once: true });
      window.addEventListener("touchstart", resume, { once: true });
      window.addEventListener("scroll", resume, { once: true });
    };

    tryAutoplay();

    // cleanup interaction listeners on unmount (in case)
    return () => {
      window.removeEventListener("pointerdown", () => {});
      window.removeEventListener("keydown", () => {});
      window.removeEventListener("touchstart", () => {});
      window.removeEventListener("scroll", () => {});
    };
  }, []);

  // Show/hide navbar on scroll
  useEffect(() => {
    if (currentScrollY === 0) {
      setIsNavVisible(true);
      navContainerRef.current?.classList.remove("floating-nav");
    } else if (currentScrollY > lastScrollY) {
      setIsNavVisible(false);
      navContainerRef.current?.classList.add("floating-nav");
    } else if (currentScrollY < lastScrollY) {
      setIsNavVisible(true);
      navContainerRef.current?.classList.add("floating-nav");
    }
    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY]);

  // GSAP animation for nav show/hide
  useEffect(() => {
    if (!navContainerRef.current) return;
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.2,
    });
  }, [isNavVisible]);

  // Download resume (works on any bundler because the file is in /public)
  const handleResumeDownload = () => {
    const link = document.createElement("a");
    link.href = RESUME_HREF; // "/assets/resume.pdf"
    link.download = "Sk_Ramiz_Raja_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      ref={navContainerRef}
      className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6"
    >
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full items-center justify-between p-4">
          <div className="flex items-center gap-7">
            <img src="/img/logo.png" alt="logo" className="w-10" />

            {/* NOTE: This Button must forward onClick for the download to work */}
            <Button
              id="resume-button"
              title="Resume"
              rightIcon={<TiLocationArrow />}
              onClick={handleResumeDownload}
              // If you want it visible on mobile too, remove "hidden md:flex"
              containerClass="bg-blue-50 md:flex hidden items-center justify-center gap-1"
            />
          </div>

          <div className="flex h-full items-center">
            <div className="hidden md:block">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={`#${item.toLowerCase()}`}
                  className="nav-hover-btn"
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Audio toggle + hidden audio element */}
            <button
              onClick={toggleAudioIndicator}
              className="ml-10 flex items-center space-x-0.5"
              aria-pressed={isAudioPlaying}
              aria-label={isAudioPlaying ? "Pause music" : "Play music"}
            >
              <audio
                ref={audioElementRef}
                className="hidden"
                src="/audio/loop.mp3"
                loop
                preload="auto"
                muted
              />
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={clsx("indicator-line", {
                    active: isIndicatorActive,
                  })}
                  style={{ animationDelay: `${bar * 0.1}s` }}
                />
              ))}
            </button>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default NavBar;
