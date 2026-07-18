import { useTheme } from "@/lib/use-theme";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Shell, type ModuleId } from "./common";
import Dashboard from "./dashboard";
import Quota from "./quota";
import Community from "./community";
import Settings from "./settings";
import "./styles.css";
export default function ReactBitsLab(){const {theme,toggleTheme}=useTheme();const location=useLocation();const module=(location.pathname.split("/").at(-1)||"dashboard") as ModuleId;return <Shell module={module} theme={theme} toggleTheme={toggleTheme}><Routes><Route path="dashboard" element={<Dashboard/>}/><Route path="quota" element={<Quota/>}/><Route path="community" element={<Community/>}/><Route path="settings" element={<Settings/>}/><Route index element={<Navigate to="dashboard" replace/>}/><Route path="*" element={<Navigate to="dashboard" replace/>}/></Routes></Shell>}
