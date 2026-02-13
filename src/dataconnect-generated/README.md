# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetMyWorkouts*](#getmyworkouts)
  - [*ListPublicGroups*](#listpublicgroups)
- [**Mutations**](#mutations)
  - [*CreateNewGroup*](#createnewgroup)
  - [*JoinGroup*](#joingroup)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetMyWorkouts
You can execute the `GetMyWorkouts` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMyWorkouts(): QueryPromise<GetMyWorkoutsData, undefined>;

interface GetMyWorkoutsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyWorkoutsData, undefined>;
}
export const getMyWorkoutsRef: GetMyWorkoutsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyWorkouts(dc: DataConnect): QueryPromise<GetMyWorkoutsData, undefined>;

interface GetMyWorkoutsRef {
  ...
  (dc: DataConnect): QueryRef<GetMyWorkoutsData, undefined>;
}
export const getMyWorkoutsRef: GetMyWorkoutsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyWorkoutsRef:
```typescript
const name = getMyWorkoutsRef.operationName;
console.log(name);
```

### Variables
The `GetMyWorkouts` query has no variables.
### Return Type
Recall that executing the `GetMyWorkouts` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyWorkoutsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMyWorkoutsData {
  workouts: ({
    id: UUIDString;
    workoutType: string;
    durationMinutes: number;
    loggedAt: TimestampString;
  } & Workout_Key)[];
}
```
### Using `GetMyWorkouts`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyWorkouts } from '@dataconnect/generated';


// Call the `getMyWorkouts()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyWorkouts();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyWorkouts(dataConnect);

console.log(data.workouts);

// Or, you can use the `Promise` API.
getMyWorkouts().then((response) => {
  const data = response.data;
  console.log(data.workouts);
});
```

### Using `GetMyWorkouts`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyWorkoutsRef } from '@dataconnect/generated';


// Call the `getMyWorkoutsRef()` function to get a reference to the query.
const ref = getMyWorkoutsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyWorkoutsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.workouts);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.workouts);
});
```

## ListPublicGroups
You can execute the `ListPublicGroups` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listPublicGroups(): QueryPromise<ListPublicGroupsData, undefined>;

interface ListPublicGroupsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPublicGroupsData, undefined>;
}
export const listPublicGroupsRef: ListPublicGroupsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listPublicGroups(dc: DataConnect): QueryPromise<ListPublicGroupsData, undefined>;

interface ListPublicGroupsRef {
  ...
  (dc: DataConnect): QueryRef<ListPublicGroupsData, undefined>;
}
export const listPublicGroupsRef: ListPublicGroupsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listPublicGroupsRef:
```typescript
const name = listPublicGroupsRef.operationName;
console.log(name);
```

### Variables
The `ListPublicGroups` query has no variables.
### Return Type
Recall that executing the `ListPublicGroups` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListPublicGroupsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListPublicGroupsData {
  groups: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    groupGoal?: string | null;
  } & Group_Key)[];
}
```
### Using `ListPublicGroups`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listPublicGroups } from '@dataconnect/generated';


// Call the `listPublicGroups()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listPublicGroups();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listPublicGroups(dataConnect);

console.log(data.groups);

// Or, you can use the `Promise` API.
listPublicGroups().then((response) => {
  const data = response.data;
  console.log(data.groups);
});
```

### Using `ListPublicGroups`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listPublicGroupsRef } from '@dataconnect/generated';


// Call the `listPublicGroupsRef()` function to get a reference to the query.
const ref = listPublicGroupsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listPublicGroupsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.groups);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.groups);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateNewGroup
You can execute the `CreateNewGroup` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createNewGroup(vars: CreateNewGroupVariables): MutationPromise<CreateNewGroupData, CreateNewGroupVariables>;

interface CreateNewGroupRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNewGroupVariables): MutationRef<CreateNewGroupData, CreateNewGroupVariables>;
}
export const createNewGroupRef: CreateNewGroupRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createNewGroup(dc: DataConnect, vars: CreateNewGroupVariables): MutationPromise<CreateNewGroupData, CreateNewGroupVariables>;

interface CreateNewGroupRef {
  ...
  (dc: DataConnect, vars: CreateNewGroupVariables): MutationRef<CreateNewGroupData, CreateNewGroupVariables>;
}
export const createNewGroupRef: CreateNewGroupRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createNewGroupRef:
```typescript
const name = createNewGroupRef.operationName;
console.log(name);
```

### Variables
The `CreateNewGroup` mutation requires an argument of type `CreateNewGroupVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateNewGroupVariables {
  name: string;
  description?: string | null;
  groupGoal?: string | null;
}
```
### Return Type
Recall that executing the `CreateNewGroup` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateNewGroupData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateNewGroupData {
  group_insert: Group_Key;
}
```
### Using `CreateNewGroup`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createNewGroup, CreateNewGroupVariables } from '@dataconnect/generated';

