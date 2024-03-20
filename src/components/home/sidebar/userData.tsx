'use client'

import { ModeToggle } from "@/components/theme/mode-toggle";
import styles from "./sidebar.module.css";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { destroyCookie } from 'nookies'
import { useRouter } from 'next/navigation'
import Image from "next/image";
import { LogOutIcon } from "lucide-react";


export const UserData = ({ rol, username, avatar }: { rol: string, username: string, avatar: string }) => {
  const usernameFormat = username.slice(0, 2).toUpperCase()
  const router = useRouter()

  const handleLogout = async () => {
    destroyCookie(null, 'pb_auth');  // Reemplaza 'tu_cookie_de_autenticacion' con el nombre de tu cookie
    router.refresh()

  }
  return (
    <>
      <Avatar>
        <AvatarImage src={avatar} alt="@shadcn" />
        <AvatarFallback className="ml-2 mt-2">{usernameFormat}</AvatarFallback>
      </Avatar>
      <div className={styles.userDetail}>
        <span className={styles.username}>{username}</span>
        <span className={styles.userTitle}>
          {rol}
        </span>
      </div>
      <div className={styles.userActions}>
        <ModeToggle />
        <LogOutIcon onClick={handleLogout} className="w-10 h-10 p-2 border ml-1 rounded-sm border-slate-800 hover:bg-slate-800" />
      </div>
    </>
  );
};

