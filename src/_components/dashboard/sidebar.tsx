import { 
    LayoutDashboard,
    User,
    FileText,
    Settings
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";

const navItems = [
{
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Overview"
},
{
    href: "/dashboard/patients",
    icon: User,
    label: "Patients"
},
{
    href: "/dashboard/reports",
    icon: FileText,
    label: "Reports"
},
{
    href: "/dashboard/team",
    icon: User,
    label: "Team"
},
{
    href: "/dashboard/settings",
    icon: Settings,
    label: "Settings"
}
];

type DashboardSidebarProps = React.HTMLAttributes<HTMLDivElement>

export function DashboardSidebar({ className }: DashboardSidebarProps) {
    return (
            <div className={cn("pb-12", className)}>
                <div className="space-y-4 py-4">
                    <div className="px-4 py-2">
                    <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
                        Dashboard
                    </h2>
                    <div className="space-y-1">
                        {navItems.map((item) => (
                        <NavLink
                            key={item.href}
                            to={item.href}
                            className={({ isActive }) =>
                            cn(
                                "w-full justify-start",
                                isActive
                                ? "bg-accent text-accent-foreground"
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )
                            }
                        >
                            <Button variant="ghost" className="w-full justify-start">
                            <item.icon className="mr-2 h-4 w-4" />
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