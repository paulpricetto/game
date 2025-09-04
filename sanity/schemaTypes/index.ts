import { type SchemaTypeDefinition } from 'sanity'

import { dailyPuzzle } from './dailyPuzzle'
import { category } from './category'
import { product } from './product'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [dailyPuzzle, category, product],
}


