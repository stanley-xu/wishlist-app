import { supabase } from "@/lib/supabase";
import React from "react";
import { Button } from "./Button";

async function onSignOutButtonPress() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error signing out:", error);
  }
}

export function Logout() {
  return <Button onPress={onSignOutButtonPress}>Log out</Button>;
}
