import React from 'react';

export function IconButton({
  children,
  state = 'base',
  faction,
  region,
  ...props
}) {
  return (
    <button
      className="tethys-icon"
      data-state={state}
      data-faction={faction}
      data-region={region}
      {...props}
    >
      {children}
    </button>
  );
}

const makeFactionButton = (faction) => {
  return function FactionIconButton({ region, ...props }) {
    return <IconButton faction={faction} region={region} {...props} />;
  };
};

export const SkyCityIconButton = makeFactionButton('sky-city');
export const MysticIconButton = makeFactionButton('mystic');
export const LowerTierIconButton = makeFactionButton('lower-tier');
export const IronwoodIconButton = makeFactionButton('ironwood');
export const WildIconButton = makeFactionButton('wild');
export const CambriaIconButton = makeFactionButton('cambria');

export function FactionIconButton({ faction, region, ...props }) {
  return <IconButton faction={faction} region={region} {...props} />;
}
// World of Tethys || D.C. Barletta
