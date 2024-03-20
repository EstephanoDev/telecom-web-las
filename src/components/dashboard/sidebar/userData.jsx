'use client'
import { useState, useEffect } from 'react';
import { pb } from "@/lib/db";
import styles from "./sidebar.module.css";

const UserData = () => {
  const [roles, setRoles] = useState([]);
  const user = pb.authStore.model?.name || undefined// Set a default value if undefined

  useEffect(() => {
    const fetchRoles = async () => {
      const rolIds = pb.authStore.model?.roles;
      try {
        const response = await pb.collection('Roles').getList(1, 50, {
          filter: `id = '${rolIds}'`
        });
        const roleNames = response.items.map(item => item.name);
        setRoles(roleNames);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  return (
    <div className={styles.userDetail}>
      <span className={styles.username}>{user}</span>
      {roles.length > 0 && (
        <span className={styles.userTitle}>
          {roles.join(', ')}
        </span>
      )}
    </div>
  );
};

export default UserData;

