import { redirect } from "next/navigation";

export default function Page() {
  redirect("/legacy/day1to5/index.html?day=2");
}
