
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 border-t border-gray-800 text-center text-gray-500 text-sm">
      <p>© {new Date().getFullYear()} Check-U Resume Helper & Smart Analyzer</p>
    </footer>
  );
};

export default Footer;
