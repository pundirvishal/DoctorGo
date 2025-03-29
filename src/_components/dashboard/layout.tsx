import { Navigate, Outlet, useParams } from 'react-router-dom'
import { OrgSwitcher } from './org-switcher'
import { UserButton } from '@clerk/clerk-react'
import { Button } from '../../components/ui/button'
import { NavLink } from 'react-router-dom'

export function DashboardLayout() {
  const { org } = useParams<{ org: string }>()

  if (!org) {
    return <Navigate to="/org-selection" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="flex h-16 items-center px-4">
          <h1 className="text-xl font-bold">MedScan AI</h1>
          <div className="ml-auto flex items-center gap-4">
            <OrgSwitcher />
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>
      
      <div className="flex">
        <aside className="w-64 border-r bg-white p-4">
          <nav className="flex flex-col gap-1">
            <NavLink to={`/dashboard/${org}/patients`}>
              {({ isActive }) => (
                <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start">
                  Patients
                </Button>
              )}
            </NavLink>
            <NavLink to={`/dashboard/${org}/reports`}>
              {({ isActive }) => (
                <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start">
                  Reports
                </Button>
              )}
            </NavLink>
            <NavLink to={`/dashboard/${org}/members`}>
              {({ isActive }) => (
                <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start">
                  Team
                </Button>
              )}
            </NavLink>
          </nav>
        </aside>
        
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}