import type { Knex } from '../types'

export const seed = async (knex: Knex): Promise<void> => {
  const TABLE_NAME = 'user'
  const record = await knex(TABLE_NAME).limit(1).count()
  if (record?.length > 0 && (record[0]['count'] as number) > 0) {
    return
  }

  const data = getSeeds()
  if (data.length === 0) {
    return
  }

  await knex(TABLE_NAME).insert(data)
}

const getSeeds = (): { [key: string]: any }[] => {
  if (process.env.IDP__INITIAL_USER__UUID && process.env.IDP__INITIAL_USER__NAME) {
    return [
      {
        id: process.env.IDP__INITIAL_USER__UUID,
        username: process.env.IDP__INITIAL_USER__NAME
      }
    ]
  }

  return []
}
