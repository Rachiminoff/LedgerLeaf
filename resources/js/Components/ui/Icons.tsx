import React from 'react';
import { Icon } from '@iconify/react';

// Pre-configured icon components for easy reuse
export const MailIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <Icon icon="mdi:email-outline" className={className} />
);

export const LockIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <Icon icon="mdi:lock-outline" className={className} />
);

export const EyeIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <Icon icon="mdi:eye" className={className} />
);

export const EyeOffIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <Icon icon="mdi:eye-off" className={className} />
);

export const LeafIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <Icon icon="mdi:leaf" className={className} />
);

// Alternative leaf icons
export const LeafOutlineIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <Icon icon="mdi:leaf-outline" className={className} />
);

export const LeafCircleIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <Icon icon="mdi:leaf-circle-outline" className={className} />
);

// Additional nature icons that might be useful
export const TreeIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <Icon icon="mdi:tree-outline" className={className} />
);

export const FlowerIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <Icon icon="mdi:flower-outline" className={className} />
);

export const SproutIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <Icon icon="mdi:sprout-outline" className={className} />
);

export const PlantIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <Icon icon="mdi:plant-outline" className={className} />
);