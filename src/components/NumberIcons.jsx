import React, { useState } from 'react';

const NumberIcons = ({ number, status }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <div
        style={{
          width: "25px",
          height: "25px",
          borderRadius: "50%",
          backgroundColor: isHovered ? "yellow" : (status === 'active' ? "red" : "white"),
          color: isHovered ? "black" : (status === 'active' ? "white" : "#005174"),
        }}
        className='d-flex align-items-center justify-content-center fs-6 fw-bold p-2 num-ico'
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {number}
      </div>
    </>
  );
};

export default NumberIcons;