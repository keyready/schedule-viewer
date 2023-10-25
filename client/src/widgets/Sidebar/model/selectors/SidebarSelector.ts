import { StateSchema } from 'app/providers/StoreProvider';

export const getIsSidebarCollapsed = (state: StateSchema) => state.sidebar.data.isCollapsed;
