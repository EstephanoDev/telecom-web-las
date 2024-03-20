import { cookies } from "next/headers"
import { styles, Sidebar, Footer } from "@/components/dashboard"
import db from "@/lib/db"

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = cookies();
  const user = await db.getUser(cookieStore);

  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <Sidebar username={user?.name} rol={user?.roles[0]} avatar={user?.avatar} />
      </div>
      <div className={styles.content}>
        {children}
        <Footer />
      </div>
    </div>
  )
}

export default Layout

