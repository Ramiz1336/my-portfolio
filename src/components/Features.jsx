import { useState, useRef } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { FaGithub } from "react-icons/fa";

export const BentoTilt = ({ children, className = "" }) => {
  const [transformStyle, setTransformStyle] = useState("");
  const itemRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!itemRef.current) return;

    const { left, top, width, height } = itemRef.current.getBoundingClientRect();
    const relativeX = (event.clientX - left) / width;
    const relativeY = (event.clientY - top) / height;

    const tiltX = (relativeY - 0.5) * 5;
    const tiltY = (relativeX - 0.5) * -5;

    setTransformStyle(
      `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.95, .95, .95)`
    );
  };

  const handleMouseLeave = () => setTransformStyle("");

  return (
    <div
      ref={itemRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle }}
    >
      {children}
    </div>
  );
};

export const BentoCard = ({ src, title, description, isLiveProject, projectUrl, repoUrl }) => {
  // Separate state for two buttons
  const [hover1, setHover1] = useState(0);
  const [hover2, setHover2] = useState(0);
  const [cursor1, setCursor1] = useState({ x: 0, y: 0 });
  const [cursor2, setCursor2] = useState({ x: 0, y: 0 });

  const ref1 = useRef(null);
  const ref2 = useRef(null);

  const trackCursor = (event, setCursor, ref) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setCursor({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  const openInNewTab = (url) => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  const GlowButton = ({ text, url, icon, bg, glowColor, hover, setHover, cursor, setCursor, refEl }) => (
    <div
      ref={refEl}
      onMouseMove={(e) => trackCursor(e, setCursor, refEl)}
      onMouseEnter={() => setHover(1)}
      onMouseLeave={() => setHover(0)}
      onClick={() => openInNewTab(url)}
      className={`relative flex w-fit cursor-pointer items-center gap-1 overflow-hidden rounded-full px-5 py-2 text-xs uppercase transition ${bg}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity: hover,
          background: `radial-gradient(100px circle at ${cursor.x}px ${cursor.y}px, ${glowColor}, transparent)`,
        }}
      />
      {icon && <span className="relative z-20">{icon}</span>}
      <p className="relative z-20">{text}</p>
    </div>
  );

  return (
    <div className="relative size-full">
      <video
        src={src}
        loop
        muted
        autoPlay
        className="absolute left-0 top-0 size-full object-cover object-center"
      />
      <div className="relative z-10 flex size-full flex-col justify-between p-5 text-blue-50">
        <div>
          <h1 className="bento-title special-font">{title}</h1>
          {description && (
            <p className="mt-3 max-w-64 text-xs md:text-base">{description}</p>
          )}
        </div>

        {isLiveProject && (
          <div className="flex gap-3">
            <GlowButton
              text="view project"
              url={projectUrl}
              icon={<TiLocationArrow />}
              bg="bg-black text-white/80"
              glowColor="#656fe288"
              hover={hover1}
              setHover={setHover1}
              cursor={cursor1}
              setCursor={setCursor1}
              refEl={ref1}
            />
            <GlowButton
              text="git repo"
              url={repoUrl}
              icon={<FaGithub />}
              bg="bg-[#24292e] text-white/80"
              glowColor="rgba(255,255,255,0.3)"
              hover={hover2}
              setHover={setHover2}
              cursor={cursor2}
              setCursor={setCursor2}
              refEl={ref2}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Features Section
const Features = () => (
  <section className="bg-black pb-52">
    <div className="container mx-auto px-3 md:px-10">
      <div className="px-5 py-32">
        <p className="font-circular-web text-lg text-blue-50">Featured Projects</p>
        <p className="max-w-md font-circular-web text-lg text-blue-50 opacity-50">
          Explore a showcase of innovative web applications built with modern technologies, 
          demonstrating expertise in full-stack development and user experience design.
        </p>
      </div>

      {/* Main Large Project */}
      <BentoTilt className="border-hsla relative mb-7 h-96 w-full overflow-hidden rounded-md md:h-[65vh]">
        <BentoCard
          src="videos/feature-1.mp4"
          title={<>IterCo<b>n</b>nect</>}
          description="A comprehensive intra-college networking platform for ITER students..."
          isLiveProject
          projectUrl="https://example.com/live-project"
          repoUrl="https://github.com/example/repo"
        />
      </BentoTilt>

      {/* Grid Layout */}
      <div className="grid h-[135vh] w-full grid-cols-2 grid-rows-3 gap-7">
        <BentoTilt className="bento-tilt_1 row-span-1 md:col-span-1 md:row-span-2">
          <BentoCard
            src="videos/feature-2.mp4"
            title={<>DSA Visuali<b>z</b>er</>}
            description="An interactive learning platform that brings data structures and algorithms to life..."
            isLiveProject
            projectUrl="https://dsa-visualizer-algorithm.vercel.app/"
            repoUrl="https://github.com/Ramiz1336/DSA_Visualizer"
          />
        </BentoTilt>

        <BentoTilt className="bento-tilt_1 row-span-1 md:col-span-1">
          <BentoCard
            src="videos/feature-3.mp4"
            title={<>Maujoodg<b>i</b></>}
            description="Smart attendance tracking system with dynamic QR codes..."
            isLiveProject
            projectUrl="https://example.com/live-project"
            repoUrl="https://github.com/example/repo"
          />
        </BentoTilt>

        <BentoTilt className="bento-tilt_1 md:col-span-1">
          <BentoCard
            src="videos/feature-4.mp4"
            title={<>Web D<b>e</b>v Tools</>}
            description="Collection of developer utilities and components..."
            isLiveProject
            projectUrl="https://example.com/live-project"
            repoUrl="https://github.com/example/repo"
          />
        </BentoTilt>

        <BentoTilt className="bento-tilt_2">
          <div className="flex size-full flex-col justify-between bg-violet-300 p-5">
            <h1 className="bento-title special-font max-w-64 text-black">
              M<b>o</b>re pr<b>o</b>jects c<b>o</b>ming.
            </h1>
            <TiLocationArrow className="m-5 scale-[5] self-end" />
          </div>
        </BentoTilt>

        <BentoTilt className="bento-tilt_2">
          <video
            src="videos/feature-5.mp4"
            loop
            muted
            autoPlay
            className="size-full object-cover object-center"
          />
        </BentoTilt>
      </div>
    </div>
  </section>
);

export default Features;
