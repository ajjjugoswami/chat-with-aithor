// Panel width storage utilities
const PANEL_WIDTH_KEY = 'chat-panel-widths';
const PANEL_COLLAPSED_KEY = 'chat-panel-collapsed';
const PANEL_ENABLED_KEY = 'chat-panel-enabled';
const SIDEBAR_WIDTH_KEY = 'sidebar-width';
const SIDEBAR_COLLAPSED_KEY = 'sidebar-collapsed';

interface PanelWidths {
  [modelId: string]: number;
}

interface PanelCollapsed {
  [modelId: string]: boolean;
}

interface PanelEnabled {
  [modelId: string]: boolean;
}

export function getPanelWidths(): PanelWidths {
  try {
    const stored = localStorage.getItem(PANEL_WIDTH_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function savePanelWidth(modelId: string, width: number) {
  try {
    const widths = getPanelWidths();
    widths[modelId] = width;
    localStorage.setItem(PANEL_WIDTH_KEY, JSON.stringify(widths));
  } catch {
    // Ignore localStorage errors
  }
}

export function getPanelCollapsed(): PanelCollapsed {
  try {
    const stored = localStorage.getItem(PANEL_COLLAPSED_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function savePanelCollapsed(modelId: string, collapsed: boolean) {
  try {
    const collapsedStates = getPanelCollapsed();
    collapsedStates[modelId] = collapsed;
    localStorage.setItem(PANEL_COLLAPSED_KEY, JSON.stringify(collapsedStates));
  } catch {
    // Ignore localStorage errors
  }
}

export function getPanelEnabled(): PanelEnabled {
  try {
    const stored = localStorage.getItem(PANEL_ENABLED_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function savePanelEnabled(modelId: string, enabled: boolean) {
  try {
    const enabledStates = getPanelEnabled();
    enabledStates[modelId] = enabled;
    localStorage.setItem(PANEL_ENABLED_KEY, JSON.stringify(enabledStates));
  } catch {
    // Ignore localStorage errors
  }
}

// Sidebar utilities
export function getSidebarWidth(): number {
  try {
    const stored = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return stored ? parseInt(stored, 10) : 280;
  } catch {
    return 280;
  }
}

export function saveSidebarWidth(width: number) {
  try {
    localStorage.setItem(SIDEBAR_WIDTH_KEY, width.toString());
  } catch {
    // Ignore localStorage errors
  }
}

export function getSidebarCollapsed(): boolean {
  try {
    const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    return stored ? JSON.parse(stored) : false;
  } catch {
    return false;
  }
}

export function saveSidebarCollapsed(collapsed: boolean) {
  try {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, JSON.stringify(collapsed));
  } catch {
    // Ignore localStorage errors
  }
}
