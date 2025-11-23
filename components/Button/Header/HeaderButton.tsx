import { Button, ButtonProps } from "../Button";

export function HeaderButton(props: ButtonProps) {
  return <Button.Unstyled {...props} style={{ minWidth: 44 }} />;
}
