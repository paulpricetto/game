import { defineField, defineType } from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'object',
  fields: [
    defineField({
      name: 'category',
      title: 'Category Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [{ type: 'product' }],
      validation: (Rule) => Rule.required().length(4),
    }),
  ],
  preview: {
    select: { title: 'category' },
  },
})


