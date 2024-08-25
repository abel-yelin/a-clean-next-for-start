import Image from "next/image";
import { db } from "@/server/db/db";
import { use } from "react";
import { Divide } from "lucide-react";

export default async function Home() {
  const users = await db.query.Users.findMany();
  return (
    <div>我是一个名字
      {users.map((users) =>
           <div key={users.id}>{users.name}</div>)
      }
    </div>
  );
}
