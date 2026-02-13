import { CreateNewGroupData, CreateNewGroupVariables, GetMyWorkoutsData, JoinGroupData, JoinGroupVariables, ListPublicGroupsData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateNewGroup(options?: useDataConnectMutationOptions<CreateNewGroupData, FirebaseError, CreateNewGroupVariables>): UseDataConnectMutationResult<CreateNewGroupData, CreateNewGroupVariables>;
export function useCreateNewGroup(dc: DataConnect, options?: useDataConnectMutationOptions<CreateNewGroupData, FirebaseError, CreateNewGroupVariables>): UseDataConnectMutationResult<CreateNewGroupData, CreateNewGroupVariables>;

export function useGetMyWorkouts(options?: useDataConnectQueryOptions<GetMyWorkoutsData>): UseDataConnectQueryResult<GetMyWorkoutsData, undefined>;
export function useGetMyWorkouts(dc: DataConnect, options?: useDataConnectQueryOptions<GetMyWorkoutsData>): UseDataConnectQueryResult<GetMyWorkoutsData, undefined>;

export function useJoinGroup(options?: useDataConnectMutationOptions<JoinGroupData, FirebaseError, JoinGroupVariables>): UseDataConnectMutationResult<JoinGroupData, JoinGroupVariables>;
export function useJoinGroup(dc: DataConnect, options?: useDataConnectMutationOptions<JoinGroupData, FirebaseError, JoinGroupVariables>): UseDataConnectMutationResult<JoinGroupData, JoinGroupVariables>;

export function useListPublicGroups(options?: useDataConnectQueryOptions<ListPublicGroupsData>): UseDataConnectQueryResult<ListPublicGroupsData, undefined>;
export function useListPublicGroups(dc: DataConnect, options?: useDataConnectQueryOptions<ListPublicGroupsData>): UseDataConnectQueryResult<ListPublicGroupsData, undefined>;
