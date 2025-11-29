'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/roles';
import { FaUserShield, FaExchangeAlt } from 'react-icons/fa';

export default function RoleSwitcher() {
  const { user, userRole } = useAuth();
  const [testRole, setTestRole] = useState<UserRole | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Load test role from localStorage on mount
  useEffect(() => {
    const savedTestRole = localStorage.getItem('testRole') as UserRole | null;
    if (savedTestRole && savedTestRole !== userRole) {
      setTestRole(savedTestRole);
    }
  }, [userRole]);

  // Only show for SuperAdmin (after all hooks)
  if (userRole !== 'SuperAdmin') {
    return null;
  }

  const currentDisplayRole = testRole || userRole;

  const handleRoleSwitch = (role: UserRole) => {
    if (role === userRole) {
      // Reset to actual role
      setTestRole(null);
      localStorage.removeItem('testRole');
    } else {
      // Switch to test role
      setTestRole(role);
      localStorage.setItem('testRole', role);
    }
    setIsOpen(false);
    // Force page reload to apply new role
    window.location.reload();
  };

  const roles: UserRole[] = ['SuperAdmin', 'SuperUser', 'User'];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Role Badge */}
      <div className="bg-white rounded-lg shadow-lg border-2 border-primary p-3 mb-2">
        <div className="flex items-center gap-2 mb-2">
          <FaUserShield className="text-primary" />
          <div className="text-xs">
            <div className="font-semibold text-gray-900">Testing as:</div>
            <div className={`font-bold ${
              testRole ? 'text-orange-600' : 'text-primary'
            }`}>
              {currentDisplayRole}
            </div>
          </div>
        </div>
        
        {testRole && (
          <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded mb-2">
            ⚠️ Test Mode Active
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-primary text-white px-3 py-1.5 rounded text-xs hover:bg-primary/90 flex items-center justify-center gap-2"
        >
          <FaExchangeAlt />
          Switch Role
        </button>
      </div>

      {/* Role Selector Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 p-3 min-w-[200px] z-50">
            <div className="text-xs font-semibold text-gray-700 mb-2">
              Switch to Role:
            </div>
            <div className="space-y-1">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleSwitch(role)}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    currentDisplayRole === role
                      ? 'bg-primary text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{role}</span>
                    {role === userRole && (
                      <span className="text-xs opacity-75">(Actual)</span>
                    )}
                    {role === testRole && (
                      <span className="text-xs opacity-75">(Testing)</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            {testRole && (
              <button
                onClick={() => handleRoleSwitch(userRole)}
                className="w-full mt-2 pt-2 border-t border-gray-200 text-xs text-orange-600 hover:text-orange-700 font-semibold"
              >
                Reset to Actual Role
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
