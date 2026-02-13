const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'tiizi-26',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const createNewGroupRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNewGroup', inputVars);
}
createNewGroupRef.operationName = 'CreateNewGroup';
exports.createNewGroupRef = createNewGroupRef;

exports.createNewGroup = function createNewGroup(dcOrVars, vars) {
  return executeMutation(createNewGroupRef(dcOrVars, vars));
};

const getMyWorkoutsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyWorkouts');
}
getMyWorkoutsRef.operationName = 'GetMyWorkouts';
exports.getMyWorkoutsRef = getMyWorkoutsRef;

exports.getMyWorkouts = function getMyWorkouts(dc) {
  return executeQuery(getMyWorkoutsRef(dc));
};

const joinGroupRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'JoinGroup', inputVars);
}
joinGroupRef.operationName = 'JoinGroup';
exports.joinGroupRef = joinGroupRef;

exports.joinGroup = function joinGroup(dcOrVars, vars) {
  return executeMutation(joinGroupRef(dcOrVars, vars));
};

const listPublicGroupsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPublicGroups');
}
listPublicGroupsRef.operationName = 'ListPublicGroups';
exports.listPublicGroupsRef = listPublicGroupsRef;

exports.listPublicGroups = function listPublicGroups(dc) {
  return executeQuery(listPublicGroupsRef(dc));
};
