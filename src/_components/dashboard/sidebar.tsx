import { 
    LayoutDashboard,
    User,
    FileText,
    Settings
} from "lucide-react";
import { NavLink, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";

// Removed static hrefs from navItems
const navItems = [
{
    key: "overview",
    icon: LayoutDashboard,
    label: "Overview"
},
{
    key: "patients",
    icon: User,
    label: "Patients"
},
{
    key: "reports",
    icon: FileText,
    label: "Reports"
},
{
    key: "team",
    icon: User,
    label: "Team"
},
{
    key: "settings",
    icon: Settings,
    label: "Settings"
}
];

type DashboardSidebarProps = React.HTMLAttributes<HTMLDivElement>

export function DashboardSidebar({ className }: DashboardSidebarProps) {
    const { org } = useParams();

    return (
        <div className={cn("pb-12 bg-secondary text-text-light", className)}>
            <div className="space-y-4 py-4">
                <div className="px-4 py-2">
                    <h2 className="mb-4 px-2 text-lg font-semibold tracking-tight text-highlight">
                        Dashboard
                    </h2>
                    <div className="space-y-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.key}
                                to={`/dashboard/${org}/${item.key}`}
                                className={({ isActive }) =>
                                    cn(
                                        "w-full justify-start rounded-md transition-all duration-300",
                                        isActive
                                            ? "bg-gradient-to-r from-highlight to-accent text-white font-bold shadow-md"
                                            : "text-text-muted hover:bg-accent hover:text-white"
                                    )
                                }
                            >
                                <Button variant="ghost" className="w-full justify-start">
                                    <item.icon className="mr-2 h-5 w-5" />
                                    {item.label}
                                </Button>
                            </NavLink>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}