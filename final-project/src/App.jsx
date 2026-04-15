import "./App.css";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Highlights from "./components/Highlights";
import Showcase from "./components/Showcase";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

const navItems = ["Home", "Work", "Services", "Contact"];

const stats = [
  { value: "12+", label: "student projects completed" },
  { value: "5", label: "core service packages" },
  { value: "24h", label: "average reply time" },
];

const highlightCards = [
  {
    eyebrow: "Branding",
    title: "Identity systems with a clear point of view",
    text: "Logos, palette systems, and web-ready style guides designed to make small businesses look consistent everywhere.",
  },
  {
    eyebrow: "Web Design",
    title: "Responsive pages that feel polished on every screen",
    text: "Landing pages and portfolio sites structured with strong hierarchy, clear calls to action, and balanced spacing.",
  },
  {
    eyebrow: "Content",
    title: "Copy and visuals arranged to support the message",
    text: "Page sections are planned so visitors can understand the offer quickly and move naturally toward contact or booking.",
  },
];

const showcaseItems = [
  {
    title: "Northwind Cafe",
    type: "Landing page redesign",
    description: "Warm editorial styling, menu highlights, and a reservation call-to-action built for mobile-first browsing.",
  },
  {
    title: "Studio Luma",
    type: "Portfolio concept",
    description: "A visual system focused on strong typography, art-direction blocks, and a flexible project gallery.",
  },
  {
    title: "Bloom Market",
    type: "Small business homepage",
    description: "A soft, welcoming storefront with feature cards, seasonal product space, and prominent service details.",
  },
];

function App() {
  return (
    <div className="page-shell">
      <Header navItems={navItems} />
      <main>
        <Hero stats={stats} />
        <Highlights cards={highlightCards} />
        <Showcase items={showcaseItems} />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
