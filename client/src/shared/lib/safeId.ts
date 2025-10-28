export function generateSafeId(prefix = 'id'): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    return `${prefix}-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
}

