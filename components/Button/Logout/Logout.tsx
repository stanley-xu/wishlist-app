import { useAuthContext } from "@/lib/auth";
import { Button, ButtonProps } from "@/components/Button";

export function Logout(props: Partial<ButtonProps>) {
  const { signOut } = useAuthContext();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Button {...props} onPress={handleSignOut}>
      Log out
    </Button>
  );
}
