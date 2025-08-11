import { useEffect, useCallback } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  action: () => void;
  description: string;
  enabled?: boolean;
}

interface UseKeyboardShortcutsOptions {
  shortcuts: KeyboardShortcut[];
  enabled?: boolean;
  preventDefault?: boolean;
}

export const useKeyboardShortcuts = ({
  shortcuts,
  enabled = true,
  preventDefault = true
}: UseKeyboardShortcutsOptions) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    const activeShortcut = shortcuts.find(shortcut => {
      if (!shortcut.enabled) return false;
      
      const keyMatch = shortcut.key.toLowerCase() === event.key.toLowerCase();
      const ctrlMatch = shortcut.ctrl === event.ctrlKey;
      const shiftMatch = shortcut.shift === event.shiftKey;
      const altMatch = shortcut.alt === event.altKey;
      const metaMatch = shortcut.meta === event.metaKey;

      return keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch;
    });

    if (activeShortcut) {
      if (preventDefault) {
        event.preventDefault();
      }
      activeShortcut.action();
    }
  }, [shortcuts, enabled, preventDefault]);

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown, enabled]);

  // Helper function to format shortcut for display
  const formatShortcut = (shortcut: KeyboardShortcut): string => {
    const parts: string[] = [];
    
    if (shortcut.ctrl) parts.push('Ctrl');
    if (shortcut.shift) parts.push('Shift');
    if (shortcut.alt) parts.push('Alt');
    if (shortcut.meta) parts.push('⌘');
    
    parts.push(shortcut.key.toUpperCase());
    
    return parts.join(' + ');
  };

  return { formatShortcut };
};

// Predefined shortcuts for common actions
export const commonShortcuts = {
  search: {
    key: '/',
    action: () => {
      // Focus search input
      const searchInput = document.querySelector('input[type="search"], input[placeholder*="search" i]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    },
    description: 'Focus search'
  },
  
  editProfile: {
    key: 'e',
    ctrl: true,
    action: () => {
      // Navigate to profile edit
      const editButton = document.querySelector('[data-action="edit-profile"]') as HTMLButtonElement;
      if (editButton) {
        editButton.click();
      }
    },
    description: 'Edit profile'
  },
  
  help: {
    key: '?',
    action: () => {
      // Open help modal or navigate to help page
      const helpButton = document.querySelector('[data-action="help"]') as HTMLButtonElement;
      if (helpButton) {
        helpButton.click();
      }
    },
    description: 'Open help'
  },
  
  save: {
    key: 's',
    ctrl: true,
    action: () => {
      // Trigger save action
      const saveButton = document.querySelector('[data-action="save"]') as HTMLButtonElement;
      if (saveButton && !saveButton.disabled) {
        saveButton.click();
      }
    },
    description: 'Save changes'
  },
  
  escape: {
    key: 'Escape',
    action: () => {
      // Close modals or cancel actions
      const closeButton = document.querySelector('[data-action="close"], [data-action="cancel"]') as HTMLButtonElement;
      if (closeButton) {
        closeButton.click();
      }
    },
    description: 'Close or cancel'
  },
  
  refresh: {
    key: 'r',
    ctrl: true,
    action: () => {
      window.location.reload();
    },
    description: 'Refresh page'
  },
  
  newTab: {
    key: 't',
    ctrl: true,
    action: () => {
      window.open('/', '_blank');
    },
    description: 'Open new tab'
  }
};

// Hook for specific feature shortcuts
export const useJobShortcuts = (actions: {
  onSearch?: () => void;
  onApply?: () => void;
  onSave?: () => void;
  onClose?: () => void;
}) => {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: '/',
      action: actions.onSearch || (() => {}),
      description: 'Search jobs',
      enabled: !!actions.onSearch
    },
    {
      key: 'Enter',
      action: actions.onApply || (() => {}),
      description: 'Apply to job',
      enabled: !!actions.onApply
    },
    {
      key: 's',
      ctrl: true,
      action: actions.onSave || (() => {}),
      description: 'Save job',
      enabled: !!actions.onSave
    },
    {
      key: 'Escape',
      action: actions.onClose || (() => {}),
      description: 'Close',
      enabled: !!actions.onClose
    }
  ];

  return useKeyboardShortcuts({ shortcuts });
};

// Hook for profile editing shortcuts
export const useProfileShortcuts = (actions: {
  onSave?: () => void;
  onCancel?: () => void;
  onPreview?: () => void;
}) => {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 's',
      ctrl: true,
      action: actions.onSave || (() => {}),
      description: 'Save profile',
      enabled: !!actions.onSave
    },
    {
      key: 'Escape',
      action: actions.onCancel || (() => {}),
      description: 'Cancel editing',
      enabled: !!actions.onCancel
    },
    {
      key: 'p',
      ctrl: true,
      action: actions.onPreview || (() => {}),
      description: 'Preview profile',
      enabled: !!actions.onPreview
    }
  ];

  return useKeyboardShortcuts({ shortcuts });
};

// Hook for settings shortcuts
export const useSettingsShortcuts = (actions: {
  onSave?: () => void;
  onReset?: () => void;
  onClose?: () => void;
}) => {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 's',
      ctrl: true,
      action: actions.onSave || (() => {}),
      description: 'Save settings',
      enabled: !!actions.onSave
    },
    {
      key: 'r',
      ctrl: true,
      action: actions.onReset || (() => {}),
      description: 'Reset settings',
      enabled: !!actions.onReset
    },
    {
      key: 'Escape',
      action: actions.onClose || (() => {}),
      description: 'Close settings',
      enabled: !!actions.onClose
    }
  ];

  return useKeyboardShortcuts({ shortcuts });
};
