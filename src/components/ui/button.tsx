import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
const variants = { default: 'button-primary', outline: 'button-outline', ghost: 'button-ghost', danger: 'button-danger' };
const sizes = { default: '', sm: 'button-sm', icon: 'button-icon' };
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants | null;
  size?: keyof typeof sizes | null;
  asChild?: boolean;
}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    const classes = ['button', variant && variants[variant], size && sizes[size], className].filter(Boolean).join(' ');
    return <Comp className={classes} ref={ref} {...props} />;
  },
);
Button.displayName = 'Button';
