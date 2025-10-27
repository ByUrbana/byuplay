import { redirect } from "next/navigation";

export const metadata = {
  title: "Origen — BY)))URBANA × BY)))U FASHION",
  description:
    "BY)))URBANA es sponsor de BY)))U FASHION. Conocé el origen de la alianza con VLC Marketing y el impulso al Fashion Tour.",
};

export default function OrigenPage() {
  // Redirecionar temporariamente para a home
  redirect("/");
}
