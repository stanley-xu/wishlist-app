import { supabase } from "@/lib/supabase";
import React from "react";
import { Button, ButtonProps } from "./Button";

async function onSignOutButtonPress() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error signing out:", error);
  }
}

export function Logout(props: Partial<ButtonProps>) {
  return (
    <Button {...props} onPress={onSignOutButtonPress}>
      Log out
    </Button>
  );
}
