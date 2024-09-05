import React, { useState } from 'react';
import "../styles/Tooltip.css"; // Import your CSS file

const Tooltip = ({ message, children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div 
      className="tooltip-container"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && <div className="tooltip">{message}</div>}
    </div>
  );
};

export default React.memo(Tooltip);
