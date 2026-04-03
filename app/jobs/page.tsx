import { redirect } from "next/navigation";

// /jobs is superseded by /marketplace
export default function JobsPage() {
  redirect("/marketplace");
}
