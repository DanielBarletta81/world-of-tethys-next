import React from 'react';


export function IconButton({ children, state = "base", ...props }) {
 
  

  return (
    <button className="tethys-icon" data-state={state} {...props}>
      {children}
    </button>
  );
}
// World of Tethys || D.C. Barletta
