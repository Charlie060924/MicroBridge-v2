// Standardized UI Component Library
// Consolidates all button variants, input components, modal, and card components

export { default as Button, Button } from './Button';
export { default as Input } from './input';
export { default as Modal } from './modal';
export { default as Card, Card, CardHeader, CardTitle, CardContent } from './card';
export { default as Badge, Badge } from './badge';
export { default as Slider, Slider } from './slider';
export { default as animations, animations } from './Animations';

// Re-export types for convenience
export type { ButtonProps } from './Button';
export type { InputProps } from './input';
export type { ModalProps } from './modal';
export type { BadgeProps } from './badge';
export type { SliderProps } from './slider';