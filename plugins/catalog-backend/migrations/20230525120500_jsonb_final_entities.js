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

// @ts-check

/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function up(knex) {
  await knex.schema.alterTable('final_entities', table => {
    table
      .jsonb('final_entity_json')
      .comment('The final entity, as a JSON object');
  });

  await knex('final_entities').update({
    final_entity_json: knex.raw(`final_entity::jsonb`),
  });

  await knex.schema.alterTable('final_entities', table => {
    table.dropColumn('final_entity');
    table.renameColumn('final_entity_json', 'final_entity');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function down(knex) {
  await knex.schema.alterTable('final_entities', table => {
    table
      .text('final_entity_text')
      .comment('The final entity, as a JSON object');
  });

  await knex('final_entities').update({
    final_entity_text: knex.raw('final_entity::text'),
  });

  await knex.schema.alterTable('final_entities', table => {
    table.dropColumn('final_entity');
    table.renameColumn('final_entity_text', 'final_entity');
  });
};
