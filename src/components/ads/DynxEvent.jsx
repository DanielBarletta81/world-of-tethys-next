'use client';

import { useEffect } from 'react';

export default function DynxEvent({ itemId, pageType }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'view_item', {
        send_to: 'AW-17612201186',
        dynx_itemid: itemId,
        dynx_pagetype: pageType,
      });
    }
  }, [itemId, pageType]);

  return null;
}
