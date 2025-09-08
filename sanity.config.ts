import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { schema } from './sanity/schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Pricetto Content',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  plugins: [deskTool()],
  schema,
})



