import React, { useState } from 'react';
import {
  BellIcon,
  CalendarDaysIcon,
  Cog6ToothIcon,
  KeyIcon,
  ArrowRightOnRectangleIcon,
  BookOpenIcon,
  HomeIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const sidebarMenu = [
  { icon: <BookOpenIcon style={{ width: '20px', height: '20px', marginRight: '12px' }} />, label: 'Switch Language' },
  { icon: <CalendarDaysIcon style={{ width: '20px', height: '20px', marginRight: '12px' }} />, label: 'Switch Timezone' },
  { icon: <Cog6ToothIcon style={{ width: '20px', height: '20px', marginRight: '12px' }} />, label: 'Manage Permission' },
  { icon: <KeyIcon style={{ width: '20px', height: '20px', marginRight: '12px' }} />, label: 'Change Password' },
  { icon: <svg style={{ width: '20px', height: '20px', marginRight: '12px' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3V5h-3v4zM6 9h3V5H6v4z" /></svg>, label: '2FA' },
  { icon: <CalendarDaysIcon style={{ width: '20px', height: '20px', marginRight: '12px' }} />, label: 'Accounts' },
  { icon: <BellIcon style={{ width: '20px', height: '20px', marginRight: '12px' }} />, label: 'Notifications' },
  { icon: <ArrowRightOnRectangleIcon style={{ width: '20px', height: '20px', marginRight: '12px' }} />, label: 'Sessions' },
  { icon: <Cog6ToothIcon style={{ width: '20px', height: '20px', marginRight: '12px' }} />, label: 'Logout' },
];

const Profile = () => {
  const [language, setLanguage] = useState('English');

  return (
    <div style={{ minHeight: '100vh',  }}>
      {/* Blue Header */}
      <div style={{
        width: '100%',
        height: '70px',
       
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        color: 'white',
        position: 'relative'
      }}>
        {/* <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HomeIcon style={{ width: '20px', height: '20px' }} />
          <span style={{ fontSize: '14px', opacity: 0.8 }}>Home</span>
          <span style={{ fontSize: '14px', opacity: 0.8 }}>/</span>
          <span style={{ fontSize: '16px', fontWeight: '600' }}>Profile</span>
        </div> */}
      </div>

      {/* Body Container */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        padding: '0 32px',
        marginTop: '-70px',
        gap: '24px',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Sidebar Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          minWidth: '280px',
          height: 'fit-content'
        }}>
          {sidebarMenu.map((item, idx) => (
            <button key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              color: idx === 0 ? '#667eea' : '#6b7280',
              background: idx === 0 ? '#f0f4ff' : 'transparent',
              border: 'none',
              fontSize: '14px',
              fontWeight: idx === 0 ? '500' : '400',
              cursor: 'pointer',
              padding: '12px 16px',
              borderRadius: '8px',
              textAlign: 'left',
              transition: 'all 0.2s ease',
              ':hover': {
                backgroundColor: '#f9fafb'
              }
            }}
            onMouseEnter={(e) => {
              if (idx !== 0) {
                e.target.style.backgroundColor = '#f9fafb';
              }
            }}
            onMouseLeave={(e) => {
              if (idx !== 0) {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {/* Language Switcher Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          padding: '32px',
          flex: 1,
          maxWidth: '500px',
          height: 'fit-content'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1px'
          }}>
            <select
              style={{
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                color: '#374151',
                fontSize: '14px',
                flex: 1,
                backgroundColor: 'white',
                cursor: 'pointer',
                outline: 'none'
              }}
              value={language}
              onChange={e => setLanguage(e.target.value)}
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="French">French</option>
              <option value="Spanish">Spanish</option>
            </select>
            
            <button style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: '500',
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(102, 126, 234, 0.3)',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 10px rgba(102, 126, 234, 0.3)';
            }}
            >
              Switch Language
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;