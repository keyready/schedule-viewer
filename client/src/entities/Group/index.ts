export type { Group } from './model/types/Group';
export type { GroupSchema } from './model/types/GroupSchema';
export { GroupActions, GroupReducer } from './model/slice/GroupSlice';
export { getGroupData, getGroupIsLoading, getGroupError } from './model/selectors/GroupSelectors';
export { fetchGroups } from './model/services/fetchGroups';
export { useGroups } from './api/fetchGroupsApi';

export { GroupCard } from './ui/GroupCard/GroupCard';
export { GroupList } from './ui/GroupList/GroupList';
export { CurrentDayGroupCard } from './ui/CurrentDayGroupCard/CurrentDayGroupCard';
