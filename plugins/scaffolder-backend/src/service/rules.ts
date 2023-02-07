/*
 * Copyright 2022 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { makeCreatePermissionRule } from '@backstage/plugin-permission-node';
import {
  RESOURCE_TYPE_SCAFFOLDER_ACTION,
  RESOURCE_TYPE_SCAFFOLDER_TEMPLATE,
  TemplateEntityStepV1beta3,
  TemplateParameter,
} from '@backstage/plugin-scaffolder-common';
import { JsonObject, JsonValue } from '@backstage/types';
import { z } from 'zod';

export const createScaffolderActionPermissionRule = makeCreatePermissionRule<
  {
    actionId: string;
    input: JsonObject;
    template: TemplateEntityStepV1beta3 | TemplateParameter;
  },
  {},
  typeof RESOURCE_TYPE_SCAFFOLDER_ACTION
>();

export const createScaffolderTemplatePermissionRule = makeCreatePermissionRule<
  TemplateEntityStepV1beta3 | TemplateParameter,
  {},
  typeof RESOURCE_TYPE_SCAFFOLDER_TEMPLATE
>();

export const hasActionId = createScaffolderActionPermissionRule({
  name: 'HAS_ACTION_ID',
  resourceType: RESOURCE_TYPE_SCAFFOLDER_ACTION,
  description: `Match actions with the given actionId`,
  paramsSchema: z.object({
    actionId: z.string().describe('Name of the actionId to match on'),
  }),
  apply: (resource, { actionId }) => {
    return resource.actionId === actionId;
  },
  toQuery: () => ({}),
});

export const matchesInput = createScaffolderActionPermissionRule({
  name: 'MATCHED_INPUT',
  resourceType: RESOURCE_TYPE_SCAFFOLDER_ACTION,
  description: `Matches actionId and the input given`,
  paramsSchema: z.object({
    actionId: z.string().describe('Name of the actionId to match on'),

    // Pass in a json schema to validate the input against
    input: z.jsonSchema({}).describe('Input to match on'),
  }),
  apply: (resource, { actionId, input }) => {
    if (resource.actionId !== actionId) {
      return false;
    }

    for (const [key, value] of Object.entries(input)) {
      if (resource.input[key] !== value) {
        return false;
      }
    }

    return true;
  },
  toQuery: () => ({}),
});

export const hasTag = createScaffolderTemplatePermissionRule({
  name: 'HAS_TAG',
  resourceType: RESOURCE_TYPE_SCAFFOLDER_TEMPLATE,
  description: `Match parameters or steps with the given tag`,
  paramsSchema: z.object({
    tag: z.string().describe('Name of the tag to match on'),
  }),
  apply: (resource, { tag }) => {
    return resource['backstage:accessControl']?.tags?.includes(tag) ?? false;
  },
  toQuery: () => ({}),
});

export const scaffolderStepRules = { hasTag };
