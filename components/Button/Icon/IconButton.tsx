import { Button, ButtonProps } from "../Button";

export function IconButton(props: ButtonProps) {
  return <Button.Unstyled style={{ minWidth: 44 }} {...props} />;
}
