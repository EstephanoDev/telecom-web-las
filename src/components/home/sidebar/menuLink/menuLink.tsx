"use client"

import React from "react";
import Link from 'next/link'
import styles from './menuLink.module.css'
import { usePathname } from 'next/navigation'

const MenuLink = ({ item, minimized }: any) => {
  const pathname = usePathname();

  return (
    <Link href={item.path} className={`${styles.container} ${pathname === item.path && styles.active}`}>
      {!minimized && (
        <>
          {item.icon}
          {item.title}
        </>
      )}
      {minimized && item.icon}
    </Link>
  );
};

export default MenuLink;

