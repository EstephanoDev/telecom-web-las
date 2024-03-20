'use client'

import React, { useState } from "react";
import { getRolNombre, menuItems } from "@/lib/constantes";
import MenuLink from "./menuLink/menuLink";
import styles from "./sidebar.module.css";
import { UserData } from "./userData";
import { Card } from "@/components/ui/card";

const Sidebar = ({ username, rol, avatar }: any) => {
  const rolName = getRolNombre(rol);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);

  const toggleSidebar = () => {
    setSidebarMinimized(!sidebarMinimized);
  };

  return (
    <div className={`${styles.container} ${sidebarMinimized ? styles.minimized : ""}`}>
      {!sidebarMinimized && (
        <Card className={styles.user}>
          <UserData username={username} rol={rolName} avatar={avatar} />
        </Card>
      )}
      <ul className={styles.list}>
        {menuItems.map((cat) => (
          <li key={cat.title}>
            <span className={styles.cat}>{cat.title}</span>
            {cat.list.map((item) => (
              // Renderizar solo los iconos cuando el sidebar está minimizado
              (!sidebarMinimized || item.title === 'Dashboard' || rol === 'b474d45qjtuawdm') && (
                <MenuLink item={item} key={item.title} minimized={sidebarMinimized} />
              )
            ))}
          </li>
        ))}
      </ul>
      {/* Agregar un botón o ícono para minimizar el sidebar */}
      <button className={styles.toggleButton} onClick={toggleSidebar}>
        {sidebarMinimized ? "Mostrar Sidebar" : "Ocultar Sidebar"}
      </button>
    </div>
  );
};

export default Sidebar;

