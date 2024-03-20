import { getRolNombre, menuItems } from "@/lib/constantes";
import MenuLink from "./menuLink/menuLink";
import styles from "./sidebar.module.css";
import { UserData } from "./userData/UserData";
import { Card } from "@/components/ui/card";



const Sidebar = ({
  username,
  rol,
  avatar,
}) => {
  const rolName = getRolNombre(rol)
  return (
    <div className={styles.container}>
      <Card className={styles.user}>
        <UserData username={username} rol={rolName} avatar={avatar} />
      </Card>
      <ul className={styles.list}>
        {menuItems.map((cat) => (
          <li key={cat.title}>
            <span className={styles.cat}>{cat.title}</span>
            {cat.list.map((item) => (
              // Añade la condición para no mostrar el enlace si el rol no es 'b474d45qjtuawdm'
              (item.title === 'Dashboard' && rol !== 'b474d45qjtuawdm') ? null : (
                <MenuLink item={item} key={item.title} />
              )
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;

