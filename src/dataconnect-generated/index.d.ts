import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Comment_Key {
  id: UUIDString;
  __typename?: 'Comment_Key';
}

export interface CreateNewGroupData {
  group_insert: Group_Key;
}

export interface CreateNewGroupVariables {
  name: string;
  description?: string | null;
  groupGoal?: string | null;
}

export interface GetMyWorkoutsData {
  workouts: ({
    id: UUIDString;
    workoutType: string;
    durationMinutes: number;
    loggedAt: TimestampString;
  } & Workout_Key)[];
}

export interface Group_Key {
  id: UUIDString;
  __typename?: 'Group_Key';
}

export interface JoinGroupData {
  membership_insert: Membership_Key;
}

export interface JoinGroupVariables {
  groupId: UUIDString;
}

export interface ListPublicGroupsData {
  groups: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    groupGoal?: string | null;
  } & Group_Key)[];
}

export interface Membership_Key {
  userId: UUIDString;
  groupId: UUIDString;
  __typename?: 'Membership_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

export interface Workout_Key {
  id: UUIDString;
  __typename?: 'Workout_Key';
}

interface CreateNewGroupRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNewGroupVariables): MutationRef<CreateNewGroupData, CreateNewGroupVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateNewGroupVariables): MutationRef<CreateNewGroupData, CreateNewGroupVariables>;
  operationName: string;
}
export const createNewGroupRef: CreateNewGroupRef;

export function createNewGroup(vars: CreateNewGroupVariables): MutationPromise<CreateNewGroupData, CreateNewGroupVariables>;
export function createNewGroup(dc: DataConnect, vars: CreateNewGroupVariables): MutationPromise<CreateNewGroupData, CreateNewGroupVariables>;

interface GetMyWorkoutsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyWorkoutsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyWorkoutsData, undefined>;
  operationName: string;
}
export const getMyWorkoutsRef: GetMyWorkoutsRef;

export function getMyWorkouts(): QueryPromise<GetMyWorkoutsData, undefined>;
export function getMyWorkouts(dc: DataConnect): QueryPromise<GetMyWorkoutsData, undefined>;

interface JoinGroupRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: JoinGroupVariables): MutationRef<JoinGroupData, JoinGroupVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: JoinGroupVariables): MutationRef<JoinGroupData, JoinGroupVariables>;
  operationName: string;
}
export const joinGroupRef: JoinGroupRef;

export function joinGroup(vars: JoinGroupVariables): MutationPromise<JoinGroupData, JoinGroupVariables>;
export function joinGroup(dc: DataConnect, vars: JoinGroupVariables): MutationPromise<JoinGroupData, JoinGroupVariables>;

interface ListPublicGroupsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPublicGroupsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListPublicGroupsData, undefined>;
  operationName: string;
}
export const listPublicGroupsRef: ListPublicGroupsRef;

export function listPublicGroups(): QueryPromise<ListPublicGroupsData, undefined>;
export function listPublicGroups(dc: DataConnect): QueryPromise<ListPublicGroupsData, undefined>;

