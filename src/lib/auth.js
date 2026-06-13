import { cookies } from "next/headers";

export async function getAdmin() {

  const cookieStore =
    await cookies();

  const adminCookie =
    cookieStore.get("admin");

  if (!adminCookie) {
    return null;
  }

  return JSON.parse(
    adminCookie.value
  );
}