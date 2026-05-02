import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import HomePage from "./pages/HomePage";
import DomainPage from "./pages/DomainPage";
import ClusterPage from "./pages/ClusterPage";
import DecisionPage from "./pages/DecisionPage";
import ShareSituationPage from "./pages/ShareSituationPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/share-your-situation" element={<ShareSituationPage />} />

        <Route path="/:domainSlug" element={<DomainPage />} />
        <Route path="/:domainSlug/:familySlug" element={<ClusterPage />} />
        <Route path="/p/:slug" element={<DecisionPage />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  );
}