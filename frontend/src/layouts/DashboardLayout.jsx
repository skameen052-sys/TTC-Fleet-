import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';

export const DashboardLayout = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="dashboard-layout">
      {/* Sidebar matching Image 2 */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="dashboard-main">
        <Navbar onSearch={setSearchQuery} />
        <main className="dashboard-content-area">
          <Outlet context={{ searchQuery }} />
        </main>
      </div>
    </div>
  );
};
