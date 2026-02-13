import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'tiizi-26',
  location: 'us-east4'
};

export const createNewGroupRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNewGroup', inputVars);
}
createNewGroupRef.operationName = 'CreateNewGroup';

export function createNewGroup(dcOrVars, vars) {
  return executeMutation(createNewGroupRef(dcOrVars, vars));
}

export const getMyWorkoutsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyWorkouts');
}
getMyWorkoutsRef.operationName = 'GetMyWorkouts';

export function getMyWorkouts(dc) {
  return executeQuery(getMyWorkoutsRef(dc));
}

export const joinGroupRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'JoinGroup', inputVars);
}
joinGroupRef.operationName = 'JoinGroup';

export function joinGroup(dcOrVars, vars) {
  return executeMutation(joinGroupRef(dcOrVars, vars));
}

export const listPublicGroupsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPublicGroups');
}
listPublicGroupsRef.operationName = 'ListPublicGroups';

export function listPublicGroups(dc) {
  return executeQuery(listPublicGroupsRef(dc));
}

