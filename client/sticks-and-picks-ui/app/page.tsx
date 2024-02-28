import styles from "./page.module.css";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <h1 className={styles.title}>Welcome to Sticks and Picks</h1>
        <p className={styles.description}>A fantasy hockey pickem game</p>
        <UserButton />
      </div>
    </main>
  );
}
