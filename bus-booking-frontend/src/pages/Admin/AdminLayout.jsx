import { Outlet, NavLink } from "react-router-dom";

export default function AdminLayout() {
  const navLinkClasses = ({ isActive }) =>
    `block px-4 py-2 rounded-md ${
      isActive ? "bg-blue-600 text-white" : "hover:bg-gray-200 text-gray-800"
    }`;
  
  const subNavLinkClasses = ({ isActive }) =>
    `block pl-8 pr-4 py-2 rounded-md text-sm ${
      isActive ? "bg-blue-600 text-white" : "hover:bg-gray-200 text-gray-700"
    }`;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Admin Navigation Sidebar */}
      <aside className="w-64 bg-white p-4 shadow-lg">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Admin Navigation</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <NavLink to="/admin/dashboard" className={navLinkClasses}>
                Dashboard
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink to="/admin/users" className={navLinkClasses}>
                Users
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink to="/admin/buses" className={navLinkClasses}>
                Buses
              </NavLink>
              <ul className="mt-1 ml-4 border-l border-gray-300"> {/* Sub-options for Buses */}
                <li className="mb-1">
                  <NavLink to="/admin/buses/create" className={subNavLinkClasses}>
                    Create Bus
                  </NavLink>
                </li>
                <li className="mb-1">
                  <NavLink to="/admin/buses" end className={subNavLinkClasses}> {/* `end` prop for exact match */}
                    Bus List
                  </NavLink>
                </li>
              </ul>
            </li>
            {/* Add more admin navigation items here */}
          </ul>
        </nav>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 p-8">
        <Outlet /> {/* This is where nested routes (AdminDashboard, AdminUsers, etc.) will render */}
      </main>
    </div>
  );
}