// The `CreateNewGroup` mutation requires an argument of type `CreateNewGroupVariables`:
const createNewGroupVars: CreateNewGroupVariables = {
  name: ..., 
  description: ..., // optional
  groupGoal: ..., // optional
};

// Call the `createNewGroup()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createNewGroup(createNewGroupVars);
// Variables can be defined inline as well.
const { data } = await createNewGroup({ name: ..., description: ..., groupGoal: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createNewGroup(dataConnect, createNewGroupVars);

console.log(data.group_insert);

// Or, you can use the `Promise` API.
createNewGroup(createNewGroupVars).then((response) => {
  const data = response.data;
  console.log(data.group_insert);
});
```

### Using `CreateNewGroup`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createNewGroupRef, CreateNewGroupVariables } from '@dataconnect/generated';

// The `CreateNewGroup` mutation requires an argument of type `CreateNewGroupVariables`:
const createNewGroupVars: CreateNewGroupVariables = {
  name: ..., 
  description: ..., // optional
  groupGoal: ..., // optional
};

// Call the `createNewGroupRef()` function to get a reference to the mutation.
const ref = createNewGroupRef(createNewGroupVars);
// Variables can be defined inline as well.
const ref = createNewGroupRef({ name: ..., description: ..., groupGoal: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createNewGroupRef(dataConnect, createNewGroupVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.group_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.group_insert);
});
```

## JoinGroup
You can execute the `JoinGroup` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
joinGroup(vars: JoinGroupVariables): MutationPromise<JoinGroupData, JoinGroupVariables>;

interface JoinGroupRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: JoinGroupVariables): MutationRef<JoinGroupData, JoinGroupVariables>;
}
export const joinGroupRef: JoinGroupRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
joinGroup(dc: DataConnect, vars: JoinGroupVariables): MutationPromise<JoinGroupData, JoinGroupVariables>;

interface JoinGroupRef {
  ...
  (dc: DataConnect, vars: JoinGroupVariables): MutationRef<JoinGroupData, JoinGroupVariables>;
}
export const joinGroupRef: JoinGroupRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the joinGroupRef:
```typescript
const name = joinGroupRef.operationName;
console.log(name);
```

### Variables
The `JoinGroup` mutation requires an argument of type `JoinGroupVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface JoinGroupVariables {
  groupId: UUIDString;
}
```
### Return Type
Recall that executing the `JoinGroup` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `JoinGroupData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface JoinGroupData {
  membership_insert: Membership_Key;
}
```
### Using `JoinGroup`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, joinGroup, JoinGroupVariables } from '@dataconnect/generated';

// The `JoinGroup` mutation requires an argument of type `JoinGroupVariables`:
const joinGroupVars: JoinGroupVariables = {
  groupId: ..., 
};

// Call the `joinGroup()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await joinGroup(joinGroupVars);
// Variables can be defined inline as well.
const { data } = await joinGroup({ groupId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await joinGroup(dataConnect, joinGroupVars);

console.log(data.membership_insert);

// Or, you can use the `Promise` API.
joinGroup(joinGroupVars).then((response) => {
  const data = response.data;
  console.log(data.membership_insert);
});
```

### Using `JoinGroup`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, joinGroupRef, JoinGroupVariables } from '@dataconnect/generated';

// The `JoinGroup` mutation requires an argument of type `JoinGroupVariables`:
const joinGroupVars: JoinGroupVariables = {
  groupId: ..., 
};

// Call the `joinGroupRef()` function to get a reference to the mutation.
const ref = joinGroupRef(joinGroupVars);
// Variables can be defined inline as well.
const ref = joinGroupRef({ groupId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = joinGroupRef(dataConnect, joinGroupVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.membership_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.membership_insert);
});
```

