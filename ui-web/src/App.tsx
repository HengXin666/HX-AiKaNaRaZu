import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "@/page/home";

const ReactBitsPage = lazy(() => import("@/page/react-bits"));
const HeroUIPage = lazy(() => import("@/page/heroui"));
const SmoothUIPage = lazy(() => import("@/page/smoothui"));
const AceternityPage = lazy(() => import("@/page/aceternity"));
const BiliOpsHeroUI = lazy(() => import("@/lab/heroui"));
const BiliOpsReactBits = lazy(() => import("@/lab/react-bits"));
const BiliOpsSmoothUI = lazy(() => import("@/lab/smoothui"));
const BiliOpsAceternity = lazy(() => import("@/lab/aceternity"));

export default function App() {
  return (
    <Suspense fallback={<div className="min-h-screen grid place-items-center bg-[#990099] text-white font-mono text-xs tracking-[.2em]">LOADING UI LAB…</div>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ui/react-bits" element={<ReactBitsPage />} />
        <Route path="/ui/heroui" element={<HeroUIPage />} />
        <Route path="/ui/smoothui" element={<SmoothUIPage />} />
        <Route path="/ui/aceternity" element={<AceternityPage />} />
        <Route path="/lab/heroui/*" element={<BiliOpsHeroUI />} />
        <Route path="/lab/react-bits/*" element={<BiliOpsReactBits />} />
        <Route path="/lab/smoothui/*" element={<BiliOpsSmoothUI />} />
        <Route path="/lab/aceternity/*" element={<BiliOpsAceternity />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
